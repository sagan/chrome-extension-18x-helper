
var cookies = {
    // general sites
    'dlsite.com': [{domain: 'dlsite.com', path: '/', name: 'adultchecked', value: '1'}],
    'nijiyome.jp': [{domain: 'nijiyome.jp', path: '/', name: 'adultcheck', value: '1'}],
    'melonbooks.co.jp': [{domain: 'melonbooks.co.jp', path: '/', name: 'AUTH_ADULT', value: '1'}],
    'getchu.com': [
        {domain: 'getchu.com', path: '/', name: 'getchu_adalt_flag', value: 'getchu.com'},
        {domain: 'getchu.com', path: '/', name: 'ADULT_GATE', value: '1'}
    ],
    'dmm.co.jp': [{domain: 'dmm.co.jp', path: '/', name: 'setover18', value: '1'}],
    'dmm.com': [{domain: 'dmm.com', path: '/', name: 'ckcy', value: '1'}],
    'gyutto.com': [{domain: 'gyutto.com', path: '/', name: 'adult_check_flag', value: '1'}],
    'digiket.com': [{domain: 'digiket.com', path: '/', name: 'adult_check', value: '1'}],
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

function getTopDomain(domain) {
    var index = domain.indexOf('.');
    return (index != -1) ? ( domain.substr(index + 1) ) : "";
}

chrome.webRequest.onBeforeRequest.addListener(function(details) {
    var domain = getDomain(details.url);
    var matchedDomain = cookies[domain] || cookies[getTopDomain(domain)];
    
    if( matchedDomain ) {
        for(var i = 0; i < matchedDomain.length; i++) {
            chrome.cookies.set({
                url: details.url,
                domain: matchedDomain[i].domain,
                name: matchedDomain[i].name,
                path: matchedDomain[i].path,
                value: matchedDomain[i].value,
            }, function() {}); 
        }
    }
}, {urls: ["<all_urls>"], types: ["main_frame"]}, ["blocking"]);

