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

  var dayLengthTestForChart = 13.5;
  var nightLengthTestForChart = 24 - dayLengthTestForChart;

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
        y: dayLengthTestForChart,
        color: "#ffac33"
      },
      {
        name: nightStr,
        y: nightLengthTestForChart,
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