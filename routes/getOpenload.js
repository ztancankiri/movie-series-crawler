const path = require('path');
const getOpenload = require(path.join(process.cwd(), 'dizibox_parser', 'getOpenload.js'));

module.exports = server => {
    server.post('/api/openload', async (req, res) => {
        res.contentType = 'application/json';
        const url = req.body.url;
        let result;
        try {
            result = await getOpenload(url);
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
