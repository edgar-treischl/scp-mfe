import { useState } from 'react';
import { Landing, SelectPage, FormEditor, FormEval, SubmissionHistory, SchuleSubmissionView, AufsichtSubmissionView, SubmissionNew, SubmissionAll, About, Data, SchuleNew } from './pages';
import { Footer } from './components';
import { FormContextProvider } from './context/FormContext';
import { useFormContext } from './context/formContextValue';
import type { ShellAppProps } from './types';
import './components/formInputStyles.css';
import './App.css';

type View = 'landing' | 'select' | 'form' | 'history' | 'view' | 'about' | 'eval' | 'new' | 'new-create' | 'new-load' | 'all' | 'data';

function getInitialView(): View {
  const hash = window.location.hash.slice(1);
  const route = hash.split('/')[1];
  if (['select', 'form', 'history', 'view', 'about', 'eval', 'new', 'new-create', 'new-load', 'all', 'data'].includes(route)) {
    return route as View;
  }
  return 'landing';
}

function AppContent({ shellContext }: ShellAppProps) {
  const [currentView, setCurrentView] = useState<View>(getInitialView());
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const { role } = useFormContext();

  const handleNavigate = (view: View, submissionId?: string) => {
    setCurrentView(view);
    setSelectedSubmissionId(submissionId ?? null);
    window.location.hash = `/${view}${submissionId ? `/${submissionId}` : ''}`;
    window.scrollTo(0, 0);
  };

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <Landing onNavigate={handleNavigate} shellContext={shellContext} />;
      case 'select':
        return <SelectPage onNavigate={handleNavigate} shellContext={shellContext} />;
      case 'form':
        return <FormEditor key={selectedSubmissionId ?? 'new'} onNavigate={handleNavigate} submissionId={selectedSubmissionId || undefined} />;
      case 'eval':
        return <FormEval key={selectedSubmissionId ?? 'new'} submissionId={selectedSubmissionId || undefined} onNavigate={handleNavigate} />;
      case 'history':
        return <SubmissionHistory onNavigate={handleNavigate} />;
      case 'new':
        // For Schule (school), show the new selection page. For Aufsicht (supervision), show the submission list
        return role === 'schule'
          ? <SchuleNew onNavigate={handleNavigate} />
          : <SubmissionNew onNavigate={handleNavigate} />;
      case 'new-create':
        return <FormEditor key="new-create" onNavigate={handleNavigate} submissionId={undefined} parentView="new" showLoadDraft={false} />;
      case 'new-load':
        return <FormEditor key="new-load" onNavigate={handleNavigate} submissionId={undefined} parentView="new" showLoadDraft={true} />;
      case 'all':
        return <SubmissionAll onNavigate={handleNavigate} />;
      case 'view':
        return role === 'schule' 
          ? <SchuleSubmissionView schulnummer={selectedSubmissionId} onNavigate={handleNavigate} />
          : <AufsichtSubmissionView schulnummer={selectedSubmissionId} onNavigate={handleNavigate} />;
      case 'about':
        return <About onNavigate={handleNavigate} />;
      case 'data':
        return <Data onNavigate={handleNavigate} />;
      default:
        return <Landing onNavigate={handleNavigate} shellContext={shellContext} />;
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

function App({ shellContext }: ShellAppProps) {
  return (
    <FormContextProvider shellContext={shellContext}>
      <AppContent shellContext={shellContext} />
    </FormContextProvider>
  );
}

export default App;
