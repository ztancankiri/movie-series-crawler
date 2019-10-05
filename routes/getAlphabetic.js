const path = require('path');
const getAlphabetic = require(path.join(process.cwd(), 'dizibox_parser', 'getAlphabetic.js'));

module.exports = server => {
    server.get('/api/alphabetic', async (req, res) => {
        res.contentType = 'application/json';
        let result;
        try {
            result = await getAlphabetic();
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
