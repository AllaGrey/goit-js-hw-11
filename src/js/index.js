import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import '../css/styles.css';
import FindPixabayPictures from './api';
import LoadMoreBtn from './loadMore';
import {
  createMarkup,
  updateGallery,
  loadMoreUpdateGallery,
  clearGallery,
} from './markup';

const formRef = document.querySelector('.search-form');
const findPixabayPictures = new FindPixabayPictures();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHiden: true,
});

formRef.addEventListener('submit', onSearchingForm);
loadMoreBtn.button.addEventListener('click', onLoadMoreBtn);

function onSearchingForm(e) {
  e.preventDefault();
  clearGallery();
  const searchQuery = e.currentTarget.elements.searchQuery.value.trim();

  findPixabayPictures.searchQuery = searchQuery;
  findPixabayPictures.resetPage();
  fetchPictures().finally(() => formRef.reset());
}

async function fetchPictures() {
  try {
    const data = await findPixabayPictures.getPictures();
    const { totalHits, hits } = data;
    const numberOfpages = Math.floor(totalHits / 40);
    const currentPage = findPixabayPictures.page - 1;
    loadMoreBtn.disable();
    loadMoreBtn.hide();

    if (totalHits === 0 || findPixabayPictures.searchQuery === '') {
      throw new Error(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (numberOfpages > currentPage) {
      showQuantityPictures(totalHits);
      loadMoreBtn.show();
      loadMoreBtn.enable();
    } else {
      showQuantityPictures(totalHits);
      // Notiflix.Notify.info(
      //   "We're sorry, but you've reached the end of search results."
      // );
    }

    const markup = hits.map(picture => createMarkup(picture)).join('');
    updateGallery(markup);
    loadMoreBtn.enable();
  } catch (err) {
    onError(err);
  }
}

function onLoadMoreBtn() {
  loadMorePictures().finally(() => formRef.reset());
}

async function loadMorePictures() {
  const data = await findPixabayPictures.getPictures();
  const { totalHits, hits } = data;
  const numberOfpages = Math.floor(totalHits / 40);
  const currentPage = findPixabayPictures.page - 1;

  if (numberOfpages === currentPage) {
    loadMoreBtn.disable();
    loadMoreBtn.hide();
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }

  const markup = hits.map(picture => createMarkup(picture)).join('');
  loadMoreUpdateGallery(markup);
  loadMoreBtn.enable();
}

function onError(err) {
  Notiflix.Notify.failure(`${err.message}`);
}

function showQuantityPictures(totalHits) {
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}
