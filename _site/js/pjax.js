//  get main-menu and intercept clicks
var mainMenu = document.querySelector('.main-menu');
var pageContainer = document.querySelector('.container');
var chapterContents = document.querySelector('.chapter-wrapper');
var chapterSection = document.querySelector('.chapter-contents');

var request = {
  button: false,
  url: '',
  type: '',
};

function linkInterceptor() {
  window.addEventListener('click', function (event) {

    // skip id links
    if (event.target && event.target.matches('a.no-tab')) {
      return;
    }

    // fetch new chapter
    if (event.target && event.target.matches('a.chapter-link')) {
      console.log("link clicked");
      event.preventDefault();
      request.url = event.target.getAttribute('href');
      request.type = 'page';
      if (preventDoubleClick(request.url)) {
        fetchPage(request);
      }
    }

    if (event.target && event.target.matches('h4.chapter-link')) {
      event.preventDefault();
      request.url = event.target.parentNode.getAttribute('href');
      console.log(request.url);
      request.type = 'page';
      if (preventDoubleClick(request.url)) {
        fetchPage(request);
      }
    }

    // fetch new chapter section
    if (event.target && event.target.matches('a.section-link')) {
      console.log("link clicked");
      event.preventDefault();
      request.url = event.target.getAttribute('href');
      request.type = 'section';
      if (preventDoubleClick(request.url)) {
        fetchSection(request);
      }
    }
  });
}

//  get external data from the link url
function fetchPage(request) {
  toggleContent(pageContainer, request.button);

  var xhr = new XMLHttpRequest();
  xhr.open('GET', request.url, true);

  xhr.onload = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var chapter = document.createElement('section');
        chapter.innerHTML = xhr.responseText;
        loadPage(chapter, request.url, request.button);
      } else {
        new Error('HTTP code is not 200');
      }
    }
  };

  // https://github.com/nefe/You-Dont-Need-jQuery#query-selector

  xhr.timeout = 5000;
  xhr.ontimeout = function () { new Error('Request timed out'); };

  xhr.onerror = function () { return 'Errored out!'; };

  xhr.send();
}

function fetchSection(request) {
  var chapterSection = document.querySelector('.chapter-contents');
  toggleContent(chapterSection, request.button);

  var xhr = new XMLHttpRequest();
  xhr.open('GET', request.url, true);

  xhr.onload = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var section = document.createElement('section');
        section.innerHTML = xhr.responseText;
        loadSection(section, request.url, request.button);
      } else {
        new Error('HTTP code is not 200');
      }
    }
  };

  xhr.timeout = 5000;
  xhr.ontimeout = function () { new Error('Request timed out'); };

  xhr.onerror = function () { return 'Errored out!'; };

  xhr.send();
}

// load html into our container
function loadPage(contents, url, browserButton) {
  document.title = contents.querySelector('title').innerHTML;

  // add up css styles animation time for this duration
  setTimeout(function () {
    pageContainer.innerHTML = contents.querySelector('.container').innerHTML;
  }, 200);

  pushState(browserButton, url);

  // show new page
  setTimeout(function () {
    updateLinks();
    scrollToTop(pageContainer);
    toggleContent(pageContainer, true);
  }, 500);
}

function loadSection(section, url, browserButton) {
  var chapterSection = document.querySelector('.chapter-contents');
  document.title = section.querySelector('title').innerHTML;

  updateNavigation(section);

  // add up css styles animation time for this duration
  setTimeout(function () {
    chapterSection.innerHTML = section.querySelector('.chapter-contents').innerHTML;
  }, 100);

  pushState(browserButton, url);

  // show new page
  setTimeout(function () {
    updateLinks();
    scrollToTop(pageContainer);
    toggleContent(chapterSection, true);
  }, 300);
}

function preventDoubleClick(url) {
  var newURL = url.split('/').pop();
  var path = location.pathname.split('/').pop();

  if (newURL === path) {
    return false;
  }

  return true;
}

function updateNavigation(section) {

  var prevHref = section.querySelector('.prev-link').getAttribute('href');
  var nextHref = section.querySelector('.next-link').getAttribute('href');

  var prevButtons = document.querySelectorAll('.prev-link');
  var nextButtons = document.querySelectorAll('.next-link');

  var prevText = prevHref.split('/');
  var nextText = nextHref.split('/');

  prevButtons.forEach(function (button) {
    button.setAttribute('href', prevHref);
  });

  nextButtons.forEach(function (button) {
    button.setAttribute('href', nextHref);
  });

}

function updateLinks() {
  var chapterContents = document.querySelector('.chapter-contents');
  var chapterLinks = chapterContents.querySelectorAll('a');

  chapterLinks.forEach(function (link) {
    if (link.classList.contains('no-tab')) {
      return;
    }

    if (!link.classList.contains('section-link') && !link.classList.contains('chapter-link')) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
}

function toggleContent(container, animating) {
  if (!animating) {
    container.classList.add('animating');
  } else {
    container.classList.remove('animating');
  }
}

function scrollToTop(container) {
  container.scroll({ top: 0, behavior: 'instant' });
}

function pushState(browserButton, url) {
  if (!browserButton) window.history.pushState(null, '', url);
}

function setupPopState() {
  window.addEventListener('popstate', function (event) {
    request.url = location.pathname.split('/').pop();
    request.button = true;
    fetchPage(request);
  });
}

linkInterceptor();
setupPopState();
