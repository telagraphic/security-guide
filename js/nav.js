var main_nav = document.querySelectorAll(".main-nav > li");

main_nav.forEach(function(link) {
  link.addEventListener("click", function(event) {
    link.classList.toggle("selected");
  });
});
