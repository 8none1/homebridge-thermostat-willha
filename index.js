/*
{
    "bridge": {
    	...
    },
    
    "description": "...",

    "accessories": [
        {
            "accessory": "Thermostat",
            "name": "Thermostat Demo",
            "aSetting": "Hello"
        }
    ],

    "platforms":[]
}

*/


var Service, Characteristic;
var request = require("request");

module.exports = function(homebridge){
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-thermostat-willha", "Thermostat-willha", Thermostat);
}


function Thermostat(log, config) {
	this.log = log;

    this.ipaddr = config["ipaddress"] || "";
	this.name = config["name"];
	this.username = config["username"] || "";
	this.password = config["password"] || "";
	this.get_current_temp_url = config["get_current_temp_url"];
	this.set_target_temp_url = config["set_target_url"];
	this.get_heatcool_state_url = config["get_heatcool_state_url"];
	this.set_heatcool_state_url = config["set_heatcool_state_url"] | "";
	this.sendimmediately = config["send_immediately"] || "";
	//this.log(this);

	//Characteristic.TemperatureDisplayUnits.CELSIUS = 0;
	//Characteristic.TemperatureDisplayUnits.FAHRENHEIT = 1;
	this.temperatureDisplayUnits = Characteristic.TemperatureDisplayUnits.CELSIUS;
	//////this.temperature = 19;
	//this.relativeHumidity = 0.70;
	// The value property of CurrentHeatingCoolingState must be one of the following:
	//Characteristic.CurrentHeatingCoolingState.OFF = 0;
	//Characteristic.CurrentHeatingCoolingState.HEAT = 1;
	//Characteristic.CurrentHeatingCoolingState.COOL = 2;
	/////////////////this.heatingCoolingState = Characteristic.CurrentHeatingCoolingState.OFF;
	/////////////////this.targetTemperature = 21;
	//this.targetRelativeHumidity = 0.5;
	//this.heatingThresholdTemperature = 22;
	//this.coolingThresholdTemperature = 19;
	// The value property of TargetHeatingCoolingState must be one of the following:
	//Characteristic.TargetHeatingCoolingState.OFF = 0;
	//Characteristic.TargetHeatingCoolingState.HEAT = 1;
	//Characteristic.TargetHeatingCoolingState.COOL = 2;
	//Characteristic.TargetHeatingCoolingState.AUTO = 3;
	////////////////this.targetHeatingCoolingState = Characteristic.TargetHeatingCoolingState.AUTO;
}

Thermostat.prototype = {
	httpRequest: function(url, body, method, username, password, sendimmediately, callback) {
		request({
				url: url,
				body: body,
				method: method,
				auth: {
					user: username,
					pass: password,
					sendImmediately: sendimmediately
				}
			},
			function(error, response, body) {
				callback(error, response, body)
			})
	},
	//Start
	identify: function(callback) {
		this.log("Identify requested!");
		callback(null);
	},
	// Required
	getCurrentHeatingCoolingState: function(callback) {
	    if (!this.get_heatcool_state_url) {callback(null);}
	    var url = this.get_heatcool_state_url;
	    this.httpRequest(url, '', 'GET', this.username, this.password, this.sendimmediately, function(error, response, responseBody) {
	      if (error){
	        this.log('Failed to get heat/cool state');
	        callback(error);
	      } else {
	        var a = JSON.parse(responseBody);
	        // Off = 0, heat = 1 (probably 'true'), cool = 2 (we don't do "cooling" in the UK, so we won't need to deal with it.  In theory a true or false response will match then.
	        // Should be able to get this from http://piwarmer/get/ch
	        heatCoolState = a['state'] ? 1:0;
	        this.log("Current heat/cool state is:  %s", heatCoolState);
	        callback(null, heatCoolState);
	      }
	    }.bind(this));
	},
	setTargetHeatingCoolingState: function(value, callback) {
	    // Don't know what to really do with this for now.  Maybe setting state to "heat" could switch the heating on.  Will leave this as mock for now.
		this.log("setTargetHeatingCoolingState from/to:", this.targetHeatingCoolingState, value);
		this.targetHeatingCoolingState = value;
		callback();
	},
	getCurrentTemperature: function(callback) {
	  if (!this.get_current_temp_url) {callback(null);}
	  var url = this.get_current_temp_url;
	  this.httpRequest(url, '', 'GET', this.username, this.password, this.sendimmediately, function(error, response, responseBody) {
	    if(error){
	      this.log('Failed to get current temperature.');
	      callback(error);
	    } else {
	      var a = JSON.parse(responseBody);
	      currentTemp = a['currentTemp'];
	      this.log("Current temperature is: %s", currentTemp);
	      callback(null, currentTemp);
	    }
	  }.bind(this));
	},
	setTargetTemperature: function(value, callback) {
	  if(!this.set_target_temp_url) {callback(null);}
	  // 'http://thermopi/set/target'+'/value#
	  var url = this.set_target_temp_url+'/'+value;
	  this.log("Setting target temp via url:  %s",url);
	  this.httpRequest(url, '', 'POST', this.username, this.password, this.sendimmediately, function(error, response, responseBody) {
	    if(error){
	      this.log('Failed to set target temp.');
	      callback(error);
	    } else {
	      this.log("Set target temp to: %s", value);
	      callback();
	    }
	  }.bind(this));
	},
	getTemperatureDisplayUnits: function(callback) {
		this.log("getTemperatureDisplayUnits :", this.temperatureDisplayUnits);
		var error = null;
		callback(error, this.temperatureDisplayUnits);
	},

	// Optional
	/*getCurrentRelativeHumidity: function(callback) {
		this.log("getCurrentRelativeHumidity :", this.relativeHumidity);
		var error = null;
		callback(error, this.relativeHumidity);
	},
	setTargetRelativeHumidity: function(value, callback) {
		this.log("setTargetRelativeHumidity from/to :", this.targetRelativeHumidity, value);
		this.targetRelativeHumidity = value;
		callback();
	},
	getCoolingThresholdTemperature: function(callback) {
		this.log("getCoolingThresholdTemperature: ", this.coolingThresholdTemperature);
		var error = null;
		callback(error, this.coolingThresholdTemperature);
	},
	getHeatingThresholdTemperature: function(callback) {
		this.log("getHeatingThresholdTemperature :" , this.heatingThresholdTemperature);
		var error = null;
		callback(error, this.heatingThresholdTemperature);
	},
	getName: function(callback) {
		this.log("getName :", this.name);
		var error = null;
		callback(error, this.name);
	},*/

	getServices: function() {

		// you can OPTIONALLY create an information service if you wish to override
		// the default values for things like serial number, model, etc.
		var informationService = new Service.AccessoryInformation();

		informationService
			.setCharacteristic(Characteristic.Manufacturer, "Whizzy Labs")
			.setCharacteristic(Characteristic.Model, "Thermostat One")
			.setCharacteristic(Characteristic.SerialNumber, "0001");

			var thermostatService = new Service.Thermostat(this.name);

			// Required Characteristics
			thermostatService
				.getCharacteristic(Characteristic.CurrentHeatingCoolingState)
				.on('get', this.getCurrentHeatingCoolingState.bind(this));

			thermostatService
				.getCharacteristic(Characteristic.TargetHeatingCoolingState)
				.on('set', this.setTargetHeatingCoolingState.bind(this));

			thermostatService
				.getCharacteristic(Characteristic.CurrentTemperature)
				.on('get', this.getCurrentTemperature.bind(this));

			thermostatService
				.getCharacteristic(Characteristic.TargetTemperature)
				.on('set', this.setTargetTemperature.bind(this));

			thermostatService
				.getCharacteristic(Characteristic.TemperatureDisplayUnits)
				.on('get', this.getTemperatureDisplayUnits.bind(this));

			// Optional Characteristics
			
			/*thermostatService
				.getCharacteristic(Characteristic.CurrentRelativeHumidity)
				.on('get', this.getCurrentRelativeHumidity.bind(this));

			thermostatService
				.getCharacteristic(Characteristic.CurrentRelativeHumidity)
				.on('set', this.setTargetRelativeHumidity.bind(this));

			thermostatService
				.getCharacteristic(Characteristic.CoolingThresholdTemperature)
				.on('get', this.getCoolingThresholdTemperature.bind(this));

			thermostatService
				.getCharacteristic(Characteristic.CoolingThresholdTemperature)
				.on('get', this.getHeatingThresholdTemperature.bind(this));

			thermostatService
				.getCharacteristic(Characteristic.Name)
				.on('get', this.getName.bind(this));
		     */
			

			return [informationService, thermostatService];
		}
};
