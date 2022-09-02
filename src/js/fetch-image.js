import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const KEY = '29549737-0e26c7f130412282b7a563f88';
export default async function newApiImg(query, page) {
  const response = await axios.get(`${BASE_URL}`, {
    params: {
      key: KEY,
      q: query,
      page,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
    },
  });
  return response.data;
}
