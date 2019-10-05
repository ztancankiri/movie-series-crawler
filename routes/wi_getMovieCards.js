const path = require('path');
const getMovieCards = require(path.join(process.cwd(), 'webteizle_parser', 'getMovieCards.js'));

module.exports = server => {
    server.post('/api/wi/moviecards', async (req, res) => {
        res.contentType = 'application/json';
        const url = req.body.url;
        let result;
        try {
            result = await getMovieCards(url);
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
