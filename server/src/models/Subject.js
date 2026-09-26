import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Topic title is required'],
      trim: true
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed', 'Needs Revision'],
      default: 'Not Started'
    },
    confidence: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    estimatedHours: {
      type: Number,
      default: 3
    },
    loggedMinutes: {
      type: Number,
      default: 0
    },
    notes: {
      type: String,
      default: ''
    },
    keyFormulas: [
      {
        type: String
      }
    ],
    lastStudied: {
      type: Date
    },
    nextRevisionDate: {
      type: Date
    },
    revisionCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const subjectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true
    },
    color: {
      type: String,
      default: '#6366f1' // Indigo
    },
    icon: {
      type: String,
      default: 'BookOpen'
    },
    targetHours: {
      type: Number,
      default: 30
    },
    topics: [topicSchema]
  },
  {
    timestamps: true
  }
);

// Virtual for completion percentage
subjectSchema.virtual('completionRate').get(function () {
  if (!this.topics || this.topics.length === 0) return 0;
  const completed = this.topics.filter(t => t.status === 'Completed').length;
  return Math.round((completed / this.topics.length) * 100);
});

subjectSchema.set('toJSON', { virtuals: true });
subjectSchema.set('toObject', { virtuals: true });

export const Subject = mongoose.model('Subject', subjectSchema);
