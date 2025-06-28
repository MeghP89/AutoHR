const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('./auth/passport'); // Adjust the path as necessary
const emailRoutes = require('./routes/emailRoutes');
const authRoutes = require('./routes/authRoutes'); // Assuming you have an auth route for Google login
const ticketRoutes = require('./routes/ticketRoutes')
const connectDB = require('./database/index'); // Assuming you have a database connection module

connectDB();
const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json());
app.use(session({
  secret: 'your-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // must be false in development (no HTTPS)
    sameSite: 'lax' // or 'none' if frontend is on different domain and HTTPS
  }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/api', emailRoutes);
app.use('/api/tickets', ticketRoutes)
app.use(authRoutes); // Use the auth routes for Google login

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
