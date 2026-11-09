// Keep the hero stable while mobile browser controls expand and collapse.
if (!CSS.supports("height", "100svh")) {
  const syncViewportHeight = () => {
    document.documentElement.style.setProperty("--viewport-height", `${window.innerHeight}px`);
  };
  syncViewportHeight();
  window.addEventListener("resize", syncViewportHeight, { passive: true });
}

// Restore the page canvas that keeps Safari's bottom area dark at the footer.
// A separate fixed sky edge in CSS owns the top status-bar color on touch devices.
const footer = document.querySelector(".site-footer, .footer");
const landing = document.querySelector(".landing");
let scheduled = false;
let currentColor;

const syncBrowserColor = () => {
  scheduled = false;
  if (!footer || !landing) return;

  // The hero uses 100svh, so its height stays fixed as Safari's toolbar moves.
  // Use that stable reference, not visualViewport.height or the footer bottom.
  const footerDepth = window.scrollY + landing.offsetHeight - footer.offsetTop;
  // Enter after 32px of footer; stay dark until it leaves the stable viewport.
  // The separate return threshold also prevents flicker from scroll bounce.
  const footerVisible = currentColor === "#0c0d0e" ? footerDepth > 0 : footerDepth >= 32;
  const color = footerVisible ? "#0c0d0e" : "#91c9f7";
  if (color === currentColor) return;
  currentColor = color;
  document.documentElement.style.setProperty("--browser-edge", color);
};

const scheduleBrowserColor = () => {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(syncBrowserColor);
};

syncBrowserColor();
window.addEventListener("scroll", scheduleBrowserColor, { passive: true });
window.addEventListener("resize", scheduleBrowserColor, { passive: true });
window.addEventListener("pageshow", scheduleBrowserColor);
