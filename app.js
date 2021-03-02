require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var hbs = require("express-handlebars");
var mongoose = require("mongoose");

var userRouter = require("./routes/user");
var tutorRouter = require("./routes/tutor");
var adminRouter = require("./routes/admin");

var app = express();

// Database Connection
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
});
const connection = mongoose.connection;
connection
  .once("open", () => {
    console.log("Database Connected Successfully");
  })
  .catch((err) => {
    console.log(`Something Happened To Mongodb ${err}`);
  });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layout/",
    partialsDir: __dirname + "/views/partials/",
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", userRouter);
app.use("/tutor", tutorRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("errors/error");
});

module.exports = app;
