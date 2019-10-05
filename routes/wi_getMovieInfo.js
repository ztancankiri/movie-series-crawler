const path = require('path');
const getMovieInfo = require(path.join(process.cwd(), 'webteizle_parser', 'getMovieInfo.js'));

module.exports = server => {
    server.post('/api/wi/movieinfo', async (req, res) => {
        res.contentType = 'application/json';
        const url = req.body.url;
        let result;
        try {
            result = await getMovieInfo(url);
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
