import mongoose from "mongoose";

const questionschema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    options: [{
      type: String,
      required: true,
    }],
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      required: true,
    },
    marks: {
      type: Number,
      required: true,
    },
    correctOption: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Question", questionschema);