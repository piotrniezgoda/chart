
const app = (function() {
  const loginBtn = document.querySelector("#loginSubmit");
  const logoutBtn = document.querySelector("#logoutBtn");
  const errorMessageSpan = document.querySelector('#errorMessage');
  let secNum = 0;
  let userLogin = false;

  const init = function() {
    console.log('%c Welcome in ratio chart app, usually developers use this part of browser... are you?', 'background: #222; color: #bada55');
    const loginForm = document.querySelector('.login-form');
    const loginContainer = document.querySelector('#loginContainer');
    //const ctx = document.getElementById("dataChart").getContext('2d');
    var config = {
      apiKey: "AIzaSyAqHZMs6maStsVvUmBytYVLDxEGguiB5Jw",
      authDomain: "chartdata-44741.firebaseapp.com",
      databaseURL: "https://chartdata-44741.firebaseio.com",
      projectId: "chartdata-44741",
      storageBucket: "chartdata-44741.appspot.com",
      messagingSenderId: "76656519157"
    };
    firebase.initializeApp(config);
    firebase.auth().signOut();

    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      let userLogin = document.querySelector('#username');
      let userPassword = document.querySelector('#password');

      firebase.auth().signInWithEmailAndPassword(userLogin.value, userPassword.value).catch(function(error) {
        // Handle Errors here.
        //var errorCode = error.code;
        var errorMessage = error.message;
        //console.log(errorCode)
        console.log(errorMessage)
        errorMessageSpan.textContent = errorMessage;
        // ...
      });
      userLogin.value = '';
      userPassword.value = '';
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          userLogin = true;
          secNum += 1;
        if(userLogin && secNum == 1) {
          loginBtn.disabled = true;
          loginForm.classList.add('login-form--hidden');
          loginContainer.classList.add('login-containergit status--moved');
          generateUserContent(loginForm);
          logoutBtn.classList.remove('logoutButton--hidden');
        }

          // var displayName = user.displayName;
          // var email = user.email;
          // var emailVerified = user.emailVerified;
          // var photoURL = user.photoURL;
          // var isAnonymous = user.isAnonymous;
          // var uid = user.uid;
          // var providerData = user.providerData;
        } else {
          return;
        }
      });
    })
    setTimeout(1000, renderChart())
  }

  const generateUserContent = function(loginForm) {
    const container = document.querySelector('#loginUserContent');

    //create form
    const form = document.createElement('form');
    form.classList.add('addData-form');
    form.setAttribute('action', '');

    //create wins row
    const div1 = document.createElement('div');
    const winsLabel = document.createElement('label');
    const winsInput = document.createElement('input');
    winsLabel.classList.add('addData-label');
    winsLabel.setAttribute('for', 'wins');
    winsLabel.textContent = 'Wins:';
    winsInput.classList.add('addData-inputField');
    winsInput.setAttribute('type', 'number');
    winsInput.setAttribute('required', '');
    winsInput.setAttribute('id', 'wins');
    winsInput.setAttribute('min', '0');
    div1.appendChild(winsLabel);
    div1.appendChild(winsInput);

    //create losses row
    const div2 = document.createElement('div');
    const lossesLabel = document.createElement('label');
    const lossesInput = document.createElement('input');
    lossesLabel.classList.add('addData-label');
    lossesLabel.setAttribute('for', 'losses');
    lossesLabel.textContent = 'Losses:';
    lossesInput.classList.add('addData-inputField');
    lossesInput.setAttribute('type', 'number');
    lossesInput.setAttribute('required', '');
    lossesInput.setAttribute('id', 'losses');
    lossesInput.setAttribute('min', '0');
    div2.appendChild(lossesLabel);
    div2.appendChild(lossesInput);

    //create date row
    const div3 = document.createElement('div');
    const dateLabel = document.createElement('label');
    const dateInput = document.createElement('input');
    dateLabel.classList.add('addData-label');
    dateLabel.setAttribute('for', 'date');
    dateLabel.textContent = 'Date:';
    dateInput.classList.add('addData-inputField', 'addData-dateInput');
    dateInput.setAttribute('type', 'date');
    dateInput.setAttribute('id', 'date');
    div3.appendChild(dateLabel);
    div3.appendChild(dateInput);

    //create add button
    const btn = document.createElement('button');
    btn.classList.add('addData-submitBtn');
    btn.setAttribute('id', 'submitBtn');
    btn.setAttribute('type', 'submit');
    btn.textContent = 'add';


    //add row divs & buton to form
    form.appendChild(div1);
    form.appendChild(div2);
    form.appendChild(div3);
    form.appendChild(btn);


    //render form to container
    container.classList.add('addData-container');
    container.classList.add('addData-container--show');
    container.appendChild(form);

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const wins = winsInput.value;
        const losses = lossesInput.value;
        const date = dateInput.value || setCurrentDate();
        const winsInt = parseInt(wins, 10);
        const lossesInt = parseInt(losses, 10);
        addToDatabase(winsInt, lossesInt, date);
        winsInput.value = '';
        lossesInput.value = '';
        dateInput.value = '';
      })

      logoutBtn.addEventListener('click', ()=> {
        firebase.auth().signOut();
        secNum = 0;
        userLogin = false;
        if(!userLogin && secNum == 0) {
          loginBtn.disabled = false;
          loginForm.classList.remove('login-form--hidden');
          loginContainer.classList.remove('login-container--moved');
          logoutBtn.classList.add('logoutButton--hidden');
          container.classList.remove('addData-container--show');
        }
        window.location.reload();
      })
  }

  const renderChart = function() {
    getDatabaseData();
  }

  const addToDatabase = function(wins, losses, date) {
    let ratio = 0;

    if(wins > 0 && losses == 0) {
      ratio = 100;
    }

    if(wins > 0 && losses > 0) {
      ratio = ((wins * 100) / (wins + losses)).toFixed(2);
    }

    if(wins == 0 && losses > 0) {
      ratio = 0;
    }

    if(wins == 0 && losses == 0) {
      alert('obie wartosci sa rowne 0');
      return;
    }

    var database = firebase.database();
    database.ref('matches/').push({
      wins: wins,
      losses: losses,
      ratio: ratio,
      date: date,
    });

    getDatabaseData();
  }

  const getDatabaseData = function() {
    let matchStats = {
      ratioArray: [],
      wins: [],
      losses: [],
      date: [],
      id: [],
    }
    let matches = firebase.database().ref('matches/');
    matches.once('value', function(snapshot) {
      let allMatches = snapshot.val();
      let id = 0;
       for(match in allMatches) {
        id += 1;
        const matchID = match;
        matchStats.ratioArray.push(allMatches[matchID].ratio);
        matchStats.wins.push(allMatches[matchID].wins);
        matchStats.losses.push(allMatches[matchID].losses);
        matchStats.date.push(allMatches[matchID].date);
        matchStats.id.push(id);
      }
      chartData(matchStats)
    });
  }

  const setCurrentDate = function() {
    const today = new Date();
    return today.toISOString().substr(0,10);
  }

  const chartData = function(matchStats) {
  const ctx = document.getElementById("dataChart").getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: matchStats.id,
        datasets: [
          {
            label: 'Total wins %',
            data: matchStats.ratioArray,
            backgroundColor: [
                'rgba(0, 246, 255,0.7)',
            ],
            borderColor: [
                'rgb(17, 97, 224)',
            ],
            borderWidth: 2,
            fill: 'origin'
        },
      ]
    },
    options: {
      maintainAspectRatio: false,
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true,
                },
                gridLines: {
                  color: "#4c4c4c"
                },
            }],
            xAxes: [{
              ticks: {
                  beginAtZero:true,
              },
              gridLines: {
                color: "#4c4c4c"
              },
          }]
        },
        legend: {
          display: false,
          labels: {
              fontColor: 'rgb(255, 99, 132)'
          }
      },

      tooltips: {
        bodyFontSize: 15,
        bodyFontStyle: "bold",
        mode: 'point',
        custom: function(tooltip) {
          if (!tooltip) return;
          // disable displaying the color box;
          tooltip.displayColors = false;
        },
        callbacks: {
            label: function(tooltipItem, data) {
              let label = data.datasets[tooltipItem.datasetIndex].label;
              let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              return label + ': ' + value;
            },
          labelTextColor:function(){
              return 'rgb(201, 0, 130)';
          },
          // remove title
          title: function() {
            return;
          },
          footer: function(t, d) {
            return ['Wins: ' + matchStats.wins[t[0].index], 'Loss: ' + matchStats.losses[t[0].index], 'Date: ' + matchStats.date[t[0].index]];
         }
        }
    }
    }
});
  }

  return {
    init: init
  }

})()

app.init();