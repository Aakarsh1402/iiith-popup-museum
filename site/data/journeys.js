/* journeys.js: how rooms and things moved around campus (context.md section 11). Owner: aakarsh-claude (A3/A6).
   Each stop: place (id in M.places or null), label, when, text, sources, image (optional). */
window.M = window.M || {};
M.journeys = [
  { id: "library", short: "The library", title: "The library has moved twice. A third move is coming.", color: "var(--teal)",
    stops: [
      { place: "nilgiri", label: "Nilgiri 119 (now Saranga Hall)", when: "1998", text: "175 books on the first day books arrived. About 100 seats, open till midnight, run by student librarians.", sources: ["S-PING", "S-MURALI"], image: "img-37" },
      { place: "vindhya", label: "Vindhya A6, ground floor", when: "2001", text: "The first floor above it was the UG1 workspace.", sources: ["S-MURALI"] },
      { place: "vindhya", label: "Vindhya A6, two floors", when: "2016 to 2020", text: "The upper floor joined the library in 2016. Books got RFID tags in 2018. In 2020 the rest of the first floor became a reading room.", sources: ["S-MURALI"] },
      { place: "nab", label: "New Academic Block", when: "Coming", text: "Nearly 50,000 volumes, heading to their third home.", sources: ["S-MURALI"], image: "img-14" }
    ] },
  { id: "big-hall", short: "The big lecture hall", title: "Where's the big lecture hall? It keeps moving.", color: "var(--soil)",
    stops: [
      { place: "vindhya", label: "SH-1, Vindhya", when: "1998", text: "The only large lecture hall on campus.", sources: ["S-PJN"] },
      { place: "himalaya", label: "H105, Himalaya", when: "Today", text: "The main big hall now. UGEE counselling happened here in 2018.", sources: ["S-PJN", "S-PRAB"] },
      { place: "nab", label: "New Academic Block", when: "Next", text: "The next big halls are in the building going up now.", sources: ["S-PJN"] }
    ] },
  { id: "eat", short: "Where you eat", title: "From one guest house mess to four messes.", color: "var(--ochre-ink)",
    stops: [
      { place: "guest-house", label: "Guest house \"Mess & Lounge\"", when: "1998", text: "Before any hostel mess existed. The lobby stands where the mess was.", sources: ["S-GOPI", "S-PHOTOS"], image: "img-04" },
      { place: "obh", label: "OBH, first floor, then ground floor", when: "1999 to 2001", text: "Messes on two floors of the Old Boys Hostel, run on contract.", sources: ["S-GOPI"] },
      { place: "nbh", label: "Kadamba mess, NBH", when: "Third year", text: "Built with the New Boys Hostel.", sources: ["S-GOPI"] },
      { place: null, label: "Four messes, then Yuktahar", when: "2005", text: "Regional menus, flexible registration. Yuktahar came from a student campaign for clean food.", sources: ["S-PJN"] }
    ] },
  { id: "sleep", short: "Where you sleep", title: "From a bungalow and bunk beds to triple rooms.", color: "var(--plum)",
    stops: [
      { place: "nab", label: "Collector's bungalow + 3 flats", when: "1998", text: "The first batch. This spot is now the New Academic Block site. SLN Shastry also remembers girls in the Judge's Quarters.", sources: ["S-PJN", "S-SLN"] },
      { place: "vindhya", label: "Bunk beds inside Vindhya", when: "1999", text: "Army-style two-tier bunks where A4 and the library are now.", sources: ["S-PJN", "S-SLN"] },
      { place: null, label: "Palash, Parijat, Kadamb and OBH", when: "2000", text: "The first real hostels. The bunks came down.", sources: ["S-PJN", "S-GOPI"] },
      { place: "girls-hostel", label: "About 700 single rooms", when: "c.2001", text: "\"All students are provided with single room accommodation.\"", sources: ["S-PROSP", "S-LAYOUT2002"] },
      { place: null, label: "Double, then triple sharing", when: "Now", text: "Three to a room. Summer interns six to a room on bunks.", sources: ["S-SRIDHAR"] }
    ] },
  { id: "vindhya-rooms", short: "Vindhya's rooms", title: "Vindhya: company classrooms turned into labs.", color: "var(--slate)",
    stops: [
      { place: "vindhya", label: "Blocks A1 and B2", when: "1998 to 2007", text: "Motorola's school. Its black granite floor is still there.", sources: ["S-PJN"] },
      { place: "vindhya", label: "B5", when: "1998 to now", text: "IBM and Oracle classrooms, then LTRC, now CSTAR.", sources: ["S-PJN"] },
      { place: "vindhya", label: "SH-3 area", when: "1998 to now", text: "A Satyam unit, then the Robotics Research Centre.", sources: ["S-PJN"] },
      { place: "vindhya", label: "Library, 2nd floor", when: "Early years to now", text: "B.Tech workstations, one PC for three students. Now part of the library.", sources: ["S-PJN"] }
    ] },
  { id: "labs", short: "Labs moving out", title: "Labs that moved from Vindhya to Himalaya.", color: "var(--teal)",
    stops: [
      { place: "vindhya", label: "RRC, Vindhya B5, 3rd floor", when: "Early 2010s", text: "4,336 sq ft in the undated floor-space survey.", sources: ["S-FLOORPLANS"] },
      { place: "vindhya", label: "LSI, Vindhya B2, 3rd floor", when: "Early 2010s", text: "2,310 sq ft in the same survey.", sources: ["S-FLOORPLANS"] },
      { place: "himalaya", label: "Himalaya Block D", when: "2022", text: "RRC, LSI, HSRC, SERC and Precog moved into the block T-Hub left.", sources: ["S-PJN"] }
    ] },
  { id: "server-room", short: "The server room", title: "The first servers are still running.", color: "var(--slate)",
    stops: [
      { place: "nilgiri", label: "Nilgiri server room", when: "1998", text: "IIIT's own hardware and self-hosted email. Students helped run it.", sources: ["S-PJN"] },
      { place: "vindhya", label: "Vindhya IT wing", when: "Moving now", text: "The server room is moving, but the Nilgiri servers still run.", sources: ["S-PJN"] }
    ] },
  { id: "cricket", short: "The cricket ground", title: "A cricket ground became Himalaya.", color: "var(--banyan)",
    stops: [
      { place: null, label: "Faculty and student cricket", when: "Before Himalaya", text: "Faculty and students played together here.", sources: ["S-PRAB"] },
      { place: "himalaya", label: "Himalaya complex", when: "Before 2015", text: "Built on a 22 crore loan.", sources: ["S-PJN"] }
    ] },
  { id: "block-d", short: "Himalaya Block D", title: "Block D: lent to the state, then taken back.", color: "var(--plum)",
    stops: [
      { place: "himalaya", label: "A bare shell", when: "Before 2015", text: "The Himalaya blocks came without fit-outs.", sources: ["S-PJN"] },
      { place: "himalaya", label: "T-Hub", when: "2015 to 2022", text: "Telangana's startup incubator, about 70,000 sq ft.", sources: ["S-NEWS-THUB", "S-PJN"] },
      { place: "himalaya", label: "Research labs", when: "2022", text: "RRC, LSI, HSRC, SERC, Precog and a TCS research wing.", sources: ["S-PJN"] }
    ] },
  { id: "block-a", short: "Himalaya Block A", title: "Block A: fitted out by a tenant, then bought out.", color: "var(--ochre-ink)",
    stops: [
      { place: "himalaya", label: "Fitted out with TalentSprint", when: "Before 2018", text: "TalentSprint also rented about 22,000 sq ft elsewhere on campus.", sources: ["S-PJN", "S-FLOORPLANS"] },
      { place: "himalaya", label: "Bought out, now the admin block", when: "2018", text: "IIIT took it over completely.", sources: ["S-PJN"] }
    ] },
  { id: "guest-house", short: "The guest house", title: "The guest house has been almost everything.", color: "var(--soil)",
    stops: [
      { place: "guest-house", label: "Mess and lounge", when: "1998", text: "The first mess.", sources: ["S-GOPI", "S-PHOTOS"], image: "img-04" },
      { place: "guest-house", label: "Phone booth", when: "1998 to around 2002", text: "About 100 calls a day. Gopi's room is where it stood.", sources: ["S-GOPI"], image: "img-29" },
      { place: "guest-house", label: "Press centre", when: "2003", text: "Press meets for the Afro-Asian Games next door.", sources: ["S-GOPI"] },
      { place: "guest-house", label: "Guest house today", when: "Now", text: "The first Director's room is still here.", sources: ["S-PHOTOS"], image: "img-27" }
    ] },
  { id: "offices", short: "Rooms that changed jobs", title: "Same rooms, new jobs.", color: "var(--ink-2)",
    stops: [
      { place: null, label: "Centre for IT in Education", when: "2007", text: "Worked on the Virtual Labs project. Today the counselling office is there.", sources: ["S-PRAB"] },
      { place: "vindhya", label: "CSTAR lab", when: "2007", text: "Where CQST is now.", sources: ["S-PRAB"] }
    ] },
  { id: "navjeevan", short: "Navjeevan the banyan", title: "Navjeevan the banyan has moved three times.", color: "var(--banyan)",
    stops: [
      { place: null, label: "The main road", when: "Late 1990s", text: "Road widening would have cut it down.", sources: ["S-SLN"] },
      { place: "bakul", label: "Bakul Nivas", when: "Move 2", text: "Its first new home.", sources: ["S-SLN"] },
      { place: "obh", label: "OBH", when: "Move 3", text: "Where it stands now.", sources: ["S-SLN"], image: "img-05" }
    ] }
];
