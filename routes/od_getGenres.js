const path = require('path');
const getGenres = require(path.join(process.cwd(), 'onlinedizi_parser', 'getGenres.js'));

module.exports = server => {
    server.get('/api/od/genres', async (req, res) => {
        res.contentType = 'application/json';
        let result;
        try {
            result = await getGenres();
            if (result !== null) {
                result = { success: 'success', data: result };
            } else {
                result = { error: e };
            }
        } catch (e) {
            result = { error: e };
        } finally {
            res.send(result);
        }
    });
};
