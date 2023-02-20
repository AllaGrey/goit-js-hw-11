const galleryRef = document.querySelector('.gallery');
const lightbox = new SimpleLightbox('.gallery a');

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
  galleryRef.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function loadMoreUpdateGallery(markup) {
  galleryRef.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function clearGallery() {
  galleryRef.innerHTML = '';
}

export { createMarkup, updateGallery, loadMoreUpdateGallery, clearGallery };
