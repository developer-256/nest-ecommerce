import { Optional } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

/**
 * @info also add the variable name in .env.example and environment.d.ts
 */

export enum NODE_ENV_ENUM {
  DEVELOPMENT = 'development',
  TESTING = 'testing',
  PRODUCTION = 'production',
}

class EnvironmentVariables {
  @IsEnum({ enum: NODE_ENV_ENUM, default: NODE_ENV_ENUM.DEVELOPMENT })
  NODE_ENV: string;

  @IsString()
  DATABASE_URL: string;

  @IsNumber()
  APP_LISTEN_PORT: number;

  @IsString()
  ACCESS_TOKEN_SECRET: string;
  @IsNumber()
  ACCESS_TOKEN_EXPIRY_IN_SEC: number;

  @IsString()
  REFRESH_TOKEN_SECRET: string;
  @IsNumber()
  REFRESH_TOKEN_EXPIRY_IN_SEC: number;

  @IsString()
  GMAIL_SENDER_EMAIL: string;
  @IsString()
  GMAIL_APP_PASSWORD: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
