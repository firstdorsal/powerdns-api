(async () => {
    require("dotenv").config();

    const { PowerdnsClient } = require("../index.js");

    const pdns = new PowerdnsClient(process.env.PDNS_API_ENDPOINT, process.env.PDNS_API_KEY);

    const zone = Math.random().toString(36).substring(7) + ".test.";

    test("check if zone gets created", async () => {
        await pdns.createZone(zone);
        expect((await pdns.getZoneWithMeta(zone)).name).toBe(zone);
    });
    afterAll(() => {
        return pdns.deleteZone(zone);
    });
})();
