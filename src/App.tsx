import { useState } from 'react';
import { Landing, FormEditor, FormEval, SubmissionHistory, SchuleSubmissionView, AufsichtSubmissionView, SubmissionNew, SubmissionAll, About } from './pages';
import { Footer } from './components';
import { FormContextProvider } from './context/FormContext';
import { useFormContext } from './context/formContextValue';
import './components/formInputStyles.css';
import './App.css';

type View = 'landing' | 'form' | 'history' | 'view' | 'about' | 'eval' | 'new' | 'all';


function AppContent() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const { role } = useFormContext();

  const handleNavigate = (view: View, submissionId?: string) => {
    setCurrentView(view);
    setSelectedSubmissionId(submissionId ?? null);
  };

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <Landing onNavigate={handleNavigate} />;
      case 'form':
        return <FormEditor key={selectedSubmissionId ?? 'new'} onNavigate={handleNavigate} submissionId={selectedSubmissionId || undefined} />;
      case 'eval':
        return <FormEval key={selectedSubmissionId ?? 'new'} submissionId={selectedSubmissionId || undefined} onNavigate={handleNavigate} />;
      case 'history':
        return <SubmissionHistory onNavigate={handleNavigate} />;
      case 'new':
        return <SubmissionNew onNavigate={handleNavigate} />;
      case 'all':
        return <SubmissionAll onNavigate={handleNavigate} />;
      case 'view':
        return role === 'Schule' 
          ? <SchuleSubmissionView schulnummer={selectedSubmissionId} onNavigate={handleNavigate} />
          : <AufsichtSubmissionView schulnummer={selectedSubmissionId} onNavigate={handleNavigate} />;
      case 'about':
        return <About onNavigate={handleNavigate} />;
      default:
        return <Landing onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="app">
      <main>
        {renderView()}
        {currentView === 'landing' && <Footer onNavigate={handleNavigate} />}
      </main>
    </div>
  );
}

function App() {
  return (
    <FormContextProvider>
      <AppContent />
    </FormContextProvider>
  );
}

export default App;
