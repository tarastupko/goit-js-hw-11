import './css/style.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import createMarkup from './js/list-photos-markup';
import smoothScroll from './js/smooth-scroll'
import getFetch from './js/api-service';
const axios = require('axios').default;

const forma = document.querySelector('.search-form');
const list = document.querySelector('.search-list-js');
const inputSer = document.querySelector('input[name="searchQuery"]');
const target = document.querySelector('.js-guard');

let perPage = 40;
let gallerySlider;

let options = {
  root: null,
  rootMargin: '200px',
  threshold: 1.0
};

let observer = null;
let currentPage = 1;
let currentPageOnLoad = 1;

forma.addEventListener('submit', onClickSubmit);

async function onClickSubmit(event) {
  event.preventDefault();
  currentPage = 1;
  currentPageOnLoad = 1;
  observer = null;
  await clearList(); // Очистка списку перед новим пошуком
  await getImages(1, perPage);
  console.log(currentPage);
  console.log(currentPageOnLoad);
}

async function clearList() {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
}

async function getImages(page, perPage) {
  if (inputSer.value.trim() === '') {
    return Notiflix.Notify.failure(`Request cannot be empty`);
  }

  currentPage = page;
  currentPageOnLoad = page;

  try {
    console.log(currentPageOnLoad);
    console.log(perPage);
    const response = await getFetch(currentPageOnLoad, perPage, inputSer.value.trim());

    if (response.data.hits.length === 0) {
      Notiflix.Notify.failure(`Oooops! No images found for query <i>'${inputSer.value}</i>'`);
      list.innerHTML = `<p>Oooops! No images found for query <i>'${inputSer.value}</i>'. Try again!</p>`;
      return;
    }

    Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images`);

    list.innerHTML = createMarkup(response.data.hits);
    console.log(perPage);
    if (response.data.totalHits > perPage) {
      observer = new IntersectionObserver(onLoad, options);
      observer.observe(target);
    }

    gallerySlider = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 950,
      navText: ['❮', '❯']
    });

    currentPageOnLoad = page;
    console.log(currentPageOnLoad);
    console.log(page);

  } catch (error) {
    console.error(error);
  }
}

async function onLoad(entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      currentPageOnLoad += 1;
      console.log('tt', currentPageOnLoad);
      console.log(perPage);
      try {
        const response = await getFetch(currentPageOnLoad, perPage, inputSer.value.trim());
        list.insertAdjacentHTML('beforeend', createMarkup(response.data.hits));
        gallerySlider.refresh();
        if (currentPageOnLoad * perPage >= response.data.totalHits && currentPage !== 2) {
          setTimeout(() => {
            Notiflix.Notify.info(`We're sorry, but you've reached the end of search results`);
          }, 2000);
          observer.unobserve(target);
          return;
        }
        observer.observe(target);
        smoothScroll();
      } catch (error) {
        console.log(error);
      }
    }
  });
}

