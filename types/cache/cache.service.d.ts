export declare class CacheService {
    private readonly cache;
    constructor();
    get(key: string): string | undefined;
    set(key: string, value: string): boolean;
}
