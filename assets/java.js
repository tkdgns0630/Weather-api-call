var dataSearch1 = [];
var dataSearch2 = [];

init();
// hides the right part
function init() {
  $("#righto").hide();
}

$("#city").click(function () {
  reset();
});
//add click handler on search
$(document).ready(function () {
  $("#button").click(function () {
    cities = $("#city").val().trim().replaceAll(" ", "%20");
    firstApiCall(cities);
  });
});
// add keypress handler on enter
$("#city").on("keypress", function (event) {
  var key = event.which;
  if (key == 13) {
    $("#button").click();
  }
});
//get lat lon
function firstApiCall(cities) {
  var queryString =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cities +
    "&limit=5&appid=73c378629294c549e2c71b1fd86ee988";

  fetch(queryString, {
    method: "GET",
    credentials: "same-origin",
    redirect: "follow",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      secondApiCall(data);
      console.log(data);
    });
}
// get city data for lat lon
function secondApiCall(whether) {
  dataSearch1 = whether;
  dataSearch1Lat = dataSearch1[0].lat;
  dataSearch1Lon = dataSearch1[0].lon;

  var queryString1 =
    "http://api.openweathermap.org/data/2.5/forecast?lat=" +
    dataSearch1Lat +
    "&lon=" +
    dataSearch1Lon +
    "&appid=73c378629294c549e2c71b1fd86ee988";

  fetch(queryString1, {
    method: "GET",
    credentials: "same-origin",
    redirect: "follow",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displaydata(data);
    });
}

// displaying data on screen
function displaydata(city1) {
  var dataSearch2 = city1;
  console.log(dataSearch2);
  var weather =
    "https://openweathermap.org/img/wn/" +
    dataSearch2.list[0].weather[0].icon +
    "@2x.png";
  $("#header").append(
    dataSearch2.city.name +
      " " +
      dayjs(dataSearch2.list[0].dt_txt).format("DD/MM/YYYY") +
      "<img id='icon' src=" +
      weather +
      ">"
  );
  $("#temp").append(
    "Temp: " +
      (Math.round((280 - dataSearch2.list[0].main.temp) * 100) / 100).toFixed(
        1
      ) +
      " °C"
  );
  $("#wind").append("Wind: " + dataSearch2.list[0].wind.speed + " MPH");
  $("#humidity").append(
    "Humidity: " + dataSearch2.list[0].main.humidity + " %"
  );

  fiveDaysForecast(dataSearch2);
}

function fiveDaysForecast(eachDay) {
  var eachDayInfo = [
    eachDay.list[7],
    eachDay.list[15],
    eachDay.list[23],
    eachDay.list[31],
    eachDay.list[39],
  ];

  for (let i = 0; i < 5; i++) {
    weathericon =
      "https://openweathermap.org/img/wn/" +
      eachDayInfo[i].weather[0].icon +
      "@2x.png";

    $("#day" + i).append(
      dayjs(eachDayInfo[i].dt_txt).format("DD/MM/YY") +
        "<img id='icon' src=" +
        weathericon +
        ">" +
        "<br><br> temp: " +
        (Math.round((280 - eachDayInfo[i].main.temp) * 100) / 100).toFixed(1) +
        " °C" +
        "<br><br>" +
        "Wind: " +
        eachDayInfo[i].wind.speed +
        " MPH" +
        "<br><br>" +
        "Humidity: " +
        eachDayInfo[i].main.humidity +
        " %"
    );
  }
  $("#righto").show();
}

//resetting
function reset() {
  $("#city").val("");

  $("#header").text("");
  $("#temp").text("");
  $("#wind").text("");
  $("#humidity").text("");

  $("#day0").text("");
  $("#day1").text("");
  $("#day2").text("");
  $("#day3").text("");
  $("#day4").text("");

  $("#righto").hide();
}
