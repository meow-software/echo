import { BadRequestException, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Socket } from 'socket.io';
import { EchoEvent } from 'src/messaging/echo-event';
import { WsErrorHandlerService } from 'src/messaging/error/ws-error-handler.service';

@Injectable()
export class DtoChecker {
  constructor(
    private readonly wsErrorHandlerService: WsErrorHandlerService
  ) {}
    /**
     * Validates an object against the given DTO class.
     * @param dtoClass - The DTO class to validate against.
     * @param payload - The object to be validated.
     * @returns errors - An array of validation errors (empty if the object is valid).
     */
    async check(dtoClass: any, payload: any): Promise<any[]> {
        // Convert the payload into an instance of the DTO class
        const dtoObject = plainToInstance(dtoClass, payload);

        // Validate the object using class-validator
        const errors = await validate(dtoObject);

        // If validation errors are found, return them as a formatted array
        if (errors.length > 0) { 
            return errors.map((error) => ({
              property: error.property,
              constraints: error.constraints,
            }))
        }

        // If no errors are found, return an empty array
        return [];
    }

    /**
     * Validates an object against a DTO and emits errors to the client if any.
     * @param client - The WebSocket client.
     * @param dtoClass - The DTO class to validate against.
     * @param payload - The object to be validated.
     * @returns boolean - True if there are errors (to stop execution), False if valid.
     */
    async checkAndEmitErrors(client: Socket, dtoClass: any, payload: any): Promise<boolean> {
        const errors = await this.check(dtoClass, payload);

        if (errors.length > 0) {
            this.wsErrorHandlerService.emitError(client, new BadRequestException(errors));
            return true;
        }

        return false;
    }
}
