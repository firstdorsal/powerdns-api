"use strict";
const f = require("node-fetch");
const secondLevelRegex = new RegExp(/[A-Z-a-z0-9]{1,63}\.[A-Z-a-z0-9]{1,63}$/);
/**
 * @typedef Cryptokey
 * @type {object}
 * @prop {'ksk'|'zsk'|'csk'} keytype The type of the key possible values are
 * @prop {boolean} active Whether or not the key is in active use
 * @prop {boolean} published Whether or not the DNSKEY record is published in the zone
 * @prop {string} dnskey The DNSKEY record for this key
 * @prop {string} privateKey The private key in ISC format
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
 * @prop {string} [type='A'] type of the record
 * @prop {number} [ttl=3600] time to live of the record
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
        if (typeof name !== "string") throw new TypeError("name must be of type string");
        if (name[name.length - 1] !== ".") return name + ".";
        return name;
    }

    /**
     * takes array of records and sorts its contents by name into multiple arrays
     * @private
     * @param {Array} records array of records
     * @returns {Array} array of arrays with records with the same name
     * */
    sortRecordsByDomainName(records) {
        if (!Array.isArray(records)) throw new TypeError("records must be of type array");
        const result = [];
        for (let i = 0; i < records.length; i++) {
            let p = false;
            for (let j = 0; j < result.length; j++) {
                if (records[i].name === result[j][0].name) {
                    result[j].push(records[i]);
                    p = true;
                    break;
                }
            }
            if (!p) result.push([records[i]]);
        }
        return result;
    }
    /**
     * Returns array of all zones from this pdns server.
     * @async
     * @returns {Array} array of zones
     * @example 
       await pdns.getZones();
     */
    getZones() {
        return f(this.baseurl + "/zones", {
            method: "GET",
            headers: {
                "X-Api-Key": this.apikey
            },
            json: true
        }).then(res => {
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
    createZone(zoneName, kind = "Native") {
        if (typeof zoneName !== "string") throw new TypeError("zoneName must be of type string");

        const dname = this.absoluteName(zoneName);
        const zoneNameSan = dname.substr(0, dname.length - 1).match(secondLevelRegex)[0];
        return f(`${this.baseurl}/zones`, {
            method: "POST",
            headers: {
                "X-Api-Key": this.apikey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: zoneNameSan + ".",
                kind
            })
        })
            .then(async res => {
                let j = await res.text().catch();
                try {
                    j = JSON.parse(j);
                } catch (err) {
                    throw j;
                }
                if (!j.rrsets) return false;
                return j.rrsets[0];
            })
            .catch(err => {
                throw new Error(err);
            });
    }
    /**
     * Returns single zone with meta information. 
     * @async
     * @param {string} zoneName takes a domain name
     * @returns {object} the zone with meta information
     * @example 
       await pdns.getZoneWithMeta('example.com');
     */
    getZoneWithMeta(zoneName) {
        if (typeof zoneName !== "string") throw new TypeError("zoneName must be of type string");
        const dname = this.absoluteName(zoneName);
        const zoneNameSan = dname.substr(0, dname.length - 1).match(secondLevelRegex)[0];
        return f(this.baseurl + "/zones/" + zoneNameSan, {
            method: "GET",
            headers: {
                "X-Api-Key": this.apikey
            },
            json: true
        })
            .then(res => {
                return res.json().catch(() => {});
            })
            .then(json => {
                if (json) return json;
                return {};
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
    async getZone(zoneName) {
        if (typeof zoneName !== "string") throw new TypeError("zoneName must be of type string");
        const a = await this.getZoneWithMeta(zoneName);

        return a && a.rrsets ? a.rrsets : [];
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
        if (typeof zoneName !== "string") throw new TypeError("zoneName must be of type string");
        const dname = this.absoluteName(zoneName);
        const zoneNameSan = dname.substr(0, dname.length - 1).match(secondLevelRegex)[0];
        return f(this.baseurl + "/zones/" + zoneNameSan, {
            method: "DELETE",
            headers: {
                "X-Api-Key": this.apikey
            },
            json: true
        })
            .then(async res => {
                let j = await res.text();

                if (j === undefined || j.length === 0) return true;
                return false;
            })
            .catch(err => {
                throw err;
            });
    }
    /**
     * Takes records for a SINGLE domain as array and sets them. If records exist it replaces them.
     * @async
     * @param {Records} records array containing the records
     * @param {string} [domain] optional domain name
     * @returns {boolean} boolean indicating the success of the operation
     * @example 
       await pdns.setHomogeneousRecords([{
           name: "example.com",
           type: "A",
           ttl: 300,
           content: ['1.1.1.1']
       }]);
     */
    setHomogeneousRecords(records, domain) {
        if (!Array.isArray(records)) throw new TypeError("records must be of type array");

        const dname = this.absoluteName(records[0].name);
        const zoneName = dname.substr(0, dname.length - 1).match(secondLevelRegex)[0];
        if (!domain) domain = zoneName;
        let rrsets = [];
        for (let i = 0; i < records.length; i++) {
            let recordsOut = [];
            for (let j = 0; j < records[i].content.length; j++) {
                recordsOut.push({
                    content: records[i].content[j],
                    disabled: false,
                    ttl: typeof records[i].ttl == "undefined" ? 3600 : records[i].ttl,
                    name: this.absoluteName(records[i].name),
                    type: typeof records[i].type == "undefined" ? "A" : records[i].type
                });
            }
            rrsets.push({
                name: this.absoluteName(records[i].name),
                type: typeof records[i].type == "undefined" ? "A" : records[i].type,
                ttl: typeof records[i].ttl == "undefined" ? 3600 : records[i].ttl,
                changetype: "REPLACE",
                records: recordsOut
            });
        }
        return f(this.baseurl + "/zones/" + domain, {
            method: "PATCH",
            headers: {
                "X-Api-Key": this.apikey
            },
            body: JSON.stringify({
                rrsets
            })
        })
            .then(async res => {
                let j = await res.text().catch();
                if (j.includes("error")) console.log(j);

                if (j) {
                    try {
                        j = JSON.parse(j);
                    } catch (err) {
                        throw j;
                    }
                }
                if (j === undefined || j.length === 0) return true;
                return false;
            })
            .catch(err => {
                throw err;
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
        if (!Array.isArray(records)) throw new TypeError("records must be of type array");
        const dname = this.absoluteName(records[0].name);
        const zoneName = dname.substr(0, dname.length - 1).match(secondLevelRegex)[0];

        let rrsets = [];
        for (let i = 0; i < records.length; i++) {
            rrsets.push({
                name: this.absoluteName(records[i].name),
                type: records[i].type,
                changetype: "DELETE"
            });
        }

        return f(this.baseurl + "/zones/" + zoneName, {
            method: "PATCH",
            headers: {
                "X-Api-Key": this.apikey
            },
            body: JSON.stringify({
                rrsets
            })
        })
            .then(async res => {
                let j = await res.text().catch();
                if (j) {
                    try {
                        j = JSON.parse(j);
                    } catch (err) {
                        throw j;
                    }
                }
                if (j === undefined || j.length === 0) return true;
                return false;
            })
            .catch(err => {
                throw err;
            });
    }
    /**
     * Takes Search object and searches for matching elements in the pdns server.
     * @async
     * @param {Search} search object with the query paramters
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
        if (!search.object_type) search.object_type = "record";
        if (!search.query) return null;
        return f(`${this.baseurl}/search-data?q=${search.query}&max=${search.max}&object_type=${search.object_type}`, {
            method: "GET",
            headers: {
                "X-Api-Key": this.apikey
            },
            json: true
        })
            .then(res => {
                return res.json().catch(err => {
                    console.log(err);
                });
            })
            .then(json => {
                if (json) return json;
                return null;
            });
    }
    /**
     * Takes ONE record as object and appends it not replacing other records with the same name.
     * @async
     * @param {Record} record array containing the records to be appended
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
                if (a[i] && a[i].type !== "PTR") record.content.push(a[i].content);
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
     * @returns {Object} on success the public key and info will be returned
     * @example
        await pdns.createCryptokey("example.com");
     */
    createCryptokey(
        zoneName,
        cryptokey = {
            keytype: "ksk",
            active: true
        },
        returnPrivateKey = false
    ) {
        if (!zoneName) throw new Error("Missing zone/domain name");
        if (!cryptokey.keytype) throw new Error("Missing keytype");

        const dname = this.absoluteName(zoneName);
        const zoneNameSan = dname.substr(0, dname.length - 1).match(secondLevelRegex)[0];
        return f(`${this.baseurl}/zones/${zoneNameSan}/cryptokeys`, {
            method: "POST",
            headers: {
                "X-Api-Key": this.apikey
            },
            body: JSON.stringify(cryptokey)
        }).then(async res => {
            let j = await res.text().catch();
            if (j) {
                try {
                    j = JSON.parse(j);
                } catch (err) {
                    throw j;
                }
            }
            if (returnPrivateKey) return j;
            delete j.privatekey;
            return j;
        });
    }
    /**
     * Get the crypotkeys for a given zone.
     * @async
     * @param {string} zoneName name of the zone/domain 
     * @returns {Array.<Cryptokey>} on success the cryptokeys of the zone will be returned
     * @example
        await pdns.getCryptoKeys("example.com");
     */
    getCryptoKeys(zoneName) {
        if (!zoneName) throw new Error("Missing zone/domain name");

        const dname = this.absoluteName(zoneName);
        const zoneNameSan = dname.substr(0, dname.length - 1).match(secondLevelRegex)[0];
        return f(`${this.baseurl}/zones/${zoneNameSan}/cryptokeys`, {
            method: "GET",
            headers: {
                "X-Api-Key": this.apikey
            }
        }).then(async res => {
            let j = await res.text().catch();
            if (j) {
                try {
                    j = JSON.parse(j);
                } catch (err) {
                    throw j;
                }
            }
            return j;
        });
    }
    /**
     * Delete a cryptokey with specified id from specified zone.
     * @async
     * @param {string} zoneName name of the zone/domain 
     * @param {string} cryptokeyId id of the cryptokey
     * @returns {boolean} true on success
     * @example
        await pdns.deleteCryptoKey("example.com",171);
     */
    deleteCryptoKey(zoneName, cryptokeyId) {
        if (!zoneName) throw new Error("Missing zone/domain name");

        const dname = this.absoluteName(zoneName);
        const zoneNameSan = dname.substr(0, dname.length - 1).match(secondLevelRegex)[0];
        return f(`${this.baseurl}/zones/${zoneNameSan}/cryptokeys/${cryptokeyId}`, {
            method: "DELETE",
            headers: {
                "X-Api-Key": this.apikey
            }
        }).then(async res => {
            let j = await res.text().catch();
            if (j) {
                try {
                    j = JSON.parse(j);
                } catch (err) {
                    throw Error(j);
                }
            }
            return j === "" ? true : j;
        });
    }

    /**
     * Takes records for single or mixed domains as array and sets them. If records exist it replaces them.
     * @async
     * @param {Records} records array containing the records
     * @returns {Array}  array of booleans indicating the success of each entry
     * @example 
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
     */
    async setRecords(records) {
        records = this.sortRecordsByDomainName(records);
        let ir = [];
        for (let i = 0; i < records.length; i++) {
            ir.push(this.setHomogeneousRecords(records[i]));
        }

        return await Promise.all(ir);
    }
    /**
     * Searches for records in a zone by comparing the RECORDS field NOT the name field. Replaces the found records with the replace string.
     * @async
     * @param {String} find string to search for
     * @param {String} replace string to replace the find string with
     * @param {String} zone zone to search through
     * @returns {Number} number of replaced entries
     * @example
      await pdns.replaceRecords('1.1.1.1','2.2.2.2','example.com');
     */
    async replaceRecords(find, replace, zone) {
        const toReplace = [];
        const zoneSets = await this.getZone(zone);
        if (zoneSets) {
            for (let j = 0; j < zoneSets.length; j++) {
                const content = [];
                let foundOne = false;
                for (let k = 0; k < zoneSets[j].records.length; k++) {
                    if (zoneSets[j].records[k].content === find) {
                        content.push(replace);
                        foundOne = true;
                    } else {
                        content.push(zoneSets[j].records[k].content);
                    }
                }
                if (foundOne) {
                    toReplace.push({
                        name: zoneSets[j].name,
                        type: zoneSets[j].type,
                        ttl: zoneSets[j].ttl,
                        content
                    });
                }
            }
        }
        await this.setRecords(toReplace);
        return toReplace.length;
    }
    /**
     * Searches for records on the pdns server by comparing the RECORDS field NOT the name field. Replaces the found records with the replace string.
     * @async
     * @param {String} find string to search for
     * @param {String} replace string to replace the find string with
     * @returns {Number} number of replaced entries
     * @example
     await pdns.replaceRecordsGlobal('1.1.1.1','2.2.2.2');
     */
    async replaceRecordsGlobal(find, replace) {
        const allZones = await this.getZones();
        const toReplace = [];
        for (let i = 0; i < allZones.length; i++) {
            const zoneSets = await this.getZone(allZones[i].name);
            if (zoneSets) {
                for (let j = 0; j < zoneSets.length; j++) {
                    const content = [];
                    let foundOne = false;
                    for (let k = 0; k < zoneSets[j].records.length; k++) {
                        if (zoneSets[j].records[k].content === find) {
                            content.push(replace);
                            foundOne = true;
                        } else {
                            content.push(zoneSets[j].records[k].content);
                        }
                    }
                    if (foundOne) {
                        toReplace.push({
                            name: zoneSets[j].name,
                            type: zoneSets[j].type,
                            ttl: zoneSets[j].ttl,
                            content
                        });
                    }
                }
            }
        }
        await this.setRecords(toReplace);
        return toReplace.length;
    }
    /**
     * Searches for records in a zone by comparing the RECORDS field NOT the name field
     * @async
     * @param {String} find string to search for
     * @param {String} zone zone to search through
     * @returns {Array} records matching the find string in the content field
     * @example
            await pdns.findRecords('1.1.1.1', 'example.com');
     */
    async findRecords(find, zone) {
        const res = [];
        const zoneSets = await this.getZone(zone);
        if (zoneSets) {
            for (let j = 0; j < zoneSets.length; j++) {
                for (let k = 0; k < zoneSets[j].records.length; k++) {
                    if (zoneSets[j].records[k].content === find) {
                        res.push(zoneSets[j]);
                    }
                }
            }
        }
        return res;
    }
    /**
     * Searches for records on the pdns server by comparing the RECORDS field NOT the name field
     * @async
     * @param {String} find string to search for
     * @returns {Array} records matching the find string in the content field
     * @example
      await pdns.findRecordsGlobal('1.1.1.1');
     */
    async findRecordsGlobal(find) {
        const allZones = await this.getZones();
        const res = [];
        for (let i = 0; i < allZones.length; i++) {
            const zoneSets = await this.getZone(allZones[i].name);
            if (zoneSets) {
                for (let j = 0; j < zoneSets.length; j++) {
                    for (let k = 0; k < zoneSets[j].records.length; k++) {
                        if (zoneSets[j].records[k].content === find) {
                            res.push(zoneSets[j]);
                        }
                    }
                }
            }
        }
        return res;
    }
    /**
     * Higher level function for creating a zone with a custom soa record, name servers and dnssec/cryptokey. Skips creating zone and/or cryptokey if it exists.
     * @async
     * @param {Object} zone string to search for
     * @returns {Boolean} true on success
     * @example
      await pdns.createAndSetupZone({
             domain: 'example.com',
             nameserver: ['ns1.paulisttoll.somedomain', 'ns2.paulisttoll.somedomain', 'ns3.paulisttoll.somedomain'],
             hostmasterEmail:'hostmaster@paulisttoll.somedomain',
        
    })
     */
    async createAndSetupZone(zone) {
        const zor = `

Your function should look something like this:
await pdns.createAndSetupZone({
  domain: 'example.com',
  nameserver: ['ns1.paulisttoll.somedomain', 'ns2.paulisttoll.somedomain', 'ns3.paulisttoll.somedomain'],
  hostmasterEmail:'hostmaster@paulisttoll.somedomain'
});
    `;
        if (!zone) throw Error("No zone object provided" + zor);
        if (!zone.domain) throw Error("No domain specified" + zor);
        if (!zone.nameserver) throw Error("No nameserver provided" + zor);
        if (!zone.nameserver.length) throw Error("Your zone needs to have at least one nameserver" + zor);
        if (!zone.hostmasterEmail) throw Error("No hostmasterEmail provided" + zor);

        await this.createZone(zone.domain).catch(e => {
            if (e.toString().includes("Conflict")) console.log("domain already exists: skipping creation");
        });
        await this.setRecords([
            {
                name: zone.domain.match(secondLevelRegex)[0],
                type: "SOA",
                ttl: 3600,
                content: [
                    `${this.absoluteName(zone.nameserver[0])} ${zone.hostmasterEmail.replace(
                        "@",
                        "."
                    )}. 2020111501 10800 3600 604800 3600`
                ]
            },
            {
                name: zone.domain.match(secondLevelRegex)[0],
                type: "NS",
                ttl: 3600,
                content: zone.nameserver.map(e => this.absoluteName(e))
            }
        ]).catch(e => {
            console.log(e);
        });
        const cryptokey = await this.getCryptoKeys(zone.domain);
        if (!cryptokey || !cryptokey.length) {
            return await this.createCryptokey(zone.domain);
        }
        console.log("Cryptokey exists: skipping creation");
        return true;
    }
};
