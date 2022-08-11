/* eslint-disable @typescript-eslint/no-explicit-any */
import { assert } from "chai";
import { HttpConnector, HttpMethod } from "../lib/http.connector.js";
import { TestServer } from "./test.server.mjs";

export const testHttpConnector = () => describe(`http connector`, () => {
    const server: TestServer = new TestServer();

    before(() => {
        server.start();
    });

    after(() => {
        server.stop();
    });

    it(`post`, async () => {
        const conn = new HttpConnector("http://localhost:3000");
        const ret = await conn.post("/post", { a: "hello world" });
        assert.equal((ret as any).a, "hello world");
    });

    it(`get`, async () => {
        const conn = new HttpConnector("http://localhost:3000");
        const ret = await conn.send("/get", { a: "hello world" }, HttpMethod.get);
        assert.equal((ret as any).a, "hello world");
    });

    it(`post get only url`, async () => {
        const conn = new HttpConnector("http://localhost:3000");
        conn.post("/get", { a: "hello world" })
            .then(() => assert.fail("should failed"))
            .catch(() => {
                //
            });
    });

    it(`get post only url`, async () => {
        const conn = new HttpConnector("http://localhost:3000");
        conn.get("/post", { a: "hello world" })
            .then(() => assert.fail("should failed"))
            .catch(() => {
                //
            });
    });
});