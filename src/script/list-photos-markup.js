export default function createMarkup(arr) {
    return arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => 
 `  <li class="serch-item photo-card">
      <a class="gallery__link" href=${largeImageURL}>
      <img src="${webformatURL}" alt="${tags}" class="serch-image">
      </a>
     <div class="info">
    <p  class="info-item">
       <b>Likes</b> ${likes}
    </p>
    <p  class="info-item">
    <b>Views</b> ${views}
    </p>
    <p  class="info-item">
    <b>Comments</b> ${comments}
    </p>
    <p  class="info-item">
     <b>Downloads</b> ${downloads}
    </p>
    </div>
  </li>`
    ).join('')
}