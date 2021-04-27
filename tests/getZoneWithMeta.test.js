(async () => {
    require("dotenv").config();

    const { PowerdnsClient } = require("../index.js");

    const pdns = new PowerdnsClient(process.env.PDNS_API_ENDPOINT, process.env.PDNS_API_KEY);

    const zone = Math.random().toString(36).substring(7) + ".test.";

    test("check if non string input results in error", () => {
        expect(() => pdns.getZoneWithMeta(1)).toThrow("zoneName must be of type string");
        expect(() => pdns.getZoneWithMeta({})).toThrow("zoneName must be of type string");
    });

    test("check if zone gets returned with meta", async () => {
        await pdns.createZone(zone);
        const a = await pdns.getZoneWithMeta(zone);
        expect(a.name).toBe(zone);
    });
    afterAll(() => {
        return pdns.deleteZone(zone);
    });
})();
