const logoutClick = () => {
  http('DELETE', '/logout')
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
  http('POST', '/login', body)
      .then(
          (response) => {
              checkLogin();
              heyId('link-login').click();
          },
          error => alert(`Rejected: ${error}`)
      );
};
const checkLogin = () => {
    http('GET','/user')
        .then(
            (response) => {
                globalUserName=response;
                setUserName();
                currentCount = 0;
                cleanPage();
                logicService.init();
            },
            error => {
                globalUserName=null;
                setUserName();
                currentCount = 0;
                cleanPage();
                logicService.init();
            }
        );
};
function http(type, url, who) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(type, url, true);
    xhr.onerror = function () {
      reject(new Error('Network Error'));
    };
    xhr.onload = function () {
      if (this.status === 200) {
        resolve(xhr.response);
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

