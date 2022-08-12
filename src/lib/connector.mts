export abstract class Connector {
    constructor(
        public baseURL: string
    ) { }

    abstract open(): Promise<boolean>;

    abstract close(): void;

    abstract send<T>(url: string, args: unknown): Promise<T>;

    abstract setAuth(token: string): void;

    abstract get connected(): boolean;
}