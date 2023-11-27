import path from 'path';
import 'module-alias/register.js';

import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import routes from './src/routes/index.js';

const app = express();
const port = process.env.PORT || 10000;
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Mastodon Visualization Data API',
            version: '1.0.0',
            description: 'TODO: Add description',
        },
    },
    apis: [path.resolve('./src/routes/*.js')],
};
const swaggerSpec = swaggerJSDoc(options);

app.use('/api/v1', routes);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});