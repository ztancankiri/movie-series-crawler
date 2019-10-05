const path = require('path');
const getSeries = require(path.join(process.cwd(), 'onlinedizi_parser', 'getSeries.js'));

module.exports = server => {
    server.post('/api/od/series', async (req, res) => {
        res.contentType = 'application/json';

        const genre = req.body ? req.body.genre : null;
        let result;
        try {
            result = await getSeries(genre);
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
