const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json())
app.use('/',require('./routes/userRoutes'));

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});