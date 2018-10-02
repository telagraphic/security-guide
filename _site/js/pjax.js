//
// console.log("location.pathname:" + location.pathname);
// console.log("location.hash:" + location.hash);
// console.log("location.host:" + location.host);
// console.log("location.href:" + location.href);
// console.log("location.origin:" + location.origin);
// console.log("location.port:" + location.port);
// console.log("location.protocol:" + location.protocol);
// console.log("location.search:" + location.search);

//  get main-menu and intercept clicks
var main_menu = document.querySelector(".main-menu");
var page_container = document.querySelector(".page-container");
var chapter_contents = document.querySelector(".chapter-contents");


// container to intercept
// link class to target
// container to show/hide

function setupChapterLinks() {
  //main_menu
  main_menu.addEventListener("click", function(event) {
    if (event.target && event.target.matches("a.chapter-link")) {
      event.preventDefault();
      var linkURL = event.target.getAttribute("href");
      if (preventDoubleClick(linkURL)) {
        fetchPage(linkURL, false);
      };
    }
  });
}

var chapter_links, chapter_contents;

window.addEventListener("click", function(event) {
  if (event.target && event.target.matches("a.sub-link")) {
    event.preventDefault();
    console.log("link clicked");

    var subURL = event.target.getAttribute("href");
    if (preventDoubleClick(subURL)) {
      fetchSection(subURL, false);
    }
  };
});


window.addEventListener("click", function(event) {
  if (event.target && event.target.matches("a.sub-page-link")) {
    event.preventDefault();
    var subURL = event.target.getAttribute("href");
    if (preventDoubleClick(subURL)) {
      fetchSection(subURL, false);
    }
  };
});

function preventDoubleClick(url) {
  var newURL = url.split('/').pop();
  var path = location.pathname.split('/').pop();

  if (newURL === path) {
    return false;
  }
  return true;
}

//  get external data from the link url
function fetchPage(url, browserButton) {
  toggleContent(page_container, true)

  // window.location = url;
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    if (request.readyState === 4) {
      if (request.status === 200) {
        var chapter = document.createElement("section");
        chapter.innerHTML = request.responseText;
        loadPage(chapter, url, browserButton);
      } else {
        new Error("HTTP code is not 200");
      }
    }
  };

  // https://github.com/nefe/You-Dont-Need-jQuery#query-selector

  request.timeout = 5000;
  request.ontimeout = function() { new Error("Request timed out"); }
  request.onerror = function() { return "Errored out!" };
  request.send();
}


function fetchSection(url, browserButton) {
  var chapter_section = document.querySelector(".chapter-section");
  toggleContent(chapter_section, true);

  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    if (request.readyState === 4) {
      if (request.status === 200) {
        var section = document.createElement("section");
        section.innerHTML = request.responseText;
        loadSection(section, url, browserButton);
      } else {
        new Error("HTTP code is not 200");
      }
    }
  };

  request.timeout = 5000;
  request.ontimeout = function() { new Error("Request timed out"); }
  request.onerror = function() { return "Errored out!" };
  request.send();

}



// load html into our container
function loadPage(contents, url, browserButton) {
  document.title = contents.querySelector("title").innerHTML;

  // add up css styles animation time for this duration
  setTimeout(function() {
    page_container.innerHTML = contents.querySelector(".page-container").innerHTML;
  }, 200)

  pushState(browserButton, url);

  // show new page
  setTimeout(function() {
    scrollToTop(page_container);
    toggleContent(page_container, false);
  }, 500)
}





function loadSection(section, url, browserButton) {
  document.title = section.querySelector("title").innerHTML;
  var chapter_section = document.querySelector(".chapter-section");

  // get page navigation
  var prevButton = document.querySelector(".prev a");
  var nextButton = document.querySelector(".next a");

  // update with section links
  var prevHref = section.querySelector(".prev a").getAttribute("href");
  var nextHref = section.querySelector(".next a").getAttribute("href");

  prevButton.setAttribute("href", prevHref);
  nextButton.setAttribute("href", nextHref);

  // add up css styles animation time for this duration
  setTimeout(function() {
    chapter_section.innerHTML = section.querySelector(".chapter-section").innerHTML;
  }, 200)

  pushState(browserButton, url);

  // show new page
  setTimeout(function() {
    scrollToTop(page_container);
    toggleContent(chapter_section, false);
  }, 500)

}


function toggleContent(container, animating) {
  if (animating) {
    container.classList.add('animating');
  } else {
    container.classList.remove('animating');
  }
}

function hideContent(container) {
  container.classList.add('animating');
}

function scrollToTop(container) {
  container.scroll({ top: 0, behavior: "instant"})
}

function pushState(browserButton, url) {
  if (!browserButton) window.history.pushState(null, '', url);
}

function setupPopState() {
  // popstate is triggered when forward or back button is clicked
  window.addEventListener("popstate", function(event) {
    // get the directory/page path to jump to .split('/').pop();
    var path = location.pathname.split('/').pop();
    fetchPage(path, true);
  });
}


setupChapterLinks();
setupPopState();
