(async () => {
    require("dotenv").config();

    const { PowerdnsClient } = require("../index.js");

    const pdns = new PowerdnsClient(process.env.PDNS_API_ENDPOINT, process.env.PDNS_API_KEY);

    const zone = Math.random().toString(36).substring(7) + ".test.";

    afterAll(async () => {
        return await pdns.deleteZone(zone);
    });

    test("check if non string input results in error", () => {
        expect(() => pdns.setHomogeneousRecords(1)).toThrow("records must be of type array");
    });

    test("check if records get set", async () => {
        await pdns.createZone(zone);
        const a = await pdns.setHomogeneousRecords([
            {
                name: zone,
                type: "A",
                ttl: 300,
                content: ["1.1.1.1"]
            }
        ]);
        expect(a).toBe(true);
        const b = await pdns.getZone(zone);
        const c = b.filter(e => {
            if (e.type === "A") return e;
        })[0];

        expect(c.records[0].content).toBe("1.1.1.1");
    });
})();
