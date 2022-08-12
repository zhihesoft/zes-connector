import { Connector } from "./connector.mjs";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export const HttpMethod = {
    get: "get",
    post: "post",
    delete: "delete",
    head: "head",
    options: "options",
    put: "put",
    patch: "patch"
}

export class HttpConnector extends Connector {

    constructor(
        baseURL: string
    ) {
        super(baseURL);
    }

    private net: AxiosInstance | undefined;

    override async open(): Promise<boolean> {

        if (this.net) {
            throw new Error(`connector is already open`);
        }

        this.net = axios.default.create({
            baseURL: this.baseURL,
            timeout: 1000,
        });

        return true;
    }

    override close(): void {
        this.net = undefined;
    }

    override get connected(): boolean {
        return this.net != undefined;
    }

    setAuth(token?: string): void {
        if (this.net) {
            if (token) {
                token = `Bearer ${token}`;
            } else {
                token = "";
            }
            this.net.defaults.headers.common['Authorization'] = token;
        }
    }

    async get<T>(url: string, args?: unknown): Promise<T> {
        return this.send(url, args, HttpMethod.get);
    }

    async post<T>(url: string, args?: unknown): Promise<T> {
        return this.send(url, args, HttpMethod.post);
    }

    async send<T>(url: string): Promise<T>;
    async send<T>(url: string, args: unknown): Promise<T>;
    async send<T>(url: string, args: unknown, method: string): Promise<T>
    async send<T>(url: string, args?: unknown, method?: string): Promise<T> {

        if (!this.net) {
            throw new Error(`connector is not open`);
        }

        method = method ?? HttpMethod.get;
        const cfg: AxiosRequestConfig = {
            url: url,
            method,
        }
        if (method == HttpMethod.get) {
            cfg.params = args;
        } else {
            cfg.data = args;
        }

        return this.net.request(cfg)
            .then(resp => {
                return resp.data;
            }).catch(err => {
                return Promise.reject(err);
            });
    }
}

