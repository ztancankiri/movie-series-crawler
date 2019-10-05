const path = require('path');
const cheerio = require('cheerio');
const util = require(path.join(process.cwd(), 'util.js'));

module.exports = async text => {
    let response = await util.getReq('https://www.dizibox.pw/?s=' + text);
    let $ = cheerio.load(response);

    const searchList = $('#search').find('article.detailed-article');

    const results = [];

    for (let i = 0; i < searchList.length; i++) {
        let s = $(searchList[i]);

        results.push({
            name: s.find('h3').text(),
            thumbnail: s.find('img').attr('src'),
            url: s
                .find('h3')
                .find('a')
                .attr('href')
        });
    }

    return results;
};
