import mongoose from 'mongoose';

const mockTestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Mock test title is required'],
      trim: true
    },
    subjectName: {
      type: String,
      default: 'Full Syllabus'
    },
    totalMarks: {
      type: Number,
      required: true,
      min: 1
    },
    scoreObtained: {
      type: Number,
      required: true,
      min: 0
    },
    percentage: {
      type: Number
    },
    timeTakenMinutes: {
      type: Number,
      default: 60
    },
    testDate: {
      type: Date,
      default: Date.now
    },
    weakAreas: [
      {
        type: String
      }
    ],
    strongAreas: [
      {
        type: String
      }
    ],
    reflectionNotes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

mockTestSchema.pre('save', function (next) {
  if (this.totalMarks > 0) {
    this.percentage = Math.round((this.scoreObtained / this.totalMarks) * 100);
  }
  next();
});

export const MockTest = mongoose.models.MockTest || mongoose.model('MockTest', mockTestSchema);
