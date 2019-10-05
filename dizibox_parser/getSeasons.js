const path = require('path');
const cheerio = require('cheerio');
const util = require(path.join(process.cwd(), 'util.js'));

module.exports = async dizipage => {
    let response = await util.getReq(dizipage);
    let $ = cheerio.load(util.fixTurkishChars(response));

    const seasonList = $('#seasons-list').find('a');

    const result = {};
    result.seasons = [];
    for (let i = 0; i < seasonList.length; i++) {
        let season = $(seasonList[i]);
        result.seasons.push({ name: season.text(), url: season.attr('href') });
    }

    result.title = $('div.title-terms').find('h1').text().trim();
    result.thumbnail = $('img.main-cover').attr('src');
    result.summary = $('div.tv-story').text().trim().replace('\n', ' ').replace('\n', ' ').replace('\n', ' ');

    result.imdb = $('div.title-terms').find('span.label-imdb').find('b').text();
    
    const typesTags = $('div.title-terms').find('i.icon-hash').parent().find('a');
    result.type = [];
    for (let i = 0; i < typesTags.length; i++) {
        let type = $(typesTags[i]);
        result.type.push(type.text());
    }

    result.release = $('div.title-terms').find('i.icon-calendar').parent().find('a').text();

    const countries = $('div.title-terms').find('i.icon-globe').parent().find('a');
    result.countries = [];
    for (let i = 0; i < countries.length; i++) {
        let country = $(countries[i]);
        result.countries.push(country.text());
    }

    return result;
};
