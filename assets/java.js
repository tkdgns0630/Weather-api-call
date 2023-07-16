var cities;
let history = [];
var dataSearch1 = [];
var dataSearch2 = [];
//display history

init();
// hides the right part
function init() {
  $("#righto").hide();
  getItem();
}

$("#city").click(function () {
  reset();
  $("#righto").hide();
});
//add click handler on search
$(document).ready(function () {
  $("#button").click(function () {
    cities = $("#city").val().trim().replaceAll(" ", "%20");
    firstApiCall(cities);
    if (cities.length > 0) {
      reset();
    }
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
      (
        Math.round((dataSearch2.list[0].main.temp - 273.15) * 100) / 100
      ).toFixed(1) +
      " °C"
  );
  $("#wind").append("Wind: " + dataSearch2.list[0].wind.speed + " MPH");
  $("#humidity").append(
    "Humidity: " + dataSearch2.list[0].main.humidity + " %"
  );

  fiveDaysForecast(dataSearch2);
}

// five days forecast
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
        (Math.round((eachDayInfo[i].main.temp - 273.15) * 100) / 100).toFixed(
          1
        ) +
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
  if (cities && cities.length > 0) {
    saveItems();
  }
  $("#histori").text("");
  getItem();
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
}

// make history buttons and click handlers on them
function buttons(histori) {
  if (histori.length < 9) {
    for (let i = 0; i < histori.length; i++) {
      $("#histori").append(
        '<button class="btn btn-primary historing value = ' +
          [i] +
          '" type="button">' +
          histori[i] +
          "</button>"
      );
    }
  } else {
    for (let i = 0; i < 9; i++) {
      $("#histori").append(
        '<button class="btn btn-primary historing value = ' +
          [i] +
          '" type="button">' +
          histori[i] +
          "</button>"
      );
    }
  }
  $(".value").on("click", function (event) {
    reset();
    cities = "";
    var buttan = event.target;
    var text1 = buttan.innerHTML;
    firstApiCall(text1);
  });
}

// load from local storage
function getItem() {
  history = JSON.parse(localStorage.getItem("cities"));
  if (history && history.length > 0) {
    buttons(history);
  }
}

// save to local storage
function saveItems() {
  if (history === null) {
    history = [cities];
  } else {
    history.unshift(cities);
  }
  if (history.length > 9) {
    history.pop();
  }
  localStorage.setItem("cities", JSON.stringify(history));
}
