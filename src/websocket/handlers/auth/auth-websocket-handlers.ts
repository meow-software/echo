import { Server, Socket } from 'socket.io';
import { BadRequestException, UnauthorizedException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BaseWebsocketHandler, OnWebsocketEventHandler, RedisClientService } from '@tellme/common';
import { EchoEvent, RedisCacheKey, WsErrorHandlerService } from '@tellme/shared';
import { CommandBus } from '@nestjs/cqrs';

@Injectable()
export class AuthWebsocketHandlers extends BaseWebsocketHandler {
  private readonly TTL: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisClientService,
    private readonly wsErrorHandlerService: WsErrorHandlerService,
    private readonly configService: ConfigService,
        private readonly commandBus: CommandBus,
  ) {
    super();
    this.TTL = parseInt(this.configService.get("JWT_EXPIRES_IN", "3600"));
  }

    /**
   * Handles connection event.
   * 
   * @param {Server} _server - The WebSocket server instance.
   * @param {Socket} client - The client socket initiating the event.
   * @returns {Promise<void>}
   */
  @OnWebsocketEventHandler(EchoEvent.Connection)
  async connection(_server: Server, client: Socket) {
    this.handleConnection(client);
  }
  /**
   * Handles deconnection event.
   * 
   * @param {Server} _server - The WebSocket server instance.
   * @param {Socket} client - The client socket initiating the event.
   * @returns {Promise<void>}
   */
  @OnWebsocketEventHandler(EchoEvent.Disconnect)
  async deconnection(_server: Server, client: Socket) {
    this.handleDisconnect(client);
  }

  /**
   * Handles a new client connection.
   * @param client - The client socket. 
   */
  async handleConnection(client: Socket) {
    client.emit('user-joined', {
      message: `user joined the chat: ${client.id}`,
    });
    return ;
    // Extract token JWT
    const token = client.handshake.headers.authorization +"todo";
    if (!token) { 
      // No token found
      this.wsErrorHandlerService.emitError(client, new UnauthorizedException('No authorization token, please add it.'));
      client.disconnect(); 
      return;
    }

    // Decode token without verification
    let decoded, userId;
    try {
      // Try decode
      decoded = this.jwtService.decode(token);
      if (!decoded) {
        this.wsErrorHandlerService.emitError(client, new UnauthorizedException('Invalid token format.'));
        client.disconnect();
        return;
      }

      // Check expiration
      if (decoded.exp < Math.floor(Date.now() / 1000)) {
        // Not remove token, cache self-update with time or after token regenerate
        this.wsErrorHandlerService.emitError(client, new UnauthorizedException('Token has expired. Please regenerate your token.'));
        client.disconnect();
        return;
      }

      // Get userId
      userId = decoded['userId'];
      if (!userId) {
        this.wsErrorHandlerService.emitError(client, new BadRequestException('Invalid token format.'));
        return;
      }
    } catch (error) {
      // Error decoding token
      this.wsErrorHandlerService.emitError(client, new BadRequestException('Invalid token format.'));
      client.disconnect();
      return;
    }

    // Check legitimacy of JWT Token
    const redis = await this.redisService.getIoRedis();
    const cachedToken = await redis.sismember(RedisCacheKey.getUserToken(userId), token);

    if (cachedToken === 1) {
      // Token valid found in cache redis
      // Add Id in client socket
      client.data.userId = userId;
    } else {
      // Token invalid, not in cache redis, disconnect client
      console.log('Token not found, unauthorized');
      this.wsErrorHandlerService.emitError(client, new BadRequestException('Invalid or expired token, please regenerate it.'));
      client.disconnect();
      return;
    }

    // We can use userId and decoded
    // Put user connected in cache redis
    // userId → {socketId, ..}
    await redis.sadd(RedisCacheKey.getUserConnected(userId), client.id);
    await redis.expire(RedisCacheKey.getUserConnected(userId), this.TTL); // TTL de 5 minutes (300 secondes)
    // socketId → userId
    await this.redisService.set(RedisCacheKey.getSocketConnected(client.id), userId, this.TTL); // TTL de 5 minutes (300 secondes)
    client.emit('user-joined', {
      message: `user joined the chat: ${client.id}`,
    });
  }

  /**
   * Handles a client disconnection.
   * @param client - The client socket.
   */
  async handleDisconnect(client: Socket) {
    // Externaliser la clé socket connected et les autres, tester handle disconnect
    console.log('--disc', client.id);
    // socketId → userId
    const userId = await this.redisService.get(RedisCacheKey.getSocketConnected(client.id));
    console.log('--disc', userId);
    if (!userId) return;

    const redis = await this.redisService.getIoRedis();
    // Remove userId → socketId, now userId → {..clients..}\socketId
    await redis.srem(RedisCacheKey.getUserConnected(userId), client.id);
    // Remove socketId
    await this.redisService.delete(RedisCacheKey.getSocketConnected(client.id));
    console.log(`User disconnected: ${client.id}`);

    const activeConnections = await redis.scard(RedisCacheKey.getUserConnected(userId));
    console.log('a--active con-', activeConnections);
    if (activeConnections === 0) {
      // User doesn't have any connections, disconnect
      await this.redisService.delete(RedisCacheKey.getUserConnected(userId));
      console.log(`User ${userId} has no more active connections, removed from Redis.`);
    }
    console.log('--fin');
  }

}
