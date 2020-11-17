
[![npm](https://ico.y.gy/npm/dm/@firstdorsal/powerdns-api?style=flat-square&logo=npm)](https://www.npmjs.com/package/@firstdorsal/powerdns-api)
[![NPM](https://ico.y.gy/npm/l/@firstdorsal/powerdns-api?style=flat-square)](https://www.npmjs.com/package/@firstdorsal/powerdns-api)
[![Snyk Vulnerabilities for npm package](https://ico.y.gy/snyk/vulnerabilities/npm/@firstdorsal/powerdns-api?style=flat-square&logo=snyk)](https://snyk.io/test/npm/@firstdorsal/powerdns-api)
[![Website](https://ico.y.gy/website?down_color=red&down_message=offline&label=documentation&up_color=success&up_message=online&url=https%3A%2F%2Fdoc.y.gy%2Fpowerdns-api&style=flat-square)](https://doc.y.gy/powerdns-api/)
[![Website](https://ico.y.gy/website?down_color=red&down_message=offline&label=repository&up_color=success&up_message=online&url=https%3A%2F%2Fgit.y.gy%2Ffirstdorsal%2Fpowerdns-api&style=flat-square&logo=gitlab)](https://git.y.gy/firstdorsal/powerdns-api/)

# Install
```
npm i @firstdorsal/powerdns-api
```
# Usage
```js
(async () => {
    //get enviroment variables from the .env file
    require('dotenv').config();
    //import the module
    const {
        PowerdnsClient
    } = require('@firstdorsal/powerdns-api');
    //create a powerdns client object 
    const pdns = new PowerdnsClient(process.env.PDNS_API_ENDPOINT, process.env.PDNS_API_KEY);
    //use a function and return the results to console
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
**[Here](https://doc.y.gy/powerdns-api/)**

# Need help or missing a feature?
Feel free to contact me via [xl9jthv_7bvgakv9o9wg0jabn2ylm91xxrzzgt0e@y.gy](mailto:xl9jthv_7bvgakv9o9wg0jabn2ylm91xxrzzgt0e@y.gy) in english or german

## Automatic Let's Encrypt certificates via DNS with greenlock and PDNS
[acme-dns-01-powerdns](https://www.npmjs.com/package/acme-dns-01-powerdns)

## PDNS WEB API Documentation
[On the Web](https://doc.powerdns.com/authoritative/http-api/index.html)

[And in full detail (Swagger)](https://raw.githubusercontent.com/PowerDNS/pdns/master/docs/http-api/swagger/authoritative-api-swagger.yaml)

## Links
[NPM](https://www.npmjs.com/package/@firstdorsal/powerdns-api)

[Documentation](https://doc.y.gy/powerdns-api/)

[Code](https://git.y.gy/firstdorsal/powerdns-api)

