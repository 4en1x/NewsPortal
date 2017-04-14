const articlesService = (function () {
  let articles;
  let images;
  let tagsIndex;
  let orderIndex;
  let currentMaxSize;
  const MIN_DATE = new Date(-8640000000000000);
  const MAX_DATE = new Date(8640000000000000);
  httpGet('./articles')
         .then(
             (response) => {
               articles = (JSON.parse(response, (key, value) => {
                 if (key === 'createdAt') return new Date(value);
                 return value;
               }));
             },
             error => alert(`Rejected: ${error}`)
         );
  httpGet('./tags')
         .then(
            response => tagsIndex = (JSON.parse(response)),
            error => alert(`Rejected: ${error}`)
        );
  httpGet('./images')
         .then(
            response => images = (JSON.parse(response)),
            error => alert(`Rejected: ${error}`)
        );
  httpGet('./order')
         .then(
            // read https://github.com/arvindr21/diskDB/issues/32
            // пока нет нормальной базы данных, приходится делать так
            response => orderIndex = (JSON.parse(response)).reverse(),
            error => alert(`Rejected: ${error}`)
        );

  function findArticles(skip = 0, top = 0, properties = {}) {
    const author = properties.author || '';
    const beginDate = properties.beginDate || MIN_DATE;
    const endDate = properties.endDate || MAX_DATE;
    let ids = filterTags(properties.tags) || orderIndex;
    ids = ids.filter(id => articles[id].author.indexOf(author) > -1);
    ids = ids.filter(id => {
      return articles[id].createdAt >= beginDate && articles[id].createdAt <= endDate;
    });
    currentMaxSize = ids.length;
    return ids.map(id => articles[id])
            .slice(skip, skip + top);
  }
  function filterTags(tags) {
    if (!tags) return;
    let intersection = new Set(orderIndex);
    tags.forEach((tag) => {
      const commonArticles = new Set(tagsIndex[tag]);
      intersection = [...intersection].filter(x => commonArticles.has(x));
    });
    return [...intersection];
  }
  const getImage = id => images[id];
  function changeImage(id, url) {
    images[id] = url;
  }
  function removeArticle(id) {
    articles[id] = null;
    delete articles[id];
    removeArticleId(id, orderIndex);
    deleteFromTagIndex(id);
    return true;
  }
  function removeArticleId(id, articleIds) {
    const index = articleIds.indexOf(id);
    if (index !== -1) articleIds.splice(index, 1);
  }
  function createArticle(article) {
    if (validateArticle(article)) {
      const id = article.id;
      orderIndex.unshift(id);
      articles[id] = article;
      addToTagIndex(article, id);
      return true;
    }
    return false;
  }
  function addToTagIndex(article, id) {
    article.tags.forEach((tag) => {
      if (!tagsIndex[tag]) {
        tagsIndex[tag] = [id];
      } else if (tagsIndex[tag].indexOf(id) === -1) {
        tagsIndex[tag].unshift(id);
      }
    });
  }
  function deleteFromTagIndex(id) {
    for (const key in tagsIndex) {
      removeArticleId(id, tagsIndex[key]);
      if (tagsIndex[key].length === 0) { delete tagsIndex[key]; }
    }
  }
  function addNewImage(id, url) {
    images[id] = url;
    return true;
  }
  function readArticle(id) {
    if (!id) {
      throw new Error('please provide id');
    }
    return articles[id];
  }
  const validateArticle = (article, withoutID) => {
    if (article.title.length <= 0 || article.title.length > 100) return false;
    if (article.summary.length <= 0 || article.summary.length > 200) return false;
    if (!withoutID && (article.id.length <= 0 || readArticle(article.id))) return false;
    if ((article.createdAt instanceof Date) === false) return false;
    if (article.author.length <= 0) return false;
    if (article.content.length <= 0) return false;
    if (article.tags.length <= 0) return false;
    return true;
  };
  function editArticle(article) {
    if (validateArticle(article, 1)) {
      const id = article.id;
      removeArticleId(id, orderIndex);
      orderIndex.unshift(id);
      articles[id] = article;
      deleteFromTagIndex(id);
      addToTagIndex(article, id);
      return true;
    }
    return false;
  }
  const toLocaleStorage = () => {
    httpPost('/articles', articles)
            .then(error => alert(`Rejected: ${error}`));
    httpPost('/order', orderIndex)
            .then(error => alert(`Rejected: ${error}`));
    httpPost('/tags', tagsIndex)
            .then(error => alert(`Rejected: ${error}`));
    httpPost('/images', images)
            .then(error => alert(`Rejected: ${error}`));
  };
  const getSize = () => currentMaxSize;
  function getTags() {
    return tagsIndex;
  }
  return {
    findArticles,
    getImage,
    removeArticle,
    createArticle,
    addNewImage,
    readArticle,
    editArticle,
    toLocaleStorage,
    changeImage,
    getSize,
    getTags,

  };
}());
