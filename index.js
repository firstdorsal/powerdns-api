'use strict';
const f = require("node-fetch")
const r = require("request-promise");



/** 
 * @typedef Cryptokey
 * @type {object}      
 * @prop {'ksk'|'zsk'|'csk'} keytype The type of the key possible values are 
 * @prop {boolean} active Whether or not the key is in active use      
 * @prop {boolean} published Whether or not the DNSKEY record is published in the zone      
 * @prop {string} dnskey The DNSKEY record for this key      
 * @prop {string} privatekey The private key in ISC format      
 * @prop {string} algorithm The name of the algorithm of the key, should be a mnemonic
 */


/** 
 * @typedef Search
 * @type {object}
 * @prop {string} query query to search for
 * @prop {number} [max=10] limits the ammount of returned values
 * @prop {'all'|'zone'|'record'|'comment'} [object_type=record] for what kind of pdns object to search
 * @example
 * {query: 'example.com', max: 100, object_type: "zone"}
 */

/** 
 * @typedef Records
 * @type {Array.<Record>}
 * @example
 * [{
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
 */

/**
 * @typedef Record
 * @type {object}
 * @prop {string} name key name of the record
 * @prop {string} type type of the record
 * @prop {number} ttl time to live of the record
 * @prop {Array} content value array with content of the record
 * @example
 * {name: "example.com", type: "A", ttl: 300, content: ['1.1.1.1', '8.8.8.8']}
 *
 */

/** @module powerdns-api */
/** @class Class representing the powerdns client 
*@example 
(async () => {
    require('dotenv').config();

    const {
        PowerdnsClient
    } = require('@firstdorsal/powerdns-api');

    const pdns = new PowerdnsClient(process.env.PDNS_API_ENDPOINT, process.env.PDNS_API_KEY);

    console.log(await pdns.getZone('example.com'));
})();
*/

module.exports.PowerdnsClient = class {
    /**
     * Create a powerdns client.
     * @constructor
     * @param {string} baseurl The base url where the api can be found
     * @param {string} apikey The api key for the powerdns endpoint
     */
    constructor(baseurl, apikey) {
        this.baseurl = baseurl;
        this.apikey = apikey;
    }



    /**
     * Takes domain name as string. Returns the domain name as string in absolute form with a . at the end. example.com -> example.com. and example.com. -> example.com.
     * @private
     * @param {string} name takes a domain name
     * @returns {string} the domain name in absolute form ending with a dot
     */
    absoluteName(name) {
        if (name[name.length - 1] !== '.') return name + '.';
        return name;
    }
    /**
     * Returns array of all zones on pdns server.
     * @async
     * @returns {Array} array of zones on the server
     * @example 
       await pdns.getZones();
     */
    getZones() {
        return f(this.baseurl + '/zones', {
            method: 'GET',
            headers: {
                'X-Api-Key': this.apikey
            },
            json: true
        }).then((res) => {
            return res.json();
        });
    }

    /**
     * Creates zone/domain and returns its SOA record on success.

     * @async
     * @param {string} zoneName takes a domain name
     * @param {('Native'|'Master'|'Slave')} [kind=Native] takes the kind of zone you want
     * @returns {Object} just the rrsets of the zone
     * @example 
       await pdns.createZone('example.com');
     */
    createZone(zoneName, kind = 'Native') {
        const dname = this.absoluteName(zoneName);
        const zoneNameSan = dname.substr(0, dname.length - 1).match(/[A-Za-z0-9]*\.[A-Za-z0-9]*$/)[0];
        return r(`${this.baseurl}/zones`, {
            method: 'post',
            headers: {
                'X-Api-Key': this.apikey
            },
            body: {
                name: zoneNameSan + '.',
                kind
            },
            json: true
        }).then((res) => {
            if (!res.rrsets) return false;
            return res.rrsets[0]
        }).catch((err) => {
            throw new Error(err.error.error);
        });
    }


    /**
     * Returns single zone with meta information. 
     * @async
     * @param {string} zoneName takes a domain name
     * @returns {object} the zone with meta information
     * @example 
       await pdns.getZoneWithMeta();
     */
    getZoneWithMeta(zoneName) {
        zoneName = this.absoluteName(zoneName);
        return f(this.baseurl + '/zones/' + zoneName, {
            method: 'GET',
            headers: {
                'X-Api-Key': this.apikey
            },
            json: true
        }).then((res) => {
            return res.json();
        });
    }
    /**
     * Returns array with rrsets for zone.
     * @async
     * @param {string} zoneName takes a domain name
     * @returns {object} just the rrsets of the zone
     * @example 
       await pdns.getZone('example.com');
     */
    getZone(zoneName) {
        const dname = this.absoluteName(zoneName);
        const zoneNameSan = dname.substr(0, dname.length - 1).match(/[A-Za-z0-9]*\.[A-Za-z0-9]*$/)[0];
        return f(this.baseurl + '/zones/' + zoneNameSan, {
            method: 'GET',
            headers: {
                'X-Api-Key': this.apikey
            },
            json: true
        }).then((res) => {
            return res.json().catch(() => {});
        }).then((json) => {
            if (json && json.rrsets) return json.rrsets;
            return null;
        });
    }



    /**
     * Deletes the whole zone with all attached metadata and rrsets.
     * @async
     * @param {string} zoneName takes a domain name
     * @returns {boolean} true on success
     * @example 
       await pdns.deleteZone('example.com');
     */
    deleteZone(zoneName) {
        const dname = this.absoluteName(zoneName);
        const zoneNameSan = dname.substr(0, dname.length - 1).match(/[A-Za-z0-9]*\.[A-Za-z0-9]*$/)[0];
        return r(this.baseurl + '/zones/' + zoneNameSan, {
            method: 'DELETE',
            headers: {
                'X-Api-Key': this.apikey
            },
            json: true
        }).then((res) => {
            if (res === undefined) return true;
        }).catch((err) => {
            throw new Error(err.error.error);
        })
    }

    /**
     * Takes records as array and sets them. If records exist it replaces them.
     * @async
     * @param {Records} records array containing the records
     * @returns {boolean} boolean indicating the success of the operation
     * @example 
       await pdns.setRecords([{
           name: "example.com",
           type: "A",
           ttl: 300,
           content: ['1.1.1.1']
       }]);
     */

    setRecords(records) {
        if (!Array.isArray(records)) throw new TypeError('Parameter must be of type array');

        const dname = this.absoluteName(records[0].name);
        const zoneName = dname.substr(0, dname.length - 1).match(/[A-Za-z0-9]*\.[A-Za-z0-9]*$/)[0];
        let rrsets = [];
        for (let i = 0; i < records.length; i++) {
            let recordsOut = [];
            for (let j = 0; j < records[i].content.length; j++) {
                recordsOut.push({
                    "content": records[i].content[j],
                    "disabled": false,
                    "ttl": records[i].ttl,
                    "name": this.absoluteName(records[i].name),
                    "type": records[i].type
                });
            }
            rrsets.push({
                "name": this.absoluteName(records[i].name),
                "type": records[i].type,
                "ttl": records[i].ttl,
                "changetype": "REPLACE",
                records: recordsOut
            });
        }
        return r(this.baseurl + '/zones/' + zoneName, {
            method: 'PATCH',
            headers: {
                'X-Api-Key': this.apikey
            },
            body: {
                rrsets
            },
            json: true
        }).then((res) => {
            if (res === undefined) return true;
            return false;

        }).catch((err) => {
            console.error(err);
            return false;
        });
    }




    /**
     * Takes records as array and deletes them.
     * @async
     * @param {Records} records array containing the records to be deleted
     * @returns {boolean} boolean indicating the success of the operation
     * @example
       await pdns.deleteRecords([{
           name: "example.com",
           type: "A"
       }]);
     */
    deleteRecords(records) {
        if (!Array.isArray(records)) throw new TypeError('Parameter must be of type array');
        const dname = this.absoluteName(records[0].name);
        const zoneName = dname.substr(0, dname.length - 1).match(/[A-Za-z0-9]*\.[A-Za-z0-9]*$/)[0];

        let rrsets = [];
        for (let i = 0; i < records.length; i++) {
            rrsets.push({
                "name": this.absoluteName(records[i].name),
                "type": records[i].type,
                "changetype": "DELETE",
            });
        }

        return r(this.baseurl + '/zones/' + zoneName, {
            method: 'PATCH',
            headers: {
                'X-Api-Key': this.apikey
            },
            body: {
                rrsets
            },
            json: true
        }).then((res) => {
            if (res === undefined) return true;
            return false;
        }).catch((err) => {
            console.error(err);
            return false;
        });
    }

    /**
     * Takes Search object and searches for matching elements in the pdns server.
     * @async
     * @param {Search} search object with the query paramter
     * @returns {object} search results
     * @example
       await pdns.search({
           query: 'example.com',
           max: 100,
           object_type: "zone"
       });
     */
    search(search = {}) {
        if (!search.max) search.max = 10;
        if (!search.object_type) search.object_type = 'record';
        if (!search.query) return null;
        return f(`${this.baseurl}/search-data?q=${search.query}&max=${search.max}&object_type=${search.object_type}`, {
            method: 'GET',
            headers: {
                'X-Api-Key': this.apikey
            },
            json: true
        }).then((res) => {
            return res.json().catch((err) => {
                console.log(err);
            });
        }).then((json) => {
            if (json) return json;
            return null;

        });
    }
    /**
     * Takes ONE record as object and appends it not replacing other records with the same name.
     * @async
     * @param {Record} record array containing the records to be deleted
     * @returns {boolean} boolean indicating the success of the operation
     * @example
       await pdns.appendRecord({
           name: "example.com",
           type: "A",
           ttl: 300,
           content: ['1.1.1.1','2.2.2.2']
       });
     */
    async appendRecord(record) {
        const a = await this.search({
            query: record.name
        });
        if (a) {
            for (let i = 0; i < a.length; i++) {
                if (a[i] && a[i].type !== 'PTR') record.content.push(a[i].content);
            }
        }
        return await this.setRecords([record]);
    }


    /**
     * Creates a DNS Cryptokey and enables it for DNSSEC. If you want to import your own please read the original [documentation]{@link https://doc.powerdns.com/authoritative/http-api/cryptokey.html} and put it in the Cryptokey parameter.
     * @async
     * @param {string} zoneName name of the zone/domain 
     * @param {Cryptokey} [cryptokey={keytype: "ksk", active: true}] a Cryptokey
     * @param {boolean} [returnPrivateKey=false] setting to true returns the private key with the answer
     * @returns {Object} ob success the public key and info will be returned
     * @example
        await pdns.createCryptokey("example.com");

     */
    createCryptokey(zoneName, cryptokey = {
        keytype: "ksk",
        active: true
    }, returnPrivateKey = false) {
        if (!zoneName) throw new Error('Missing zone/domain name');
        if (!cryptokey.keytype) throw new Error('Missing keytype');

        const body = cryptokey;
        const dname = this.absoluteName(zoneName);
        const zoneNameSan = dname.substr(0, dname.length - 1).match(/[A-Za-z0-9]*\.[A-Za-z0-9]*$/)[0];
        return r(`${this.baseurl}/zones/${zoneNameSan}/cryptokeys`, {
            method: 'POST',
            headers: {
                'X-Api-Key': this.apikey
            },
            body,
            json: true
        }).then((res) => {
            if (returnPrivateKey) return res;
            delete res.privatekey;
            return res;
        })
    }
}