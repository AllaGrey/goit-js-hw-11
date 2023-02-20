import axios from 'axios';

const ENDPOINT = 'https://pixabay.com/api/';

export default class FindPixabayPictures {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
  }

  async getPictures() {
    const URL = `${ENDPOINT}?key=33677116-85723a5144d957b1da7c90df9&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;
    const response = await axios.get(URL);
    const data = await response.data;
    this.incrementPage();
    return data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
