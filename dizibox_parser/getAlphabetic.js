const path = require('path');
const cheerio = require('cheerio');
const util = require(path.join(process.cwd(), 'util.js'));

module.exports = async () => {
    let response = await util.getReq('https://www.dizibox.pw/');
    let $ = cheerio.load(util.fixTurkishChars(response));

    const lists = $('ul.alphabetical-category-list');

    const results = {};
    for (let i = 0; i < lists.length; i++) {
        let l = $(lists[i]);
        const key = l.attr('data-index');
        results[key] = [];

        const elements = l.find('a');
        for (let i = 0; i < elements.length; i++) {
            let s = $(elements[i]);
            results[key].push({ name: s.text().trim(), url: s.attr('href') });
        }
    }

    return results;
};
