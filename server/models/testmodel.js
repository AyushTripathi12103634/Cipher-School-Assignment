import mongoose from "mongoose";

const testschema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    descriptions: {
      type: String,
      required: true,
    },
    questions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    }],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Test", testschema);