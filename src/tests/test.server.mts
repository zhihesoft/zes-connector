import express from "express";
import http from "http";

export class TestServer {

    private app: express.Express | undefined;
    private server: http.Server | undefined;

    start() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.server.listen(3000);
        this.app.use(express.json());
        this.app.post("/post", (req, resp) => { resp.json(req.body); });
        this.app.get("/get", (req, resp) => { resp.json(req.query); });

    }

    stop() {
        this.server?.close();
    }
}