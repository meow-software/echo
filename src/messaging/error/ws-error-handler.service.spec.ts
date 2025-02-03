import { WsErrorHandlerService } from "./ws-error-handler.service";
import { UnauthorizedException } from "@nestjs/common";

describe('WsErrorHandlerService', () => {
  let wsErrorHandlerService: WsErrorHandlerService;
  let mockClient: any;

  beforeEach(() => {
    // Initialize the service before each test
    wsErrorHandlerService = new WsErrorHandlerService();
    // Mock WebSocket client
    mockClient = {
      emit: jest.fn(),
    };
  });

  it('should be defined', () => {
    // Check if the service is defined
    expect(wsErrorHandlerService).toBeDefined();
  });

  it('should call client.emit with error response when emitError is called', () => {
    // Create an UnauthorizedException with a custom message
    const error = new UnauthorizedException('Access denied');

    // Call the emitError method
    wsErrorHandlerService.emitError(mockClient, error);

    // Verify that the client.emit method was called with the correct arguments
    expect(mockClient.emit).toHaveBeenCalledWith('error', {
      statusCode: 401,  // HTTP status code
      message: 'Access denied',  // Error message
      error: 'UnauthorizedException',  // Type of the exception
    });
  });

  it('should format error response correctly', () => {
    // Create an UnauthorizedException with a custom message
    const error = new UnauthorizedException('Access denied');
    
    // Call the formatErrorResponse method (private, but can be tested here if needed)
    const formattedError = (wsErrorHandlerService as any).formatErrorResponse(error);

    // Verify that the error response is formatted correctly
    expect(formattedError).toEqual({
      statusCode: 401,  // HTTP status code
      message: 'Access denied',  // Error message
      error: 'UnauthorizedException',  // Type of the exception
    });
  });
});
