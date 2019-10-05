const path = require('path');
const getMoly = require(path.join(process.cwd(), 'dizibox_parser', 'getMoly.js'));

module.exports = server => {
    server.post('/api/moly', async (req, res) => {
        res.contentType = 'application/json';
        const url = req.body.url;
        let result;
        try {
            result = await getMoly(url);
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
