import { useEffect, useState, useCallback, useMemo } from "react";
import API from "../API/Axios";
import EditExpenseModal from "./EditExpenseModal";

// ==================== CONSTANTS ====================
const CATEGORY_ICONS = {
  Food: "🍔",
  Travel: "✈️",
  Shopping: "🛍️",
  Rent: "🏠",
  Entertainment: "🎬",
  Healthcare: "⚕️",
  Education: "📚",
  Utilities: "💡",
  Other: "📦",
};

const CATEGORY_COLORS = {
  Food: "#22c55e",
  Travel: "#38bdf8",
  Shopping: "#facc15",
  Rent: "#f87171",
  Entertainment: "#a78bfa",
  Healthcare: "#ec4899",
  Education: "#8b5cf6",
  Utilities: "#f59e0b",
  Other: "#64748b",
};

const SORT_OPTIONS = {
  DATE_DESC: "date_desc",
  DATE_ASC: "date_asc",
  AMOUNT_DESC: "amount_desc",
  AMOUNT_ASC: "amount_asc",
  TITLE_ASC: "title_asc",
  TITLE_DESC: "title_desc",
};

const ITEMS_PER_PAGE = 10;

// ==================== MAIN COMPONENT ====================
const ExpenseTable = ({ refreshKey, onChange }) => {
  const [expenses, setExpenses] = useState([]);
  const [tableState, setTableState] = useState({
    loading: true,
    error: null,
    sortBy: SORT_OPTIONS.DATE_DESC,
    filterCategory: "all",
    searchQuery: "",
    currentPage: 1,
  });
  const [editExpense, setEditExpense] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // ==================== DATA FETCHING ====================
  const fetchExpenses = useCallback(async () => {
    try {
      setTableState((prev) => ({ ...prev, loading: true, error: null }));
      const res = await API.get("/expenses");
      setExpenses(res.data || []);
      setTableState((prev) => ({ ...prev, loading: false }));
    } catch (err) {
      console.error("Fetch expense error", err);
      setTableState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load expenses. Please try again.",
      }));
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [refreshKey, fetchExpenses]);

  // ==================== HANDLERS ====================
  const handleDelete = useCallback(
    async (id, title) => {
      const confirmed = window.confirm(
        `Are you sure you want to delete "${title}"? This action cannot be undone.`
      );
      if (!confirmed) return;

      setDeletingId(id);
      try {
        await API.delete(`/expenses/${id}`);
        setExpenses((prev) => prev.filter((e) => e._id !== id));
        onChange();
      } catch (err) {
        console.error("Delete error", err);
        alert("Failed to delete expense. Please try again.");
      } finally {
        setDeletingId(null);
      }
    },
    [onChange]
  );

  const handleEdit = useCallback((expense) => {
    setEditExpense(expense);
  }, []);

  const handleEditClose = useCallback(() => {
    setEditExpense(null);
  }, []);

  const handleEditSuccess = useCallback(() => {
    setEditExpense(null);
    fetchExpenses();
    onChange();
  }, [fetchExpenses, onChange]);

  const handleSortChange = useCallback((newSort) => {
    setTableState((prev) => ({ ...prev, sortBy: newSort, currentPage: 1 }));
  }, []);

  const handleFilterChange = useCallback((category) => {
    setTableState((prev) => ({ ...prev, filterCategory: category, currentPage: 1 }));
  }, []);

  const handleSearchChange = useCallback((query) => {
    setTableState((prev) => ({ ...prev, searchQuery: query, currentPage: 1 }));
  }, []);

  const handlePageChange = useCallback((page) => {
    setTableState((prev) => ({ ...prev, currentPage: page }));
  }, []);

  const handleRetry = useCallback(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // ==================== COMPUTED VALUES ====================
  const filteredAndSortedExpenses = useMemo(() => {
    let result = [...expenses];

    // Filter by category
    if (tableState.filterCategory !== "all") {
      result = result.filter((e) => e.category === tableState.filterCategory);
    }

    // Filter by search query
    if (tableState.searchQuery.trim()) {
      const query = tableState.searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(query) ||
          e.category.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (tableState.sortBy) {
        case SORT_OPTIONS.DATE_DESC:
          return new Date(b.date) - new Date(a.date);
        case SORT_OPTIONS.DATE_ASC:
          return new Date(a.date) - new Date(b.date);
        case SORT_OPTIONS.AMOUNT_DESC:
          return b.amount - a.amount;
        case SORT_OPTIONS.AMOUNT_ASC:
          return a.amount - b.amount;
        case SORT_OPTIONS.TITLE_ASC:
          return a.title.localeCompare(b.title);
        case SORT_OPTIONS.TITLE_DESC:
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return result;
  }, [expenses, tableState.filterCategory, tableState.searchQuery, tableState.sortBy]);

  const paginatedExpenses = useMemo(() => {
    const startIndex = (tableState.currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedExpenses.slice(startIndex, endIndex);
  }, [filteredAndSortedExpenses, tableState.currentPage]);

  const totalPages = Math.ceil(filteredAndSortedExpenses.length / ITEMS_PER_PAGE);

  const uniqueCategories = useMemo(() => {
    return [...new Set(expenses.map((e) => e.category))].sort();
  }, [expenses]);

  const stats = useMemo(() => {
    const total = filteredAndSortedExpenses.reduce((sum, e) => sum + e.amount, 0);
    const count = filteredAndSortedExpenses.length;
    const avg = count > 0 ? total / count : 0;

    return { total, count, avg };
  }, [filteredAndSortedExpenses]);

  // ==================== RENDER HELPERS ====================
  if (tableState.loading) {
    return <LoadingState />;
  }

  if (tableState.error) {
    return <ErrorState message={tableState.error} onRetry={handleRetry} />;
  }

  if (expenses.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="table-card">
      <TableHeader
        searchQuery={tableState.searchQuery}
        onSearchChange={handleSearchChange}
        stats={stats}
      />

      <TableFilters
        sortBy={tableState.sortBy}
        onSortChange={handleSortChange}
        filterCategory={tableState.filterCategory}
        onFilterChange={handleFilterChange}
        categories={uniqueCategories}
      />

      {filteredAndSortedExpenses.length === 0 ? (
        <NoResultsState
          searchQuery={tableState.searchQuery}
          filterCategory={tableState.filterCategory}
        />
      ) : (
        <>
          <div className="table-wrapper">
            <table className="expense-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th className="align-right">Amount</th>
                  <th>Date</th>
                  <th className="actions-column">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedExpenses.map((expense) => (
                  <ExpenseRow
                    key={expense._id}
                    expense={expense}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isDeleting={deletingId === expense._id}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={tableState.currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {editExpense && (
        <EditExpenseModal
          expense={editExpense}
          onClose={handleEditClose}
          onUpdated={handleEditSuccess}
        />
      )}

      <style jsx>{`
        /* ==================== VARIABLES ==================== */
        :root {
          --color-bg-card: #1e293b;
          --color-bg-table: #0f172a;
          --color-bg-row-hover: rgba(56, 189, 248, 0.05);
          --color-border: rgba(255, 255, 255, 0.1);
          --color-text-primary: #f8fafc;
          --color-text-secondary: #cbd5e1;
          --color-text-muted: #94a3b8;
          --color-accent: #38bdf8;
          --color-accent-hover: #0284c7;
          --color-success: #22c55e;
          --color-error: #f87171;
          --color-warning: #facc15;

          --spacing-xs: 0.5rem;
          --spacing-sm: 0.75rem;
          --spacing-md: 1rem;
          --spacing-lg: 1.5rem;
          --spacing-xl: 2rem;

          --radius-md: 0.5rem;
          --radius-lg: 0.75rem;

          --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

          --transition-fast: 0.15s ease;
          --transition-base: 0.3s ease;
        }

        /* ==================== TABLE CARD ==================== */
        .table-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          margin-top: var(--spacing-xl);
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ==================== TABLE HEADER ==================== */
        .table-header {
          margin-bottom: var(--spacing-lg);
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--spacing-md);
          flex-wrap: wrap;
          margin-bottom: var(--spacing-md);
        }

        .table-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-text-primary);
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin: 0;
        }

        .search-box {
          position: relative;
          flex: 1;
          min-width: 200px;
          max-width: 400px;
        }

        .search-icon {
          position: absolute;
          left: var(--spacing-md);
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-muted);
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 0.625rem var(--spacing-md) 0.625rem 2.5rem;
          background: var(--color-bg-table);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          color: var(--color-text-primary);
          font-size: 0.875rem;
          transition: all var(--transition-fast);
          outline: none;
        }

        .search-input:focus {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1);
        }

        .search-input::placeholder {
          color: var(--color-text-muted);
        }

        .stats-bar {
          display: flex;
          gap: var(--spacing-lg);
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-value {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--color-accent);
        }

        /* ==================== TABLE FILTERS ==================== */
        .table-filters {
          display: flex;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .filter-label {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          font-weight: 500;
        }

        .filter-select {
          padding: 0.5rem 2rem 0.5rem var(--spacing-md);
          background: var(--color-bg-table);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          color: var(--color-text-primary);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          outline: none;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
        }

        .filter-select:hover {
          border-color: var(--color-text-muted);
        }

        .filter-select:focus {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1);
        }

        /* ==================== TABLE ==================== */
        .table-wrapper {
          overflow-x: auto;
          margin: 0 calc(-1 * var(--spacing-lg));
          padding: 0 var(--spacing-lg);
        }

        .expense-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          font-size: 0.875rem;
        }

        .expense-table thead {
          background: var(--color-bg-table);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .expense-table th {
          padding: var(--spacing-md);
          text-align: left;
          font-weight: 600;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.75rem;
          border-bottom: 2px solid var(--color-border);
          white-space: nowrap;
        }

        .expense-table th.align-right {
          text-align: right;
        }

        .expense-table th.actions-column {
          text-align: center;
        }

        .expense-table tbody tr {
          transition: background-color var(--transition-fast);
          border-bottom: 1px solid var(--color-border);
        }

        .expense-table tbody tr:hover {
          background: var(--color-bg-row-hover);
        }

        .expense-table tbody tr:last-child {
          border-bottom: none;
        }

        .expense-table td {
          padding: var(--spacing-md);
          color: var(--color-text-primary);
          vertical-align: middle;
        }

        .expense-table td.align-right {
          text-align: right;
        }

        /* ==================== TABLE CELLS ==================== */
        .expense-title {
          font-weight: 500;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .category-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.8125rem;
          font-weight: 500;
          border: 1px solid;
          white-space: nowrap;
        }

        .expense-amount {
          font-weight: 600;
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
        }

        .expense-date {
          color: var(--color-text-secondary);
          font-size: 0.8125rem;
          white-space: nowrap;
        }

        /* ==================== ACTION BUTTONS ==================== */
        .actions-cell {
          display: flex;
          gap: var(--spacing-sm);
          justify-content: center;
          flex-wrap: wrap;
        }

        .action-btn {
          padding: 0.375rem 0.75rem;
          border-radius: var(--radius-md);
          font-size: 0.8125rem;
          font-weight: 500;
          border: 1px solid;
          cursor: pointer;
          transition: all var(--transition-fast);
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .edit-btn {
          background: rgba(56, 189, 248, 0.1);
          border-color: rgba(56, 189, 248, 0.3);
          color: var(--color-accent);
        }

        .edit-btn:hover:not(:disabled) {
          background: rgba(56, 189, 248, 0.2);
          border-color: var(--color-accent);
          transform: translateY(-1px);
        }

        .delete-btn {
          background: rgba(248, 113, 113, 0.1);
          border-color: rgba(248, 113, 113, 0.3);
          color: var(--color-error);
        }

        .delete-btn:hover:not(:disabled) {
          background: rgba(248, 113, 113, 0.2);
          border-color: var(--color-error);
          transform: translateY(-1px);
        }

        .spinner-small {
          width: 0.875rem;
          height: 0.875rem;
          border: 2px solid rgba(248, 113, 113, 0.3);
          border-top-color: var(--color-error);
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ==================== PAGINATION ==================== */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: var(--spacing-sm);
          margin-top: var(--spacing-lg);
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--color-border);
        }

        .pagination-btn {
          padding: 0.5rem 0.75rem;
          background: var(--color-bg-table);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          color: var(--color-text-secondary);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          min-width: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pagination-btn:hover:not(:disabled) {
          background: var(--color-bg-row-hover);
          border-color: var(--color-accent);
          color: var(--color-accent);
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-btn.active {
          background: var(--color-accent);
          border-color: var(--color-accent);
          color: var(--color-bg-table);
          font-weight: 600;
        }

        .pagination-info {
          font-size: 0.875rem;
          color: var(--color-text-muted);
          padding: 0 var(--spacing-sm);
        }

        /* ==================== STATES ==================== */
        .state-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-xl);
          text-align: center;
          gap: var(--spacing-md);
        }

        .state-icon {
          font-size: 3rem;
          opacity: 0.5;
        }

        .state-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--color-text-primary);
          margin: 0;
        }

        .state-message {
          font-size: 0.9375rem;
          color: var(--color-text-secondary);
          max-width: 400px;
          margin: 0;
        }

        .state-btn {
          margin-top: var(--spacing-sm);
          padding: 0.625rem 1.25rem;
          background: var(--color-accent);
          color: var(--color-bg-table);
          border: none;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .state-btn:hover {
          background: var(--color-accent-hover);
          transform: translateY(-2px);
        }

        .loading-skeleton {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.05) 25%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.05) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: var(--radius-md);
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .skeleton-row {
          height: 3rem;
          margin-bottom: var(--spacing-sm);
        }

        /* ==================== RESPONSIVE ==================== */
        @media (max-width: 1024px) {
          .table-wrapper {
            margin: 0 calc(-1 * var(--spacing-md));
            padding: 0 var(--spacing-md);
          }
        }

        @media (max-width: 768px) {
          .table-card {
            padding: var(--spacing-md);
            margin-top: var(--spacing-lg);
          }

          .header-top {
            flex-direction: column;
            align-items: stretch;
          }

          .search-box {
            max-width: 100%;
          }

          .stats-bar {
            gap: var(--spacing-md);
          }

          .table-filters {
            flex-direction: column;
            gap: var(--spacing-sm);
          }

          .filter-group {
            width: 100%;
          }

          .filter-select {
            flex: 1;
          }

          .expense-table {
            font-size: 0.8125rem;
          }

          .expense-table th,
          .expense-table td {
            padding: var(--spacing-sm);
          }

          .expense-title {
            max-width: 120px;
          }

          .actions-cell {
            flex-direction: column;
            gap: 0.25rem;
          }

          .action-btn {
            font-size: 0.75rem;
            padding: 0.25rem 0.5rem;
          }

          .pagination {
            flex-wrap: wrap;
          }
        }

        @media (max-width: 640px) {
          .table-title {
            font-size: 1.125rem;
          }

          .stats-bar {
            flex-direction: column;
            gap: var(--spacing-sm);
          }

          .stat-item {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          /* Mobile: Hide some columns */
          .expense-table th:nth-child(4),
          .expense-table td:nth-child(4) {
            display: none;
          }

          .expense-title {
            max-width: 100px;
          }

          .category-badge {
            font-size: 0.75rem;
            padding: 0.1875rem 0.5rem;
          }
        }

        /* ==================== ACCESSIBILITY ==================== */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        @media (prefers-contrast: high) {
          .expense-table th,
          .expense-table td {
            border-width: 2px;
          }
        }

        /* Custom scrollbar */
        .table-wrapper::-webkit-scrollbar {
          height: 8px;
        }

        .table-wrapper::-webkit-scrollbar-track {
          background: var(--color-bg-table);
        }

        .table-wrapper::-webkit-scrollbar-thumb {
          background: var(--color-border);
          border-radius: 4px;
        }

        .table-wrapper::-webkit-scrollbar-thumb:hover {
          background: var(--color-text-muted);
        }
      `}</style>
    </div>
  );
};

// ==================== SUB-COMPONENTS ====================

const TableHeader = ({ searchQuery, onSearchChange, stats }) => (
  <div className="table-header">
    <div className="header-top">
      <h3 className="table-title">
        <span>🧾</span>
        Recent Expenses
      </h3>
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search by title or category..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search expenses"
        />
      </div>
    </div>
    <div className="stats-bar">
      <div className="stat-item">
        <span className="stat-label">Total</span>
        <span className="stat-value">
          ₹{stats.total.toLocaleString("en-IN")}
        </span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Count</span>
        <span className="stat-value">{stats.count}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Average</span>
        <span className="stat-value">
          ₹{Math.round(stats.avg).toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  </div>
);

const TableFilters = ({
  sortBy,
  onSortChange,
  filterCategory,
  onFilterChange,
  categories,
}) => (
  <div className="table-filters">
    <div className="filter-group">
      <span className="filter-label">Sort by:</span>
      <select
        className="filter-select"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        aria-label="Sort expenses"
      >
        <option value={SORT_OPTIONS.DATE_DESC}>Date (Newest)</option>
        <option value={SORT_OPTIONS.DATE_ASC}>Date (Oldest)</option>
        <option value={SORT_OPTIONS.AMOUNT_DESC}>Amount (High to Low)</option>
        <option value={SORT_OPTIONS.AMOUNT_ASC}>Amount (Low to High)</option>
        <option value={SORT_OPTIONS.TITLE_ASC}>Title (A to Z)</option>
        <option value={SORT_OPTIONS.TITLE_DESC}>Title (Z to A)</option>
      </select>
    </div>

    <div className="filter-group">
      <span className="filter-label">Category:</span>
      <select
        className="filter-select"
        value={filterCategory}
        onChange={(e) => onFilterChange(e.target.value)}
        aria-label="Filter by category"
      >
        <option value="all">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {CATEGORY_ICONS[cat] || "📦"} {cat}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const ExpenseRow = ({ expense, onEdit, onDelete, isDeleting }) => {
  const categoryColor = CATEGORY_COLORS[expense.category] || "#64748b";
  const categoryIcon = CATEGORY_ICONS[expense.category] || "📦";

  return (
    <tr>
      <td>
        <div className="expense-title" title={expense.title}>
          {expense.title}
        </div>
      </td>
      <td>
        <span
          className="category-badge"
          style={{
            backgroundColor: `${categoryColor}20`,
            borderColor: `${categoryColor}40`,
            color: categoryColor,
          }}
        >
          <span>{categoryIcon}</span>
          {expense.category}
        </span>
      </td>
      <td className="align-right">
        <span className="expense-amount">
          ₹{expense.amount.toLocaleString("en-IN")}
        </span>
      </td>
      <td>
        <span className="expense-date">
          {new Date(expense.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </td>
      <td>
        <div className="actions-cell">
          <button
            className="action-btn edit-btn"
            onClick={() => onEdit(expense)}
            disabled={isDeleting}
            aria-label={`Edit ${expense.title}`}
          >
            ✏️ Edit
          </button>
          <button
            className="action-btn delete-btn"
            onClick={() => onDelete(expense._id, expense.title)}
            disabled={isDeleting}
            aria-label={`Delete ${expense.title}`}
          >
            {isDeleting ? (
              <>
                <span className="spinner-small" />
                Deleting...
              </>
            ) : (
              <>🗑️ Delete</>
            )}
          </button>
        </div>
      </td>
    </tr>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ← Prev
      </button>

      {startPage > 1 && (
        <>
          <button
            className="pagination-btn"
            onClick={() => onPageChange(1)}
            aria-label="Go to page 1"
          >
            1
          </button>
          {startPage > 2 && <span className="pagination-info">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          className={`pagination-btn ${page === currentPage ? "active" : ""}`}
          onClick={() => onPageChange(page)}
          aria-label={`Go to page ${page}`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="pagination-info">...</span>}
          <button
            className="pagination-btn"
            onClick={() => onPageChange(totalPages)}
            aria-label={`Go to page ${totalPages}`}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next →
      </button>
    </div>
  );
};

const LoadingState = () => (
  <div className="table-card">
    <div className="state-container">
      <div className="state-icon">⏳</div>
      <h4 className="state-title">Loading expenses...</h4>
    </div>
    <div className="loading-skeleton skeleton-row"></div>
    <div className="loading-skeleton skeleton-row"></div>
    <div className="loading-skeleton skeleton-row"></div>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="table-card">
    <div className="state-container">
      <div className="state-icon">⚠️</div>
      <h4 className="state-title">Failed to Load</h4>
      <p className="state-message">{message}</p>
      <button className="state-btn" onClick={onRetry}>
        Try Again
      </button>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="table-card">
    <div className="state-container">
      <div className="state-icon">📭</div>
      <h4 className="state-title">No Expenses Yet</h4>
      <p className="state-message">
        Start tracking your expenses by clicking the "Add Expense" button above.
      </p>
    </div>
  </div>
);

const NoResultsState = ({ searchQuery, filterCategory }) => (
  <div className="state-container" style={{ paddingTop: "var(--spacing-xl)" }}>
    <div className="state-icon">🔍</div>
    <h4 className="state-title">No Results Found</h4>
    <p className="state-message">
      {searchQuery
        ? `No expenses match "${searchQuery}"`
        : `No expenses in ${filterCategory} category`}
    </p>
  </div>
);

export default ExpenseTable;