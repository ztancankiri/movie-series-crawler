const path = require('path');
const getEpisodes = require(path.join(process.cwd(), 'onlinedizi_parser', 'getEpisodes.js'));

module.exports = server => {
    server.post('/api/od/episodes', async (req, res) => {
        res.contentType = 'application/json';

        const seasonPage = req.body ? req.body.seasonPage : null;
        let result;
        try {
            result = await getEpisodes(seasonPage);
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
