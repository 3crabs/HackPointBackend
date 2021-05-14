import { defaultMetadataStorage } from 'class-transformer/storage';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import basicAuth from 'express-basic-auth';
import * as fs from 'fs';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import * as path from 'path';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';

import { env } from '../env';

export const swaggerLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings && env.swagger.enabled) {
        const expressApp = settings.getData('express_app');

        let swaggerFile: any;

        if (env.swagger.autogenerationEnabled) {
            const schemas = validationMetadatasToSchemas({
                classTransformerMetadataStorage: defaultMetadataStorage,
                refPointerPrefix: '#/components/schemas/',
            });

            swaggerFile = routingControllersToSpec(
                getMetadataArgsStorage(),
                { },
                {
                    components: {
                        schemas,
                        securitySchemes: {
                            ApiKeyAuth: {
                                type: 'apiKey',
                                in: 'header',
                                name: 'Access',
                            },
                        },
                    },
                }
            );
        } else {
            swaggerFile = YAML.load(path.join(__dirname, '..', env.swagger.filePath));
        }

        // Add npm infos to the swagger doc
        swaggerFile.info = {
            title: env.app.name,
            description: env.app.description,
            version: env.app.version,
        };

        swaggerFile.servers = [
            {
                url: env.app.schema === 'https'
                    ? `${env.app.schema}://${env.app.host}${env.app.routePrefix}`
                    : `${env.app.schema}://${env.app.host}:${env.app.port}${env.app.routePrefix}`,
            },
        ];

        if (env.swagger.fileEnabled) {
            fs.writeFileSync(env.swagger.filePath, JSON.stringify(swaggerFile, undefined, 2));
        }

        expressApp.use(
            env.swagger.route,
            env.swagger.username ? basicAuth({
                users: {
                    [`${env.swagger.username}`]: env.swagger.password,
                },
                challenge: true,
            }) : (req, res, next) => next(),
            swaggerUi.serve,
            swaggerUi.setup(swaggerFile)
        );

    }
};
