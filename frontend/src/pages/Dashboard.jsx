import { useEffect, useState, useCallback, useMemo } from "react";
import API from "../API/Axios";
import ExpenseTable from "../components/ExpenseTable";
import AddExpenseModal from "../components/AddExpenseModal";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#38bdf8", "#22c55e", "#facc15", "#f87171", "#a78bfa"];

const Dashboard = () => {
  const [dashboardState, setDashboardState] = useState({
    total: 0,
    categoryData: [],
    monthlyData: [],
    aiInsight: "Analyzing your expenses...",
    isLoading: true,
    error: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // ==================== DATA FETCHING ====================
  const fetchDashboardData = useCallback(async () => {
    try {
      setDashboardState((prev) => ({ ...prev, isLoading: true, error: null }));

      const [totalRes, categoryRes, monthlyRes, aiRes] = await Promise.all([
        API.get("/analytics/total"),
        API.get("/analytics/category"),
        API.get("/analytics/monthly"),
        API.get("/ai/insight"),
      ]);

      setDashboardState({
        total: totalRes.data.total || 0,
        categoryData: categoryRes.data || [],
        monthlyData: monthlyRes.data || [],
        aiInsight: aiRes.data.insight || "No insights yet",
        isLoading: false,
        error: null,
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setDashboardState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to load dashboard data. Please try again.",
      }));
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [refreshKey, fetchDashboardData]);

  // ==================== HANDLERS ====================
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }, []);

  const handleAddExpense = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleExpenseAdded = useCallback(() => {
    setShowModal(false);
    setRefreshKey((prev) => prev + 1);
  }, []);

  const handleDataChange = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  // ==================== COMPUTED VALUES ====================
  const topCategory = useMemo(() => {
    return dashboardState.categoryData[0]?._id || "N/A";
  }, [dashboardState.categoryData]);

  const totalCategories = useMemo(() => {
    return dashboardState.categoryData.length;
  }, [dashboardState.categoryData]);

  const formattedTotal = useMemo(() => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(dashboardState.total);
  }, [dashboardState.total]);

  return (
    <div className="dashboard">
      <DashboardHeader onLogout={handleLogout} />

      {dashboardState.error && (
        <ErrorBanner message={dashboardState.error} onRetry={fetchDashboardData} />
      )}

      <StatsGrid
        total={formattedTotal}
        topCategory={topCategory}
        totalCategories={totalCategories}
        aiInsight={dashboardState.aiInsight}
        isLoading={dashboardState.isLoading}
      />

      <AddExpenseButton onClick={handleAddExpense} />

      <ChartsSection
        categoryData={dashboardState.categoryData}
        monthlyData={dashboardState.monthlyData}
        isLoading={dashboardState.isLoading}
      />

      <ExpenseTable refreshKey={refreshKey} onChange={handleDataChange} />

      {showModal && (
        <AddExpenseModal onClose={handleModalClose} onAdded={handleExpenseAdded} />
      )}

      <style jsx>{`
        /* ==================== ROOT VARIABLES ==================== */
        :root {
          --color-bg-primary: #0f172a;
          --color-bg-secondary: #1e293b;
          --color-bg-card: #1e293b;
          --color-bg-card-hover: #334155;
          --color-border: rgba(255, 255, 255, 0.1);
          --color-text-primary: #f8fafc;
          --color-text-secondary: #cbd5e1;
          --color-text-muted: #94a3b8;
          --color-accent: #38bdf8;
          --color-accent-hover: #0284c7;
          --color-success: #22c55e;
          --color-warning: #facc15;
          --color-error: #f87171;
          --color-purple: #a78bfa;

          --spacing-xs: 0.5rem;
          --spacing-sm: 0.75rem;
          --spacing-md: 1rem;
          --spacing-lg: 1.5rem;
          --spacing-xl: 2rem;
          --spacing-2xl: 3rem;

          --radius-sm: 0.5rem;
          --radius-md: 0.75rem;
          --radius-lg: 1rem;

          --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

          --transition-fast: 0.15s ease;
          --transition-base: 0.3s ease;

          --container-max-width: 1400px;
          --container-padding: 1.5rem;
        }

        /* ==================== DASHBOARD CONTAINER ==================== */
        .dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--color-bg-primary) 0%, #0a0f1f 100%);
          color: var(--color-text-primary);
          padding: var(--spacing-xl) var(--container-padding);
          max-width: var(--container-max-width);
          margin: 0 auto;
        }

        /* ==================== HEADER ==================== */
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-xl);
          flex-wrap: wrap;
          gap: var(--spacing-md);
        }

        .dashboard-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          background: linear-gradient(
            135deg,
            var(--color-accent) 0%,
            var(--color-purple) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .logout-btn {
          padding: 0.75rem 1.5rem;
          background: rgba(248, 113, 113, 0.1);
          border: 1px solid rgba(248, 113, 113, 0.3);
          color: var(--color-error);
          border-radius: var(--radius-md);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-base);
          font-size: 0.9375rem;
        }

        .logout-btn:hover {
          background: rgba(248, 113, 113, 0.2);
          border-color: var(--color-error);
          transform: translateY(-2px);
        }

        .logout-btn:active {
          transform: translateY(0);
        }

        /* ==================== ERROR BANNER ==================== */
        .error-banner {
          background: rgba(248, 113, 113, 0.1);
          border: 1px solid var(--color-error);
          border-radius: var(--radius-md);
          padding: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--spacing-md);
        }

        .error-message {
          color: var(--color-error);
          font-size: 0.9375rem;
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .retry-btn {
          padding: 0.5rem 1rem;
          background: var(--color-error);
          color: white;
          border: none;
          border-radius: var(--radius-sm);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          font-size: 0.875rem;
        }

        .retry-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        /* ==================== STATS GRID ==================== */
        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        .card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          transition: all var(--transition-base);
          position: relative;
          overflow: hidden;
        }

        .card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
          opacity: 0;
          transition: opacity var(--transition-base);
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
          border-color: rgba(56, 189, 248, 0.3);
        }

        .card:hover::before {
          opacity: 1;
        }

        .card.highlight {
          background: linear-gradient(
            135deg,
            rgba(56, 189, 248, 0.1) 0%,
            rgba(56, 189, 248, 0.05) 100%
          );
          border-color: var(--color-accent);
        }

        .card.highlight::before {
          background: var(--color-accent);
          opacity: 1;
        }

        .card.ai {
          background: linear-gradient(
            135deg,
            rgba(167, 139, 250, 0.1) 0%,
            rgba(167, 139, 250, 0.05) 100%
          );
          border-color: var(--color-purple);
        }

        .card.ai::before {
          background: var(--color-purple);
          opacity: 1;
        }

        .card h3 {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          margin-bottom: var(--spacing-sm);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .card p {
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 700;
          color: var(--color-text-primary);
          word-break: break-word;
          line-height: 1.2;
        }

        .card.ai p {
          font-size: 0.9375rem;
          font-weight: 400;
          line-height: 1.6;
          color: var(--color-text-secondary);
        }

        .skeleton {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.05) 25%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.05) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: var(--radius-sm);
          height: 2rem;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        /* ==================== ADD EXPENSE BUTTON ==================== */
        .add-btn {
          width: 100%;
          padding: 1rem;
          background: var(--color-accent);
          color: var(--color-bg-primary);
          border: none;
          border-radius: var(--radius-md);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-base);
          margin-bottom: var(--spacing-xl);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
          box-shadow: 0 4px 14px rgba(56, 189, 248, 0.3);
        }

        .add-btn:hover {
          background: var(--color-accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(56, 189, 248, 0.4);
        }

        .add-btn:active {
          transform: translateY(0);
        }

        /* ==================== CHARTS SECTION ==================== */
        .charts {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 450px), 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        .chart-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          transition: all var(--transition-base);
        }

        .chart-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
          border-color: rgba(56, 189, 248, 0.3);
        }

        .chart-card h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: var(--spacing-lg);
          color: var(--color-text-primary);
          letter-spacing: -0.01em;
        }

        .chart-placeholder {
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-muted);
          font-size: 0.9375rem;
        }

        .chart-loading {
          height: 300px;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.02) 25%,
            rgba(255, 255, 255, 0.05) 50%,
            rgba(255, 255, 255, 0.02) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: var(--radius-md);
        }

        /* ==================== RESPONSIVE BREAKPOINTS ==================== */

        /* Large Tablets */
        @media (max-width: 1024px) {
          :root {
            --container-padding: 1.25rem;
            --spacing-xl: 1.75rem;
          }

          .charts {
            grid-template-columns: 1fr;
          }
        }

        /* Tablets */
        @media (max-width: 768px) {
          :root {
            --container-padding: 1rem;
            --spacing-lg: 1.25rem;
            --spacing-xl: 1.5rem;
          }

          .dashboard {
            padding: var(--spacing-lg) var(--container-padding);
          }

          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-md);
          }

          .logout-btn {
            width: 100%;
            justify-content: center;
          }

          .stats {
            grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
            gap: var(--spacing-md);
          }

          .card p {
            font-size: clamp(1.25rem, 5vw, 1.75rem);
          }
        }

        /* Mobile Devices */
        @media (max-width: 640px) {
          :root {
            --container-padding: 1rem;
            --spacing-md: 0.875rem;
            --spacing-lg: 1rem;
            --spacing-xl: 1.25rem;
          }

          .dashboard {
            padding: var(--spacing-md);
          }

          .dashboard-title {
            font-size: 1.5rem;
          }

          .stats {
            grid-template-columns: 1fr;
            gap: var(--spacing-md);
          }

          .card {
            padding: var(--spacing-md);
          }

          .add-btn {
            padding: 0.875rem;
            font-size: 0.9375rem;
          }

          .chart-card {
            padding: var(--spacing-md);
          }

          .chart-card h3 {
            font-size: 1rem;
            margin-bottom: var(--spacing-md);
          }
        }

        /* Small Mobile */
        @media (max-width: 375px) {
          .dashboard-title {
            font-size: 1.375rem;
          }

          .card h3 {
            font-size: 0.8125rem;
          }

          .logout-btn {
            padding: 0.625rem 1.25rem;
            font-size: 0.875rem;
          }
        }

        /* Print Styles */
        @media print {
          .logout-btn,
          .add-btn {
            display: none;
          }

          .dashboard {
            background: white;
            color: black;
          }

          .card {
            break-inside: avoid;
            border: 1px solid #ddd;
          }
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

// ==================== SUB-COMPONENTS ====================

const DashboardHeader = ({ onLogout }) => (
  <div className="dashboard-header">
    <h1 className="dashboard-title">
      <span>📊</span>
      Expense Dashboard
    </h1>
    <button className="logout-btn" onClick={onLogout} aria-label="Logout">
      Logout
    </button>
  </div>
);

const ErrorBanner = ({ message, onRetry }) => (
  <div className="error-banner" role="alert">
    <span className="error-message">
      <span>⚠️</span>
      {message}
    </span>
    <button className="retry-btn" onClick={onRetry}>
      Retry
    </button>
  </div>
);

const StatsGrid = ({ total, topCategory, totalCategories, aiInsight, isLoading }) => (
  <div className="stats">
    <div className="card highlight">
      <h3>Total Spent</h3>
      {isLoading ? <div className="skeleton" /> : <p>{total}</p>}
    </div>

    <div className="card">
      <h3>Top Category</h3>
      {isLoading ? <div className="skeleton" /> : <p>{topCategory}</p>}
    </div>

    <div className="card">
      <h3>Total Categories</h3>
      {isLoading ? <div className="skeleton" /> : <p>{totalCategories}</p>}
    </div>

    <div className="card ai">
      <h3>🤖 AI Insight</h3>
      {isLoading ? (
        <div className="skeleton" />
      ) : (
        <p>{aiInsight}</p>
      )}
    </div>
  </div>
);

const AddExpenseButton = ({ onClick }) => (
  <button className="add-btn" onClick={onClick} aria-label="Add new expense">
    <span>➕</span>
    Add Expense
  </button>
);

const ChartsSection = ({ categoryData, monthlyData, isLoading }) => (
  <div className="charts">
    <div className="chart-card">
      <h3>Category Wise Spending</h3>
      {isLoading ? (
        <div className="chart-loading" />
      ) : categoryData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="total"
              nameKey="_id"
              cx="50%"
              cy="50%"
              outerRadius={110}
              label={({ _id, percent }) =>
                `${_id}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {categoryData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "0.5rem",
                color: "#f8fafc",
              }}
              formatter={(value) =>
                new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(value)
              }
            />
            <Legend
              wrapperStyle={{ color: "#cbd5e1" }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="chart-placeholder">No category data available</div>
      )}
    </div>

    <div className="chart-card">
      <h3>Monthly Spending</h3>
      {isLoading ? (
        <div className="chart-loading" />
      ) : monthlyData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <XAxis
              dataKey="_id"
              stroke="#94a3b8"
              style={{ fontSize: "0.875rem" }}
            />
            <YAxis
              stroke="#94a3b8"
              style={{ fontSize: "0.875rem" }}
              tickFormatter={(value) =>
                new Intl.NumberFormat("en-IN", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(value)
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "0.5rem",
                color: "#f8fafc",
              }}
              formatter={(value) =>
                new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(value)
              }
            />
            <Bar
              dataKey="total"
              fill="#38bdf8"
              radius={[6, 6, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="chart-placeholder">No monthly data available</div>
      )}
    </div>
  </div>
);

export default Dashboard;