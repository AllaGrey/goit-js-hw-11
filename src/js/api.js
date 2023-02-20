import axios from 'axios';

const ENDPOINT = 'https://pixabay.com/api/';
// const options = {
//   headers: {
//     key: '33677116-85723a5144d957b1da7c90df9',
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: true,
//   },
// };
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
    // const { webformatURL, largeImageURL, tags, likes } = hits;

    // console.log(response, 'resp');
    // console.log(hits, 'hits');

    // console.log(hits.webformatURL);
    // return fetch(URL)
    //   .then(response => response.json())
    //   .then(({ webformatURL, largeImageURL, tags, likes }) => {
    //     this.incrementPage();
    //     console.log({ webformatURL, largeImageURL, tags, likes });
    //   });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
