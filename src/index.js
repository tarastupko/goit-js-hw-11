
import './css/style.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import createMarkup from './js/list-photos-markup';
import smoothScroll from './js/smooth-scroll'
import getFetch from './js/api-service'

// variables

const axios = require('axios').default;


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



async function getImages(page, perPage) {

  if (inputSer.value.trim() === '') {
    return Notiflix.Notify.failure(`Request cannot be empty`);
}

  try {
    const searchResponse = inputSer.value.trim()
    const response = await getFetch(page, perPage,searchResponse);
    
        if (response.data.hits.length === 0) {
          Notiflix.Notify.failure(`Oooops! No images found for query <i>'${inputSer.value}</i>'`);
          list.innerHTML = `<p>Oooops! No images found for query <i>'${inputSer.value}</i>'. Try again!</p>`
          return
        }
        
        Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images`);
        
        console.log(response.data);
        
    list.innerHTML = createMarkup(response.data.hits)
    console.log(response.data.totalHits);
    if (response.data.totalHits > perPage)
    {
      observer.observe(target);
  }
      
        
        
            
        gallerySlider = new SimpleLightbox('.gallery a',
          { captionsData: 'alt', captionDelay: 950, navText: ['❮', '❯'] });

      } catch(erorr) {
            console.error(erorr)
        }
}
let currentPageOnLoad = 2;
function onLoad(entries, observer) {
  
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log(entries);
      const searchResponse = inputSer.value.trim()
      getFetch(currentPageOnLoad, perPage,searchResponse)
          .then(response => {
          console.log();
              list.insertAdjacentHTML('beforeend', createMarkup(response.data.hits))
            gallerySlider.refresh()
              if (currentPageOnLoad * perPage >= response.data.totalHits) {
              setTimeout(() => {
                Notiflix.Notify.info(`We're sorry, but you've reached the end of search results`);
              }, 2000);
                observer.unobserve(target)
                return
              }
              else
              {
                currentPageOnLoad += 1
            observer.observe(target); 
                }
             

          
            
            smoothScroll()
            
          })
  .catch(err => console.log(err));
  }
  })
  }
