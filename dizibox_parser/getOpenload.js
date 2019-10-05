const path = require('path');
const cheerio = require('cheerio');
const util = require(path.join(process.cwd(), 'util.js'));

module.exports = async diziboxPage => {
    let response = await util.getReq(diziboxPage);
    let $ = cheerio.load(response);

    const alternativeList = $('select.woca-linkpages-dd').find('option');
    let openDiziboxPage = util.findAlternativeURL(alternativeList, 'Open');

    if (openDiziboxPage == null) return null;

    response = await util.getReq(openDiziboxPage);
    $ = cheerio.load(response);

    const iframeURL = $('#video-area')
        .find('iframe')
        .attr('src');

    return util.getAlldebridURL(iframeURL);
};
