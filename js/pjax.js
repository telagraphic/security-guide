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

// container to intercept
// link class to target
// container to show/hide
//

function setupChapterLinks() {
  main_menu.addEventListener("click", function(event) {
    if (event.target && event.target.matches("a.chapter-link")) {
      event.preventDefault();
    }

    var linkURL = event.target.getAttribute("href");

    // check if same page
    if (preventDoubleClick(linkURL)) {
      // hide current page
      fetchPage(linkURL, false);
    };
  });
}

var chapter_links, chapter_contents;

window.addEventListener("click", function(event) {
  if (event.target && event.target.nodeName === "A") {
    console.log("link clicked");
    chapter_links = document.querySelector(".chapter-links");
    chapter_contents = document.querySelector(".chapter-contents");
  };

});
//
// if (document.readyState !== 'loading') {
//   console.log("content loaded");
// }
// console.log(chapter_links);
// console.log(chapter_contents);

var chapter_links = document.querySelector(".chapter-links");
var chapter_contents = document.querySelector(".chapter-contents");

function setupSectionLinks() {

  chapter_links.addEventListener("click", function(event) {
    if (event.target && event.target.matches("a.sub-link")) {
      event.preventDefault();
    }

    var linkURL = event.target.getAttribute("href");
    console.log(linkURL);

    // check if same page
    if (preventDoubleClick(linkURL)) {
      // hide current page
      fetchSection(linkURL, false);
    };
  });
}

setupSectionLinks();

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
  toggleContent(chapter_contents, true);
  console.log(url);

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

    chapter_links = document.querySelector(".chapter-links");
    chapter_contents = document.querySelector(".chapter-contents");
    console.log(chapter_links);
  }, 500)
}

function loadSection(section, url, browserButton) {
  document.title = section.querySelector("title").innerHTML;
  console.log(section);
  // add up css styles animation time for this duration
  setTimeout(function() {
    chapter_contents.innerHTML = section.querySelector(".chapter-contents").innerHTML;
  }, 200)

  pushState(browserButton, url);

  // show new page
  setTimeout(function() {
    scrollToTop(page_container);
    toggleContent(chapter_contents, false);
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
    // get the directory/page path to jump to
    var path = location.pathname.split('/').pop();
    console.log(path);
    fetchPage(path, true);
  });
}


setupChapterLinks();
setupPopState();
