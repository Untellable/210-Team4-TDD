require('module-alias/register');

const express = require('express');
const routes = require('@/routes/index.js');

const app = express();
const port = process.env.PORT || 10000;

app.use('/api/v1', routes);

const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});