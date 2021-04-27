(async () => {
    require("dotenv").config();

    const { PowerdnsClient } = require("../index.js");

    const pdns = new PowerdnsClient(process.env.PDNS_API_ENDPOINT, process.env.PDNS_API_KEY);

    const zone = Math.random().toString(36).substring(7) + ".test.";

    afterAll(async () => {
        return await pdns.deleteZone(zone);
    });
    test("check if non string input results in error", () => {
        expect(() => pdns.getZone(1)).rejects.toThrow("zoneName must be of type string");
        expect(() => pdns.getZone({})).rejects.toThrow("zoneName must be of type string");
    });

    test("check if zones rrsets are getting returned", async () => {
        await pdns.createZone(zone);
        const a = await pdns.getZone(zone);
        expect(a).toBeInstanceOf(Array);
        expect(a[0].name).toBe(zone);
    });
})();
