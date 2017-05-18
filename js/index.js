
var weatherApp = (function() {
  var APPID = "&APPID=ceac678e91037bdcaf898815c4a29f35";
  var weatherURL = "http://api.openweathermap.org/data/2.5/weather?q=";
  var celciusSelected = false;

  //Bind events
  $("#temperatureC").on("click", toggleTemperature);
  $("#temperatureF").on("click", toggleTemperature);

  getLocation();

  //Get user city via ip
  function getLocation() {
    $.get("http://ipinfo.io", function(json) {
      getWeather(json.city);
    }, "jsonp");
  }

  //Get weather for user base on user city.
  //Use data aquired to display
  function getWeather(city) {
    $.get(weatherURL+city+APPID, function(json) {    

      $(".city").html(json.name);
      $(".country").html(json.sys.country);
      displayTemperature(json.main, json.sys.country );
      displayWeather(json.weather[0]);
      displayWind(json.wind, json.sys.country);
    }, "jsonp");
  }
  //Display weather icon and weather type description.
  function displayWeather(weather) {
    $(".weatherDesc").html( weather.description);
    $(".weatherIcon").attr("src", "http://openweathermap.org/img/w/" + weather.icon + ".png");
  }
  //Display current temperature
  //Display F or C depending on country/city
  //Save current temperature F/C to data attr needed for toggle switch
  function displayTemperature(temperature, country) {
    var useFahren = false;
    var fTemp;
    var cTemp;

    if (arguments.length === 2) {
      useFahren  = usesFahrenheit(country);
    }

    if (typeof temperature.temp !=="undefined" ) {
      fTemp = Math.round(temperature.temp*9/5 - 459.67);
      cTemp = Math.round(temperature.temp - 273.15 ) ;
      $("#temperatureF").data('temperature', fTemp );
      $("#temperatureC").data('temperature', cTemp);

      if ( useFahren) {
        $(".temperature").html(fTemp);
        $("#temperatureUnit").html("F");
        celciusSelected = false;
      }
      else if (!useFahren) {
        $(".temperature").html( cTemp);
        $("#temperatureUnit").html("C");
        celciusSelected = true;
      }
    }
  }

  //Display wind speed, direction and direction arrow.
  function displayWind(wind, country) {

    if ( wind.speed !== "undefined") {
      var unitSystem = getMeasurementSystem(country);
      if (unitSystem === "metric") {
        $(".windspeed").html(wind.speed + " m/s");
      }
      else if (unitSystem === "imperial") {
        $(".windspeed").html(wind.speed / 0.44704 + " mph");
      }
    }

    if (wind.deg !== "undefined") {
      $(".windDir").html(  getWindDirection(wind.deg));
      $(".arrow-up").css({'transform' : 'rotate('+ (wind.deg) +'deg)'});
    }
  }
  //Convert wind direction degree to cardinal direction
  function getWindDirection(windDirection) {
    var arr = ["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
    var val = Math.floor((windDirection / 22.5) + 0.5);
    return arr[(val % 16)];
  }

  function getMeasurementSystem(country) {
    var imperialUnitCountries = ["US","LR","MM"];

    if ($.inArray(country, imperialUnitCountries )  >= 0 ) {
      return "imperial";
    }
    else return "metric";
  }

  function usesFahrenheit(country) {
    var fahrenheitCountries = ["US","BS","BZ", "KY", "PW"];

    if($.inArray(country, fahrenheitCountries ) >= 0) {
      return true;
    }
    else return false;
  }

  //Handle toggle beteween Celcius/fahrenheit.
  //Gray out current option in use.
  function toggleTemperature() {
    if (celciusSelected) {
      celciusSelected = false;
      $("#temperatureC").removeClass( "not-active" );
      $("#temperatureF").addClass( "not-active" );
      var fData = $('#temperatureF').data('temperature');
      $(".temperature").html(fData);
      $("#temperatureUnit").html("F");
    }
    else {
      celciusSelected = true;
      $("#temperatureF").removeClass( "not-active" );
      $("#temperatureC").addClass( "not-active" );
      var cData = $('#temperatureC').data('temperature');
      $(".temperature").html(cData);
      $("#temperatureUnit").html("C");
    }
  }

})();