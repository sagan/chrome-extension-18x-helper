
var cookies = {
	'www.dlsite.com': [{path: '/', name: 'adultchecked', value: '1'}],
	'www.getchu.com': [{path: '/', name: 'getchu_adalt_flag', value: 'getchu.com'}],
	'www.dmm.co.jp': [{path: '/', name: 'setover18', value: '1'}],
	'www.dmm.com': [{domain: 'dmm.com', path: '/', name: 'ckcy', value: '1'}],
    'dmm.com': [{domain: 'dmm.com', path: '/', name: 'ckcy', value: '1'}],
    's-mi-le.com': [{domain: 's-mi-le.com', path: '/', name: 'modal', value: 'off'}], // スミレ
    'www.digiket.com': [{domain: 'digiket.com', path: '/', name: 'adult_check', value: '1'}],
};

// see https://stackoverflow.com/questions/3689423/google-chrome-plugin-how-to-get-domain-from-url-tab-url
// Given uri = "http://www.google.com/", domain == "www.google.com"
function getDomain(uri) {
    return uri.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];
}

// Given uri = "http://www.google.com/", origin == "http://www.google.com"
function getOrigin(uri) {
    return uri.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[0];
};

chrome.webRequest.onBeforeRequest.addListener(function(details) {
    var domain = getDomain(details.url);
    if( domain && cookies[domain] ) {
        for(var i = 0; i < cookies[domain].length; i++) {
           chrome.cookies.set({
             url: details.url,
             domain: cookies[domain][i].domain,
             name: cookies[domain][i].name,
             path: cookies[domain][i].path,
             value: cookies[domain][i].value,
           }, function() {}); 
        }
    }
}, {urls: ["<all_urls>"], types: ["main_frame"]}, ["blocking"]);

