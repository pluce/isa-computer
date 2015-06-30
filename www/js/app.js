// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('app', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.controller('AppCtrl',['$scope',
  function($scope){
    
    $scope.data = {};
    
    $scope.compute = function(){
      $scope.data = ISA($scope.data.altitude);
    }
    
  }]);
  
G = 9.80665;
R = 287.00;

var ISALib = {
  layers : [
      {
        baseAltitude : 0,
        topAltitude : 11000,
        baseTemperature: 288.15,
        basePressure: 101325,
        lapseRate: -0.0065
      },
      {
        baseAltitude : 11000,
        topAltitude : 20000,
        baseTemperature: 216.65,
        basePressure: 22625.79,
        lapseRate: 0
      },
      {
        baseAltitude : 20000,
        topAltitude : 32000,
        baseTemperature: 216.65,
        basePressure: 5471.9347,
        lapseRate: 0.001
      },
      {
        baseAltitude : 32000,
        topAltitude : 47000,
        baseTemperature: 228.65,
        basePressure: 867.2549,
        lapseRate: 0.0028
      },
      {
        baseAltitude : 47000,
        topAltitude : 51000,
        baseTemperature: 270.65,
        basePressure: 110.76656,
        lapseRate: 0
      },
      {
        baseAltitude : 51000,
        topAltitude : 71000,
        baseTemperature: 270.65,
        basePressure: 66.8483,
        lapseRate: -0.0028
      },
      {
        baseAltitude : 71000,
        topAltitude : 84852,
        baseTemperature: 214.65,
        basePressure: 3.949,
        lapseRate: -0.002
      }
    ],
  determineLayerAtAltitude: function(altitude){
    var layer = this.layers[0];
    var index = 0;
    while(layer.topAltitude < altitude && index < this.layers.length) {
      index++;
      layer = this.layers[index];
    }
    console.log(layer)
    return layer;
  },
  temperatureAtAltitude: function(layer,altitude){
    return layer.baseTemperature+(layer.lapseRate*(altitude-layer.baseAltitude));
  },
  pressionAtAltitude: function(layer,altitude){
    var t1 = this.temperatureAtAltitude(layer,altitude);
    if(layer.lapseRate !== 0) {
      return (Math.pow((t1/layer.baseTemperature),(-G/(layer.lapseRate*R))))*layer.basePressure;
    } else {
      return Math.exp((-G/(R*t1))*(altitude-layer.baseAltitude))*layer.basePressure;
    }
  },
  densityAtAltitude: function(layer,altitude){
    return this.pressionAtAltitude(layer,altitude)/(R*this.temperatureAtAltitude(layer,altitude));
  }
};

var ISA = function(altitude){
  altitude = Math.min(altitude,84852);
  var layer = ISALib.determineLayerAtAltitude(altitude)
  return {
    layer: layer,
    altitude: altitude,
    temperature: ISALib.temperatureAtAltitude(layer,altitude),
    pression: ISALib.pressionAtAltitude(layer,altitude),
    density: ISALib.densityAtAltitude(layer,altitude)
  }
}


