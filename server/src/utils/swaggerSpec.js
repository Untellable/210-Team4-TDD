import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Mastodon Visualization Data API',
            version: '1.0.0',
            description: 'TODO: Add description',
        },
    },
    apis: ['./src/api/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;