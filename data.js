(() => {
  "use strict";

  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.values(value).forEach(deepFreeze);
    return Object.freeze(value);
  }

  window.KOPERS_APP_DATA = deepFreeze({
    config: {
      huisinfoUrl: "https://slokker.huisinfo.nl/login",
    },
    project: {
      id: "elzenhagen-noordhof",
      name: "Elzenhagen Noordhof",
      dwellingNumber: "132",
    },
    projectStatus: {
      currentPhaseId: "ruwbouw",
      currentPhase: "Ruwbouw",
      currentPhaseNumber: 4,
      phaseCount: 8,
      overallProgress: 43,
      expectedCompletion: "Q2 2027",
      expectedCompletionNote: "De exacte opleverdatum wordt later bekendgemaakt.",
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
    chatDemo: {
      welcomeMessage: {
        title: "Hallo, waarmee kunnen we u helpen?",
        text: "Stel een vraag over uw woning, planning, keuzes of Huisinfo.",
        safetyNote: "Deze demo gebruikt alleen vooraf gecontroleerde antwoorden. Voor formele keuzes en berichten verwijzen we u naar Huisinfo.",
      },
      suggestions: [
        {
          id: "suggestion-completion",
          responseId: "expected-completion",
          label: "Wanneer wordt mijn woning opgeleverd?",
        },
        {
          id: "suggestion-choices",
          responseId: "housing-choices",
          label: "Waar kan ik mijn woningkeuzes bekijken?",
        },
        {
          id: "suggestion-huisinfo",
          responseId: "how-huisinfo-works",
          label: "Hoe werkt Huisinfo?",
        },
        {
          id: "suggestion-choice-deadline",
          responseId: "rough-build-choice-deadline",
          label: "Wanneer moet ik mijn ruwbouwkeuzes doorgeven?",
        },
        {
          id: "suggestion-documents",
          responseId: "find-documents",
          label: "Waar vind ik mijn documenten?",
        },
        {
          id: "suggestion-rough-build",
          responseId: "rough-build-explanation",
          label: "Wat gebeurt er tijdens de ruwbouw?",
        },
      ],
      responses: [
        {
          id: "rough-build-choice-deadline",
          keywords: ["ruwbouwkeuzes", "keuzes doorgeven", "deadline keuzes", "wanneer keuzes"],
          question: "Wanneer moet ik mijn ruwbouwkeuzes doorgeven?",
          answerTemplate: "Uw ruwbouwkeuzes kunnen tot {{ruwbouwChoicesDeadline}} worden gecontroleerd. Voor formele wijzigingen en bevestiging gebruikt u Huisinfo.",
          source: {
            label: "Projectplanning",
            detail: "Deadline ruwbouwkeuzes",
          },
          actions: [
            {
              type: "huisinfo",
              label: "Bekijk mijn keuzes",
            },
            {
              type: "timeline",
              label: "Bekijk tijdlijn",
              target: "ruwbouw",
            },
          ],
        },
        {
          id: "expected-completion",
          keywords: ["opgeleverd", "oplevering", "opleverdatum", "wanneer is mijn woning klaar"],
          question: "Wanneer wordt mijn woning opgeleverd?",
          answerTemplate: "De huidige verwachting is dat uw woning in {{expectedCompletion}} wordt opgeleverd. {{expectedCompletionNote}}",
          source: {
            label: "Projectplanning",
            detail: "Indicatieve oplevering",
          },
          actions: [
            {
              type: "timeline",
              label: "Bekijk tijdlijn",
              target: "oplevering",
            },
          ],
        },
        {
          id: "how-huisinfo-works",
          keywords: ["hoe werkt huisinfo", "huisinfo gebruiken", "wat is huisinfo"],
          question: "Hoe werkt Huisinfo?",
          answerTemplate: "Huisinfo gebruikt u voor formele woninginformatie, documenten, keuzes en berichten. In deze app vindt u uitleg over hoe Huisinfo werkt.",
          source: {
            label: "FAQ Huisinfo",
            detail: null,
          },
          actions: [
            {
              type: "video",
              label: "Bekijk uitlegvideo",
              target: "huisinfo-uitleg",
            },
            {
              type: "huisinfo",
              label: "Open Huisinfo",
            },
          ],
        },
        {
          id: "housing-choices",
          keywords: ["woningkeuzes", "mijn keuzes", "keuzes bekijken", "keuzes wijzigen"],
          question: "Waar kan ik mijn woningkeuzes bekijken?",
          answerTemplate: "Uw woningkeuzes worden beheerd in Huisinfo. U kunt daar uw keuzes bekijken en, wanneer toegestaan, wijzigen of bevestigen.",
          source: {
            label: "FAQ Huisinfo",
            detail: "Woningkeuzes",
          },
          actions: [
            {
              type: "huisinfo",
              label: "Open Huisinfo",
            },
            {
              type: "video",
              label: "Bekijk uitlegvideo",
              target: "huisinfo-keuzes",
            },
          ],
        },
        {
          id: "rough-build-explanation",
          keywords: ["ruwbouw", "binnenwanden", "draagconstructie"],
          question: "Wat gebeurt er tijdens de ruwbouw?",
          answerTemplate: "Tijdens de ruwbouw wordt de draagconstructie van uw woning opgebouwd. Denk aan vloeren, binnenwanden en andere constructieve onderdelen.",
          source: {
            label: "Kopershandleiding",
            detail: "Bouwfase ruwbouw",
          },
          actions: [
            {
              type: "timeline",
              label: "Bekijk huidige fase",
              target: "ruwbouw",
            },
            {
              type: "video",
              label: "Bekijk uitlegvideo",
              target: "ruwbouw-uitleg",
            },
          ],
        },
        {
          id: "find-documents",
          keywords: ["documenten", "bouwtekeningen", "handleiding", "bestanden"],
          question: "Waar vind ik mijn documenten?",
          answerTemplate: "Belangrijke documenten vindt u op het Info-scherm en via Huisinfo.",
          source: {
            label: "Kopershandleiding",
            detail: "Documenten",
          },
          actions: [
            {
              type: "documents",
              label: "Bekijk documenten",
              target: "documents",
            },
            {
              type: "huisinfo",
              label: "Open Huisinfo",
            },
          ],
        },
      ],
      fallbackResponse: {
        id: "fallback",
        answerTemplate: "Op dit moment kan ik deze vraag nog niet automatisch beantwoorden. In de definitieve versie zoek ik hiervoor in de FAQ en projectdocumentatie.",
        source: null,
        actions: [
          {
            type: "faq",
            label: "Bekijk veelgestelde vragen",
          },
          {
            type: "video",
            label: "Bekijk uitlegvideo's",
            target: "all",
          },
          {
            type: "contact",
            label: "Neem contact op",
            target: "contact",
          },
        ],
      },
    },
    timeline: {
      phases: [
        {
          id: "voorbereiding",
          number: 1,
          title: "Voorbereiding",
          description: "Het bouwterrein wordt voorbereid en de werkzaamheden worden ingepland.",
          status: "completed",
          startDate: "2026-01-12",
          expectedEndDate: "2026-03-06",
          progress: 100,
          latestUpdate: {
            date: "2026-03-06",
            text: "De planning en technische voorbereiding voor uw woning zijn afgerond.",
          },
          milestone: null,
          images: [],
          documents: [],
          videos: [],
          actionId: null,
        },
        {
          id: "start-bouw",
          number: 2,
          title: "Start bouw",
          description: "De bouw van uw woning is officieel gestart.",
          status: "completed",
          startDate: "2026-03-09",
          expectedEndDate: "2026-04-03",
          progress: 100,
          latestUpdate: {
            date: "2026-04-03",
            text: "De bouwplaats is ingericht en de eerste werkzaamheden zijn uitgevoerd.",
          },
          milestone: "Start bouw",
          images: [],
          documents: [],
          videos: [],
          actionId: null,
        },
        {
          id: "fundering",
          number: 3,
          title: "Fundering",
          description: "De fundering en beganegrondvloer van uw woning worden aangebracht.",
          status: "completed",
          startDate: "2026-04-06",
          expectedEndDate: "2026-08-07",
          progress: 100,
          latestUpdate: {
            date: "2026-08-07",
            text: "De fundering en beganegrondvloer zijn gereed.",
          },
          milestone: "Fundering gereed",
          images: [
            {
              url: null,
              alt: "Plaats voor een foto van de gereedgekomen fundering",
              date: "2026-08-07",
              caption: "De fundering en beganegrondvloer zijn gereed.",
            },
          ],
          documents: [],
          videos: [],
          actionId: null,
        },
        {
          id: "ruwbouw",
          number: 4,
          title: "Ruwbouw",
          description: "De draagconstructie van uw woning wordt opgebouwd. De beganegrondvloer is gereed en de binnenwanden worden voorbereid.",
          status: "current",
          startDate: "2026-08-12",
          expectedEndDate: "2026-10-16",
          progress: 35,
          latestUpdate: {
            date: "2026-08-25",
            text: "De beganegrondvloer is gereed. Deze week worden voorbereidingen getroffen voor de binnenwanden op de eerste verdieping.",
          },
          milestone: "Ruwbouw gestart",
          images: [
            {
              url: null,
              alt: "Plaats voor een actuele bouwfoto van de beganegrondvloer",
              date: "2026-08-25",
              caption: "Beganegrondvloer van woning 132.",
            },
            {
              url: null,
              alt: "Plaats voor een actuele bouwfoto van de voorbereide binnenwanden",
              date: "2026-08-25",
              caption: "Voorbereiding van de binnenwanden.",
            },
          ],
          documents: [
            {
              id: "planning-ruwbouw",
              title: "Planning ruwbouw",
              type: "PDF",
              updatedAt: "2026-08-22",
              size: "740 KB",
            },
            {
              id: "bouwtekening-woning",
              title: "Bouwtekening woning",
              type: "PDF",
              updatedAt: "2026-08-18",
              size: "2,1 MB",
            },
            {
              id: "informatiefolder-ruwbouw",
              title: "Informatiefolder ruwbouw",
              type: "PDF",
              updatedAt: "2026-08-12",
              size: "580 KB",
            },
          ],
          videos: [
            {
              id: "ruwbouw-uitleg",
              videoId: "ruwbouw-uitleg",
              title: "Wat gebeurt er tijdens de ruwbouw?",
              buttonLabel: "Bekijk uitlegvideo",
            },
          ],
          actionId: "controle-ruwbouwkeuzes",
        },
        {
          id: "gevel-dak",
          number: 5,
          title: "Gevel & dak",
          description: "De buitengevel en het dak worden gerealiseerd zodat de woning wind- en waterdicht wordt.",
          status: "planned",
          startDate: "2026-10-19",
          expectedEndDate: "2026-12-18",
          progress: 0,
          latestUpdate: null,
          milestone: "Gebouw wind- en waterdicht",
          images: [],
          documents: [],
          videos: [],
          actionId: null,
        },
        {
          id: "installaties",
          number: 6,
          title: "Installaties",
          description: "Elektriciteit, water, verwarming en ventilatie worden aangebracht.",
          status: "planned",
          startDate: "2027-01-04",
          expectedEndDate: "2027-03-05",
          progress: 0,
          latestUpdate: null,
          milestone: null,
          images: [],
          documents: [],
          videos: [],
          actionId: null,
        },
        {
          id: "afbouw",
          number: 7,
          title: "Afbouw",
          description: "De binnenzijde van uw woning wordt verder afgewerkt.",
          status: "planned",
          startDate: "2027-03-08",
          expectedEndDate: "2027-05-07",
          progress: 0,
          latestUpdate: null,
          milestone: "Start afbouw",
          images: [],
          documents: [],
          videos: [],
          actionId: null,
        },
        {
          id: "oplevering",
          number: 8,
          title: "Oplevering",
          description: "Uw woning wordt gecontroleerd en voorbereid voor de uiteindelijke overdracht.",
          status: "planned",
          startDate: "2027-05-10",
          expectedEndDate: null,
          progress: 0,
          latestUpdate: null,
          milestone: "Oplevering",
          images: [],
          documents: [],
          videos: [],
          actionId: null,
        },
      ],
    },
  });
})();
