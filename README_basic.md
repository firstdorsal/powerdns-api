# Install
```
npm i @firstdorsal/powerdns-api
```
# Usage
```js
(async () => {
    require('dotenv').config();

    const {
        PowerdnsClient
    } = require('@firstdorsal/powerdns-api');

    const pdns = new PowerdnsClient(process.env.PDNS_API_ENDPOINT, process.env.PDNS_API_KEY);

    console.log(await pdns.getZone('example.com'));
})();

```
## What is dotenv?
The line "require('dotenv').config();" gets the contents of a file called ".env" in which you should store your global and secret variables.

**1. Install the module "dotenv" with**
```
npm i dotenv
```
**2. Create a file named ".env" in your applications root directory**

*.env*
```c
PDNS_API_KEY='YOUR PDNS API KEY'
PDNS_API_ENDPOINT='https://example.com/api/v1/servers/localhost'
```
**3. Use your secret variables**
```
process.env.PDNS_API_ENDPOINT
process.env.PDNS_API_KEY
```


# Documentation
**[Documentation](https://firstdorsal.eu/doc/powerdns-api/)**