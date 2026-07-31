import { useEffect, useState } from 'react';

import { FiPlus, FiBookOpen } from 'react-icons/fi';

import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';

import EntryList from './components/EntryList';
import Editor from './components/Editor';
import { useDiary } from './hooks/useDiary';

export default function DailyDiaryPage({ entryToOpen = null, onEntryOpened }) {
  const [mobileView, setMobileView] = useState('list');

  const [activeEntryId, setActiveEntryId] = useState(null);

  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const { entries, addEntry, updateEntry, deleteEntry } = useDiary();

  const activeEntry =
    entries.find((entry) => entry.id === activeEntryId) || null;

  useEffect(() => {
    if (!entryToOpen || entries.length === 0) {
      return;
    }

    const entryExists = entries.some((entry) => entry.id === entryToOpen);

    if (!entryExists) {
      return;
    }

    setActiveEntryId(entryToOpen);
    setMobileView('editor');

    /*
     * Tell App that the entry has
     * already been opened.
     */
    if (onEntryOpened) {
      onEntryOpened();
    }
  }, [entryToOpen, entries, onEntryOpened]);

  /*
   * Select an entry from the list.
   */
  const handleSelectEntry = (id) => {
    setActiveEntryId(id);
    setMobileView('editor');
  };

  /*
   * Create a new diary entry.
   */
  const handleNewEntry = () => {
    const id = addEntry({});

    setActiveEntryId(id);
    setMobileView('editor');
  };

  /*
   * Delete confirmation.
   */
  const handleDeleteConfirmed = () => {
    if (!deleteTargetId) {
      return;
    }

    deleteEntry(deleteTargetId);

    if (deleteTargetId === activeEntryId) {
      setActiveEntryId(null);
      setMobileView('list');
    }

    setDeleteTargetId(null);
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col animate-[fadeIn_0.35s_ease-out]">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-text-primary">
          Daily Diary
        </h1>

        <p className="mt-1 text-sm text-text-secondary">
          Write down your day, one entry at a time.
        </p>
      </div>

      {/* Main Diary Layout */}
      <div className="flex min-h-0 flex-1 gap-4">
        {/* Entries List */}
        <Card
          padding="p-0"
          className={`
            w-full shrink-0 flex-col
            overflow-hidden lg:w-80
            ${mobileView === 'list' ? 'flex' : 'hidden lg:flex'}
          `}
        >
          {/* List Header */}
          <div className="flex items-center justify-between border-b border-navy-700 p-4">
            <h2 className="font-medium text-text-primary">Entries</h2>

            <Button size="sm" icon={FiPlus} onClick={handleNewEntry}>
              New
            </Button>
          </div>

          {/* Entry List */}
          <div className="flex-1 overflow-y-auto">
            <EntryList
              entries={entries}
              activeEntryId={activeEntryId}
              onSelect={handleSelectEntry}
            />
          </div>
        </Card>

        {/* Editor */}
        <Card
          padding="p-0"
          className={`
            flex-1 flex-col
            overflow-hidden
            ${mobileView === 'editor' ? 'flex' : 'hidden lg:flex'}
          `}
        >
          {/* Mobile Back */}
          <button
            type="button"
            onClick={() => setMobileView('list')}
            className="px-4 pt-4 text-left text-sm text-text-secondary hover:text-text-primary lg:hidden"
          >
            ← Back to entries
          </button>

          <div className="min-h-0 flex-1">
            {activeEntry ? (
              <Editor
                entry={activeEntry}
                onChange={(updates) => updateEntry(activeEntry.id, updates)}
                onDelete={() => setDeleteTargetId(activeEntry.id)}
              />
            ) : (
              <div className="flex h-full items-center justify-center px-4">
                <EmptyState
                  icon={FiBookOpen}
                  message="Select an entry to view"
                  subMessage="Or create a new one to start writing."
                />
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirmed}
        title="Delete this entry?"
        message="This diary entry will be permanently removed."
      />
    </div>
  );
}
