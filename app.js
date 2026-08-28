(() => {
  "use strict";

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  const appData = window.KOPERS_APP_DATA;

  function elementById(id) {
    return document.getElementById(id);
  }

  function setText(id, value) {
    const element = elementById(id);
    if (element) element.textContent = value ?? "";
  }

  function setTime(id, dateTime, label) {
    const element = elementById(id);
    if (!element) return;

    element.dateTime = dateTime || "";
    element.textContent = label || "";
  }

  function parseLocalDate(value) {
    const [year, month = 1, day = 1] = String(value || "").split("-").map(Number);
    return new Date(year, month - 1, day, 12);
  }

  function formatDutchDate(value, options) {
    const date = value instanceof Date ? value : parseLocalDate(value);
    return new Intl.DateTimeFormat("nl-NL", options).format(date);
  }

  function capitalize(value) {
    return value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : "";
  }

  function localDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function renderShellData({ project, buyer }) {
    setText("sidebar-project-name", project.name);
    setText("sidebar-dwelling-number", `Woning ${project.dwellingNumber}`);
    setText("sidebar-project-status", `${project.currentPhase} gestart`);
    setText("topbar-dwelling-number", `Woning ${project.dwellingNumber}`);
    setText("buyer-summary-avatar", buyer.initials);
    setText("buyer-summary-name", buyer.fullName);

    const topbarProject = document.querySelector(".topbar-project");
    const buyerSummary = document.querySelector(".buyer-summary");
    if (topbarProject) topbarProject.setAttribute("aria-label", `Huidige woning: ${project.dwellingNumber}`);
    if (buyerSummary) buyerSummary.setAttribute("aria-label", `Ingelogd als ${buyer.fullName}`);
  }

  function renderCurrentUpdate(project, update) {
    const progress = Math.min(100, Math.max(0, Number(project.progress) || 0));
    const progressRing = elementById("project-progress-ring");
    const progressPanel = elementById("project-progress-panel");

    setText("current-update-label", update.label);
    setText("project-update-title", update.title);
    setText("current-update-summary", update.summary);
    setText("current-update-button-label", update.buttonLabel);
    setTime(
      "current-update-date",
      update.updatedAt,
      `Bijgewerkt op ${formatDutchDate(update.updatedAt, { day: "numeric", month: "long", year: "numeric" })}`,
    );
    setText("project-progress-value", `${progress}%`);
    setText("project-current-phase", project.currentPhase);
    setText("project-phase-position", `Fase ${project.currentPhaseNumber} van ${project.phaseCount}`);

    if (progressRing) {
      progressRing.style.setProperty("--progress", String(progress));
      progressRing.setAttribute("aria-valuenow", String(progress));
      progressRing.setAttribute("aria-label", `Bouwvoortgang: ${progress}% gereed`);
    }

    if (progressPanel) {
      progressPanel.setAttribute(
        "aria-label",
        `Huidige bouwfase: ${project.currentPhase}, fase ${project.currentPhaseNumber} van ${project.phaseCount}`,
      );
    }

    const updateButton = elementById("current-update-button");
    if (updateButton) {
      updateButton.dataset.demoAction = "Het volledige projectbericht wordt in een volgende fase gekoppeld.";
    }
  }

  function renderWeeklyStatus(items) {
    const list = elementById("weekly-status-list");
    if (!list) return;

    const statusLabels = {
      completed: "Gereed",
      in_progress: "Bezig",
      upcoming: "Binnenkort",
    };

    list.replaceChildren();
    items.slice(0, 4).forEach((item) => {
      const status = statusLabels[item.status] ? item.status : "upcoming";
      const listItem = document.createElement("li");
      const icon = document.createElement("span");
      const text = document.createElement("span");

      listItem.className = `weekly-status-item weekly-status-item--${status.replace("_", "-")}`;
      listItem.setAttribute("aria-label", `${statusLabels[status]}: ${item.text}`);
      icon.className = "weekly-status-item__icon";
      icon.setAttribute("aria-hidden", "true");
      text.textContent = item.text;

      if (status === "completed") icon.append(iconUse("icon-check"));
      listItem.append(icon, text);
      list.append(listItem);
    });
  }

  function renderBuyerAction(actions) {
    const card = elementById("buyer-action-card");
    const deadline = elementById("buyer-action-deadline");
    const deadlineValue = elementById("buyer-action-deadline-value");
    const button = elementById("buyer-action-button");
    const icon = card?.querySelector(".action-card__icon use");
    if (!card || !deadline || !deadlineValue || !button) return;

    const action = actions[0];
    card.classList.toggle("action-card--required", Boolean(action));
    card.classList.toggle("action-card--clear", !action);

    if (!action) {
      setText("buyer-action-label", "Geen actie nodig");
      setText("buyer-action-title", "Op dit moment hoeft u niets te doen.");
      setText("buyer-action-description", "U bent helemaal bij. Zodra er iets van u nodig is, ziet u dat hier.");
      deadline.hidden = true;
      button.hidden = true;
      if (icon) icon.setAttribute("href", "#icon-check");
      return;
    }

    setText("buyer-action-label", "Actie nodig");
    setText("buyer-action-title", action.title);
    setText("buyer-action-description", action.description);
    setTime("buyer-action-deadline-value", action.deadline, action.deadlineLabel);
    button.textContent = action.buttonLabel;
    button.dataset.demoAction = "De koppeling met Huisinfo wordt in een volgende fase toegevoegd.";
    deadline.hidden = false;
    button.hidden = false;
    if (icon) icon.setAttribute("href", "#icon-alert");
  }

  function renderImportantMoments(deadlines) {
    const list = elementById("important-moments-list");
    if (!list) return;

    list.replaceChildren();
    deadlines.slice(0, 3).forEach((deadline) => {
      const listItem = document.createElement("li");
      const date = document.createElement("time");
      const day = document.createElement("strong");
      const month = document.createElement("span");
      const copy = document.createElement("div");
      const title = document.createElement("strong");

      date.className = "moment-date";
      date.dateTime = deadline.date;
      day.textContent = deadline.dayLabel;
      month.textContent = deadline.monthLabel;
      copy.className = "moment-list__copy";
      title.textContent = deadline.title;

      date.append(day, month);
      copy.append(title);
      listItem.append(date, copy);
      list.append(listItem);
    });
  }

  function renderLatestNews(newsItems) {
    const item = newsItems[0];
    const date = elementById("latest-news-date");
    const button = elementById("latest-news-button");
    if (!date || !button) return;

    if (!item) {
      setText("latest-news-title", "Er zijn geen nieuwe berichten.");
      setText("latest-news-summary", "Zodra er nieuws over uw project is, vindt u dat hier.");
      date.hidden = true;
      button.hidden = true;
      return;
    }

    setText("latest-news-title", item.title);
    setText("latest-news-summary", item.summary);
    setText("latest-news-button-label", item.buttonLabel);
    setTime(
      "latest-news-date",
      item.publishedAt,
      formatDutchDate(item.publishedAt, { day: "numeric", month: "long", year: "numeric" }),
    );
    button.dataset.demoAction = "Het volledige nieuwsbericht wordt in een volgende fase gekoppeld.";
    date.hidden = false;
    button.hidden = false;
  }

  function renderDocuments(documents) {
    const list = elementById("important-documents-list");
    if (!list) return;

    list.replaceChildren();
    documents.slice(0, 3).forEach((documentItem) => {
      const button = document.createElement("button");
      const icon = document.createElement("span");
      const body = document.createElement("span");
      const title = document.createElement("strong");
      const metadata = document.createElement("small");

      button.className = "document-row";
      button.type = "button";
      button.setAttribute("aria-label", `Open ${documentItem.title}`);
      button.dataset.demoAction = `${documentItem.title} is in deze fase nog een voorbeelddocument.`;
      icon.className = "document-row__icon";
      icon.setAttribute("aria-hidden", "true");
      icon.append(iconUse("icon-document"));
      body.className = "document-row__body";
      title.textContent = documentItem.title;
      metadata.textContent = `${documentItem.type} · ${documentItem.size} · bijgewerkt ${formatDutchDate(documentItem.updatedAt, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`;

      body.append(title, metadata);
      button.append(icon, body, iconUse("icon-download"));
      list.append(button);
    });
  }

  function renderContactPerson(contactPerson) {
    setText("contact-initials", contactPerson.initials);
    setText("contact-name", contactPerson.name);
    setText("contact-role", contactPerson.role);
    setText("contact-introduction", contactPerson.introduction);
    setText("contact-email-label", contactPerson.emailLabel);

    const emailButton = elementById("contact-email-button");
    const phoneButton = elementById("contact-phone-button");
    if (emailButton) {
      emailButton.dataset.demoAction = `De e-mailfunctie voor ${contactPerson.name} wordt in een volgende fase gekoppeld.`;
      emailButton.setAttribute("aria-label", `${contactPerson.emailLabel} naar ${contactPerson.name}`);
    }
    if (phoneButton) {
      phoneButton.dataset.demoAction = `De telefoonfunctie voor ${contactPerson.name} wordt in een volgende fase gekoppeld.`;
      phoneButton.setAttribute("aria-label", `${contactPerson.phoneLabel}: ${contactPerson.name}`);
      phoneButton.title = contactPerson.phoneLabel;
    }
  }

  function renderInfoScreen(data) {
    if (!data) return;

    const today = new Date();
    renderShellData(data);
    setText("info-buyer-first-name", data.buyer.firstName);
    setText("info-project-name", `Project ${data.project.name}`);
    setTime(
      "info-current-date",
      localDateKey(today),
      capitalize(formatDutchDate(today, { weekday: "long", day: "numeric", month: "long", year: "numeric" })),
    );
    renderCurrentUpdate(data.project, data.currentUpdate);
    renderWeeklyStatus(data.weeklyStatus);
    renderBuyerAction(data.actions);
    renderImportantMoments(data.deadlines);
    renderLatestNews(data.news);
    renderDocuments(data.documents);
    renderContactPerson(data.contactPerson);
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
  renderInfoScreen(appData);
  renderRoute();
})();
