const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
const bcrypt = require("bcryptjs");
const ObjectId = require("mongodb").ObjectId;

const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
  uri: process.env.ATLAS_URI,
  collection: "sessions"
});

store.on("error", function(error) {
  console.log(error);
});

app.use(
  session({
    secret: "LYMC", 
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  if (!ObjectId.isValid(id)) {
    return done(new Error('Invalid user ID'));
  }  
  let db_connect = dbo.getDb("VintageRoom");
  db_connect
    .collection("Users")
    .findOne({ _id: ObjectId(id) }, function (err, user) {
      done(err, user);
    });
});

const LocalStrategy = require("passport-local").Strategy;

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      let db_connect = dbo.getDb("VintageRoom");
      db_connect
        .collection("Users")
        .findOne({ email: email }, function (err, user) {
          if (err) {
            return done(err);
          }
          if (user) {
            return done(null, false, { message: "That email is already taken." });
          } else {
            let newUser = {
              name: req.body.name,
              email: email,
              password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
            };

            db_connect
              .collection("Users")
              .insertOne(newUser, function (err, result) {
                if (err) {
                  console.error("Error while creating new user:", err);
                  return done(err);
                }
                console.log("New user created successfully");
                return done(null, result.ops[0]);
              });
          }
        });
    }
  )
);

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      let db_connect = dbo.getDb("VintageRoom");
      db_connect
        .collection("Users")
        .findOne({ email: email }, function (err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, { message: "Incorrect email." });
          }
          if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false, { message: "Incorrect password." });
          }
          return done(null, user);
        });
    }
  )
);

app.use(require("./routes/record"));
const dbo = require("./db/conn");

app.listen(port, () => {
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});

