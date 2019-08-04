const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  ownerName: { type: String, required: true },
  listedDate: { type: String, required: true },
  endDate: { type: String, required: true },
  goal: { type: Number, required: true },
  goalPledge: { type: Number, required: true },
  backer: { type: Number, required: true },

  website: { type: String, required: true },


});

module.exports = mongoose.model('Product', productSchema);
