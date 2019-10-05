const path = require('path');
const getEpisodes = require(path.join(process.cwd(), 'dizibox_parser', 'getEpisodes.js'));

module.exports = server => {
    server.post('/api/episodes', async (req, res) => {
        res.contentType = 'application/json';
        const url = req.body.url;
        let result;
        try {
            result = await getEpisodes(url);
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
