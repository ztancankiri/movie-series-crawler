const path = require('path');
const getMovieCards = require(path.join(process.cwd(), 'webteizle_parser', 'getMovieCards.js'));

module.exports = server => {
    server.post('/api/wi/searchresults', async (req, res) => {
        res.contentType = 'application/json';
        const text = req.body.text;
        let result;
        try {
            result = await getMovieCards('https://webteizle.vip/filtre.asp?a=' + encodeURI(text));
            if (result !== null) {
                result = { success: 'success', data: result };
            } else {
                console.log('null');
                result = { error: e };
            }
        } catch (e) {
            console.log(e);
            result = { error: e };
        } finally {
            res.send(result);
        }
    });
};
