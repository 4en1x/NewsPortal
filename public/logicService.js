(function () {
  let currentCount = 0;
  const GLOBAL_STEP = 2;
  let globalUserName;
  let filterConfig = { tags: [] };
  let tagsToAddOrEdit = [];
  const actions = {
    addNews: (event) => {
      addNews();
    },
    removeNews: (event) => {
      clickToRemoveArticle(heyTarget(event));
    },
    removeNewsInOnePage: (event) => {
      clickToRemoveArticle(heyTarget(event));
      document.location.href = '/';
    },
    loadMore: (event) => {
      init(heyTarget(event));
    },
    mainPage: (event) => {
      document.location.href = '/';
    },
    showNews: (event) => {
      showOneNews(heyTarget(event));
    },
    showEditNews: (event) => {
      showWindowEditNews(heyTarget(event));
    },
    deleteTag: (event) => {
      tagsToAddOrEditClick(heyTarget(event));
    },
    editNews: (event) => {
      editNews(heyTarget(event));
    },
    logout: (event) => {
      globalUserName = logoutClick(globalUserName);
    },
    login: (event) => {
      globalUserName = loginSubmitClick(globalUserName);
    },
    searchTag: (event) => {
      searchTag(heyTarget(event));
    },
    filter: (event) => {
      filter(heyTarget(event));
    },
    clearFilter: (event) => {
      clearFilter(heyTarget(event));
    },
  };
  const actionsOnEnter = {
    addTagInEdit: (event) => {
      checkToEnter(event, 'edit');
    },
    addTagInAdd: (event) => {
      checkToEnter(event, 'add');
    },
  };


  const documentReady = () => {
    globalUserName = checkLogin(globalUserName);
    init();
    document.body.addEventListener('click', (event) => {
      const actionKey = heyTarget(event).getAttribute('data-action');
      const action = actions[actionKey];
      if (action) action(event);
    });
    document.body.addEventListener('keydown', (event) => {
      const actionKey = heyTarget(event).getAttribute('data-action');
      const action = actionsOnEnter[actionKey];
      if (action) action(event);
    });
    heyClass(document, 'search-tag').addEventListener('change', e => eventsOnChange(e));
  };
  document.addEventListener('DOMContentLoaded', documentReady);


  function searchTag(tag) {
    filterConfig = { tags: [tag.innerHTML] };
    currentCount = 0;
    cleanPage();
    init();
  }
  const eventsOnChange = (e) => {
    filterConfig.tags = [].slice.call(e.target.selectedOptions).map(a => a.value);
  };
  function tagsMenu() {
    const tagsOptions = document.getElementsByClassName('search-tag')[0];
    const customTags = articlesService.getTags();
    tagsOptions.innerHTML = '';
    for (const key in customTags) {
     if (key!=='_id') tagsOptions.innerHTML += `<option>${key}</option>`;
    }
    tagsOptions.size = customTags.length;
  }
  function init() {
    setUserName(globalUserName);
    const news = heyId('single-news-template');
    const mas = articlesService.findArticles(currentCount, GLOBAL_STEP, filterConfig);
    mas.forEach((item) => {
      let singleNews = news.content.cloneNode(true);
      singleNews = articlesModels.constructNews(singleNews, item, globalUserName);
      heyId('data-content').appendChild(singleNews);
    });
    currentCount += mas.length;
    optionForMainPage(globalUserName, currentCount);
    tagsMenu();
  }
  const removeArticle = (article) => {
    const id = article.getAttribute('data-id');
    if (articlesService.removeArticle(id)) {
      article.style.display = 'none';
      currentCount -= 1;
      articlesService.toLocaleStorage();
    }
  };
  const clickToRemoveArticle = (crossButton) => {
    if (confirm('Вы точно хотите удалить эту новость?')) {
      removeArticle(crossButton.parentNode.parentNode);
    }
  };
  const addArticle = (myContent, url) => {
    if (articlesService.createArticle(myContent) &&
            articlesService.addNewImage(myContent.id, url)) {
      alert('Успешно');
      articlesService.toLocaleStorage();
      document.location.href = '/';
    } else {
      alert('Что-то заполнено не так');
    }
  };
  const addNews = () => {
    const myContent = {};
    myContent.title = heyId('add-title-textarea').value;
    myContent.summary = heyId('add-summary-textarea').value;
    myContent.content = heyId('add-content-textarea').value;
    const url = heyId('add-url-textarea').value;
    myContent.id = String(Math.floor(Math.random() * 1000));
    myContent.createdAt = new Date();
    myContent.author = globalUserName;
    myContent.tags = tagsToAddOrEdit;
    addArticle(myContent, url);
  };
  const checkToEnter = (event, type) => {
    if (event.keyCode === 13) addOneMoreTagToList(event.target, type, tagsToAddOrEdit);
  };
  const showOneNews = (customNode) => {
    const id = customNode.parentNode.dataset.id;
    cleanPage();
    let oneNews = heyId('one-news-template').content.cloneNode(true);
    const article = Object.assign(articlesService.readArticle(id));
    oneNews = articlesModels.constructOneNews(oneNews, article, id);
    heyId('load-more').innerHTML = '';
    heyId('data-content').insertBefore(oneNews, heyId('data-content').firstElementChild);
    toggle({ 'link-main-page': true, myButton: false, 'link-add-news': false });
  };
  const editArticle = (id, myContent, url) => {
    if (articlesService.editArticle(myContent) && url.length >= 0) {
      articlesService.changeImage(id, url);
      alert('Успешно');
      articlesService.toLocaleStorage();
      document.location.href = '/';
    } else alert('Что-то заполнено не так ');
  };
  const editNews = (button) => {
    const id = button.dataset.id;
    const myContent = {};
    myContent.title = heyId('change-title-textarea').value;
    myContent.summary = heyId('change-summary-textarea').value;
    myContent.content = heyId('change-content-textarea').value;
    myContent.tags = tagsToAddOrEdit;
    myContent.createdAt = new Date();
    myContent.author = 'kostya';
    myContent.id = id;
    const url = heyId('change-url-textarea').value;
    editArticle(id, myContent, url);
  };
  const showWindowEditNews = (articleToEdit) => {
    tagsToAddOrEdit = [];
    const id = articleToEdit.parentNode.parentNode.dataset.id;
    const article = Object.assign(articlesService.readArticle(id));
    const image = articlesService.getImage(id);
    heyId('change-title-textarea').innerHTML = article.title;
    heyId('change-summary-textarea').innerHTML = article.summary;
    heyId('change-content-textarea').innerHTML = article.content;
    heyId('change-url-textarea').innerHTML = image;
    heyId('edit-news-button').dataset.id = id;
    for (let i = 0; i < article.tags.length; i += 1) {
      const myP = document.createElement('p');
      tagsToAddOrEdit.push(article.tags[i]);
      myP.className = 'tags-to-add-or-edit';
      myP.innerHTML = `# ${article.tags[i]}`;
      myP.oncontextmenu = () => false;
      myP.dataset.action = 'deleteTag';
      heyId('edit-single-news').insertBefore(myP, heyId('edit-news-button'));
    }
  };
  const tagsToAddOrEditClick = (event) => {
    event.style.display = 'none';
    tagsToAddOrEdit.forEach((param, index) => {
      if (param === event.innerHTML.substring(2)) tagsToAddOrEdit.splice(index, 1);
    });
  };
  const filter = () => {
    filterConfig.author = heyId('author-search').firstElementChild.value;
    filterConfig.beginDate = new Date(heyId('date-search').firstElementChild.value);
    filterConfig.endDate = new Date(heyId('date-search').lastElementChild.value);
    if (isNaN(filterConfig.beginDate)) filterConfig.beginDate = undefined;
    if (isNaN(filterConfig.endDate)) filterConfig.endDate = undefined;
    currentCount = 0;
    cleanPage();
    init();
  };
  const clearFilter = () => {
    const InputSearchElements = heyTag(heyClass(document, 'search-panel'), 'input');
    [].forEach.call(InputSearchElements, elem => elem.value = '');
    filterConfig = { tags: [] };
  };
}());
