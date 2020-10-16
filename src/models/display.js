const mongoose = require("mongoose");
const { enumArray } = require("../constants");

const displaySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    },
    playlists: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Playlist",
        sparse: true
        // unique: true,
      },
    ],
    orientation: {
      type: String,
      enum: enumArray.orientation.value,
      default: enumArray.orientation.default
    },
    status: {
      type: String,
      enum: enumArray.status.value,
      default: enumArray.status.default
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Display", displaySchema);