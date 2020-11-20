# Postkutsche
<img draggable="none" src="https://git.y.gy/firstdorsal/powerdns-api/-/raw/master/logo.jpg" style="float:left; margin-right:10px;" height="100"> 

## A Nodejs client for the PowerDns API with the most relevant functions.

[![npm](https://ico.y.gy/npm/dm/@firstdorsal/powerdns-api?style=flat-square&logo=npm)](https://www.npmjs.com/package/@firstdorsal/powerdns-api)
[![NPM](https://ico.y.gy/npm/l/@firstdorsal/powerdns-api?style=flat-square&color=brightgreen)](https://www.npmjs.com/package/@firstdorsal/powerdns-api)
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

## Modules

<dl>
<dt><a href="#module_powerdns-api">powerdns-api</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Cryptokey">Cryptokey</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Search">Search</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Records">Records</a> : <code><a href="#Record">Array.&lt;Record&gt;</a></code></dt>
<dd></dd>
<dt><a href="#Record">Record</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="module_powerdns-api"></a>

## powerdns-api

* [powerdns-api](#module_powerdns-api)
    * [.PowerdnsClient](#module_powerdns-api.PowerdnsClient)
        * [new module.exports.PowerdnsClient(baseurl, apikey)](#new_module_powerdns-api.PowerdnsClient_new)
        * [.getZones()](#module_powerdns-api.PowerdnsClient+getZones) ⇒ <code>Array</code>
        * [.createZone(zoneName, [kind])](#module_powerdns-api.PowerdnsClient+createZone) ⇒ <code>Object</code>
        * [.getZoneWithMeta(zoneName)](#module_powerdns-api.PowerdnsClient+getZoneWithMeta) ⇒ <code>object</code>
        * [.getZone(zoneName)](#module_powerdns-api.PowerdnsClient+getZone) ⇒ <code>object</code>
        * [.deleteZone(zoneName)](#module_powerdns-api.PowerdnsClient+deleteZone) ⇒ <code>boolean</code>
        * [.setHomogeneousRecords(records)](#module_powerdns-api.PowerdnsClient+setHomogeneousRecords) ⇒ <code>boolean</code>
        * [.deleteRecords(records)](#module_powerdns-api.PowerdnsClient+deleteRecords) ⇒ <code>boolean</code>
        * [.search(search)](#module_powerdns-api.PowerdnsClient+search) ⇒ <code>object</code>
        * [.appendRecord(record)](#module_powerdns-api.PowerdnsClient+appendRecord) ⇒ <code>boolean</code>
        * [.createCryptokey(zoneName, [cryptokey], [returnPrivateKey])](#module_powerdns-api.PowerdnsClient+createCryptokey) ⇒ <code>Object</code>
        * [.setRecords(records)](#module_powerdns-api.PowerdnsClient+setRecords) ⇒ <code>Array</code>
        * [.replaceRecords(find, replace, zone)](#module_powerdns-api.PowerdnsClient+replaceRecords) ⇒ <code>Number</code>
        * [.replaceRecordsGlobal(find, replace)](#module_powerdns-api.PowerdnsClient+replaceRecordsGlobal) ⇒ <code>Number</code>
        * [.findRecords(find, zone)](#module_powerdns-api.PowerdnsClient+findRecords) ⇒ <code>Array</code>
        * [.findRecordsGlobal(find)](#module_powerdns-api.PowerdnsClient+findRecordsGlobal) ⇒ <code>Array</code>
        * [.createAndSetupZone(zone)](#module_powerdns-api.PowerdnsClient+createAndSetupZone) ⇒ <code>Boolean</code>

<a name="module_powerdns-api.PowerdnsClient"></a>

### powerdns-api.PowerdnsClient
Class representing the powerdns client

**Kind**: static class of [<code>powerdns-api</code>](#module_powerdns-api)  

* [.PowerdnsClient](#module_powerdns-api.PowerdnsClient)
    * [new module.exports.PowerdnsClient(baseurl, apikey)](#new_module_powerdns-api.PowerdnsClient_new)
    * [.getZones()](#module_powerdns-api.PowerdnsClient+getZones) ⇒ <code>Array</code>
    * [.createZone(zoneName, [kind])](#module_powerdns-api.PowerdnsClient+createZone) ⇒ <code>Object</code>
    * [.getZoneWithMeta(zoneName)](#module_powerdns-api.PowerdnsClient+getZoneWithMeta) ⇒ <code>object</code>
    * [.getZone(zoneName)](#module_powerdns-api.PowerdnsClient+getZone) ⇒ <code>object</code>
    * [.deleteZone(zoneName)](#module_powerdns-api.PowerdnsClient+deleteZone) ⇒ <code>boolean</code>
    * [.setHomogeneousRecords(records)](#module_powerdns-api.PowerdnsClient+setHomogeneousRecords) ⇒ <code>boolean</code>
    * [.deleteRecords(records)](#module_powerdns-api.PowerdnsClient+deleteRecords) ⇒ <code>boolean</code>
    * [.search(search)](#module_powerdns-api.PowerdnsClient+search) ⇒ <code>object</code>
    * [.appendRecord(record)](#module_powerdns-api.PowerdnsClient+appendRecord) ⇒ <code>boolean</code>
    * [.createCryptokey(zoneName, [cryptokey], [returnPrivateKey])](#module_powerdns-api.PowerdnsClient+createCryptokey) ⇒ <code>Object</code>
    * [.setRecords(records)](#module_powerdns-api.PowerdnsClient+setRecords) ⇒ <code>Array</code>
    * [.replaceRecords(find, replace, zone)](#module_powerdns-api.PowerdnsClient+replaceRecords) ⇒ <code>Number</code>
    * [.replaceRecordsGlobal(find, replace)](#module_powerdns-api.PowerdnsClient+replaceRecordsGlobal) ⇒ <code>Number</code>
    * [.findRecords(find, zone)](#module_powerdns-api.PowerdnsClient+findRecords) ⇒ <code>Array</code>
    * [.findRecordsGlobal(find)](#module_powerdns-api.PowerdnsClient+findRecordsGlobal) ⇒ <code>Array</code>
    * [.createAndSetupZone(zone)](#module_powerdns-api.PowerdnsClient+createAndSetupZone) ⇒ <code>Boolean</code>

<a name="new_module_powerdns-api.PowerdnsClient_new"></a>

#### new module.exports.PowerdnsClient(baseurl, apikey)
Create a powerdns client.


| Param | Type | Description |
| --- | --- | --- |
| baseurl | <code>string</code> | The base url where the api can be found |
| apikey | <code>string</code> | The api key for the powerdns endpoint |

**Example**  
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
<a name="module_powerdns-api.PowerdnsClient+getZones"></a>

#### powerdnsClient.getZones() ⇒ <code>Array</code>
Returns array of all zones from this pdns server.

**Kind**: instance method of [<code>PowerdnsClient</code>](#module_powerdns-api.PowerdnsClient)  
**Returns**: <code>Array</code> - array of zones  
**Example**  
```js
await pdns.getZones();
```
<a name="module_powerdns-api.PowerdnsClient+createZone"></a>

#### powerdnsClient.createZone(zoneName, [kind]) ⇒ <code>Object</code>
Creates zone/domain and returns its SOA record on success.

**Kind**: instance method of [<code>PowerdnsClient</code>](#module_powerdns-api.PowerdnsClient)  
**Returns**: <code>Object</code> - just the rrsets of the zone  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| zoneName | <code>string</code> |  | takes a domain name |
| [kind] | <code>&#x27;Native&#x27;</code> \| <code>&#x27;Master&#x27;</code> \| <code>&#x27;Slave&#x27;</code> | <code>Native</code> | takes the kind of zone you want |

**Example**  
```js
await pdns.createZone('example.com');
```
<a name="module_powerdns-api.PowerdnsClient+getZoneWithMeta"></a>

#### powerdnsClient.getZoneWithMeta(zoneName) ⇒ <code>object</code>
Returns single zone with meta information.

**Kind**: instance method of [<code>PowerdnsClient</code>](#module_powerdns-api.PowerdnsClient)  
**Returns**: <code>object</code> - the zone with meta information  

| Param | Type | Description |
| --- | --- | --- |
| zoneName | <code>string</code> | takes a domain name |

**Example**  
```js
await pdns.getZoneWithMeta('example.com');
```
<a name="module_powerdns-api.PowerdnsClient+getZone"></a>

#### powerdnsClient.getZone(zoneName) ⇒ <code>object</code>
Returns array with rrsets for zone.

**Kind**: instance method of [<code>PowerdnsClient</code>](#module_powerdns-api.PowerdnsClient)  
**Returns**: <code>object</code> - just the rrsets of the zone  

| Param | Type | Description |
| --- | --- | --- |
| zoneName | <code>string</code> | takes a domain name |

**Example**  
```js
await pdns.getZone('example.com');
```
<a name="module_powerdns-api.PowerdnsClient+deleteZone"></a>

#### powerdnsClient.deleteZone(zoneName) ⇒ <code>boolean</code>
Deletes the whole zone with all attached metadata and rrsets.

**Kind**: instance method of [<code>PowerdnsClient</code>](#module_powerdns-api.PowerdnsClient)  
**Returns**: <code>boolean</code> - true on success  

| Param | Type | Description |
| --- | --- | --- |
| zoneName | <code>string</code> | takes a domain name |

**Example**  
```js
await pdns.deleteZone('example.com');
```
<a name="module_powerdns-api.PowerdnsClient+setHomogeneousRecords"></a>

#### powerdnsClient.setHomogeneousRecords(records) ⇒ <code>boolean</code>
Takes records for a SINGLE domain as array and sets them. If records exist it replaces them.

**Kind**: instance method of [<code>PowerdnsClient</code>](#module_powerdns-api.PowerdnsClient)  
**Returns**: <code>boolean</code> - boolean indicating the success of the operation  

| Param | Type | Description |
| --- | --- | --- |
| records | [<code>Records</code>](#Records) | array containing the records |

**Example**  
```js
await pdns.setHomogeneousRecords([{
           name: "example.com",
           type: "A",
           ttl: 300,
           content: ['1.1.1.1']
       }]);
```
<a name="module_powerdns-api.PowerdnsClient+deleteRecords"></a>

#### powerdnsClient.deleteRecords(records) ⇒ <code>boolean</code>
Takes records as array and deletes them.

**Kind**: instance method of [<code>PowerdnsClient</code>](#module_powerdns-api.PowerdnsClient)  
**Returns**: <code>boolean</code> - boolean indicating the success of the operation  

| Param | Type | Description |
| --- | --- | --- |
| records | [<code>Records</code>](#Records) | array containing the records to be deleted |

**Example**  
```js
await pdns.deleteRecords([{
           name: "example.com",
           type: "A"
       }]);
```
<a name="module_powerdns-api.PowerdnsClient+search"></a>

#### powerdnsClient.search(search) ⇒ <code>object</code>
Takes Search object and searches for matching elements in the pdns server.

**Kind**: instance method of [<code>PowerdnsClient</code>](#module_powerdns-api.PowerdnsClient)  
**Returns**: <code>object</code> - search results  

| Param | Type | Description |
| --- | --- | --- |
| search | [<code>Search</code>](#Search) | object with the query paramters |

**Example**  
```js
await pdns.search({
           query: 'example.com',
           max: 100,
           object_type: "zone"
       });
```
<a name="module_powerdns-api.PowerdnsClient+appendRecord"></a>

#### powerdnsClient.appendRecord(record) ⇒ <code>boolean</code>
Takes ONE record as object and appends it not replacing other records with the same name.

**Kind**: instance method of [<code>PowerdnsClient</code>](#module_powerdns-api.PowerdnsClient)  
**Returns**: <code>boolean</code> - boolean indicating the success of the operation  

| Param | Type | Description |
| --- | --- | --- |
| record | [<code>Record</code>](#Record) | array containing the records to be appended |

**Example**  
```js
await pdns.appendRecord({
           name: "example.com",
           type: "A",
           ttl: 300,
           content: ['1.1.1.1','2.2.2.2']
       });
```
<a name="module_powerdns-api.PowerdnsClient+createCryptokey"></a>

#### powerdnsClient.createCryptokey(zoneName, [cryptokey], [returnPrivateKey]) ⇒ <code>Object</code>
Creates a DNS Cryptokey and enables it for DNSSEC. If you want to import your own please read the original [documentation](https://doc.powerdns.com/authoritative/http-api/cryptokey.html) and put it in the Cryptokey parameter.

**Kind**: instance method of [<code>PowerdnsClient</code>](#module_powerdns-api.PowerdnsClient)  
**Returns**: <code>Object</code> - on success the public key and info will be returned  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| zoneName | <code>string</code> |  | name of the zone/domain |
| [cryptokey] | [<code>Cryptokey</code>](#Cryptokey) | <code>{keytype: &quot;ksk&quot;, active: true}</code> | a Cryptokey |
| [returnPrivateKey] | <code>boolean</code> | <code>false</code> | setting to true returns the private key with the answer |

**Example**  
```js
await pdns.createCryptokey("example.com");
```
<a name="module_powerdns-api.PowerdnsClient+setRecords"></a>

#### powerdnsClient.setRecords(records) ⇒ <code>Array</code>
Takes records for single or mixed domains as array and sets them. If records exist it replaces them.

**Kind**: instance method of [<code>PowerdnsClient</code>](#module_powerdns-api.PowerdnsClient)  
**Returns**: <code>Array</code> - array of booleans indicating the success of each entry  

| Param | Type | Description |
| --- | --- | --- |
| records | [<code>Records</code>](#Records) | array containing the records |

**Example**  
```js
await pdns.setRecords([{
           name: "example.com",
           type: "A",
           ttl: 300,
           content: ['1.1.1.1']
       },{
           name: "example.org",
           type: "A",
           ttl: 300,
           content: ['1.1.1.1']
       },{
           name: "example.me",
           type: "A",
           ttl: 300,
           content: ['1.1.1.1','2.2.2.2.']
       }]);
```
<a name="module_powerdns-api.PowerdnsClient+replaceRecords"></a>

#### powerdnsClient.replaceRecords(find, replace, zone) ⇒ <code>Number</code>
Searches for records in a zone by comparing the RECORDS field NOT the name field. Replaces the found records with the replace string.

**Kind**: instance method of [<code>PowerdnsClient</code>](#module_powerdns-api.PowerdnsClient)  
**Returns**: <code>Number</code> - number of replaced entries  

| Param | Type | Description |
| --- | --- | --- |
| find | <code>String</code> | string to search for |
| replace | <code>String</code> | string to replace the find string with |
| zone | <code>String</code> | zone to search through |

**Example**  
```js
await pdns.replaceRecords('1.1.1.1','2.2.2.2','example.com');
```
<a name="module_powerdns-api.PowerdnsClient+replaceRecordsGlobal"></a>

#### powerdnsClient.replaceRecordsGlobal(find, replace) ⇒ <code>Number</code>
Searches for records on the pdns server by comparing the RECORDS field NOT the name field. Replaces the found records with the replace string.

**Kind**: instance method of [<code>PowerdnsClient</code>](#module_powerdns-api.PowerdnsClient)  
**Returns**: <code>Number</code> - number of replaced entries  

| Param | Type | Description |
| --- | --- | --- |
| find | <code>String</code> | string to search for |
| replace | <code>String</code> | string to replace the find string with |

**Example**  
```js
await pdns.replaceRecordsGlobal('1.1.1.1','2.2.2.2');
```
<a name="module_powerdns-api.PowerdnsClient+findRecords"></a>

#### powerdnsClient.findRecords(find, zone) ⇒ <code>Array</code>
Searches for records in a zone by comparing the RECORDS field NOT the name field

**Kind**: instance method of [<code>PowerdnsClient</code>](#module_powerdns-api.PowerdnsClient)  
**Returns**: <code>Array</code> - records matching the find string in the content field  

| Param | Type | Description |
| --- | --- | --- |
| find | <code>String</code> | string to search for |
| zone | <code>String</code> | zone to search through |

**Example**  
```js
await pdns.findRecords('1.1.1.1', 'example.com');
```
<a name="module_powerdns-api.PowerdnsClient+findRecordsGlobal"></a>

#### powerdnsClient.findRecordsGlobal(find) ⇒ <code>Array</code>
Searches for records on the pdns server by comparing the RECORDS field NOT the name field

**Kind**: instance method of [<code>PowerdnsClient</code>](#module_powerdns-api.PowerdnsClient)  
**Returns**: <code>Array</code> - records matching the find string in the content field  

| Param | Type | Description |
| --- | --- | --- |
| find | <code>String</code> | string to search for |

**Example**  
```js
await pdns.findRecordsGlobal('1.1.1.1');
```
<a name="module_powerdns-api.PowerdnsClient+createAndSetupZone"></a>

#### powerdnsClient.createAndSetupZone(zone) ⇒ <code>Boolean</code>
Higher level function for creating a zone with a custom soa record, name servers and dnssec

**Kind**: instance method of [<code>PowerdnsClient</code>](#module_powerdns-api.PowerdnsClient)  
**Returns**: <code>Boolean</code> - success on true  

| Param | Type | Description |
| --- | --- | --- |
| zone | <code>Object</code> | string to search for |

**Example**  
```js
await pdns.createAndSetupZone({
             domain: 'example.com',
             nameserver: ['ns1.paulisttoll.somedomain', 'ns2.paulisttoll.somedomain', 'ns3.paulisttoll.somedomain'],
             hostmasterEmail:'hostmaster@paulisttoll.somedomain',
        
    })
```
<a name="Cryptokey"></a>

## Cryptokey : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| keytype | <code>&#x27;ksk&#x27;</code> \| <code>&#x27;zsk&#x27;</code> \| <code>&#x27;csk&#x27;</code> | The type of the key possible values are |
| active | <code>boolean</code> | Whether or not the key is in active use |
| published | <code>boolean</code> | Whether or not the DNSKEY record is published in the zone |
| dnskey | <code>string</code> | The DNSKEY record for this key |
| privatekey | <code>string</code> | The private key in ISC format |
| algorithm | <code>string</code> | The name of the algorithm of the key, should be a mnemonic |

<a name="Search"></a>

## Search : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| query | <code>string</code> |  | query to search for |
| [max] | <code>number</code> | <code>10</code> | limits the ammount of returned values |
| [object_type] | <code>&#x27;all&#x27;</code> \| <code>&#x27;zone&#x27;</code> \| <code>&#x27;record&#x27;</code> \| <code>&#x27;comment&#x27;</code> | <code>record</code> | for what kind of pdns object to search |

**Example**  
```js
{query: 'example.com', max: 100, object_type: "zone"}
```
<a name="Records"></a>

## Records : [<code>Array.&lt;Record&gt;</code>](#Record)
**Kind**: global typedef  
**Example**  
```js
[{
    name: "example.com",
    type: "A",
    ttl: 300,
    content: ['1.1.1.1', '8.8.8.8']
}, {
    name: "*.example.com",
    type: "A",
    ttl: 300,
    content: ['1.1.1.1', '8.8.8.8']
}]
```
<a name="Record"></a>

## Record : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | key name of the record |
| [type] | <code>string</code> | <code>&quot;&#x27;A&#x27;&quot;</code> | type of the record |
| [ttl] | <code>number</code> | <code>3600</code> | time to live of the record |
| content | <code>Array</code> |  | value array with content of the record |

**Example**  
```js
{name: "example.com", type: "A", ttl: 300, content: ['1.1.1.1', '8.8.8.8']}
```
