const path = require('path');
const cheerio = require('cheerio');
const util = require(path.join(process.cwd(), 'util.js'));

module.exports = async seriePage => {
    let response = await util.getReq(seriePage);
    let $ = cheerio.load(util.fixTurkishChars(response));

    try {
        const result = {};

        const list = [];
        const currentSeason = $('span.page-number');
        const otherSeasons = $('a.page-number');

        list.push({ name: currentSeason.text().trim(), url: seriePage});
        for (let i = 0; i < otherSeasons.length; i++) {
            list.push({ name: $(otherSeasons[i]).text().trim(), url: $(otherSeasons[i]).attr('href') });
        }

        result.seasons = list;
        result.description = $('div.series-description').text().trim().replace('\n', ' ').replace('\n', ' ').replace('\n', ' ');

        const regex = /background-image: url\('(.*?)'\);/gm;
        result.thumbnail = $("div[style*='background-position-y: center;']").attr('style');
        result.thumbnail = regex.exec(result.thumbnail)[1].toString();

        return result;
    }
    catch (e) {
        console.log(e);
        return null;
    }
};
