/* The IIIT Way (Board 2 and #/way). Text by saharsh-claude from context.md sections 2, 7 and 10.
   Schema: IMPLEMENTATION_PLAN.md section 5.11. Extra optional fields used by site/js/pages/way.js:
   chapter.conflictId / verifiedId (links), chapter.docs [{doc, page, label}], chapter.ask, chapter.todo,
   way.evidence, way.stamps, way.own, way.civil, way.leasedNote. */
window.M = window.M || {};
M.way = {
  title: "Borrow, share, take back, build your own",
  intro: "IIIT's logo is a banyan. A banyan often starts life on another tree, then sends down roots of its own until it stands by itself. IIIT grew the same way. Scroll down to see how.",
  sources: ["S-PJN", "S-GOPI", "S-PROSP", "S-WIKI-OLD"],

  chapters: [
    { id: "borrow", kicker: "1998", title: "Borrowed ground, borrowed teachers",
      body: "IIIT did not start in buildings of its own. The state government handed over two existing buildings in Gachibowli. Vindhya had been the district collectorate. Mr. Gopi remembers Nilgiri as the district court, while SLN Shastry remembers it as an unfinished government building. In 1998 only Nilgiri's first two floors were in use. IIIT had just 5 or 6 teachers of its own, so professors from the University of Hyderabad taught the basic sciences and humanities.",
      visual: "photos", images: ["img-01", "img-03", "img-07"],
      sources: ["S-GOPI", "S-SLN", "S-PJN", "S-BLOG25"], conflictId: "C3" },

    { id: "share", kicker: "1998 to 2007", title: "Companies in the classroom",
      body: "Around 2001 the prospectus listed six corporate schools on campus, from IBM, Oracle, Satyam, Motorola, Signal Tree and Cisco. It called them \"one of the major strengths of the IIIT\". The 2002 campus plan labels today's Vindhya as \"Corporate Schools\". People from these companies helped design the courses. Next time you are in Vindhya A1 or B2, look down: the black granite floor Motorola put in is still there.",
      visual: "schools", images: ["img-19"],
      docs: [ { doc: "prospectus", page: 3, label: "Prospectus, p.3: the partner companies" },
              { doc: "ping", page: 1, label: "Ping, p.1: an old \"IIIT Corporate Offers\" page" },
              { doc: "layout2002", page: 1, label: "2002 plan: \"Corporate Schools\"" } ],
      sources: ["S-PROSP", "S-LAYOUT2002", "S-GOPI", "S-PJN", "S-BLOGCORP"], verifiedId: "V5" },

    { id: "stayed", kicker: "1998 to 2001", title: "The school principal who became a professor",
      body: "Mr. Gopi told us that Prof. Govindarajulu came with IBM and stayed on as full-time faculty. We checked. The c.2001 prospectus lists him as Principal of the IBM School of Enterprise Wide Computing from January 1998 to October 2000, then Professor at IIIT from November 2001. A Ping article and the librarian both put him at the heart of the early library. Three sources, one story.",
      visual: "evidence",
      sources: ["S-GOPI", "S-PROSP", "S-PING", "S-MURALI"], verifiedId: "V3" },

    { id: "takeback", kicker: "2007, 2018, 2022", title: "Taking it back",
      body: "Then IIIT started taking its space back. In 2007 it took full control of Vindhya, and the company rooms became research labs. In 2018 it bought out TalentSprint from Himalaya Block A, which is the admin block today. In 2022 T-Hub moved to its own building, and Block D came back to IIIT for its research groups.",
      visual: "takebacks",
      sources: ["S-PJN", "S-NEWS-THUB"], conflictId: "C1" },

    { id: "build", kicker: "Himalaya", title: "A loan and four blocks",
      body: "To build the Himalaya complex, IIIT took a loan of 22 crore rupees, about 70 crore in today's money. It had 10 years to pay it back and did it in 6. The blocks arrived as bare shells, and each one was finished in a different way. Only Block C was fitted out with IIIT's own money. Before any of this, the ground was a cricket pitch where faculty and students played together. Pick a block to see its story.",
      visual: "himalaya",
      sources: ["S-PJN", "S-PRAB"],
      todo: "TODO(team): Himalaya construction years (not in any source yet)." },

    { id: "landlord", kicker: "Early 2010s", title: "IIIT the landlord",
      body: "IIIT did not only borrow. An undated floor-space survey, probably from the early 2010s, lists spaces IIIT leased out inside its own buildings. The tenants included RGUKT, TalentSprint, the State Bank of Hyderabad, Xerox and Milk & Water. Together they took up 67,118 sq ft. One space, Prudhvi, sat empty.",
      visual: "leased",
      docs: [ { doc: "floorplans", page: 27, label: "Floor-plan file, p.27: the leased spaces table" } ],
      sources: ["S-FLOORPLANS"],
      todo: "TODO(team): ask SLN Shastry what year the floor-space survey is from." },

    { id: "own", kicker: "From day one", title: "What IIIT built for itself",
      body: "Some things IIIT always did on its own. From 1998 it ran its own server room in Nilgiri, on hardware it bought, with its own email. Students helped run the systems, and those first servers are still running. Later the office moved off paper files into IMS. And in 2020, when COVID shut the campus, Sridhar Kora says IIIT was the first institution in Hyderabad to go fully online.",
      visual: "list",
      sources: ["S-PJN", "S-PRAB", "S-RAJAN", "S-SRIDHAR"] },

    { id: "cut", kicker: "Undated", title: "A branch that was cut",
      body: "Somewhere on campus there are padlocked doors marked Hydraulics Lab, Soil Mechanics Lab and Building Materials & Construction Lab. An old concrete mixer is still there. IIIT today teaches computing, electronics and research, not civil engineering. But around 2001 the prospectus offered an M.Tech in IT for Building Sciences, \"for architects and civil engineers\". The floor-space survey lists a Building Science Lab, and a CASE Lab and Material Testing Lab inside EERC.",
      visual: "civil", images: ["img-39", "img-42", "img-43", "img-46", "img-40", "img-44"],
      docs: [ { doc: "prospectus", page: 2, label: "Prospectus, p.2: M.Tech in IT for Building Sciences" },
              { doc: "floorplans", page: 9, label: "Floor plans, p.9: EERC with the CASE Lab" },
              { doc: "floorplans", page: 8, label: "Floor plans, p.8: the Building Science Lab" } ],
      ask: "We couldn't find out when this department started or when it closed. Do you know? Tell a guide.",
      sources: ["S-PHOTOS", "S-PROSP", "S-FLOORPLANS"],
      todo: "TODO(team): when Civil / CASE started and closed, and which building the abandoned department is in. Do not guess." }
  ],

  corporateSchools: [
    "IBM School of Enterprise-wide Computing",
    "Oracle School of Advanced Software Technology",
    "Satyam School of Applied Information Systems",
    "Motorola School of Communication Technology",
    "Signal Tree School of Excellence in Software Development Methodologies",
    "CISCO Academy Training Centre"
  ],
  corporateSchoolsSources: ["S-PROSP"],

  /* The "stayed" chapter: three pieces of evidence for Prof. Govindarajulu (V3). */
  evidence: [
    { kind: "oral", label: "Mr. Gopi, 2026", text: "Prof. Govindarajulu from IBM stayed on campus and became full-time faculty.", sources: ["S-GOPI"] },
    { kind: "document", label: "Prospectus, c.2001, p.10", text: "Principal, IBM School of Enterprise Wide Computing, Jan 1998 to Oct 2000. Professor at IIIT from Nov 2001.", sources: ["S-PROSP"], doc: "prospectus", page: 10 },
    { kind: "document", label: "Ping, c.2016, p.2", text: "Named on the \"Council of Chairs\" that ran the early library.", sources: ["S-PING"], doc: "ping", page: 2 }
  ],

  /* The "takeback" chapter: three dated stamps. */
  stamps: [
    { year: "2007", place: "Vindhya", text: "Company schools out, research labs in.", sources: ["S-PJN"] },
    { year: "2018", place: "Himalaya Block A", text: "Bought out from TalentSprint. Admin block today.", sources: ["S-PJN"] },
    { year: "2022", place: "Himalaya Block D", text: "T-Hub moves to Raidurg. Research labs move in.", sources: ["S-NEWS-THUB", "S-PJN"] }
  ],

  himalaya: [
    { id: "C", name: "Block C", short: "Lecture halls, exams", role: "Lecture halls and exam centre", funding: "Fitted out with IIIT's own money", color: "own",
      story: "The lecture halls and the exam centre. IIIT fitted this block out with its own money. It's the only Himalaya block IIIT finished alone.",
      sources: ["S-PJN"] },
    { id: "A", name: "Block A", short: "Admin today", role: "Admin today", funding: "Fitted out with TalentSprint; IIIT bought it out in 2018", color: "partner",
      story: "Fitted out together with TalentSprint, which shared the block until IIIT bought it out in 2018. The admin offices are here now. The floor-space survey also lists TalentSprint renting 22,260 sq ft on campus.",
      sources: ["S-PJN", "S-FLOORPLANS"] },
    { id: "KRB", name: "Kohli Research Block", short: "Research", role: "Research", funding: "Built with TCS", color: "partner2",
      story: "The Kohli Research Block (KRB) was built in partnership with TCS, for research.",
      sources: ["S-PJN"] },
    { id: "D", name: "Block D", short: "Labs since 2022", role: "Research labs since 2022", funding: "T-Hub, the state's startup incubator, 2015 to 2022", color: "state",
      story: "Given to the Telangana government as T-Hub, its startup incubator, from 2015 to 2022. Some faculty worried at the time about handing academic space to the state. Since 2022 it has held research groups: RRC, LSI, HSRC, SERC, Precog and a TCS research wing.",
      sources: ["S-PJN", "S-NEWS-THUB"] }
  ],
  himalayaLegend: [
    { color: "own", label: "IIIT's own money" },
    { color: "partner", label: "With a company, bought out" },
    { color: "partner2", label: "Built with a company" },
    { color: "state", label: "Lent to the state" }
  ],
  loan: { amount: "22 crore rupees", today: "about 70 crore today", term: "10 years", repaid: "6 years", sources: ["S-PJN"] },

  leased: [ ["RGUKT", 20238], ["TalentSprint", 22260], ["Prudhvi (vacant)", 13902], ["SpectraForce", 4464], ["SBH (bank)", 2474], ["Milk & Water", 2331], ["Kidosoft", 1000], ["Xerox", 61] ],
  leasedTotal: 67118,
  leasedNote: "Leased spaces, in sq ft. From an undated floor-space survey, probably early 2010s. TalentSprint's figure includes 15,000 sq ft outside Vindhya. The total also counts 388 sq ft of empty space.",
  leasedSources: ["S-FLOORPLANS"],

  /* The "own" chapter: icon list. icon is a key the page maps to a small inline SVG. */
  own: [
    { icon: "server", when: "1998", title: "Its own server room", text: "IIIT bought its own server hardware for Nilgiri. Students helped run the systems. Those servers are still on, while the server room moves to Vindhya.", sources: ["S-PJN"] },
    { icon: "mail", when: "1998", title: "Its own email", text: "Email ran on IIIT's own servers (Zimbra) before moving to Microsoft. Students were @gdit.iiit.net, faculty @iiit.net.", sources: ["S-PJN"] },
    { icon: "files", when: "2017", title: "From paper files to IMS", text: "Hostel rooms moved into IMS first. Office work followed, one process at a time. Some records stay on paper for audit rules.", sources: ["S-PRAB", "S-RAJAN"] },
    { icon: "online", when: "2020", title: "Fully online", text: "During COVID, classes and exams moved to CodeTantra. Sridhar Kora says IIIT was the first in Hyderabad to go fully online.", sources: ["S-SRIDHAR"] },
    { icon: "water", when: "After 2018", title: "Hot water that lasts", text: "Solar heaters and then geysers couldn't keep up. After a visit to BITS Pilani Hyderabad, the hostel team put in heat pumps.", sources: ["S-SRIDHAR"] }
  ],

  /* The "cut" chapter: document callouts shown next to the civil photos. */
  civil: [
    { label: "Prospectus, c.2001", text: "\"M.Tech in IT for Building Sciences (for architects and civil engineers)\"", sources: ["S-PROSP"], doc: "prospectus", page: 2 },
    { label: "Prospectus, c.2001", text: "A research centre called \"Intelligent Buildings\".", sources: ["S-PROSP"], doc: "prospectus", page: 6 },
    { label: "Floor-space survey, early 2010s", text: "EERC, Vindhya 1st floor: a CASE Lab, a Material Testing Lab and a models display hall.", sources: ["S-FLOORPLANS"], doc: "floorplans", page: 9 },
    { label: "Floor-space survey, early 2010s", text: "CBS, the Building Science Lab, Vindhya B2.", sources: ["S-FLOORPLANS"], doc: "floorplans", page: 8 }
  ]
};
