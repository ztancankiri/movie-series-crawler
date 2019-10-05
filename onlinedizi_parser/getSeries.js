const path = require('path');
const cheerio = require('cheerio');
const util = require(path.join(process.cwd(), 'util.js'));

module.exports = async genre => {
    let response = await util.getReq("https://onlinedizi.net/yabanci-diziler/");
    let $ = cheerio.load(util.fixTurkishChars(response));

    const seriesList = $('div.category-post-box');

    const list = [];
    for (let i = 0; i < seriesList.length; i++) {
        const item = {};
        const serie = $(seriesList[i]).parent().parent();

        item.genre = serie.attr('data-genre').split(',').map(element => {
            return element.trim();
        });

        if (item.genre.length === 1 && item.genre[0].length === 0) {
            item.genre = [];
        }

        if (genre) {
            if (item.genre.includes(genre)) {
                item.url = serie.find('a').attr('href');
                item.name = serie.text().trim();
                item.thumbnail = serie.find('img').attr('src');
        
                list.push(item);
            }
        }
        else {
            item.url = serie.find('a').attr('href');
            item.name = serie.text().trim();
            item.thumbnail = serie.find('img').attr('src');
    
            list.push(item);
        }
    }

    return list;
};
