const logoutClick = () => {
    httpPost('/logout')
        .then(error => alert(`Rejected: ${error}`));
    checkLogin();
    globalUserName = null;
    document.location.href = '/';
};
const loginSubmitClick = () => {
  const body = {
    name: heyId('login-name').value,
    password: heyId('login-password').value,
  };
  httpPost('/login', body)
      .then(error => alert(`Rejected: ${error}`),

              checkLogin(),
              heyId('link-login').click(),
      );
};
const checkLogin = () => {
    httpGet('./user')
        .then(
            response => {
                globalUserName = response;
                setUserName();
                currentCount = 0;
                cleanPage();
                logicService.init();
            },
            error=> {
                currentCount = 0;
                cleanPage();
                logicService.init()
            }
        );
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
