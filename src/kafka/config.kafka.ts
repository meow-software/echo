import { Kafka } from 'kafkajs';

/**
 * Configuration for Kafka client brokers used to connect to Kafka clusters.
 * 
 * @constant
 * @type {Object}
 * @property {string[]} brokers - A list of Kafka broker addresses.
 */
const clientBrokers = {
    brokers: ['localhost:29092', 'localhost:29093'],
};

/**
 * Kafka client provider configuration for NestJS module.
 * 
 * @constant
 * @type {Object}
 * @property {string} provide - The token used to inject the Kafka client service.
 * @property {Function} useFactory - Factory function that initializes and returns a Kafka instance.
 */
export const kafkaConfigClientModule = {
    provide: 'KAFKA_CLIENT', // Token for injecting Kafka client
    useFactory: () => {
        return new Kafka({
            clientId: 'nest-kafka', // The client identifier for Kafka.
            ...clientBrokers, // Merges in the broker configuration.
        });
    },
};