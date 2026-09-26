import { dataStore } from '../services/store.js';

// @desc    Get dashboard metrics, exam readiness, and revision queues
// @route   GET /api/analytics/dashboard
// @access  Private
export const getDashboardAnalytics = async (req, res) => {
  try {
    const analytics = await dataStore.getAnalytics(req.user._id);

    // Calculate composite Exam Readiness Score (0-100)
    // Formula: 45% Syllabus Completion + 40% Mock Test Average + 15% Study Consistency
    const syllabusPart = (analytics.syllabusCompletionPercentage || 0) * 0.45;
    const mockPart = (analytics.averageMockScore || 0) * 0.40;
    const consistencyPart = Math.min(100, (analytics.streakCount || 1) * 15) * 0.15;
    const readinessScore = Math.round(syllabusPart + mockPart + consistencyPart);

    return res.json({
      success: true,
      data: {
        ...analytics,
        readinessScore: Math.min(100, Math.max(10, readinessScore))
      }
    });
  } catch (error) {
    console.error('getDashboardAnalytics error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
