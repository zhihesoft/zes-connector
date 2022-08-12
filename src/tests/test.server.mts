/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { response } from "express";
import http from "http";
import { expressjwt as jwt } from "express-jwt";
import jwts from "jsonwebtoken";

export class TestServer {

    private app: express.Express | undefined;
    private server: http.Server | undefined;
    private secretKey = "shhhhhhared-secret";

    start() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.server.listen(3000);
        this.app.use(express.json());
        this.app.use((req, resp, next) => {
            // console.log(req.headers);
            next();
        })
        this.app.post("/post", (req, resp) => { resp.json(req.body); });
        this.app.get("/get", (req, resp) => { resp.json(req.query); });
        this.app.get("/login", (req, resp) => {
            const token = jwts.sign({ id: "hello" }, this.secretKey, { expiresIn: 24 * 60 * 60 });
            resp.json({ token });
        });
        this.app.use("/secret", jwt({ secret: this.secretKey, algorithms: ["HS256"] }), (req, resp) => {
            resp.json({ message: "secret world" });
        });
        this.app.use((err: any, req: any, resp: any, next: any) => {
            resp.status(err.status).send(`failed`);
        });
    }

    stop() {
        this.server?.close();
    }
}