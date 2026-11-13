/* Conflict cards: memories and documents that disagree (context.md section 8).
   Schema: IMPLEMENTATION_PLAN.md section 5.9. Optional extras used by howweknow.js:
   kicker, account.paraphrase (true = our summary, not the speaker's words), settleSources, sources (whole card). */
window.M = window.M || {};
M.conflicts = [
  { id: "C1", kicker: "Corporate schools", question: "Why did the company schools leave?",
    accounts: [
      { who: "Prof. P. J. Narayanan", sources: ["S-PJN"], paraphrase: true,
        text: "The model didn't work. Company trainers taught their own tools and basic Java, not the theory IIIT wanted. So IIIT went back to its own faculty and took Vindhya back in 2007." },
      { who: "Mr. Gopi", sources: ["S-GOPI"], paraphrase: true,
        text: "The companies moved out once they built or bought their own offices in Hyderabad. Some people stayed: Prof. Govindarajulu from IBM became faculty. Satyam stayed until around its scandal." },
      { who: "IIIT's own blog", sources: ["S-BLOGCORP"],
        text: "The model \"faded\" as IIIT turned more to research and the companies set up bigger offices in Hyderabad." },
      { who: "The prospectus (c.2001)", sources: ["S-PROSP"],
        text: "While the schools were still here, the institute called them \"one of the major strengths of the IIIT\"." }
    ],
    ourTake: "All of these can be true at once. The person who ran the teaching remembers a teaching problem. A staff member remembers the companies packing up. The institute's blog tells the smoothest version. Who tells the story shapes the story.",
    settleWith: "Institute-level meeting minutes from the early 2000s. Prof. Rajan told us these are kept by the Director's Office. Talking to someone who taught in a company school would help too.",
    settleSources: ["S-RAJAN"],
    sources: ["S-PJN", "S-GOPI", "S-BLOGCORP", "S-PROSP"],
    featured: true },

  { id: "C2", kicker: "Land", question: "How big is the campus?",
    accounts: [
      { who: "Mr. Gopi", sources: ["S-GOPI"], paraphrase: true,
        text: "100 acres were allotted. Later 30 acres had to be given up for the stadium next door." },
      { who: "The 2002 layout plan", sources: ["S-LAYOUT2002"],
        text: "The title on the plan says \"Area = 62.00 acres\"." },
      { who: "The prospectus (c.2001)", sources: ["S-PROSP"],
        text: "\"The institute is located on a campus of 62 acres.\"" },
      { who: "IIIT's website today", sources: ["S-IIITGLANCE"],
        text: "66 acres." }
    ],
    ourTake: "Two documents from around 2002 agree on 62. Gopi's 100 may be the first allotment, before the stadium took its share. But 100 minus 30 is 70, not 62, and we can't explain the move from 62 to 66 either.",
    settleWith: "The land papers. Prof. Rajan told us the founding and land documents are kept under lock and key.",
    settleSources: ["S-RAJAN"],
    sources: ["S-GOPI", "S-LAYOUT2002", "S-PROSP", "S-IIITGLANCE"],
    featured: true },

  { id: "C3", kicker: "Buildings", question: "What was Nilgiri before IIIT?",
    accounts: [
      { who: "Mr. Gopi", sources: ["S-GOPI"], paraphrase: true,
        text: "Nilgiri had housed the district court, and Vindhya the district collectorate. The state handed both over to start the college." },
      { who: "SLN Shastry", sources: ["S-SLN"], paraphrase: true,
        text: "The government lent IIIT an unfinished building, Nilgiri, for classrooms, labs and faculty rooms." }
    ],
    ourTake: "Both can be true: a building meant for the court that was never finished. Neither of them says the other is wrong.",
    settleWith: "The papers from when the state handed the buildings over, or someone who worked in the district offices then.",
    sources: ["S-GOPI", "S-SLN"],
    featured: true },

  { id: "C4", kicker: "Computers", question: "How many students shared a computer?",
    accounts: [
      { who: "Prof. P. J. Narayanan", sources: ["S-PJN"], paraphrase: true,
        text: "Three B.Tech students shared one workstation, on the library's second floor. M.Tech students shared one between five. First-years couldn't bring their own computer." },
      { who: "The prospectus (c.2001)", sources: ["S-PROSP"],
        text: "\"The PC to student ratio is 1:2.\"" }
    ],
    ourTake: "A prospectus is written to attract students, so it has a reason to look good. Memory can round numbers too. Documents are sources with motives, just like people.",
    settleWith: "Records of how many computers were bought in those years, or a few alumni from the first batches.",
    sources: ["S-PJN", "S-PROSP"],
    featured: true },

  { id: "C5", kicker: "Housing", question: "Where did the first students live?",
    accounts: [
      { who: "Prof. P. J. Narayanan", sources: ["S-PJN"], paraphrase: true,
        text: "In 1998 the first batch lived in the District Collector's bungalow and three flats, where the New Academic Block is going up now. In 1999 the next batch slept on bunk beds inside Vindhya." },
      { who: "SLN Shastry", sources: ["S-SLN"], paraphrase: true,
        text: "Vindhya was temporary housing for the boys. The girls were given the Judge's Quarters." }
    ],
    ourTake: "These are probably different moments, and neither says the other is wrong. A young institute kept moving people as new rooms opened up.",
    settleWith: "Alumni from the first two batches. They will remember where they slept.",
    sources: ["S-PJN", "S-SLN"],
    featured: true },

  { id: "C6", kicker: "Buildings", question: "Where was the first teaching?",
    accounts: [
      { who: "Prof. P. J. Narayanan", sources: ["S-PJN"], paraphrase: true,
        text: "Only Nilgiri's first two floors were in use, plus one big hall, SH-1, in Vindhya." },
      { who: "Mr. Gopi", sources: ["S-GOPI"], paraphrase: true,
        text: "The whole institute was in two buildings, Nilgiri and Vindhya." }
    ],
    ourTake: "These mostly agree. Classes were in Nilgiri, and the one big hall was in Vindhya, so both buildings were in use.",
    settleWith: "An old timetable with room numbers on it.",
    sources: ["S-PJN", "S-GOPI"],
    featured: false },

  { id: "C7", kicker: "People", question: "Where did Prof. Rajeev Sangal come from?",
    accounts: [
      { who: "Mr. Gopi", sources: ["S-GOPI"], paraphrase: true,
        text: "Prof. Sangal came from the University of Hyderabad and took over as Director." },
      { who: "The prospectus (c.2001)", sources: ["S-PROSP"],
        text: "His profile says faculty at IIT Kanpur from May 1980 to June 1998, then Director of LTRC from June 1998." }
    ],
    ourTake: "His own profile points to IIT Kanpur. Many early teachers did come over from the University of Hyderabad, which may be how the two got mixed up in memory.",
    settleWith: "A second document from 1998, like an early annual report.",
    sources: ["S-GOPI", "S-PROSP", "S-PJN"],
    featured: false }
];
