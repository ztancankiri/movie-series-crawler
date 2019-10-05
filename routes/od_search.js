const path = require('path');
const getSearchResults = require(path.join(process.cwd(), 'onlinedizi_parser', 'getSearchResults.js'));

module.exports = server => {
    server.post('/api/od/search', async (req, res) => {
        res.contentType = 'application/json';
        const text = req.body.text;
        let result;
        try {
            result = await getSearchResults(text);
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
