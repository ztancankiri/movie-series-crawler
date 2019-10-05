const path = require('path');
const cheerio = require('cheerio');
const util = require(path.join(process.cwd(), 'util.js'));

module.exports = async () => {
    let response = await util.getReq('https://webteizle.vip/');
    let $ = cheerio.load(response);

    const lists = $('.katagoriler').find('a');

    const results = [];
    for (let i = 0; i < lists.length; i++) {
        const category = $(lists[i]);
        results.push({ name: category.text().trim(), url: 'https://webteizle.vip' + category.attr('href') });
    }

    return results;
};
