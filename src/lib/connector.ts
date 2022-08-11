export abstract class Connector {
    constructor(
        public baseURL: string
    ) { }

    abstract send<T>(url: string, args: unknown): Promise<T>;

    abstract setAuth(token: string): void;
}