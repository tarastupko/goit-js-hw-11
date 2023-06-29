import './css/style.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import createMarkup from './script/list-photos-markup';
import smoothScroll from './script/smooth-scroll'

// variables

const axios = require('axios').default;

const API_KEY = `37981342-0f90df91f416340ea3cce758a`;
const BASE_URL = `https://pixabay.com/api/`

const forma = document.querySelector('.search-form');
const list = document.querySelector('.search-list-js')
const inputSer = document.querySelector('input[name="searchQuery"]')
const target = document.querySelector('.js-guard');

let perPage = 40
let gallerySlider;

let options = {
  root: null,
  rootMargin: '200px',
  threshold: 1.0
};

let observer = new IntersectionObserver(onLoad, options);
let currentPage = 1



forma.addEventListener('submit', onClickSubmit);


function onClickSubmit(event) {

  event.preventDefault();
  currentPage = 1
  getImages(1, 40)
}

async function getFetch(page, perPage) {    
  try {
    const params = new URLSearchParams({
      image_types: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: perPage,
      page,
    })
    const searchResponse = inputSer.value.trim()
    const response = axios.get(`${BASE_URL}?key=${API_KEY}&q=${searchResponse}&${params}`)
    return response
  } catch (error) {
    console.error(error);
  }
  }

async function getImages(page, perPage) {

  if (inputSer.value.trim() === '') {
    return Notiflix.Notify.failure(`Request cannot be empty`);
}

  try {
    const response = await getFetch(page, perPage);
    
        if (response.data.hits.length === 0) {
          Notiflix.Notify.failure(`Oooops! No images found for query <i>'${inputSer.value}</i>'`);
          list.innerHTML = `<p>Oooops! No images found for query <i>'${inputSer.value}</i>'. Try again!</p>`
          return
        }
        
        Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images`);
        
        console.log(response.data);
        
        list.innerHTML = createMarkup(response.data.hits)
        
        observer.observe(target);
            
        gallerySlider = new SimpleLightbox('.gallery a',
          { captionsData: 'alt', captionDelay: 950, navText: ['❮', '❯'] });

      } catch(erorr) {
            console.error(erorr)
        }
}

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log(entries);
      currentPage += 1
      getFetch(currentPage, perPage)
          .then(response => {
          console.log();
              list.insertAdjacentHTML('beforeend', createMarkup(response.data.hits))
            gallerySlider.refresh()
              if (currentPage * perPage >= response.data.totalHits && currentPage !== 2) {
              setTimeout(() => {
                Notiflix.Notify.info(`We're sorry, but you've reached the end of search results`);
              }, 2000);
                observer.unobserve(target)
                return
            }
            
            observer.observe(target);
            
            smoothScroll()
            
          })
  .catch(err => console.log(err));
  }
  })
  }