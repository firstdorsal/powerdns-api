(async () => {
    require("dotenv").config();

    const { PowerdnsClient } = require("../index.js");

    const pdns = new PowerdnsClient(process.env.PDNS_API_ENDPOINT, process.env.PDNS_API_KEY);

    const zone = Math.random().toString(36).substring(7) + ".test.";

    afterAll(async () => {
        return await pdns.deleteZone(zone);
    });

    test("check if non string input results in error", () => {
        expect(() => pdns.deleteZone(1)).toThrow("zoneName must be of type string");
        expect(() => pdns.deleteZone({})).toThrow("zoneName must be of type string");
    });

    test("check if zone gets created and deleted", async () => {
        await pdns.createZone(zone);
        const a = await pdns.getZone(zone);
        expect(a).toBeInstanceOf(Array);
        const b = await pdns.deleteZone(zone);
        expect(b).toBe(true);
        const c = await pdns.getZone(zone);
        expect(c).toEqual([]);
        expect(c.length).toBe(0);
    });
})();
