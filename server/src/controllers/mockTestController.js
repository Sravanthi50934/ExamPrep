import { dataStore } from '../services/store.js';

// @desc    Get all mock tests for user
// @route   GET /api/mock-tests
// @access  Private
export const getMockTests = async (req, res) => {
  try {
    const tests = await dataStore.getMockTests(req.user._id);
    return res.json({ success: true, count: tests.length, data: tests });
  } catch (error) {
    console.error('getMockTests error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new mock test entry
// @route   POST /api/mock-tests
// @access  Private
export const createMockTest = async (req, res) => {
  try {
    const { title, subjectName, totalMarks, scoreObtained, timeTakenMinutes, testDate, weakAreas, strongAreas, reflectionNotes } = req.body;

    if (!title || totalMarks === undefined || scoreObtained === undefined) {
      return res.status(400).json({ success: false, message: 'Title, totalMarks, and scoreObtained are required' });
    }

    const newTest = await dataStore.createMockTest(req.user._id, {
      title,
      subjectName,
      totalMarks,
      scoreObtained,
      timeTakenMinutes,
      testDate,
      weakAreas,
      strongAreas,
      reflectionNotes
    });

    return res.status(201).json({ success: true, message: 'Mock test logged successfully', data: newTest });
  } catch (error) {
    console.error('createMockTest error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete mock test entry
// @route   DELETE /api/mock-tests/:id
// @access  Private
export const deleteMockTest = async (req, res) => {
  try {
    const deleted = await dataStore.deleteMockTest(req.user._id, req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Mock test not found' });
    }
    return res.json({ success: true, message: 'Mock test entry deleted successfully' });
  } catch (error) {
    console.error('deleteMockTest error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
