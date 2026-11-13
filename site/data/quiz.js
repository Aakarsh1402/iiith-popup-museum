/* Entry/exit quiz. The paper quiz cards must use exactly these 8 questions (IMPLEMENTATION_PLAN.md 5.8).
   Optional extras used by quiz.js: eventId (seed event in events.js) or link (a route) for "Explore the answers". */
window.M = window.M || {};
M.quiz = {
  title: "Do you know your institute?",
  intro: "8 questions. Take it now, then again at the exit.",
  questions: [
    { id: "q1", q: "Where were the first classes held in 1998?",
      options: ["Himalaya", "Nilgiri", "Vindhya", "The guest house"], answer: 1,
      explain: "Only the first two floors of Nilgiri were in use. The one big hall, SH-1, was next door in Vindhya.",
      sources: ["S-PJN"], eventId: "e-1998-start" },
    { id: "q2", q: "What did the first batch enrol for?",
      options: ["A B.Tech", "A diploma (GDIT)", "An M.Tech"], answer: 1,
      explain: "They signed up for a Graduate Diploma in IT, trusting IIIT to become a university. It did, in 2001.",
      sources: ["S-PJN"], eventId: "e-1998-diploma" },
    { id: "q3", q: "Where did the 1999 batch sleep?",
      options: ["In a hotel", "On bunk beds inside Vindhya", "In Parijat Nivas"], answer: 1,
      explain: "There were no hostels yet. The batch slept army-style on two-tier bunks inside Vindhya, where block A4 and the library are now.",
      sources: ["S-PJN"], eventId: "e-1999-bunks" },
    { id: "q4", q: "What was the guest house used as in the early days?",
      options: ["A lecture hall", "The mess", "The library"], answer: 1,
      explain: "Students ate at the guest house before the hostel messes were built. An old photo shows its sign: \"Guest House, Mess & Lounge\".",
      sources: ["S-GOPI", "S-PHOTOS"], eventId: "e-1998-mess" },
    { id: "q5", q: "Where did the library start?",
      options: ["Saranga Hall", "Vindhya A6", "Himalaya"], answer: 0,
      explain: "It opened with the institute in Nilgiri 119, now Saranga Hall, with seats for about 100. It moved to Vindhya A6 in 2001.",
      sources: ["S-MURALI", "S-PING"], eventId: "e-1998-library" },
    { id: "q6", q: "How many times has the banyan Navjeevan been moved?",
      options: ["Never", "Once", "Three times"], answer: 2,
      explain: "SLN Shastry saved it from road widening. It went from the main road to Bakul Nivas, and finally to OBH.",
      sources: ["S-SLN"], eventId: "e-1998-banyans", link: "#/histree" },
    { id: "q7", q: "Which company's black granite floor is still in Vindhya?",
      options: ["IBM", "Motorola", "Oracle"], answer: 1,
      explain: "Motorola ran a corporate school in Vindhya. Its black granite floor and furniture are still there in blocks A1 and B2.",
      sources: ["S-PJN"], eventId: "e-2026-granite", link: "#/way/share" },
    { id: "q8", q: "What was Himalaya Block D from 2015 to 2022?",
      options: ["A hostel", "T-Hub, the state's startup incubator", "The civil department"], answer: 1,
      explain: "T-Hub opened in Block D in 2015. It moved to its own building in 2022, and IIIT gave the block to research labs.",
      sources: ["S-NEWS-THUB", "S-PJN"], eventId: "e-2015-thub" }
  ]
};
