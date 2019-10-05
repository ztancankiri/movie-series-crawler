const path = require('path');
const cheerio = require('cheerio');
const util = require(path.join(process.cwd(), 'util.js'));

module.exports = async url => {
    let response = await util.getReq(url);
    let $ = cheerio.load(util.fixTurkishChars(response));

    const cards = $('.card.golgever');

    const results = [];

    for (let i = 0; i < cards.length; i++) {
        const card = $(cards[i]);
        const result = {};

        result.name = card.find('.filmname').text();
        result.year = card.find('.year').text();
        result.imdb = card.find('.imdb').text();
        result.type = card.find('.tur').text();
        result.thumbnail =
            'https:' +
            card
                .find('img')
                .attr('src')
                .replace('/i/afis/', '/i/afis/b/');

        const regex = /a([0-9]+)\.jpg/gm;
        result.id = regex.exec(result.thumbnail)[1].toString();

        result.sub = card.find('.us.flag').length > 0;
        result.dub = card.find('.tr.flag').length > 0;
        result.info_page = 'https://webteizle.vip' + card.find("a[class='image']").attr('href');

        if (card.find('.youtube.red.icon').length > 0)
            result.trailer =
                'https://www.youtube.com/watch?v=' +
                card
                    .find('.youtube.red.icon')
                    .parent()
                    .attr('data-yt');
        else result.trailer = null;

        results.push(result);
    }

    return results;
};
