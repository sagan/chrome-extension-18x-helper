
/*
amazon display a warning screen for some adult items. Users have to click the "Continue" button to
go to item detail page. This extension automatically click the link for you.
*/

function domReady(func) {
  if (typeof jQuery != "undefined") jQuery(document).ready(func);
  else {
    var oldonload = window.onload;
    if (typeof window.onload != "function") {
      window.onload = func;
    } else {
      window.onload = function () {
        oldonload();
        func();
      };
    }
  }
}

function go(url) {
  if (document.body)
    document.body.innerHTML =
      'redirecting to <a href="' + url + '">' + url + "</a>";
  location.href = url;
}

if (location.host == "www.amazon.co.jp") {
  domReady(function () {
    var confirmLink = document.querySelector("center a");
    if (
      confirmLink &&
      confirmLink.href.indexOf(
        "http://www.amazon.co.jp/gp/product/black-curtain-redirect.html"
      ) == 0
    ) {
      go(confirmLink.href);
    }
  });
}
