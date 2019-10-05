const path = require('path');
const cheerio = require('cheerio');
const util = require(path.join(process.cwd(), 'util.js'));

module.exports = async () => {
    let response = await util.getReq("https://onlinedizi.net/yabanci-diziler/");
    let $ = cheerio.load(util.fixTurkishChars(response));

    const genreList = $('li.genre');

    const list = [];
    for (let i = 0; i < genreList.length; i++) {
        list.push($(genreList[i]).text().trim());
    }

    return list;
};
