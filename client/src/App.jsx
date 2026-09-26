import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { SyllabusTracker } from './pages/SyllabusTracker';
import { RevisionQueue } from './pages/RevisionQueue';
import { StudySessionsPage } from './pages/StudySessionsPage';
import { MockTestTracker } from './pages/MockTestTracker';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { PomodoroModal } from './components/PomodoroModal';
import { SubjectModal } from './components/SubjectModal';
import { TopicModal } from './components/TopicModal';
import { MockTestModal } from './components/MockTestModal';
import { FlashcardModal } from './components/FlashcardModal';
import { api } from './services/api';
import { ThemeProvider } from './context/ThemeContext';

const MainApp = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Data states
  const [subjects, setSubjects] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);

  // Modal states
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [targetSubjectIdForTopic, setTargetSubjectIdForTopic] = useState(null);
  const [editingTopic, setEditingTopic] = useState(null);
  const [isMockModalOpen, setIsMockModalOpen] = useState(false);
  const [isFlashcardOpen, setIsFlashcardOpen] = useState(false);

  // Fetch all core app data
  const loadAppData = useCallback(async () => {
    if (!isAuthenticated) return;
    setDataLoading(true);
    try {
      const [subjectsRes, analyticsRes] = await Promise.all([
        api.getSubjects(),
        api.getDashboardAnalytics()
      ]);

      if (subjectsRes.success && subjectsRes.data) {
        setSubjects(subjectsRes.data);
      }
      if (analyticsRes.success && analyticsRes.data) {
        setAnalytics(analyticsRes.data);
      }
    } catch (err) {
      console.error('Error loading tracker data:', err);
    } finally {
      setDataLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadAppData();
  }, [loadAppData]);

  // Subject Modal helpers
  const handleOpenSubjectModal = (subject = null) => {
    setEditingSubject(subject);
    setIsSubjectModalOpen(true);
  };

  // Topic Modal helpers
  const handleOpenTopicModal = (subjectId, topic = null) => {
    setTargetSubjectIdForTopic(subjectId);
    setEditingTopic(topic);
    setIsTopicModalOpen(true);
  };

  // Revision complete callback
  const handleMarkRevisionComplete = async (subjectId, topicId, confidence = 4) => {
    try {
      await api.completeRevision(subjectId, topicId, confidence);
      loadAppData();
    } catch (err) {
      console.error('Failed to complete revision:', err);
    }
  };

  // Generate flashcards from all topics
  const flashcards = [];
  subjects.forEach((sub) => {
    (sub.topics || []).forEach((top) => {
      flashcards.push({
        subjectId: sub._id,
        subjectName: sub.name,
        subjectColor: sub.color,
        topicId: top._id,
        title: top.title,
        difficulty: top.difficulty,
        status: top.status,
        confidence: top.confidence,
        notes: top.notes,
        keyFormulas: top.keyFormulas || []
      });
    });
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 animate-spin border-4 border-indigo-400 border-t-transparent" />
        <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase font-display">
          Initializing ExamTrack System...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return authView === 'login' ? (
      <Login onSwitchToRegister={() => setAuthView('register')} />
    ) : (
      <Register onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  const pendingRevisionCount = analytics?.revisionDueList?.length || 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top App Bar */}
      <Navbar
        onOpenTimer={() => setIsTimerOpen(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          revisionCount={pendingRevisionCount}
          isMobileOpen={isMobileSidebarOpen}
          setIsMobileOpen={setIsMobileSidebarOpen}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <Dashboard
              analytics={analytics}
              user={user}
              subjects={subjects}
              onOpenTimer={() => setIsTimerOpen(true)}
              onOpenFlashcards={() => setIsFlashcardOpen(true)}
              onOpenMockModal={() => setIsMockModalOpen(true)}
              onNavigate={(tab) => setActiveTab(tab)}
              onMarkRevisionComplete={handleMarkRevisionComplete}
              onRefreshData={loadAppData}
            />
          )}

          {activeTab === 'syllabus' && (
            <SyllabusTracker
              subjects={subjects}
              onOpenSubjectModal={handleOpenSubjectModal}
              onOpenTopicModal={handleOpenTopicModal}
              onRefreshData={loadAppData}
            />
          )}

          {activeTab === 'revision' && (
            <RevisionQueue
              subjects={subjects}
              onOpenFlashcards={() => setIsFlashcardOpen(true)}
              onRefreshData={loadAppData}
            />
          )}

          {activeTab === 'sessions' && (
            <StudySessionsPage onOpenTimer={() => setIsTimerOpen(true)} />
          )}

          {activeTab === 'mocktests' && (
            <MockTestTracker onOpenMockModal={() => setIsMockModalOpen(true)} />
          )}

          {activeTab === 'analytics' && (
            <Analytics analytics={analytics} subjects={subjects} />
          )}

          {activeTab === 'settings' && <Settings />}
        </main>
      </div>

      {/* Global Modals */}
      <PomodoroModal
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
        subjects={subjects}
        onSessionSaved={loadAppData}
      />

      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={() => {
          setIsSubjectModalOpen(false);
          setEditingSubject(null);
        }}
        subject={editingSubject}
        onSubjectSaved={loadAppData}
      />

      <TopicModal
        isOpen={isTopicModalOpen}
        onClose={() => {
          setIsTopicModalOpen(false);
          setTargetSubjectIdForTopic(null);
          setEditingTopic(null);
        }}
        subjectId={targetSubjectIdForTopic}
        topic={editingTopic}
        onTopicSaved={loadAppData}
      />

      <MockTestModal
        isOpen={isMockModalOpen}
        onClose={() => setIsMockModalOpen(false)}
        subjects={subjects}
        onTestSaved={loadAppData}
      />

      <FlashcardModal
        isOpen={isFlashcardOpen}
        onClose={() => setIsFlashcardOpen(false)}
        cards={flashcards}
        onMarkReviewed={handleMarkRevisionComplete}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
