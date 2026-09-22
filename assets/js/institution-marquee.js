// Use the native scroll position for both automatic motion and manual browsing.
document.querySelectorAll(".institution-marquee-section").forEach(section => {
  const scroller = section.querySelector(".institution-marquee");
  const firstSet = scroller.querySelector(".institution-logo-set");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let hovered = false;
  let interactingUntil = 0;
  let pointer = null;
  let suppressClick = false;
  let previousTime = null;
  let remainder = 0;
  let frame = null;
  let visible = true;
  let cycleWidth = firstSet.getBoundingClientRect().width;

  scroller.classList.add("is-draggable");

  const hold = () => { interactingUntil = performance.now() + 1500; };
  const move = distance => {
    hold();
    // Manual scrolling can cross the loop boundary in either direction.
    if (!reducedMotion.matches && cycleWidth > scroller.clientWidth) {
      const next = scroller.scrollLeft + distance;
      if (next < 0 || next >= cycleWidth) {
        scroller.scrollLeft = ((next % cycleWidth) + cycleWidth) % cycleWidth;
        return;
      }
    }
    scroller.scrollLeft += distance;
  };

  scroller.addEventListener("pointerenter", event => {
    if (event.pointerType === "mouse") hovered = true;
  });

  scroller.addEventListener("wheel", event => {
    if (event.ctrlKey) return; // Preserve browser pinch-to-zoom.
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (!delta || scroller.scrollWidth <= scroller.clientWidth) return;
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? scroller.clientWidth : 1;
    event.preventDefault();
    move(delta * unit);
  }, { passive: false });

  scroller.addEventListener("keydown", event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      move((event.key === "ArrowRight" ? 1 : -1) * 168);
    }
  });

  scroller.addEventListener("pointerdown", event => {
    hold();
    suppressClick = false;
    // Touch and pen keep native scrolling and momentum.
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    pointer = { id: event.pointerId, x: event.clientX, left: scroller.scrollLeft, dragging: false };
  });
  scroller.addEventListener("pointermove", event => {
    if (!pointer || event.pointerId !== pointer.id) return;
    const distance = event.clientX - pointer.x;
    if (!pointer.dragging && Math.abs(distance) < 5) return;
    pointer.dragging = true;
    suppressClick = true;
    scroller.setPointerCapture(event.pointerId);
    scroller.classList.add("is-dragging");
    scroller.scrollLeft = pointer.left - distance;
    hold();
  });
  const release = event => {
    if (!pointer || event.pointerId !== pointer.id) return;
    if (scroller.hasPointerCapture(pointer.id)) scroller.releasePointerCapture(pointer.id);
    pointer = null;
    scroller.classList.remove("is-dragging");
    hold();
  };
  ["pointerup", "pointercancel", "lostpointercapture"].forEach(type => scroller.addEventListener(type, release));
  scroller.addEventListener("pointerleave", event => {
    if (pointer && !pointer.dragging) release(event);
    if (event.pointerType === "mouse") {
      hovered = false;
      interactingUntil = 0;
    }
  });
  scroller.addEventListener("click", event => {
    if (suppressClick) {
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    }
  }, true);
  scroller.addEventListener("dragstart", event => event.preventDefault());
  scroller.addEventListener("touchmove", hold, { passive: true });
  scroller.addEventListener("touchend", hold, { passive: true });

  const animate = time => {
    frame = null;
    const elapsed = previousTime === null ? 0 : Math.min(time - previousTime, 50);
    previousTime = time;
    // Keyboard focus pauses motion; focus left by a mouse drag must not prevent resuming.
    const keyboardFocused = scroller.matches(":focus-visible") || scroller.querySelector(":focus-visible");
    if (!hovered && !pointer && !keyboardFocused && time >= interactingUntil) {
      // Match the original 55-second circuit, accumulating subpixel movement.
      remainder += elapsed * cycleWidth / 55000;
      const distance = Math.floor(remainder);
      remainder -= distance;
      if (distance && cycleWidth > scroller.clientWidth) {
        scroller.scrollLeft = (scroller.scrollLeft + distance) % cycleWidth;
      }
    } else {
      remainder = 0;
    }
    frame = requestAnimationFrame(animate);
  };

  const updateAnimation = () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    previousTime = null;
    if (!reducedMotion.matches && visible && !document.hidden) frame = requestAnimationFrame(animate);
  };
  new ResizeObserver(() => { cycleWidth = firstSet.getBoundingClientRect().width; }).observe(firstSet);
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    updateAnimation();
  }).observe(scroller);
  reducedMotion.addEventListener("change", updateAnimation);
  document.addEventListener("visibilitychange", updateAnimation);
  updateAnimation();
});
