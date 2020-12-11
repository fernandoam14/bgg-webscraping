const Puppeteer = require("puppeteer");
const UtilDatabase = require("../database/utilDatabase.js");

const MAIN_URL = "https://boardgamegeek.com";
const BROWSING_URL = "https://boardgamegeek.com/browse/boardgame/";
const MAX_PAGES = 12;
const MAX_GAMES_PER_PAGE = 100;
const INSERT_BATCH_SIZE = 50;

async function reducePageOverhead(page) {
  /*
   * If the page makes a request to a resource type of image or stylesheet it is aborted.
   */
  await page.setRequestInterception(true);

  page.on("request", (request) => {
    if (
      request.resourceType() === "image" ||
      request.resourceType() === "stylesheet"
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });
}

async function scrapeGamePage(browser, url, gameRatings) {
  /*
   * Opens a new page in the browser with the given URL.
   */
  const page = await browser.newPage();
  await reducePageOverhead(page);
  await page.goto(url, { waituntil: "domcontentloaded", timeout: 0 });

  /*
   * Creates a new game object with data extracted from scraping its webpage.
   */
  let game = {};

  game.id = gameRatings.rank;

  game.name = await page.evaluate(() => {
    return document
      .querySelector(".game-header-title-info > h1 > a")
      .innerText.trim();
  });

  game.year = await page.evaluate(() => {
    return document
      .querySelector(".game-header-title-info > h1 > span")
      .innerText.trim()
      .slice(1, -1);
  });

  game.description = await page.evaluate(() => {
    return document
      .querySelector(".game-header-title-info > p")
      .innerText.trim();
  });

  game.playerCount = await page.evaluate(() => {
    return document
      .querySelectorAll(".gameplay > li")
      .item(0)
      .querySelector(".gameplay-item-primary > span")
      .innerText.trim();
  });

  game.playingTime = await page.evaluate(() => {
    return document
      .querySelectorAll(".gameplay > li")
      .item(1)
      .querySelector(".gameplay-item-primary > span > span")
      .innerText.trim();
  });

  game.minimumAge = await page.evaluate(() => {
    return document
      .querySelectorAll(".gameplay > li")
      .item(2)
      .querySelector(".gameplay-item-primary > span")
      .innerText.trim()
      .slice(0, -1);
  });

  game.complexity = await page.evaluate(() => {
    return document
      .querySelectorAll(".gameplay > li")
      .item(3)
      .querySelector(".gameplay-item-primary > span > span")
      .innerText.trim();
  });

  game.geekRating = gameRatings.geekRating;
  game.averageRating = gameRatings.averageRating;
  game.numberVoters = gameRatings.numberVoters;

  /*
   * Closes the page.
   */
  await page.close();

  return game;
}

async function scrapeBrowsingPage(browser, url, db) {
  /*
   * Opens a new page in the browser with the given URL.
   */
  const page = await browser.newPage();
  await reducePageOverhead(page);
  await page.goto(url, { waituntil: "domcontentloaded", timeout: 0 });

  let inserts = [];
  let gamesArray = [];

  /*
   * Runs for each game listed in the browsing page.
   */
  for (let i = 1; i <= MAX_GAMES_PER_PAGE; i++) {
    /*
     * Creates a new game ratings object with some data extracted from the browsing page.
     */
    let gameRatings = {};

    gameRatings.rank = await page.evaluate((i) => {
      return document
        .querySelectorAll("tr")
        .item(i)
        .querySelector(".collection_rank")
        .innerText.trim();
    }, i);

    gameRatings.geekRating = await page.evaluate((i) => {
      return document
        .querySelectorAll("tr")
        .item(i)
        .querySelectorAll(".collection_bggrating")
        .item(0)
        .innerText.trim();
    }, i);

    gameRatings.averageRating = await page.evaluate((i) => {
      return document
        .querySelectorAll("tr")
        .item(i)
        .querySelectorAll(".collection_bggrating")
        .item(1)
        .innerText.trim();
    }, i);

    gameRatings.numberVoters = await page.evaluate((i) => {
      return document
        .querySelectorAll("tr")
        .item(i)
        .querySelectorAll(".collection_bggrating")
        .item(2)
        .innerText.trim();
    }, i);

    const gameUrl =
      MAIN_URL +
      (await page.evaluate((i) => {
        return document
          .querySelectorAll("tr")
          .item(i)
          .querySelector(".collection_thumbnail > a")
          .getAttribute("href");
      }, i));

    /*
     * Checks if a new page can be opened in the browser. Limit is set to MAX_PAGES for speed purposes.
     */
    let allPages = await browser.pages();

    while (allPages.length === MAX_PAGES) {
      allPages = await browser.pages();

      await new Promise(function (resolve, reject) {
        setTimeout(resolve, 1000);
      });
    }

    /*
     * Calls the game page scraper giving the game page URL.
     */
    let game = scrapeGamePage(browser, gameUrl, gameRatings);
    gamesArray.push(game);

    /*
     * Inserts games in database in batches of INSERT_BATCH_SIZE.
     */
    if (gamesArray.length === INSERT_BATCH_SIZE) {
      inserts.push(UtilDatabase.insertGames(db, gamesArray));
      gamesArray = [];
    }
  }

  /*
   * Closes the page.
   */
  await page.close();

  /*
   * Waits for all database inserts to be made.
   */
  await Promise.all(inserts);
}

async function scrapeBgg() {
  /*
   * Opens a new headless browser.
   */
  const browser = await Puppeteer.launch();

  /*
   * Creates the BoardGames database.
   */
  const db = UtilDatabase.openDatabase("../database/boardgames.db");
  UtilDatabase.createTables(db);

  /*
   * Calls the browsing page scraper giving the browsing page URL.
   */
  await scrapeBrowsingPage(browser, BROWSING_URL, db);

  /*
   * Closes the database and the browser.
   */
  UtilDatabase.closeDatabase(db);
  await browser.close();
}

/*
 * Main function.
 */
(async () => {
  console.log("Start webscraping BGG.");
  const startTime = new Date();

  await scrapeBgg();

  const endTime = new Date();
  console.log("Time elapsed:");
  console.log(((endTime - startTime) / 1000).toFixed(2));
})();
