import { useState, useEffect } from 'react';
import { Landing, SelectPage, FormEditor, FormEval, SchuleHistory, AufsichtAll, SchuleSubmissionView, AufsichtSubmissionView, AufsichtNew, About, Data, SchuleNew } from './pages';
import { Footer } from './components';
import { FormContextProvider } from './context/FormContext';
import { useFormContext } from './context/formContextValue';
import { ROUTES, generateHash, parseHashRoute, type RouteValue } from './constants/routes';
import { initializeApp } from './utils/appInitialization';
import type { ShellAppProps } from './types';
import './components/formInputStyles.css';
import './App.css';

function getInitialView(): RouteValue {
  const { route } = parseHashRoute(window.location.hash);
  return route;
}

function AppContent({ shellContext }: ShellAppProps) {
  const [currentView, setCurrentView] = useState<RouteValue>(getInitialView());
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const { role } = useFormContext();

  const handleNavigate = (view: RouteValue, submissionId?: string) => {
    setCurrentView(view);
    setSelectedSubmissionId(submissionId ?? null);
    window.location.hash = generateHash(view, submissionId);
    window.scrollTo(0, 0);
  };

  const renderView = () => {
    switch (currentView) {
      case ROUTES.LANDING:
        return <Landing onNavigate={handleNavigate} shellContext={shellContext} />;
      case ROUTES.SELECT:
        return <SelectPage onNavigate={handleNavigate} shellContext={shellContext} />;
      case ROUTES.FORM:
        return <FormEditor key={selectedSubmissionId ?? 'new'} onNavigate={handleNavigate} submissionId={selectedSubmissionId || undefined} />;
      case ROUTES.EVAL:
        return <FormEval key={selectedSubmissionId ?? 'new'} submissionId={selectedSubmissionId || undefined} onNavigate={handleNavigate} />;
      case ROUTES.HISTORY:
        return <SchuleHistory onNavigate={handleNavigate} />;
      case ROUTES.NEW:
        // For Schule (school), show the new selection page. For Aufsicht (supervision), show the submission list
        return role === 'schule'
          ? <SchuleNew onNavigate={handleNavigate} />
          : <AufsichtNew onNavigate={handleNavigate} />;
      case ROUTES.NEW_CREATE:
        return <FormEditor key="new-create" onNavigate={handleNavigate} submissionId={undefined} parentView="new" showLoadDraft={false} />;
      case ROUTES.NEW_LOAD:
        return <FormEditor key="new-load" onNavigate={handleNavigate} submissionId={undefined} parentView="new" showLoadDraft={true} />;
      case ROUTES.ALL:
        return <AufsichtAll onNavigate={handleNavigate} />;
      case ROUTES.VIEW:
        return role === 'schule' 
          ? <SchuleSubmissionView schulnummer={selectedSubmissionId} onNavigate={handleNavigate} />
          : <AufsichtSubmissionView schulnummer={selectedSubmissionId} onNavigate={handleNavigate} />;
      case ROUTES.ABOUT:
        return <About onNavigate={handleNavigate} />;
      case ROUTES.DATA:
        return <Data onNavigate={handleNavigate} />;
      default:
        return <Landing onNavigate={handleNavigate} shellContext={shellContext} />;
    }
  };

  return (
    <div className="app">
      <main>
        {renderView()}
        {currentView === ROUTES.LANDING && <Footer onNavigate={handleNavigate} />}
      </main>
    </div>
  );
}

function App({ shellContext }: ShellAppProps) {
  useEffect(() => {
    void initializeApp();
  }, []);

  return (
    <FormContextProvider shellContext={shellContext}>
      <AppContent shellContext={shellContext} />
    </FormContextProvider>
  );
}

export default App;
