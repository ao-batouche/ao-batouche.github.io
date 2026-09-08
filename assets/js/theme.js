// Apply the theme before first paint; browser storage may be unavailable.
function savedTheme() {
  try {
    const value = localStorage.getItem("theme");
    return value === "dark" || value === "light" ? value : null;
  } catch (_) {
    return null;
  }
}

function setTheme(theme, persist = true) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = theme;
  if (persist) {
    try { localStorage.setItem("theme", theme); } catch (_) {}
  }
  ["light", "dark"].forEach(mode => {
    const stylesheet = document.getElementById("highlight_theme_" + mode);
    if (stylesheet) stylesheet.media = mode === theme ? "" : "none";
  });
  document.querySelectorAll("table").forEach(table => table.classList.toggle("table-dark", theme === "dark"));
  const toggle = document.getElementById("light-toggle");
  if (toggle) {
    const label = "Switch to " + (theme === "dark" ? "light" : "dark") + " theme";
    toggle.setAttribute("aria-label", label);
    toggle.title = label;
  }
  const comments = document.querySelector("iframe.giscus-frame");
  if (comments) comments.contentWindow.postMessage({giscus: {setConfig: {theme}}}, "https://giscus.app");
  if (typeof medium_zoom !== "undefined") {
    medium_zoom.update({background: getComputedStyle(document.documentElement).getPropertyValue("--global-bg-color").trim() + "ee"});
  }
  document.querySelectorAll(".jupyter-notebook-iframe-container iframe").forEach(frame => {
    try {
      const body = frame.contentDocument?.body;
      if (body) {
        body.setAttribute("data-jp-theme-light", String(theme !== "dark"));
        body.setAttribute("data-jp-theme-name", "JupyterLab " + (theme === "dark" ? "Dark" : "Light"));
      }
    } catch (_) { /* Cross-origin notebooks manage their own theme. */ }
  });
}

const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)");
setTheme(savedTheme() || (preferredTheme.matches ? "dark" : "light"), false);
preferredTheme.addEventListener("change", event => {
  if (!savedTheme()) setTheme(event.matches ? "dark" : "light", false);
});
