const logoutClick = () => {
  httpPost('/logout')
      .then(
          (response) => {
              checkLogin();
              localStorage.removeItem("username");
              document.location.href = '/';
          },
          error => alert(`Rejected: ${error}`)
      );
};
const loginSubmitClick = () => {
  const body = {
    username: heyId('login-name').value,
    password: heyId('login-password').value,
  };
  httpPost('/login', body)
      .then(
          (response) => {
              localStorage.setItem("username", response);
              checkLogin();
              heyId('link-login').click();
          },
          error => alert(`Rejected: ${error}`)
      );
};
const checkLogin = () => {
    globalUserName = localStorage.getItem("username")||null;
    setUserName();
    currentCount = 0;
    cleanPage();
    logicService.init();
};
function httpPost(url, who) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.onerror = function () {
      reject(new Error('Network Error'));
    };
    xhr.onload = function () {
      if (this.status === 200) {
        resolve(xhr.responseText);
      } else {
        const error = new Error(this.statusText);
        error.code = this.status;
        reject(error);
      }
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
