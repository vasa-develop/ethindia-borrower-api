const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Product.find()

    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            title: doc.title,
            image: doc.image,
            _id: doc._id,
            description: doc.description,
            ownerName: doc.ownerName,
            listedDate: doc.listedDate,
            goal: doc.goal,
            goalPledge: doc.goalPledge,
            backer: doc.backer,
            endDate: doc.endDate,
            website: doc.website,

            request: {
              type: "GET",
              url: "http://localhost:5000/products/" + doc._id
            }
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", (req, res, next) => {
  console.log("post upload ", req.files[0].path)
  let date = new Date();
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    image: req.files[0].path,
    description: req.body.description,
    ownerName: req.body.ownerName,
    listedDate: date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate(),
    goal: req.body.goal,
    endDate: req.body.endDate,
    goalPledge: 0,
    backer: 0,
    website: req.body.website,
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
          title: result.title,
          image: result.image,
          description: result.description,
          ownerName: result.ownerName,
          listedDate: result.listedDate,
          goal: result.goal,
          goalPledge: result.goalPledge,
          backer: result.backer,
          endDate: result.endDate,
          website: result.website,

          _id: result._id,
          request: {
            type: 'GET',
            url: "http://localhost:5000/products/" + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            url: 'http://localhost:5000/products'
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  console.log("typeof: ", req.body)

  Product.update({ _id: id, }, { $set: req.body })
    .exec()
    .then(result => {

      res.status(200).json({
        message: 'Product updated',
        result: result
      })
    })
    .catch(err => {
      console.log("HiT")
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
