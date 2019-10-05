const path = require('path');
const getMango = require(path.join(process.cwd(), 'dizibox_parser', 'getMango.js'));

module.exports = server => {
    server.post('/api/mango', async (req, res) => {
        res.contentType = 'application/json';
        const url = req.body.url;
        let result;
        try {
            result = await getMango(url);
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
