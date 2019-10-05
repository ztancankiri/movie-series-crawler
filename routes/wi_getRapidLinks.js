const path = require('path');
const getRapidLinks = require(path.join(process.cwd(), 'webteizle_parser', 'getRapidLinks.js'));

module.exports = server => {
    server.post('/api/wi/rapid', async (req, res) => {
        res.contentType = 'application/json';
        const rapidid = req.body.rapidid;
        let result;
        try {
            result = await getRapidLinks(rapidid);
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
