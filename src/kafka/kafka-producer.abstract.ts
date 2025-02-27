import { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { KAFKA_EVENT } from "./kafka.event";
import { Kafka } from "kafkajs";

/**
 * Abstract class representing a Kafka producer that sends messages to Kafka topics.
 * Implements `OnModuleInit` and `OnModuleDestroy` from NestJS.
 * 
 * @abstract
 */
export abstract class KafkaProducer implements OnModuleInit, OnModuleDestroy {
    /**
     * Kafka producer instance used to send messages.
     * 
     * @protected
     * @type {Producer}
     */
    protected producer;

    /**
     * Instantiates a Kafka producer.
     * 
     * @param {Kafka} kafka - The Kafka client instance.
     */
    constructor(kafka: Kafka) {
        this.producer = kafka.producer();
    }
    async onModuleInit() {
        await this.connect();
    }

    async onModuleDestroy() {
        await this.disconnect();
    }
    /**
     * Sends a message to a Kafka topic.
     * 
     * @async
     * @param {KAFKA_EVENT} topic - The Kafka event topic to send the message to.
     * @param {any} message - The message to send to the Kafka topic.
     * @returns {Promise<any>} - Promise resolved once the message is sent.
     */
    async send(topic: KAFKA_EVENT, message: any): Promise<any> {
        await this.producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });
    }
    async connect() {
        await this.producer.connect();
    }

    async disconnect() {
        await this.producer.disconnect();
    }
}