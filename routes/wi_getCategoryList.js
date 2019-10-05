const path = require('path');
const getCategoryList = require(path.join(process.cwd(), 'webteizle_parser', 'getCategoryList.js'));

module.exports = server => {
    server.get('/api/wi/categorylist', async (req, res) => {
        res.contentType = 'application/json';
        let result;
        try {
            result = await getCategoryList();
            if (result !== null) {
                result = { success: 'success', data: result };
            } else {
                console.log('null');
                result = { error: e };
            }
        } catch (e) {
            console.log(e);
            result = { error: e };
        } finally {
            res.send(result);
        }
    });
};
