
var cookies = {
    // general sites
    'www.dlsite.com': [{domain: 'dlsite.com', path: '/', name: 'adultchecked', value: '1'}],
    'www.getchu.com': [{domain: 'getchu.com', path: '/', name: 'getchu_adalt_flag', value: 'getchu.com'}],
    'dmm.co.jp': [{domain: 'dmm.co.jp', path: '/', name: 'setover18', value: '1'}],
    'dmm.com': [{domain: 'dmm.com', path: '/', name: 'ckcy', value: '1'}],
    'gyutto.com': [{domain: 'gyutto.com', path: '/', name: 'adult_check_flag', value: '1'}],
    'www.digiket.com': [{domain: 'digiket.com', path: '/', name: 'adult_check', value: '1'}],
    'toranoana.jp': [{domain: 'toranoana.jp', path: '/', name: 'afg', value: '0'}], //とらのあな
    'ura-akiba.jp': [{domain: 'ura-akiba.jp', path: '/', name: 'auth', value: '1'}], //うらあきば.じぇいぴ～
    
    // brands sites
    's-mi-le.com': [{domain: 's-mi-le.com', path: '/', name: 'modal', value: 'off'}], // スミレ
//  '': [{domain: '', path: '/', name: '', value: '1'}],
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
    var matchedDomain;
    
    if( domain ) {
        if( cookies[domain] ) {
            matchedDomain = domain;
        } else {
            var parts = domain.split('.');
            if( parts.length > 2 ) {
                parts.splice(0,1);
                domain = parts.join('.');
                if( cookies[domain]) {
                    matchedDomain = domain;
                }
            }
        }
    }
    
    if( matchedDomain ) {
        for(var i = 0; i < cookies[matchedDomain].length; i++) {
            chrome.cookies.set({
                url: details.url,
                domain: cookies[matchedDomain][i].domain,
                name: cookies[matchedDomain][i].name,
                path: cookies[matchedDomain][i].path,
                value: cookies[matchedDomain][i].value,
            }, function() {}); 
        }
    }
}, {urls: ["<all_urls>"], types: ["main_frame"]}, ["blocking"]);

