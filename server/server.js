const express = require('express');
const app = express();
const emailRoutes = require('./routes/email');
const connectDB = require('./database/index'); // Assuming you have a database connection module

connectDB();

app.use(express.json());
app.use('/api', emailRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
