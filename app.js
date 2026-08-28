(() => {
  "use strict";

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  const routes = new Map([
    ["info", "Info"],
    ["tijdlijn", "Tijdlijn"],
    ["vraag-het-ons", "Vraag het ons"],
    ["videos", "Video's & uitleg"],
  ]);

  const views = Array.from(document.querySelectorAll("[data-view]"));
  const navigationLinks = Array.from(document.querySelectorAll("[data-route]"));
  const mainContent = document.querySelector("#main-content");
  const toast = document.querySelector("#app-toast");
  let toastTimer;

  function resetPageScroll() {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  function currentRoute() {
    const route = window.location.hash.slice(1).toLowerCase();
    return routes.has(route) ? route : "info";
  }

  function renderRoute({ moveFocus = false } = {}) {
    const route = currentRoute();

    if (window.location.hash !== `#${route}`) {
      window.history.replaceState(null, "", `#${route}`);
    }

    views.forEach((view) => {
      view.hidden = view.dataset.view !== route;
    });

    navigationLinks.forEach((link) => {
      if (link.dataset.route === route) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    document.body.dataset.activeView = route;
    document.title = `${routes.get(route)} | Slokker Kopersbegeleiding`;
    resetPageScroll();
    window.requestAnimationFrame(resetPageScroll);
    window.setTimeout(resetPageScroll, 50);

    if (moveFocus && mainContent) {
      mainContent.focus({ preventScroll: true });
    }
  }

  function navigateTo(route) {
    if (!routes.has(route)) return;

    if (currentRoute() === route && window.location.hash === `#${route}`) {
      renderRoute({ moveFocus: true });
      return;
    }

    window.location.hash = route;
  }

  function showToast(message) {
    if (!toast || !message) return;

    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = window.setTimeout(() => {
      toast.hidden = true;
      toast.textContent = "";
    }, 4200);
  }

  function iconUse(symbolId) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    svg.setAttribute("aria-hidden", "true");
    use.setAttribute("href", `#${symbolId}`);
    svg.append(use);
    return svg;
  }

  function timestamp() {
    return new Intl.DateTimeFormat("nl-NL", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());
  }

  function appendChatMessage({ sender, message, isUser = false }) {
    const history = document.querySelector("#chat-history");
    if (!history) return;

    const article = document.createElement("article");
    article.className = `chat-message chat-message--${isUser ? "user" : "assistant"}`;

    if (!isUser) {
      const avatar = document.createElement("span");
      avatar.className = "chat-message__avatar";
      avatar.setAttribute("aria-hidden", "true");
      avatar.append(iconUse("icon-chat"));
      article.append(avatar);
    }

    const body = document.createElement("div");
    const senderLabel = document.createElement("span");
    const paragraph = document.createElement("p");
    const time = document.createElement("time");

    senderLabel.className = "chat-message__sender";
    senderLabel.textContent = sender;
    paragraph.textContent = message;
    time.textContent = timestamp();
    time.dateTime = new Date().toISOString();

    body.append(senderLabel, paragraph, time);
    article.append(body);
    history.append(article);
    history.scrollTo({ top: history.scrollHeight, behavior: "smooth" });
  }

  function setupChatDemo() {
    const form = document.querySelector("#chat-form");
    const input = document.querySelector("#chat-input");
    if (!form || !input) return;

    document.querySelectorAll("[data-example-question]").forEach((button) => {
      button.addEventListener("click", () => {
        input.value = button.dataset.exampleQuestion || "";
        input.focus();
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const question = input.value.trim();

      if (!question) {
        input.setCustomValidity("Typ eerst een vraag.");
        input.reportValidity();
        return;
      }

      input.setCustomValidity("");
      appendChatMessage({ sender: "U", message: question, isUser: true });
      input.value = "";

      appendChatMessage({
        sender: "Assistent",
        message: "Deze visuele demo is nog niet gekoppeld aan projectinformatie of AI. Uw vraag is daarom alleen lokaal in dit scherm getoond.",
      });
    });

    input.addEventListener("input", () => input.setCustomValidity(""));
  }

  function setupVideoFilters() {
    const filters = Array.from(document.querySelectorAll("[data-video-filter]"));
    const cards = Array.from(document.querySelectorAll("[data-video-category]"));

    filters.forEach((button) => {
      button.addEventListener("click", () => {
        const selected = button.dataset.videoFilter || "all";

        filters.forEach((filter) => {
          const isActive = filter === button;
          filter.classList.toggle("is-active", isActive);
          filter.setAttribute("aria-pressed", String(isActive));
        });

        cards.forEach((card) => {
          card.hidden = selected !== "all" && card.dataset.videoCategory !== selected;
        });
      });
    });
  }

  function setupVideoDialog() {
    const dialog = document.querySelector("#video-dialog");
    const title = document.querySelector("#video-dialog-title");
    const category = document.querySelector("#video-dialog-category");
    if (!dialog || !title || !category) return;

    document.querySelectorAll("[data-video-title]").forEach((button) => {
      button.addEventListener("click", () => {
        title.textContent = button.dataset.videoTitle || "Video-uitleg";
        category.textContent = button.dataset.videoCategoryLabel || "Uitleg";

        if (typeof dialog.showModal === "function") {
          dialog.showModal();
        } else {
          dialog.setAttribute("open", "");
        }
      });
    });

    document.querySelectorAll("[data-close-dialog]").forEach((button) => {
      button.addEventListener("click", () => dialog.close());
    });

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  }

  document.addEventListener("click", (event) => {
    const routeButton = event.target.closest("[data-route-target]");
    if (routeButton) navigateTo(routeButton.dataset.routeTarget);

    const demoButton = event.target.closest("[data-demo-action]");
    if (demoButton) showToast(demoButton.dataset.demoAction);
  });

  window.addEventListener("hashchange", () => renderRoute({ moveFocus: true }));
  window.addEventListener("pageshow", () => window.setTimeout(resetPageScroll, 50));

  setupChatDemo();
  setupVideoFilters();
  setupVideoDialog();
  renderRoute();
})();
