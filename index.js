import dotenv from "dotenv";
import mongoose from "mongoose";
import { getNews } from "./scrapeNews.js";
import News from "./News.js";
dotenv.config();

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;

async function start() {
  try {
    await mongoose.connect(
      `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:27017/lern`
    );
    setInterval(async () => {
      const news = await getNews();
      for (let el of news) {
        const { title, subtitle, img, dateInfo, text, url } = el;
        const isNews = await News.findOne({ url });
        if (!isNews) {
          const newsEl = new News({
            title,
            subtitle,
            img,
            dateInfo,
            text,
            url,
          });
          await newsEl.save();
        }
      }
      console.log("новости добавлены")
    }, 50000);
  } catch (error) {
    console.log(error);
  }
}

start();
