// Menu Links

var links = document.querySelectorAll('.main-menu a');

links.forEach(function(link) {
  link.addEventListener('click', function(event) {
    removeActive(links);
    this.classList.add('active');
  })
});

function removeActive(links) {
  links.forEach(function(link) {
    link.classList.remove('active');
  });
}


// Mobile Menu

var menu_button = document.querySelector('.menu-button');
var main_menu = document.querySelector('.main-menu');
var close_menu_button = document.querySelector('.close-menu-button');

if (menu_button) {
  menu_button.addEventListener("click", toggleMenu);
}

if (close_menu_button) {
  close_menu_button.addEventListener("click", toggleMenu);
}

function toggleMenu() {
  main_menu.classList.toggle("toggle-menu");
}

// function hideMobileMenuWhenClicked() {
//   var mobileLinks = document.querySelectorAll('.mobile-menu a');
//   mobileLinks.forEach(function(link) {
//     link.addEventListener("click", function() {
//       main_menu.classList.remove("toggle-mobile-menu");
//     });
//   });
// }
//
// hideMobileMenuWhenClicked();


// Menu

var menu_links = main_menu.querySelectorAll(".links a");
var preview_links = document.querySelectorAll(".link-preview section");

function initMenuLinks() {
  menu_links.forEach(function(link) {
    link.addEventListener("mouseover", function(event) {
      showLinkPreview(link.classList[0]);
    });
  });
}



function showLinkPreview(link) {
  removeActivePreview();
  preview_links.forEach(function(preview) {
    if (link === preview.classList[0]) {
      console.log(preview.classList[0] + "===" + link);
      preview.classList.toggle("show-preview");
    }
  });
}

function removeActivePreview() {
  preview_links.forEach(function(preview) {
    preview.classList.remove("show-preview");
  });
}



initMenuLinks();
