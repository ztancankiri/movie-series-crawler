const path = require('path');
const cheerio = require('cheerio');
const util = require(path.join(process.cwd(), 'util.js'));

module.exports = async seasonPage => {
    let response = await util.getReq(seasonPage);
    let $ = cheerio.load(util.fixTurkishChars(response));

    try {
        const result = [];

        const episodes = $('div.b-video');

        for (let i = 0; i < episodes.length; i++) {
            const episode = { name: $(episodes[i]).text().trim().split('\n')[0], url: $(episodes[i]).find('a').attr('href'), thumbnail: $(episodes[i]).find('img').attr('src'), date: $(episodes[i]).find('div.post-date').text().trim() };
            result.push(episode);
        }

        return result;
    }
    catch (e) {
        console.log(e);
        return null;
    }
};
