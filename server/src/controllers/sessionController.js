import { dataStore } from '../services/store.js';

// @desc    Get study sessions for user
// @route   GET /api/sessions
// @access  Private
export const getSessions = async (req, res) => {
  try {
    const sessions = await dataStore.getSessions(req.user._id);
    return res.json({ success: true, count: sessions.length, data: sessions });
  } catch (error) {
    console.error('getSessions error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create/log a study session (e.g. from Pomodoro timer)
// @route   POST /api/sessions
// @access  Private
export const createSession = async (req, res) => {
  try {
    const { subjectId, subjectName, topicTitle, durationMinutes, sessionType, notes, rating } = req.body;

    if (!durationMinutes || Number(durationMinutes) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid duration in minutes is required' });
    }

    const session = await dataStore.createSession(req.user._id, {
      subjectId,
      subjectName,
      topicTitle,
      durationMinutes: Number(durationMinutes),
      sessionType: sessionType || 'Pomodoro',
      notes: notes || '',
      rating: Number(rating) || 4
    });

    return res.status(201).json({ success: true, message: 'Study session logged successfully', data: session });
  } catch (error) {
    console.error('createSession error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a study session
// @route   DELETE /api/sessions/:id
// @access  Private
export const deleteSession = async (req, res) => {
  try {
    const deleted = await dataStore.deleteSession(req.user._id, req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Study session not found' });
    }
    return res.json({ success: true, message: 'Study session deleted successfully' });
  } catch (error) {
    console.error('deleteSession error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
