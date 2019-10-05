const path = require('path');
const cheerio = require('cheerio');
const rp = require('request-promise');
const util = require(path.join(process.cwd(), 'util.js'));

async function getOpenload(openloadPage) {
    response = await util.getReq(openloadPage);
    $ = cheerio.load(util.fixTurkishChars(response));
    const playerN = 'https:' + $('iframe[webkitallowfullscreen]').attr('src');
    
    response = await util.getReq(playerN);
    $ = cheerio.load(util.fixTurkishChars(response));

    let playerP = $("script:contains('ifsrc')").html().trim();

    let regex = /var ifsrc = "(.*?)"/gm;
    playerP = 'https:' + regex.exec(playerP)[1].toString();

    const res = await rp({
        uri: playerP,
        method: 'GET',
        simple: false,
        followRedirect :false,
        resolveWithFullResponse: true,
        headers: {
            'Referer': playerN
        }
    });

    const videoURL = res.headers.location.replace('<br />', '');

    regex = /\/embed\/(.*?)\//;
    const videoID = regex.exec(videoURL)[1].toString();
    const video = await util.getAlldebridURL(videoURL);

    return video;
}

module.exports = async episode => {
    let response = await util.getReq(episode);
    let $ = cheerio.load(util.fixTurkishChars(response));

    try {
        const result = [];

        const alternatives = $('ul.dropdown-menu').find('li');
/*
        result.push({ name: $(alternatives).find(":contains('VEGA')").text(), url: $(alternatives).find(":contains('VEGA')").attr('href') });
        result.push({ name: $(alternatives).find(":contains('Openload')").text(), url: $(alternatives).find(":contains('Openload')").attr('href') });
        result.push({ name: $(alternatives).find(":contains('mango')").text(), url: $(alternatives).find(":contains('mango')").attr('href') });

*/
        const openload = $(alternatives).find(":contains('Openload')").attr('href');
        result.push(await getOpenload(openload));

        

        return result;
    }
    catch (e) {
        console.log(e);
        return null;
    }
};
