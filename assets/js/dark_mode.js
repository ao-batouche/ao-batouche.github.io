document.addEventListener("DOMContentLoaded", function () {
  setTheme(document.documentElement.getAttribute("data-theme") || "light", false);
  const toggle = document.getElementById("light-toggle");
  if (toggle) toggle.addEventListener("click", function () {
    setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });
});

