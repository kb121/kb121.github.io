// Animations
AOS.init({
  anchorPlacement: 'top-left',
  duration: 1000
});

// Keep footer year fresh without manual updates.
(function () {
  var yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
