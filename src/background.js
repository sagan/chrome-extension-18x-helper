
let cookies = {
    // av
    'video.fc2.com': [{domain: 'video.fc2.com', path: '/', name: '_ac', value: '1'}],
    'amiami.jp': [{domain: 'amiami.jp', path: '/', name: 'age_confirm', value: 'true'}],
    'oshiete.goo.ne.jp': [{domain: 'oshiete.goo.ne.jp', path: '/', name: 'adult_filter', value: '1'}],

    // general sites
    'dlsite.com': [{domain: 'dlsite.com', path: '/', name: 'adultchecked', value: '1'}],
    'nijiyome.jp': [{domain: 'nijiyome.jp', path: '/', name: 'adultcheck', value: '1'}],
    'melonbooks.co.jp': [{domain: 'melonbooks.co.jp', path: '/', name: 'AUTH_ADULT', value: '1'}],
    's-cute.com': [{domain: 's-cute.com', path: '/', name: 'over18', value: '1'}],
    'getchu.com': [
        {domain: 'getchu.com', path: '/', name: 'getchu_adalt_flag', value: 'getchu.com'},
        {domain: 'getchu.com', path: '/', name: 'ADULT_GATE', value: '1'}
    ],
    'yodobashi.com': [
        {domain: 'yodobashi.com', path: '/', name: 'contentFilterLevel', value: '2'},
        {domain: 'yodobashi.com', path: '/', name: 'contentFilterLevelValue', value: '2'}
    ],
    'dmm.co.jp': [{domain: 'dmm.co.jp', path: '/', name: 'setover18', value: '1'}],
    'mgstage.com': [{domain: 'mgstage.com', path: '/', name: 'adc', value: '1'}],
    'dmm.com': [{domain: 'dmm.com', path: '/', name: 'ckcy', value: '1'}],
    'gyutto.com': [{domain: 'gyutto.com', path: '/', name: 'adult_check_flag', value: '1'}],
    'digiket.com': [{domain: 'digiket.com', path: '/', name: 'adult_check', value: '1'}],
    'toranoana.jp': [{domain: 'toranoana.jp', path: '/', name: 'afg', value: '0'}], //とらのあな
    'ura-akiba.jp': [{domain: 'ura-akiba.jp', path: '/', name: 'auth', value: '1'}], //うらあきば.じぇいぴ～
    'syosetu.com': [{domain: 'syosetu.com', path: '/', name: 'over18', value: 'yes'}],
    'booth.pm': [{domain: 'booth.pm', path: '/', name: 'adult', value: 't'}],

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
    let index = domain.indexOf('.');
    return (index != -1) ? ( domain.substr(index + 1) ) : "";
}

chrome.webRequest.onBeforeRequest.addListener(function(details) {
    let domain = getDomain(details.url);
    let matchedDomain = cookies[domain] || cookies[getTopDomain(domain)];
    
    if( matchedDomain ) {
        for(let i = 0; i < matchedDomain.length; i++) {
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

chrome.webRequest.onBeforeSendHeaders.addListener(function({url, requestHeaders}) {
    let domain = getDomain(url);
    let matchedDomain = cookies[domain] || cookies[getTopDomain(domain)];

    if( matchedDomain ) {
        let cookieHeader;
        for(let i = 0; i < requestHeaders.length; i++) {
            if( requestHeaders[i].name.toLowerCase() == 'cookie' ) {
                cookieHeader = requestHeaders[i];
                break;
            }
        }
        if( cookieHeader ) {
            for(let i = 0; i < matchedDomain.length; i++) {
                if( !cookieHeader.match(new RegExp(`(^|;|\\s)${matchedDomain[i].name}=`)) ) {
                    cookieHeader.value += `; ${matchedDomain[i].name}=${matchedDomain[i].value}`;
                }
            }
        } else {
            requestHeaders.push({name: 'Cookie',
                value: matchedDomain.map(cookie => `${cookie.name}=${cookie.value}`).join('; ')});
        }

        return {requestHeaders};
    }
}, {urls: ["<all_urls>"], types: ["main_frame"]}, ["blocking", "requestHeaders"]);
