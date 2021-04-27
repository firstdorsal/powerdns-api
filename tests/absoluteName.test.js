(async () => {
    require("dotenv").config();

    const { PowerdnsClient } = require("../index.js");

    const pdns = new PowerdnsClient(process.env.PDNS_API_ENDPOINT, process.env.PDNS_API_KEY);

    test("checks if non absolute name gets converted", () => {
        expect(pdns.absoluteName("example.com")).toBe("example.com.");
    });
    test("checks absolute names stay the same", () => {
        expect(pdns.absoluteName("example.com.")).toBe("example.com.");
    });
    test("check if non string input results in error", () => {
        expect(() => pdns.absoluteName(1)).toThrow("name must be of type string");
        expect(() => pdns.absoluteName({})).toThrow("name must be of type string");
    });
})();
