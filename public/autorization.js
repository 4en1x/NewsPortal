const xhr = new XMLHttpRequest();
const logoutClick = (globalUserName) => {
  xhr.open('POST', '/logout', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send();
  globalUserName = null;
  document.location.href = '/';
  return globalUserName;
};
const loginSubmitClick = (globalUserName) => {
  const body = {
    name: heyId('login-name').value,
    password: heyId('login-password').value,
  };
  xhr.open('POST', '/login', true);
  xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
  xhr.send(JSON.stringify(body));
  xhr.open('GET', './user', false);
  xhr.send();
  if (xhr.status === 200) {
    globalUserName = xhr.responseText;
    document.location.href = '/';
  } else {
    alert(xhr.responseText);
  }
  return globalUserName;
};
const checkLogin = (globalUserName) => {
  xhr.open('GET', './user', false);
  xhr.send();
  if (xhr.status === 200) globalUserName = xhr.responseText;
  return globalUserName;
};
function httpPost(url, who) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.onerror = function () {
      reject(new Error('Network Error'));
    };
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.send(JSON.stringify(who));
  });
}
function httpGet(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.onload = function () {
      if (this.status === 200) {
        resolve(this.response);
      } else {
        const error = new Error(this.statusText);
        error.code = this.status;
        reject(error);
      }
    };
    xhr.onerror = function () {
      reject(new Error('Network Error'));
    };
    xhr.send();
  });
}
