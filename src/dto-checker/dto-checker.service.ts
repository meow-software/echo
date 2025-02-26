import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class DtoChecker {
    /**
     * Validates an object against the given DTO class.
     * @param dtoClass - The DTO class to validate against.
     * @param payload - The object to be validated.
     * @returns errors - An array of validation errors (empty if the object is valid).
     */
    async check(dtoClass: any, payload: any): Promise<string[]> {
        // Convert the payload into an instance of the DTO class
        const dtoObject = plainToInstance(dtoClass, payload);

        // Validate the object using class-validator
        const errors = await validate(dtoObject);

        // If validation errors are found, return them as a formatted array
        if (errors.length > 0) {
            console.log(errors.length, errors);
            return errors.map(err =>
                `${err.property}: ${err.constraints ? Object.values(err.constraints).join(', ') : 'unknown error'}`
            );
        }

        // If no errors are found, return an empty array
        return [];
    }
}
