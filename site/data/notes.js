/* notes.js: speaker notes for the team and the Board 4 website tour. Owner: aakarsh-claude (A9).
   M.notes.pages[route] = what a guide can say on that page (press N on any page to show or hide it; hidden by default).
   M.notes.tour = the website tour steps: { route, title, text }. text is what visitors see on screen, so keep it short.
   Every fact here comes from context.md (sources in brackets after each note). Never add new facts here. */
window.M = window.M || {};
M.notes = {
  pages: {
    start: { text: "Our question is in the title: do you know your institute? IIIT started in borrowed government buildings, with company schools in its classrooms. Over the years it took those spaces back and built its own. The logo is a banyan, and a banyan does the same thing: it leans on another tree, then drops its own roots. Each board is one part of that story.", sources: ["S-PJN", "S-GOPI"] },
    timeline: { text: "Everything we found, by year. Scroll to zoom in. The busiest stretch is 1998 to 2002: 49 of 50 students joined for a diploma, classes ran on two floors of Nilgiri, and IIIT became a deemed university in 2001. Zoom in all the way and some cards say \"Sources disagree\". Those are the ones we cover on Board 4.", sources: ["S-PJN", "S-GOPI"] },
    photos: { text: "Old photos from IIITH's 20-year video and the prospectus from around 2001. Point out the gate sign, which says \"Indian Institute of Information Technology\", and the guest house sign, which says \"Mess & Lounge\". The guest house really was the first mess, and two separate sources back that up (it's card V1 on the Board 4 screen).", sources: ["S-PHOTOS", "S-PROSP", "S-GOPI"] },
    way: { text: "Borrow, share, take back, build your own. Six company schools ran in Vindhya. IIIT took full control of it in 2007. Himalaya was built on a 22 crore loan, paid off in six of ten years. Only Block C was fitted out with IIIT's own money: Block A came with TalentSprint (bought out in 2018), the Kohli block with TCS, and Block D was T-Hub from 2015 to 2022. Don't say Himalaya had no company money in it.", sources: ["S-PJN", "S-NEWS-THUB", "S-PROSP"] },
    buildings: { text: "It opens with SLN Shastry's videos of Nilgiri being built in 1997. Then satellite screenshots of four places, oldest to newest: the New Academic Block, Bakul Nivas, the Felicity ground and the amphitheatre. Only one frame has a date we could read (the amphitheatre, 14 March 2018), so don't guess years for the others. The NAB is going up where the first batch lived in 1998.", sources: ["S-SLN", "S-PHOTOS", "S-PJN"] },
    map: { text: "The 2002 layout plan, fading into a satellite view of the campus today. Pick a journey on the left. The library is the best one: it opened in Nilgiri room 119 (now Saranga Hall) in 1998, moved to Vindhya A6 in 2001, and will move to the NAB. Rooms move around a lot more than people think.", sources: ["S-LAYOUT2002", "S-MURALI", "S-PING", "S-PJN"] },
    histree: { text: "HISTREE is the history of the trees. SLN Shastry saved four banyans from a road widening. One of them, Navjeevan, was moved three times: from the main road to Bakul Nivas, then to OBH. Even the trees were moved here and took root.", sources: ["S-SLN"] },
    "how-we-know": { text: "This is the public history part. Memory disagrees: Gopi says 100 acres were allotted, while the 2002 plan and the prospectus both say 62. Click a card to flip it. The verified cards are claims two independent sources agree on. We also got one thing wrong ourselves: our Phase 4 draft said Gopi ran the first mess, but his interview says he turned that job down. We fixed it.", sources: ["S-GOPI", "S-LAYOUT2002", "S-PROSP", "S-PHASE4"] },
    voices: { text: "Seven people told us their IIIT. Everyone agreed to be recorded and quoted. Each page has the full transcript, and you can search it.", sources: ["S-GOPI", "S-PJN", "S-SLN"] },
    archive: { text: "The documents we worked from: the prospectus from around 2001, the lab floor plans, the 2002 layout plan and the Ping article. These shouldn't live only on our website. If someone has an old photo or document, ask them to send it to us.", sources: ["S-PROSP", "S-FLOORPLANS", "S-LAYOUT2002", "S-PING"] },
    ending: { text: "Every generation here thought it had run out of room: no degree in 1998, no hostels in 1999, borrowed teachers. Each one got solved. That's why we're hopeful about today's problems too.", sources: ["S-PJN", "S-PROSP"] },
    quiz: { text: "Eight questions. If someone took it at the entry, ask them to try again now and see if their score went up.", sources: [] }
  },
  tour: [
    { route: "#/start", title: "Do you know your institute?", text: "IIIT started in borrowed buildings and slowly put down its own roots." },
    { route: "#/way/build", title: "Himalaya: one loan, four blocks", text: "Only Block C was fitted out with IIIT's own money." },
    { route: "#/map?journey=library", title: "Rooms move", text: "The library has had three homes. Pick any journey." },
    { route: "#/how-we-know", title: "How we know", text: "Where memories disagree, and how we checked." },
    { route: "#/ending", title: "Every generation ran out of room", text: "Each problem felt permanent. Each one got solved." },
    { route: "#/quiz", title: "Try the quiz again", text: "Did your score go up?" }
  ]
};
