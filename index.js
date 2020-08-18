'use strict';
const f = require("node-fetch")
const r = require("request-promise");



/** 
 * @typedef Search
 * @type {object}
 * @prop {string} query query to search for
 * @prop {number} [max=10] limits the ammount of returned values
 * @prop {string} [object_type=record] for what kind of pdns object to search
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
     * Returns array of zones on pdns server.
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
     * Returns array with rrsets.
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
            return res.json().catch((err) => {});
        }).then((json) => {
            if (json && json.rrsets) return json.rrsets;
            return null;
        });
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
}