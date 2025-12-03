import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import {
  JournalEntry,
  JournalEntryStatus,
  SourceModule,
  CreateJournalEntryData,
  QuickEntryData
} from '../../services/JournalEntriesService';

interface EnhancedJournalEntryProps {
  onEntryCreated?: (entry: JournalEntry) => void;
  onClose?: () => void;
}

const EnhancedJournalEntry: React.FC<EnhancedJournalEntryProps> = ({ onEntryCreated, onClose }) => {
  const {
    createEnhancedJournalEntry,
    createQuickEntry,
    getJournalEntryTemplates,
    getCurrentFiscalPeriod,
    accounts
  } = useData();

  const [mode, setMode] = useState<'beginner' | 'advanced'>('beginner');
  const [entryType, setEntryType] = useState<'manual' | 'quick' | 'template'>('manual');
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<any>({});
  const [currentFiscalPeriod, setCurrentFiscalPeriod] = useState<any>(null);

  // Manual entry state
  const [manualEntry, setManualEntry] = useState<CreateJournalEntryData>({
    organizationId: 'org_default',
    fiscalPeriodId: '',
    entryDate: new Date().toISOString().split('T')[0],
    description: '',
    reference: '',
    notes: '',
    createdById: 'user_default', // Default user ID
    lines: [
      { accountId: '', description: '', debit: 0, credit: 0 },
      { accountId: '', description: '', debit: 0, credit: 0 }
    ]
  });

  // Quick entry state
  const [quickEntry, setQuickEntry] = useState<QuickEntryData>({
    organizationId: 'org_default',
    fiscalPeriodId: '',
    template: '',
    amount: 0,
    description: '',
    reference: '',
    vendor: '',
    createdById: 'user_default'
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [templatesData, currentPeriod] = await Promise.all([
        getJournalEntryTemplates(),
        getCurrentFiscalPeriod()
      ]);

      setTemplates(templatesData);
      setCurrentFiscalPeriod(currentPeriod);

      if (currentPeriod) {
        setManualEntry(prev => ({ ...prev, fiscalPeriodId: currentPeriod.id }));
        setQuickEntry(prev => ({ ...prev, fiscalPeriodId: currentPeriod.id }));
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const handleAddLine = () => {
    setManualEntry(prev => ({
      ...prev,
      lines: [...prev.lines, { accountId: '', description: '', debit: 0, credit: 0 }]
    }));
  };

  const handleRemoveLine = (index: number) => {
    if (manualEntry.lines.length > 2) {
      setManualEntry(prev => ({
        ...prev,
        lines: prev.lines.filter((_, i) => i !== index)
      }));
    }
  };

  const handleLineChange = (index: number, field: string, value: any) => {
    setManualEntry(prev => ({
      ...prev,
      lines: prev.lines.map((line, i) =>
        i === index ? { ...line, [field]: value } : line
      )
    }));
  };

  const calculateTotals = () => {
    const totalDebits = manualEntry.lines.reduce((sum, line) => sum + (line.debit || 0), 0);
    const totalCredits = manualEntry.lines.reduce((sum, line) => sum + (line.credit || 0), 0);
    const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

    return { totalDebits, totalCredits, isBalanced };
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { isBalanced } = calculateTotals();

      if (!isBalanced) {
        alert('Entry is not balanced. Debits must equal credits.');
        return;
      }

      // Filter out empty lines
      const validLines = manualEntry.lines.filter(line =>
        line.accountId && (line.debit > 0 || line.credit > 0)
      );

      if (validLines.length < 2) {
        alert('Entry must have at least 2 valid lines.');
        return;
      }

      const newEntry = await createEnhancedJournalEntry({
        ...manualEntry,
        lines: validLines
      });

      if (onEntryCreated) {
        onEntryCreated(newEntry);
      }

      alert('Journal entry created successfully!');

      if (onClose) {
        onClose();
      } else {
        // Reset form
        setManualEntry({
          organizationId: 'org_default',
          fiscalPeriodId: currentFiscalPeriod?.id || '',
          entryDate: new Date().toISOString().split('T')[0],
          description: '',
          reference: '',
          notes: '',
          createdById: 'user_default',
          lines: [
            { accountId: '', description: '', debit: 0, credit: 0 },
            { accountId: '', description: '', debit: 0, credit: 0 }
          ]
        });
      }
    } catch (error) {
      console.error('Error creating journal entry:', error);
      alert('Error creating journal entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!quickEntry.template || quickEntry.amount <= 0) {
        alert('Please select a template and enter a valid amount.');
        return;
      }

      const newEntry = await createQuickEntry(quickEntry);

      if (onEntryCreated) {
        onEntryCreated(newEntry);
      }

      alert('Quick entry created successfully!');

      if (onClose) {
        onClose();
      } else {
        // Reset form
        setQuickEntry({
          organizationId: 'org_default',
          fiscalPeriodId: currentFiscalPeriod?.id || '',
          template: '',
          amount: 0,
          description: '',
          reference: '',
          vendor: '',
          createdById: 'user_default'
        });
      }
    } catch (error) {
      console.error('Error creating quick entry:', error);
      alert('Error creating quick entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const { totalDebits, totalCredits, isBalanced } = calculateTotals();

  const getQuickEntryTemplates = () => {
    return templates.roofing_business ? Object.entries(templates.roofing_business).map(([key, value]: [string, any]) => ({
      key,
      name: value.name,
      description: value.description
    })) : [];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Create Journal Entry</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setMode(mode === 'beginner' ? 'advanced' : 'beginner')}
            className={`px-4 py-2 rounded-md transition-colors ${
              mode === 'beginner'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {mode === 'beginner' ? 'Switch to Advanced' : 'Switch to Beginner'}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Current Fiscal Period Display */}
      {currentFiscalPeriod && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-600">
            <span className="font-semibold">Current Period:</span> {currentFiscalPeriod.name}
            <span className="ml-4">
              ({new Date(currentFiscalPeriod.startDate).toLocaleDateString()} -
              {new Date(currentFiscalPeriod.endDate).toLocaleDateString()})
            </span>
          </p>
        </div>
      )}

      {/* Entry Type Selection */}
      <div className="mb-6">
        <div className="flex space-x-4">
          {mode === 'beginner' ? (
            <button
              onClick={() => setEntryType('quick')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                entryType === 'quick'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Quick Entry (Recommended)
            </button>
          ) : null}
          <button
            onClick={() => setEntryType('manual')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              entryType === 'manual'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {mode === 'beginner' ? 'Custom Entry' : 'Manual Entry'}
          </button>
        </div>
      </div>

      {/* Quick Entry Form */}
      {entryType === 'quick' && (
        <form onSubmit={handleQuickSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Type *
              </label>
              <select
                value={quickEntry.template}
                onChange={(e) => setQuickEntry({ ...quickEntry, template: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select transaction type...</option>
                {getQuickEntryTemplates().map(template => (
                  <option key={template.key} value={template.key}>
                    {template.name}
                  </option>
                ))}
              </select>
              {quickEntry.template && (
                <p className="mt-1 text-sm text-gray-500">
                  {getQuickEntryTemplates().find(t => t.key === quickEntry.template)?.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount *
              </label>
              <input
                type="number"
                step="0.01"
                value={quickEntry.amount}
                onChange={(e) => setQuickEntry({ ...quickEntry, amount: parseFloat(e.target.value) || 0 })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <input
                type="text"
                value={quickEntry.description}
                onChange={(e) => setQuickEntry({ ...quickEntry, description: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description of the transaction"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor/Reference
              </label>
              <input
                type="text"
                value={quickEntry.vendor}
                onChange={(e) => setQuickEntry({ ...quickEntry, vendor: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Vendor name or reference number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference Number
            </label>
            <input
              type="text"
              value={quickEntry.reference}
              onChange={(e) => setQuickEntry({ ...quickEntry, reference: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Invoice number, check number, etc."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Quick Entry'}
            </button>
          </div>
        </form>
      )}

      {/* Manual Entry Form */}
      {entryType === 'manual' && (
        <form onSubmit={handleManualSubmit} className="space-y-6">
          {/* Entry Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entry Date *
              </label>
              <input
                type="date"
                value={manualEntry.entryDate}
                onChange={(e) => setManualEntry({ ...manualEntry, entryDate: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <input
                type="text"
                value={manualEntry.description}
                onChange={(e) => setManualEntry({ ...manualEntry, description: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Entry description"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reference
              </label>
              <input
                type="text"
                value={manualEntry.reference}
                onChange={(e) => setManualEntry({ ...manualEntry, reference: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Reference number"
              />
            </div>
          </div>

          {/* Journal Lines */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Journal Lines</h3>
              <button
                type="button"
                onClick={handleAddLine}
                className="px-4 py-2 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
              >
                Add Line
              </button>
            </div>

            <div className="space-y-4">
              {manualEntry.lines.map((line, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 border rounded-lg">
                  <div className="md:col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account
                    </label>
                    <select
                      value={line.accountId}
                      onChange={(e) => handleLineChange(index, 'accountId', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select account...</option>
                      {accounts.map(account => (
                        <option key={account.id} value={account.id}>
                          {account.code} - {account.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={line.description}
                      onChange={(e) => handleLineChange(index, 'description', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Line description"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Debit
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={line.debit || ''}
                      onChange={(e) => handleLineChange(index, 'debit', parseFloat(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Credit
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={line.credit || ''}
                      onChange={(e) => handleLineChange(index, 'credit', parseFloat(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="md:col-span-1">
                    {manualEntry.lines.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLine(index)}
                        className="w-full p-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals Display */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="font-semibold">Total Debits:</span> ${totalDebits.toFixed(2)}
                  <span className="ml-4 font-semibold">Total Credits:</span> ${totalCredits.toFixed(2)}
                </div>
                <div className={`text-sm font-semibold ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                  {isBalanced ? '✓ Balanced' : '⚠ Not Balanced'}
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={manualEntry.notes}
              onChange={(e) => setManualEntry({ ...manualEntry, notes: e.target.value })}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Additional notes or comments"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !isBalanced}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Journal Entry'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EnhancedJournalEntry;