import { dataStore } from '../services/store.js';

// @desc    Get all subjects for logged in user
// @route   GET /api/subjects
// @access  Private
export const getSubjects = async (req, res) => {
  try {
    const subjects = await dataStore.getSubjects(req.user._id);
    return res.json({ success: true, count: subjects.length, data: subjects });
  } catch (error) {
    console.error('getSubjects error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single subject with topics
// @route   GET /api/subjects/:id
// @access  Private
export const getSubjectById = async (req, res) => {
  try {
    const subject = await dataStore.getSubjectById(req.user._id, req.params.id);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }
    return res.json({ success: true, data: subject });
  } catch (error) {
    console.error('getSubjectById error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new subject
// @route   POST /api/subjects
// @access  Private
export const createSubject = async (req, res) => {
  try {
    const { name, color, icon, targetHours, topics } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Subject name is required' });
    }

    const subject = await dataStore.createSubject(req.user._id, {
      name,
      color: color || '#6366f1',
      icon: icon || 'BookOpen',
      targetHours: Number(targetHours) || 20,
      topics: topics || []
    });

    return res.status(201).json({ success: true, message: 'Subject created successfully', data: subject });
  } catch (error) {
    console.error('createSubject error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update subject details
// @route   PUT /api/subjects/:id
// @access  Private
export const updateSubject = async (req, res) => {
  try {
    const { name, color, icon, targetHours } = req.body;
    const updated = await dataStore.updateSubject(req.user._id, req.params.id, {
      name,
      color,
      icon,
      targetHours
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }
    return res.json({ success: true, message: 'Subject updated successfully', data: updated });
  } catch (error) {
    console.error('updateSubject error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private
export const deleteSubject = async (req, res) => {
  try {
    const deleted = await dataStore.deleteSubject(req.user._id, req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }
    return res.json({ success: true, message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('deleteSubject error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add topic to subject
// @route   POST /api/subjects/:id/topics
// @access  Private
export const addTopic = async (req, res) => {
  try {
    const { title, difficulty, status, confidence, estimatedHours, notes, keyFormulas } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Topic title is required' });
    }

    const updatedSubject = await dataStore.addTopic(req.user._id, req.params.id, {
      title,
      difficulty: difficulty || 'Medium',
      status: status || 'Not Started',
      confidence: Number(confidence) || 3,
      estimatedHours: Number(estimatedHours) || 3,
      notes: notes || '',
      keyFormulas: Array.isArray(keyFormulas) ? keyFormulas : []
    });

    if (!updatedSubject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    return res.status(201).json({ success: true, message: 'Topic added successfully', data: updatedSubject });
  } catch (error) {
    console.error('addTopic error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update topic in subject
// @route   PUT /api/subjects/:id/topics/:topicId
// @access  Private
export const updateTopic = async (req, res) => {
  try {
    const updates = { ...req.body };

    // If status marked as completed, schedule first spaced repetition in 3 days
    if (updates.status === 'Completed' && !updates.nextRevisionDate) {
      updates.nextRevisionDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      updates.lastStudied = new Date();
    }

    const updatedSubject = await dataStore.updateTopic(
      req.user._id,
      req.params.id,
      req.params.topicId,
      updates
    );

    if (!updatedSubject) {
      return res.status(404).json({ success: false, message: 'Subject or Topic not found' });
    }

    return res.json({ success: true, message: 'Topic updated successfully', data: updatedSubject });
  } catch (error) {
    console.error('updateTopic error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark topic revision completed (Spaced Repetition logic)
// @route   POST /api/subjects/:id/topics/:topicId/revision
// @access  Private
export const completeRevision = async (req, res) => {
  try {
    const { confidenceScore } = req.body;
    const subject = await dataStore.getSubjectById(req.user._id, req.params.id);
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });

    const topic = (subject.topics || []).find(t => String(t._id) === String(req.params.topicId));
    if (!topic) return res.status(404).json({ success: false, message: 'Topic not found' });

    const currentCount = topic.revisionCount || 0;
    // Spaced repetition intervals: 1st revision -> 3 days, 2nd -> 7 days, 3rd -> 14 days, 4th -> 30 days
    const intervals = [3, 7, 14, 30];
    const nextIntervalDays = intervals[Math.min(currentCount, intervals.length - 1)];

    const updates = {
      status: 'Completed',
      revisionCount: currentCount + 1,
      lastStudied: new Date(),
      nextRevisionDate: new Date(Date.now() + nextIntervalDays * 24 * 60 * 60 * 1000)
    };

    if (confidenceScore) {
      updates.confidence = Math.min(5, Math.max(1, Number(confidenceScore)));
    }

    const updatedSubject = await dataStore.updateTopic(req.user._id, req.params.id, req.params.topicId, updates);
    return res.json({
      success: true,
      message: `Revision completed! Next spaced review scheduled in ${nextIntervalDays} days.`,
      data: updatedSubject
    });
  } catch (error) {
    console.error('completeRevision error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete topic
// @route   DELETE /api/subjects/:id/topics/:topicId
// @access  Private
export const deleteTopic = async (req, res) => {
  try {
    const updatedSubject = await dataStore.deleteTopic(req.user._id, req.params.id, req.params.topicId);
    if (!updatedSubject) {
      return res.status(404).json({ success: false, message: 'Subject or Topic not found' });
    }
    return res.json({ success: true, message: 'Topic removed successfully', data: updatedSubject });
  } catch (error) {
    console.error('deleteTopic error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
