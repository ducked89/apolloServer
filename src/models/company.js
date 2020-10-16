const mongoose = require("mongoose");
const { enumArray } = require("../constants");

const companySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      // unique: true,
      required: true,
    },
    logo: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    address: {
      street: String,
      city: String,
      postale: String,
      state: String,
      country: String,
    },
    subscription: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Subscription",
        unique: true,
      },
    ],
    status: {
      type: String,
      enum: enumArray.status.value,
      default: enumArray.status.default,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
