(() => {
  "use strict";

  const appData = window.KOPERS_APP_DATA;

  function normalizeQuestion(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function templateValues(data) {
    const choicesAction = data.actions.find((action) => action.id === "controle-ruwbouwkeuzes");
    return {
      expectedCompletion: data.projectStatus.expectedCompletion,
      expectedCompletionNote: data.projectStatus.expectedCompletionNote,
      ruwbouwChoicesDeadline: choicesAction?.deadlineLabel || "de aangegeven deadline",
    };
  }

  function interpolate(template, values) {
    return String(template || "").replace(/{{([a-zA-Z0-9]+)}}/g, (_, key) => values[key] ?? "");
  }

  function responseScore(response, normalizedQuestion) {
    return response.keywords.reduce((score, keyword) => {
      const normalizedKeyword = normalizeQuestion(keyword);
      return normalizedQuestion.includes(normalizedKeyword) ? score + normalizedKeyword.length : score;
    }, 0);
  }

  function findResponse(chatDemo, question, responseId) {
    if (responseId) {
      const selected = chatDemo.responses.find((response) => response.id === responseId);
      if (selected) return selected;
    }

    const normalizedQuestion = normalizeQuestion(question);
    return chatDemo.responses
      .map((response) => ({ response, score: responseScore(response, normalizedQuestion) }))
      .sort((first, second) => second.score - first.score)
      .find((candidate) => candidate.score > 0)?.response || chatDemo.fallbackResponse;
  }

  async function sendMessage(question, options = {}) {
    const cleanQuestion = String(question || "").trim();
    if (!cleanQuestion) throw new TypeError("Een chatvraag mag niet leeg zijn.");

    const response = findResponse(appData.chatDemo, cleanQuestion, options.responseId);
    return {
      id: response.id,
      answer: interpolate(response.answerTemplate, templateValues(appData)),
      source: response.source,
      actions: response.actions,
      isFallback: response.id === appData.chatDemo.fallbackResponse.id,
    };
  }

  window.KOPERS_CHAT_SERVICE = Object.freeze({ sendMessage });
})();
