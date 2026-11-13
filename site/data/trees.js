/* trees.js: HISTREE trees. Owner: aakarsh-claude (A3). Read by the HISTREE page (saharsh) and the map's trees layer (aakarsh).
   photos: [] shows a "photo coming" tile. Add image ids here once the morning photos are in raw/photos + images.js. */
window.M = window.M || {};
M.trees = [
  { id: "navjeevan", name: "Navjeevan", kind: "Banyan",
    story: "Road widening in front of campus would have cut it down. SLN Shastry got it moved instead: first to Bakul Nivas, then to OBH. Three homes for one tree.",
    moves: [ { place: null, label: "Main road" }, { place: "bakul", label: "Bakul Nivas" }, { place: "obh", label: "OBH" } ],
    photos: [], related: ["img-05"], sources: ["S-SLN"], mapPlace: "obh" },
  { id: "jagruthi", name: "Jagruthi", kind: "Banyan",
    story: "Another of the four banyans SLN Shastry saved from the road widening. It shares its name with Jagruti, IIIT's banyan mascot.",
    moves: [ { place: null, label: "Main road" }, { place: null, label: "Moved (place to confirm)" } ],
    photos: [], related: [], sources: ["S-SLN", "S-WIKI-OLD"], mapPlace: null },
  { id: "judges", name: "The Judge's Quarters banyan", kind: "Banyan",
    story: "The third saved banyan now stands in the Judge's Quarters area.",
    moves: [ { place: null, label: "Main road" }, { place: null, label: "Judge's Quarters area" } ],
    photos: [], related: [], sources: ["S-SLN"], mapPlace: null },
  { id: "buddha", name: "The Buddha Nivas banyan", kind: "Banyan",
    story: "The fourth saved banyan stands near Buddha Nivas.",
    moves: [ { place: null, label: "Main road" }, { place: null, label: "Near Buddha Nivas" } ],
    photos: [], related: [], sources: ["S-SLN"], mapPlace: null },
  { id: "neem", name: "The PGDIT-2002 neem", kind: "Neem",
    story: "A neem planted by PGDIT-2002 students. Its hand-painted sign says \"22-4-0...\" and the rest of the date is cut off.",
    moves: [], photos: ["img-49"], related: [], sources: ["S-PHOTOS"], mapPlace: null }
];
M.treesExtra = {
  intro: "IIIT's logo is a banyan, and so is its mascot. A banyan often starts life on another tree, then drops roots of its own until it stands by itself. Even IIIT's real banyans were moved here and took root.",
  images: ["img-05", "img-26"],
  sources: ["S-SLN", "S-WIKI-OLD", "S-PHOTOS"]
};
