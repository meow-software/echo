import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisClientService implements OnApplicationShutdown{
    private redis: Redis;

    constructor(private readonly configService: ConfigService) {
        const redisUrl = this.configService.get<string>('REDIS_URL', "");
        this.redis = new Redis(redisUrl);
    }

    async isConnected(): Promise<boolean> {
        return this.redis.status === 'ready';
    }

    async onApplicationShutdown(signal?: string) {
        this.redis.disconnect();
    }


    async getIoRedis(): Promise<Redis> {
        if (await this.isConnected()) {
            return this.redis;
        } else {
            throw new Error('Redis connection is not ready');
        }
    }

    async set(key: string, value: string, ttl: number = 3600): Promise<void> {
        try {
            await this.redis.set(key, value, 'EX', ttl);
        } catch (error) {
            throw new Error(`Failed to set cache for key ${key}: ${error.message}`);
        }
    }

    async setObj(key: string, value: object, ttl: number = 3600): Promise<void> {
        try {
            const serializedValue = JSON.stringify(value); // Sérialisation
            this.set(key, serializedValue, ttl)
        } catch (error) {
            throw new Error(`Failed to set cache for key ${key}: ${error.message}`);
        }
    }

    async get(key: string): Promise<string | null> {
        return await this.redis.get(key);
    }

    async getObj(key: string): Promise<string | null> {
        const result = await this.get(key);
        if (result) {
            return JSON.parse(result); // Désérialisation
        }
        return null;
    }

    async delete(key: string): Promise<void> {
        await this.redis.del(key);
    }

}
