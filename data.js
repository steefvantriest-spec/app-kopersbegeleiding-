(() => {
  "use strict";

  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.values(value).forEach(deepFreeze);
    return Object.freeze(value);
  }

  window.KOPERS_APP_DATA = deepFreeze({
    project: {
      id: "elzenhagen-noordhof",
      name: "Elzenhagen Noordhof",
      dwellingNumber: "132",
      currentPhase: "Ruwbouw",
      currentPhaseNumber: 4,
      phaseCount: 8,
      progress: 43,
    },
    buyer: {
      firstName: "Marieke",
      fullName: "Marieke de Vries",
      initials: "MV",
    },
    currentUpdate: {
      id: "update-ruwbouw-gestart",
      label: "Belangrijkste projectupdate",
      title: "De ruwbouw van uw woning is gestart",
      summary: "De beganegrondvloer is gereed. Deze week start de aannemer met het plaatsen van de binnenwanden op de eerste verdieping.",
      updatedAt: "2026-08-28",
      buttonLabel: "Bekijk update",
    },
    weeklyStatus: [
      {
        id: "beganegrondvloer",
        status: "completed",
        text: "Beganegrondvloer is gereed",
      },
      {
        id: "binnenwanden",
        status: "in_progress",
        text: "Binnenwanden worden voorbereid",
      },
      {
        id: "metselwerk",
        status: "upcoming",
        text: "Metselwerk start naar verwachting volgende week",
      },
    ],
    actions: [
      {
        id: "controle-ruwbouwkeuzes",
        title: "Controleer uw ruwbouwkeuzes",
        description: "Uw keuzes kunnen nog worden gecontroleerd tot 18 september.",
        deadline: "2026-09-18",
        deadlineLabel: "18 september 2026",
        buttonLabel: "Bekijk mijn keuzes",
      },
    ],
    deadlines: [
      {
        id: "sluiting-ruwbouwkeuzes",
        date: "2026-09-18",
        dayLabel: "18",
        monthLabel: "sep",
        title: "Sluiting ruwbouwkeuzes",
      },
      {
        id: "sluiting-afbouwkeuzes",
        date: "2026-10-19",
        dayLabel: "19",
        monthLabel: "okt",
        title: "Sluiting afbouwkeuzes",
      },
      {
        id: "start-gevelwerk",
        date: "2026-11",
        dayLabel: "nov",
        monthLabel: "2026",
        title: "Verwachte start gevelwerk",
      },
    ],
    news: [
      {
        id: "werkzaamheden-op-schema",
        title: "Werkzaamheden verlopen volgens planning",
        publishedAt: "2026-08-28",
        summary: "De werkzaamheden aan de fundering zijn afgerond. De bouw gaat volgens de huidige planning verder.",
        buttonLabel: "Lees meer",
      },
    ],
    documents: [
      {
        id: "kopershandleiding",
        title: "Kopershandleiding",
        type: "PDF",
        updatedAt: "2026-08-22",
        size: "1,8 MB",
      },
      {
        id: "planning-bouwproject",
        title: "Planning bouwproject",
        type: "PDF",
        updatedAt: "2026-08-18",
        size: "840 KB",
      },
      {
        id: "handleiding-huisinfo",
        title: "Handleiding Huisinfo",
        type: "PDF",
        updatedAt: "2026-08-12",
        size: "620 KB",
      },
    ],
    contactPerson: {
      id: "laura-smit",
      name: "Laura Smit",
      initials: "LS",
      role: "Kopersbegeleider",
      introduction: "Heeft u een persoonlijke vraag? Laura helpt u graag verder.",
      emailLabel: "E-mail",
      phoneLabel: "Bellen",
    },
  });
})();
