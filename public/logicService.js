(function () {
  let currentCount = 0;
  const GLOBAL_STEP = 5;
  const xhr = new XMLHttpRequest();
  let globalUserName;
  let filterConfig = { tags: [] };
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timezone: 'UTC',
  };
  let tagsToAddOrEdit = [];
  const conditionsInDataContent = {
    'cross': e => clickToRemoveArticle(e),
    'tick': e => showWindowEditNews(e),
    'crossInOnePage': e => removeArticleInOnePage(e),
    'tickInOnePage': e => editArticleInOnePage(e),
    'show-one-news': e => showOneNews(e),
    'load-more-button': e => init(e),
    'step-forward-button': e => stepForwardClick(e),
    'tags-to-add-or-edit': e => tagsToAddOrEditClick(e),
    'myButton': e => filter(e),
    'clear-filter': e => clearFilter(e),
    'link-add-news': e => showWindowAddNews(e),
    'link-logout': e => logoutClick(e),
    'login-submit': e => loginSubmitClick(e),
  };
  const constInThePage = ['MY_BUTTON', 'LINK_MAIN_PAGE', 'LINK_ADD_NEWS', 'NEWS_LIST', 'LINK_LOGOUT', 'LINK_LOGIN', 'USERNAME'];
  let NEWS_LIST;
  let LOAD_MORE;

    /* События*/
  const documentReady = () => {
    articlesService.toLocaleStorage();
    xhr.open('GET', './user', false);
    xhr.send();
    if (xhr.status === 200) globalUserName = xhr.responseText;
    constInThePage.MY_BUTTON = document.getElementById('myButton');
    constInThePage.LINK_MAIN_PAGE = document.getElementById('link-main-page');
    constInThePage.LINK_ADD_NEWS = document.getElementById('link-add-news');
    constInThePage.NEWS_LIST = document.getElementsByClassName('data-content')[0];
    constInThePage.LINK_LOGOUT = document.getElementById('link-logout');
    constInThePage.LINK_LOGIN = document.getElementById('link-login');
    constInThePage.USERNAME = document.getElementsByClassName('username')[0];
    NEWS_LIST = constInThePage.NEWS_LIST;
    LOAD_MORE = NEWS_LIST.lastElementChild;
    init();
    document.body.addEventListener('click', e => eventsInDataContent(e.target));
    document.body.addEventListener('contextmenu', e => eventsOnContextMenu(e));
    document.body.addEventListener('keydown', e => eventsOnEnter(e));
    document.getElementsByClassName('search-tag')[0].addEventListener('change', e => eventsOnChange(e));
  };
  document.addEventListener('DOMContentLoaded', documentReady);
  const eventsOnContextMenu = (e) => {
    if (e.target.className === 'tags-to-add-or-edit') {
      if (confirm('Добавить данный тег в список доступных?')) {
        articlesService.addTag(e.target.innerHTML.substring(2));
        articlesService.toLocaleStorage();
      }
    }
  };
  const eventsOnChange = (e) => {
    filterConfig.tags = [].slice.call(e.target.selectedOptions).map(a => a.value);
  };
  const eventsInDataContent = (target) => {
    try {
      conditionsInDataContent[target.className](target);
    } catch (e) {}
  };
  const eventsOnEnter = (event) => {
    if (event.target.className === 'tags-input') checkToEnter(event);
  };
  const stepForwardClick = () => {
    cleanPage();
    currentCount = 0;
    init();
  };
  const tagsToAddOrEditClick = (event) => {
    event.style.display = 'none';
    tagsToAddOrEdit.forEach((param, index) => {
      if (param === event.innerHTML.substring(2)) tagsToAddOrEdit.splice(index, 1);
    });
  };
  const logoutClick = () => {
    xhr.open('POST', '/logout', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send();
    globalUserName = null;
    location.reload();
  };
  const loginSubmitClick = () => {
    const body = {
      name: (document.getElementById('login-name').value),
      password: document.getElementById('login-password').value,
    };
    xhr.open('POST', '/login', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.send(JSON.stringify(body));
    xhr.open('GET', './user', false);
    xhr.send();
    if (xhr.status === 200) {
      globalUserName = xhr.responseText;
      location.reload();
    } else {
      alert(xhr.responseText);
    }
  };

    /* Загрузка новостей и фильтр*/
  const init = () => {
    const xOffset = window.pageXOffset;
    const yOffset = window.pageYOffset;
    const news = document.getElementById('single-news-template');
    const mas = articlesService.getArticles(currentCount, GLOBAL_STEP, filterConfig);
    for (let i = 0; i < mas.length; i += 1) {
      const singleNews = news.content.cloneNode(true);
      singleNews.firstElementChild.id = mas[i].id;
      const singleNewsImage = singleNews.firstElementChild.getElementsByClassName('image-header')[0].firstElementChild;
      singleNewsImage.src = articlesService.getImage(mas[i].id).url;
      singleNews.firstElementChild.getElementsByTagName('h1')[0].innerHTML = mas[i].title;
      singleNews.firstElementChild.getElementsByTagName('p')[0].innerHTML = mas[i].summary;
      singleNews.firstElementChild.getElementsByClassName('author')[0].innerHTML = mas[i].author;
      const singleNewsDate = singleNews.firstElementChild.getElementsByClassName('post-date')[0];
      mas[i].tags.forEach((tag) => {
        singleNewsDate.insertAdjacentHTML('beforebegin', `<span class='hashteg'>${tag} </span>`);
      });
      singleNewsDate.innerHTML = mas[i].createdAt.toLocaleString('ru', options);
      if (!globalUserName) {
        singleNews.firstElementChild.getElementsByClassName('redact-buttons')[0].style.display = 'none';
      }
      NEWS_LIST.insertBefore(singleNews, LOAD_MORE);
    }
    currentCount += mas.length;
    window.scrollTo(xOffset, yOffset);
    optionsForMainPage();
  };
  const optionsForMainPage = () => {
    constInThePage.LINK_MAIN_PAGE.addEventListener('click', () => stepForwardClick());
    const tagsOptions = document.getElementsByClassName('search-tag')[0];
    const customTags = articlesService.getTags();
    tagsOptions.innerHTML = '';
    customTags.forEach(elem => tagsOptions.innerHTML += `<option>${elem}</option>`);
    tagsOptions.size = customTags.length;
    toggle({ MY_BUTTON: true, LINK_MAIN_PAGE: false });
    if (!globalUserName) {
      toggle({ LINK_LOGIN: true, LINK_LOGOUT: false, LINK_ADD_NEWS: false });
    } else {
      toggle({ LINK_LOGIN: false, LINK_LOGOUT: true, LINK_ADD_NEWS: true });
    }
    setUserName();
    if (currentCount === articlesService.getArticles(0, 8640000000000000, filterConfig).length) {
      LOAD_MORE.innerHTML = '';
    } else {
      LOAD_MORE.innerHTML = "<a class='load-more-button'>Load more</a>";
    }
  };
  const filter = () => {
    filterConfig.author = document.getElementById('author-search').firstElementChild.value;
    filterConfig.beginDate = new Date(document.getElementById('date-search').firstElementChild.value);
    filterConfig.endDate = new Date(document.getElementById('date-search').lastElementChild.value);
    if (isNaN(filterConfig.beginDate)) filterConfig.beginDate = undefined;
    if (isNaN(filterConfig.endDate)) filterConfig.endDate = undefined;
    stepForwardClick();
  };
  const clearFilter = () => {
    const InputSearchElements = document.getElementsByClassName('search-panel')[0].getElementsByTagName('input');
    [].forEach.call(InputSearchElements, elem => elem.value = '');
    filterConfig = { tags: [] };
  };

    /* Добавление новостей*/
  const optionsForAddNewsPage = () => {
    toggle({ LINK_MAIN_PAGE: true, MY_BUTTON: false, LINK_ADD_NEWS: false });
    document.getElementsByClassName('add-news-button')[0].addEventListener('click', () => addNews());
  };
  const showWindowAddNews = () => {
    tagsToAddOrEdit = [];
    const elem = document.getElementById('add-news-template').content.cloneNode(true);
    cleanPage();
    LOAD_MORE.innerHTML = '';
    NEWS_LIST.insertBefore(elem, NEWS_LIST.firstElementChild);
    optionsForAddNewsPage();
  };
  const addOneMoreTagToList = (newTag) => {
    tagsToAddOrEdit.push(newTag.value);
    const myP = document.createElement('p');
    myP.className = 'tags-to-add-or-edit';
    myP.innerHTML = `# ${newTag.value}`;
    myP.oncontextmenu = () => false;
    document.getElementsByClassName('single-news')[0].insertBefore(myP, newTag.parentNode.nextElementSibling);
    newTag.value = '';
  };
  const addArticle = (myContent, url) => {
    if (!globalUserName) return;
    if (articlesService.addArticle(myContent) && articlesService.addNewImage(myContent.id, url)) {
      alert('Успешно');
      articlesService.toLocaleStorage();
      location.reload();
    } else alert('Что-то заполнено не так');
  };
  const addNews = () => {
    const myContent = {};
    myContent.title = document.getElementById('add-title-textarea').value;
    myContent.summary = document.getElementById('add-summary-textarea').value;
    myContent.content = document.getElementById('add-content-textarea').value;
    const url = document.getElementById('add-url-textarea').value;
    myContent.id = String(Math.floor(Math.random() * 1000));
    myContent.createdAt = new Date();
    myContent.author = globalUserName;
    myContent.tags = tagsToAddOrEdit;
    addArticle(myContent, url);
  };

    /* Удаление новостей*/
  const removeArticle = (id) => {
    if (!globalUserName) return;
    if (articlesService.removeArticle(id)) {
      document.getElementById(id).style.display = 'none';
      currentCount -= 1;
      articlesService.toLocaleStorage();
    }
  };
  const clickToRemoveArticle = (crossButton) => {
    if (confirm('Вы точно хотите удалить эту новость?')) removeArticle(crossButton.parentNode.parentNode.id);
  };

    /* Показ новости на отдельной странице*/
  const showOneNews = (customNode) => {
    const id = customNode.parentNode.id;
    cleanPage();
    const oneNews = document.getElementById('one-news-template').content.cloneNode(true);
    const article = Object.assign(articlesService.getArticle(id));
    const author = oneNews.lastElementChild.getElementsByClassName('author')[0];
    const date = oneNews.lastElementChild.getElementsByClassName('post-date')[0];
    oneNews.lastElementChild.id = id;
    oneNews.firstElementChild.innerHTML = article.title;
    author.insertAdjacentHTML('beforebegin', `<div class='other-links'>${article.content}</div>`);
    author.innerHTML = article.author;
    article.tags.forEach(tag => date.insertAdjacentHTML('beforebegin', `<span class='hashteg'>${tag} </span>`));
    date.innerHTML = article.createdAt.toLocaleString('ru', options);
    LOAD_MORE.innerHTML = '';
    NEWS_LIST.insertBefore(oneNews, NEWS_LIST.firstElementChild);
    optionsForOneNews();
  };
  const optionsForOneNews = () => {
    toggle({ LINK_MAIN_PAGE: true, MY_BUTTON: false, LINK_ADD_NEWS: false });
    constInThePage.LINK_MAIN_PAGE.addEventListener('click', () => location.reload());
    if (!globalUserName) document.getElementsByClassName('redact-buttons')[0].style.display = 'none';
  };
  const removeArticleInOnePage = (crossButton) => {
    crossButton = crossButton.parentNode.parentNode;
    if (confirm('Вы точно хотите удалить эту новость?')) {
      articlesService.removeArticle(crossButton.id);
      articlesService.toLocaleStorage();
      crossButton.parentNode.removeChild(crossButton.parentNode.firstElementChild);
      crossButton.parentNode.removeChild(crossButton.parentNode.firstElementChild);
      currentCount = 0;
      init();
    }
  };
  const editArticleInOnePage = (tickButton) => {
    const e = tickButton.parentNode.parentNode.parentNode;
    e.removeChild(e.firstElementChild);
    e.removeChild(e.firstElementChild);
    showWindowEditNews(tickButton);
  };

    /* Редактирование*/
  const editArticle = (id, myContent, url) => {
    if (!globalUserName) return;
    if (articlesService.editArticle(id, myContent) && url.length >= 0) {
      articlesService.getImage(id).url = url;
      articlesService.getArticle(id).createdAt = new Date();
      alert('Успешно');
      stepForwardClick();
      articlesService.toLocaleStorage();
    } else alert('Что-то заполнено не так ');
  };
  const editNews = (id) => {
    const myContent = {};
    myContent.title = document.getElementById('change-title-textarea').value;
    myContent.summary = document.getElementById('change-summary-textarea').value;
    myContent.content = document.getElementById('change-content-textarea').value;
    myContent.tags = tagsToAddOrEdit;
    const url = document.getElementById('change-url-textarea').value;
    editArticle(id, myContent, url);
  };
  const showWindowEditNews = (articleToEdit) => {
    tagsToAddOrEdit = [];
    const id = articleToEdit.parentNode.parentNode.id;
    const article = Object.assign(articlesService.getArticle(id));
    const image = articlesService.getImage(id);
    const elem = document.getElementById('change-news-template').content.cloneNode(true);
    cleanPage();
    LOAD_MORE.innerHTML = '';
    elem.getElementById('change-title-textarea').innerHTML = article.title;
    elem.getElementById('change-summary-textarea').innerHTML = article.summary;
    elem.getElementById('change-content-textarea').innerHTML = article.content;
    elem.getElementById('change-url-textarea').innerHTML = image.url;
    for (let i = 0; i < article.tags.length; i += 1) {
      const myP = document.createElement('p');
      tagsToAddOrEdit.push(article.tags[i]);
      myP.className = 'tags-to-add-or-edit';
      myP.innerHTML = `# ${article.tags[i]}`;
      myP.oncontextmenu = () => false;
      elem.firstElementChild.insertBefore(myP, elem.firstElementChild.getElementsByClassName('add-news-button')[0]);
    }
    NEWS_LIST.insertBefore(elem, NEWS_LIST.firstElementChild);
    optionsForEditNewsPage(id);
  };
  const optionsForEditNewsPage = (id) => {
    toggle({ LINK_MAIN_PAGE: true, MY_BUTTON: false, LINK_ADD_NEWS: false });
    document.getElementsByClassName('add-news-button')[0].addEventListener('click', () => editNews(id));
  };

    /* Прочее */
  const cleanPage = () => {
    while (NEWS_LIST.firstElementChild.className === 'single-news') {
      NEWS_LIST.removeChild(NEWS_LIST.firstElementChild);
    }
  };
  const setUserName = () => {
    if (globalUserName) {
      constInThePage.USERNAME.innerHTML = `<p>Log as ${globalUserName}</p>`;
    } else {
      constInThePage.USERNAME.innerHTML = '';
    }
  };
  const checkToEnter = (event) => {
    if (event.keyCode === 13) addOneMoreTagToList(event.target);
  };
  const toggle = (obj) => {
    const map = new Map(Object.entries(obj));
    map.forEach((key, value) => {
      if (key) constInThePage[value].style.display = '';
      else constInThePage[value].style.display = 'none';
    });
  };
}());
