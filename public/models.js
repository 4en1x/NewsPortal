const articlesModels = (function () {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timezone: 'UTC',
  };
  function constructNews(singleNews, article) {
    const newsContent = singleNews.firstElementChild;
    newsContent.dataset.id = article.id;
    const singleNewsImage = heyClass(newsContent, 'image-header').firstElementChild;
    singleNewsImage.src = articlesService.getImage(article.id);
    heyTag(newsContent, 'h1').innerHTML = article.title;
    heyTag(newsContent, 'p').innerHTML = article.summary;
    heyClass(newsContent, 'author').innerHTML = article.author;
    const singleNewsDate = heyClass(newsContent, 'post-date');
    article.tags.forEach((tag) => {
      singleNewsDate.insertAdjacentHTML(
                'beforebegin', `<span class='hashteg' data-action="searchTag">${tag}</span>`
            );
    });
    if (!globalUserName) {
      heyClass(newsContent, 'redact-buttons').style.display = 'none';
    }
    singleNewsDate.innerHTML = article.createdAt.toLocaleString('ru', options);
    return singleNews;
  }
  function constructOneNews(oneNews, article, id) {
    const author = heyClass(oneNews.lastElementChild, 'author');
    const date = heyClass(oneNews.lastElementChild, 'post-date');
    oneNews.lastElementChild.dataset.id = id;
    oneNews.firstElementChild.innerHTML = article.title;
    author.insertAdjacentHTML('beforebegin', `<div class='other-links'>${article.content}</div>`);
    author.innerHTML = article.author;
    article.tags.forEach((tag) => {
      date.insertAdjacentHTML('beforebegin', `<span class='hashteg'>${tag}</span>`);
    });
    date.innerHTML = article.createdAt.toLocaleString('ru', options);
    return oneNews;
  }
  return {
    constructNews,
    constructOneNews,

  };
}());
