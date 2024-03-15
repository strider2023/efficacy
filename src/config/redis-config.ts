import { RedisClientType, createClient } from 'redis';
import * as dotenv from 'dotenv';

dotenv.config();

const { REDIS_URL } =
    process.env;

export class RedisClient {

    private static instance: RedisClient;
    private client: RedisClientType;

    private constructor() {
        this.client = createClient({
            url: REDIS_URL
        });
    }

    public static getInstance(): RedisClient {
        if (!RedisClient.instance) {
            RedisClient.instance = new RedisClient();
        }
        return RedisClient.instance;
    }

    public async connect() {
        try {
            await this.client.connect();
            console.log("Redis client has been initialized!");
        } catch (e) {
            console.error(e);
        }
    }

    public async disconnect() {
        try {
            await this.client.quit();
        } catch (e) {
            console.error(e);
        }
    }

    public getClient(): RedisClientType {
        return this.client;
    }
}