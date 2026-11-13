/* people.js: the 7 people we interviewed. Owner: aakarsh-claude (A3). Sorted by year joined.
   photo stays null until the team adds consented portraits (then set it to an image id). */
window.M = window.M || {};
M.people = [
  { id: "P-GOPI", name: "Mr. Gopi", fullName: "Mr. Gopalakrishnan (Gopi)", initials: "G",
    role: "Guest house caretaker. Ran the campus phone booth.", years: "1998 to now", joined: 1998,
    photo: null, sourceId: "S-GOPI", transcriptId: "P-GOPI", color: "var(--soil)",
    oneLine: "He's been here since the bullock-cart days.",
    toldUs: [
      "Gachibowli in 1998 was a village. Bullock carts on the path, and bears, pigs and monkeys wandering in.",
      "The first batch had 50 seats and 49 students joined.",
      "Before the hostel messes were built, the guest house was the mess.",
      "He ran the campus phone booth, and an official asked him for a Rs. 2,000 bribe to connect it.",
      "The 2003 Afro-Asian Games held their press meets in the guest house.",
      "Companies like IBM, Oracle, Motorola and Satyam ran schools on campus, then moved out to their own offices."
    ],
    featured: true },
  { id: "P-SLN", name: "SLN Shastry", fullName: "SLN Shastry", initials: "SLN",
    role: "One of the first five or six employees. Engineering and estate side.", years: "1998 to now", joined: 1998,
    photo: null, sourceId: "S-SLN", transcriptId: "P-SLN", color: "var(--banyan)",
    oneLine: "He saved four banyan trees and kept the 2002 campus plan.",
    toldUs: [
      "Nilgiri was an unfinished government building lent to IIIT for classrooms and labs.",
      "Boys first stayed in Vindhya and girls in the Judge's Quarters.",
      "When road widening threatened four banyans, he got them moved instead of cut.",
      "Navjeevan, one of those banyans, has been moved three times."
    ],
    featured: true },
  { id: "P-PJN", name: "Prof. P. J. Narayanan", fullName: "Prof. P. J. Narayanan (PJN)", initials: "PJN",
    role: "Former Director. Faculty since December 2000.", years: "2000 to now", joined: 2000,
    photo: null, sourceId: "S-PJN", transcriptId: "P-PJN", color: "var(--slate)",
    oneLine: "He watched IIIT go from two floors of one building to a campus.",
    toldUs: [
      "In 1998 only the first two floors of Nilgiri were in use, with five or six faculty.",
      "The first batch joined for a diploma (GDIT), trusting that a degree would follow.",
      "In 1999 a batch slept on bunk beds inside Vindhya.",
      "The company schools taught tools, not theory, so IIIT took Vindhya back in 2007.",
      "Himalaya was built on a 22 crore loan that IIIT paid off in six of ten years."
    ],
    featured: true },
  { id: "P-MURALI", name: "G. Muralidhar", fullName: "G. Muralidhar", initials: "GM",
    role: "Librarian.", years: "2005 to now", joined: 2005,
    photo: null, sourceId: "S-MURALI", transcriptId: "P-MURALI", color: "var(--teal)",
    oneLine: "He has run the library through two of its homes.",
    toldUs: [
      "The library started in Nilgiri 119, which is Saranga Hall now.",
      "It moved to Vindhya A6 in 2001 and grew onto the upper floor in 2016.",
      "It started with roughly 400 books and holds nearly 50,000 now.",
      "When the New Academic Block is ready, the library moves again."
    ],
    featured: true },
  { id: "P-RAJAN", name: "Prof. K. S. Rajan", fullName: "Prof. K. S. Rajan", initials: "KSR",
    role: "Registrar. Heads the Lab for Spatial Informatics.", years: "2006 to now", joined: 2006,
    photo: null, sourceId: "S-RAJAN", transcriptId: "P-RAJAN", color: "var(--ochre-ink)",
    oneLine: "He counted how fast the IT corridor grew around IIIT.",
    toldUs: [
      "In 1998 Cyber Towers opened with about six companies. A 2007-08 study counted close to 1,000.",
      "In the 1990s one district road from Mehdipatnam was the only way to Gachibowli.",
      "A power substation sits on IIIT's own land, leased to the utility.",
      "The office ran on paper files until IMS started around 2017."
    ],
    featured: true },
  { id: "P-PRAB", name: "Prabhakar M", fullName: "Prabhakar M", initials: "PM",
    role: "Student Life Office. Earlier admissions and hostel administration.", years: "2007 to now", joined: 2007,
    photo: null, sourceId: "S-PRAB", transcriptId: "P-PRAB", color: "var(--plum)",
    oneLine: "He has been on almost every batch trip since 2007.",
    toldUs: [
      "When he joined in 2007, only two floors of Nilgiri were being used for teaching.",
      "He started digitising hostel records in 2016, which led to IMS in 2017.",
      "UGEE, the admission exam, started in 2018.",
      "The ground where Himalaya stands was a cricket ground where faculty and students played together."
    ],
    featured: true },
  { id: "P-SRIDHAR", name: "Sridhar Kora", fullName: "Sridhar Kora", initials: "SK",
    role: "Hostel office in-charge.", years: "2018 to now", joined: 2018,
    photo: null, sourceId: "S-SRIDHAR", transcriptId: "P-SRIDHAR", color: "var(--leaf)",
    oneLine: "He fixed the morning hot-water rush with heat pumps.",
    toldUs: [
      "Rooms went from single to double to triple sharing.",
      "Solar heaters were enough for a few hundred students, but not for more. Heat pumps fixed it.",
      "During COVID, classes and exams moved to CodeTantra."
    ],
    featured: true }
];
