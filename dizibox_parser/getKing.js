const path = require('path');
const cheerio = require('cheerio');
const util = require(path.join(process.cwd(), 'util.js'));
const rp = require('request-promise');

module.exports = async diziboxPage => {
    let response = await util.getReq(diziboxPage);
    let $ = cheerio.load(response);

    const alternativeList = $('select.woca-linkpages-dd').find('option');
    let kingDiziboxPage = util.findAlternativeURL(alternativeList, 'King 1080');

    if (kingDiziboxPage == null) return null;

    response = await util.getReq(kingDiziboxPage);
    $ = cheerio.load(response);

    const iframeURL = $('#video-area')
        .find('iframe')
        .attr('src');

    response = await util.getReq(iframeURL, kingDiziboxPage);

	const regex = /sources: (\[{[\s\S]*\]),/g;
	let videoJSON = regex.exec(response)[1].replace("\n", "").toString();
	videoJSON = eval(videoJSON);
	videoJSON = JSON.stringify(videoJSON);
	videoJSON = JSON.parse(videoJSON);

	const yandexURL = videoJSON[0].file;
	
	const res = await rp({
		uri: yandexURL,
		method: 'GET',
		simple: false,
		followRedirect :false,
		resolveWithFullResponse: true
	});

	const videoURL = res.headers.location;

	return videoURL;
};
