;!function () {
    "use strict";
    var currentCount = 0;
    var GLOBAL_STEP = 5;
    var globalUserName;
    var filterConfig = {tags: []};
    var options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timezone: 'UTC'
    };
    var tagsToAddOrEdit = [];

    /*События*/
    var documentReady=()=>{
        articlesService.toLocaleStorage();
        globalUserName=JSON.parse(localStorage.getItem("globalUserName"));
        init();
        document.getElementsByClassName('data-content')[0].addEventListener('click', eventsInDataContent);
        document.getElementsByClassName('data-content')[0].addEventListener('contextmenu',eventsOnContextMenu);
        document.body.addEventListener('keydown', eventsOnEnter);
        document.getElementsByClassName("myButton")[0].addEventListener('click',()=> filter());
        document.getElementsByClassName('search-tag')[0].addEventListener('change', (e)=> filterConfig.tags = [].slice.call(e.target.selectedOptions).map(a => a.value));
        document.getElementsByClassName("clear-filter")[0].addEventListener('click',()=> clearFilter());
        document.getElementById("link-add-news").addEventListener('click',()=>showWindowAddNews() );
        document.getElementById("link-logout").addEventListener('click',()=>{
            globalUserName=null;
            localStorage.setItem("globalUserName", JSON.stringify(globalUserName));
            location.reload();
        } );
        document.getElementById("login-submit").addEventListener('click',()=>{
            if(document.getElementById("login-name").value==="admin"&&document.getElementById("login-password").value==="admin") {
                globalUserName = "admin";
                localStorage.setItem("globalUserName", JSON.stringify(globalUserName));
                location.reload();
            }
        } );
    };
    document.addEventListener("DOMContentLoaded", documentReady);
    var eventsOnContextMenu=()=>{
        if(event.target.className === 'tags-to-add-or-edit'){
            if (confirm("Добавить данный тег в список доступных?")) {
                articlesService.addTag(event.target.innerHTML.substring(2))
                localStorage.setItem("tags", JSON.stringify(articlesService.getTags()));
            }
        }
    };
    var eventsInDataContent=()=>{
        if (event.target.className === 'cross')clickToRemoveArticle(event.target)
        else if(event.target.className === 'tick')showWindowEditNews(event.target)
        else if (event.target.className === 'crossInOnePage')removeArticleInOnePage(event.target.parentNode.parentNode)
        else if(event.target.className === 'tickInOnePage')editArticleInOnePage(event.target)
        else if(event.target.className === 'show-one-news')showOneNews(event.target.parentNode.id)
        else if(event.target.className === 'load-more-button')init()
        else if(event.target.className === 'step-forward-button'){
            cleanPage();
            currentCount = 0;
            init();
        }
        else if(event.target.className === 'tags-to-add-or-edit'){
            event.target.style.display = 'none';
            tagsToAddOrEdit.forEach((param,index)=> {
                if (param === event.target.innerHTML.substring(2)) tagsToAddOrEdit.splice(index, 1);
            });
        }
    };
    var eventsOnEnter=()=>{
        if (event.target.className === 'tags-input')checkToEnter(event,event.target)
    };

    /*Загрузка новостей и фильтр*/
    var init=()=> {
        var xOffset = window.pageXOffset;
        var yOffset = window.pageYOffset;
        var newsList = document.getElementsByClassName("data-content")[0];
        var news = document.getElementById("single-news-template");
        var mas = articlesService.getArticles(currentCount, GLOBAL_STEP, filterConfig);
        for (var i = 0; i < mas.length; i++) {
            var singleNews = news.content.cloneNode(true);
            singleNews.firstElementChild.id = mas[i].id;
            singleNews.firstElementChild.getElementsByClassName("image-header")[0].firstElementChild.src = articlesService.getImage(mas[i].id).url;
            singleNews.firstElementChild.getElementsByTagName("h1")[0].innerHTML = mas[i].title;
            singleNews.firstElementChild.getElementsByTagName("p")[0].innerHTML = mas[i].summary;
            singleNews.firstElementChild.getElementsByClassName("author")[0].innerHTML = mas[i].author;
            mas[i].tags.forEach((tag)=> singleNews.firstElementChild.getElementsByClassName("post-date")[0].insertAdjacentHTML("beforebegin","<span class='hashteg'>"+tag+" </span>"));
            singleNews.firstElementChild.getElementsByClassName("post-date")[0].innerHTML = mas[i].createdAt.toLocaleString("ru", options);
            if (!globalUserName) singleNews.firstElementChild.getElementsByClassName("redact-buttons")[0].style.display = "none";
            newsList.insertBefore(singleNews, newsList.lastElementChild);
        }
        currentCount += mas.length;
        window.scrollTo(xOffset, yOffset);
        optionsForMainPage(newsList);
    };
    var optionsForMainPage=(newsList)=>{
        document.getElementById("myButton").style.display = "";
        document.getElementById("link-main-page").addEventListener('click',()=> {
            cleanPage();
            currentCount = 0;
            init();
        });
        var tagsOptions=document.getElementsByClassName("search-tag")[0];
        var _tags=articlesService.getTags();
        _tags.forEach((elem)=>tagsOptions.innerHTML+="<option>"+elem+"</option>");
        tagsOptions.size=_tags.length;
        document.getElementById("link-main-page").style.display = "none";
        if (!globalUserName) {
            document.getElementById("link-add-news").style.display = "none";
            document.getElementById("link-logout").style.display = "none";
            document.getElementById("link-login").style.display = "";
        }
        else {
            document.getElementById("link-add-news").style.display = "";
            document.getElementById("link-logout").style.display = "";
            document.getElementById("link-login").style.display = "none";
        }
        setUserName();
        if (currentCount === articlesService.getArticles(0, 8640000000000000, filterConfig).length) newsList.lastElementChild.innerHTML = "";
        else newsList.lastElementChild.innerHTML = "<a class='load-more-button'>Load more</a>";
    };
    var filter=()=> {
        cleanPage();
        currentCount = 0;
        filterConfig.author = document.getElementById("author-search").firstElementChild.value;
        filterConfig.beginDate = new Date(document.getElementById("date-search").firstElementChild.value);
        filterConfig.endDate = new Date(document.getElementById("date-search").lastElementChild.value);
        if (isNaN(filterConfig.beginDate)) filterConfig.beginDate = undefined;
        if (isNaN(filterConfig.endDate)) filterConfig.endDate = undefined;
        init();
    };
    var clearFilter=()=>{
        var InputSearchElements=document.getElementsByClassName("search-panel")[0].getElementsByTagName("input");
        [].forEach.call(InputSearchElements,(elem)=>elem.value="");
        filterConfig = {tags: []};
    };

    /*Добавление новостей*/
    var optionsForAddNewsPage=()=>{
        document.getElementById("link-main-page").style.display = "";
        document.getElementById("myButton").style.display = "none";
        document.getElementById("link-add-news").style.display = "none";
        document.getElementsByClassName("add-news-button")[0].addEventListener('click',()=> addNews());
    };
    var showWindowAddNews=()=> {
        tagsToAddOrEdit = [];
        var newsList = document.getElementsByClassName("data-content")[0];
        var elem = document.getElementById("add-news-template").content.cloneNode(true);
        cleanPage();
        newsList.lastElementChild.innerHTML = "";
        newsList.insertBefore(elem, newsList.firstElementChild);
        optionsForAddNewsPage();
    };
    var addOneMoreTagToList=(newTag)=> {
        tagsToAddOrEdit.push(newTag.value);
        var myP = document.createElement("p");
        myP.className="tags-to-add-or-edit";
        myP.innerHTML = "# " + newTag.value;
        myP.oncontextmenu=()=>{ return false;}/*Если что,тут это специально,чтобы вызывался только мой обработчик без контекстного меню.Хотя может проще можно*/
        document.getElementsByClassName("single-news")[0].insertBefore(myP, newTag.parentNode.nextElementSibling);
        newTag.value = "";
    };
    var addArticle=(myContent, url)=> {
        if(!globalUserName)return;
        if (articlesService.addArticle(myContent) && articlesService.addNewImage(myContent.id, url)) {
            alert("Успешно");
            currentCount = 0;
            cleanPage();
            init();
            articlesService.toLocaleStorage();
        }
        else alert("Что-то заполнено не так");
    };
    var addNews=()=> {
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
    var removeArticle=(id)=> {
        if(!globalUserName)return;
        if (articlesService.removeArticle(id)) {
            document.getElementById(id).style.display = "none";
            currentCount--;
            articlesService.toLocaleStorage();
        }
    };
    var clickToRemoveArticle=(crossButton)=> {if (confirm("Вы точно хотите удалить эту новость?")) removeArticle(crossButton.parentNode.parentNode.id)};

    /*Показ новости на отдельной странице*/
    var showOneNews=(id)=> {
        var newsList = document.getElementsByClassName("data-content")[0];
        cleanPage();
        var oneNews= document.getElementById("one-news-template").content.cloneNode(true);
        var article = Object.assign(articlesService.getArticle(id));
        var _author=oneNews.lastElementChild.getElementsByClassName("author")[0];
        var _date=oneNews.lastElementChild.getElementsByClassName("post-date")[0];
        oneNews.lastElementChild.id=id;
        oneNews.firstElementChild.innerHTML = article.title;
        _author.insertAdjacentHTML("beforebegin","<div class='other-links'>"+article.content+"</div>");
        _author.innerHTML = article.author;
        article.tags.forEach((tag)=>_date.insertAdjacentHTML("beforebegin","<span class='hashteg'>"+tag+" </span>"));
        _date.innerHTML = article.createdAt.toLocaleString("ru", options);
        newsList.lastElementChild.innerHTML = "";
        newsList.insertBefore(oneNews, newsList.firstElementChild);
        optionsForOneNews(newsList);
    };
    var optionsForOneNews=(newsList)=>{
        document.getElementById("link-main-page").style.display = "";
        document.getElementById("myButton").style.display = "none";
        document.getElementById("link-add-news").style.display = "none";
        document.getElementById("link-main-page").addEventListener('click', function () {
            newsList.removeChild(newsList.firstElementChild);
            newsList.removeChild(newsList.firstElementChild);
            currentCount = 0;
            init();
        });
        if (!globalUserName) document.getElementsByClassName("redact-buttons")[0].style.display = "none";
    };
    var removeArticleInOnePage=(crossButton)=> {
        if (confirm("Вы точно хотите удалить эту новость?")) {
            articlesService.removeArticle(crossButton.id);
            crossButton.parentNode.removeChild(crossButton.parentNode.firstElementChild);
            crossButton.parentNode.removeChild(crossButton.parentNode.firstElementChild);
            currentCount = 0;
            init();
        }
    };
    var editArticleInOnePage=(tickButton)=> {
        var e=tickButton.parentNode.parentNode.parentNode;
        e.removeChild(e.firstElementChild);
        e.removeChild(e.firstElementChild);
        showWindowEditNews(tickButton);
    };

    /*Редактирование*/
    var editArticle=(id, myContent, url)=>{
        if(!globalUserName)return;
        if (articlesService.editArticle(id, myContent) && url.length >= 0) {
            articlesService.getImage(id).url = url;
            articlesService.getArticle(id).createdAt = new Date();
            alert("Успешно");
            currentCount = 0;
            cleanPage();
            init();
            articlesService.toLocaleStorage();
        }
        else alert("Что-то заполнено не так");
    };
    var editNews=(id)=> {
        var myContent = {};
        myContent.title = document.getElementById("change-title-textarea").value;
        myContent.summary = document.getElementById("change-summary-textarea").value;
        myContent.content = document.getElementById("change-content-textarea").value;
        myContent.tags = tagsToAddOrEdit;
        var url = document.getElementById("change-url-textarea").value;
        editArticle(id, myContent, url);
    };
    var showWindowEditNews=(articleToEdit)=> {
        tagsToAddOrEdit = [];
        var id = articleToEdit.parentNode.parentNode.id;
        var article = Object.assign(articlesService.getArticle(id));
        var image = articlesService.getImage(id);
        var newsList = document.getElementsByClassName("data-content")[0];
        var elem = document.getElementById("change-news-template").content.cloneNode(true);
        cleanPage();
        newsList.lastElementChild.innerHTML = "";
        elem.getElementById("change-title-textarea").innerHTML = article.title;
        elem.getElementById("change-summary-textarea").innerHTML = article.summary;
        elem.getElementById("change-content-textarea").innerHTML = article.content;
        elem.getElementById("change-url-textarea").innerHTML = image.url;
        for (var i = 0; i < article.tags.length; i++) {
            let myP = document.createElement("p");
            tagsToAddOrEdit.push(article.tags[i]);
            myP.className="tags-to-add-or-edit";
            myP.innerHTML = "# " + article.tags[i];
            myP.oncontextmenu=()=>{ return false;}
            elem.firstElementChild.insertBefore(myP, elem.firstElementChild.getElementsByClassName("add-news-button")[0]);
        }
        newsList.insertBefore(elem, newsList.firstElementChild);
        optionsForEditNewsPage(id);
    };
    var optionsForEditNewsPage=(id)=>{
        document.getElementById("myButton").style.display = "none";
        document.getElementById("link-main-page").style.display = "";
        document.getElementById("link-add-news").style.display = "none";
        document.getElementsByClassName("add-news-button")[0].addEventListener('click', ()=> editNews(id));
    };

    /*Прочее*/
    var cleanPage=()=> {
        var newsList = document.getElementsByClassName("data-content")[0];
        while (newsList.firstElementChild.className === "single-news")newsList.removeChild(newsList.firstElementChild);
    };
    var setUserName=()=> {
        if (globalUserName) document.getElementsByClassName("username")[0].innerHTML = "<p>Log as " + globalUserName + "</p>";
        else document.getElementsByClassName("username")[0].innerHTML = "";
        localStorage.setItem("globalUserName", JSON.stringify(globalUserName));
    };
    var checkToEnter=(event, elem)=> {if(event.keyCode === 13) addOneMoreTagToList(elem)};
}();