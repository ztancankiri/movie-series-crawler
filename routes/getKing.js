const path = require('path');
const getKing = require(path.join(process.cwd(), 'dizibox_parser', 'getKing.js'));

module.exports = server => {
    server.post('/api/king', async (req, res) => {
        res.contentType = 'application/json';
        const url = req.body.url;
        let result;
        try {
            result = await getKing(url);
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
