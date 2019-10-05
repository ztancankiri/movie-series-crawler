const path = require('path');
const cheerio = require('cheerio');
const util = require(path.join(process.cwd(), 'util.js'));

module.exports = async url => {
    let response = await util.getReq(url);
    let $ = cheerio.load(util.fixTurkishChars(response));

    const result = {};
    result.title = $('div.filmhead')
        .find('a:not(.label)')
        .parent()
        .text();

    result.imdb_url = $('div.filmhead')
        .find('a.imdbp')
        .attr('href');

    result.summary = $('div.filmkonu')
        .find('p')
        .text();

    result.director = [];
    result.country = [];
    result.category = [];

    const arr_tr = $('div.bilgi')
        .find('table')
        .find('tr');

    for (let i = 0; i < arr_tr.length; i++) {
        const arr_td = $(arr_tr[i]).find('td');

        for (let j = 0; j < arr_td.length; j++) {
            const td = $(arr_td[j]);

            if (td.text() === 'Yonetmen:') {
                const arr_a = $(td.next()).find('a');

                for (let k = 0; k < arr_a.length; k++) {
                    const a = $(arr_a[k]);
                    result.director.push(a.text().trim());
                }
            } else if (td.text() === 'Ulke:') {
                const arr_a = $(td.next()).find('a');

                for (let k = 0; k < arr_a.length; k++) {
                    const a = $(arr_a[k]);
                    result.country.push(a.text().trim());
                }
            } else if (td.text() === 'Tur:') {
                const arr_a = $(td.next()).find('a');

                for (let k = 0; k < arr_a.length; k++) {
                    const a = $(arr_a[k]);
                    result.category.push(a.text().trim());
                }
            } else if (td.text() === 'Butce:') {
                result.cost = td
                    .next()
                    .text()
                    .trim();
            } else if (td.text() === 'Hasilat:') {
                result.income = td
                    .next()
                    .text()
                    .trim();
            } else if (td.text() === 'Sure:') {
                result.duration = td
                    .next()
                    .text()
                    .trim();
            } else if (td.text() === 'Nam-i Diger:') {
                result.other_name = td
                    .next()
                    .text()
                    .trim();
            } else if (td.text() === 'Vizyon Tarihi:') {
                result.release = td
                    .next()
                    .text()
                    .trim();
            }
        }
    }

    result.thumbnail =
        'https:' +
        $('div.afis')
            .find('div.card')
            .find('img')
            .attr('src');

    const regex = /a([0-9]+)\.jpg/gm;
    result.id = regex.exec(result.thumbnail)[1].toString();

    result.sub = $('div.afis').find('.us.flag').length > 0;
    result.dub = $('div.afis').find('.tr.flag').length > 0;

    if ($('div.afis').find('.youtube.red.icon').length > 0)
        result['trailer'] =
            'https://www.youtube.com/watch?v=' +
            $('div.afis')
                .find('.youtube.red.icon')
                .parent()
                .attr('data-ytid');
    else result['trailer'] = null;

    return result;
};
