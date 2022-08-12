/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from "axios";
import { assert } from "chai";
import { HttpConnector, HttpMethod } from "../lib/http.connector.mjs";
import { TestServer } from "./test.server.mjs";

export const testHttpConnector = () => describe(`http connector`, () => {
    const server: TestServer = new TestServer();
    const conn = new HttpConnector("http://localhost:3000");
    let token = "";

    before(() => {
        server.start();
    });

    after(() => {
        server.stop();
    });

    it(`post`, async () => {
        const ret = await conn.post("/post", { a: "hello world" });
        assert.equal((ret as any).a, "hello world");
    });

    it(`get`, async () => {
        const ret = await conn.send("/get", { a: "hello world" }, HttpMethod.get);
        assert.equal((ret as any).a, "hello world");
    });

    it(`post get only url`, async () => {
        conn.post("/get", { a: "hello world" })
            .then(() => assert.fail("should failed"))
            .catch(() => {
                //
            });
    });

    it(`get post only url`, async () => {
        conn.get("/post", { a: "hello world" })
            .then(() => assert.fail("should failed"))
            .catch(() => {
                //
            });
    });

    it(`get token`, async () => {
        const ret = await conn.get<{ token: string }>("/login");
        token = ret.token;
        conn.setAuth(token);
    });

    it(`access secret`, async () => {
        const ret = await conn.get<{ message: string }>("/secret");
        assert.equal(ret.message, "secret world");
    });
    it(`access secret without token`, async () => {
        conn.setAuth();
        await conn.get<{ message: string }>("/secret")
            .then(() => {
                assert.fail("should failed without token");
            }).catch(err => {
                const e: AxiosError = err;
                assert.equal(e.response?.status, 401, `${JSON.stringify(e.response?.status)}`);
            })
    });
});