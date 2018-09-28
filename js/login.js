(function() {
  var config = {
    apiKey: "AIzaSyAqHZMs6maStsVvUmBytYVLDxEGguiB5Jw",
    authDomain: "chartdata-44741.firebaseapp.com",
    databaseURL: "https://chartdata-44741.firebaseio.com",
    projectId: "chartdata-44741",
    storageBucket: "chartdata-44741.appspot.com",
    messagingSenderId: "76656519157"
  };
  firebase.initializeApp(config);
  const iosources = {
    loginInput: document.querySelector('#username'),
    passwordInput: document.querySelector('#password'),
    loginBtn: document.querySelector('#loginSubmit'),
  }

  iosources.loginBtn.addEventListener('click', (e)=> {
    e.preventDefault();
    const password = iosources.passwordInput.value;
    const login = iosources.loginInput.value
    console.log(login + ' ' + password);

    firebase.auth().createUserWithEmailAndPassword(login, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
  })
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('login success')
    } else {
      console.log('login failed')
    }
  });
})()