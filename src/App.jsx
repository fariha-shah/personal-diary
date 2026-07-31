import { useState } from 'react';
import { FiCalendar, FiDollarSign, FiBookOpen, FiGrid } from 'react-icons/fi';

import CalculatorPage from './modules/calculator/CalculatorPage';
import DailyDiaryPage from './modules/daily-diary/DailyDiaryPage';
import PersonalExpensesPage from './modules/personal-expenses/PersonalExpensesPage';
import CalendarPage from './modules/calendar/CalendarPage';

const navigationItems = [
  {
    id: 'expenses',
    label: 'Personal Expenses',
    icon: FiDollarSign,
  },
  {
    id: 'diary',
    label: 'Daily Diary',
    icon: FiBookOpen,
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: FiCalendar,
  },
  {
    id: 'calculator',
    label: 'Calculator',
    icon: FiGrid,
  },
];

function App() {
  const [activePage, setActivePage] = useState('expenses');

  /*
   * Entry ID that should be opened
   * when Calendar sends us to Diary.
   */
  const [diaryEntryToOpen, setDiaryEntryToOpen] = useState(null);

  /*
   * Normal navigation from the top menu.
   */
  const handlePageChange = (page) => {
    setActivePage(page);

    /*
     * If user manually opens Diary,
     * don't automatically open an old entry.
     */
    if (page !== 'diary') {
      setDiaryEntryToOpen(null);
    }
  };

  /*
   * Calendar uses this function when
   * a diary entry is clicked.
   */
  const handleOpenDiaryEntry = (entryId) => {
    setDiaryEntryToOpen(entryId);
    setActivePage('diary');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'expenses':
        return <PersonalExpensesPage />;

      case 'calculator':
        return <CalculatorPage />;

      case 'diary':
        return (
          <DailyDiaryPage
            entryToOpen={diaryEntryToOpen}
            onEntryOpened={() => setDiaryEntryToOpen(null)}
          />
        );

      case 'calendar':
        return <CalendarPage onOpenDiaryEntry={handleOpenDiaryEntry} />;

      default:
        return <PersonalExpensesPage />;
    }
  };

  return (
    <div className="min-h-screen bg-navy-950">
      {/* Testing Navigation */}
      <header className="sticky top-0 z-30 border-b border-navy-700 bg-navy-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:py-0">
            {/* App Name */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-blue text-white">
                <FiBookOpen size={18} />
              </div>

              <div>
                <h1 className="text-base font-semibold text-text-primary">
                  Personal Diary
                </h1>

                <p className="text-xs text-text-muted">Frontend Testing</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handlePageChange(item.id)}
                    className={`
                      inline-flex shrink-0 items-center gap-2
                      rounded-lg px-3 py-2 text-sm font-medium
                      transition-colors
                      ${
                        isActive
                          ? 'bg-accent-blue text-white'
                          : 'text-text-secondary hover:bg-navy-900 hover:text-text-primary'
                      }
                    `}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Active Page */}
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
