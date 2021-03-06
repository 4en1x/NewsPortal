const articlesService = (function () {
  const MIN_DATE = new Date(-8640000000000000);
  const MAX_DATE = new Date(8640000000000000);
  function findArticles(skip = 0, top = 0, properties = {}) {
    const beginDate = properties.beginDate || MIN_DATE;
    const endDate = properties.endDate || MAX_DATE;
    const config = {};
    if (properties.author) { config.author = properties.author; }
    if (properties.tags.length > 0) { config.tags = { $all: properties.tags }; }
    config.createdAt = {
      $gte: beginDate,
      $lte: endDate,
    };
    const body = {
      config,
      skip,
      top,
    };
    http('POST', '/articles', body)
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
    http('DELETE', '/article', { id })
        .then(
            (response) => {},
            error => alert(`Rejected: ${error}`)
        );
    return true;
  }
  function createArticle(article, url) {
    if (validateArticle(article)) {
      http('POST', '/createArticle', { article, url })
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
  function editArticle(article) {
    if (validateArticle(article)) {
      const body = {
        article,
      };
      http('PUT', '/article', body)
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
