import mongoose from 'mongoose';

const studySessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: false
    },
    subjectName: {
      type: String,
      default: 'General Study'
    },
    topicTitle: {
      type: String,
      default: 'General'
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 1
    },
    sessionType: {
      type: String,
      enum: ['Pomodoro', 'Practice Questions', 'Theory Review', 'Mock Test', 'Flashcards'],
      default: 'Pomodoro'
    },
    notes: {
      type: String,
      default: ''
    },
    rating: {
      type: Number, // Focus level 1-5
      default: 4
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export const StudySession = mongoose.model('StudySession', studySessionSchema);
