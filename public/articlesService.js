const articlesService = (function () {
  const MIN_DATE = new Date(-8640000000000000);
  const MAX_DATE = new Date(8640000000000000);
  function findArticles(skip = 0, top = 0, properties = {}) {
    const author = properties.author || '';
    const beginDate = properties.beginDate || MIN_DATE;
    const endDate = properties.endDate || MAX_DATE;
    const body = {
      author,
      beginDate,
      endDate,
      tags: properties.tags,
      skip,
      top,
    };
    httpPost('/articles', body)
          .then(
              (response) => {
                const news = heyId('single-news-template');
                const articles = JSON.parse(response, (key, value) => {
                  if (key === 'createdAt') return new Date(value);
                  return value;
                });
                articles.forEach((item) => {
                  let singleNews = news.content.cloneNode(true);
                  singleNews = articlesModels.constructNews(singleNews, item);
                  heyId('data-content').appendChild(singleNews);
                });
                currentCount += articles.length;
                optionForMainPage(currentCount);
              },
              error => alert(`Rejected: ${error}`)
          );
  }
  function removeArticle(id) {
    httpPost('/removeArticle', { _id: id })
        .then(
            (response) => {},
            error => alert(`Rejected: ${error}`)
        );
    return true;
  }
  function createArticle(article, url) {
    if (validateArticle(article)) {
      httpPost('/createArticle', { article, url })
            .then(
                (response) => {
                  alert('Успешно');
                  document.location.href = '/';
                },
                error => alert(`Rejected: ${error}`)
            );
      return;
    }
    alert('Что-то заполнено не так');
  }
  const validateArticle = (article) => {
    if (article.title.length <= 0 || article.title.length > 100) return false;
    if (article.summary.length <= 0 || article.summary.length > 200) return false;
    if ((article.createdAt instanceof Date) === false) return false;
    if (article.author.length <= 0) return false;
    if (article.content.length <= 0) return false;
    if (article.tags.length <= 0) return false;
    return true;
  };
  function editArticle(article, url) {
    if (validateArticle(article)) {
      const id = article.id;
      const body = {
        id: { _id: id },
        article,
        url,
      };
      httpPost('/updateArticle', body)
          .then(
              (response) => {
                  alert('Успешно');
                  document.location.href = '/';
              },
              error => alert(`Rejected: ${error}`)
          );
      return;
    }
    alert('Что-то заполнено не так ');
  }
  return {
    findArticles,
    removeArticle,
    createArticle,
    editArticle,
  };
}());
