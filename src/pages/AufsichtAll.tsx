import { useState, useMemo } from 'react';
import { Breadcrumb, SubmissionTable } from '../components';
import '../components/formInputStyles.css';
import type { Submission } from '../types';

interface AufsichtAllProps {
  onNavigate: (view: 'landing' | 'form' | 'history' | 'view' | 'about' | 'eval' | 'new' | 'all', submissionId?: string) => void;
}

interface FilterState {
  searchTerm: string;
  status: string;
  owner: string;
  year: string;
  submissionStatus: string;
}

interface School {
  schulnummer: string;
  name: string;
  region: string;
  director: string;
}

// Mock schools data
const MOCK_SCHOOLS: School[] = [
  { schulnummer: '0001', name: 'Grundschule am Markt', region: 'Lkr. Coburg', director: 'Thomas Müller' },
  { schulnummer: '0002', name: 'Realschule Stadtmitte', region: 'Lkr. Coburg', director: 'Brigitte Schmidt' },
  { schulnummer: '0003', name: 'Gymnasium Ost', region: 'Lkr. Forchheim', director: 'Anna Weber' },
  { schulnummer: '0004', name: 'Förderschule Süd', region: 'Lkr. Forchheim', director: 'Klaus Wagner' },
  { schulnummer: '0005', name: 'Mittelschule Nord', region: 'Lkr. Forchheim', director: 'Maria Fischer' },
  { schulnummer: '0006', name: 'Berufliche Schule West', region: 'Lkr. Kronach', director: 'Peter Bauer' },
  { schulnummer: '0007', name: 'Grundschule Bergfeld', region: 'Lkr. Kronach', director: 'Sabine Hoffmann' },
  { schulnummer: '0008', name: 'Gymnasium Central', region: 'Lkr. Bamberg', director: 'Robert König' },
];

// Self-contained mock data: Multiple schools with various submission statuses
const MOCK_SUBMISSIONS: Submission[] = [
  {
    schulnummer: '0001',
    owner: 'thomas.mueller@organisation.de',
    status: 'pending_review',
    createdAt: new Date('2025-07-15T10:30:00'),
    updatedAt: new Date('2025-07-15T14:20:00'),
    submittedAt: new Date('2025-07-15T14:20:00'),
    data: {
      title: 'Zielvereinbarung 2025',
      istStandAnalyse: 'Positive Entwicklung in der Lernstandserhebung. Fokus auf digitale Kompetenzen und Chancengerechtigkeit.',
      supportPersonnel: true,
      supportTypes: ['SEM', 'Schulpsychologe'],
      supportOtherText: '',
      dataSources: ['Schulstatistiken (z. B. ASV/ASD)', 'Zentrale Lernstandserhebungen (z. B. VERA, BYLES, Lernstand 5, Orientierungsarbeiten)'],
      questionModules: [
        {
          id: '1',
          smartGoal: 'Verbesserung der Mathematik-Fähigkeiten um 20%.',
          targetGroup: ['5. Jahrgangsstufe'],
          targetGroupOther: '',
          subject: ['Mathematik'],
          subjectOther: '',
          dataSources: ['Zentrale Lernstandserhebungen (z. B. VERA, BYLES, Lernstand 5, Orientierungsarbeiten)'],
          dataSourcesOther: '',
          startDate: '2025-08-01',
          endDate: '2025-12-31',
          comments: 'Einsatz neuer Methoden im Unterricht.',
        },
      ],
      measureModules: [
        {
          id: '1',
          description: 'Mathematik-Workshops für Lehrkräfte.',
          type: 'Unterricht/Förderung',
          responsible: 'Schulleiter',
          involved: ['Fachlehrkräfte'],
          resources: ['Schulungsbudget'],
          resourcesDescription: 'ca. 2000€',
          workMethod: ['Schulungen', 'Austausch'],
          workMethodDescription: 'Regelmäßige Treffen zur Erfahrungsaustausch',
          deadline: '2025-08-15',
        },
      ],
      selectedGoal: 'Verbesserte Mathematik-Leistungen in der 5. Jahrgangsstufe.',
      evaluationDate: '2026-03-31',
      bilanzierungDate: '2026-06-30',
    },
  },
  {
    schulnummer: '0003',
    owner: 'anna.weber@organisation.de',
    status: 'pending_review',
    createdAt: new Date('2026-08-10T09:15:00'),
    updatedAt: new Date('2026-08-20T15:45:00'),
    submittedAt: new Date('2026-08-20T15:45:00'),
    data: {
      title: 'Zielvereinbarung 2026',
      istStandAnalyse: 'Die Schule hat bedeutende Fortschritte in der Digitalisierung gemacht. Neue Herausforderungen entstehen durch die Integration von Schülerinnen und Schülern mit Migrationshintergrund.',
      supportPersonnel: true,
      supportTypes: ['Schulpsychologe'],
      supportOtherText: '',
      dataSources: ['Schulstatistiken (z. B. ASV/ASD)'],
      questionModules: [
        {
          id: '1',
          smartGoal: 'Erhöhung der Beteiligung von Schülerinnen und Schülern an Schulentwicklung um 25% bis Ende 2026.',
          targetGroup: ['Alle Schülerinnen und Schüler'],
          targetGroupOther: '',
          subject: ['Schulentwicklung'],
          subjectOther: '',
          dataSources: ['Schulstatistiken (z. B. ASV/ASD)'],
          dataSourcesOther: '',
          startDate: '2026-09-01',
          endDate: '2026-12-31',
          comments: 'Durchführung von Schülerparlament und regelmäßigen Feedback-Runden.',
        },
      ],
      measureModules: [
        {
          id: '1',
          description: 'Einrichtung eines Schülerparlaments mit monatlichen Treffen.',
          type: 'Schulentwicklung',
          responsible: 'Schulleiter',
          involved: ['Klassensprecherinnen', 'Schulsprecher'],
          resources: ['Raum', 'Zeit'],
          resourcesDescription: 'Budget für Materialien: ca. 200€',
          workMethod: ['Partizipative Entscheidungsfindung'],
          workMethodDescription: 'Transparente Kommunikation zwischen Schule und Schülerinnen und Schülern.',
          deadline: '2026-09-15',
        },
      ],
      selectedGoal: 'Erhöhte Partizipation von Schülerinnen und Schülern in Schulentwicklungsprozessen.',
      evaluationDate: '2027-03-31',
      bilanzierungDate: '2027-06-30',
    },
  },
];

export function AufsichtAll({ onNavigate }: AufsichtAllProps) {
  const [activeTab, setActiveTab] = useState<'submissions' | 'schoolStatus'>('schoolStatus');
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    status: '',
    owner: '',
    year: '',
    submissionStatus: '',
  });

  const mockSubmissions: Submission[] = MOCK_SUBMISSIONS;
  const mockSchools: School[] = MOCK_SCHOOLS;

  // Extract unique years for filter dropdown
  const uniqueYears = useMemo(
    () => Array.from(new Set(mockSubmissions.map((s) => s.createdAt.getFullYear().toString()))).sort().reverse(),
    [mockSubmissions]
  );

  // Extract unique statuses for filter dropdown
  const uniqueStatuses = useMemo(
    () => Array.from(new Set(mockSubmissions.map((s) => s.status))).sort(),
    [mockSubmissions]
  );

  // Filter submissions based on selected filters
  const filteredSubmissions = useMemo(() => {
    return mockSubmissions.filter((submission) => {
      const searchLower = filters.searchTerm.toLowerCase();
      const titleMatch = (submission.data.title as string)?.toLowerCase().includes(searchLower);
      const schulnummerMatch = submission.schulnummer.includes(searchLower);
      const searchMatch = titleMatch || schulnummerMatch;

      const statusMatch = !filters.status || submission.status === filters.status;
      const ownerMatch = !filters.owner || submission.owner === filters.owner;
      const yearMatch = !filters.year || submission.createdAt.getFullYear().toString() === filters.year;

      return searchMatch && statusMatch && ownerMatch && yearMatch;
    });
  }, [filters, mockSubmissions]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ searchTerm: '', status: '', owner: '', year: '', submissionStatus: '' });
  };

  // Get school submission status
  const schoolStatusData = useMemo(() => {
    return mockSchools.map((school) => {
      const hasSubmission = mockSubmissions.some((s) => s.schulnummer === school.schulnummer);
      const submissions = mockSubmissions.filter((s) => s.schulnummer === school.schulnummer);
      const lastSubmission = submissions.length > 0 
        ? submissions.reduce((latest, current) => 
            current.updatedAt > latest.updatedAt ? current : latest
          ).updatedAt
        : null;

      return {
        ...school,
        hasSubmission,
        submissionCount: submissions.length,
        lastSubmission,
        status: hasSubmission ? 'submitted' : 'not_submitted',
      };
    });
  }, [mockSchools, mockSubmissions]);

  // Filter school status data
  const filteredSchoolStatus = useMemo(() => {
    return schoolStatusData.filter((school) => {
      const searchLower = filters.searchTerm.toLowerCase();
      const nameMatch = school.name.toLowerCase().includes(searchLower);
      const numberMatch = school.schulnummer.includes(searchLower);
      const regionMatch = school.region.toLowerCase().includes(searchLower);
      const searchMatch = nameMatch || numberMatch || regionMatch;

      const statusMatch = !filters.submissionStatus || school.status === filters.submissionStatus;

      return searchMatch && statusMatch;
    });
  }, [filters, schoolStatusData]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <Breadcrumb 
        items={[
          { label: 'Start', onClick: () => onNavigate('landing') },
          { label: 'Alle Einreichungen' }
        ]}
      />
      
      <header>
        <h1>Alle Zielvereinbarungen</h1>
      </header>

      {/* Tab Navigation */}
      <div style={{ marginTop: '2rem', borderBottom: '2px solid #ddd' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('schoolStatus')}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '0.95rem',
              fontWeight: activeTab === 'schoolStatus' ? '600' : '400',
              background: activeTab === 'schoolStatus' ? '#1E8AD9' : 'transparent',
              color: activeTab === 'schoolStatus' ? 'white' : '#333',
              border: 'none',
              borderBottom: activeTab === 'schoolStatus' ? '3px solid #1E8AD9' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: '-2px',
            }}
            onMouseOver={(e) => {
              if (activeTab !== 'schoolStatus') {
                e.currentTarget.style.background = '#f0f0f0';
              }
            }}
            onMouseOut={(e) => {
              if (activeTab !== 'schoolStatus') {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            Aktuelles Schuljahr
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '0.95rem',
              fontWeight: activeTab === 'submissions' ? '600' : '400',
              background: activeTab === 'submissions' ? '#1E8AD9' : 'transparent',
              color: activeTab === 'submissions' ? 'white' : '#333',
              border: 'none',
              borderBottom: activeTab === 'submissions' ? '3px solid #1E8AD9' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: '-2px',
            }}
            onMouseOver={(e) => {
              if (activeTab !== 'submissions') {
                e.currentTarget.style.background = '#f0f0f0';
              }
            }}
            onMouseOut={(e) => {
              if (activeTab !== 'submissions') {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            Alle Einreichungen
          </button>
        </div>
      </div>

      {/* Submissions Tab */}
      {activeTab === 'submissions' && (
        <>
          {/* Filter Section */}
          <div className="filter-section">
            <h3>Filter</h3>
            
            <div className="filter-grid">
              {/* Search Input */}
              <div className="filter-group">
                <label>Suche (Titel/Schulnummer)</label>
                <input
                  type="text"
                  placeholder="Suchbegriff eingeben..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div className="filter-group">
                <label>Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">Alle Statuses</option>
                  {uniqueStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div className="filter-group">
                <label>Jahr</label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                >
                  <option value="">Alle Jahre</option>
                  {uniqueYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reset Button */}
            <div className="filter-actions">
              <button onClick={handleResetFilters} className="filter-button">
                Filter zurücksetzen
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div style={{ marginTop: '2rem' }}>
            <p style={{ marginBottom: '1rem', color: '#666' }}>
              {filteredSubmissions.length} von {mockSubmissions.length} Einreichung{filteredSubmissions.length !== 1 ? 'en' : ''} angezeigt
              {filters.searchTerm || filters.status || filters.owner ? ' (gefiltert)' : ''}
            </p>

            {filteredSubmissions.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f8f9fa', borderRadius: '6px', color: '#666' }}>
                <p>Keine Einreichungen gefunden. Bitte ändern Sie Ihre Filterkriterien.</p>
              </div>
            ) : (
              <SubmissionTable
                submissions={filteredSubmissions}
                onViewSubmission={(schulnummer) => onNavigate('view', schulnummer)}
                onEditSubmission={(schulnummer) => onNavigate('view', schulnummer)}
                onEvalSubmission={(schulnummer) => onNavigate('eval', schulnummer)}
                showEditButton={() => false}
                showEvalButton={(status) => status === 'pending_review'}
              />
            )}
          </div>
        </>
      )}

      {/* Schools Tab */}
      {/* School Status Tab */}
      {activeTab === 'schoolStatus' && (
        <>
          {/* Filter Section */}
          <div className="filter-section">
            <h3>Filter</h3>
            
            <div className="filter-grid">
              {/* Search Input */}
              <div className="filter-group">
                <label>Suche (Schulname/Nummer/Region)</label>
                <input
                  type="text"
                  placeholder="Suchbegriff eingeben..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                />
              </div>

              {/* Submission Status Filter */}
              <div className="filter-group">
                <label>Einreichungsstatus</label>
                <select
                  value={filters.submissionStatus}
                  onChange={(e) => handleFilterChange('submissionStatus', e.target.value)}
                >
                  <option value="">Alle Schulen</option>
                  <option value="submitted">Eingereicht</option>
                  <option value="not_submitted">Nicht eingereicht</option>
                </select>
              </div>
            </div>

            {/* Reset Button */}
            <div className="filter-actions">
              <button onClick={handleResetFilters} className="filter-button">
                Filter zurücksetzen
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div style={{ marginTop: '2rem' }}>
            <p style={{ marginBottom: '1.5rem', color: '#666' }}>
              {filteredSchoolStatus.length} von {schoolStatusData.length} Schulen angezeigt
            </p>

            {filteredSchoolStatus.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f8f9fa', borderRadius: '6px', color: '#666' }}>
                <p>Keine Schulen gefunden. Bitte ändern Sie Ihre Filterkriterien.</p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left', backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '0.75rem', fontWeight: '600' }}>Schulnummer</th>
                    <th style={{ padding: '0.75rem', fontWeight: '600' }}>Schulname</th>
                    <th style={{ padding: '0.75rem', fontWeight: '600' }}>Region</th>
                    <th style={{ padding: '0.75rem', fontWeight: '600' }}>Schulleitung</th>
                    <th style={{ padding: '0.75rem', fontWeight: '600' }}>Status</th>
                    <th style={{ padding: '0.75rem', fontWeight: '600' }}>Datum</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchoolStatus.map((school) => {
                    const formatDate = (date: Date | null) => {
                      if (!date) return '-';
                      return new Intl.DateTimeFormat('de-DE', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      }).format(date);
                    };

                    return (
                      <tr key={school.schulnummer} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.9em', fontWeight: '600' }}>
                          {school.schulnummer}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          {school.name}
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: '0.9em', color: '#666' }}>
                          {school.region}
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: '0.9em', color: '#666' }}>
                          {school.director}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          {school.hasSubmission ? (
                            <span style={{ display: 'inline-block', background: '#d4edda', color: '#155724', padding: '0.35rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '500' }}>
                              ✓ 
                            </span>
                          ) : (
                            <span style={{ display: 'inline-block', background: '#f8d7da', color: '#721c24', padding: '0.35rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '500' }}>
                              ✕ 
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: '0.9em', color: '#666' }}>
                          {formatDate(school.lastSubmission)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
