(async () => {
    require("dotenv").config();

    const { PowerdnsClient } = require("../index.js");

    const pdns = new PowerdnsClient(process.env.PDNS_API_ENDPOINT, process.env.PDNS_API_KEY);

    test("check if it returns an array", async () => {
        expect(await pdns.getZones()).toBeInstanceOf(Array);
    });
})();
