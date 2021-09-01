import * as dotenv from 'dotenv';
import * as path from 'path';

import * as pkg from '../package.json';
import {
    getCookieSamesiteOption, getOsEnv, getOsEnvArray, getOsEnvOptional, getOsPath, getOsPaths,
    normalizePort, toBool, toNumber
} from './lib/env';

/**
 * Load .env file or for tests the .env.test file.
 */
dotenv.config({ path: path.join(process.cwd(), `.env${((process.env.NODE_ENV === 'test') ? '.test' : '')}`) });

/**
 * Environment variables
 */
export const env = {
    node: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
    isDevelopment: process.env.NODE_ENV === 'development',
    app: {
        name: getOsEnv('APP_NAME'),
        version: (pkg as any).version,
        description: (pkg as any).description,
        host: getOsEnv('APP_HOST'),
        schema: getOsEnv('APP_SCHEMA'),
        routePrefix: getOsEnv('APP_ROUTE_PREFIX'),
        port: normalizePort(process.env.PORT || getOsEnv('APP_PORT')),
        banner: toBool(getOsEnv('APP_BANNER')),
        apiKey: getOsEnv('APP_API_KEY'),
        corsWhitelist: getOsEnvArray('APP_CORS_WHITELIST'),
        jwtSecret: getOsEnv('JWT_SECRET'),
        dirs: {
            migrations: getOsPaths('TYPEORM_MIGRATIONS'),
            migrationsDir: getOsPath('TYPEORM_MIGRATIONS_DIR'),
            entities: getOsPaths('TYPEORM_ENTITIES'),
            entitiesDir: getOsPath('TYPEORM_ENTITIES_DIR'),
            controllers: getOsPaths('CONTROLLERS'),
            middlewares: getOsPaths('MIDDLEWARES'),
            interceptors: getOsPaths('INTERCEPTORS'),
            subscribers: getOsPaths('SUBSCRIBERS'),
            resolvers: getOsPaths('RESOLVERS'),
        },
        cookie: {
            httpOnly: toBool(getOsEnv('APP_AUTH_COOKIE_HTTPONLY')),
            secure: toBool(getOsEnv('APP_AUTH_COOKIE_SECURE')),
            sameSite: getCookieSamesiteOption('APP_AUTH_COOKIE_SAMESITE'),
        },
    },
    log: {
        level: getOsEnv('LOG_LEVEL'),
        output: getOsEnv('LOG_OUTPUT'),
        file: toBool(getOsEnv('LOG_FILE')),
        filepath: getOsEnvOptional('LOG_FILEPATH'),
        filename: getOsEnvOptional('LOG_FILENAME'),
        rotate: toBool(getOsEnv('LOG_ROTATE')),
    },
    db: {
        url: getOsEnvOptional('TYPEORM_URL'),
        type: getOsEnv('TYPEORM_CONNECTION'),
        database: getOsEnv('TYPEORM_DATABASE'),
        logging: getOsEnv('TYPEORM_LOGGING'),
    },
    swagger: {
        enabled: toBool(getOsEnv('SWAGGER_ENABLED')),
        autogenerationEnabled: toBool(getOsEnv('SWAGGER_AUTOGENERATION_ENABLED')),
        route: getOsEnv('SWAGGER_ROUTE'),
        username: getOsEnv('SWAGGER_USERNAME'),
        password: getOsEnv('SWAGGER_PASSWORD'),
        fileEnabled: toBool(getOsEnv('SWAGGER_FILE_ENABLED')),
        filePath: getOsEnv('SWAGGER_FILE_PATH'),
    },
    redis: {
        enabled: toBool(getOsEnv('REDIS_ENABLED')),
        uri: getOsEnv('REDIS_URL'),
        host: getOsEnv('REDIS_HOST'),
        port: toNumber(getOsEnv('REDIS_PORT')),
        password: getOsEnvOptional('REDIS_PASSWORD'),
    },
    monitor: {
        enabled: toBool(getOsEnv('MONITOR_ENABLED')),
        route: getOsEnv('MONITOR_ROUTE'),
        username: getOsEnv('MONITOR_USERNAME'),
        password: getOsEnv('MONITOR_PASSWORD'),
    },
};
