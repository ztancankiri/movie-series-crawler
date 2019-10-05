const path = require('path');
const getRapid = require(path.join(process.cwd(), 'dizibox_parser', 'getRapid.js'));

module.exports = server => {
    server.post('/api/rapid', async (req, res) => {
        res.contentType = 'application/json';
        const url = req.body.url;
        let result;
        try {
            result = await getRapid(url);
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
