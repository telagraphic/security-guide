
console.log("location.pathname:" + location.pathname);
console.log("location.hash:" + location.hash);
console.log("location.host:" + location.host);
console.log("location.href:" + location.href);
console.log("location.origin:" + location.origin);
console.log("location.port:" + location.port);
console.log("location.protocol:" + location.protocol);
console.log("location.search:" + location.search);

//  get main-menu and intercept clicks
var main_menu = document.querySelector(".main-menu");
var page_container = document.querySelector(".page-container");
function setupChapterLinks() {
  main_menu.addEventListener("click", function(event) {
    if (event.target && event.target.matches("a.chapter-link")) {
      event.preventDefault();
    }

    var linkURL = event.target.getAttribute("href");

    // check if same page
    if (preventDoubleClick(linkURL)) {
      // hide current page
      page_container.classList.add('animating');
      changeChapterPage(linkURL, false);
    };
  });
}

function preventDoubleClick(url) {
  var newURL = url.split('/').pop();
  var path = location.pathname.split('/').pop();

  if (newURL === path) {
    return false;
  }

  return true;
}

//  get external data from the link url
function changeChapterPage(url, browserButton) {
  // window.location = url;
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    if (request.readyState === 4) {
      if (request.status === 200) {
        var chapter = document.createElement("section");
        chapter.innerHTML = request.responseText;
        loadNewPage(chapter, url, browserButton);
      } else {
        new Error("HTTP code is not 200");
      }
    }

  };

  request.timeout = 5000;

  request.ontimeout = function() {
    new Error("Request timed out");
  }

  request.onerror = function() {
    // There was a connection error of some sort
  };

  request.send();
}


// load that data into our container

function loadNewPage(contents, url, browserButton) {
  document.title = contents.querySelector("title").innerHTML;
  var page_container = document.querySelector(".page-container");

  // use css styles animation time for this duration
  setTimeout(function() {
    page_container.innerHTML = contents.querySelector(".page-container").innerHTML;
  }, 200)

  if (!browserButton) window.history.pushState(null, '', url);

  // show new page
  setTimeout(function() {
    page_container.classList.remove('animating');
  }, 500)


}

function updateHistoryState() {

}


// popstate is triggered when forward or back button is clicked
window.addEventListener("popstate", function(event) {
  page_container.classList.add('animating');
  // get the directory/page path to jump to
  var path = location.pathname.split('/').pop();
  changeChapterPage(path, true);
});

setupChapterLinks();
