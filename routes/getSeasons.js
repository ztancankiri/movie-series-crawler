const path = require('path');
const getSeasons = require(path.join(process.cwd(), 'dizibox_parser', 'getSeasons.js'));

module.exports = server => {
    server.post('/api/seasons', async (req, res) => {
        res.contentType = 'application/json';
        const url = req.body.url;
        let result;
        try {
            result = await getSeasons(url);
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
