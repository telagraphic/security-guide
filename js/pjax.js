
console.log("location.pathname:" + location.pathname);
console.log("location.hash:" + location.hash);
console.log("location.host:" + location.host);
console.log("location.href:" + location.href);
console.log("location.origin:" + location.origin);
console.log("location.port:" + location.port);
console.log("location.protocol:" + location.protocol);
console.log("location.search:" + location.search);

// need code for a straight url paste, need to load complete page then cut out container if pjax or
// use whole page if linked to!

//  get main-menu and intercept clicks
var main_menu = document.querySelector(".main-menu");
var page_container = document.querySelector(".page-container");
function setupChapterLinks() {
  main_menu.addEventListener("click", function(event) {
    if (event.target && event.target.matches("a.chapter-link")) {
      event.preventDefault();
    }

    var linkURL = event.target.getAttribute("href");

    // hide current page
    page_container.classList.add('animating');

    changeChapterPage(linkURL, false);
    // setTimeout(function() {
    //
    // }, 500)

  });
}



//  get external data from the link url
function changeChapterPage(url, browserButton) {
  // window.location = url;
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var data = request.responseText;
      console.log("data: " + data);
      var chapter = document.createElement("section");
      chapter.setAttribute("class", "chapter-wrapper");
      chapter.innerHTML = data;
      console.log("chapter: " + chapter.querySelector(".page-container").innerHTML);
      // var chapter = data.querySelector(".chapter-contents");
      // console.log(chapter);
      loadNewPage(chapter, url, browserButton);
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
