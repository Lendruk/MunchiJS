import Expiry from "./Expiry";

test("Test getSeconds", () => {
    const expiry = new Expiry({ days: 5, hours: 12 });
    expect(expiry.getSeconds()).toBe(475200);
});
