const path = require('path');
const cheerio = require('cheerio');
const util = require(path.join(process.cwd(), 'util.js'));

module.exports = async seasonPage => {
    let response = await util.getReq(seasonPage);
    let $ = cheerio.load(util.fixTurkishChars(response));

    const episodeList = $('#category-posts').find('div.post-title');

    const results = [];

    for (let i = 0; i < episodeList.length; i++) {
        let episode = $(episodeList[i]);
        let a1 = episode.find('a.season-episode');
        let small = episode.find('small');

        results.push({ name: a1.text(), url: a1.attr('href'), date: small.text() });
    }

    return results;
};
