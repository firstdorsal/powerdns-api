'use strict';
const f = require("node-fetch")
const r = require("request-promise");
module.exports = class {
    constructor(baseurl, apikey) {
        this.baseurl = baseurl;
        this.apikey = apikey;
    }

    canName(name) {
        if (name[name.length - 1] !== '.') {
            return name + '.';
        } else {
            return name;
        }
    } //returns name in canonical form with a . at the end example.com -> example.com. and example.com. -> example.com.

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
    } //returns array of zones; must be awaited

    getZoneWithMeta(zoneName) {
        zoneName = this.canName(zoneName);
        return f(this.baseurl + '/zones/' + zoneName, {
            method: 'GET',
            headers: {
                'X-Api-Key': this.apikey
            },
            json: true
        }).then((res) => {
            return res.json();
        });
    } //returns single zone with meta information; must be awaited

    getZone(zoneName) {
        zoneName = this.canName(zoneName);
        return f(this.baseurl + '/zones/' + zoneName, {
            method: 'GET',
            headers: {
                'X-Api-Key': this.apikey
            },
            json: true
        }).then((res) => {
            return res.json().catch((err) => {});
        }).then((json) => {
            if (json && json.rrsets) {
                return json.rrsets
            } else {
                return null
            }
        });
    } //returns array with rrsets; must be awaited 

    setRecords(records) {
        const dname = this.canName(records[0].name);
        const zoneName = dname.substr(0, dname.length - 1).match(/[A-Za-z0-9]*\.[A-Za-z0-9]*$/)[0];


        let rrsets = [];
        for (let i = 0; i < records.length; i++) {
            let recordsOut = [];
            for (let j = 0; j < records[i].content.length; j++) {
                recordsOut.push({
                    "content": records[i].content[j],
                    "disabled": false,
                    "ttl": records[i].ttl,
                    "name": this.canName(records[i].name),
                    "type": records[i].type
                });
            }
            rrsets.push({
                "name": this.canName(records[i].name),
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
            if (res === undefined) {
                return true;
            } else {
                return false;
            }
        }).catch((err) => {
            console.error(err);
            return false;
        });
    } //sets records; if records exist it replaces them; returns true on success; must be awaited

    deleteRecords(records) {
        const dname = this.canName(records[0].name);
        const zoneName = dname.substr(0, dname.length - 1).match(/[A-Za-z0-9]*\.[A-Za-z0-9]*$/)[0];


        let rrsets = [];
        for (let i = 0; i < records.length; i++) {

            rrsets.push({
                "name": this.canName(records[i].name),
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
            if (res === undefined) {
                return true;
            } else {
                return false;
            }
        }).catch((err) => {
            console.error(err);
            return false;
        });
    } //deletes records; returns true on success; must be awaited 

    search(s) {
        if (s.max === undefined) s.max = 10;
        if (s.object_type === undefined) s.object_type = 'record'
        return f(`${this.baseurl}/search-data?q=${s.query}&max=${s.max}&object_type=${s.object_type}`, {
            method: 'GET',
            headers: {
                'X-Api-Key': this.apikey
            },
            json: true
        }).then((res) => {
            return res.json().catch((err) => {});
        }).then((json) => {
            if (json) {
                return json
            } else {
                return null
            }
        });
    } //searches for elements in pdns; returns found elements as array; if max is not specified it defaults to 10 returned records; if object_type is not defined it defaults to record; must be awaited 

    async appendRecord(record) {
        const a = await this.search({
            query: record.name
        });
        for (let i = 0; i < a.length; i++) {
            if (a[i] && a[i].type !== 'PTR') {
                record.content.push(a[i].content);
            }
        }
        return await this.setRecords([record]);
    } //appends ONE record NOT replacing other records with the same record name; the single input record can contain more than one object in the content array; returns true on success; must be awaited 
}
























/*
 async getSets(name) {
        console.log(opts);
        name = this.canName(name);
        let zoneName = name.substr(0, name.length - 1).match(/[A-Za-z0-9]*\.[A-Za-z0-9]*$/)[0];
        let res = await this.getZone(zoneName);
        if (res) {
            let b = [];
            for (let i = 0; i < res.length; i++) {
                if (res[i].name === name) {
                    b.push(res[i])
                }
            }
            return b;
        }
    } //returns array with rrsets matching the name; must be awaited 
    async getRecords(name) {

        name = this.canName(name);
        let zoneName = name.substr(0, name.length - 1).match(/[A-Za-z0-9]*\.[A-Za-z0-9]*$/)[0];
        let res = await this.getZone(zoneName);
        if (res) {
            let b = [];
            for (let i = 0; i < res.length; i++) {
                if (res[i].name === name) {
                    for (let j = 0; j < res[i].records.length; j++) {
                        b.push(res[i].records[j].content);

                    }
                }
            }
            return b;
        }
    } //returns array with records matching the name; must be awaited 







*/