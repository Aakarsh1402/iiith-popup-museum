/* Verified cards (context.md section 9) and our own correction card.
   Schema: IMPLEMENTATION_PLAN.md section 5.9. chain[].kind is oral | document | photo | web.
   Optional extras used by howweknow.js: chain[].label, chain[].doc + page (opens the archive viewer). */
window.M = window.M || {};
M.verified = [
  { id: "V1", claim: "The guest house was the first mess.",
    chain: [
      { kind: "oral", label: "Mr. Gopi, 2026", text: "Before the hostel messes were built, the guest house served as the campus mess.", sources: ["S-GOPI"] },
      { kind: "photo", label: "Old aerial photo", text: "The guest house on bare red soil. The sign reads \"I.I.I.T Guest House, Mess & Lounge\".", sources: ["S-PHOTOS"], image: "img-04" },
      { kind: "photo", label: "Today", text: "The guest house lobby stands where the mess used to be.", sources: ["S-PHOTOS"], image: "img-30" }
    ],
    note: "One memory, checked against a photo." },

  { id: "V2", claim: "The library started in Saranga Hall.",
    chain: [
      { kind: "oral", label: "G. Muralidhar, librarian, 2026", text: "The library began with the institute in room Nilgiri 119, now Saranga Hall.", sources: ["S-MURALI"] },
      { kind: "document", label: "Ping, c.2016", text: "Written from an earlier librarian's memory: the library was \"Placed in our current Saranga Hall\" and could seat 100 people.", sources: ["S-PING"], doc: "ping", page: 1 },
      { kind: "photo", label: "Today", text: "Saranga Hall is a lecture hall now.", sources: ["S-PHOTOS"], image: "img-37" }
    ],
    note: "Two librarians, ten years apart, same answer." },

  { id: "V3", claim: "A company-school principal became an IIIT professor.",
    chain: [
      { kind: "oral", label: "Mr. Gopi, 2026", text: "Prof. Govindarajulu from IBM stayed on campus and became full-time faculty.", sources: ["S-GOPI"] },
      { kind: "document", label: "Prospectus, c.2001, p.10", text: "Principal, IBM School of Enterprise Wide Computing, Jan 1998 to Oct 2000. Professor at IIIT from Nov 2001.", sources: ["S-PROSP"], doc: "prospectus", page: 10 },
      { kind: "document", label: "Ping, c.2016", text: "Names him on the \"Council of Chairs\" that ran the early library.", sources: ["S-PING"], doc: "ping", page: 2 },
      { kind: "oral", label: "G. Muralidhar, 2026", text: "The late Prof. R. Govindarajulu was the first faculty member to take an active interest in the library.", sources: ["S-MURALI"] }
    ],
    note: "A memory, a CV and a magazine line up." },

  { id: "V4", claim: "Every student once had a room to themselves.",
    chain: [
      { kind: "oral", label: "Sridhar Kora, hostel office, 2026", text: "Rooms went from single, to double sharing, to triple sharing today.", sources: ["S-SRIDHAR"] },
      { kind: "document", label: "Prospectus, c.2001, p.7", text: "\"All students are provided with single room accommodation.\"", sources: ["S-PROSP"], doc: "prospectus", page: 7 }
    ],
    note: "Today's hostel office and a 25-year-old brochure agree." },

  { id: "V5", claim: "Vindhya was the corporate schools building.",
    chain: [
      { kind: "document", label: "Layout plan, 2002", text: "The building we now call Vindhya is labelled \"Corporate Schools\".", sources: ["S-LAYOUT2002"], doc: "layout2002", page: 1, image: "img-50" },
      { kind: "document", label: "Prospectus, c.2001, p.3", text: "Lists six corporate schools on campus, from IBM to Cisco.", sources: ["S-PROSP"], doc: "prospectus", page: 3 },
      { kind: "photo", label: "Team photo archive", text: "A collage of the IBM, Oracle, Motorola and Cisco labs.", sources: ["S-PHOTOS"], image: "img-19" },
      { kind: "web", label: "IIIT blog", text: "Vindhya was \"previously known as the Corporate School building\".", sources: ["S-BLOGCORP"] }
    ],
    note: "A map, a brochure, a photo and the institute's own blog." },

  { id: "V6", claim: "T-Hub was in Himalaya Block D from 2015 to 2022.",
    chain: [
      { kind: "oral", label: "Prof. P. J. Narayanan, 2026", text: "Block D was given to the Telangana government for T-Hub, then taken back in 2022 for research labs.", sources: ["S-PJN"] },
      { kind: "web", label: "News reports", text: "T-Hub launched on the IIIT campus on 5 Nov 2015 and moved to its own building in Raidurg on 28 Jun 2022.", sources: ["S-NEWS-THUB"] }
    ],
    note: "A memory, pinned down with dates from the news." },

  { id: "V7", claim: "There is a power substation on IIIT land.",
    chain: [
      { kind: "oral", label: "Prof. K. S. Rajan, 2026", text: "A substation sits on IIIT's own land, leased to the power utility. It is the campus's main power source.", sources: ["S-RAJAN"] },
      { kind: "document", label: "Layout plan, 2002", text: "Shows a \"Substation\" and an \"APSEB Control Room\" at the edge of campus.", sources: ["S-LAYOUT2002"], doc: "layout2002", page: 1 }
    ],
    note: "Something said in an interview, found on a 2002 map." }
];

M.correction = {
  title: "We got it wrong",
  before: "Our Phase 4 draft said Mr. Gopi managed the first mess.",
  after: "His interview says he turned that job down and ran the phone booth instead.",
  lesson: "History gets corrected when you go back to the source.",
  how: "That draft was handed in on 6 November 2026. When we went back to his interview, it said something different. So we fixed it, here and on the boards.",
  sources: ["S-PHASE4", "S-GOPI"]
};
