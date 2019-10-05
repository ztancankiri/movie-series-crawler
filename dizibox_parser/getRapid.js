const path = require('path');
const cheerio = require('cheerio');
const util = require(path.join(process.cwd(), 'util.js'));

module.exports = async diziboxPage => {
    let response = await util.getReq(diziboxPage);
    let $ = cheerio.load(response);

    const alternativeList = $('select.woca-linkpages-dd').find('option');
    let rapidDiziboxPage = util.findAlternativeURL(alternativeList, 'Rapid');

    if (rapidDiziboxPage == null) return null;

    response = await util.getReq(rapidDiziboxPage);
    $ = cheerio.load(response);

    const iframeURL = $('#video-area')
        .find('iframe')
        .attr('src');
    const rapidID = iframeURL.replace('https://www.dizibox.pw/player/cdn/cdn2.php?v=', '');

    response = await util.getReq('https://www.rapidvideo.com/d/' + rapidID);
    $ = cheerio.load(response);

    const results = [];
    try {
        const downloadButtons = $('#button-download');
        for (let i = 0; i < downloadButtons.length; i++) {
            let button = $(downloadButtons[i]);
            results.push({
                res: button
                    .text()
                    .replace('Download ', '')
                    .trim(),
                url: button.attr('href')
            });
        }
    } catch (e) {
        return null;
    }

    return results;
};
