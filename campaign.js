// Tag App Store downloads with where the visitor came from.
// helloping.ai/?ref=ig_kendall sends the download button to the App Store with
// ct=ig_kendall, so App Store Connect (Analytics → Campaigns) credits the
// download to that tag. Any ref works; no ref counts as "website".
// The ref is kept for the rest of the visit, so moving to another page and
// back keeps it.
(() => {
  const APP_STORE = "https://apps.apple.com/app/apple-store/id6764042802";
  const PROVIDER_TOKEN = "129186659";
  const STORAGE_KEY = "ping-ref";

  // Lowercase, so ig_Kendall and ig_kendall are one campaign; Apple caps the
  // campaign token at 30 characters.
  const normalize = value => {
    const ref = (value ?? "").trim().toLowerCase();
    return /^[a-z0-9_.-]{1,30}$/.test(ref) ? ref : "";
  };

  let ref = normalize(new URLSearchParams(window.location.search).get("ref"));
  try {
    if (ref) sessionStorage.setItem(STORAGE_KEY, ref);
    else ref = normalize(sessionStorage.getItem(STORAGE_KEY));
  } catch {
    // Storage can be blocked (private mode); the ref in the URL still counts.
  }

  const link = `${APP_STORE}?pt=${PROVIDER_TOKEN}&ct=${ref || "website"}&mt=8`;
  document.querySelectorAll("a[data-app-store]").forEach(anchor => {
    anchor.href = link;
  });
})();
