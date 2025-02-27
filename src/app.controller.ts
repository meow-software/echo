import { Body, Controller, Get, Param, Post } from '@nestjs/common'; 
import { AppService } from './app.service';
import { IsString, IsInt, Min, Max } from 'class-validator';

export class CreateItemDto {
  @IsString({ message: 'Le nom doit être une chaîne de caractères.' })
  name: string;

  @IsInt({ message: 'La quantité doit être un nombre entier.' })
  @Min(1, { message: 'La quantité ne peut pas être inférieure à 1.' })
  @Max(100, { message: 'La quantité ne peut pas être supérieure à 100.' })
  quantity: number;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
