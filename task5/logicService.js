var logicService = (function () {
    "use strict";
    /* Функционал,предназначенный для работы с консолью*/
    var currentCount = 0;
    var GLOBAL_STEP = 5;
    var globalUserName = "DarkLoS";
    var filterConfig = {tags: []};
    var options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timezone: 'UTC'
    };
    var tagsToAddOrEdit = [];
    function showOneNews(id) {
        var newsList = document.getElementsByClassName("data-content")[0];
        document.getElementsByClassName("main-header-links")[0].children[2].style.display = "";
        document.getElementsByClassName("main-header-links")[0].children[1].style.display = "none";
        document.getElementsByClassName("main-header-links")[0].children[2].onclick = function () {
            newsList.removeChild(newsList.firstElementChild);
            newsList.removeChild(newsList.firstElementChild);
            currentCount = 0;
            init();
        };
        var elem = document.getElementById("one-news-template").content.cloneNode(true);
        var article = articlesService.getArticle(id);
        cleanPage();
        elem.children[1].id=id;
        elem.firstElementChild.innerHTML = article.title;
        var div = document.createElement("div");
        div.className = "other-links";
        div.innerHTML = article.content;
        elem.children[1].insertBefore(div, elem.children[1].getElementsByClassName("author")[0]);
        elem.children[1].getElementsByClassName("author")[0].innerHTML = article.author;
        for (var j = 0; j < article.tags.length; j++) {
            var _tag = document.createElement("span");
            _tag.className = "hashteg";
            _tag.innerHTML = article.tags[j] + " ";
            elem.children[1].insertBefore(_tag, elem.children[1].getElementsByClassName("post-date")[0]);
        }
        elem.children[1].getElementsByClassName("post-date")[0].innerHTML = article.createdAt.toLocaleString("ru", options);
        newsList.lastElementChild.innerHTML = "";
        newsList.insertBefore(elem, newsList.firstElementChild);
        if (globalUserName == undefined) {
            document.getElementsByClassName("redact-buttons")[0].children[0].style.display = "none";
            document.getElementsByClassName("redact-buttons")[0].children[1].style.display = "none";
        }
    };
    function editArticle(id, myContent, url) {
        if(globalUserName===undefined)return;
        if (articlesService.editArticle(id, myContent) && url.length >= 0) {
            articlesService.getImage(id).url = url;
            articlesService.getArticle(id).createdAt = new Date();
            alert("Успешно");
            currentCount = 0;
            cleanPage();
            init();
            return true;
        }
        else {
            alert("Что-то заполнено не так");
            return false;
        }
    };
    function addArticle(myContent, url) {
        if(globalUserName===undefined)return;
        if (articlesService.addArticle(myContent) && articlesService.addnewImage(myContent.id, url)) {
            alert("Успешно");
            currentCount = 0;
            cleanPage();
            init();
            return true;
        }
        else {
            alert("Что-то заполнено не так");
            return false;
        }
    };
    function init() {
        document.getElementsByClassName("main-header-links")[0].children[2].style.display = "none";
        if (globalUserName === undefined) document.getElementsByClassName("main-header-links")[0].children[1].style.display = "none";
        else document.getElementsByClassName("main-header-links")[0].children[1].style.display = "";
        document.getElementsByClassName("main-header-links")[0].children[2].onclick = function () {
            cleanPage();
            currentCount = 0;
            init();
        }
        setUserName();
        var xOffset = window.pageXOffset;
        var yOffset = window.pageYOffset;
        var newsList = document.getElementsByClassName("data-content")[0];
        var news = document.getElementById("single-news-template");
        var mas = articlesService.getArticles(currentCount, GLOBAL_STEP, filterConfig);
        for (var i = 0; i < mas.length; i++) {
            var elem = news.content.cloneNode(true);
            elem.firstElementChild.id = mas[i].id;
            elem.firstElementChild.getElementsByClassName("image-header")[0].firstElementChild.src = articlesService.getImage(mas[i].id).url;
            elem.firstElementChild.getElementsByTagName("h1")[0].innerHTML = mas[i].title;
            elem.firstElementChild.getElementsByTagName("p")[0].innerHTML = mas[i].summary;
            elem.firstElementChild.getElementsByTagName("a")[0].innerHTML = "Раскрыть новость...";
            elem.firstElementChild.getElementsByClassName("author")[0].innerHTML = mas[i].author;
            for (var j = 0; j < mas[i].tags.length; j++) {
                var _tag = document.createElement("span");
                _tag.className = "hashteg";
                _tag.innerHTML = mas[i].tags[j] + " ";
                elem.firstElementChild.insertBefore(_tag, elem.firstElementChild.getElementsByClassName("post-date")[0]);
            }
            elem.firstElementChild.getElementsByClassName("post-date")[0].innerHTML = mas[i].createdAt.toLocaleString("ru", options);
            if (globalUserName === undefined) {
                elem.firstElementChild.getElementsByClassName("redact-buttons")[0].style.display = "none";
            }
            newsList.insertBefore(elem, newsList.lastElementChild);
        }
        currentCount += mas.length;
        window.scrollTo(xOffset, yOffset);
        if (currentCount === articlesService.getArticles(0, 8640000000000000, filterConfig).length) newsList.lastElementChild.innerHTML = "";
        else newsList.lastElementChild.innerHTML = "<a>Load more</a>";
        var mainLinks = document.getElementsByClassName("main-header-links")[0].firstElementChild;
        if (globalUserName === undefined) mainLinks.innerHTML = "Login"; else mainLinks.innerHTML = "Logout";
        document.getElementsByClassName("main-header-links")[0].children[1].onclick = function () {
            showWindowAddNews();
        };
    };
    function filter(config) {
        cleanPage();
        currentCount = 0;
        if (config !== undefined) filterConfig = Object.assign(config);
        else {
            filterConfig.author = document.getElementById("author-search").firstElementChild.value;
            filterConfig.beginDate = new Date(document.getElementById("date-search").firstElementChild.value);
            filterConfig.endDate = new Date(document.getElementById("date-search").lastElementChild.value);
            if (isNaN(filterConfig.beginDate)) filterConfig.beginDate = undefined;
            if (isNaN(filterConfig.endDate)) filterConfig.endDate = undefined;
        }
        init();
    };
    function cleanPage() {
        var newsList = document.getElementsByClassName("data-content")[0];
        while (newsList.firstElementChild.className === "single-news")newsList.removeChild(newsList.firstElementChild);
    };
    function removeArticle(id) {
        if(globalUserName===undefined)return;
        if (articlesService.removeArticle(id)) {
            document.getElementById(id).style.display = "none";
            currentCount--;
        }
    };
    function setUserName() {
        if (globalUserName !== undefined) document.getElementsByClassName("username")[0].innerHTML = "<p>Log as " + globalUserName + "</p>";
        else document.getElementsByClassName("username")[0].innerHTML = "";
    };
    function changeUserName(username) {
        globalUserName = username;
        cleanPage();
        currentCount = 0;
        init();
    };
    function changeStep(step) {
        GLOBAL_STEP = step || 5;
    };


    /* Прочий функционал,отображающий страницы и прочее*/
    function showWindowAddNews() {
        document.getElementsByClassName("main-header-links")[0].children[2].style.display = "";
        document.getElementsByClassName("main-header-links")[0].children[1].style.display = "none";
        tagsToAddOrEdit = [];
        var newsList = document.getElementsByClassName("data-content")[0];
        var elem = document.getElementById("add-news-template").content.cloneNode(true);
        cleanPage();
        newsList.lastElementChild.innerHTML = "";
        newsList.insertBefore(elem, newsList.firstElementChild);
        var addNewsButton = document.getElementsByClassName("add-news-button")[0];
        addNewsButton.onclick = function () {
            addNews(newsList);
        };
    };
    function showWindowEditNews(artic) {
        document.getElementsByClassName("main-header-links")[0].children[2].style.display = "";
        document.getElementsByClassName("main-header-links")[0].children[1].style.display = "none";
        tagsToAddOrEdit = [];
        var id = artic.parentNode.parentNode.id;
        var article = articlesService.getArticle(id);
        var image = articlesService.getImage(id);
        var newsList = document.getElementsByClassName("data-content")[0];
        var elem = document.getElementById("change-news-template").content.cloneNode(true);
        cleanPage();
        newsList.lastElementChild.innerHTML = "";
        elem.childNodes[1].children[1].firstElementChild.value = article.title;
        elem.childNodes[1].children[2].firstElementChild.value = article.summary;
        elem.childNodes[1].children[3].firstElementChild.value = article.content;
        elem.childNodes[1].children[4].firstElementChild.value = image.url;
        for (var i = 0; i < article.tags.length; i++) {
            let myP = document.createElement("p");
            tagsToAddOrEdit.push(article.tags[i]);
            myP.innerHTML = "# " + article.tags[i];
            myP.onclick = function () {
                myP.style.display = 'none';
                for (var j = 0; j < tagsToAddOrEdit.length; j++) {
                    if (tagsToAddOrEdit[j] == myP.innerHTML.substring(2)) {
                        tagsToAddOrEdit.splice(j, 1);
                        break;
                    }
                }
            }
            elem.childNodes[1].insertBefore(myP, elem.childNodes[1].children[6]);
        }
        newsList.insertBefore(elem, newsList.firstElementChild);
        var editNewsButton = document.getElementsByClassName("add-news-button")[0];
        var stepForwardButton = document.getElementsByClassName("step-forward-button")[0];
        editNewsButton.onclick = function () {
            editNews(newsList, id);
        }
        stepForwardButton.onclick = function () {
            cleanPage();
            currentCount = 0;
            init();
        }
    };
    function addOneMoreTagToList(elem) {
        tagsToAddOrEdit.push(elem.value);
        var myP = document.createElement("p");
        myP.innerHTML = "# " + elem.value;
        myP.onclick = function () {
            myP.style.display = 'none';
            for (var i = 0; i < tagsToAddOrEdit.length; i++) {
                if (tagsToAddOrEdit[i] == myP.innerHTML.substring(2)) {
                    tagsToAddOrEdit.splice(i, 1);
                    break;
                }
            }
        }
        var article = elem.parentNode.parentNode;
        article.insertBefore(myP, article.children[6]);
        elem.value = "";
    };
    function editNews(newsList, id) {
        var myContent = {};
        myContent.title = newsList.firstElementChild.children[1].firstElementChild.value;
        myContent.summary = newsList.firstElementChild.children[2].firstElementChild.value;
        myContent.content = newsList.firstElementChild.children[3].firstElementChild.value;
        myContent.tags = tagsToAddOrEdit;
        var url = newsList.firstElementChild.children[4].firstElementChild.value;
        editArticle(id, myContent, url);
    };
    function searchTag(event) {
        if (event.keyCode !== 13) return;
        var elem = document.createElement("p");
        var value = document.getElementById("hashteg-search").lastElementChild.value;
        elem.innerHTML = value;
        filterConfig.tags.push(value);
        elem.onclick = function () {
            elem.style.display = 'none';
            for (var i = 0; i < filterConfig.tags.length; i++) {
                if (filterConfig.tags[i] === elem.innerHTML) {
                    filterConfig.tags.splice(i, 1);
                    break;
                }
            }
        }
        elem.title = "Один из тегов,которые сейчас применяются для фильтра";
        document.getElementById("hashteg-search").lastElementChild.value = "";
        var panel = document.getElementsByClassName("search-panel")[0];
        panel.insertBefore(elem, panel.lastElementChild);
    };
    function addNews(newsList) {
        var myContent = {};
        myContent.title = newsList.firstElementChild.children[1].firstElementChild.value;
        myContent.summary = newsList.firstElementChild.children[2].firstElementChild.value;
        myContent.content = newsList.firstElementChild.children[3].firstElementChild.value;
        var url = newsList.firstElementChild.children[4].firstElementChild.value;
        myContent.id = String(Math.floor(Math.random() * 1000));
        myContent.createdAt = new Date();
        myContent.author = globalUserName;
        myContent.tags = tagsToAddOrEdit;
        addArticle(myContent, url);
    };
    function checkToEnter(event, elem) {
        if (event.keyCode === 13) {
            addOneMoreTagToList(elem)
        }
        ;
    };
    function clickToRemoveArticle(elem) {
        if (confirm("Вы точно хотите удалить эту новость?")) {
            removeArticle(elem.parentNode.parentNode.id);
        }
    };
    function removeArticleInOnePage(elem) {
        if (confirm("Вы точно хотите удалить эту новость?")) {
            articlesService.removeArticle(elem.id);
            elem.parentNode.removeChild(elem.parentNode.firstElementChild);
            elem.parentNode.removeChild(elem.parentNode.firstElementChild);
            currentCount = 0;
            init();
        }
    };
    function editArticleInOnePage(elem) {
        var e=elem.parentNode.parentNode.parentNode;
        e.removeChild(e.firstElementChild);
        e.removeChild(e.firstElementChild);
        showWindowEditNews(elem);
    };
    return{
        showOneNews:showOneNews,
        editNews:editNews,
        addArticle:addArticle,
        init:init,
        filter:filter,
        cleanPage:cleanPage,
        removeArticle:removeArticle,
        setUserName:setUserName,
        changeUserName:changeUserName,
        changeStep:changeStep,
        showWindowAddNews:showWindowAddNews,
        showWindowEditNews:showWindowEditNews,
        addOneMoreTagToList:addOneMoreTagToList,
        editArticle:editArticle,
        searchTag:searchTag,
        addNews:addNews,
        checkToEnter:checkToEnter,
        clickToRemoveArticle:clickToRemoveArticle,
        removeArticleInOnePage:removeArticleInOnePage,
        editArticleInOnePage:editArticleInOnePage
    };
}());
