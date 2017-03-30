var articlesService = (function () {
    "use strict";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', './articles', false);
    xhr.send();
    if (xhr.status != 200) {
        alert('Ошибка ' + xhr.status + ': ' + xhr.statusText);
    } else {
        var articles = (JSON.parse(xhr.responseText, (key, value) => {
            if (key == 'createdAt') return new Date(value);
            return value;
        }));
    }

    xhr.open('GET', './tags', false);
    xhr.send();
    if (xhr.status != 200) {
        alert('Ошибка ' + xhr.status + ': ' + xhr.statusText);
    } else {
        var tags = (JSON.parse(xhr.responseText));
    }

    xhr.open('GET', './images', false);
    xhr.send();
    if (xhr.status != 200) {
        alert('Ошибка ' + xhr.status + ': ' + xhr.statusText);
    } else {
        var images = (JSON.parse(xhr.responseText));
    }



    var getArticles=(skip=0, top=10, filterConfig={})=> {
        var _author = filterConfig.author || "";
        var _beginDate = filterConfig.beginDate || new Date(-8640000000000000);
        var _endDate = filterConfig.endDate || new Date(8640000000000000);
        var _tags = filterConfig.tags;
        var _articles = articles;
        _articles = _articles.filter(param=>param.author.indexOf(_author)>-1);
        _articles = _articles.filter(param=>param.createdAt >= _beginDate && param.createdAt <= _endDate);
        if(_tags!==undefined) {_articles = _articles.filter((param)=> {
            for (var i = 0; i < _tags.length; i++) {if (param.tags.indexOf(_tags[i]) === -1)return false;}
            return true;
        });};
        return _articles.sort((a, b)=>b.createdAt - a.createdAt).slice(skip, skip + top);
    };
    var getArticle=(id) =>articles.find(param=>param.id === id);
    var inTags=(tag)=>tags.find(param=>param === tag);
    var getImage=(id)=> images.find(param=>param.id === id);
    var addNewImage=(id, url)=> images.push({id: id, url: url});
    var validateArticle=(article, withoutID)=> {
        if (typeof article.title !== 'string' || article.title.length <= 0 || article.title.length > 100) return false;
        if (typeof article.summary !== 'string' || article.summary.length <= 0 || article.summary.length > 200) return false;
        if (withoutID === undefined && (typeof article.id !== 'string' || article.id.length <= 0 || getArticle(article.id) !== undefined)) return false;
        if ((article.createdAt instanceof Date) === false)return false;
        if (typeof article.author !== 'string' || article.author.length <= 0) return false;
        if (typeof article.content !== 'string' || article.content.length <= 0) return false;
        if (article.tags.length <= 0) return false;
        for (var i = 0; i < article.tags.length; i++) {if(tags.indexOf(article.tags[i])===-1) return false;}
        return true;
    };
    var addArticle=(article)=>{
        if (validateArticle(article)) {articles.push(article);return true;}
        return false;
    };
    var editArticle=(id, article)=> {
        var _clone;
        if ((_clone = getArticle(id)) === undefined)return false;
        var _article=Object.assign({},_clone);
        if (article.title !== undefined) _article.title = article.title;
        if (article.summary !== undefined) _article.summary = article.summary;
        if (article.content !== undefined) _article.content = article.content;
        if (article.tags !== undefined) _article.tags = article.tags;
        if (validateArticle(_article, "")){removeArticle(id);addArticle(_article);console.log(getArticle(id));return true;}
        return false;
    };
    var addTag=(tag)=> {
        if (inTags(tag) === undefined) {tags.push(tag);return true;}
        return false;
    };
    var deleteTag=(tag)=> {
        var x = inTags(tag);
        if (inTags(tag) !== undefined) {tags.splice(x, 1);return true;}
        return false;
    };
    var removeArticle=(id)=> {
        var x=articles.findIndex(param=>param.id === id);
        if (x === undefined) return false;
        articles.splice(x, 1);
        return true;
    };
    var getTags=()=>tags;
    var toLocaleStorage=()=> {
        xhr.open("POST", '/articles', true)
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        xhr.send(JSON.stringify(articles));
        xhr.open("POST", '/tags', true)
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        xhr.send(JSON.stringify(tags));
        xhr.open("POST", '/images', true)
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        xhr.send(JSON.stringify(images));
    };
    var confirmUser=(username,password)=>users.find(param=>param.firstName===username &&param.lastName===password);
    return {
        getArticles: getArticles,
        getArticle: getArticle,
        validateArticle: validateArticle,
        addArticle: addArticle,
        editArticle: editArticle,
        inTags: inTags,
        addTag: addTag,
        deleteTag: deleteTag,
        removeArticle: removeArticle,
        getImage: getImage,
        addNewImage: addNewImage,
        getTags:getTags,
        toLocaleStorage:toLocaleStorage,
        confirmUser:confirmUser,
    };
}());
