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
**[Documentation for THIS wrapper](https://firstdorsal.eu/doc/powerdns-api/)**

# Need help or missing a feature?
Feel free to contact me via [xl9jthv_7bvgakv9o9wg0jabn2ylm91xxrzzgt0e@firstdorsal.eu](mailto:xl9jthv_7bvgakv9o9wg0jabn2ylm91xxrzzgt0e@firstdorsal.eu) in english or german

## Automatic Let's Encrypt certificates via DNS with greenlock and PDNS
[acme-dns-01-powerdns](https://www.npmjs.com/package/acme-dns-01-powerdns)

## PDNS WEB API Documentation
[On the Web](https://doc.powerdns.com/authoritative/http-api/index.html)

[And in full detail (Swagger)](https://raw.githubusercontent.com/PowerDNS/pdns/master/docs/http-api/swagger/authoritative-api-swagger.yaml)
