import puppeteer from "puppeteer";
import News from "./News.js";

const scrape = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const currentUrl = "https://ria.ru/lenta/";

  await page.goto(currentUrl);

  await page.waitForSelector(".list");

  const result = await page.evaluate(async() => {
    let dataSrc = [];
    let elements = document.querySelectorAll(".list-item");
    for (const element of elements) {
      // const isUrl = await News.findOne({url: element.querySelector(".list-item__title").getAttribute("href")})
      dataSrc.push(
        element.querySelector(".list-item__title").getAttribute("href")
      );
    }
    return dataSrc;
  });
  await browser.close();
  return result;
};



const scrapeNews = async (urls) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let data = [];
  for (let url of urls.slice()) {
    await page.goto(url);

    await page.waitForSelector(".article");

    const result = await page.evaluate(() => {
      const article = document.querySelector(".layout-article__600-align")
      let texts = Array.from(article.querySelectorAll(".article__text"));
      let photoviewOpen = article.querySelector(".photoview__open");
      if (!photoviewOpen) {
        return ""
      }

      let data = {
        title: document.querySelector(".article__title")?.innerText ,
        subtitle:
          document.querySelector(".article__second-title")?.innerText,
        img: photoviewOpen.querySelector("img").getAttribute("src"),
        dateInfo:
          document.querySelector(".article__info-date")?.innerText,
        text: [],
        url: document.URL
      };
      texts.forEach((item) => data.text.push(item?.innerText));
      return data;
    });
    data.push(result);
  }
  await browser.close();
  return data;
};

export const getNews = async () => {
  const newsUrl = await scrape();
  const data = await scrapeNews(newsUrl);
  return  data;
};
