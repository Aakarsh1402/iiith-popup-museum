/* look.js: picks the site look before the page paints. Owner: aakarsh-claude.
   Default is the "drawing office" look (css/look.css, scoped to html.look-v2). index.html?look=classic shows the old
   look from before the 14 Nov un-AI-slop pass (git tag look-v1-before-unslop has the old files). Nothing is stored. */
(function () {
  "use strict";
  if (!/[?&]look=classic\b/.test(location.search)) document.documentElement.classList.add("look-v2");
})();
