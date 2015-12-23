# homebridge-thermostat-willha

Supports my thermostat device on HomeBridge Platform.
Forked from https://github.com/PJCzx/homebridge-thermostat - thanks!

This supports my homebrew thermostat which provides a JSON/REST interface to get/set the target temperature.

# Installation

1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g homebridge-thermostat
3. Update your configuration file. See sample-config.json in this repository for a sample. 

# Configuration

Configuration sample:

 ```
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
```
