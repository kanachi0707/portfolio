const INSTAGRAM_JSON_PATH = "./instagram-latest.json";
const INSTAGRAM_FALLBACK_URL = "https://www.instagram.com/p/DVM3FVxErTp/";

const menuButton = document.querySelector(".menu-button");
const siteNav = document.querySelector(".site-nav");
const currentYear = document.getElementById("current-year");
const revealItems = document.querySelectorAll(".reveal");
const instagramSlots = document.querySelectorAll(".instagram-live-slot");
const footerMessagesLink = document.getElementById("footer-messages-link");

const messagePages = [
  "./words-help-ever.html",
  "./words-interpretations.html",
  "./words-existence.html",
];

if (footerMessagesLink) {
  footerMessagesLink.addEventListener("click", (event) => {
    event.preventDefault();
    const randomIndex = Math.floor(Math.random() * messagePages.length);
    window.location.href = messagePages[randomIndex];
  });
}
if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

if (menuButton && siteNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    entry.target.classList.add("is-visible");
    observer.unobserve(entry.target);
  });
}, {
  threshold: 0.18,
});

revealItems.forEach((item, index) => {
  item.style.setProperty("--delay", `${index * 0.08}s`);
  observer.observe(item);
});

loadInstagramPost();

async function loadInstagramPost() {
  const fallbackData = {
    url: INSTAGRAM_FALLBACK_URL,
    caption: "",
    fallbackUrl: INSTAGRAM_FALLBACK_URL,
    isFallback: true,
  };

  const embeddedData = window.__INSTAGRAM_LATEST_POST__;
  if (embeddedData && typeof embeddedData === "object") {
    renderInstagramSlots(normalizeInstagramData(embeddedData, fallbackData));
    return;
  }

  try {
    const response = await fetch(INSTAGRAM_JSON_PATH, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load JSON: ${response.status}`);
    }

    const data = await response.json();
    renderInstagramSlots(normalizeInstagramData(data, fallbackData));
  } catch (error) {
    renderInstagramSlots(fallbackData);
  }
}

function normalizeInstagramData(data, fallbackData) {
  const normalizedUrl = normalizeInstagramUrl(data?.url) || fallbackData.url;
  const fallbackUrl = normalizeInstagramUrl(data?.fallbackUrl) || fallbackData.url;

  return {
    url: normalizedUrl,
    caption: typeof data?.caption === "string" && data.caption.trim() ? data.caption.trim() : "",
    updatedAt: typeof data?.updatedAt === "string" ? data.updatedAt : "",
    fallbackUrl,
    isFallback: normalizedUrl === fallbackData.url,
  };
}

function renderInstagramSlots(data) {
  instagramSlots.forEach((slot) => {
    slot.innerHTML = "";
    slot.appendChild(buildInstagramCard(data, slot.dataset.variant || "section"));
  });
}

function buildInstagramCard(data, variant) {
  const wrapper = document.createElement("div");
  wrapper.className = "instagram-live-card";

  const iframe = document.createElement("iframe");
  iframe.className = "instagram-embed-frame";
  iframe.loading = "lazy";
  iframe.src = buildInstagramEmbedUrl(data.url);
  iframe.title = variant === "hero" ? "Instagram latest post hero preview" : "Instagram latest post preview";
  iframe.allow = "clipboard-write";
  wrapper.appendChild(iframe);

  if (variant !== "hero" && data.caption) {
    const caption = document.createElement("p");
    caption.className = "instagram-caption";
    caption.textContent = data.caption;
    wrapper.appendChild(caption);
  }

  if (variant !== "hero" && data.updatedAt) {
    const meta = document.createElement("p");
    meta.className = "instagram-meta";
    meta.textContent = `JSON updated: ${formatUpdatedAt(data.updatedAt)}`;
    wrapper.appendChild(meta);
  }

  const link = document.createElement("a");
  link.className = "text-link";
  link.href = data.url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = "Instagramで投稿を開く";
  wrapper.appendChild(link);

  return wrapper;
}

function buildInstagramEmbedUrl(url) {
  return `${normalizeInstagramUrl(url)}embed/captioned/`;
}

function normalizeInstagramUrl(url) {
  if (typeof url !== "string" || !url.trim()) {
    return "";
  }

  const trimmed = url.trim();
  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}

function formatUpdatedAt(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}




