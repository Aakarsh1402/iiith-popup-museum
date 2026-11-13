# context.md: "Do You Know Your Institute?" pop-up museum (Team CakedUp, UPDH, IIIT-H)

This file is the single source of truth for everyone (humans and Claude Code agents) building the exhibit website and the physical exhibit. It collects everything decided in planning chats, everything in the interview transcripts and documents in `raw/`, and the plan for the physical boards.

**Read order for an agent:** sections 1 to 4 (situation, theme, rules), then 6 (sources), 7 (fact base), 8 to 10 (conflicts, verified, unverified). Sections 11 to 13 say what goes where. Section 14 is the physical build plan. `IMPLEMENTATION_PLAN.md` is the website build plan and depends on this file.

**Fact rule:** every fact shown on the site or a board must trace to a source ID in section 6. If a fact is not in this file or in a file under `raw/` / `sources/`, do not invent it. Mark gaps as `TODO(team)`.

---

## 1. The situation

- **Course:** UPDH (Understanding Public and Digital History), Monsoon 2026, IIIT Hyderabad. Instructor: **Prof. Isha Dubey**. The project is worth 30% of the grade.
- **Project:** a pop-up museum (a temporary exhibition in a non-museum space, aimed at people who don't usually visit museums).
- **Team CakedUp (5):** Aakarsh Mishra, Soham Chatterjee, Yogesh Krishna, Siddharth Choudhary, Saharsh.
- **Theme (approved):** "Do You Know Your Institute?", IIIT-H's infrastructural and operational history (buildings, spaces, systems, how the place runs).
- **Exhibition day:** Saturday 14 November 2026. Room and time: `TODO(team)`.
- **Phases already submitted:** Phase 1 theme (15 Sep), Phase 2 sub-themes and annotated exhibit list (1 Oct), Phase 3 floor plan and budget (15 Oct), Phase 4 exhibit text and promotional material (6 Nov). Phase 4 text is in `sources/documents/phase4_submission.txt`. The team itself calls it "very Claude-written and unverified", so use it for ideas and structure, not as a fact source. Its facts are only trusted where a transcript or document backs them.
- **Competition:** one other team has the same topic (IIIT buildings and operations). The TA and prof will compare the two. The other team reportedly has a clickable campus map where each building opens a timeline or images. Our advantages:
  1. More interviews: 7 transcripts, plus archival documents nobody else has (a c.2001 prospectus, lab floor plans, the 2002 layout plan, a 2016 Ping article).
  2. A real argument (section 2), not just a tour of buildings.
  3. Showing the historical method openly: conflicting memories, cross-checking, and correcting ourselves. This matches the UPDH syllabus.
- **Course ideas the prof will look for** (from lectures): what public history is and who its publics are; history vs historiography; memory and collective memory; **shared authority** (Frisch 1990): the public helps make the history, not just consume it; "whose history is it anyway"; for, about, with and by the public; reflexive practice; consent. A UPDH guest lecture argued for putting public-history material on **Wikimedia Commons / Internet Archive** instead of a project's own website, for longevity.
- **Earliest pitch framing** (Sept): the institute barely archives itself, and the people who keep it running (staff like Gopi, the librarian, the hostel office) are rarely in the official story. Keep this thread. Several of our best voices are staff, not faculty.

## 2. Big theme

### Title
**HISTREE: How IIIT Put Down Its Own Roots**
Subtitle / umbrella: **Do You Know Your Institute?** (keep this, it's the approved theme name and is on the posters)

### The argument in one paragraph (visitor-facing draft)
IIIT's logo is a banyan, and its mascot, Jagruti, is a banyan too. A banyan often starts life on another tree, then sends down roots of its own until it stands by itself. IIIT grew the same way. It started in borrowed government buildings, with borrowed teachers from the University of Hyderabad and company-run schools in its classrooms. Over 25 years it took those spaces back, built its own, lent a building to the state and got it back, and grew its own people. Even its trees were moved here from somewhere else.

### The "IIIT Way" (the sub-argument for Board 2)
**Borrow, share, take back, build your own.**
- Borrowed ground: started in the old Ranga Reddy district collectorate and court buildings (Vindhya, Nilgiri). [S-GOPI, S-PJN, S-BLOG25]
- Borrowed teachers: 5 or 6 faculty of its own; University of Hyderabad professors taught basic sciences and humanities. [S-PJN] The c.2001 prospectus lists 16 permanent and 12 visiting faculty, and says "Experienced R&D experts from Corporate Schools are active participants in education". [S-PROSP]
- Shared buildings: corporate schools (IBM, Oracle, Satyam, Motorola, Signal Tree, Cisco) inside the "Corporate Schools" building, now Vindhya. [S-PROSP, S-LAYOUT2002, S-BLOGCORP]
- Taken back: Vindhya fully reclaimed in 2007 [S-PJN]; Himalaya Block A bought out from TalentSprint in 2018 [S-PJN]; Himalaya Block D returned by T-Hub in 2022 [S-PJN, S-NEWS-THUB].
- Built its own: Himalaya complex on a 22 crore loan, repaid in 6 of 10 years; Block C fitted out with IIIT's own money [S-PJN]. Its own server room and self-hosted email [S-PJN]. IMS built in-house from 2017 [S-PRAB, S-RAJAN].
- IIIT as landlord too: an undated floor-space table lists **leased spaces** inside IIIT buildings: RGUKT, Kidosoft, SpectraForce, SBH (State Bank of Hyderabad), Xerox, Milk & Water, TalentSprint, Prudhvi (vacant). [S-FLOORPLANS]
- Grew its own people: Prof. R. Govindarajulu went from Principal of the IBM corporate school (1998 to 2000) to IIIT professor (2001). [S-PROSP, S-GOPI]

### Ending (exit wall)
**"Every generation here thought it had run out of room."** Show problems that felt unsolvable at the time and how each was solved, then point at today's crunch (triple-sharing rooms, batches near 300, crowded library and lecture halls) and the New Academic Block (NAB) going up. Details in section 13. **TODO(team):** confirm "space / crowding" is the current issue you want to end on.

## 3. Sub-themes, boards and monitors (overview)

| Zone | Board title | Sub-theme | Monitor default view (website route) |
|---|---|---|---|
| Entry table | Do You Know Your Institute? | Hook: quiz + fun facts | QR code card (printed); phones open `#/quiz` |
| Board 1 | Borrowed Ground (1998-2002) | Founding: land, buildings, first batch, early life | `#/timeline?era=founding` (auto-scroll) |
| Board 2 | Borrowed Branches: the IIIT Way | Corporate schools, take-backs, Himalaya, what IIIT built itself, the cut branch (Civil) | `#/way` |
| Board 3 | Moving Rooms | Buildings and room journeys, HISTREE trees, satellite change | `#/map` |
| Board 4 | How We Know | Voices, conflicts, verification, our own correction, the archive | `#/voices` |
| Exit wall | Every generation thought it had run out of room | Hope ending + visitor memories | `#/ending` (if a spare screen exists) |

**Monitors (updated 14 Nov):** we plan for 2 or 3. With 3: `?screen=history` (between Boards 1 and 2: timeline, then The IIIT Way), `?screen=map` (Board 3: map, then HISTREE), `?screen=evidence` (Board 4 + exit: How We Know, Voices, Then and Now). With 2: `?screen=left` and `?screen=right`. Every monitor can reach every page with the mouse; after 90 s idle each one goes back to its home view and cycles a short playlist (see `site/data/config.js`). The table above shows each board's main page.

## 4. Rules for all visitor-facing text (site and boards)

- Plain student voice. Short sentences. No jargon a first-year wouldn't know. **No em dashes** (the team avoids them in anything under their names). Avoid AI-sounding tells (no "delve", "tapestry", "testament", "rich history", "not just X but Y", triads for rhythm, "In conclusion").
- Each panel opens with a question or a surprising fact, then answers it.
- Length: board header under 60 words; panel under 120 words; label or card under 30 words. Site text can be longer in detail views, but each screen's first view should follow the same limits.
- Every panel and site item ends with a one-line source note: "Source: interview with Mr. Gopi (2026)" etc.
- Credit people by name only where they agreed to be named and quoted (consent was taken for interviews; **TODO(team):** confirm consent covers putting full transcripts on a website, and confirm Gopi is fine with the phone-booth comic).
- Quotes: only use wording that appears in a transcript. The PJN dossier is AI-polished (see 6.2). Do not put its phrasing in quote marks as PJN's words.
- Mark uncertainty honestly: "about", "around", "according to", "to confirm".
- Dates: write "1998", "around 2002", "c.2001". Never invent a precise date.

## 5. People

### Interviewees (7 transcripts)
| ID | Person | Role / connection | Years | Transcript |
|---|---|---|---|---|
| P-GOPI | Mr. Gopalakrishnan (Gopi) | Ran the campus phone booth, now guest house caretaker; on campus since 1998 | 1998 to now | `sources/transcripts/gopi.md` |
| P-SLN | SLN Shastry | One of the first 5 or 6 employees; engineering/estate side; saved the banyans; gave us the 2002 layout plan and the lab floor plans | 1998 to now (on extended service) | `sources/transcripts/sln-shastry.md` |
| P-PJN | Prof. P. J. Narayanan (PJN) | Former Director; faculty since Dec 2000 per the prospectus | 2000 to now | `sources/transcripts/pj-narayanan-dossier.md` |
| P-RAJAN | Prof. K. S. Rajan | Registrar (since 2022); heads the Lab for Spatial Informatics; joined IIIT 2006; advised the state govt in 2007-08 | 2006 to now | `sources/transcripts/ks-rajan-notes.md` (the notes file says "name not said in recording", but this is the Rajan interview, done 3 Nov 2026 by Aakarsh and Soham) |
| P-MURALI | G. Muralidhar | Librarian since 2005 (**not** 2002) | 2005 to now | `sources/transcripts/muralidhar-librarian.md` |
| P-PRAB | Prabhakar M | Joined 2007 (CSTAR lab), then Admissions, head of hostel administration (2016), Student Life Office (2019) | 2007 to now | `sources/transcripts/prabhakar-m.md` |
| P-SRIDHAR | Sridhar Kora | Hostel office in-charge since 2018 (succeeded B. Lakshmi Narayana); diploma in mechanical engineering, MBA | 2018 to now | `sources/transcripts/sridhar-kora.md` |

Phase 4 also mentions **Mr. Gopal Rao** (on companies that worked on campus) but there is no transcript in `raw/`. Do not use him unless the team supplies notes.

Leads never interviewed (from the Rajan interview): K. C. M. Sastry (accounts), "Anna", "BLM" (via Manu). Phase 2 leads: Venu Gopal, Shekhar, Umapathi, Mallesh, Naidu (early staff from the IIIT blog "Meet the Unseen Pillars of IIIT-H", 2018).

### Other people who appear in the history
- N. Chandrababu Naidu: Chief Minister of Andhra Pradesh who allotted the land and buildings. [S-GOPI]
- Prof. Raj Reddy: first Chairman of the Governing Council (Carnegie Mellon). [S-GOPI, S-PROSP]
- Prof. Narendra Ahuja: first Director (UIUC; visiting). Later returned to the USA. [S-GOPI, S-PROSP] Photo 27 shows the guest house room he used.
- Prof. Rajeev Sangal: next Director. Gopi says he came from the University of Hyderabad; the prospectus says IIT Kanpur faculty May 1980 to June 1998, then Director LTRC "IIIT Hyderabad/Satyam" from June 1998. [S-GOPI vs S-PROSP] (minor conflict)
- Prof. Ashok Jhunjhunwala (IIT Madras): later Chairman after Raj Reddy. [S-GOPI]
- Prof. R. Govindarajulu: Principal, IBM School of Enterprise Wide Computing, IIIT Hyderabad (Jan 1998 to Oct 2000), also "Visiting Professor, IIIT, Hyderabad since 1998", Director R&D at Essemm Information Systems, Visakhapatnam (Oct 2000 to Oct 2001), Professor at IIIT from Nov 2001 (prospectus p.10); earlier Professor of CSE at REC Warangal (1984-98). [S-PROSP] Gopi: "Prof. Govindarajulu from IBM chose to remain on campus, transitioning into full-time faculty". [S-GOPI] The Ping article lists him on the library's "Council of Chairs" [S-PING]; Muralidhar names the late Prof. R. Govindarajulu as the first faculty member active in the library [S-MURALI]. A 1999 alum calls him "larger than life... deeply revered and equally feared" (IIIT blog).
- Prof. C. N. Kaul: on the library Council of Chairs; brought in the first maths/CS books with "Prof. Rajulu". [S-PING]
- The "retired Commodore": early administrative official who forced the phone booth installation. Name unknown. [S-GOPI]
- Venu Gopal and Shekhar: two of the earliest staff, started at the IBM centre. [Phase 4, citing the 2018 IIIT blog. Treat as secondary.]
- Mr. Sharma / Prabhakar Sharma: the early librarian quoted in the Ping article; was an accountant before he joined IIIT as librarian; "Mr. Sahand" is named as the only librarian at first (OCR may be off). [S-PING]
- Student librarians named in Ping: Rupa Krishnan, Uday Kumar, Subarna Sathukan. [S-PING]
- Prof. Aniket Alam (HSRC): heads the library committee (6+ years). [S-MURALI]
- Naren Akash: first UGEE batch; formed the Club Council. [S-PRAB]
- B. Lakshmi Narayana: long-serving hostel office in-charge before Sridhar Kora. [S-SRIDHAR]

**Removed claim:** "Prabhakar sir and Raghu Reddy joined IIIT as summer interns" has **no source** in any transcript or document. Do not show it unless the team produces a source. (Note the Ping article's "Prabhakar Sharma" was a librarian, and Prabhakar M joined in 2007 as CSTAR lab staff.)

## 6. Source registry

Every site item and board panel cites one or more of these IDs. The site shows a source badge and links to the source's page in the Archive or Voices section.

### 6.1 Oral sources (interviews, 2026)
| ID | Source | Notes |
|---|---|---|
| S-GOPI | Interview with Mr. Gopi | Full transcript (summary-style prose). |
| S-SLN | Interview with SLN Shastry | Short summary; no land-size figure in it. |
| S-PJN | Interview with Prof. P. J. Narayanan | Delivered as a 4-page "Oral History Dossier". **AI-polished** (e.g. "Talon's Print" is a transcription error for TalentSprint; flourishes like "foundered on pedagogical realities", "symbiotic", "asserting academic sovereignty" are not his words). Facts are usable; phrasing is not quotable. |
| S-RAJAN | Interview notes, Prof. K. S. Rajan | Whisper transcript notes; some [unclear] items. |
| S-MURALI | Interview with G. Muralidhar | |
| S-PRAB | Interview with Prabhakar M | Last sentence is cut off ("The program Women in provided housing for the girls inside the new Parijat hostel..."). Don't use that line. |
| S-SRIDHAR | Interview with Sridhar Kora | One sensitive sentence was removed from the transcript for privacy before this repo went public. Never restore or paraphrase it. |

### 6.2 Documents (in `raw/`)
| ID | Document | What it is | Date |
|---|---|---|---|
| S-PROSP | `raw/IIIT_Hyderabad_prospectus_c2001.pdf` (11 pages; text in `sources/documents/prospectus_c2001_layout.txt`) | Early IIIT prospectus/brochure: programmes, curriculum, electives, research centres, infrastructure, faculty list with profiles. Domain `iiit.net`, enquiries `ugc@iiit.net`. | c.2001-02 (latest dated line: "Nov 2001 - present"; deemed university status already conferred; new library "under construction") |
| S-LAYOUT2002 | `raw/photos/50_layout-plan-2002-62-acres.jpeg` | "Layout plan of IIIT, Gachibowli (Area = 62.00 acres)". Got from SLN Shastry. **North points down** on this plan (compass at top right). Labels: IIIT Main Building (now Nilgiri), Corporate Schools (now Vindhya), Old Boys Hostel (with extension block), New Boys Hostel, Girls Hostel, Faculty Quarters, Guest House with lawn, play grounds with a dais, substation / APSEB control room, Gachibowli Stadium next door, roads to Hyderabad, BHEL and ISB. | 2002 |
| S-FLOORPLANS | `raw/Lab_floorplans.pdf` (27 pages, scanned) | Page 1: table "Floor space occupation in IIIT-H campus at Gachibowli" (centres in Vindhya Bhavan and Nilgiri Bhavan by floor, sq ft). Pages 2-24: floor plans per centre, each with block, floor and area. Pages 25-26: a longer version of the table (adds hardware labs, classrooms, MSIT, digital library, RGUKT temporary accommodation). Page 27: "Leased Spaces" table. | **Undated.** Contents point to roughly 2010-2016 (lists RGUKT, which started 2008; State Bank of Hyderabad, which merged into SBI in 2017; e-Sagu; CCNSB; Intel Multicore Lab). Say "undated, probably early 2010s". **TODO(team):** ask SLN Shastry for the year. |
| S-PING | `raw/ping_echoes_library_article.pdf` (3 pages, scanned; same file as `raw/interviews_corpus/library-ping.pdf`) | Ping! (student magazine) column "Echoes: A Letter from the Past - The Library" by Sneha Nanavati, shown as "10 years ago" (so about 2016; the article says the library was established "18 years ago"). Page 3 is a separate library notice about free publisher access during COVID-19 (2020). The article's header image is a photo of an old printed page titled "IIIT CORPORATE OFFERS" mentioning the "School of Enterprise Wide Computing". | c.2016; p.3 is 2020 |
| S-PHOTOS | `raw/photos/01..50_*.jpeg` + `sources/documents/captions.md` / `captions.json` | 50 captioned photos. See section 12. | various |
| S-CURRSHOTS | `raw/curriculum_screenshots/*.png` | 3 crops from the prospectus with highlights: HSSM electives (Vedanta), AI/NLP electives (Navya-Nyaya, Panini's Ashtadhyayi half courses), research centres (IT for Indian Society, IT for Railways) + a photo of a lab with CRT monitors. | c.2001 |
| S-PHASE4 | `sources/documents/phase4_submission.txt` | Our own Phase 4 text. Secondary. Contains at least one error (section 10). | Nov 2026 |
| S-CIVILRAW | `raw/interviews_corpus/civil_engineering_branch_uncaptioned/` (12 photos) + 2 loose photos | Uncaptioned originals from 28 Oct 2026; the captioned civil set is photos 39-48. Use the captioned set first. | Oct 2026 |

### 6.3 Web sources (checked during planning)
| ID | Source | Fact used |
|---|---|---|
| S-BLOG25 | IIIT blog: "25 Years Of IIITH" and related founding posts (blogs.iiit.ac.in/?p=22437, ?p=22443) | First batch kicked off on 2 Sep 1998 "from the premises of what was once the office of the District Collectorate". |
| S-BLOGCORP | IIIT blog: "How The Corporates Set Up Schools of Excellence in IIITH" (blogs.iiit.ac.in/?p=22503) | Vindhya was "previously known as the Corporate School building". Corporate schools: Metamor (later Keane), Oracle, IBM (set up 1998), Motorola, Satyam; Microsoft gave a Faculty Chair (2005, Prof. V. U. Reddy) instead of a school. Satyam's school ran about 4-5 years, in a Chettinad-style building with a central courtyard and an antique temple door; its staff found the campus "too far out". The model faded as IIIT turned to research and companies opened big Hyderabad offices. PPP was adopted because of the government's resource constraints. |
| S-BLOGFOUNDERS | IIIT blog: "IIITH Celebrates Corporate Founders Day" (2023) (blogs.iiit.ac.in/?p=22026) | Six corporate founding partners felicitated: IBM, Oracle, Metamor, Microsoft, Motorola, Satyam. NASSCOM is also a founding partner. |
| S-IIITGLANCE | iiit.ac.in "At a Glance" | Today: 66-acre campus, founded 1998, N-PPP model. |
| S-NEWS-THUB | Telangana Today (5 Nov 2022, 27 Jun 2022); Wikipedia "T-Hub" | T-Hub launched 5 Nov 2015 on the IIIT-H campus (about 70,000 sq ft); moved to its own building in Raidurg on 28 Jun 2022; the old building was to be returned to IIIT-H. |
| S-NEWS-SATYAM | Wikipedia "Satyam scandal" and news | Satyam chairman B. Ramalinga Raju confessed to falsifying accounts on 7 Jan 2009. |
| S-WIKI-OLD | Wikipedia article on IIIT-H (current and older versions) | Older versions say 62 acres, newer say 66. Infobox lists the mascot as "Jagruti - The Banyan Tree". |

## 7. Fact base (chronological)

Format: **year** | event | category | place | sources | confidence.
Categories: `buildings`, `operations`, `people`, `trees`, `land`, `curriculum`.
Confidence: `corroborated` (2+ independent sources agree), `single` (one source), `contested` (sources disagree, see section 8), `todo` (needs checking).

### Before and at founding
- **1990s** | Gachibowli reachable only by one district road from Mehdipatnam (also the only way to the University of Hyderabad). Past Tolichowki, almost nothing until IIIT. | land | area | S-RAJAN | single
- **1997-98** | Govt of Andhra Pradesh (CM N. Chandrababu Naidu) gives land and two existing buildings: Vindhya (former district collectorate) and Nilgiri (former district court) per Gopi; SLN says Nilgiri was an **unfinished** govt building lent for classrooms, labs and faculty rooms (first floor). Phase 4 says the buildings were made for the Ranga Reddy district collectorate and courts and handed over at nominal rent. | buildings/land | Vindhya, Nilgiri | S-GOPI, S-SLN, S-BLOG25 | contested (Nilgiri's origin)
- **1998** | Land allotted: **100 acres** according to Gopi; 30 acres later given up for the Gachibowli stadium's expansion. The 2002 layout plan and the c.2001 prospectus both say **62 acres**. IIIT's site says **66 acres** today. | land | campus | S-GOPI, S-LAYOUT2002, S-PROSP, S-IIITGLANCE | contested
- **1998** | Gachibowli was a village with forest-like land; bullock carts on the path near campus; bears, pigs and monkeys strayed in. | land | area | S-GOPI | single
- **1998** | Cyber Towers (HITEC City) opened with about 6 companies. | land | area | S-RAJAN | single
- **1998** | Founded as **Indian** Institute of Information Technology (signboard in photo 01; the Ping article says the same). Now **International** Institute of Information Technology. Prospectus c.2001 already uses "International". | operations | campus | S-PHOTOS(01), S-PING, S-PROSP | corroborated
- **1998** | Chairman Prof. Raj Reddy; Director Prof. Narendra Ahuja. | people | | S-GOPI, S-PROSP | corroborated
- **2 Sep 1998** | First batch starts. 50 seats, 49 joined. Students enrolled for a **Graduate Diploma in IT (GDIT)**, not a degree, trusting the institute to get university status. Email handles `@gdit.iiit.net` (students) vs `@iiit.net` (faculty), later unified to `iiit.ac.in`. | operations | Nilgiri | S-PJN, S-GOPI, S-BLOG25, S-PHOTOS(07, 08) | corroborated (49 of 50: Gopi; GDIT: PJN + photo 07 caption)
- **1998** | Only Nilgiri's first two floors in use: classrooms, labs, admin, exam halls. Three batches in three classrooms. The only large lecture hall: **SH-1** in Vindhya. 5 or 6 faculty; University of Hyderabad professors taught basic sciences and humanities. | buildings | Nilgiri, Vindhya SH-1 | S-PJN | single. Gopi: "the entire institute was housed in just two buildings: Nilgiri and Vindhya."
- **1998** | Nilgiri hosts IIIT's first server room, own hardware, self-hosted Zimbra email (later moved to Microsoft). Students co-administered systems. The Nilgiri servers are still running (2026) while the server room moves to the Vindhya IT wing. | operations | Nilgiri | S-PJN | single
- **2 Sep 1998** | Library opens with the institute in **Nilgiri 119, now Saranga Hall** (seats about 100). First books came on 22 Sep 1998: 175 books recorded that day; 345 by 28 Sep (Ping). Muralidhar: started with roughly 400 books, grew to 5,000 in Nilgiri. Open till midnight from the start. | buildings | Nilgiri 119 / Saranga Hall | S-PING, S-MURALI, S-PHOTOS(37, 38) | corroborated (location); book counts differ slightly
- **1998-2003** | The library was **student-run**: a "Student Librarian" programme paid Rs. 25 per hour of service; students worked about 18 hours a month and paid their room rent with it ("Learn and Earn"). Ran until 2002-03. Run by a "Council of Chairs" (Prof. C. N. Kaul, Prof. Govindarajulu, Prof. Sangal and others). | operations | library | S-PING | single
- **1998** | Housing: first batch lived in the **District Collector's bungalow and three flats**, on the spot where the New Academic Block is going up now (PJN). SLN: Vindhya served as temporary boys' housing, girls were in the **Judge's Quarters**. | buildings | NAB site, Vindhya | S-PJN, S-SLN | contested (partly; may be different years)
- **1998** | Before the hostel messes existed, the **guest house was the mess**. Old aerial photo shows the signboard "I.I.I.T Guest House, Mess & Lounge". The lobby today is where the mess was. | buildings | guest house | S-GOPI, S-PHOTOS(04, 30) | **corroborated (oral + photo)**
- **1998-c.2002** | **Phone booth story.** A retired Commodore (admin official) asked Gopi to run the guest house mess. Gopi felt it wasn't a one-man job and asked to run a public phone booth instead. Govt telecom officials kept delaying; one demanded a **Rs. 2,000 bribe**. Gopi, from a simple rural background, paid it, and still nothing happened. The Commodore found out, complained to senior govt authorities, and the booth was connected **the same day**. It served about **100 people a day**, with long queues from 8 pm to midnight when calls were cheaper. Around 2002, with mobile phones, it was dismantled, and Gopi became guest house caretaker. His room in the guest house is where the booth used to be (photo 29). | operations/people | guest house | S-GOPI, S-PHOTOS(29) | single (oral) + photo of place
- **1998-99** | Wild animals came in, so the administration built a boundary wall; local villagers broke sections to let cattle graze; police had to step in. | land | boundary | S-GOPI | single. (Handle neutrally if used; don't caricature villagers.)
- **Late 1990s (exact year unknown)** | **Four banyans saved.** Road widening in front of campus threatened four banyan trees. SLN Shastry got them transplanted instead: **Navjeevan** (moved three times: main road, then Bakul Nivas, then OBH), **Jagruthi**, a third in the Judge's Quarters area, a fourth near Buddha Nivas. | trees | main road, Bakul, OBH | S-SLN | single. **TODO(team):** year of the road widening; current photos tomorrow morning.
- **1998 on** | Corporate schools on campus. Prospectus c.2001 lists: IBM School of Enterprise-wide Computing; Oracle School of Advanced Software Technology; Satyam School of Applied Information Systems; Motorola School of Communication Technology; Signal Tree School of Excellence in Software Development Methodologies; CISCO Academy Training Centre. "There are 6 buildings that house the corporate schools." The 2002 layout plan labels today's Vindhya as "CORPORATE SCHOOLS". Photo 19 is a collage of IBM, Oracle, Motorola and Cisco labs. Corporate leaders helped design the curriculum (Gopi). | buildings/operations | Vindhya | S-PROSP, S-LAYOUT2002, S-PHOTOS(19), S-BLOGCORP, S-GOPI, S-PJN | corroborated
- **1998** | Rajeev Sangal: Director, Language Technologies Research Centre (LTRC), listed as "IIIT Hyderabad/Satyam" from June 1998. | people/operations | | S-PROSP | single
- **1999** | Second batch: intake 100, 99 joined. Housed army-style on **two-tier bunk beds inside Vindhya** (where block A4 and the library are now). | buildings | Vindhya | S-GOPI (99 of 100), S-PJN (bunks) | corroborated (different facts from each)
- **1999** | Construction of the **Old Boys Hostel (OBH)** begins in the second year; its first floor becomes a mess (Gopi). | buildings | OBH | S-GOPI | single
- **2000** | With govt help, **Palash Nivas and Parijat Nivas** open, then **Kadamb Nivas**; bunk beds come down (PJN). Gopi: in the third year the **New Boys Hostel (NBH)** and the NBH **Kadamba mess** were built; another mess on OBH's ground floor. Messes run on contract. | buildings | hostels | S-PJN, S-GOPI | corroborated in outline; **TODO(team):** check which current hostel names = "OBH", "NBH", "Girls Hostel" on the 2002 plan
- **2000-01** | Dual degree planned: B.Tech students could convert from 4 years to a 5-year research dual degree. Many converted early on; today single digits. | curriculum | | S-RAJAN, S-PROSP (lists "Five year Dual Degree M.Tech program") | corroborated
- **2001** | **Deemed university status.** GDIT era ends. | operations | | S-PJN, S-PROSP | corroborated
- **2001** | Library moves from Nilgiri 119 to **Vindhya A6** (ground floor; first floor was the UG1 workspace). | buildings | Vindhya A6 | S-MURALI | single
- **c.2001-02** | **Prospectus snapshot** (S-PROSP):
  - "autonomous, self-supporting institution established in 1998 with seed support from the Government of Andhra Pradesh"
  - Programmes: 4-year B.Tech; 5-year Dual Degree M.Tech; **M.Tech in IT for Building Sciences (for architects and civil engineers)**; 1-year PG Diploma; 2-year M.Tech; 1-year PG Diploma in Bioinformatics; PhD
  - 16 permanent + 12 visiting faculty
  - Campus 62 acres; "6 buildings that house the corporate schools"
  - "All students are provided with single room accommodation. Two hostels for men and one for women have a total of about 700 rooms."
  - "The PC to student ratio is 1:2"; 100 Mbps LAN; optical fibre between buildings
  - "A new air conditioned library with 20,000-sqft floor space is under construction"
  - Research centres: Center for Visual Information Technologies; Information Security; Data Engineering; VLSI and Embedded Systems; DSP and Communications; Language Technologies Research Centre; IT for Education; **IT for Indian Society**; **IT for Railways**; **Intelligent Buildings**; **Electronic Commerce**
  - Dot-com era electives: E-Commerce Technologies; Internet Appliances; Data Warehousing & Data Mining; Digital Design with VHDL; Web Information Systems; E-Services and E-Contracts (half course); Workflow Management Systems; Spatial Database Systems and GIS
  - Sanskrit-linguistics strand: **Vedanta** (HS2051, HSSM elective); **Navya-Nyaya** (HS4890, half course) and **Panini's Ashtadhyayi** (HS4895, half course) in the AI/NLP elective list; LTRC's book "Natural Language Processing: A Paninian Perspective" (Bharati, Chaitanya, Sangal, 1995)
  - Other HSSM: Philosophy, Science Technology & Society, Economics, History & Social Sciences, Hypermedia Art & Fiction, Conventional Management, Organizational Behaviour
  - B.Tech needs 175 credits; "modules" of a month or two for visiting experts
  - Faculty with civil/building backgrounds: Vishal Garg (B.E. Civil; Intelligent Buildings), Venkateswarlu Mandadi (structural dynamics)
  - curriculum / operations | | S-PROSP, S-CURRSHOTS | single (document)
- **2002** | Layout plan drawn: 62 acres; OBH (with an "extension block"), NBH, Girls Hostel, Faculty Quarters, Guest House, Corporate Schools, IIIT Main Building, substation. | buildings | campus | S-LAYOUT2002 | single (document)
- **2002** | Ping magazine starts, first called **"Echoes"**, with black-and-white photos of "a very barren IIIT". | operations | | S-PING | single
- **2002** | First graduating batch (photo 06). | people | | S-PHOTOS(06), S-PHASE4 | todo (batch and year to confirm)
- **22 Apr 2002 (year partly cut off)** | Neem tree planted by PGDIT-2002 students (hand-painted sign). | trees | | S-PHOTOS(49) | single
- **2002** | After 2002, companies move toward Gachibowli; the Mehdipatnam road becomes four-lane. | land | area | S-RAJAN | single
- **2003** | 1st Afro-Asian Games at Gachibowli (GMC Balayogi) stadium next door; official press meets held in the IIIT guest house. Later about 30 acres of IIIT land went to the stadium's expansion. | land/buildings | guest house, stadium | S-GOPI | single (year 2003 from Phase 4 and general knowledge; Gopi says "initial years")
- **2004-2011** | Library book exhibitions annually; biennial 2012-16; every semester since 2016. | operations | library | S-MURALI | single
- **2005** | **Four-mess system** with regional menus; flexible registration and cancellation from the start. **Yuktahar** started because students campaigned for clean, Ayurvedic-principle food. | operations | messes | S-PJN | single
- **2005** | Microsoft Faculty Chair (Prof. V. U. Reddy); helped attract Prof. B. Yegnanarayana from IIT Madras in 2006. | people | | S-BLOGCORP | single
- **2006** | K. S. Rajan joins. IT corridor at "end of phase one". | people | | S-RAJAN | single
- **2007** | IIIT takes full control of **Vindhya**; corporate rooms become research labs; Nilgiri gets an extra floor (PJN). Prabhakar M joins: "only Nilgiri was the academic block, and only two floors were being used" (S-PRAB). | buildings | Vindhya, Nilgiri | S-PJN, S-PRAB | single each (slightly inconsistent; fine)
- **2007-2010** | Labs built and moved lab by lab into a newer building; until about 2007 all faculty sat in the original building. | buildings | | S-RAJAN | single ([unclear] building names in the notes)
- **2007-08** | State-govt study (Rajan advised): close to 1,000 companies in the IT corridor (from about 6 in 1998). First shops nearby: Reliance Fresh and Spencer's opposite. | land | area | S-RAJAN | single
- **2007** | Fire: construction workers near a hostel damaged the substation cable; electrician Naidu shut the main panel, team worked past midnight. | operations | substation | S-PHASE4 citing IIIT blog 2018 | secondary
- **Vindhya then and now** (PJN's table): Blocks A1 & B2: Motorola corporate school, then advanced computing labs; **black granite floor and furniture put in by Motorola are still there**. B5: IBM & Oracle classrooms, then LTRC, now CSTAR. Current SPCRC: Motorola, then CVIT. SH-3 area: Satyam unit, then RRC. Library 2nd floor: B.Tech workstation hub (1 PC per 3), now library extension. | buildings | Vindhya | S-PJN | single
- **Early computing** | B.Tech students shared workstations 1:3 on the library's second floor; M.Tech 1:5; first-years couldn't bring a personal computer (PJN). Prospectus says PC ratio 1:2. | operations | Vindhya library | S-PJN vs S-PROSP | contested
- **Jan 2009** | Satyam scandal; Satyam's presence on campus lasted until around then. | operations | | S-GOPI, S-NEWS-SATYAM | corroborated in outline
- **2009** | CSTAR starts ICDCN; FSTTCS (2012). Labs funded by govt grants (CSTAR, with IIT Madras guidance) or private tenders (RRC, e.g. Nissan). | operations | CSTAR (where CQST is now) | S-PRAB | single
- **2009** | Batch trip to Gokarna: Purnima Resorts built a separate building to house the students. Trips stopped after COVID (logistics, batches near 300). | people | | S-PRAB | single
- **2010** | Dedicated **faculty quarters** open; before that faculty lived beside the hostels and ate at the same mess tables. A professor near Kadamb followed cricket matches from students' cheers. | buildings | | S-PJN | single
- **Before 2010** | Area around campus almost empty: IIIT, CMC (unclear), a few houses. | land | | S-RAJAN | single
- **c.2010-2016 (undated document)** | Floor-space survey (S-FLOORPLANS, p.1): centres total **92,017 sq ft**, all in Vindhya Bhavan (18,971 / 30,748 / 38,136 on floors 1-3) plus 4,162 on Nilgiri's 3rd floor. Biggest: **LTRC 13,734**; CCNSB 9,338; CIE 12,055 (handwritten edits); EQITEEC (Enh. Edu) 8,345; CVIT 6,817; RRC 4,336 (Vindhya B5, 3rd floor); C-STAR 4,286; ICTARD (e-Sagu) 3,896; EERC 3,606; CEH 3,435; C-VEST 3,160; CDE 3,029; SPRC 2,520; LSI 2,310; Science Lab 2,121; Cog. Sc. Lab 2,024; CITE 1,183; PSRC 1,073 (marked "vacant"); CBS 1,012 (Building Science Lab, Vindhya B2; shares a floor with KIDOSOFT); Intel Multicore Lab 529 (Nilgiri 3rd floor); SER Lab 444; Compilers Lab 196. **EERC** (1st floor, Vindhya C1/C2/B2) contains a **"CASE Lab"**. Pages 25-26 add: Hardware Labs (Nilgiri 1st floor, 6,621), MSIT 13,927, classrooms (29) 64,025 incl. 50,000 "other locations", Digital Library 1,108, RGUKT/temporary accommodation 11,749. **Leased spaces** (p.27): RGUKT 20,238; Kidosoft 1,000; SpectraForce 4,464; SBH 2,474; Xerox 61; Milk & Water 2,331; **TalentSprint 22,260** (7,260 in Vindhya + 15,000 elsewhere on campus); Prudhvi (vacant) 13,902 (C3, C4, C5); vacant 388. Total leased 67,118 sq ft. | buildings | Vindhya, Nilgiri | S-FLOORPLANS | single (document)
- **2011-12** | DLF built in Gachibowli. | land | area | S-PRAB | single
- **Himalaya complex (year TODO)** | Built on a **22 crore rupee loan** (about 70 crore today); 10 years to repay, paid off in 6. Arrived as bare shells. **Block C** (lecture halls, exam centre) fitted out with IIIT's own funds. **Block A** (now admin) fitted out with **TalentSprint**, bought out in 2018. **KRB (Kohli Research Block)** built with **TCS**. **Block D** given to the Telangana govt as **T-Hub** (2015-22), reclaimed 2022 and given to research groups (RRC, LSI, HSRC, SERC, Precog, a TCS research wing). Some faculty worried at the time about giving academic space to the state. The ground where Himalaya stands used to be a cricket ground where faculty and students played together. | buildings | Himalaya | S-PJN, S-PRAB (cricket ground) | single. **Correction:** the team's belief that "Himalaya was the only academic building with no corporate involvement" is **wrong**; only Block C was self-funded. **TODO(team):** construction years.
- **5 Nov 2015** | **T-Hub** launched in Himalaya Block D (about 70,000 sq ft), a partnership of the Telangana govt with IIIT-H, ISB and NALSAR. | buildings | Himalaya D | S-NEWS-THUB, S-PJN | corroborated
- **2016** | Library's upper floor added to the main library. Prabhakar M becomes head of hostel administration and starts digitising registers, reports, utility bills. | buildings/operations | | S-MURALI, S-PRAB | single
- **c.2016** | Ping's "Echoes" library column published. | operations | | S-PING | |
- **2017** | **IMS** (institute management system): hostel room allocation and shifting first; office paperwork starts moving off paper files (cloth/card govt-style folders) one process at a time. Some records still kept on paper for audit rules. | operations | | S-PRAB, S-RAJAN | corroborated
- **2018** | **UGEE** admission exam starts (counselling in H119 and H105). Earlier experiments: WREE (Winter Research Entrance Exam), NOK (NTSE/Olympiad/KVPY). | operations | | S-PRAB | single
- **2018** | Library RFID tagging (students helped). Atomberg fans across hostels and campus (IIIT was an early customer of the IITB startup). Sridhar Kora joins. Himalaya Block A bought out from TalentSprint. | operations | | S-MURALI, S-PRAB, S-SRIDHAR, S-PJN | single each
- **2018 (14 Mar)** | Satellite image of the amphitheatre/basketball area (only dated satellite image we have). | buildings | amphitheatre | S-PHOTOS(32) | single
- **2019** | Prabhakar M moves to the Student Life Office. | people | | S-PRAB | single
- **2020** | COVID: classes and exams move to CodeTantra; Sridhar says IIIT was the first institution in Hyderabad to go fully online. Library e-resources free over VPN with publisher deals. Rest of the library's first floor becomes a reading room. | operations | | S-SRIDHAR, S-MURALI, S-PING(p.3) | single each
- **28 Jun 2022** | T-Hub moves to its own building in Raidurg; Block D returns to IIIT. | buildings | Himalaya D | S-NEWS-THUB, S-PJN | corroborated
- **2022** | K. S. Rajan becomes Registrar. | people | | planning research | single
- **2025** | D-block washrooms renovated ahead of the UG2k25 batch. | buildings | | S-SRIDHAR | single
- **Hot water (undated, after 2018)** | Solar heaters were enough for a few hundred students; as numbers grew, electric geysers were tried but heated too slowly for the morning rush; the team visited BITS Pilani Hyderabad, saw heat pumps, installed them, and "permanently resolved the issue". | operations | hostels | S-SRIDHAR | single
- **Room sharing over time** | Single rooms (prospectus c.2001: "All students are provided with single room accommodation"), then double, now **triple sharing**, which causes day-to-day roommate friction. Summer project interns: six-sharing rooms with bunk beds. | buildings | hostels | S-PROSP, S-SRIDHAR | corroborated
- **Campus life details** | Convocations used to be on the football ground under tarpaulin tents. Srujana Cultural Centre had halls for dance and music clubs, a parliament room and a playschool. A gate near the Felicity ground led to the GMC Balayogi Stadium (people queued for the swimming pool). An Honesty Shop near the hostels. Mental health counselling now sits where the Centre for IT in Education was (Virtual Labs project). | operations | | S-PRAB | single
- **2026** | Library: about 50,000 volumes; new meeting room and reading cubicles; will move to the **New Academic Block (NAB)** when it's done. NAB under construction (satellite sequence 09-14). Main big lecture hall: SH-1 then **H105**, next NAB. Server room moving from Nilgiri to Vindhya IT wing. | buildings | NAB | S-MURALI, S-PJN, S-PHOTOS(09-14) | corroborated
- **Civil engineering department (dates TODO)** | Now abandoned: padlocked Hydraulics Lab, Soil Mechanics Lab, Building Materials & Construction Lab, Engineering Workshop; an old concrete mixer; a notice board still holding old Telugu newspaper clippings; a CIT (Certificate in IT / EnhanceEdu) poster; a "Laboratory Dos and Don'ts" notice (photos 39-48). Documentary traces: prospectus c.2001 lists **M.Tech in IT for Building Sciences (for architects and civil engineers)** and an **Intelligent Buildings** research centre; floor-space survey lists **EERC** (with a CASE Lab) and **CBS / Building Science Lab**. IIIT today is CS/ECE/research only. **TODO(team):** when Civil / CASE was started and closed, and which building the abandoned department is in. Do not guess these. | buildings/curriculum | `TODO(team)` | S-PHOTOS(39-48), S-PROSP, S-FLOORPLANS | single

### Fun facts pool (for the Start screen loop and the quiz)
Each must keep its source.
1. The first batch had 50 seats; 49 students joined. [S-GOPI]
2. The first batch enrolled for a diploma (GDIT), not a degree. Their emails ended in @gdit.iiit.net. [S-PJN]
3. In 1999 a whole batch slept on bunk beds inside Vindhya. [S-PJN]
4. The guest house was the first mess. Its old sign read "Mess & Lounge". [S-GOPI, photo 04]
5. Gopi's room in the guest house is where the campus phone booth used to be. [S-GOPI, photo 29]
6. The library started in Saranga Hall with 175 books on its first day of books. [S-PING]
7. Student librarians earned Rs. 25 an hour and paid their room rent with it. [S-PING]
8. The library is now on its second home and about to move to a third (NAB). [S-MURALI]
9. Navjeevan the banyan has been moved three times. [S-SLN]
10. One of the saved banyans is called Jagruthi, the same name as the IIIT mascot. [S-SLN, S-WIKI-OLD (infobox: "Mascot: Jagruti - The Banyan Tree")]
11. Look down in Vindhya A1 and B2: the black granite floor was put in by Motorola. [S-PJN]
12. Vindhya used to be called the Corporate Schools building. [S-LAYOUT2002, S-BLOGCORP]
13. IIIT took a 22 crore loan to build Himalaya and paid it off 4 years early. [S-PJN]
14. Himalaya Block D was T-Hub, Telangana's startup incubator, from 2015 to 2022. [S-NEWS-THUB, S-PJN]
15. Around 2001 every student had a single room. [S-PROSP]
16. Around 2001 you could take electives in Vedanta, Navya-Nyaya and Panini's Ashtadhyayi. [S-PROSP]
17. IIIT once had a research centre called "IT for Railways". [S-PROSP]
18. The 2002 campus plan says 62 acres. Today IIIT says 66. Gopi remembers 100. [S-LAYOUT2002, S-IIITGLANCE, S-GOPI]
19. The first IIIT servers in Nilgiri are still running. [S-PJN]
20. Before 2017 the office ran on paper files. [S-RAJAN]
21. IIIT was among the first customers of Atomberg fans (2018). [S-PRAB]
22. A Gokarna resort built a separate building for IIIT's 2009 batch trip. [S-PRAB]
23. The 2003 Afro-Asian Games press meets were held in IIIT's guest house. [S-GOPI]
24. The prof living near Kadamb followed cricket matches by listening to students cheer. [S-PJN]
25. The ground where Himalaya stands used to be a cricket pitch where faculty played with students. [S-PRAB]

## 8. Conflict cards (memories and documents that disagree)

These go on Board 4 and the `#/how-we-know` page. Each card: question, the competing accounts with sources, what we think and why, what would settle it.

**C1. Why did the corporate schools leave?** (strongest card)
- PJN: the model didn't work. Company trainers taught company tools and basic Java, not the theory IIIT wanted, so IIIT went back to faculty-led teaching and took back Vindhya in 2007. [S-PJN] (paraphrase only)
- Gopi: the companies moved out as they built or bought their own offices in Hyderabad. Some people stayed (Prof. Govindarajulu from IBM became faculty; similar with Oracle). Satyam stayed until around its scandal. [S-GOPI]
- IIIT's own blog: the model "faded" as IIIT became more research-focused and companies set up bigger Hyderabad offices. [S-BLOGCORP]
- Document: the prospectus (c.2001) calls corporate schools "one of the major strengths of the IIIT". [S-PROSP]
- Our take: all can be true at once. An insider who ran academics remembers a teaching problem, a staff member remembers companies leaving, the institution's blog tells the smoothest version. Who tells the story shapes the story.

**C2. How big is the campus?**
- Gopi: 100 acres allotted; 30 later went to the stadium. [S-GOPI]
- 2002 layout plan (from SLN Shastry): 62.00 acres. [S-LAYOUT2002]
- Prospectus c.2001: 62 acres. [S-PROSP]
- IIIT website today: 66 acres. [S-IIITGLANCE]
- Our take: two documents from around 2002 agree on 62. Gopi's 100 may be the original allotment before the stadium took land. The change from 62 to 66 needs an explanation we don't have. Settle with the land papers (Rajan says they are under lock and key).

**C3. What was Nilgiri before IIIT?**
- Gopi: it housed the district court. [S-GOPI]
- SLN Shastry: an unfinished government building, lent to IIIT. [S-SLN]
- Our take: both can be true (a building meant for the court, not finished). Phase 2 research (IIIT blog) also says Nilgiri and Vindhya were built as the district court and collectorate.

**C4. How many students per computer?**
- PJN: 3 B.Tech students per workstation, 5 M.Tech students per workstation; first-years couldn't bring a PC. [S-PJN]
- Prospectus: "The PC to student ratio is 1:2." [S-PROSP]
- Our take: a prospectus is written to attract students. Memory and brochures both have reasons to round. Good teaching card: **documents are sources with motives too**.

**C5. Where did the first students live?**
- PJN: the District Collector's bungalow and three flats (1998); bunks in Vindhya (1999). [S-PJN]
- SLN: Vindhya as temporary boys' housing; girls in the Judge's Quarters. [S-SLN]
- Our take: probably different moments; neither says the other is wrong.

**C6. Where was the first teaching?**
- PJN: only Nilgiri's first two floors, plus SH-1 in Vindhya. [S-PJN]
- Gopi: the whole institute was in two buildings, Nilgiri and Vindhya. [S-GOPI]
- Minor; can merge into C3 or skip.

**C7. Where did Rajeev Sangal come from?** (minor, optional)
- Gopi: University of Hyderabad. Prospectus: IIT Kanpur faculty until 1998. Keep off the boards unless space allows.

## 9. Verified cards (independent sources that agree)

**V1. The guest house was the mess.** Gopi said so; then we found an old aerial photo of the guest house with the signboard "I.I.I.T Guest House, Mess & Lounge" (photo 04), and today the lobby is where it was (photo 30). [S-GOPI, S-PHOTOS]

**V2. The library started in Saranga Hall.** Muralidhar (librarian since 2005) and a 2016 Ping article written from a different librarian's memory both say Nilgiri 119 / Saranga Hall. Photos 37-38 show it today as a lecture hall. [S-MURALI, S-PING]

**V3. A corporate-school head became an IIIT professor.** Gopi said "Prof. Govindarajulu from IBM" stayed on as faculty. The c.2001 prospectus confirms: Principal, IBM School of Enterprise Wide Computing, Jan 1998 to Oct 2000; Professor at IIIT from Nov 2001. Ping and Muralidhar both place him at the centre of the early library. [S-GOPI, S-PROSP, S-PING, S-MURALI]

**V4. Every student once had a single room.** Sridhar Kora: single, then double, now triple. The prospectus: "All students are provided with single room accommodation." [S-SRIDHAR, S-PROSP]

**V5. Vindhya was the corporate schools building.** 2002 layout plan label + IIIT blog + prospectus + photo 19. [S-LAYOUT2002, S-BLOGCORP, S-PROSP, S-PHOTOS]

**V6. T-Hub was in Himalaya Block D, 2015 to 2022.** PJN + news reports. [S-PJN, S-NEWS-THUB]

**V7. The substation on IIIT land.** Rajan said a power substation sits on IIIT land, leased to the utility. The 2002 layout plan shows a "Substation" and "APSEB Control Room" at the campus edge. [S-RAJAN, S-LAYOUT2002]

**Our own correction card (put this on Board 4, it's the most "historian" thing we can show):**
"Our Phase 4 draft said Mr. Gopi managed the first mess. When we re-read his interview, he says he turned that job down and ran the phone booth instead. We fixed it. History gets corrected when you go back to the source." [S-PHASE4 vs S-GOPI]

## 10. Unverified, wrong or sensitive (do not show as fact)

| Claim | Status | What to do |
|---|---|---|
| "Himalaya was the only academic building IIIT paid for in full, with no corporate involvement" | **Wrong** per PJN: only Block C self-funded; A with TalentSprint, KRB with TCS, D to T-Hub | Say "Block C" instead |
| "Prabhakar sir and Raghu Reddy joined as summer interns" | No source | Drop, or get a source |
| Librarian "there since 2002" | Wrong; Muralidhar since 2005 (library existed since 1998) | Fix |
| SLN Shastry gave a land size | His transcript has no number; his **map** says 62 acres | Frame the conflict as Gopi vs SLN's map |
| Phase 4: "Mr. Gopi managed [the mess]" | Contradicted by Gopi | Correction card (section 9) |
| Phase 4: Gopi chased "wild boars, deer and buffaloes" | Gopi's transcript says bears, pigs, monkeys | Use the transcript |
| Phase 4: phone booth "in 2000 ... for two years" | Gopi: started early, dismantled around 2002 | Use "until around 2002" |
| PJN dossier wording ("lacked academic rigor", "foundered", "symbiotic", "Talon's Print") | AI-polished | Paraphrase facts; TalentSprint is correct |
| The "waterfall" story (companies realised they had to get more involved, so instructors joined full-time) | Partly supported (Govindarajulu, Venu Gopal, Shekhar stayed) but PJN says the model failed | Present as C1 |
| T-Hub "2015 to 2012" | Typo | 2015 to 2022 |
| Himalaya construction years | Unknown | TODO(team) |
| Civil department start/closure dates and building | Unknown | TODO(team) |
| Floor plans' year | Undated | "undated, probably early 2010s" |
| First graduating batch year | Unconfirmed | TODO(team) |
| The sensitive sentence removed from Sridhar's interview | Removed for privacy | Never show or paraphrase |
| Gopi's bribe story | Fine to show (official unnamed) | Get Gopi's OK for the comic; never name or draw an identifiable official |

## 11. Room and space journeys (for the Map page and Board 3)

Each journey is a short ordered list of stops: place, years, what it was, source.

1. **The library:** Nilgiri 119 / Saranga Hall (1998; 175 books on first delivery day, about 400 early, 5,000 by the end of the Nilgiri years; open till midnight; student-run until 2002-03) -> Vindhya A6 ground floor (2001) -> upper floor added (2016) -> rest of first floor a reading room (2020); RFID 2018; about 50,000 volumes (2026) -> New Academic Block (coming). Side note: a 20,000 sq ft library was "under construction" around 2001 (prospectus). **TODO(team):** was that the Vindhya A6 space? [S-PING, S-MURALI, S-PROSP]
2. **The big lecture hall:** SH-1 in Vindhya (the only large hall in 1998) -> H105 (today; also used for UGEE counselling in 2018) -> NAB. [S-PJN, S-PRAB]
3. **Where you eat:** guest house "Mess & Lounge" (1998) -> OBH first floor, OBH ground floor, NBH Kadamba mess (1999-2001) -> four-mess system (2005) -> Yuktahar (student campaign). [S-GOPI, S-PJN, photo 04/30]
4. **Where you sleep:** Collector's bungalow + 3 flats / Judge's Quarters (1998) -> bunks in Vindhya (1999) -> Palash, Parijat, Kadamb (2000); OBH, NBH, Girls Hostel on the 2002 plan; about 700 single rooms c.2001 -> double -> triple sharing now; interns six to a room. The bungalow site is now the NAB site. [S-PJN, S-SLN, S-GOPI, S-PROSP, S-SRIDHAR, S-LAYOUT2002]
5. **Vindhya's rooms:** corporate schools (1998 to 2007) -> research labs (2007 on) -> today (see PJN's table in section 7). Motorola granite still in A1/B2. [S-PJN]
6. **Labs moving out:** Vindhya labs (floor-space survey, early 2010s) -> some to Himalaya Block D after 2022 (RRC, LSI, HSRC, SERC, Precog). RRC: Vindhya B5 3rd floor in the survey -> Himalaya D now. LSI: Vindhya B2 3rd floor -> Himalaya D. [S-FLOORPLANS, S-PJN]
7. **The server room:** Nilgiri (1998, still running) -> Vindhya IT wing (moving now). [S-PJN]
8. **The cricket ground:** faculty-student cricket -> Himalaya complex. [S-PRAB]
9. **Himalaya Block D:** shell -> T-Hub (2015-22) -> research labs (2022). [S-PJN, S-NEWS-THUB]
10. **Himalaya Block A:** shell fitted out with TalentSprint -> bought out 2018 -> admin block. [S-PJN; TalentSprint also in S-FLOORPLANS leased spaces]
11. **The guest house:** mess and lounge, press centre for the 2003 Afro-Asian Games, Narendra Ahuja's room, phone booth -> guest house today. [S-GOPI, photos 04, 20-30]
12. **Centre for IT in Education (Virtual Labs) -> mental health counselling office; CSTAR lab -> where CQST is now.** [S-PRAB]
13. **Navjeevan the banyan:** main road -> Bakul Nivas -> OBH. [S-SLN] (photo 05 shows OBH with a young banyan)

## 12. Image inventory (`raw/photos/`, captions in `sources/documents/captions.md`)

| # | File | What | Use |
|---|---|---|---|
| 01 | early-main-gate-signboard | "Indian Institute of Information Technology" gate sign (20-year video still) | Board 1, Start, timeline 1998 |
| 02 | road-to-obh | Early empty road to OBH | Board 1, Gachibowli 1998 |
| 03 | early-classroom | Early classroom | Board 1 |
| 04 | early-guest-house | Aerial: "I.I.I.T Guest House, Mess & Lounge" on red soil | V1, Board 3/4, guest house hotspot |
| 05 | early-obh-young-banyan | OBH with young banyan | HISTREE, OBH hotspot |
| 06 | first-graduating-batch | Group photo (year TODO) | Timeline, Board 1 |
| 07 | gdit-first-batch-inauguration | GDIT first batch inauguration | Board 1 "diploma on trust" |
| 08 | early-lecture-audience | Same event probably | Board 1 |
| 09-14 | new-academic-block-1..6 | Satellite sequence of the NAB site | Map "then/now" sequence, ending ("next answer") |
| 15-18 | felicity-ground-1..4 | Satellite sequence | Map |
| 19 | corporate-schools-collage | IBM, Oracle, Motorola, Cisco labs | Board 2 |
| 20 | guest-house-team-photo | Team at guest house with staff | Board 4 (process); names TODO |
| 21-25, 28 | guest house interiors | Kitchen, pantry, dining hall, twin room, meeting room, balcony room | Guest house page gallery |
| 26 | framed-photo-banyan-meditation | Framed photo of a woman meditating under a campus banyan | HISTREE |
| 27 | narendra-ahuja-guest-house-room | Room the first Director used | Guest house, people |
| 29 | gopi-room-former-phone-booth | Gopi's room = old phone booth | Comic, Board 1 |
| 30 | guest-house-lobby-former-mess | Lobby = old mess | V1 |
| 31-32 | amphitheatre-1..2 | Satellite; 32 dated 14 Mar 2018 | Map |
| 33-36 | bakul-nivas-1..4 | Satellite sequence (construction) | Map, Navjeevan journey |
| 37-38 | saranga-hall entrance/inside | Former library | V2, library journey |
| 39-48 | civil-dept-* | Abandoned civil engineering department | Board 2 "the branch that was cut", Archive |
| 49 | neem-tree-pgdit-2002 | Neem planted by PGDIT-2002 | HISTREE |
| 50 | layout-plan-2002-62-acres | 2002 layout plan, 62 acres | Map base layer, C2, Board 3 centrepiece |

Also: `raw/interviews_corpus/saranga hall the past library, now a lecture hall.jpeg`, `raw/interviews_corpus/WhatsApp Image 2026-10-28 at 7.16.09 PM.jpeg` and 12 uncaptioned civil photos in `raw/interviews_corpus/civil_engineering_branch_uncaptioned/`. The prospectus PDF has embedded photos (lab with CRT monitors etc.); extract them with `pdfimages`. The Ping PDF's page 1 includes an image of an old "IIIT CORPORATE OFFERS" newspaper/magazine page.

**Still needed from the team (TODO):**
- A present-day campus base image (Google Earth/Maps screenshot, roughly the same framing as the 2002 plan; note the 2002 plan has north pointing **down**, so rotate one of them 180 degrees). Needed for the "2002 vs today" slider.
- Tomorrow morning: photos of the banyans (Navjeevan at OBH, Jagruthi, the Judge's Quarters one, the Buddha Nivas one) and of the Motorola granite floor in Vindhya A1/B2.
- Interviewee portraits, only with consent; otherwise use initials.
- Google Earth timelapse clip or yearly screenshots of Gachibowli (Rajan: Google has about 2005 then about 2010).
- Year for the floor plans, the road widening, Himalaya construction, Civil department dates.

## 13. Hope ending ("Every generation here thought it had run out of room")

| Then | Why it felt stuck | How it got solved | Source |
|---|---|---|---|
| 1998 | No university status, so no degree to promise; 49 students joined on trust for a diploma | Deemed university in 2001 | S-PJN |
| 1999 | No hostels; a batch slept on bunks inside an academic building | Palash, Parijat, Kadamb by 2000 | S-PJN |
| 1998-2000 | Only 5 or 6 faculty | Borrowed teachers (University of Hyderabad, companies), then built its own faculty (16 permanent by c.2001) | S-PJN, S-PROSP |
| Early years | A phone line stuck on a bribe | Connected the same day once someone complained | S-GOPI |
| Corporate teaching didn't work | The model IIIT started with | IIIT changed course and took Vindhya back (2007) | S-PJN |
| No money to build | 22 crore loan for Himalaya | Repaid in 6 of 10 years | S-PJN |
| Hot water ran out as numbers grew | Solar not enough, geysers too slow | Heat pumps, "permanently resolved" | S-SRIDHAR |
| The library outgrew its room | 100 seats in Saranga Hall | Moved to Vindhya, grew to two floors, now heading to NAB | S-MURALI |
| COVID | Campus shut | Fully online on CodeTantra, library e-resources free | S-SRIDHAR, S-MURALI |

Now: triple-sharing rooms, interns six to a room, batches near 300, crowded library and halls. The NAB is going up on the same spot where the first batch lived in 1998. [S-SRIDHAR, S-PRAB, S-PJN, photos 09-14]
Closing line (draft): "Every problem on this wall felt permanent to the people living through it. None of them were. What's the one today that will be a story in ten years?" (prompt for the sticky-note wall)

## 14. Physical exhibit build plan

Assumes the Phase 3 layout (entry table, boards along the walls, two tables) and 3-4 monitors with laptops. Adjust to the room on the day. Print in colour where photos are involved; A3 for panels, A4 for cards. Use cardboard backing + foam tape so panels stand off the softboard.

### 14.1 Entry (Table 1)
- **Title board (2x3 ft):** "HISTREE: How IIIT Put Down Its Own Roots" / "Do You Know Your Institute?" / 2-line argument / big QR code to the quiz (QR target TODO until hosting; print a placeholder sticker spot) / "Team CakedUp, UPDH, 14 Nov 2026". Draw or print a banyan with labelled roots (Borrowed Ground, Borrowed Branches, Moving Rooms, How We Know): the roots act as the visitor's route map.
- **Quiz cards (paper fallback), ~40 copies, A5:** 8 questions, entry score + exit score boxes. Answer key on the back of the exit scoreboard, not on the card.
- **Exit scoreboard (A2 or chart paper):** two columns, entry score and exit score; visitors add tally marks.
- **Monitor (optional) or tablet:** fun-fact loop `#/start`.

### 14.2 Board 1: Borrowed Ground (1998-2002)
- Header card (A3): question + 50-word intro.
- Panels (A3, each under 120 words + 1-2 photos):
  1. "Gachibowli, 1998": village, one road, bears and bullock carts, 6 companies at Cyber Towers. Photos 02, 01. [S-GOPI, S-RAJAN]
  2. "A college in borrowed buildings": collectorate and court, Nilgiri's two floors, SH-1, 5-6 faculty + University of Hyderabad professors. Photo 03. [S-PJN, S-GOPI, S-SLN]
  3. "A diploma on trust": 49 of 50, GDIT, @gdit.iiit.net, deemed 2001. Photos 07, 08. [S-PJN, S-GOPI]
  4. "Where did they sleep?": bungalow, Judge's Quarters, bunks in Vindhya, hostels 2000. [S-PJN, S-SLN]
- **Comic strip (4 x A4 panels, hand-drawn is fine and looks better):** the phone booth story (section 7). Rules: the official is a faceless silhouette, never named; Gopi drawn kindly; caption under each panel; source line "As told by Mr. Gopi (2026)". Photo 29 pinned next to it: "This is the room today."
- Monitor: timeline, founding years.

### 14.3 Board 2: Borrowed Branches (the IIIT Way)
- Header: "Borrow, share, take back, build your own."
- Panels:
  1. "Companies in the classroom": six corporate schools (prospectus list), photo 19, a print of the prospectus page listing them, the Ping page-1 image of "IIIT CORPORATE OFFERS". [S-PROSP, S-PING]
  2. "Vindhya then and now" table (PJN). Sticky note arrow: "Go look at the floor in A1 and B2: Motorola's granite is still there." [S-PJN]
  3. "Who stayed": Govindarajulu evidence trio (Gopi quote-paraphrase, prospectus profile crop, Ping mention). [V3]
  4. "Himalaya: a loan and four blocks" + **cardboard model**: 4 boxes arranged like Himalaya, each colour-coded: C green "IIIT's own money", A orange "TalentSprint, bought out 2018", KRB blue "built with TCS", D purple "T-Hub 2015-22, back to IIIT 2022". Label: "22 crore loan, paid off in 6 of 10 years." [S-PJN]
  5. "IIIT the landlord": leased-spaces table from the floor-plan file (RGUKT, TalentSprint, SBH, Xerox, Milk & Water...). [S-FLOORPLANS]
  6. "What IIIT built itself": servers in Nilgiri, self-hosted email, IMS (2017), first fully online in Hyderabad (2020). [S-PJN, S-PRAB, S-SRIDHAR]
- **Bottom strip, "A branch that was cut":** 4-6 civil department photos (39, 42, 43, 46, 40, 44) in a row on black card, with one panel: prospectus "M.Tech in IT for Building Sciences" + EERC/CASE lab floor-plan crop + "IIIT is now CS, ECE and research only." Dates TODO; if unknown, say "We couldn't find out when it closed. Do you know? Tell us." (turns a gap into participation).
- Monitor: `#/way`.

### 14.4 Board 3: Moving Rooms
- Centrepiece: **2002 layout plan printed big (A2 or A1)**, with coloured pins on buildings, and red thread from each pin to a journey card around the edge.
- Journey cards (A5 flash cards, 6 to 8): library, big lecture hall, where you eat, where you sleep, Vindhya's rooms, server room, cricket ground to Himalaya, Block D. Each is a vertical strip of stops with years (section 11). Library card gets the Saranga Hall photos (37, 38).
- **HISTREE strip** (green card): four banyans with tomorrow's photos; Navjeevan's three moves drawn as a mini map; photo 05 (young banyan at OBH), photo 26 (framed banyan photo), photo 49 (PGDIT-2002 neem). Line: "Even the trees were moved here and took root."
- **Satellite flip book or strip:** NAB 09-14, Bakul 33-36, Felicity ground 15-18.
- **Hangout sticker map** (from Phase 4): a current campus print with coloured dot stickers by joining year (red before 2005, yellow 2005-14, green 2015-22, blue 2023 on). Keep it if a current map print is available; otherwise drop.
- Monitor: `#/map`.

### 14.5 Board 4: How We Know
- **Voices wall:** 7 cards (A5) with name, role, years at IIIT, one-line "what they told us", and a QR/short link to their page `#/voices/<id>` (QR TODO with hosting). Big number: "7 interviews". Consent note: "Everyone here agreed to be recorded and quoted."
- **Conflict flip cards (A4 on cardboard, hinged with tape):** C1, C2, C4 (and C3 if space). Front: the question + "Who's right?" + the competing accounts in two colours. Lift the flap: what we think, what would settle it.
- **Verified cards:** V1 (Gopi's words + photo 04 + photo 30, joined by red thread), V2, V3.
- **Correction card:** "We got it wrong" (section 9), printed in red ink style.
- **Archive table (or bottom of board):** physical prints of: floor-space table (p.1), 2 or 3 lab floor plans (LTRC, RRC, EERC/CASE), prospectus pages with the curriculum highlights ("Curriculum as a period piece": Vedanta, Navya-Nyaya, Panini, IT for Railways, E-Commerce, VHDL, Internet Appliances), the Ping article, and the blank government-style file folder (if Rajan's office gave it). Card: "This should not live only on our website. We want these on Wikimedia Commons / Internet Archive. Got an old photo or document? Add it." + a "drop box" for notes.
- Monitor: `#/voices` (and `#/how-we-know`).

### 14.6 Exit wall
- Panel (A2): "Every generation here thought it had run out of room" table (section 13), with the NAB satellite image.
- Sticky notes + pens: "Which problem on campus today will be a story in 10 years? Add your batch."
- Thank-you card listing all interviewees and offices.

### 14.7 Table 2: hands-on
- **Timeline card-sorting game (A6 cards, 16):** event on front, year on back. Use: 1998 first classes in Nilgiri; 1998 first books arrive in Saranga Hall; 1999 bunk beds in Vindhya; 2000 Palash and Parijat open; 2001 deemed university; 2001 library moves to Vindhya; 2002 layout plan (62 acres); 2003 Afro-Asian Games press meets in guest house; 2005 four messes; 2007 Vindhya taken back from company schools; 2010 faculty quarters; 2015 T-Hub opens in Himalaya D; 2017 IMS; 2018 UGEE starts; 2020 fully online; 2022 Block D comes back.
- **Objects:** the file folder; any old hardware IT Services lent (if any).

### 14.8 Print list (checklist)
| Item | Size | Qty |
|---|---|---|
| Title board | 2x3 ft (or 4 A3 tiled) | 1 |
| Board headers | A3 | 4 + exit |
| Panels | A3 | about 16 |
| Comic panels | A4 | 4 |
| Journey cards | A5 | 8 |
| Voices cards | A5 | 7 |
| Conflict flip cards | A4 | 3-4 |
| Verified + correction cards | A4 | 4 |
| 2002 layout plan | A2/A1 | 1 |
| Photos | 4x6 in or A5 | about 30 |
| Civil photo strip | A5 | 6 |
| Archive prints | A4 | about 8 |
| Quiz cards | A5 | 40 |
| Timeline game cards | A6 | 16 |
| Ending panel | A2 | 1 |
Plus: cardboard, foam tape, red thread, map pins, coloured dot stickers, sticky notes, markers, 4 cardboard boxes (Himalaya model), extension boards, HDMI cables, 3-4 mice.

### 14.9 On the day
- **Roles:** one host at the entry (quiz + route), one guide per board. Rotate every hour. **TODO(team):** names.
- **2-minute tour (for the prof/TA):** 1) "Our argument: IIIT grew like its banyan, on borrowed support, then put down its own roots." 2) Board 2 Himalaya model as the clearest example. 3) Board 4: "Memory disagrees. Here's how we checked it, and here's where we were wrong." 4) Exit wall: "Every crisis here got solved. That's why we're hopeful about today's."
- **60-second pitch per board:** each guide opens with the board's question, gives one surprising fact, points to one object, and invites a touch (flip a card, find a building on the map).
- **Monitors:** each laptop opens `site/index.html?screen=<id>` from a local copy (no internet needed), with `<id>` = `history`, `map`, `evidence` (3 monitors) or `left`, `right` (2 monitors). Fullscreen with F, sleep disabled, mouse attached. After 90 s idle a screen returns to its home view and cycles its playlist.
- **Morning checklist:** banyan photos (by 7:30 am), Motorola granite photo, get Gopi's OK on the comic, print run, test every monitor, charge phones for QR testing.
