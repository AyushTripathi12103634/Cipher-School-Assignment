import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema({
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    selections: [{
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
      },
      option: {
        type: String,
        required: true,
      },
      savedAt: {
        type: Date,
        required: true,
      },
    }],
    endedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);
  
export default mongoose.model('Submission', SubmissionSchema);
  