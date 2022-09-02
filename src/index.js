import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import fetchImages from './js/fetch-image';
import imgCard from './template/card-img.hbs';
//Подключение
const imageSearchBox = document.querySelector('.search-form');
const outputImgList = document.querySelector('.gallery');
const guardLoadMore = document.querySelector('.js-guard');
let page = 1;
let inputValue;
const lightBox = new SimpleLightbox('.gallery a');
//
function searchImg(e) {
  e.preventDefault();

  // Пустой инпут
  if (e.currentTarget.elements.searchQuery.value === '') {
    Notiflix.Notify.info('Please enter more characters.');
    return;
  }
  // Повторный поиск по ключевому слову в инпуте
  if (inputValue === e.currentTarget.elements.searchQuery.value) {
    Notiflix.Notify.info(`It's already found! Please, enter another word.`);
    return;
  }
  // Обсерв(Загрузка следующих карточек),очистка разметки при новом запросе(по ключевому слову), скрол к верху, вызываем функцию создания карточек.
  observer.observe(guardLoadMore);
  outputImgList.innerHTML = '';
  page = 1;

  window.scrollBy({ top, behavior: 'smooth' });
  inputValue = e.currentTarget.searchQuery.value.trim();
  createListImg(inputValue, page);
}
//
async function createListImg(query, page) {
  try {
    const markupCardImg = await fetchImages(query, page);
    // Кол-во картинок по запросу
    if (page === 1) {
      Notiflix.Notify.info(
        `Hooray! We found ${markupCardImg.totalHits} images.`
      );
    }
    //вставка Html разметки
    outputImgList.insertAdjacentHTML(`beforeend`, imgCard(markupCardImg.hits));
    lightBox.refresh();
    // вызов Notiflix
    notification(markupCardImg, page);
  } catch {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}
// Загрузка по скролу
function updateList(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      createListImg(inputValue, page);
    }
  });
}
// ____________________________________________________________________________
//
const option = {
  root: null,
  rootMargin: '200px',
  threshold: 1,
};
//
const observer = new IntersectionObserver(updateList, option);
//
//
function notification(obImg) {
  if (obImg.total === 0) {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  if (Math.round(page === obImg.total % 40)) {
    return Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}
imageSearchBox.addEventListener('submit', searchImg);
//
