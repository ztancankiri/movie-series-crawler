const path = require('path');
const cheerio = require('cheerio');
const util = require(path.join(process.cwd(), 'util.js'));

module.exports = async diziboxPage => {
    let response = await util.getReq(diziboxPage);
    let $ = cheerio.load(response);

    const alternativeList = $('select.woca-linkpages-dd').find('option');
	
	let molyDiziboxPage = util.findAlternativeURL(alternativeList, 'Moly+');
    if (molyDiziboxPage == null) molyDiziboxPage = util.findAlternativeURL(alternativeList, 'Moly');
	
	if (alternativeList.length === 1) {
		if (alternativeList.text().includes("Moly")) {
			molyDiziboxPage = diziboxPage;
		}
		else return null;
	}

    if (molyDiziboxPage == null) return null;

    response = await util.getReq(molyDiziboxPage);
    $ = cheerio.load(response);

    let iframeURL = $('#video-area')
        .find('iframe')
        .attr('src');

    iframeURL = iframeURL.replace('moly.php?h=', 'moly.php?wmode=opaque&h=');
    response = await util.getReq(iframeURL, molyDiziboxPage);
    $ = cheerio.load(response);

    let code = $('script');
    if (code.get() && code.get()[0] && code.get()[0].children && code.get()[0].children[0] && code.get()[0].children[0].data) {
        code = code.get()[0].children[0].data;
        code = code
            .replace('document.write(atob(unescape("', '')
            .replace('")));', '')
            .trim();

        code = unescape(code);
        code = Buffer.from(code, 'base64').toString('ascii');

        $ = cheerio.load(code);
        let playerURL = $('#Player')
            .find('iframe')
            .attr('src');

        response = await util.getReq(playerURL, iframeURL);
        $ = cheerio.load(response);

        let script = util.findScriptWithEval($("script[type='text/javascript']"));
        script = script.replace('eval(function(p,a,c,k,e,d)', 'function parseShit(p,a,c,k,e,d)');
        script = script.replace(".split('|')))", ".split('|'))").replace(';return p}(', ';return p} parseShit(');
        script = eval(script);

        const regex = /sources:(.*?),abouttext:/gm;
        let videoJSON = regex.exec(script)[1].toString();
        videoJSON = JSON.stringify(eval(videoJSON));
        videoJSON = JSON.parse(videoJSON);

        for (let i = 0; i < videoJSON.length; i++) {
            if (!videoJSON[i].file.includes('.mp4')) {
                videoJSON.splice(i, 1);
            }
        }

        console.log(videoJSON);

        return videoJSON;
    } else return null;
};
