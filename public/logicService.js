const logicService = (function () {
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
      logoutClick();
    },
    login: (event) => {
      loginSubmitClick();
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
    checkLogin(globalUserName);
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
    httpGet('/getTags')
          .then(
              (response) => {
                const customTags = JSON.parse(response);
                const tagsOptions = document.getElementsByClassName('search-tag')[0];
                tagsOptions.innerHTML = '';
                for (const key in customTags) {
                  if (key !== '_id') tagsOptions.innerHTML += `<option>${key}</option>`;
                }
                tagsOptions.size = customTags.length;
              }
          );
  }
  function init() {
    articlesService.findArticles(currentCount, GLOBAL_STEP, filterConfig);
    tagsMenu();
  }
  const removeArticle = (article) => {
    const id = article.getAttribute('data-id');
    if (articlesService.removeArticle(id)) {
      article.style.display = 'none';
      currentCount -= 1;
    }
  };
  const clickToRemoveArticle = (crossButton) => {
    if (confirm('Вы точно хотите удалить эту новость?')) {
      removeArticle(crossButton.parentNode.parentNode);
    }
  };
  const addArticle = (myContent, url) => {
    articlesService.createArticle(myContent, url);
  };
  const addNews = () => {
    const myContent = {};
    myContent.title = heyId('add-title-textarea').value;
    myContent.summary = heyId('add-summary-textarea').value;
    myContent.content = heyId('add-content-textarea').value;
    const url = heyId('add-url-textarea').value;
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
    httpPost('/article', { id })
        .then(
            (response) => {
              cleanPage();
              let oneNews = heyId('one-news-template').content.cloneNode(true);
              const article = JSON.parse(response, (key, value) => {
                if (key === 'createdAt') return new Date(value);
                return value;
              });
              oneNews = articlesModels.constructOneNews(oneNews, article, id);
              heyId('load-more').innerHTML = '';
              heyId('data-content').insertBefore(oneNews, heyId('data-content').firstElementChild);
              toggle({ 'link-main-page': true, myButton: false, 'link-add-news': false });
            },
            error => alert(`Rejected: ${error}`)
        );
  };
  const editArticle = (id, myContent, url) => {
    articlesService.editArticle(myContent, url);
  };
  const editNews = (button) => {
    const id = button.dataset.id;
    const myContent = {};
    myContent.title = heyId('change-title-textarea').value;
    myContent.summary = heyId('change-summary-textarea').value;
    myContent.content = heyId('change-content-textarea').value;
    myContent.tags = tagsToAddOrEdit;
    myContent.createdAt = new Date();
    myContent.author = globalUserName;
    myContent.id = id;
    const url = heyId('change-url-textarea').value;
    editArticle(id, myContent, url);
  };
  const showWindowEditNews = (articleToEdit) => {
    tagsToAddOrEdit = [];
    const id = articleToEdit.parentNode.parentNode.dataset.id;
    httpPost('/article', { id })
        .then(
            (response) => {
              const article = JSON.parse(response, (key, value) => {
                if (key === 'createdAt') return new Date(value);
                return value;
              });
              heyId('change-title-textarea').innerHTML = article.title;
              heyId('change-summary-textarea').innerHTML = article.summary;
              heyId('change-content-textarea').innerHTML = article.content;
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
            },
            error => alert(`Rejected: ${error}`)
        );
    httpPost('/image', { id })
        .then(
            (response) => {
              heyId('change-url-textarea').innerHTML = response;
              console.log(response);
            }
        );
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
    heyId('author-search').firstElementChild.value='';
    heyId('date-search').firstElementChild.value='';
    heyId('date-search').lastElementChild.value='';
    const InputSearchElements = heyTag(heyClass(document, 'search-panel'), 'input');
    [].forEach.call(InputSearchElements, elem => elem.value = '');
    filterConfig = { tags: [] };
  };
  return {
    init,
  };
}());
