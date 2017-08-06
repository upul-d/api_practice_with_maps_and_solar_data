function makeRequest(pinPosition){
  var url = "https://api.sunrise-sunset.org/json?lat=" + pinPosition.latLng.lat() + "&lng=" + pinPosition.latLng.lng() + "";
  var request = new XMLHttpRequest();

  request.onreadystatechange = function() {
    if(request.readyState==4) {
      if(request.status==200) {
        populateSunData(request.responseText);
      };
    };
  };
  request.open('GET', url);
  request.send();
};

function populateSunData(response) {
  var sunData = JSON.parse(response);

  var table = document.querySelector('#main-table');
  var row1 = table.insertRow(0);
  row1.style.fontWeight = "900";
  var row2 = table.insertRow(1);

  var cell1 = row1.insertCell(0);
  var cell2 = row1.insertCell(1);
  var cell3 = row2.insertCell(0);
  var cell4 = row2.insertCell(1);
  cell1.innerHTML = 'Sunrise is at:';
  cell2.innerHTML = 'Sunset is at:';
  cell3.innerHTML =  sunData.results.sunrise;
  cell4.innerHTML =  sunData.results.sunset;

  table.style.border = "thin solid black"

  var chart = new PieChart(sunData);
};

var PieChart = function(sunData) {
  var container = document.querySelector('#pie-chart');
  var dayStr = "Day Length"
  var nightStr = "Night Length";
  var dayLength = sunData.results.day_length;

  var dayLengthJSONStr = JSON.stringify(dayLength);
  var time = dayLengthJSONStr;
  time = time.split(':');

  for (var i = 0; i < time.length; i++) {
    time[i] = time[i].replace(/"/g, "");
  }

  var hours = Number(time[0]);
  var minutes = Number(time[1]);
  var seconds = Number(time[2]);

  var hoursInSeconds = hours * 3600;
  var minutesInSeconds = minutes * 60;
  var timeInSeconds = hoursInSeconds + minutesInSeconds + seconds;

  var dayLengthToChart = timeInSeconds / 3600;
  var dayLengthToRound = dayLengthToChart;
  var precision = 2;

  var roundedDayLength = function(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  };

  var dayLengthToChart = roundedDayLength(dayLengthToRound, precision);
  var nightLengthToChart = 24 - dayLengthToChart;

  var chart = new Highcharts.Chart({
    chart: {
      type: 'pie',
      renderTo: container
    },
    title: {
      text: 'Day-Night Split At Selected Location'
    },
    series: [{
      name: "Hours",
      data: [{
        name: dayStr,
        y: dayLengthToChart,
        color: "#ffac33"
      },
      {
        name: nightStr,
        y: nightLengthToChart,
        color: "00ff00"
      }]
    }]
  });
}

var initialize = function() {
  var mapDiv = document.querySelector('#main-map');
  var center = {lat: 55.9410457, lng: -3.2754232};
  var mainMap = new MapWrapper(mapDiv, center, 5);
  mainMap.addClickEvent(makeRequest);
};

window.addEventListener('load', initialize);