const path = require('path');
const rp = require('request-promise');
const util = require(path.join(process.cwd(), 'util.js'));

module.exports = async text => {
    const options = {
        method: 'POST',
        uri: 'https://onlinedizi.net/ajax_submit.php',
        form: {
            action: 'ajaxy_sf',
            sf_value: text,
            search: true
        }
    };

    try {
        let response = await rp(options);
        response = util.fixTurkishChars(response);
        response = response.replace("\\", "");
        response = JSON.parse(response);

        const results = response.diziler[0].all.map(element => {
            return { thumbnail: element.post_image, name: element.post_title.trim(), id: element.ID, url: element.post_link.replace('/diziler/', '/') };
        });

        return results;
    }
    catch (e) {
        console.log(e);
        return null;
    }
};
