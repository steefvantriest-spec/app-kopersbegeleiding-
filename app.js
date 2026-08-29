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

  function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
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

  function renderShellData({ project, buyer, projectStatus }) {
    setText("sidebar-project-name", project.name);
    setText("sidebar-dwelling-number", `Woning ${project.dwellingNumber}`);
    setText("sidebar-project-status", `${projectStatus.currentPhase} gestart`);
    setText("topbar-dwelling-number", `Woning ${project.dwellingNumber}`);
    setText("buyer-summary-avatar", buyer.initials);
    setText("buyer-summary-name", buyer.fullName);

    const topbarProject = document.querySelector(".topbar-project");
    const buyerSummary = document.querySelector(".buyer-summary");
    if (topbarProject) topbarProject.setAttribute("aria-label", `Huidige woning: ${project.dwellingNumber}`);
    if (buyerSummary) buyerSummary.setAttribute("aria-label", `Ingelogd als ${buyer.fullName}`);
  }

  function renderCurrentUpdate(projectStatus, update) {
    const progress = Math.min(100, Math.max(0, Number(projectStatus.overallProgress) || 0));
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
    setText("project-current-phase", projectStatus.currentPhase);
    setText("project-phase-position", `Fase ${projectStatus.currentPhaseNumber} van ${projectStatus.phaseCount}`);

    if (progressRing) {
      progressRing.style.setProperty("--progress", String(progress));
      progressRing.setAttribute("aria-valuenow", String(progress));
      progressRing.setAttribute("aria-label", `Bouwvoortgang: ${progress}% gereed`);
    }

    if (progressPanel) {
      progressPanel.setAttribute(
        "aria-label",
        `Huidige bouwfase: ${projectStatus.currentPhase}, fase ${projectStatus.currentPhaseNumber} van ${projectStatus.phaseCount}`,
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

  function createDocumentRow(documentItem, demoMessage) {
    const button = createElement("button", "document-row");
    const icon = createElement("span", "document-row__icon");
    const body = createElement("span", "document-row__body");
    const title = createElement("strong", "", documentItem.title);
    const metadata = createElement(
      "small",
      "",
      `${documentItem.type} · ${documentItem.size} · bijgewerkt ${formatDutchDate(documentItem.updatedAt, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`,
    );

    button.type = "button";
    button.setAttribute("aria-label", `Open ${documentItem.title}`);
    button.dataset.demoAction = demoMessage || `${documentItem.title} is in deze fase nog een voorbeelddocument.`;
    icon.setAttribute("aria-hidden", "true");
    icon.append(iconUse("icon-document"));
    body.append(title, metadata);
    button.append(icon, body, iconUse("icon-download"));
    return button;
  }

  function renderDocuments(documents) {
    const list = elementById("important-documents-list");
    if (!list) return;

    list.replaceChildren(...documents.slice(0, 3).map((documentItem) => createDocumentRow(documentItem)));
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
    renderCurrentUpdate(data.projectStatus, data.currentUpdate);
    renderWeeklyStatus(data.weeklyStatus);
    renderBuyerAction(data.actions);
    renderImportantMoments(data.deadlines);
    renderLatestNews(data.news);
    renderDocuments(data.documents);
    renderContactPerson(data.contactPerson);
  }

  const timelineStatusLabels = Object.freeze({
    completed: "Afgerond",
    current: "Huidige fase",
    planned: "Gepland",
  });

  function timelineDate(value) {
    if (!value) return "Nog niet bekend";
    return formatDutchDate(value, { day: "numeric", month: "long", year: "numeric" });
  }

  function timelineDateRange(phase) {
    if (!phase.startDate) return "Planning wordt later bekendgemaakt";
    if (!phase.expectedEndDate) return `Vanaf ${timelineDate(phase.startDate)}`;
    return `${timelineDate(phase.startDate)} – ${timelineDate(phase.expectedEndDate)}`;
  }

  function createPhaseFact(label, value, dateTime) {
    const group = createElement("div", "phase-fact");
    const term = createElement("dt", "", label);
    const description = createElement("dd");

    if (dateTime) {
      const time = createElement("time", "", value);
      time.dateTime = dateTime;
      description.append(time);
    } else {
      description.append(createElement("strong", "", value));
    }

    group.append(term, description);
    return group;
  }

  function createPhaseImage(imageItem) {
    const figure = createElement("figure", "phase-image");
    let visual;

    if (imageItem.url) {
      visual = document.createElement("img");
      visual.src = imageItem.url;
      visual.alt = imageItem.alt;
      visual.loading = "lazy";
    } else {
      visual = createElement("div", "phase-image__placeholder");
      visual.setAttribute("role", "img");
      visual.setAttribute("aria-label", imageItem.alt);
      visual.append(iconUse("icon-image"), createElement("span", "", "Bouwfoto volgt"));
    }

    const caption = createElement("figcaption");
    const captionText = createElement("span", "", imageItem.caption);
    const date = createElement("time", "", timelineDate(imageItem.date));
    date.dateTime = imageItem.date;
    caption.append(captionText, date);
    figure.append(visual, caption);
    return figure;
  }

  function createPhaseImages(images, phaseTitle) {
    const section = createElement("section", "phase-resource phase-resource--images");
    section.setAttribute("aria-label", `Bouwfoto's bij ${phaseTitle}`);
    const heading = createElement("div", "phase-resource__heading");
    const icon = createElement("span", "icon-tile");
    const title = createElement("h3", "", "Bouwfoto's");
    const grid = createElement("div", "phase-image-grid");

    icon.setAttribute("aria-hidden", "true");
    icon.append(iconUse("icon-image"));
    heading.append(icon, title);
    images.forEach((imageItem) => grid.append(createPhaseImage(imageItem)));
    section.append(heading, grid);
    return section;
  }

  function createPhaseDocuments(documents, phaseTitle) {
    const section = createElement("section", "phase-resource phase-resource--documents");
    section.setAttribute("aria-label", `Documenten bij ${phaseTitle}`);
    const heading = createElement("div", "phase-resource__heading");
    const icon = createElement("span", "icon-tile");
    const title = createElement("h3", "", "Documenten");
    const list = createElement("div", "document-list");

    icon.setAttribute("aria-hidden", "true");
    icon.append(iconUse("icon-document"));
    heading.append(icon, title);
    documents.forEach((documentItem) => {
      list.append(
        createDocumentRow(
          documentItem,
          `${documentItem.title} is in deze tijdlijn nog een voorbeelddocument.`,
        ),
      );
    });
    section.append(heading, list);
    return section;
  }

  function createPhaseVideos(videos) {
    const section = createElement("section", "phase-resource phase-resource--videos");
    const heading = createElement("div", "phase-resource__heading");
    const icon = createElement("span", "icon-tile");
    const title = createElement("h3", "", "Video & uitleg");

    icon.setAttribute("aria-hidden", "true");
    icon.append(iconUse("icon-video"));
    heading.append(icon, title);
    section.append(heading);

    videos.forEach((video) => {
      const item = createElement("div", "phase-video");
      const videoTitle = createElement("strong", "", video.title);
      const button = createElement("button", "button button--outline", video.buttonLabel);
      button.type = "button";
      button.dataset.routeTarget = "videos";
      button.dataset.videoId = video.videoId;
      button.append(iconUse("icon-arrow"));
      item.append(videoTitle, button);
      section.append(item);
    });

    return section;
  }

  function createPhaseAction(action) {
    const section = createElement("section", "phase-action");
    const heading = createElement("div", "phase-action__heading");
    const icon = createElement("span", "icon-tile");
    const label = createElement("span", "eyebrow", "Actie nodig");
    const title = createElement("h3", "", action.title);
    const description = createElement("p", "", action.description);
    const deadline = createElement("div", "phase-action__deadline");
    const deadlineText = createElement("span");
    const deadlineLabel = createElement("small", "", "Deadline");
    const deadlineTime = createElement("time", "", action.deadlineLabel);
    const button = createElement("button", "button button--primary", action.buttonLabel);

    icon.setAttribute("aria-hidden", "true");
    icon.append(iconUse("icon-alert"));
    heading.append(icon, label);
    deadlineTime.dateTime = action.deadline;
    deadlineText.append(deadlineLabel, deadlineTime);
    deadline.append(iconUse("icon-clock"), deadlineText);
    button.type = "button";
    button.dataset.demoAction = "De koppeling met Huisinfo wordt in een volgende fase toegevoegd.";
    section.append(heading, title, description, deadline, button);
    return section;
  }

  function createTimelinePhase(phase, projectStatus, actions) {
    const status = timelineStatusLabels[phase.status] ? phase.status : "planned";
    const isCurrent = phase.id === projectStatus.currentPhaseId;
    const isOpen = isCurrent;
    const phaseNumber = String(phase.number).padStart(2, "0");
    const item = createElement("li", `timeline-item timeline-item--${status}${isOpen ? " is-open" : ""}`);
    const marker = createElement("div", "timeline-item__marker");
    const article = createElement("article", "timeline-phase");
    const button = createElement("button", "timeline-phase__toggle");
    const summary = createElement("span", "timeline-phase__summary");
    const statusLabel = createElement("span", "phase-status", timelineStatusLabels[status]);
    const heading = createElement("span", "phase-heading");
    const number = createElement("span", "", phaseNumber);
    const title = createElement("span", "timeline-phase__title", phase.title);
    const description = createElement("span", "timeline-phase__description", phase.description);
    const dateRange = createElement("span", "timeline-phase__range");
    const toggleCue = createElement("span", "timeline-phase__toggle-cue");
    const toggleLabel = createElement("span", "timeline-phase__toggle-label", isOpen ? "Verberg details" : "Bekijk details");
    const detailsId = `timeline-phase-details-${phase.id}`;
    const buttonId = `timeline-phase-button-${phase.id}`;
    const details = createElement("div", "timeline-phase__details");
    const overview = createElement("div", "phase-detail__overview");
    const facts = createElement("dl", "phase-facts");
    const phaseProgress = Math.min(100, Math.max(0, Number(phase.progress) || 0));
    const progress = createElement("div", "phase-progress");
    const progressHeading = createElement("div", "phase-progress__heading");
    const progressBar = createElement("div", "phase-progress-bar");
    const progressTrack = createElement("span");

    item.dataset.phaseId = phase.id;
    if (isCurrent) item.setAttribute("aria-current", "step");

    marker.setAttribute("aria-hidden", "true");
    if (status === "completed") marker.append(iconUse("icon-check"));
    else if (status === "current") marker.append(createElement("span"));
    else marker.append(createElement("span", "", phaseNumber));

    button.id = buttonId;
    button.type = "button";
    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute("aria-controls", detailsId);
    heading.append(number, title);
    dateRange.append(iconUse("icon-clock"), createElement("span", "", timelineDateRange(phase)));
    summary.append(statusLabel, heading, description, dateRange);
    toggleCue.append(toggleLabel, iconUse("icon-chevron"));
    button.append(summary, toggleCue);

    details.id = detailsId;
    details.hidden = !isOpen;
    details.setAttribute("role", "region");
    details.setAttribute("aria-labelledby", buttonId);

    const startLabel = status === "planned" ? "Verwachte start" : "Gestart";
    const endLabel = status === "completed" ? "Afgerond" : "Verwachte afronding";
    facts.append(
      createPhaseFact(startLabel, timelineDate(phase.startDate), phase.startDate),
      createPhaseFact(endLabel, timelineDate(phase.expectedEndDate), phase.expectedEndDate),
      createPhaseFact("Status", timelineStatusLabels[status]),
    );

    progressHeading.append(
      createElement("span", "", "Voortgang fase"),
      createElement("strong", "", `${phaseProgress}%`),
    );
    progressBar.style.setProperty("--progress", String(phaseProgress));
    progressBar.setAttribute("role", "progressbar");
    progressBar.setAttribute("aria-valuemin", "0");
    progressBar.setAttribute("aria-valuemax", "100");
    progressBar.setAttribute("aria-valuenow", String(phaseProgress));
    progressBar.setAttribute("aria-label", `Voortgang ${phase.title}`);
    progressBar.append(progressTrack);
    progress.append(progressHeading, progressBar);
    overview.append(facts, progress);
    details.append(overview);

    if (phase.milestone) {
      const milestone = createElement("div", `phase-milestone phase-milestone--${status}`);
      const milestoneMarker = createElement("span", "phase-milestone__marker");
      if (status === "completed") milestoneMarker.append(iconUse("icon-check"));
      milestoneMarker.setAttribute("aria-hidden", "true");
      milestone.append(milestoneMarker, createElement("span", "", phase.milestone));
      details.append(milestone);
    }

    if (phase.latestUpdate) {
      const update = createElement("section", "phase-update");
      const updateIcon = createElement("span", "icon-tile");
      const updateBody = createElement("div");
      const updateLabel = createElement("span", "eyebrow", "Laatste update");
      const updateDate = createElement("time", "", timelineDate(phase.latestUpdate.date));
      const updateText = createElement("p", "", phase.latestUpdate.text);
      updateIcon.setAttribute("aria-hidden", "true");
      updateIcon.append(iconUse("icon-bell"));
      updateDate.dateTime = phase.latestUpdate.date;
      updateBody.append(updateLabel, updateDate, updateText);
      update.append(updateIcon, updateBody);
      details.append(update);
    }

    const resources = createElement("div", "phase-resources");
    if (phase.images.length) resources.append(createPhaseImages(phase.images, phase.title));
    if (phase.documents.length) resources.append(createPhaseDocuments(phase.documents, phase.title));
    if (phase.videos.length) resources.append(createPhaseVideos(phase.videos));

    const action = actions.find((itemAction) => itemAction.id === phase.actionId);
    if (action) resources.append(createPhaseAction(action));
    if (resources.childElementCount) details.append(resources);

    article.setAttribute("aria-labelledby", buttonId);
    article.append(button, details);
    item.append(marker, article);
    return item;
  }

  function renderTimelineScreen(data) {
    if (!data?.timeline || !data.projectStatus) return;

    const list = elementById("timeline-phase-list");
    const progressBar = elementById("timeline-progress-bar");
    if (!list || !progressBar) return;

    const { projectStatus, timeline, actions } = data;
    const overallProgress = Math.min(100, Math.max(0, Number(projectStatus.overallProgress) || 0));
    setText("timeline-current-phase", projectStatus.currentPhase);
    setText("timeline-phase-position", `Fase ${projectStatus.currentPhaseNumber} van ${projectStatus.phaseCount}`);
    setText("timeline-overall-progress", `${overallProgress}%`);
    setText("timeline-phase-count-label", `${timeline.phases.length} bouwfases`);
    setText("timeline-expected-completion", projectStatus.expectedCompletion);
    setText("timeline-completion-note", projectStatus.expectedCompletionNote);

    progressBar.style.setProperty("--progress", String(overallProgress));
    progressBar.setAttribute("aria-valuenow", String(overallProgress));
    progressBar.setAttribute("aria-label", `Bouwvoortgang: ${overallProgress}% gereed`);
    list.replaceChildren(
      ...timeline.phases.map((phase) => createTimelinePhase(phase, projectStatus, actions)),
    );
  }

  function setupTimelineAccordion() {
    const list = elementById("timeline-phase-list");
    if (!list) return;

    list.addEventListener("click", (event) => {
      const button = event.target.closest(".timeline-phase__toggle");
      if (!button || !list.contains(button)) return;

      const details = elementById(button.getAttribute("aria-controls"));
      if (!details) return;

      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      details.hidden = expanded;
      button.closest(".timeline-item")?.classList.toggle("is-open", !expanded);
      const toggleLabel = button.querySelector(".timeline-phase__toggle-label");
      if (toggleLabel) toggleLabel.textContent = expanded ? "Bekijk details" : "Verberg details";
    });
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
  renderTimelineScreen(appData);
  setupTimelineAccordion();
  renderRoute();
})();
