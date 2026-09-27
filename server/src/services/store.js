import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Subject } from '../models/Subject.js';
import { StudySession } from '../models/StudySession.js';
import { MockTest } from '../models/MockTest.js';

// In-Memory Fallback State (used when MongoDB Atlas is connecting or not yet configured)
const memStore = {
  users: [],
  subjects: [],
  sessions: [],
  mockTests: []
};

// Seed demo data for instant out-of-the-box exploration
const initDemoData = () => {
  const hashedPassword = bcrypt.hashSync('password123', 10);
  const demoUserId = 'demo-user-id-001';

  memStore.users.push({
    _id: demoUserId,
    name: 'Alex Johnson',
    email: 'alex@example.com',
    password: hashedPassword,
    targetExam: {
      title: 'Graduate Aptitude Test / Finals',
      date: null, // No default exam date; user selects and saves their own
      dailyGoalMinutes: 240, // 4 hours
      targetScore: '92%'
    },
    streak: {
      count: 7,
      lastActiveDate: new Date()
    },
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const subject1Id = 'sub-001';
  const subject2Id = 'sub-002';
  const subject3Id = 'sub-003';

  memStore.subjects.push(
    {
      _id: subject1Id,
      user: demoUserId,
      name: 'Data Structures & Algorithms',
      color: '#6366f1', // Indigo
      icon: 'Binary',
      targetHours: 35,
      topics: [
        {
          _id: 'top-101',
          title: 'Dynamic Programming & Memoization',
          difficulty: 'Hard',
          status: 'In Progress',
          confidence: 3,
          estimatedHours: 6,
          loggedMinutes: 210,
          notes: 'Focus on 0/1 Knapsack variations and Longest Common Subsequence.',
          keyFormulas: ['dp[i][w] = max(dp[i-1][w], val + dp[i-1][w-wt])'],
          lastStudied: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          nextRevisionDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          revisionCount: 2
        },
        {
          _id: 'top-102',
          title: 'Graph Algorithms (Dijkstra & BFS/DFS)',
          difficulty: 'Hard',
          status: 'Completed',
          confidence: 5,
          estimatedHours: 5,
          loggedMinutes: 320,
          notes: 'Priority queue implementation for Dijkstra gives O((V+E)logV).',
          keyFormulas: ['Dijkstra: O(E log V) with Min-Heap'],
          lastStudied: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          nextRevisionDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          revisionCount: 3
        },
        {
          _id: 'top-103',
          title: 'Binary Search Trees & AVL Balancing',
          difficulty: 'Medium',
          status: 'Needs Revision',
          confidence: 2,
          estimatedHours: 4,
          loggedMinutes: 180,
          notes: 'Review Left-Right and Right-Left rotations.',
          keyFormulas: ['Height balance factor = height(left) - height(right)'],
          lastStudied: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          nextRevisionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Due now!
          revisionCount: 1
        }
      ]
    },
    {
      _id: subject2Id,
      user: demoUserId,
      name: 'Computer Networks & Security',
      color: '#06b6d4', // Cyan
      icon: 'Network',
      targetHours: 25,
      topics: [
        {
          _id: 'top-201',
          title: 'TCP/IP 3-Way Handshake & Flow Control',
          difficulty: 'Medium',
          status: 'Completed',
          confidence: 4,
          estimatedHours: 3,
          loggedMinutes: 190,
          notes: 'SYN, SYN-ACK, ACK. Sliding window protocol for congestion control.',
          keyFormulas: ['Throughput = WindowSize / RTT'],
          lastStudied: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          nextRevisionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          revisionCount: 2
        },
        {
          _id: 'top-202',
          title: 'Subnetting & CIDR Calculations',
          difficulty: 'Easy',
          status: 'Completed',
          confidence: 5,
          estimatedHours: 2,
          loggedMinutes: 120,
          notes: 'Slash notation (/24, /26). Number of usable hosts = 2^(32-prefix) - 2.',
          keyFormulas: ['Usable Hosts = 2^(32-n) - 2'],
          lastStudied: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          nextRevisionDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
          revisionCount: 2
        },
        {
          _id: 'top-203',
          title: 'Public Key Cryptography & TLS 1.3',
          difficulty: 'Hard',
          status: 'Not Started',
          confidence: 1,
          estimatedHours: 4,
          loggedMinutes: 0,
          notes: 'Diffie-Hellman key exchange and RSA signature verification.',
          keyFormulas: ['RSA: c = m^e mod n'],
          lastStudied: null,
          nextRevisionDate: null,
          revisionCount: 0
        }
      ]
    },
    {
      _id: subject3Id,
      user: demoUserId,
      name: 'Database Management Systems',
      color: '#10b981', // Emerald
      icon: 'Database',
      targetHours: 20,
      topics: [
        {
          _id: 'top-301',
          title: 'ACID Properties & Transaction Isolation Levels',
          difficulty: 'Medium',
          status: 'Completed',
          confidence: 4,
          estimatedHours: 3,
          loggedMinutes: 160,
          notes: 'Dirty read, non-repeatable read, phantom read. Serializable isolation.',
          keyFormulas: ['ACID: Atomicity, Consistency, Isolation, Durability'],
          lastStudied: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          nextRevisionDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          revisionCount: 2
        },
        {
          _id: 'top-302',
          title: 'B+ Tree Indexing & Query Optimization',
          difficulty: 'Hard',
          status: 'In Progress',
          confidence: 3,
          estimatedHours: 5,
          loggedMinutes: 150,
          notes: 'Leaf nodes form linked list for range scans. Fanout keeps tree depth low.',
          keyFormulas: ['Height <= ceil(log_m(N))'],
          lastStudied: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          nextRevisionDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          revisionCount: 1
        }
      ]
    }
  );

  // Past Study Sessions
  memStore.sessions.push(
    {
      _id: 'sess-01',
      user: demoUserId,
      subjectId: subject1Id,
      subjectName: 'Data Structures & Algorithms',
      topicTitle: 'Dynamic Programming & Memoization',
      durationMinutes: 50,
      sessionType: 'Pomodoro',
      notes: 'Solved 3 LeetCode Medium DP problems.',
      rating: 5,
      completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      _id: 'sess-02',
      user: demoUserId,
      subjectId: subject2Id,
      subjectName: 'Computer Networks & Security',
      topicTitle: 'TCP/IP 3-Way Handshake & Flow Control',
      durationMinutes: 45,
      sessionType: 'Theory Review',
      notes: 'Drew packet exchange diagram and verified congestion window math.',
      rating: 4,
      completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      _id: 'sess-03',
      user: demoUserId,
      subjectId: subject3Id,
      subjectName: 'Database Management Systems',
      topicTitle: 'B+ Tree Indexing & Query Optimization',
      durationMinutes: 60,
      sessionType: 'Practice Questions',
      notes: 'Analyzed EXPLAIN query plans and multi-column composite index ordering.',
      rating: 5,
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      _id: 'sess-04',
      user: demoUserId,
      subjectId: subject1Id,
      subjectName: 'Data Structures & Algorithms',
      topicTitle: 'Graph Algorithms (Dijkstra & BFS/DFS)',
      durationMinutes: 45,
      sessionType: 'Pomodoro',
      notes: 'Implemented Prim and Kruskal minimum spanning tree.',
      rating: 4,
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    }
  );

  // Mock Tests
  memStore.mockTests.push(
    {
      _id: 'test-01',
      user: demoUserId,
      title: 'Full Diagnostic Mock Test #1',
      subjectName: 'Full Syllabus',
      totalMarks: 100,
      scoreObtained: 74,
      percentage: 74,
      timeTakenMinutes: 110,
      testDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      weakAreas: ['AVL Rotations', 'TLS Handshake', 'B+ Tree Deletion'],
      strongAreas: ['Dijkstra Algorithm', 'Subnetting', 'SQL Queries'],
      reflectionNotes: 'Good pace, but made silly errors on AVL tree balance calculations.'
    },
    {
      _id: 'test-02',
      user: demoUserId,
      title: 'Subject Focus: Core Systems Mock #2',
      subjectName: 'Computer Networks & DBMS',
      totalMarks: 80,
      scoreObtained: 68,
      percentage: 85,
      timeTakenMinutes: 75,
      testDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      weakAreas: ['Congestion Avoidance Fast Retransmit', 'Serializable Snapshot Isolation'],
      strongAreas: ['CIDR Subnets', 'ACID Properties', 'Three-way Handshake'],
      reflectionNotes: 'Much better accuracy! Speed on numerical questions improved by 15%.'
    },
    {
      _id: 'test-03',
      user: demoUserId,
      title: 'Algorithms & Data Structures Sprint #3',
      subjectName: 'Data Structures & Algorithms',
      totalMarks: 100,
      scoreObtained: 89,
      percentage: 89,
      timeTakenMinutes: 90,
      testDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      weakAreas: ['Bit Manipulation DP'],
      strongAreas: ['Graph Traversal', 'Tree Traversals', 'Sorting Algorithms'],
      reflectionNotes: 'Top score so far! Ready to tackle advanced dynamic programming.'
    }
  );
};

initDemoData();

const isMongoLive = () => mongoose.connection.readyState === 1;

export const dataStore = {
  // USER METHODS
  async findUserByEmail(email) {
    if (isMongoLive()) {
      let user = await User.findOne({ email: email.toLowerCase() });
      if (!user && email.toLowerCase() === 'alex@example.com') {
        // Auto-seed demo account into MongoDB
        const demoUser = memStore.users[0];
        if (demoUser) {
          try {
            user = await User.create({
              name: demoUser.name,
              email: demoUser.email,
              password: 'password123', // Will be hashed by pre-save hook
              targetExam: demoUser.targetExam,
              streak: demoUser.streak
            });

            // Seed demo subjects for this user in MongoDB
            for (const s of memStore.subjects) {
              const cleanedTopics = (s.topics || []).map(({ _id, ...rest }) => rest);
              const createdSub = await Subject.create({
                user: user._id,
                name: s.name,
                color: s.color,
                icon: s.icon,
                targetHours: s.targetHours,
                topics: cleanedTopics
              });

              // Seed study sessions linked to this subject
              const matchingSessions = memStore.sessions.filter(sess => sess.subjectName === s.name);
              for (const ms of matchingSessions) {
                await StudySession.create({
                  user: user._id,
                  subjectId: createdSub._id,
                  subjectName: createdSub.name,
                  topicTitle: ms.topicTitle,
                  durationMinutes: ms.durationMinutes,
                  sessionType: ms.sessionType,
                  notes: ms.notes,
                  rating: ms.rating,
                  completedAt: ms.completedAt
                });
              }
            }

            // Seed demo mock tests
            for (const t of memStore.mockTests) {
              await MockTest.create({
                user: user._id,
                title: t.title,
                subjectName: t.subjectName,
                totalMarks: t.totalMarks,
                scoreObtained: t.scoreObtained,
                percentage: t.percentage,
                timeTakenMinutes: t.timeTakenMinutes,
                testDate: t.testDate,
                weakAreas: t.weakAreas,
                strongAreas: t.strongAreas,
                reflectionNotes: t.reflectionNotes
              });
            }
          } catch (e) {
            console.error('Auto-seed error:', e.message);
          }
        }
      }
      return user;
    }
    return memStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  async findUserById(id) {
    if (isMongoLive()) {
      return await User.findById(id).select('-password');
    }
    const user = memStore.users.find(u => String(u._id) === String(id));
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  async findUserByIdWithPassword(id) {
    if (isMongoLive()) {
      return await User.findById(id);
    }
    return memStore.users.find(u => String(u._id) === String(id));
  },

  async createUser({ name, email, password, targetExam }) {
    if (isMongoLive()) {
      const newUser = new User({ name, email, password, targetExam });
      await newUser.save();
      const userObj = newUser.toObject();
      delete userObj.password;
      return userObj;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      _id: 'usr-' + Date.now(),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      targetExam: {
        title: targetExam?.title || 'Target Exam',
        date: targetExam?.date ? new Date(targetExam.date) : null,
        dailyGoalMinutes: targetExam?.dailyGoalMinutes || 240,
        targetScore: targetExam?.targetScore || '90%'
      },
      streak: { count: 1, lastActiveDate: new Date() },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memStore.users.push(newUser);
    const { password: _, ...safeUser } = newUser;
    return safeUser;
  },

  async updateUser(id, updates) {
    if (isMongoLive()) {
      return await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    }
    const index = memStore.users.findIndex(u => String(u._id) === String(id));
    if (index === -1) return null;
    memStore.users[index] = { ...memStore.users[index], ...updates, updatedAt: new Date() };
    const { password, ...safeUser } = memStore.users[index];
    return safeUser;
  },

  // SUBJECT METHODS
  async getSubjects(userId) {
    if (isMongoLive()) {
      return await Subject.find({ user: userId }).sort({ createdAt: -1 });
    }
    return memStore.subjects
      .filter(s => String(s.user) === String(userId))
      .map(s => {
        const completed = (s.topics || []).filter(t => t.status === 'Completed').length;
        const total = (s.topics || []).length;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { ...s, completionRate: rate };
      });
  },

  async getSubjectById(userId, subjectId) {
    if (isMongoLive()) {
      return await Subject.findOne({ _id: subjectId, user: userId });
    }
    const sub = memStore.subjects.find(s => String(s._id) === String(subjectId) && String(s.user) === String(userId));
    if (!sub) return null;
    const completed = (sub.topics || []).filter(t => t.status === 'Completed').length;
    const total = (sub.topics || []).length;
    return { ...sub, completionRate: total > 0 ? Math.round((completed / total) * 100) : 0 };
  },

  async createSubject(userId, data) {
    if (isMongoLive()) {
      return await Subject.create({ ...data, user: userId });
    }
    const newSub = {
      _id: 'sub-' + Date.now(),
      user: userId,
      name: data.name,
      color: data.color || '#6366f1',
      icon: data.icon || 'BookOpen',
      targetHours: data.targetHours || 30,
      topics: data.topics || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memStore.subjects.push(newSub);
    return { ...newSub, completionRate: 0 };
  },

  async updateSubject(userId, subjectId, updates) {
    if (isMongoLive()) {
      return await Subject.findOneAndUpdate({ _id: subjectId, user: userId }, updates, { new: true });
    }
    const index = memStore.subjects.findIndex(s => String(s._id) === String(subjectId) && String(s.user) === String(userId));
    if (index === -1) return null;
    memStore.subjects[index] = { ...memStore.subjects[index], ...updates, updatedAt: new Date() };
    return memStore.subjects[index];
  },

  async deleteSubject(userId, subjectId) {
    if (isMongoLive()) {
      await Subject.findOneAndDelete({ _id: subjectId, user: userId });
      return true;
    }
    const initialLen = memStore.subjects.length;
    memStore.subjects = memStore.subjects.filter(s => !(String(s._id) === String(subjectId) && String(s.user) === String(userId)));
    return memStore.subjects.length < initialLen;
  },

  // TOPIC METHODS
  async addTopic(userId, subjectId, topicData) {
    if (isMongoLive()) {
      const subject = await Subject.findOne({ _id: subjectId, user: userId });
      if (!subject) return null;
      subject.topics.push(topicData);
      await subject.save();
      return subject;
    }

    const sub = memStore.subjects.find(s => String(s._id) === String(subjectId) && String(s.user) === String(userId));
    if (!sub) return null;
    const newTopic = {
      _id: 'top-' + Date.now(),
      title: topicData.title,
      difficulty: topicData.difficulty || 'Medium',
      status: topicData.status || 'Not Started',
      confidence: topicData.confidence || 3,
      estimatedHours: topicData.estimatedHours || 3,
      loggedMinutes: 0,
      notes: topicData.notes || '',
      keyFormulas: topicData.keyFormulas || [],
      lastStudied: null,
      nextRevisionDate: null,
      revisionCount: 0,
      createdAt: new Date()
    };
    sub.topics.push(newTopic);
    return sub;
  },

  async updateTopic(userId, subjectId, topicId, updates) {
    if (isMongoLive()) {
      const subject = await Subject.findOne({ _id: subjectId, user: userId });
      if (!subject) return null;
      const topic = subject.topics.id(topicId);
      if (!topic) return null;
      Object.assign(topic, updates);
      await subject.save();
      return subject;
    }

    const sub = memStore.subjects.find(s => String(s._id) === String(subjectId) && String(s.user) === String(userId));
    if (!sub) return null;
    const topicIndex = sub.topics.findIndex(t => String(t._id) === String(topicId));
    if (topicIndex === -1) return null;
    sub.topics[topicIndex] = { ...sub.topics[topicIndex], ...updates, updatedAt: new Date() };
    const completed = sub.topics.filter(t => t.status === 'Completed').length;
    sub.completionRate = sub.topics.length > 0 ? Math.round((completed / sub.topics.length) * 100) : 0;
    return sub;
  },

  async deleteTopic(userId, subjectId, topicId) {
    if (isMongoLive()) {
      const subject = await Subject.findOne({ _id: subjectId, user: userId });
      if (!subject) return null;
      subject.topics.pull(topicId);
      await subject.save();
      return subject;
    }

    const sub = memStore.subjects.find(s => String(s._id) === String(subjectId) && String(s.user) === String(userId));
    if (!sub) return null;
    sub.topics = sub.topics.filter(t => String(t._id) !== String(topicId));
    return sub;
  },

  // STUDY SESSION METHODS
  async getSessions(userId) {
    if (isMongoLive()) {
      return await StudySession.find({ user: userId }).sort({ completedAt: -1 });
    }
    return memStore.sessions
      .filter(s => String(s.user) === String(userId))
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  },

  async createSession(userId, sessionData) {
    if (isMongoLive()) {
      const session = await StudySession.create({ ...sessionData, user: userId });
      return session;
    }
    const newSession = {
      _id: 'sess-' + Date.now(),
      user: userId,
      subjectId: sessionData.subjectId,
      subjectName: sessionData.subjectName || 'General Study',
      topicTitle: sessionData.topicTitle || 'General',
      durationMinutes: Number(sessionData.durationMinutes) || 25,
      sessionType: sessionData.sessionType || 'Pomodoro',
      notes: sessionData.notes || '',
      rating: sessionData.rating || 4,
      completedAt: new Date()
    };
    memStore.sessions.unshift(newSession);

    // If attached to a topic, update topic's loggedMinutes and lastStudied
    if (sessionData.subjectId && sessionData.topicTitle) {
      const sub = memStore.subjects.find(s => String(s._id) === String(sessionData.subjectId));
      if (sub) {
        const top = sub.topics.find(t => t.title.toLowerCase() === sessionData.topicTitle.toLowerCase());
        if (top) {
          top.loggedMinutes = (top.loggedMinutes || 0) + newSession.durationMinutes;
          top.lastStudied = new Date();
          if (top.status === 'Not Started') {
            top.status = 'In Progress';
          }
        }
      }
    }

    return newSession;
  },

  async deleteSession(userId, sessionId) {
    if (isMongoLive()) {
      await StudySession.findOneAndDelete({ _id: sessionId, user: userId });
      return true;
    }
    const initialLen = memStore.sessions.length;
    memStore.sessions = memStore.sessions.filter(s => !(String(s._id) === String(sessionId) && String(s.user) === String(userId)));
    return memStore.sessions.length < initialLen;
  },

  // MOCK TEST METHODS
  async getMockTests(userId) {
    if (isMongoLive()) {
      return await MockTest.find({ user: userId }).sort({ testDate: -1 });
    }
    return memStore.mockTests
      .filter(t => String(t.user) === String(userId))
      .sort((a, b) => new Date(b.testDate) - new Date(a.testDate));
  },

  async createMockTest(userId, testData) {
    const totalMarks = Number(testData.totalMarks) || 100;
    const scoreObtained = Number(testData.scoreObtained) || 0;
    const percentage = Math.round((scoreObtained / totalMarks) * 100);

    if (isMongoLive()) {
      return await MockTest.create({
        ...testData,
        percentage,
        user: userId
      });
    }

    const newTest = {
      _id: 'test-' + Date.now(),
      user: userId,
      title: testData.title,
      subjectName: testData.subjectName || 'Full Syllabus',
      totalMarks,
      scoreObtained,
      percentage,
      timeTakenMinutes: Number(testData.timeTakenMinutes) || 60,
      testDate: testData.testDate ? new Date(testData.testDate) : new Date(),
      weakAreas: Array.isArray(testData.weakAreas) ? testData.weakAreas : (testData.weakAreas ? testData.weakAreas.split(',').map(s => s.trim()) : []),
      strongAreas: Array.isArray(testData.strongAreas) ? testData.strongAreas : (testData.strongAreas ? testData.strongAreas.split(',').map(s => s.trim()) : []),
      reflectionNotes: testData.reflectionNotes || '',
      createdAt: new Date()
    };
    memStore.mockTests.unshift(newTest);
    return newTest;
  },

  async deleteMockTest(userId, testId) {
    if (isMongoLive()) {
      await MockTest.findOneAndDelete({ _id: testId, user: userId });
      return true;
    }
    const initialLen = memStore.mockTests.length;
    memStore.mockTests = memStore.mockTests.filter(t => !(String(t._id) === String(testId) && String(t.user) === String(userId)));
    return memStore.mockTests.length < initialLen;
  },

  // ANALYTICS AGGREGATOR
  async getAnalytics(userId) {
    const subjects = await this.getSubjects(userId);
    const sessions = await this.getSessions(userId);
    const mockTests = await this.getMockTests(userId);
    const user = await this.findUserById(userId);

    // Calculate syllabus stats
    let totalTopics = 0;
    let completedTopics = 0;
    let inProgressTopics = 0;
    let needsRevisionTopics = 0;
    let notStartedTopics = 0;

    const revisionDueList = [];
    const weakAreasSet = new Set();

    subjects.forEach(sub => {
      (sub.topics || []).forEach(top => {
        totalTopics++;
        if (top.status === 'Completed') completedTopics++;
        else if (top.status === 'In Progress') inProgressTopics++;
        else if (top.status === 'Needs Revision') {
          needsRevisionTopics++;
          revisionDueList.push({
            subjectId: sub._id,
            subjectName: sub.name,
            subjectColor: sub.color,
            topicId: top._id,
            title: top.title,
            difficulty: top.difficulty,
            confidence: top.confidence,
            dueStatus: 'Marked For Revision'
          });
        } else {
          notStartedTopics++;
        }

        // Check if nextRevisionDate is passed or due today
        if (top.nextRevisionDate && new Date(top.nextRevisionDate) <= new Date()) {
          if (!revisionDueList.some(r => String(r.topicId) === String(top._id))) {
            revisionDueList.push({
              subjectId: sub._id,
              subjectName: sub.name,
              subjectColor: sub.color,
              topicId: top._id,
              title: top.title,
              difficulty: top.difficulty,
              confidence: top.confidence,
              dueStatus: 'Spaced Repetition Due'
            });
          }
        }

        if (top.confidence <= 2 || top.difficulty === 'Hard') {
          weakAreasSet.add(top.title);
        }
      });
    });

    const syllabusCompletionPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    // Study sessions calculation
    const totalStudyMinutes = sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
    const totalStudyHours = (totalStudyMinutes / 60).toFixed(1);

    // Calculate today's study minutes
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todaySessions = sessions.filter(s => new Date(s.completedAt) >= startOfToday);
    const todayStudyMinutes = todaySessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);

    // Days until exam
    const examDate = user?.targetExam?.date ? new Date(user.targetExam.date) : null;
    const daysUntilExam = examDate
      ? Math.max(0, Math.ceil((examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : null;

    // Mock test average score
    const avgScore = mockTests.length > 0
      ? Math.round(mockTests.reduce((acc, t) => acc + (t.percentage || 0), 0) / mockTests.length)
      : 0;

    // Collect weak areas from mock tests
    mockTests.forEach(test => {
      (test.weakAreas || []).forEach(area => {
        if (area) weakAreasSet.add(area);
      });
    });

    return {
      daysUntilExam,
      targetExamTitle: user?.targetExam?.title || 'Upcoming Exam',
      targetScore: user?.targetExam?.targetScore || '90%',
      dailyGoalMinutes: user?.targetExam?.dailyGoalMinutes || 240,
      todayStudyMinutes,
      totalStudyHours,
      streakCount: user?.streak?.count || 1,
      syllabusCompletionPercentage,
      topicCounts: {
        total: totalTopics,
        completed: completedTopics,
        inProgress: inProgressTopics,
        needsRevision: needsRevisionTopics,
        notStarted: notStartedTopics
      },
      averageMockScore: avgScore,
      mockTestsCount: mockTests.length,
      revisionDueList: revisionDueList.slice(0, 8),
      weakAreas: Array.from(weakAreasSet).slice(0, 8),
      subjectsBreakdown: subjects.map(s => ({
        id: s._id,
        name: s.name,
        color: s.color,
        topicsCount: (s.topics || []).length,
        completedCount: (s.topics || []).filter(t => t.status === 'Completed').length,
        completionRate: s.completionRate || 0
      }))
    };
  }
};
