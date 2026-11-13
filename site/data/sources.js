/* sources.js: every source we cite. IDs match context.md section 6. Owner: aakarsh-claude (A3).
   type: oral | document | photo | web.  short: how it's cited on screen.  tiny: compact label. */
window.M = window.M || {};
M.sources = {
  /* oral (interviews, 2026) */
  "S-GOPI": { type: "oral", short: "Interview with Mr. Gopi (2026)", tiny: "Gopi", personId: "P-GOPI",
    note: "Guest house caretaker, on campus since 1998. Summary-style transcript." },
  "S-SLN": { type: "oral", short: "Interview with SLN Shastry (2026)", tiny: "SLN Shastry", personId: "P-SLN",
    note: "One of the first five or six employees. Short summary of the interview." },
  "S-PJN": { type: "oral", short: "Interview with Prof. P. J. Narayanan (2026)", tiny: "PJN", personId: "P-PJN",
    note: "Former Director. We got this as a polished write-up, so we use his facts but not the wording." },
  "S-RAJAN": { type: "oral", short: "Interview with Prof. K. S. Rajan (2026)", tiny: "Rajan", personId: "P-RAJAN",
    note: "Registrar. Notes from an automatic transcript, with a few unclear bits." },
  "S-MURALI": { type: "oral", short: "Interview with G. Muralidhar (2026)", tiny: "Muralidhar", personId: "P-MURALI",
    note: "Librarian since 2005." },
  "S-PRAB": { type: "oral", short: "Interview with Prabhakar M (2026)", tiny: "Prabhakar", personId: "P-PRAB",
    note: "Joined in 2007. Admissions, hostel administration, now the Student Life Office." },
  "S-SRIDHAR": { type: "oral", short: "Interview with Sridhar Kora (2026)", tiny: "Sridhar", personId: "P-SRIDHAR",
    note: "Hostel office in-charge since 2018." },

  /* documents */
  "S-PROSP": { type: "document", short: "IIIT prospectus (c.2001)", tiny: "Prospectus", docId: "prospectus", date: "c.2001-02",
    note: "Early official brochure: programmes, courses, campus, faculty. Written to attract students, so it has its own reasons to round numbers up." },
  "S-LAYOUT2002": { type: "document", short: "Campus layout plan (2002), via SLN Shastry", tiny: "2002 plan", docId: "layout2002", date: "2002",
    note: "Layout plan of IIIT Gachibowli, 62 acres. North points down on the original." },
  "S-FLOORPLANS": { type: "document", short: "Lab floor plans and floor-space tables (undated)", tiny: "Floor plans", docId: "floorplans", date: "undated, probably early 2010s",
    note: "Scanned tables and floor plans of the research centres, plus a list of leased spaces. Undated, probably early 2010s." },
  "S-PING": { type: "document", short: "Ping! magazine, \"Echoes: The Library\" (c.2016)", tiny: "Ping!", docId: "ping", date: "c.2016",
    note: "Student magazine column looking back at the early library, written from a former librarian's memory." },
  "S-CURRSHOTS": { type: "document", short: "Prospectus curriculum pages (c.2001), highlighted", tiny: "Curriculum", docId: "curriculum", date: "c.2001",
    note: "Three crops from the prospectus with the electives and research centres highlighted." },
  "S-PHASE4": { type: "document", short: "Our own Phase 4 draft (Nov 2026)", tiny: "Our draft",
    note: "Our earlier exhibit text. We only trust it where an interview or document backs it up." },

  /* photos */
  "S-PHOTOS": { type: "photo", short: "Team photo archive (captions by the team)", tiny: "Photos",
    note: "50 photos: stills from IIIT's 20-year video, satellite screenshots, and our own photos from campus visits." },
  "S-CIVILRAW": { type: "photo", short: "Civil department visit photos (28 Oct 2026, uncaptioned)", tiny: "Civil photos",
    note: "Our uncaptioned photos from the visit to the abandoned civil engineering department." },

  /* web */
  "S-BLOG25": { type: "web", short: "IIIT blog: 25 Years of IIITH", tiny: "IIIT blog", url: "blogs.iiit.ac.in/?p=22437 and blogs.iiit.ac.in/?p=22443",
    note: "Says the first batch began on 2 Sep 1998 in what was once the District Collectorate office." },
  "S-BLOGCORP": { type: "web", short: "IIIT blog: How the corporates set up schools in IIITH", tiny: "IIIT blog", url: "blogs.iiit.ac.in/?p=22503",
    note: "IIIT's own account of the corporate schools and why the model faded." },
  "S-BLOGFOUNDERS": { type: "web", short: "IIIT blog: Corporate Founders Day (2023)", tiny: "IIIT blog", url: "blogs.iiit.ac.in/?p=22026",
    note: "Lists the corporate founding partners." },
  "S-IIITGLANCE": { type: "web", short: "iiit.ac.in, \"At a Glance\"", tiny: "IIIT site", url: "iiit.ac.in/?p=2214",
    note: "IIIT's website today: a 66-acre campus, founded 1998." },
  "S-NEWS-THUB": { type: "web", short: "Telangana Today (2022); Wikipedia: T-Hub", tiny: "News", url: "telanganatoday.com and en.wikipedia.org/wiki/T-Hub",
    note: "T-Hub opened on the IIIT campus on 5 Nov 2015 and moved to its own building in Raidurg on 28 Jun 2022." },
  "S-NEWS-SATYAM": { type: "web", short: "Wikipedia: Satyam scandal", tiny: "Wikipedia", url: "en.wikipedia.org/wiki/Satyam_scandal",
    note: "Satyam's chairman admitted to faking the accounts on 7 Jan 2009." },
  "S-WIKI-OLD": { type: "web", short: "Wikipedia: IIIT Hyderabad (old and new versions)", tiny: "Wikipedia", url: "en.wikipedia.org/wiki/International_Institute_of_Information_Technology,_Hyderabad",
    note: "Older versions say 62 acres, newer ones 66. The infobox lists the mascot as Jagruti, the banyan tree." }
};
