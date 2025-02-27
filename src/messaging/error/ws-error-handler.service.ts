import { Injectable } from '@nestjs/common';
import { UnauthorizedException, NotFoundException, HttpException } from '@nestjs/common';
import { Socket } from 'socket.io';
import { EchoEvent } from '../echo-event';

@Injectable()
/**
 * Service for handling WebSocket errors. This service formats exceptions and emits
 * structured error responses to the client through WebSocket.
 * 
 * The main function of this service is to receive an exception, format it, and send
 * the error details to the WebSocket client.
 */
export class WsErrorHandlerService {
  /**
   * Emits an error response to the client through WebSocket.
   * 
   * This method formats the given error and sends the formatted error details to the
   * connected WebSocket client. The client will receive the HTTP status code, the
   * error message, and the type of the exception.
   * 
   * @param {Socket} client - The WebSocket client that will receive the error response.
   * @param {HttpException} error - The exception that contains the error details to be sent to the client.
   * 
   * @returns {void} This method does not return a value.
   * 
   * @example
   * // Example of emitting an UnauthorizedException to the WebSocket client
   * const error = new UnauthorizedException('Access denied');
   * this.wsErrorHandlerService.emitError(client, error);
   */
  emitError(client: Socket, error: HttpException) {
    console.log(error.getResponse());
    client.emit(EchoEvent.WebSocketError, this.formatErrorResponse(error)); // Envoie l'erreur au client via WebSocket
  }

  /**
   * Formats an exception into a structured error response to be sent to the client.
   * Extracts the HTTP status code, message, and error type (class name) from the given exception.
   * 
   * @param {HttpException} error - The exception to be formatted. It must extend HttpException, such as UnauthorizedException, NotFoundException, etc.
   * 
   * @returns {Object} A structured error response containing:
   *  - statusCode: The HTTP status code related to the error.
   *  - message: The error message.
   *  - error: The name of the exception class (e.g., UnauthorizedException).
   * 
   * @example
   * // Example of how the formatted error response might look:
   * const response = formatErrorResponse(new UnauthorizedException('Access denied'));
   * console.log(response);
   * // Output:
   * {
   *   statusCode: 401,
   *   errors: 'Access denied',
   *   error: 'UnauthorizedException'
   * }
   */
  private formatErrorResponse(error: HttpException) {
    const response = error.getResponse();
    
    if (Array.isArray(response['message'])) {
      const formattedErrors = response['message'].map((err) => ({
        property: err.property,
        constraints: err.constraints, 
      }))[0];
      console.log(formattedErrors)
      return {
        statusCode: error.getStatus(),
        errors: formattedErrors, 
        error: response['error'],
        message: Object.values(formattedErrors.constraints),
      };
    }

    return {
      statusCode: error.getStatus(),
      errors: [], 
      error: response['error'], 
      message: error.message,
    };
  }

}
