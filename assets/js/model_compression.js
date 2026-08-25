(function () {
  "use strict";

  const N = 16;
  const STUDENT_SIZE = 10;
  const OFFSET = (N - STUDENT_SIZE) / 2;
  const TEACHER_B = 7;
  const STUDENT_B = TEACHER_B * ((STUDENT_SIZE * STUDENT_SIZE) / (N * N));
  const BANDWIDTH = 1600;
  const COMPUTE_MS_PER_B = 0.9;
  const TOKENS = "A smaller model that fits in cache answers you before you finish reading the question .".split(" ");
  const BITS = [
    { bits: 32, label: "FP32", levels: 48, speed: 1, qualityCost: 0 },
    { bits: 16, label: "FP16", levels: 26, speed: 1.8, qualityCost: 0.3 },
    { bits: 8, label: "INT8", levels: 10, speed: 3, qualityCost: 1.4 },
    { bits: 4, label: "INT4", levels: 4, speed: 3.6, qualityCost: 5.5 }
  ];

  function seededRandom(seed) {
    let value = seed;
    return function () {
      value = (value * 1664525 + 1013904223) % 4294967296;
      return value / 4294967296;
    };
  }

  function fixedWeights() {
    const random = seededRandom(20260820);
    return Array.from({ length: N * N }, function () {
      const value = (random() + random() + random()) / 3;
      return Math.min(1, Math.max(0.03, value * 1.25));
    });
  }

  function format(value, digits) {
    return Number(value).toFixed(digits);
  }

  function initialize(root) {
    if (root.dataset.initialized === "true") return;
    root.dataset.initialized = "true";

    const state = {
      distilled: false,
      sparsity: 0,
      healed: false,
      tuned: false,
      bitIdx: 0,
      optimized: false
    };
    const weights = fixedWeights();
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tokenTimer;

    const one = function (selector) { return root.querySelector(selector); };
    const all = function (selector) { return Array.from(root.querySelectorAll(selector)); };

    function setText(selector, value) {
      const element = one(selector);
      if (element) element.textContent = value;
    }

    function setPressedStates() {
      all('[data-control="toggle"]').forEach(function (button) {
        const pressed = state[button.dataset.action] === (button.dataset.value === "true");
        button.setAttribute("aria-pressed", String(pressed));
      });
      all('[data-control="bits"]').forEach(function (button) {
        button.setAttribute("aria-pressed", String(Number(button.dataset.bit) === state.bitIdx));
      });
    }

    function drawWeights(quantization) {
      const grid = one("[data-weight-grid]");
      if (!grid) return;

      const inStudent = function (index) {
        const row = Math.floor(index / N);
        const column = index % N;
        return !state.distilled || (
          row >= OFFSET && row < OFFSET + STUDENT_SIZE &&
          column >= OFFSET && column < OFFSET + STUDENT_SIZE
        );
      };

      const live = weights
        .map(function (magnitude, index) { return { index: index, magnitude: magnitude }; })
        .filter(function (cell) { return inStudent(cell.index); });
      const cutCount = Math.round(live.length * state.sparsity);
      const cut = live.slice().sort(function (a, b) { return a.magnitude - b.magnitude; }).slice(0, cutCount);
      const cutSet = new Set(cut.map(function (cell) { return cell.index; }));
      const fragment = document.createDocumentFragment();

      weights.forEach(function (magnitude, index) {
        const cell = document.createElement("span");
        cell.className = "mc-weight-cell";
        cell.setAttribute("aria-hidden", "true");

        if (!inStudent(index)) {
          cell.classList.add("mc-weight-cell-gone");
        } else if (cutSet.has(index)) {
          cell.classList.add("mc-weight-cell-pruned");
        } else {
          let value = magnitude;
          if (state.healed && state.sparsity > 0) value += (1 - value) * 0.3;
          value = Math.round(value * (quantization.levels - 1)) / (quantization.levels - 1);
          cell.classList.add("mc-weight-cell-live");
          cell.style.setProperty("--mc-weight", format(value, 3));
        }
        fragment.appendChild(cell);
      });

      grid.replaceChildren(fragment);
      const adapter = one("[data-adapter]");
      if (adapter) adapter.classList.toggle("is-active", state.tuned);
    }

    function restartTokenStream(latency) {
      const output = one("[data-token-output]");
      if (!output) return;
      window.clearInterval(tokenTimer);

      let count = reduceMotion ? TOKENS.length : 0;
      function paint() {
        output.textContent = TOKENS.slice(0, count).join(" ");
        if (count < TOKENS.length) {
          const cursor = document.createElement("span");
          cursor.className = "mc-token-cursor";
          cursor.setAttribute("aria-hidden", "true");
          cursor.textContent = "▌";
          output.appendChild(cursor);
        }
      }
      paint();

      if (!reduceMotion) {
        const step = Math.max(45, Math.min(260, latency * 2));
        tokenTimer = window.setInterval(function () {
          count += 1;
          paint();
          if (count >= TOKENS.length) window.clearInterval(tokenTimer);
        }, step);
      }
    }

    function render() {
      const quantization = BITS[state.bitIdx];
      const baseParameters = state.distilled ? STUDENT_B : TEACHER_B;
      const parameters = baseParameters * (1 - state.sparsity);
      const parametersRun = state.optimized ? parameters : baseParameters;
      const memory = parameters * (quantization.bits / 8);
      const memoryRun = parametersRun * (quantization.bits / 8);
      const memoryTime = (memoryRun / BANDWIDTH) * 1000;
      const computeTime = (parametersRun * COMPUTE_MS_PER_B) / quantization.speed;
      const overheadTime = state.optimized ? 0.8 : 4.5;
      const latency = memoryTime + computeTime + overheadTime;
      const tokensPerSecond = 1000 / latency;

      const pruningLoss = Math.pow(state.sparsity, 1.8) * 45;
      const quantizationLoss = quantization.qualityCost;
      const recovered = state.healed ? (0.65 * pruningLoss) + (0.6 * quantizationLoss) : 0;
      const quality = Math.max(0, 100 - (state.distilled ? 4 : 0) - pruningLoss - quantizationLoss + recovered);
      const taskFit = state.tuned ? Math.min(96, 42 + quality * 0.55) : 41 * (quality / 100);

      drawWeights(quantization);
      setPressedStates();

      setText('[data-stat="params"]', format(parameters, 2));
      setText('[data-stat="memory"]', format(memory, 1));
      setText('[data-stat="latency"]', format(latency, 1));
      setText('[data-stat="quality"]', format(quality, 0));
      setText('[data-note="memory"]', quantization.label + " · " + quantization.bits + " bits each");
      setText('[data-note="latency"]', format(tokensPerSecond, 0) + " tokens per second");
      setText('[data-note="quality"]', "task fit " + format(taskFit, 0) + "%");

      setText('[data-time="memory"]', format(memoryTime, 1));
      setText('[data-time="compute"]', format(computeTime, 1));
      setText('[data-time="overhead"]', format(overheadTime, 1));

      const total = Math.max(latency, 0.001);
      one('[data-bar="memory"]').style.width = ((memoryTime / total) * 100) + "%";
      one('[data-bar="compute"]').style.width = ((computeTime / total) * 100) + "%";
      one('[data-bar="overhead"]').style.width = ((overheadTime / total) * 100) + "%";

      const qualityCard = one("[data-quality-tone]");
      if (qualityCard) qualityCard.dataset.qualityTone = quality > 90 ? "high" : quality > 75 ? "medium" : "low";

      setText('[data-status="distilled"]', state.distilled ? "student 2.73B" : "teacher 7B");
      setText('[data-status="sparsity"]', Math.round(state.sparsity * 100) + "% removed");
      setText('[data-status="healed"]', state.healed ? "retrained" : "raw");
      setText('[data-status="tuned"]', state.tuned ? "task fit " + format(taskFit, 0) + "%" : "general");
      setText('[data-status="bits"]', quantization.label);
      setText('[data-status="optimized"]', state.optimized ? "sparse-aware" : "dense kernel");
      setText("[data-sparsity-output]", Math.round(state.sparsity * 100) + "%");

      const warning = one("[data-sparse-warning]");
      if (warning) warning.hidden = !(state.sparsity > 0 && !state.optimized);

      setText(
        "[data-token-note]",
        TOKENS.length + " tokens in " + format((TOKENS.length * latency) / 1000, 2) +
        " s at this setting. Playback is slowed enough to remain visible."
      );
      restartTokenStream(latency);
    }

    root.addEventListener("click", function (event) {
      const control = event.target.closest("[data-control]");
      if (!control || !root.contains(control)) return;

      if (control.dataset.control === "reset") {
        state.distilled = false;
        state.sparsity = 0;
        state.healed = false;
        state.tuned = false;
        state.bitIdx = 0;
        state.optimized = false;
        const range = one('[data-control="sparsity"]');
        if (range) range.value = "0";
        render();
      } else if (control.dataset.control === "toggle") {
        state[control.dataset.action] = control.dataset.value === "true";
        render();
      } else if (control.dataset.control === "bits") {
        state.bitIdx = Number(control.dataset.bit);
        render();
      }
    });

    const sparsity = one('[data-control="sparsity"]');
    if (sparsity) {
      sparsity.addEventListener("input", function (event) {
        state.sparsity = Number(event.target.value);
        render();
      });
    }

    render();
  }

  function start() {
    document.querySelectorAll("[data-compression-figure]").forEach(initialize);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
}());
