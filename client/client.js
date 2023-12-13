const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

app.use(express.static(path.join(__dirname, 'src')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'welcomepage.html'));
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
