import axios from "axios";
import { environment } from "./environment";

export const getUnsplashImage = async (query: string) => {
  console.log(environment.UNSPLASH_API_KEY);
  const { data } = await axios.get(`
    https://api.unsplash.com/search/photos?per_page=1&query=${query}&client_id=${environment.UNSPLASH_API_KEY}
    `);
  return data.results[0].urls.small_s3;
};
