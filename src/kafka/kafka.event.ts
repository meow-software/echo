import { EchoEvent } from "src/messaging/echo-event";

/**
 * Represents a Kafka event (topic) that extends from the EchoEvent class.
 * 
 * @extends {EchoEvent}
 */
export class KAFKA_EVENT extends EchoEvent {
}

/**
 * Interface for Kafka event handlers. A handler processes messages of a specific event type.
 * 
 * @interface
 */
export interface KafkaEventHandler {
  /**
   * The event type (topic) that this handler processes.
   * 
   * @type {KAFKA_EVENT}
   */
  eventType: KAFKA_EVENT;

  /**
   * Handles the event message for a specific Kafka event.
   * 
   * @param {any} message - The message to handle.
   * @returns {void} - No return value, the handler processes the event.
   */
  handleEvent(message: any): void;
}
