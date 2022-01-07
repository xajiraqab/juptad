const puppeteer = require("puppeteer");


async function getMovieFromUrl(url) {

	const isImovie = url[12] !== "a"
	let movie;

	try {
		const browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();
		await page.goto(url);


		await page.waitForSelector('.vjs-tech', { visible: true }).then(async () => {

			movie = {
				src: await page.$eval(".vjs-tech", element => element.getAttribute("src")),
				title: await page.title(),
				description: await page.$eval("head > meta[property='og:description']", element => element.content),
				image: isImovie ? await page.$eval(".movie-info img", element => element.getAttribute("src")) : await page.$eval("div[poster]", element => element.getAttribute("poster")),
			}

			browser.close();
		});
	}
	catch (error) {
		movie = { error: "not found" }
	}

	return movie
}

module.exports = getMovieFromUrl