import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import '../css/styles.css';
import FindPixabayPictures from './api';
import LoadMoreBtn from './loadMore';
import simpleLightbox from 'simplelightbox';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};
const findPixabayPictures = new FindPixabayPictures();
const lightbox = new SimpleLightbox('.gallery a');
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHiden: true,
});

refs.form.addEventListener('submit', onSearchingForm);
loadMoreBtn.button.addEventListener('click', fetchPictures);

function onSearchingForm(e) {
  e.preventDefault();
  clearGallery();
  const searchQuery = e.currentTarget.elements.searchQuery.value.trim();

  findPixabayPictures.searchQuery = searchQuery;
  findPixabayPictures.resetPage();
  loadMoreBtn.show();
  loadMoreBtn.disable();
  fetchPictures().finally(() => refs.form.reset());
}

async function fetchPictures() {
  try {
    const data = await findPixabayPictures.getPictures();
    const { totalHits, hits } = data;
    const numberOfpages = Math.floor(totalHits / 40);
    const currentPage = findPixabayPictures.page - 1;

    showQuantityPictures(totalHits);

    if (totalHits === 0) {
      throw new Error(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (numberOfpages === currentPage) {
      loadMoreBtn.disable();
      loadMoreBtn.hide();
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }

    const markup = hits.map(picture => createMarkup(picture)).join('');
    updateGallery(markup);
    loadMoreBtn.enable();
  } catch (err) {
    onError(err);
  }
}

function onError(err) {
  Notiflix.Notify.failure(`${err.message}`);
}

function showQuantityPictures(totalHits) {
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

function createMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  const markup = `
  <div class="photo-card">
  <a class="gallery-link" href="${largeImageURL}" >
  <img src="${webformatURL}" alt="${tags}" loading="lazy"  />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <b>${likes}</b>
    </p>
    <p class="info-item">
      <b>Views</b>
      <b>${views}</b>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <b>${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <b>${downloads}</b>
    </p>
  </div>
</div>
  `;
  return markup;
}

function updateGallery(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
  smoothScroll();
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
