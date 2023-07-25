const express = require("express");
const passport = require("passport");
const bcrypt = require('bcrypt');
const dbo = require("../db/conn");

const recordRoutes = express.Router();
const ObjectId = require("mongodb").ObjectId;

recordRoutes.route("/record").get(function (req, res) {
  let db_connect = dbo.getDb("VintageRoom");
  db_connect
    .collection("Products")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

recordRoutes.route("/record/:id").get(function (req, res) {
  let db_connect = dbo.getDb("VintageRoom");
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("Products").findOne(myquery, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

recordRoutes.route("/filter").get(function (req, res) {
  const category = req.query.category;
  let sizeQuery = { category: category };
  const size = req.query.size;
  if (size !== "all") {
    sizeQuery.size = size;
  }
  let db_connect = dbo.getDb("VintageRoom");
  db_connect
    .collection("Products")
    .find(sizeQuery)
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

recordRoutes.route("/signup").post(function (req, res, next) {
  let db_connect = dbo.getDb("VintageRoom");
  db_connect.collection("Users").findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.error("Error while finding user:", err);
      return next(err);
    }
    if (user) {
      return res.status(400).send({success: false, message: "That email is already taken." });
    } else {
      passport.authenticate("local-signup", function (err, user, info) {
        if (err) {
          console.error("Passport.authenticate error:", err);
          return next(err);
        }
        if (!user) {
          return res.send({ success: false, message: "Authentication failed." });
        }
        req.logIn(user, function (err) {
          if (err) {
            console.error("req.logIn error:", err);
            return next(err);
          }
          return res.send({
            success: true,
            message: "Authentication succeeded.",
          });
        });
      })(req, res, next);
    }
  });
});

recordRoutes.route("/login").post(function (req, res, next) {
  passport.authenticate("local-login", function (err, user, info) {
    if (err) {
      console.error("Passport.authenticate error:", err);
      return next(err);
    }
    if (!user) {
      return res.send({ success: false, message: "There was a problem logging in. Check your email and password or create an account." });
    }
    req.logIn(user, function (err) {
      if (err) {
        console.error("req.logIn error:", err);
        return next(err);
      }
      return res.send({
        success: true,
        message: "Successful login! Redirecting to home page...",
      });
    });
  })(req, res, next);
});

recordRoutes.route('/update-password').put(async function(req, res) {
  try {
    const { email, newPassword } = req.body;
    const hashedPassword = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
    const db_connect = dbo.getDb("VintageRoom");
    const result = await db_connect.collection("Users").updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );
    if (result.modifiedCount === 0) {
      return res.send({ success: false, message: "Unable to update password" });
    }
    return res.send({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating password" });
  }
});

recordRoutes.route("/logout").post(function (req, res) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/record');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({success: false, message:'You need to log in to access this page'})
}

recordRoutes.route('/user').get(isLoggedIn, function (req, res) {
  res.send(req.user);
});

recordRoutes.route('/cart').get(isLoggedIn, async function(req, res) {
  try {
    const cart = req.session.cart || {};
    const itemIds = Object.keys(cart);

    const db_connect = dbo.getDb("VintageRoom");
    const cartItems = await db_connect.collection("Products").find(
      { id: { $in: itemIds } },
      { projection: { id : 1, productName: 1, imgUrl: 1, size : 1, price : 1} }
    ).toArray();

    const totalAmount = cartItems.reduce((acc, product) => acc + product.price, 0);
    const totalQuantity = itemIds.length;

    res.json({ cartItems, totalAmount, totalQuantity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching cart items" });
  }
});

recordRoutes.route("/add-to-cart/:id").post(isLoggedIn, function (req, res) {
  const itemId = req.params.id;
  const cart = req.session.cart || {};

  if (cart[itemId]) {
    return res.status(400).json({ success: false, message: 'Item is already in cart' });
  }

  cart[itemId] = true;

  req.session.cart = cart;

  res.json({ success: true, message: 'Product added to cart' });
});

recordRoutes.route('/checkout').post(isLoggedIn, async function(req, res) {
  const userId = req.user._id;
  const cart = req.session.cart;

  if (!cart) {
    return res.json({ success: false, message: 'No items in cart' });
  }

  const cartItems = Object.keys(cart);

  try {
    const db_connect = dbo.getDb("VintageRoom");
    const ordersCollection = db_connect.collection('Orders');

    const productIds = Object.keys(cart);
    const products = await db_connect.collection("Products").find(
      { id: { $in: productIds } },
      { projection: { price: 1 } }
    ).toArray();

    const amount = products.reduce((acc, product) => acc + product.price, 0);
    const orderItems = productIds.map(itemId => ({ _id: itemId }));
    
    const order = {
      user_id: userId,
      items: orderItems,
      date: new Date(),
      totalAmount: amount,
      totalQuantity: cartItems.length
    };
    const orderResult = await ordersCollection.insertOne(order);
    console.log(orderResult.insertedCount + ' order added to orders collection');

    delete req.session.cart;

    res.json({ success: true, message: 'Order placed successfully' });
  } catch (err) {
    console.error('Error placing order:', err);
    res.json({ success: false, message: 'Error placing order' });
  }
});

recordRoutes.route("/delete-from-cart/:id").delete(function(req, res) {
  const itemId = req.params.id;
  const cart = req.session.cart || {};

  if (!cart[itemId]) {
    return res.status(400).json({ message: 'Item not found in cart' });
  }

  delete cart[itemId];

  req.session.cart = cart;

  res.json({ success: true, message: 'Product removed from cart' });
});

recordRoutes.route('/order').get(isLoggedIn, async function(req, res) {
  try {
    const userId = req.user._id;

    const db_connect = dbo.getDb("VintageRoom");
    const ordersCollection = db_connect.collection('Orders');

    const orders = await ordersCollection.find({ user_id: userId }).toArray();

    const totalAmount = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const totalQuantity = orders.reduce((acc, order) => acc + order.totalQuantity, 0);

    res.json({ totalAmount, totalQuantity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching orders summary" });
  }
});

module.exports = recordRoutes;
