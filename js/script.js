
const app = (function() {
  const winsInput = document.querySelector('#wins');
  const lossesInput = document.querySelector('#losses');
  const submitBtn = document.querySelector('#submitBtn');

  const init = function() {
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
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const wins = winsInput.value;
      const losses = lossesInput.value;
      addToDatabase(wins, losses);
    })
    setTimeout(1000, renderChart())
    //renderChart()

  }

  const renderChart = function() {
    getDatabaseData();
  }

  const addToDatabase = function(wins, losses) {
    let ratio = 0;

    if(wins > 0 && losses == 0) {
      ratio = wins;
    }

    if(wins > 0 && losses > 0) {
      ratio = (wins / losses).toFixed(2);
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
    });

    getDatabaseData();
  }

  const getDatabaseData = function() {
    let matchStats = {
      ratioArray: [],
      wins: [],
      losses: [],
      id: [],
    }
    let matches = firebase.database().ref('matches/');
    matches.once('value', function(snapshot) {
      let allMatches = snapshot.val();
      console.log(allMatches)
      let id = 0;
       for(match in allMatches) {
        id += 1;
        const matchID = match;
        matchStats.ratioArray.push(allMatches[matchID].ratio);
        matchStats.wins.push(allMatches[matchID].wins);
        matchStats.losses.push(allMatches[matchID].losses);
        matchStats.id.push(id);
      }
      chartData(matchStats)
    });
  }

  const chartData = function(matchStats) {
    console.log(matchStats.ratioArray)
  const ctx = document.getElementById("dataChart").getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: matchStats.id,
        datasets: [
          {
            label: 'Win/Loss Ratio',
            data: matchStats.ratioArray,
            backgroundColor: [
                'rgba(25, 205, 255, 0.3)',
            ],
            borderColor: [
                'rgb(0, 114, 255)',
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
                }
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
            return ['Wins: ' + matchStats.wins[t[0].index], 'Loss: ' + matchStats.losses[t[0].index]]; //return a string that you wish to append
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