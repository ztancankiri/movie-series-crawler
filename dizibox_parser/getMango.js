const path = require('path');
const cheerio = require('cheerio');
const util = require(path.join(process.cwd(), 'util.js'));

module.exports = async diziboxPage => {
    let response = await util.getReq(diziboxPage);
    let $ = cheerio.load(response);

    const alternativeList = $('select.woca-linkpages-dd').find('option');
    let mangoDiziboxPage = util.findAlternativeURL(alternativeList, 'Mango');

    if (mangoDiziboxPage == null) return null;

    response = await util.getReq(mangoDiziboxPage);
    $ = cheerio.load(response);

    const iframeURL = $('#video-area')
        .find('iframe')
        .attr('src');

    response = await util.getReq(iframeURL, mangoDiziboxPage);
    $ = cheerio.load(response);

    const streamEmbedURL = $('#Player')
        .find('iframe')
        .attr('src');

    return util.getAlldebridURL(streamEmbedURL);
};
