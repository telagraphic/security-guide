var links = document.querySelectorAll('.main-nav a');

links.forEach(function (link) {
  link.addEventListener('click', function (event) {
    removeActive(links);
    this.classList.add('active');
  });
});

function removeActive(links) {
  links.forEach(function (link) {
    link.classList.remove('active');
  });
}
