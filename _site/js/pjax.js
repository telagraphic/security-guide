//  get main-menu and intercept clicks


var main_menu = document.querySelector(".main-menu");
function setupChapterLinks() {
  main_menu.addEventListener("click", function(event) {
    if (event.target && event.target.matches("a.chapter-link")) {
      event.preventDefault();
    }

    var linkURL = event.target.getAttribute("href");
    changeChapterPage(linkURL, false);
  });
}


// popstate is triggered when forward or back button is clicked
window.addEventListener("popstate", function(event) {
  console.log("popstate triggered");

  // get the directory/page path to jump to
  var path = location.pathname.split('/').pop();
  console.log(path);
  changeChapterPage(path, true);
});


//  get external data from the link url
function changeChapterPage(url, browserButton) {
  // window.location = url;
  console.log(url);
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var data = request.responseText;
      // console.log(data);
      loadNewPage(data, url, browserButton);
    } else {
      // We reached our target server, but it returned an error
      console.log("server error");

    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
  };

  request.send();
}


// load that data into our container

function loadNewPage(contents, url, browserButton) {
  var page_container = document.querySelector(".page-container");
  page_container.innerHTML = contents;

  if (!browserButton) window.history.pushState(null, '', url);
}

function updateHistoryState() {

}


setupChapterLinks();
