(async () => {
    require("dotenv").config();

    const { PowerdnsClient } = require("../index.js");

    const pdns = new PowerdnsClient(process.env.PDNS_API_ENDPOINT, process.env.PDNS_API_KEY);

    const recordsInput = [
        {
            name: "example.org",
            type: "A",
            ttl: 300,
            content: ["1.1.1.1", "8.8.8.8"]
        },
        {
            name: "*.example.com",
            type: "A",
            ttl: 300,
            content: ["1.1.1.1", "8.8.8.8"]
        }
    ];

    const recordsExpected = [
        [
            {
                name: "example.org",
                type: "A",
                ttl: 300,
                content: ["1.1.1.1", "8.8.8.8"]
            }
        ],
        [
            {
                name: "*.example.com",
                type: "A",
                ttl: 300,
                content: ["1.1.1.1", "8.8.8.8"]
            }
        ]
    ];

    test("test if invalid input throws error", () => expect(() => pdns.sortRecordsByDomainName(1)).toThrow("records must be of type array"));

    test("test if records get seperated into arrays", () => expect(pdns.sortRecordsByDomainName(recordsInput)).toEqual(recordsExpected));
})();
