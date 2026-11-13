/* Then and Now, the exit wall (context.md section 13). Schema: IMPLEMENTATION_PLAN.md section 5.10.
   Optional extras used by ending.js: kicker, closing, now.images (the NAB satellite sequence), thanksLead. */
window.M = window.M || {};
M.ending = {
  kicker: "Then and now",
  title: "Every generation here thought it had run out of room.",
  intro: "Each of these problems felt stuck to the people living through it. Here is how each one got solved.",
  rows: [
    { when: "1998", problem: "No university status, so no degree to promise. 49 students joined anyway, for a diploma.",
      solved: "IIIT became a deemed university in 2001.", sources: ["S-PJN", "S-GOPI"] },
    { when: "1998 to 2000", problem: "Only 5 or 6 teachers of its own.",
      solved: "It borrowed teachers from the University of Hyderabad and the companies, then hired its own. By about 2001 it had 16 permanent faculty.", sources: ["S-PJN", "S-PROSP"] },
    { when: "1999", problem: "No hostels. A whole batch slept on bunk beds inside an academic building.",
      solved: "Palash and Parijat opened in 2000, then Kadamb.", sources: ["S-PJN"] },
    { when: "Early years", problem: "The campus phone booth was stuck because an official wanted a bribe.",
      solved: "Someone complained to senior officials. The line was connected the same day.", sources: ["S-GOPI"] },
    { when: "1998 to 2001", problem: "The library had one room, Saranga Hall, with seats for about 100.",
      solved: "It moved to Vindhya in 2001, grew to two floors, and is heading to the New Academic Block.", sources: ["S-PING", "S-MURALI"] },
    { when: "Early 2000s", problem: "Company-run teaching wasn't giving students the theory they needed, says Prof. Narayanan.",
      solved: "IIIT went back to its own faculty and took Vindhya back in 2007.", sources: ["S-PJN"] },
    { when: "Himalaya", problem: "No money to build big.",
      solved: "A 22 crore loan, paid off in 6 of the 10 years.", sources: ["S-PJN"] },
    { when: "As numbers grew", problem: "Hot water ran out. Solar heaters weren't enough, and geysers were too slow for the morning rush.",
      solved: "The hostel team saw heat pumps at BITS Pilani Hyderabad and put them in. That fixed it.", sources: ["S-SRIDHAR"] },
    { when: "2020", problem: "COVID shut the campus.",
      solved: "Classes and exams went fully online on CodeTantra. Publishers gave free e-books over the campus VPN.", sources: ["S-SRIDHAR", "S-MURALI"] }
  ],
  now: {
    kicker: "Now",
    text: "Today rooms are shared by three, and summer interns sleep six to a room. Batches are close to 300. And the New Academic Block is going up on the same spot where the first batch lived in 1998. The library is set to move in.",
    sources: ["S-SRIDHAR", "S-PRAB", "S-PJN", "S-MURALI", "S-PHOTOS"],
    image: "img-14",
    images: ["img-09", "img-10", "img-11", "img-12", "img-13", "img-14"],
    imagesNote: "The New Academic Block site in satellite images. Dates are not shown on the screenshots."
  },
  closing: "Every problem on this wall felt permanent to the people living through it. None of them were.",
  prompt: "Which problem on campus today will be a story in ten years? Write it on a sticky note, add your batch, and put it on the wall.",
  thanksLead: "Thank you to everyone who told us their IIIT:",
  todo: "TODO(team): confirm space and crowding is the current issue we want to end on."
};
