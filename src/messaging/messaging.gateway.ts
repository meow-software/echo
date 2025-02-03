import { JwtService } from '@nestjs/jwt';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatProducerService } from 'src/kafka/producers/chat.producer.service';
import { RedisClientService } from 'src/redis/redis.client.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { WsErrorHandlerService } from './error/ws-error-handler.service';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({ cors: { origin: '*' } })
export class MessagingGateway {
  @WebSocketServer() server: any;

  // IF CHANGE KEY, EDIT AUTHSERVICE
  private readonly REDIS_CACHE_USER_TOKEN = `USER:TOKENS:`;
  private readonly REDIS_CACHE_USER_CONNECTED = `user:connected:`;
  private readonly REDIS_CACHE_SOCKET_CONNECTED= `socket:connected:`;
  private readonly TTL: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisClientService,
    private readonly chatProducerService: ChatProducerService,
    private readonly wsErrorHandlerService: WsErrorHandlerService,
    private readonly configService: ConfigService
  ) {
    this.TTL = parseInt(this.configService.get("JWT_EXPIRES_IN", "3600"));
  }

  async handleConnection(client: Socket) {
    // just for dev 
    client.emit("user-joined", {
      message: `user joined the chat: ${client.id}`
    })
    return 
    // Extract token JWT
    const token = client.handshake.headers.authorization || "efface moi"; // TODO
    if (!token) {
      // Not token found
      this.wsErrorHandlerService.emitError(client, new UnauthorizedException('No authorization token, please add it.'));
      client.disconnect();
      return;
    }
    // Decode token without verification
    let decoded, userId;
    try {
      // try decode
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
      // 'Error decoding token:
      this.wsErrorHandlerService.emitError(client, new BadRequestException('Invalid token format.'));
      client.disconnect();
      return;
    }
    // Check legitimity of JWT Token
    const redis = await this.redisService.getIoRedis();
    const cachedToken = await redis.sismember(`${this.REDIS_CACHE_USER_TOKEN}${userId}`, token);

    if (cachedToken === 1) {
      // Token valid found in cache redis
      // Add Id in client socket 
      client.data.userId = userId;
    } else {
      // Token invalid, not in cache redis, deconect client
      console.log('Token not found, unauthorized');
      this.wsErrorHandlerService.emitError(client, new BadRequestException('Invalid or expired token, please regenerate it.'));
      client.disconnect();
      return;
    }
    // We can use userId and decoded
    // Put user connected in cache redis
    // userId → {socketId, ..}
    await redis.sadd(`${this.REDIS_CACHE_USER_CONNECTED}${userId}`, client.id);
    await redis.expire(`${this.REDIS_CACHE_USER_CONNECTED}${userId}`, this.TTL);  // TTL de 5 minutes (300 secondes)
    // socketId → userId
    await this.redisService.set(`${this.REDIS_CACHE_SOCKET_CONNECTED}${client.id}`, userId, this.TTL);  // TTL de 5 minutes (300 secondes)
    client.emit("user-joined", {
      message: `user joined the chat: ${client.id}`
    })
  }

  async handleDisconnect(client: Socket) {
    // externaliser la cle socket conencted et les autres, tester handle disconenct
    console.log("--disc", client.id)
    // socketId → userId
    const userId = await this.redisService.get(`${this.REDIS_CACHE_SOCKET_CONNECTED}${client.id}`);
    console.log("--disc", userId)
    if (!userId) return;
    const redis = await this.redisService.getIoRedis();
    // remove userId → socketId, now userId → {..clients..}\socketId
    await redis.srem(`${this.REDIS_CACHE_USER_CONNECTED}${userId}`, client.id);
    // remove socketId
    await this.redisService.delete(`${this.REDIS_CACHE_SOCKET_CONNECTED}${client.id}`);
    console.log(`User disconnected: ${client.id}`);
    const activeConnections = await redis.scard(`${this.REDIS_CACHE_USER_CONNECTED}${userId}`);
    console.log("a--active con-", activeConnections);
    if (activeConnections === 0) {
      // user doesnt have connect, disconnect
      await this.redisService.delete(`${this.REDIS_CACHE_USER_CONNECTED}${userId}`);
      console.log(`User ${userId} has no more active connections, removed from Redis.`);
    }
    console.log("--fin")
    // this.server.emit("user-leaved", {
    //   message: `user leaved the chat: ${client.id}`
    // })
  }

  // Méthode de gestion des messages envoyés par les clients
  @SubscribeMessage('send_message')
  async handleMessage(@MessageBody() message: string, @ConnectedSocket() client: Socket) {
    console.log(`Message from ${client.id}: ${message}`);
    this.chatProducerService.send("SEND_MESSAGE", message);
    // Emit message to Kafka (for other microservices or services)
    // await this.kafkaClient.emit('message-topic', {
    //   sender: client.id,
    //   message,
    // });
    // Émettre le message à tous les clients WebSocket connectés
    // this.server.emit('receive_message', {
    //   sender: client.id,
    //   message,
    // });
  }
}
