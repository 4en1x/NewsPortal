const articlesService = (function () {
  const xhr = new XMLHttpRequest();
  let articles;
  let images;
  let tags;
  const getArticlesFromDB = () => {
    xhr.open('GET', './articles', false);
    xhr.send();
    if (xhr.status !== 200) {
      alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
    } else {
      articles = (JSON.parse(xhr.responseText, (key, value) => {
        if (key === 'createdAt') return new Date(value);
        return value;
      }));
    }
  };
  const getTagsFromDB = () => {
    xhr.open('GET', './tags', false);
    xhr.send();
    if (xhr.status !== 200) {
      alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
    } else {
      tags = (JSON.parse(xhr.responseText));
    }
  };
  const getImagesFromDB = () => {
    xhr.open('GET', './images', false);
    xhr.send();
    if (xhr.status !== 200) {
      alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
    } else {
      images = (JSON.parse(xhr.responseText));
    }
  };
  getArticlesFromDB();
  getTagsFromDB();
  getImagesFromDB();

  const getArticles = (skip = 0, top = 10, filterConfig = {}) => {
    const author = filterConfig.author || '';
    const beginDate = filterConfig.beginDate || new Date(-8640000000000000);
    const endDate = filterConfig.endDate || new Date(8640000000000000);
    const filterTags = filterConfig.tags;
    let clone = articles;
    clone = clone.filter(param => param.author.indexOf(author) > -1);
    clone = clone.filter(param => param.createdAt >= beginDate && param.createdAt <= endDate);
    if (filterTags) {
      clone = clone.filter((param) => {
        for (let i = 0; i < filterTags.length; i += 1) {
          if (param.tags.indexOf(filterTags[i]) === -1) return false;
        }
        return true;
      });
    }
    return clone.sort((a, b) => b.createdAt - a.createdAt).slice(skip, skip + top);
  };
  const getArticle = id => articles.find(param => param.id === id);
  const inTags = tag => tags.find(param => param === tag);
  const getImage = id => images.find(param => param.id === id);
  const addNewImage = (id, url) => images.push({ id, url });
  const validateArticle = (article, withoutID) => {
    if (typeof article.title !== 'string' || article.title.length <= 0 || article.title.length > 100) return false;
    if (typeof article.summary !== 'string' || article.summary.length <= 0 || article.summary.length > 200) return false;
    if (withoutID === undefined && (typeof article.id !== 'string' || article.id.length <= 0 || getArticle(article.id) !== undefined)) return false;
    if ((article.createdAt instanceof Date) === false) return false;
    if (typeof article.author !== 'string' || article.author.length <= 0) return false;
    if (typeof article.content !== 'string' || article.content.length <= 0) return false;
    if (article.tags.length <= 0) return false;
    for (let i = 0; i < article.tags.length; i += 1) {
      if (tags.indexOf(article.tags[i]) === -1) return false;
    }
    return true;
  };
  const addArticle = (article) => {
    if (validateArticle(article)) { articles.push(article); return true; }
    return false;
  };
  const removeArticle = (id) => {
    const x = articles.findIndex(param => param.id === id);
    if (x === undefined) return false;
    articles.splice(x, 1);
    return true;
  };
  const editArticle = (id, config) => {
    const clone = getArticle(id);
    if (!clone) return false;
    const article = Object.assign({}, clone);
    if (config.title) article.title = config.title;
    if (config.summary) article.summary = config.summary;
    if (config.content) article.content = config.content;
    if (config.tags) article.tags = config.tags;
    if (validateArticle(article, '')) {
      removeArticle(id);
      addArticle(article);
      return true;
    }
    return false;
  };
  const addTag = (tag) => {
    if (inTags(tag) === undefined) { tags.push(tag); return true; }
    return false;
  };
  const deleteTag = (tag) => {
    const x = inTags(tag);
    if (inTags(tag) !== undefined) { tags.splice(x, 1); return true; }
    return false;
  };
  const getTags = () => tags;
  const toLocaleStorage = () => {
    xhr.open('POST', '/articles', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.send(JSON.stringify(articles));
    xhr.open('POST', '/tags', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.send(JSON.stringify(tags));
    xhr.open('POST', '/images', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.send(JSON.stringify(images));
  };
  return {
    getArticles,
    getArticle,
    validateArticle,
    addArticle,
    editArticle,
    inTags,
    addTag,
    deleteTag,
    removeArticle,
    getImage,
    addNewImage,
    getTags,
    toLocaleStorage,
  };
}());
