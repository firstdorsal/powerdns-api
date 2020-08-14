## Modules

<dl>
<dt><a href="#module_powerdns-api">powerdns-api</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
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
        * [.getZoneWithMeta(zoneName)](#module_powerdns-api.PowerdnsClient+getZoneWithMeta) ⇒ <code>object</code>
        * [.getZone(zoneName)](#module_powerdns-api.PowerdnsClient+getZone) ⇒ <code>object</code>
        * [.setRecords(records)](#module_powerdns-api.PowerdnsClient+setRecords) ⇒ <code>boolean</code>
        * [.deleteRecords(records)](#module_powerdns-api.PowerdnsClient+deleteRecords) ⇒ <code>boolean</code>
        * [.search(search)](#module_powerdns-api.PowerdnsClient+search) ⇒ <code>object</code>
        * [.appendRecord(record)](#module_powerdns-api.PowerdnsClient+appendRecord) ⇒ <code>boolean</code>

<a name="module_powerdns-api.PowerdnsClient"></a>

### powerdns-api.PowerdnsClient
Class representing the powerdns client

**Kind**: static class of [<code>powerdns-api</code>](#module_powerdns-api)

* [.PowerdnsClient](#module_powerdns-api.PowerdnsClient)
    * [new module.exports.PowerdnsClient(baseurl, apikey)](#new_module_powerdns-api.PowerdnsClient_new)
    * [.getZones()](#module_powerdns-api.PowerdnsClient+getZones) ⇒ <code>Array</code>
    * [.getZoneWithMeta(zoneName)](#module_powerdns-api.PowerdnsClient+getZoneWithMeta) ⇒ <code>object</code>
    * [.getZone(zoneName)](#module_powerdns-api.PowerdnsClient+getZone) ⇒ <code>object</code>
    * [.setRecords(records)](#module_powerdns-api.PowerdnsClient+setRecords) ⇒ <code>boolean</code>
    * [.deleteRecords(records)](#module_powerdns-api.PowerdnsClient+deleteRecords) ⇒ <code>boolean</code>
    * [.search(search)](#module_powerdns-api.PowerdnsClient+search) ⇒ <code>object</code>
    * [.appendRecord(record)](#module_powerdns-api.PowerdnsClient+appendRecord) ⇒ <code>boolean</code>

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
        Powerdns
    } = require('powerdns-api');

    const pdns = new Powerdns(process.env.PDNS_API_ENDPOINT, process.env.PDNS_API_KEY);

    console.log(await pdns.getZone('example.com'));
})();
```
<a name="module_powerdns-api.PowerdnsClient+getZones"></a>

#### powerdnsClient.getZones() ⇒ <code>Array</code>
Returns array of zones on pdns server.

**Kind**: instance method of [<code>PowerdnsClient</code>](#module_powerdns-api.PowerdnsClient)
**Returns**: <code>Array</code> - - array of zones on the server
**Example**
```js
await pdns.getZones();
```
<a name="module_powerdns-api.PowerdnsClient+getZoneWithMeta"></a>

#### powerdnsClient.getZoneWithMeta(zoneName) ⇒ <code>object</code>
Returns single zone with meta information.

**Kind**: instance method of [<code>PowerdnsClient</code>](#module_powerdns-api.PowerdnsClient)
**Returns**: <code>object</code> - - the zone with meta information

| Param | Type | Description |
| --- | --- | --- |
| zoneName | <code>string</code> | takes a domain name |

**Example**
```js
await pdns.getZoneWithMeta();
```
<a name="module_powerdns-api.PowerdnsClient+getZone"></a>

#### powerdnsClient.getZone(zoneName) ⇒ <code>object</code>
Returns array with rrsets.

**Kind**: instance method of [<code>PowerdnsClient</code>](#module_powerdns-api.PowerdnsClient)
**Returns**: <code>object</code> - - just the rrsets of the zone

| Param | Type | Description |
| --- | --- | --- |
| zoneName | <code>string</code> | takes a domain name |

**Example**
```js
await pdns.getZone('example.com');
```
<a name="module_powerdns-api.PowerdnsClient+setRecords"></a>

#### powerdnsClient.setRecords(records) ⇒ <code>boolean</code>
Takes records as array and sets them. If records exist it replaces them.

**Kind**: instance method of [<code>PowerdnsClient</code>](#module_powerdns-api.PowerdnsClient)
**Returns**: <code>boolean</code> - - boolean indicating the success of the operation

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
       }]);
```
<a name="module_powerdns-api.PowerdnsClient+deleteRecords"></a>

#### powerdnsClient.deleteRecords(records) ⇒ <code>boolean</code>
Takes records as array and deletes them.

**Kind**: instance method of [<code>PowerdnsClient</code>](#module_powerdns-api.PowerdnsClient)
**Returns**: <code>boolean</code> - - boolean indicating the success of the operation

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
takes object with query as string; searches for elements in pdns server; returns found elements as array; if max is not specified it defaults to 10 returned records; if object_type is not defined it defaults to the type "record"; must be awaited;

**Kind**: instance method of [<code>PowerdnsClient</code>](#module_powerdns-api.PowerdnsClient)
**Returns**: <code>object</code> - - search results

| Param | Type | Description |
| --- | --- | --- |
| search | [<code>Search</code>](#Search) | object with the query paramter |

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
**Returns**: <code>boolean</code> - - boolean indicating the success of the operation

| Param | Type | Description |
| --- | --- | --- |
| record | [<code>Record</code>](#Record) | array containing the records to be deleted |

**Example**
```js
await pdns.appendRecord({
           name: "example.com",
           type: "A",
           ttl: 300,
           content: ['1.1.1.1','2.2.2.2']
       });
```
<a name="Search"></a>

## Search : <code>object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| query | <code>string</code> |  | query to search for |
| [max] | <code>number</code> | <code>10</code> | limits the ammount of returned values |
| [object_type] | <code>string</code> | <code>&quot;record&quot;</code> | for what kind of pdns object to search |

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

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | key name of the record |
| type | <code>string</code> | type of the record |
| ttl | <code>number</code> | time to live of the record |
| content | <code>Array</code> | value array with content of the record |

**Example**
```js
{name: "example.com", type: "A", ttl: 300, content: ['1.1.1.1', '8.8.8.8']}
```