const path = require('path');
const getEpisode = require(path.join(process.cwd(), 'onlinedizi_parser', 'getEpisode.js'));

module.exports = server => {
    server.post('/api/od/episode', async (req, res) => {
        res.contentType = 'application/json';

        const episode = req.body ? req.body.episode : null;
        let result;
        try {
            result = await getEpisode(episode);
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
