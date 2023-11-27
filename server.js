import 'module-alias/register.js';

import express from 'express';
import routes from './src/routes/index.js';

const app = express();
const port = process.env.PORT || 10000;

app.use('/api/v1', routes);

const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});