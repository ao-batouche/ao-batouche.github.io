$(document).ready(function() {
  // Citation details also work with keyboard focus and touch, not only hover.
  document.querySelectorAll(".scholar-info").forEach(info => {
    const button = info.querySelector(".scholar-info-button");
    const dismiss = () => {
      info.classList.remove("is-open");
      info.classList.add("is-dismissed");
    };
    ["mouseenter", "focusin"].forEach(event => {
      info.addEventListener(event, () => info.classList.remove("is-dismissed"));
    });
    button.addEventListener("click", () => {
      if (info.classList.contains("is-open")) dismiss();
      else {
        info.classList.remove("is-dismissed");
        info.classList.add("is-open");
      }
    });
    info.addEventListener("focusout", event => {
      if (!info.contains(event.relatedTarget)) dismiss();
    });
    document.addEventListener("pointerdown", event => {
      if (!info.contains(event.target)) dismiss();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") dismiss();
    });
  });

  // Disclosure buttons support mouse, touch, Enter, and Space.
  document.querySelectorAll("button.publication-toggle").forEach(button => {
    button.addEventListener("click", () => {
      const panel = document.getElementById(button.getAttribute("aria-controls"));
      const open = button.getAttribute("aria-expanded") !== "true";
      button.closest(".links").querySelectorAll("button.publication-toggle").forEach(other => {
        other.setAttribute("aria-expanded", "false");
        const otherPanel = document.getElementById(other.getAttribute("aria-controls"));
        if (otherPanel) { otherPanel.hidden = true; otherPanel.classList.remove("open"); }
      });
      if (panel) {
        panel.hidden = !open;
        panel.classList.toggle("open", open);
        button.setAttribute("aria-expanded", String(open));
      }
    });
  });

  // Escape closes the mobile menu and returns focus to its toggle.
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && document.querySelector("#navbarNav.show")) {
      $("#navbarNav").collapse("hide");
      document.querySelector(".navbar-toggler").focus();
    }
  });

  // bootstrap-toc
  if($('#toc-sidebar').length){
    var navSelector = "#toc-sidebar";
    var $myNav = $(navSelector);
    Toc.init($myNav);
    $("body").scrollspy({
      target: navSelector,
    });
  }

  const jupyterIframes = $('.jupyter-notebook-iframe-container iframe');
  if (!jupyterIframes.length) {
    return;
  }

  let theme = document.documentElement.getAttribute("data-theme");
  if (theme == null || theme == "null") {
    const userPref = window.matchMedia;
    if (userPref && userPref("(prefers-color-scheme: dark)").matches) {
      theme = "dark";
    }
  }

  jupyterIframes.each(function() {
    const cssLink = document.createElement("link");
    cssLink.href = "../css/jupyter.css";
    cssLink.rel = "stylesheet";
    cssLink.type = "text/css";

    $(this).contents().find("head").append(cssLink);

    if (theme == "dark") {
      $(this).bind("load",function(){
        $(this).contents().find("body").attr({
          "data-jp-theme-light": "false",
          "data-jp-theme-name": "JupyterLab Dark"});
      });
    }
  });
});
