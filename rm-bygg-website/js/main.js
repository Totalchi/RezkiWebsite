/* ============================================================
   RM Bygg & Montage AB — Application Entry Point
   Bootstrapt alle services na DOMContentLoaded.
   Elke service controleert zelf of zijn DOM-elementen bestaan.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  NavService.init();
  CursorService.init();
  AnimationService.init();
  CanvasService.init();      // no-op als canvassen niet op deze pagina staan
  SecurityService.init();    // no-op als form niet op deze pagina staat
  FormService.init();        // no-op als form niet op deze pagina staat
  LanguageService.init();    // past opgeslagen taal toe op huidige pagina
});
