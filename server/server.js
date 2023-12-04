import express from 'express';
import routes from './src/api/router.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const app = express();
const port = process.env.PORT || 10000;
const options = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Mastodon Visualization Data API',
            version: '1.0.0',
            description: 'REST API for mastodon data visualization project',
        },
        tags: [
            {
                name: 'Account Services',
            },
        ],
    },
    apis: ['./src/api/*.js'],
};

app.use('/api/v1', routes);
app.use(
    '/api/v1/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerJSDoc(options), {
        displayRequestDuration: true,
    })
);
app.listen(port, function () {
    console.log(`Server listening on port ${port}`);
});
