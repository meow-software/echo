
import { KafkaEventHandler } from "./kafka.event";
import { OnModuleDestroy, OnModuleInit } from "@nestjs/common";

import { Kafka, Consumer, KafkaMessage, EachMessagePayload } from 'kafkajs';

/**
 * Abstract class representing a Kafka consumer that connects to a Kafka server
 * and consumes Kafka event messages based on event handlers.
 * Implements `OnModuleInit` and `OnModuleDestroy` from NestJS.
 * 
 * @abstract
 */
export abstract class KafkaConsumer implements OnModuleInit, OnModuleDestroy {
  protected consumer: Consumer;
  protected client: Kafka;
  protected handlers: KafkaEventHandler[] = [];
  /**
     * Instantiates a Kafka consumer.
     * 
     * @param {Kafka} kafka - The Kafka client instance.
     * @param {string} groupId - The Kafka consumer group ID.
     */
  constructor(kafka: Kafka, groupId: string) {
    this.client = kafka;
    this.consumer = kafka.consumer({ groupId });
  }
  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }
  /**
     * Subscribes an event handler to a specific Kafka event type (topics).
     * 
     * @param {KafkaEventHandler} handler - The event handler instance.
     * @async
     * @returns {Promise<void>} - Promise resolved once the handler is successfully subscribed.
     */
  async subscribeToHandler(handler: KafkaEventHandler) {
    this.handlers.push(handler);
    await this.consumer.subscribe({ topic: handler.eventType as string });
  }
  /**
     * Runs the Kafka consumer to consume messages from subscribed topics.
     * 
     * @async
     * @returns {Promise<void>} - Promise resolved once the consumer is running.
     */
  async run() {
    await this.consumer.run({
      eachMessage: async (eachMessage) => {
        this.consumeMessage(eachMessage.topic, eachMessage.message, eachMessage);
      },
    });
  }
  /**
     * Consumes a Kafka message and calls the appropriate event handler.
     * 
     * @param {string} event - The Kafka event type (topic).
     * @param {KafkaMessage} message - The Kafka message to consume.
     * @param {EachMessagePayload} [eachMessage] - Additional metadata about the message.
     */
  protected consumeMessage(event: string, message: KafkaMessage, eachMessage?: EachMessagePayload): void {
    const handler = this.handlers.find(h => h.eventType as string === event);

    if (handler) {
      handler.handleEvent(this.fromKafkaMessageToObj(message).value);
    }
  }

  /**
   * Transforms a Kafka message into an object usable by the application.
   * 
   * @protected
   * @param {KafkaMessage} message - The Kafka message to transform.
   * @returns {any} - The transformed object derived from the Kafka message; key, value, and headers.
   */
  protected fromKafkaMessageToObj(message: KafkaMessage): any {
    const key = message.key?.toString();
    const value = message.value ? JSON.parse(message.value.toString()) : null;
    const headers = Object.fromEntries(
      Object.entries(message.headers || {}).map(([key, value]) => [key, value?.toString()])
    );
    return { key, value, headers };
  }

  async connect() {
    await this.consumer.connect();
  }

  async disconnect() {
    await this.consumer.disconnect();
  }
}