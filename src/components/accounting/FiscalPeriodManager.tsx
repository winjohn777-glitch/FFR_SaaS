import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { FiscalPeriod } from '../../services/JournalEntriesService';

interface FiscalPeriodManagerProps {
  onPeriodChange?: (period: FiscalPeriod | null) => void;
}

const FiscalPeriodManager: React.FC<FiscalPeriodManagerProps> = ({ onPeriodChange }) => {
  const {
    fiscalPeriods,
    getCurrentFiscalPeriod,
    createFiscalPeriod,
    generateFiscalPeriodsForYear,
    refreshData
  } = useData();

  const [currentPeriod, setCurrentPeriod] = useState<FiscalPeriod | null>(null);
  const [showCreatePeriod, setShowCreatePeriod] = useState(false);
  const [showBulkGenerate, setShowBulkGenerate] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [newPeriodForm, setNewPeriodForm] = useState({
    name: '',
    type: 'MONTH' as 'MONTH' | 'QUARTER' | 'YEAR',
    year: new Date().getFullYear(),
    period: 1,
    startDate: '',
    endDate: ''
  });
  const [bulkYear, setBulkYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadCurrentPeriod();
  }, [fiscalPeriods]);

  const loadCurrentPeriod = async () => {
    try {
      const current = await getCurrentFiscalPeriod();
      setCurrentPeriod(current);
      if (onPeriodChange) {
        onPeriodChange(current);
      }
    } catch (error) {
      console.error('Error loading current fiscal period:', error);
    }
  };

  const handleCreatePeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createFiscalPeriod(newPeriodForm);

      setShowCreatePeriod(false);
      setNewPeriodForm({
        name: '',
        type: 'MONTH',
        year: new Date().getFullYear(),
        period: 1,
        startDate: '',
        endDate: ''
      });

      // Refresh to get updated periods
      await refreshData();
      await loadCurrentPeriod();

      alert('Fiscal period created successfully!');
    } catch (error) {
      console.error('Error creating fiscal period:', error);
      alert('Error creating fiscal period. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await generateFiscalPeriodsForYear(bulkYear);

      setShowBulkGenerate(false);
      setBulkYear(new Date().getFullYear());

      // Refresh to get updated periods
      await refreshData();
      await loadCurrentPeriod();

      alert(`Fiscal periods for ${bulkYear} generated successfully!`);
    } catch (error) {
      console.error('Error generating fiscal periods:', error);
      alert('Error generating fiscal periods. Some periods may already exist.');
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodTypeChange = (type: 'MONTH' | 'QUARTER' | 'YEAR') => {
    const year = newPeriodForm.year;
    let startDate = '';
    let endDate = '';
    let name = '';
    let period = 1;

    switch (type) {
      case 'MONTH':
        const month = new Date().getMonth() + 1;
        startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
        endDate = new Date(year, month, 0).toISOString().split('T')[0];
        name = `${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`;
        period = month;
        break;
      case 'QUARTER':
        const quarter = Math.ceil((new Date().getMonth() + 1) / 3);
        const startMonth = (quarter - 1) * 3 + 1;
        startDate = new Date(year, startMonth - 1, 1).toISOString().split('T')[0];
        endDate = new Date(year, startMonth + 2, 0).toISOString().split('T')[0];
        name = `Q${quarter} ${year}`;
        period = quarter;
        break;
      case 'YEAR':
        startDate = `${year}-01-01`;
        endDate = `${year}-12-31`;
        name = `FY ${year}`;
        period = 1;
        break;
    }

    setNewPeriodForm({
      ...newPeriodForm,
      type,
      startDate,
      endDate,
      name,
      period
    });
  };

  const getStatusColor = (period: FiscalPeriod): string => {
    if (period.isClosed) return 'bg-red-100 text-red-800';
    if (!period.isActive) return 'bg-gray-100 text-gray-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (period: FiscalPeriod): string => {
    if (period.isClosed) return 'Closed';
    if (!period.isActive) return 'Inactive';
    return 'Active';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Fiscal Period Management</h2>
        <div className="space-x-2">
          <button
            onClick={() => setShowCreatePeriod(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Period
          </button>
          <button
            onClick={() => setShowBulkGenerate(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Generate Year
          </button>
        </div>
      </div>

      {/* Current Period Display */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Current Fiscal Period</h3>
        {currentPeriod ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-blue-600">{currentPeriod.name}</p>
              <p className="text-gray-600">
                {new Date(currentPeriod.startDate).toLocaleDateString()} - {new Date(currentPeriod.endDate).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(currentPeriod)}`}>
              {getStatusText(currentPeriod)}
            </span>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-4">No active fiscal period found</p>
            <button
              onClick={() => setShowCreatePeriod(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create First Period
            </button>
          </div>
        )}
      </div>

      {/* All Fiscal Periods */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">All Fiscal Periods</h3>
        {fiscalPeriods.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {fiscalPeriods
              .sort((a, b) => b.year - a.year || b.period - a.period)
              .map(period => (
                <div key={period.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">{period.name}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(period)}`}>
                      {getStatusText(period)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Type: {period.type}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()}
                  </p>
                </div>
              ))
            }
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No fiscal periods configured</p>
            <p className="text-sm mt-2">Create periods to start recording journal entries</p>
          </div>
        )}
      </div>

      {/* Create Period Modal */}
      {showCreatePeriod && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Create Fiscal Period</h3>
            <form onSubmit={handleCreatePeriod}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Period Type
                  </label>
                  <select
                    value={newPeriodForm.type}
                    onChange={(e) => handlePeriodTypeChange(e.target.value as any)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="MONTH">Monthly</option>
                    <option value="QUARTER">Quarterly</option>
                    <option value="YEAR">Annual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    value={newPeriodForm.year}
                    onChange={(e) => setNewPeriodForm({ ...newPeriodForm, year: parseInt(e.target.value) })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="2020"
                    max="2030"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Period Name
                  </label>
                  <input
                    type="text"
                    value={newPeriodForm.name}
                    onChange={(e) => setNewPeriodForm({ ...newPeriodForm, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., January 2024"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={newPeriodForm.startDate}
                      onChange={(e) => setNewPeriodForm({ ...newPeriodForm, startDate: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={newPeriodForm.endDate}
                      onChange={(e) => setNewPeriodForm({ ...newPeriodForm, endDate: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreatePeriod(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Period'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Generate Modal */}
      {showBulkGenerate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Generate Fiscal Periods</h3>
            <form onSubmit={handleBulkGenerate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    value={bulkYear}
                    onChange={(e) => setBulkYear(parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="2020"
                    max="2030"
                  />
                </div>

                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                  <p className="font-semibold mb-2">This will create:</p>
                  <ul className="space-y-1">
                    <li>• 12 monthly periods</li>
                    <li>• 4 quarterly periods</li>
                    <li>• 1 annual period</li>
                  </ul>
                  <p className="mt-2 text-xs text-gray-500">Existing periods will be skipped</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowBulkGenerate(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Generate Periods'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiscalPeriodManager;