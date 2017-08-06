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
  console.log('Sunrise at click loc: ' + sunData.results.sunrise + '. Sunset at click loc: ' + sunData.results.sunset);
};


var initialize = function() {
  var mapDiv = document.querySelector('#main-map');
  var center = {lat: 55.9410457, lng: -3.2754232};
  var mainMap = new MapWrapper(mapDiv, center, 5);
  mainMap.addClickEvent(makeRequest);
};

window.addEventListener('load', initialize);