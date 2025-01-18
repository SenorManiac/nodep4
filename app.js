const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('./controllers/passport'); // Import the configured passport
const flash = require('connect-flash'); // Import connect-flash
require('dotenv').config();
const indexRouter = require('./routes/index');

const app = express();
const PORT = 3000;

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: require('crypto').randomBytes(64).toString('hex'),
        resave: false,
        saveUninitialized: false,
    })
);

app.use(flash()); // Use flash middleware

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.success_messages = req.flash('success');
    res.locals.error_messages = req.flash('error');
    next();
});

app.use("/", indexRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
module.exports = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
};
