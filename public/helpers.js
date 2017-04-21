let currentCount = 0;
const GLOBAL_STEP = 2;
let globalUserName;
let filterConfig = { tags: [] };
let tagsToAddOrEdit = [];

function heyId(id) {
  return document.getElementById(id);
}
function heyClass(who, cl) {
  return who.getElementsByClassName(cl)[0];
}
function heyTag(who, tg) {
  return who.getElementsByTagName(tg)[0];
}
function heyTarget(event) {
  return event.target;
}
const toggle = (obj) => {
  const map = new Map(Object.entries(obj));
  map.forEach((key, value) => {
    if (key) heyId(value).style.display = '';
    else heyId(value).style.display = 'none';
  });
};
const cleanPage = () => {
  while (heyId('data-content').firstElementChild) {
    heyId('data-content').removeChild(heyId('data-content').firstElementChild);
  }
};
const setUserName = () => {
  if (globalUserName) {
    heyClass(document, 'username').innerHTML = `<p>Log as ${globalUserName}</p>`;
  } else {
    heyClass(document, 'username').innerHTML = '';
  }
};
const optionForMainPage = (currentCount) => {
  toggle({ myButton: true, 'link-main-page': false });
  const status = Boolean(globalUserName);
  toggle({ 'link-login': !status, 'link-logout': status, 'link-add-news': status });
  httpGet('./maxSize')
      .then(
          (response) => {
            if (currentCount === JSON.parse(response)) {
              heyId('load-more').innerHTML = '';
            } else {
              heyId('load-more').innerHTML =
                  "<a class='load-more-button' data-action='loadMore'>Load more</a>";
            }
          }
      );
};
const addOneMoreTagToList = (newTag, type, tagsToAddOrEdit) => {
  tagsToAddOrEdit.push(newTag.value);
  const myP = document.createElement('p');
  myP.className = 'tags-to-add-or-edit';
  myP.innerHTML = `# ${newTag.value}`;
  myP.oncontextmenu = () => false;
  myP.dataset.action = 'deleteTag';
  heyId(`${type}-single-news`).insertBefore(myP, heyId(`${type}-news-button`));
  newTag.value = '';
};
