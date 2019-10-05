const path = require('path');
const cheerio = require('cheerio');
const util = require(path.join(process.cwd(), 'util.js'));

module.exports = async rapidid => {
    const response = await util.getReq('https://www.rapidvideo.com/d/' + rapidid);
    $ = cheerio.load(response);

    const results = [];
    try {
        const downloadButtons = $('#button-download');
        for (let i = 0; i < downloadButtons.length; i++) {
            let button = $(downloadButtons[i]);
            results.push({
                res: button
                    .text()
                    .replace('Download ', '')
                    .trim(),
                url: button.attr('href')
            });
        }
    } catch (e) {
        return null;
    }

    return results;
};
