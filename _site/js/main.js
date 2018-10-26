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

// Main Menu

var mainMenu = document.querySelector('.main-menu');
var menuButton = document.querySelector('.menu-button');
var closeMenuButton = document.querySelector('.close-menu-button');

window.addEventListener('click', function (event) {

  if (event.target) {

    console.log(event.currentTarget);

    if (event.target.matches('button.menu-button')) {
      console.log('menu button open');
      mainMenu.classList.toggle('toggle-menu');
    }

    if (event.target.matches('button.close-menu-button')) {
      console.log('menu button closed');
      mainMenu.classList.remove('toggle-menu');
    }

    if (event.target.matches('h4.chapter-link')) {
      console.log('chapter link');
      setTimeout(function () {
        mainMenu.classList.remove('toggle-menu');
      }, 500);
    }

    if (event.target.matches('a.chapter-link')) {
      console.log('chapter link');
      setTimeout(function () {
        mainMenu.classList.remove('toggle-menu');
      }, 500);
    }
  }
});

//  Uber menu
var mainMenu = document.querySelector('.main-menu');
var menuLinks = mainMenu.querySelectorAll('.links a');
var previewLinks = document.querySelectorAll('.link-preview section');

function initMenuLinks() {
  menuLinks.forEach(function (link) {
    link.addEventListener('mouseover', function (event) {
      showLinkPreview(link.classList[0]);
    });
  });
}

function showLinkPreview(link) {
  removeActivePreview();
  previewLinks.forEach(function (preview) {
    if (link === preview.classList[0]) {
      preview.classList.toggle('show-preview');
    }
  });
}

function removeActivePreview() {
  previewLinks.forEach(function (preview) {
    preview.classList.remove('show-preview');
  });
}

initMenuLinks();
