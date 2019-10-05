const path = require('path');
const cheerio = require('cheerio');
const util = require(path.join(process.cwd(), 'util.js'));
const rp = require('request-promise');

module.exports = async diziboxPage => {
    let response = await util.getReq(diziboxPage);
    let $ = cheerio.load(response);

    const alternativeList = $('select.woca-linkpages-dd').find('option');
    let molyDiziboxPage = null;

    if (alternativeList.length === 1) {
        if (alternativeList.text().includes('Moly')) {
            molyDiziboxPage = diziboxPage;
        } else return null;
    }
    else {
        molyDiziboxPage = util.findAlternativeURL(alternativeList, 'Moly+');
        if (molyDiziboxPage == null) molyDiziboxPage = util.findAlternativeURL(alternativeList, 'Moly');
        if (molyDiziboxPage == null) return null;
    }

    response = await util.getReq(molyDiziboxPage);
    $ = cheerio.load(response);

    let iframeURL = $('#video-area')
        .find('iframe')
        .attr('src');

    iframeURL = iframeURL.replace('moly.php?h=', 'moly.php?wmode=opaque&h=');
    response = await util.getReq(iframeURL, molyDiziboxPage);
    $ = cheerio.load(response);

    if (response.includes('document.write(atob(unescape("')) {
        let code = $('script');
        if (code.get() && code.get()[0] && code.get()[0].children && code.get()[0].children[0] && code.get()[0].children[0].data) {
            code = code.get()[0].children[0].data;
            code = code
                .replace('document.write(atob(unescape("', '')
                .replace('")));', '')
                .trim();

            code = unescape(code);
            code = Buffer.from(code, 'base64').toString('ascii');
            $ = cheerio.load(code);
        } else return null;
    }

    let playerURL = $('#Player')
        .find('iframe')
        .attr('src');

    const downloadID = playerURL.replace('https://vidmoly.me/embed-', '').replace('.html', '');

    const res = await rp({
        uri: 'https://vidmoly.me/',
        method: 'POST',
        simple: false,
        followRedirect: false,
        resolveWithFullResponse: true,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36'
        },
        form: {
            op: 'login',
            redirect: '',
            login: 'keradoxa',
            password: '123456789'
        }
    });
    const cookies = res.headers['set-cookie'];
    let cookie_xfsts = null;

    for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].includes('xfsts')) {
            const regex = /xfsts=(.*?); domain/gm;
            cookie_xfsts = regex.exec(cookies[i])[1].toString();
            i = cookies.length;
        }
    }

    const downloadPage = await util.getReq('https://vidmoly.me/d/' + downloadID);
    $ = cheerio.load(downloadPage);
    const hash = $("Form[name='F1']")
        .find("input[name='hash']")
        .val();

    const id = $("Form[name='F1']")
        .find("input[name='id']")
        .val();

    const downloadLinkPage = await rp({
        uri: 'https://vidmoly.me/d/' + downloadID,
        method: 'POST',
        followAllRedirects: true,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',
            Cookie: 'xfsts=' + cookie_xfsts + ';',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            op: 'download_orig',
            id: id,
            mode: 'n',
            hash: hash
        }
    });

    $ = cheerio.load(downloadLinkPage);
    const videoLink = $("meta[http-equiv='refresh']")
        .attr('content')
        .replace('0;URL=', '');

    return [{ label: '720p', file: videoLink }];
};