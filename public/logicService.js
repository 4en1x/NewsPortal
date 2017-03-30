;!function () {
    "use strict";
    var currentCount = 0;
    var GLOBAL_STEP = 5;
    var xhr = new XMLHttpRequest();
    var globalUserName;
    var filterConfig = {tags: []};
    var options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timezone: 'UTC'
    };
    var tagsToAddOrEdit = [];
    var conditionsInDataContent = {
        'cross': e=>clickToRemoveArticle(e),
        'tick':  e=>showWindowEditNews(e),
        'crossInOnePage': e=>removeArticleInOnePage(e),
        'tickInOnePage': e=>editArticleInOnePage(e),
        'show-one-news':  e=>showOneNews(e),
        'load-more-button':  e=>init(e),
        'step-forward-button':  e=>stepForwardClick(e),
        'tags-to-add-or-edit':  e=>tagsToAddOrEditClick(e),
        'myButton':e=>filter(e),
        'clear-filter':e=>clearFilter(e),
        'link-add-news':e=>showWindowAddNews(e),
        'link-logout':e=>logoutClick(e),
        'login-submit':e=>loginSubmitClick(e),
    };
    var constInThePage=['MY_BUTTON','LINK_MAIN_PAGE','LINK_ADD_NEWS','NEWS_LIST','LINK_LOGOUT','LINK_LOGIN','USERNAME'];
    var NEWS_LIST,LOAD_MORE;

    /*События*/
    var documentReady = () => {
        articlesService.toLocaleStorage();
        xhr.open('GET', './user', false);
        xhr.send();
        if (xhr.status == 200) globalUserName = xhr.responseText;
        constInThePage['MY_BUTTON']=document.getElementById("myButton");
        constInThePage['LINK_MAIN_PAGE']=document.getElementById("link-main-page");
        constInThePage['LINK_ADD_NEWS']=document.getElementById("link-add-news");
        constInThePage['NEWS_LIST']=document.getElementsByClassName("data-content")[0];
        constInThePage['LINK_LOGOUT']=document.getElementById("link-logout");
        constInThePage['LINK_LOGIN']=document.getElementById("link-login");
        constInThePage['USERNAME']=document.getElementsByClassName("username")[0];
        NEWS_LIST=constInThePage['NEWS_LIST'];
        LOAD_MORE=NEWS_LIST.lastElementChild;
        init();
        document.body.addEventListener('click', (event) => eventsInDataContent(event));
        document.body.addEventListener('contextmenu', (event) => eventsOnContextMenu(event));
        document.body.addEventListener('keydown', (event) => eventsOnEnter(event));
        document.getElementsByClassName('search-tag')[0].addEventListener('change', (e) => filterConfig.tags = [].slice.call(e.target.selectedOptions).map(a => a.value));
    };
    document.addEventListener("DOMContentLoaded", documentReady);
    var eventsOnContextMenu = (event) => {
        if (event.target.className === 'tags-to-add-or-edit') {
            if (confirm("Добавить данный тег в список доступных?")) {
                articlesService.addTag(event.target.innerHTML.substring(2))
                articlesService.toLocaleStorage();
            }
        }
    };
    var eventsInDataContent = (event) => conditionsInDataContent[event.target.className](event.target);
    var eventsOnEnter = (event) => {
        if (event.target.className === 'tags-input') checkToEnter(event);
    };
    var stepForwardClick = () => {
        cleanPage();
        currentCount = 0;
        init();
    };
    var tagsToAddOrEditClick = (event) => {
        event.style.display = 'none';
        tagsToAddOrEdit.forEach((param, index) => {
            if (param === event.innerHTML.substring(2)) tagsToAddOrEdit.splice(index, 1);
        });
    };
    var logoutClick=()=>{
        xhr.open("POST", '/logout', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send();
        globalUserName = null;
        location.reload();
    };
    var loginSubmitClick=()=>{
        var body = {
            name: (document.getElementById("login-name").value),
            password: document.getElementById("login-password").value
        };
        xhr.open("POST", '/login', true)
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        xhr.send(JSON.stringify(body));
        xhr.open('GET', './user', false);
        xhr.send();
        if (xhr.status == 200) {
            globalUserName = xhr.responseText;
            location.reload();
        }
        else {
            alert(xhr.responseText);
        }
    };

    /*Загрузка новостей и фильтр*/
    var init = () => {
        var xOffset = window.pageXOffset;
        var yOffset = window.pageYOffset;
        var news = document.getElementById("single-news-template");
        var mas = articlesService.getArticles(currentCount, GLOBAL_STEP, filterConfig);
        for (var i = 0; i < mas.length; i++) {
            var singleNews = news.content.cloneNode(true);
            singleNews.firstElementChild.id = mas[i].id;
            singleNews.firstElementChild.getElementsByClassName("image-header")[0].firstElementChild.src = articlesService.getImage(mas[i].id).url;
            singleNews.firstElementChild.getElementsByTagName("h1")[0].innerHTML = mas[i].title;
            singleNews.firstElementChild.getElementsByTagName("p")[0].innerHTML = mas[i].summary;
            singleNews.firstElementChild.getElementsByClassName("author")[0].innerHTML = mas[i].author;
            mas[i].tags.forEach((tag) => singleNews.firstElementChild.getElementsByClassName("post-date")[0].insertAdjacentHTML("beforebegin", "<span class='hashteg'>" + tag + " </span>"));
            singleNews.firstElementChild.getElementsByClassName("post-date")[0].innerHTML = mas[i].createdAt.toLocaleString("ru", options);
            if (!globalUserName) singleNews.firstElementChild.getElementsByClassName("redact-buttons")[0].style.display = "none";
            NEWS_LIST.insertBefore(singleNews, LOAD_MORE);
        }
        currentCount += mas.length;
        window.scrollTo(xOffset, yOffset);
        optionsForMainPage();
    };
    var optionsForMainPage = () => {
        constInThePage['LINK_MAIN_PAGE'].addEventListener('click', () => stepForwardClick());
        var tagsOptions = document.getElementsByClassName("search-tag")[0];
        var _tags = articlesService.getTags();
        tagsOptions.innerHTML="";
        _tags.forEach((elem) => tagsOptions.innerHTML += "<option>" + elem + "</option>");
        tagsOptions.size = _tags.length;
        toggle({MY_BUTTON:true,LINK_MAIN_PAGE:false});
        if (!globalUserName)
            toggle({LINK_LOGIN:true,LINK_LOGOUT:false,LINK_ADD_NEWS:false});
        else
            toggle({LINK_LOGIN:false,LINK_LOGOUT:true,LINK_ADD_NEWS:true});
        setUserName();
        if (currentCount === articlesService.getArticles(0, 8640000000000000, filterConfig).length) LOAD_MORE.innerHTML = "";
        else LOAD_MORE.innerHTML = "<a class='load-more-button'>Load more</a>";
    };
    var filter = () => {
        filterConfig.author = document.getElementById("author-search").firstElementChild.value;
        filterConfig.beginDate = new Date(document.getElementById("date-search").firstElementChild.value);
        filterConfig.endDate = new Date(document.getElementById("date-search").lastElementChild.value);
        if (isNaN(filterConfig.beginDate)) filterConfig.beginDate = undefined;
        if (isNaN(filterConfig.endDate)) filterConfig.endDate = undefined;
        stepForwardClick();
    };
    var clearFilter = () => {
        var InputSearchElements = document.getElementsByClassName("search-panel")[0].getElementsByTagName("input");
        [].forEach.call(InputSearchElements, (elem) => elem.value = "");
        filterConfig = {tags: []};
    };

    /*Добавление новостей*/
    var optionsForAddNewsPage = () => {
        toggle({LINK_MAIN_PAGE:true,MY_BUTTON:false,LINK_ADD_NEWS:false});
        document.getElementsByClassName("add-news-button")[0].addEventListener('click', () => addNews());
    };
    var showWindowAddNews = () => {
        tagsToAddOrEdit = [];
        var elem = document.getElementById("add-news-template").content.cloneNode(true);
        cleanPage();
        LOAD_MORE.innerHTML = "";
        NEWS_LIST.insertBefore(elem, NEWS_LIST.firstElementChild);
        optionsForAddNewsPage();
    };
    var addOneMoreTagToList = (newTag) => {
        tagsToAddOrEdit.push(newTag.value);
        var myP = document.createElement("p");
        myP.className = "tags-to-add-or-edit";
        myP.innerHTML = "# " + newTag.value;
        myP.oncontextmenu = () => {return false;}
        document.getElementsByClassName("single-news")[0].insertBefore(myP, newTag.parentNode.nextElementSibling);
        newTag.value = "";
    };
    var addArticle = (myContent, url) => {
        if (!globalUserName)return;
        if (articlesService.addArticle(myContent) && articlesService.addNewImage(myContent.id, url)) {
            alert("Успешно");
            articlesService.toLocaleStorage();
            location.reload();
        }
        else alert("Что-то заполнено не так");
    };
    var addNews = () => {
        var myContent = {};
        myContent.title = document.getElementById("add-title-textarea").value;
        myContent.summary = document.getElementById("add-summary-textarea").value;
        myContent.content = document.getElementById("add-content-textarea").value;
        var url = document.getElementById("add-url-textarea").value;
        myContent.id = String(Math.floor(Math.random() * 1000));
        myContent.createdAt = new Date();
        myContent.author = globalUserName;
        myContent.tags = tagsToAddOrEdit;
        addArticle(myContent, url);
    };

    /*Удаление новостей*/
    var removeArticle = (id) => {
        if (!globalUserName)return;
        if (articlesService.removeArticle(id)) {
            document.getElementById(id).style.display = "none";
            currentCount--;
            articlesService.toLocaleStorage();
        }
    };
    var clickToRemoveArticle = (crossButton) => {
        if (confirm("Вы точно хотите удалить эту новость?")) removeArticle(crossButton.parentNode.parentNode.id)
    };

    /*Показ новости на отдельной странице*/
    var showOneNews = (customNode) => {
        var id = customNode.parentNode.id;
        cleanPage();
        var oneNews = document.getElementById("one-news-template").content.cloneNode(true);
        var article = Object.assign(articlesService.getArticle(id));
        var _author = oneNews.lastElementChild.getElementsByClassName("author")[0];
        var _date = oneNews.lastElementChild.getElementsByClassName("post-date")[0];
        oneNews.lastElementChild.id = id;
        oneNews.firstElementChild.innerHTML = article.title;
        _author.insertAdjacentHTML("beforebegin", "<div class='other-links'>" + article.content + "</div>");
        _author.innerHTML = article.author;
        article.tags.forEach((tag) => _date.insertAdjacentHTML("beforebegin", "<span class='hashteg'>" + tag + " </span>"));
        _date.innerHTML = article.createdAt.toLocaleString("ru", options);
        LOAD_MORE.innerHTML = "";
        NEWS_LIST.insertBefore(oneNews, NEWS_LIST.firstElementChild);
        optionsForOneNews();
    };
    var optionsForOneNews = () => {
        toggle({LINK_MAIN_PAGE:true,MY_BUTTON:false,LINK_ADD_NEWS:false});
        constInThePage['LINK_MAIN_PAGE'].addEventListener('click', ()=>location.reload());
        if (!globalUserName) document.getElementsByClassName("redact-buttons")[0].style.display = "none";
    };
    var removeArticleInOnePage = (crossButton) => {
        crossButton = crossButton.parentNode.parentNode;
        if (confirm("Вы точно хотите удалить эту новость?")) {
            articlesService.removeArticle(crossButton.id);
            articlesService.toLocaleStorage();
            crossButton.parentNode.removeChild(crossButton.parentNode.firstElementChild);
            crossButton.parentNode.removeChild(crossButton.parentNode.firstElementChild);
            currentCount = 0;
            init();
        }
    };
    var editArticleInOnePage = (tickButton) => {
        var e = tickButton.parentNode.parentNode.parentNode;
        e.removeChild(e.firstElementChild);
        e.removeChild(e.firstElementChild);
        showWindowEditNews(tickButton);
    };

    /*Редактирование*/
    var editArticle = (id, myContent, url) => {
        if (!globalUserName)return;
        if (articlesService.editArticle(id, myContent) && url.length >= 0) {
            articlesService.getImage(id).url = url;
            articlesService.getArticle(id).createdAt = new Date();
            alert("Успешно");
            stepForwardClick();
            articlesService.toLocaleStorage();
        }
        else alert("Что-то заполнено не так");
    };
    var editNews = (id) => {
        var myContent = {};
        myContent.title = document.getElementById("change-title-textarea").value;
        myContent.summary = document.getElementById("change-summary-textarea").value;
        myContent.content = document.getElementById("change-content-textarea").value;
        myContent.tags = tagsToAddOrEdit;
        var url = document.getElementById("change-url-textarea").value;
        editArticle(id, myContent, url);
    };
    var showWindowEditNews = (articleToEdit) => {
        tagsToAddOrEdit = [];
        var id = articleToEdit.parentNode.parentNode.id;
        var article = Object.assign(articlesService.getArticle(id));
        var image = articlesService.getImage(id);
        var elem = document.getElementById("change-news-template").content.cloneNode(true);
        cleanPage();
        LOAD_MORE.innerHTML = "";
        elem.getElementById("change-title-textarea").innerHTML = article.title;
        elem.getElementById("change-summary-textarea").innerHTML = article.summary;
        elem.getElementById("change-content-textarea").innerHTML = article.content;
        elem.getElementById("change-url-textarea").innerHTML = image.url;
        for (var i = 0; i < article.tags.length; i++) {
            let myP = document.createElement("p");
            tagsToAddOrEdit.push(article.tags[i]);
            myP.className = "tags-to-add-or-edit";
            myP.innerHTML = "# " + article.tags[i];
            myP.oncontextmenu = () => {return false;}
            elem.firstElementChild.insertBefore(myP, elem.firstElementChild.getElementsByClassName("add-news-button")[0]);
        }
        NEWS_LIST.insertBefore(elem, NEWS_LIST.firstElementChild);
        optionsForEditNewsPage(id);
    };
    var optionsForEditNewsPage = (id) => {
        toggle({LINK_MAIN_PAGE:true,MY_BUTTON:false,LINK_ADD_NEWS:false});
        document.getElementsByClassName("add-news-button")[0].addEventListener('click', () => editNews(id));
    };

    /*Прочее*/
    var cleanPage = () => {
        while (NEWS_LIST.firstElementChild.className === "single-news")NEWS_LIST.removeChild(NEWS_LIST.firstElementChild);
    };
    var setUserName = () => {
        if (globalUserName)
            constInThePage['USERNAME'].innerHTML = "<p>Log as " + globalUserName + "</p>";
        else
            constInThePage['USERNAME'].innerHTML = "";
    };
    var checkToEnter = (event) => {
        if (event.keyCode === 13) addOneMoreTagToList(event.target)
    };
    var toggle=(obj)=>{
        for(var key in obj) {
            if(obj[key]) constInThePage[key].style.display = "";
            else constInThePage[key].style.display = "none";
        }
    }
}();