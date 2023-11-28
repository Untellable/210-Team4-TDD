import 'module-alias/register.js';

import express from 'express';
import routes from './src/routes/index.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/utils/swaggerSpec.js';


const app = express();
const port = process.env.PORT || 10000;


app.use('/api/v1', routes);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    displayRequestDuration: true
}));
const server = app.listen(port, function () {
    console.log(`Server listening on port ${port}`);
});