const path = require('path');
const getSeasons = require(path.join(process.cwd(), 'onlinedizi_parser', 'getSeasons.js'));

module.exports = server => {
    server.post('/api/od/seasons', async (req, res) => {
        res.contentType = 'application/json';

        const seriePage = req.body ? req.body.seriePage : null;
        let result;
        try {
            result = await getSeasons(seriePage);
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
