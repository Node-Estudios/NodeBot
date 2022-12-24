const { Schema, model } = require("mongoose");

const modelo = Schema(
  {
    userID: { type: String, required: true },
    reports: [
      {
        description: { type: String, required: true },
        happen: { type: String, required: true },
        expected: { type: String, required: true },
        created_at: { type: Date, default: Date.now },
      },
    ],
  },
  {
    collection: "Reports",
  }
);

module.exports = model("Reports", modelo);
