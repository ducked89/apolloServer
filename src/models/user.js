const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const isEmail = require('validator/lib/isEmail');

// Local module
const { enumArray } = require("../constants");

const userSchema = new mongoose.Schema({
    pin: {
      type: String,
      minlength: 4,
      maxlength: 6
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 5,
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
    },
    displays: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Display"
      },
    ],
    playlists: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Playlist"
      },
    ],
    company: {
      type: mongoose.Types.ObjectId,
      ref: "Company"
    },
    role: {
      type: String,
      enum: enumArray.role.value,
      default: enumArray.role.default,
    },
    status: {
      type: String,
      enum: enumArray.status.value,
      default: enumArray.status.default,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.findByLogin = async function(login) {
  let user = await this.findOne({
    username: login,
  });

  if (!user) {
    user = await this.findOne({ email: login });
  }

  return user;
};

userSchema.pre('remove', function(next) {
  // this.model('MyModel').deleteMany({ userId: this._id }, next);
});

userSchema.pre('save', async function() {
  this.password = await this.generatePasswordHash();
});

userSchema.methods.generatePasswordHash = async function() {
  const saltRounds = 10;
  return await bcrypt.hash(this.password, saltRounds);
};

userSchema.methods.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
