const API_BASE = import.meta.env.VITE_API_URL || '/api';

const getHeaders = () => {
  const token = localStorage.getItem('exam_tracker_token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  async register(name, email, password, targetExam) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, targetExam })
    });
    return handleResponse(res);
  },

  async getProfile() {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async updateProfile(updates) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    return handleResponse(res);
  },

  // Subjects & Topics
  async getSubjects() {
    const res = await fetch(`${API_BASE}/subjects`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async createSubject(subjectData) {
    const res = await fetch(`${API_BASE}/subjects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(subjectData)
    });
    return handleResponse(res);
  },

  async updateSubject(id, updates) {
    const res = await fetch(`${API_BASE}/subjects/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    return handleResponse(res);
  },

  async deleteSubject(id) {
    const res = await fetch(`${API_BASE}/subjects/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async addTopic(subjectId, topicData) {
    const res = await fetch(`${API_BASE}/subjects/${subjectId}/topics`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(topicData)
    });
    return handleResponse(res);
  },

  async updateTopic(subjectId, topicId, updates) {
    const res = await fetch(`${API_BASE}/subjects/${subjectId}/topics/${topicId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    return handleResponse(res);
  },

  async completeRevision(subjectId, topicId, confidenceScore) {
    const res = await fetch(`${API_BASE}/subjects/${subjectId}/topics/${topicId}/revision`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ confidenceScore })
    });
    return handleResponse(res);
  },

  async deleteTopic(subjectId, topicId) {
    const res = await fetch(`${API_BASE}/subjects/${subjectId}/topics/${topicId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Study Sessions (Pomodoro / Manual Logs)
  async getSessions() {
    const res = await fetch(`${API_BASE}/sessions`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async createSession(sessionData) {
    const res = await fetch(`${API_BASE}/sessions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(sessionData)
    });
    return handleResponse(res);
  },

  async deleteSession(id) {
    const res = await fetch(`${API_BASE}/sessions/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Mock Tests
  async getMockTests() {
    const res = await fetch(`${API_BASE}/mock-tests`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  async createMockTest(testData) {
    const res = await fetch(`${API_BASE}/mock-tests`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(testData)
    });
    return handleResponse(res);
  },

  async deleteMockTest(id) {
    const res = await fetch(`${API_BASE}/mock-tests/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Analytics & Dashboard
  async getDashboardAnalytics() {
    const res = await fetch(`${API_BASE}/analytics/dashboard`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Health
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse(res);
  }
};
