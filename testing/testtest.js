var express = require("express");
var request = require("ajax-request");

var app = express();
var port = process.env.PORT || 8080
app.listen(port, function(){
    console.log("Server listening on port " + port);
});

app.get("/", function(req, res){
  console.log("test test")
  res.send("hello!")
})

var APIKey = "f29cdafe21624061235bd7d34ec68e05"; // Openweathermap API key

var startCity = "Ithaca"
var startState = "NY"
var endCity = "Washington"
var endState = "DC"

let startCityName = `${startCity}, ${startState}`
let endCityName = `${endCity}, ${endState}`

var endpointsLatLon = [];

function initialWeatherMapsAPICall(startCityName, endCityName){
    var startQueryWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q="+ startCityName + "&appid=" + APIKey;
    var endQueryWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q="+ endCityName + "&appid=" + APIKey;
    
      request({
        url: startQueryWeatherURL,
        method: "GET"
      }, function (err, res, body){
        if (err){
          console.log(err)
        } else {
          // res.json(body)
          //console.log(res)
          console.log("start body: " + body)
          console.log("type of body: " + typeof body)
          // console.log("\nJSON body: " + JSON.stringify(body))
          // console.log("\nJSON parse: " + JSON.parse(body))
          var parsed = JSON.parse(body)
          console.log("start coord: " + parsed["coord"]["lat"])
          endpointsLatLon.push(parsed["coord"]["lat"])
          console.log("start coord: " + parsed["coord"]["lon"])
          endpointsLatLon.push(parsed["coord"]["lon"])
          console.log(endpointsLatLon)
         
          request({
            url: endQueryWeatherURL,
            method: "GET"
          }, function (err, res, body){
            console.log("end body" + body)
            var parsed = JSON.parse(body)
            console.log("start coord: " + parsed["coord"]["lat"])
            endpointsLatLon.push(parsed["coord"]["lat"])
            console.log("start coord: " + parsed["coord"]["lon"])
            endpointsLatLon.push(parsed["coord"]["lon"])
            console.log(endpointsLatLon)

            var startLat = endpointsLatLon[0];
            var startLon = endpointsLatLon[1];
            var endLat = endpointsLatLon[2];
            var endLon = endpointsLatLon[3];

            getDirections(startLat, startLon, endLat, endLon)
          })     
        }
      }
    )
}
    
    
  //   ).done(function(response) {
  //       console.log(`Start:
  //        ${response}`)
  //       //weatherMapsAPIResults(`Start: + response`);
  //       $.ajax({
  //           url: endQueryWeatherURL,
  //           method: "GET"
  //         }).done(function(response) {
  //           console.log(`Start:
  //           ${response}`)
  //       });
  //   });
  // };

var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyCI-Q45nsEkZDVBrp2I8NB2cTTqK_hhgrg'
  });

initialWeatherMapsAPICall(startCityName, endCityName)

var startLat = endpointsLatLon[0];
var startLon = endpointsLatLon[1];
var endLat = endpointsLatLon[2];
var endLon = endpointsLatLon[3];

function getDirections(startLat, startLon, endLat, endLon){
  console.log("Sanity check on google function")
  googleMapsClient.directions({
          origin: {
            lat: startLat, 
            lng: startLon
          },
          destination: {
            lat: endLat, 
            lng: endLon
          }
        }, function(err, response) {
          if (err) {
            console.log("error: " + err)
            console.log(JSON.stringify(err))
          }
          else {
            console.log(JSON.stringify(response.json));
            //console.log(JSON.stringify(response.json, null, 2));
            console.log(response.json.routes[0].legs[0].steps[0].end_location.lat);
          }
  });
}

// getDirections(startLat, startLon, endLat, endLon);
