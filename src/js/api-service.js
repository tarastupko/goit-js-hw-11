import axios from 'axios';

export default async function getFetch(Npage, perPage, searchResponse) {
  const API_KEY = `37981342-0f90df91f416340ea3cce758a`;
  const BASE_URL = `https://pixabay.com/api/`;

  try {
    const params = new URLSearchParams({
      image_types: 'photo',
      orientation: 'horizontal',
      q: searchResponse,
      page: Npage,
      per_page: perPage,
      safesearch: 'true',
    });

    const response = await axios.get(`${BASE_URL}?key=${API_KEY}&${params}`);
    return response;
  } catch (error) {
    console.error(error);
  }
}