const express = require('express');
const session = require('express-session');
const passport = require('./auth/passport'); // Adjust the path as necessary
const app = express();
const emailRoutes = require('./routes/email');
const authRoutes = require('./routes/auth'); // Assuming you have an auth route for Google login
const connectDB = require('./database/index'); // Assuming you have a database connection module

connectDB();

app.use(express.json());
app.use(session({ secret: 'your-secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api', emailRoutes);
app.use(authRoutes); // Use the auth routes for Google login

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
