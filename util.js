const rp = require('request-promise');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');
const tough = require('tough-cookie');

iconv.skipDecodeWarning = true;

const ALLDEBRID_TOKEN = '1d4178dc5319a3575af56c675fae74a61mfal';

async function getReq(url, ref = null) {
    const cookie = new tough.Cookie({
        key: 'cf_clearance',
        value: '054715aac533037ce46b084b59e21b132caa09ae-1567868541-86400-150',
        domain: '.dizibox.pw',
        httpOnly: true,
        maxAge: 31536000
    });

    const cookieJar = rp.jar();

    try {
        cookieJar.setCookie(cookie.toString(), 'https://www.dizibox.pw/');
    } catch (e) {
        console.log(e);
    }

    const options = {
        method: 'GET',
        url: url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36'
        },
        followAllRedirects: true,
        jar: cookieJar,
        encoding: 'latin1'
        //encoding: 'ascii'
    };

    if (ref !== null) {
        options.headers.Referer = ref;
    } else {
        options.headers.Referer = 'https://www.dizibox.pw/';
    }

    const response = await rp(options);
    //return response;
    return iconv.decode(response, 'ISO-8859-9');
    // return iconv.decode(response, 'UTF-8');
}

async function getAlldebridURL(filehostURL) {
    const alldebridURL = 'https://api.alldebrid.com/link/unlock?agent=ztanvideo&token=' + ALLDEBRID_TOKEN + '&link=' + filehostURL;
    let response = await getReq(alldebridURL);
    response = JSON.parse(response);

    if (response.hasOwnProperty('success')) return response.infos.link;
    else if (response.hasOwnProperty('error')) return null;
}

function findAlternativeURL(alternatives, text) {
    const $ = cheerio.load(alternatives);
    for (let i = 0; i < alternatives.length; i++) {
        let alternative = $(alternatives[i]);
        if (alternative.text() === text) {
            if (alternative.attr('selected') === 'selected') return alternative.attr('href');
            else return alternative.val();
        }
    }
    return null;
}

function findScriptWithEval(scripts) {
    scripts = scripts.get();

    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i] && scripts[i].children[0] && scripts[i].children[0].data.includes('eval')) {
            return scripts[i].children[0].data;
        }
    }
    return null;
}

function fixTurkishChars(input) {
    let output = '';
    for (let i = 0; i < input.length; i++) {
        if (input.charCodeAt(i) <= 127) {
            output += input.charAt(i);
        } else if (input.charCodeAt(i) === 195 && input.charCodeAt(i + 1) === 167) {
            output += 'c';
            i++;
        } else if (input.charCodeAt(i) === 196 && input.charCodeAt(i + 1) === 177) {
            output += 'i';
            i++;
        } else if (input.charCodeAt(i) === 195 && input.charCodeAt(i + 1) === 188) {
            output += 'u';
            i++;
        } else if (input.charCodeAt(i) === 197 && input.charCodeAt(i + 1) === 159) {
            output += 's';
            i++;
        } else if (input.charCodeAt(i) === 195 && input.charCodeAt(i + 1) === 182) {
            output += 'o';
            i++;
        } else if (input.charCodeAt(i) === 196 && input.charCodeAt(i + 1) === 159) {
            output += 'g';
            i++;
        } else if (input.charCodeAt(i) === 197 && input.charCodeAt(i + 1) === 158) {
            output += 'S';
            i++;
        } else if (input.charCodeAt(i) === 195 && input.charCodeAt(i + 1) === 132) {
            output += 'A';
            i++;
        } else if (input.charCodeAt(i) === 195 && input.charCodeAt(i + 1) === 164) {
            output += 'a';
            i++;
        } else if (input.charCodeAt(i) === 194 && input.charCodeAt(i + 1) === 146) {
            output += "'";
            i++;
        } else if (input.charCodeAt(i) === 196 && input.charCodeAt(i + 1) === 176) {
            output += "I";
            i++;
        } else if (input.charCodeAt(i) === 195 && input.charCodeAt(i + 1) === 156) {
            output += "U";
            i++;
        } else if (input.charCodeAt(i) === 195 && input.charCodeAt(i + 1) === 162) {
            output += "a";
            i++;
        } else if (input.charCodeAt(i) === 226 && input.charCodeAt(i + 1) === 128 && input.charCodeAt(i + 2) === 153) {
            output += "'";
            i += 2;
        } else if (input.charCodeAt(i) === 226 && input.charCodeAt(i + 1) === 128 && input.charCodeAt(i + 2) === 156) {
            output += '"';
            i += 2;
        } else if (input.charCodeAt(i) === 226 && input.charCodeAt(i + 1) === 128 && input.charCodeAt(i + 2) === 157) {
            output += '"';
            i += 2;
        } else if (input.charCodeAt(i) === 226 && input.charCodeAt(i + 1) === 128 && input.charCodeAt(i + 2) === 166) {
            output += '...';
            i += 2;
        } else if (input.charCodeAt(i) === 246) {
            output += 'o';
        } else if (input.charCodeAt(i) === 220) {
            output += 'U';
        } else if (input.charCodeAt(i) === 252) {
            output += 'u';
        } else if (input.charCodeAt(i) === 305) {
            output += 'i';
        } else if (input.charCodeAt(i) === 287) {
            output += 'g';
        } else if (input.charCodeAt(i) === 231) {
            output += 'c';
        } else if (input.charCodeAt(i) === 214) {
            output += 'O';
        } else if (input.charCodeAt(i) === 304) {
            output += 'I';
        } else if (input.charCodeAt(i) === 351) {
            output += 's';
        } else if (input.charCodeAt(i) === 199) {
            output += 'C';
        } else if (input.charCodeAt(i) === 350) {
            output += 'S';
        } else {
            output += input.charCodeAt(i);
        }
    }

    return output;
}

module.exports = { getReq, getAlldebridURL, findAlternativeURL, findScriptWithEval, fixTurkishChars };
