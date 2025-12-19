import { useState, useCallback, useRef, useEffect } from "react";
import API from "../API/Axios";

// ==================== CONSTANTS ====================
const EXPENSE_CATEGORIES = [
  { value: "Food", label: "🍔 Food", color: "#22c55e" },
  { value: "Travel", label: "✈️ Travel", color: "#38bdf8" },
  { value: "Shopping", label: "🛍️ Shopping", color: "#facc15" },
  { value: "Rent", label: "🏠 Rent", color: "#f87171" },
  { value: "Entertainment", label: "🎬 Entertainment", color: "#a78bfa" },
  { value: "Healthcare", label: "⚕️ Healthcare", color: "#ec4899" },
  { value: "Education", label: "📚 Education", color: "#8b5cf6" },
  { value: "Utilities", label: "💡 Utilities", color: "#f59e0b" },
  { value: "Other", label: "📦 Other", color: "#64748b" },
];

const VALIDATION_RULES = {
  title: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s\-\_\.\,]+$/,
  },
  amount: {
    min: 1,
    max: 1000000,
  },
};

// ==================== MAIN COMPONENT ====================
const AddExpenseModal = ({ onClose, onAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0], // Default to today
  });

  const [formState, setFormState] = useState({
    isSubmitting: false,
    errors: {},
    touched: {},
  });

  const modalRef = useRef(null);
  const titleInputRef = useRef(null);

  // ==================== EFFECTS ====================
  useEffect(() => {
    // Focus title input on mount
    titleInputRef.current?.focus();

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // ==================== VALIDATION ====================
  const validateField = useCallback((name, value) => {
    switch (name) {
      case "title":
        if (!value.trim()) return "Title is required";
        if (value.length < VALIDATION_RULES.title.minLength) {
          return `Title must be at least ${VALIDATION_RULES.title.minLength} characters`;
        }
        if (value.length > VALIDATION_RULES.title.maxLength) {
          return `Title must be less than ${VALIDATION_RULES.title.maxLength} characters`;
        }
        if (!VALIDATION_RULES.title.pattern.test(value)) {
          return "Title contains invalid characters";
        }
        return "";

      case "amount":
        const numAmount = Number(value);
        if (!value) return "Amount is required";
        if (isNaN(numAmount)) return "Amount must be a number";
        if (numAmount < VALIDATION_RULES.amount.min) {
          return `Amount must be at least ₹${VALIDATION_RULES.amount.min}`;
        }
        if (numAmount > VALIDATION_RULES.amount.max) {
          return `Amount must be less than ₹${VALIDATION_RULES.amount.max.toLocaleString()}`;
        }
        return "";

      case "date":
        if (!value) return "Date is required";
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today
        if (selectedDate > today) {
          return "Date cannot be in the future";
        }
        return "";

      default:
        return "";
    }
  }, []);

  const validateForm = useCallback(() => {
    const errors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) errors[key] = error;
    });
    return errors;
  }, [formData, validateField]);

  // ==================== HANDLERS ====================
  const handleInputChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (formState.errors[name]) {
      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [name]: "" },
      }));
    }
  }, [formState.errors]);

  const handleBlur = useCallback((name) => {
    setFormState((prev) => ({
      ...prev,
      touched: { ...prev.touched, [name]: true },
    }));

    const error = validateField(name, formData[name]);
    if (error) {
      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [name]: error },
      }));
    }
  }, [formData, validateField]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setFormState((prev) => ({ ...prev, touched: allTouched }));

    // Validate all fields
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormState((prev) => ({ ...prev, errors }));
      return;
    }

    setFormState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      await API.post("/expenses", {
        title: formData.title.trim(),
        amount: Number(formData.amount),
        category: formData.category,
        date: formData.date,
      });

      // Success - reset form and close
      onAdded();
      onClose();
    } catch (err) {
      console.error("Add expense failed", err.response?.data || err);
      
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to add expense. Please try again.";

      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        errors: { submit: errorMessage },
      }));
    }
  };

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") {
      onClose();
    }
  }, [onClose]);

  // ==================== COMPUTED VALUES ====================
  const isFormValid = Object.keys(validateForm()).length === 0;
  const selectedCategory = EXPENSE_CATEGORIES.find(
    (cat) => cat.value === formData.category
  );

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal" ref={modalRef}>
        <div className="modal-header">
          <h3 id="modal-title">Add New Expense</h3>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Title Field */}
          <div className="form-group">
            <label htmlFor="expense-title">
              Title <span className="required">*</span>
            </label>
            <input
              id="expense-title"
              ref={titleInputRef}
              type="text"
              placeholder="e.g., Grocery Shopping"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              onBlur={() => handleBlur("title")}
              className={
                formState.touched.title && formState.errors.title ? "error" : ""
              }
              disabled={formState.isSubmitting}
              maxLength={VALIDATION_RULES.title.maxLength}
              aria-invalid={!!(formState.touched.title && formState.errors.title)}
              aria-describedby={
                formState.errors.title ? "title-error" : undefined
              }
            />
            {formState.touched.title && formState.errors.title && (
              <span className="error-message" id="title-error" role="alert">
                {formState.errors.title}
              </span>
            )}
            <span className="char-count">
              {formData.title.length}/{VALIDATION_RULES.title.maxLength}
            </span>
          </div>

          {/* Amount Field */}
          <div className="form-group">
            <label htmlFor="expense-amount">
              Amount (₹) <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <span className="input-prefix">₹</span>
              <input
                id="expense-amount"
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                onBlur={() => handleBlur("amount")}
                className={
                  formState.touched.amount && formState.errors.amount
                    ? "error with-prefix"
                    : "with-prefix"
                }
                disabled={formState.isSubmitting}
                min={VALIDATION_RULES.amount.min}
                max={VALIDATION_RULES.amount.max}
                step="0.01"
                aria-invalid={
                  !!(formState.touched.amount && formState.errors.amount)
                }
                aria-describedby={
                  formState.errors.amount ? "amount-error" : undefined
                }
              />
            </div>
            {formState.touched.amount && formState.errors.amount && (
              <span className="error-message" id="amount-error" role="alert">
                {formState.errors.amount}
              </span>
            )}
          </div>

          {/* Category Field */}
          <div className="form-group">
            <label htmlFor="expense-category">
              Category <span className="required">*</span>
            </label>
            <div className="select-wrapper">
              <select
                id="expense-category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                disabled={formState.isSubmitting}
                style={{ borderLeftColor: selectedCategory?.color }}
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Field */}
          <div className="form-group">
            <label htmlFor="expense-date">
              Date <span className="required">*</span>
            </label>
            <input
              id="expense-date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              onBlur={() => handleBlur("date")}
              className={
                formState.touched.date && formState.errors.date ? "error" : ""
              }
              disabled={formState.isSubmitting}
              max={new Date().toISOString().split("T")[0]}
              aria-invalid={!!(formState.touched.date && formState.errors.date)}
              aria-describedby={
                formState.errors.date ? "date-error" : undefined
              }
            />
            {formState.touched.date && formState.errors.date && (
              <span className="error-message" id="date-error" role="alert">
                {formState.errors.date}
              </span>
            )}
          </div>

          {/* Submit Error */}
          {formState.errors.submit && (
            <div className="submit-error" role="alert">
              <span>⚠️</span>
              {formState.errors.submit}
            </div>
          )}

          {/* Action Buttons */}
          <div className="modal-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={formState.isSubmitting || !isFormValid}
            >
              {formState.isSubmitting ? (
                <>
                  <span className="spinner" />
                  Adding...
                </>
              ) : (
                <>
                  <span>💾</span>
                  Add Expense
                </>
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={formState.isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        /* ==================== VARIABLES ==================== */
        :root {
          --color-bg-overlay: rgba(0, 0, 0, 0.75);
          --color-bg-modal: #1e293b;
          --color-bg-input: #0f172a;
          --color-border: rgba(255, 255, 255, 0.1);
          --color-border-focus: #38bdf8;
          --color-text-primary: #f8fafc;
          --color-text-secondary: #cbd5e1;
          --color-text-muted: #94a3b8;
          --color-error: #f87171;
          --color-error-bg: rgba(248, 113, 113, 0.1);
          --color-success: #22c55e;
          --color-accent: #38bdf8;
          --color-accent-hover: #0284c7;

          --spacing-xs: 0.5rem;
          --spacing-sm: 0.75rem;
          --spacing-md: 1rem;
          --spacing-lg: 1.5rem;
          --spacing-xl: 2rem;

          --radius-sm: 0.375rem;
          --radius-md: 0.5rem;
          --radius-lg: 0.75rem;

          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
          --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.4);

          --transition-fast: 0.15s ease;
          --transition-base: 0.3s ease;
        }

        /* ==================== MODAL OVERLAY ==================== */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: var(--color-bg-overlay);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: var(--spacing-md);
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* ==================== MODAL CONTAINER ==================== */
        .modal {
          background: var(--color-bg-modal);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xl);
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
          border: 1px solid var(--color-border);
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* ==================== MODAL HEADER ==================== */
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-lg);
          border-bottom: 1px solid var(--color-border);
          position: sticky;
          top: 0;
          background: var(--color-bg-modal);
          z-index: 10;
        }

        .modal-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-text-primary);
          margin: 0;
          letter-spacing: -0.01em;
        }

        .close-btn {
          width: 2rem;
          height: 2rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background: transparent;
          color: var(--color-text-secondary);
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
          line-height: 1;
        }

        .close-btn:hover {
          background: var(--color-error-bg);
          border-color: var(--color-error);
          color: var(--color-error);
          transform: rotate(90deg);
        }

        /* ==================== FORM ==================== */
        form {
          padding: var(--spacing-lg);
        }

        .form-group {
          margin-bottom: var(--spacing-lg);
          position: relative;
        }

        label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          margin-bottom: var(--spacing-xs);
          letter-spacing: 0.01em;
        }

        .required {
          color: var(--color-error);
        }

        /* ==================== INPUT STYLES ==================== */
        input,
        select {
          width: 100%;
          padding: 0.75rem 1rem;
          background: var(--color-bg-input);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          color: var(--color-text-primary);
          font-size: 0.9375rem;
          transition: all var(--transition-fast);
          outline: none;
        }

        input:focus,
        select:focus {
          border-color: var(--color-border-focus);
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1);
        }

        input:disabled,
        select:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        input.error,
        select.error {
          border-color: var(--color-error);
        }

        input.error:focus,
        select.error:focus {
          box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.1);
        }

        input::placeholder {
          color: var(--color-text-muted);
        }

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          opacity: 1;
        }

        /* Input with prefix */
        .input-wrapper {
          position: relative;
        }

        .input-prefix {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-muted);
          font-weight: 600;
          pointer-events: none;
        }

        input.with-prefix {
          padding-left: 2.5rem;
        }

        /* Select styling */
        .select-wrapper {
          position: relative;
        }

        select {
          appearance: none;
          cursor: pointer;
          padding-right: 2.5rem;
          border-left-width: 3px;
          border-left-style: solid;
        }

        .select-wrapper::after {
          content: "▼";
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-muted);
          font-size: 0.75rem;
          pointer-events: none;
        }

        /* Date input styling */
        input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          filter: invert(0.7);
        }

        /* ==================== ERROR MESSAGES ==================== */
        .error-message {
          display: block;
          color: var(--color-error);
          font-size: 0.8125rem;
          margin-top: var(--spacing-xs);
          animation: shake 0.3s ease;
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .char-count {
          position: absolute;
          right: 0;
          top: 0;
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }

        .submit-error {
          padding: var(--spacing-md);
          background: var(--color-error-bg);
          border: 1px solid var(--color-error);
          border-radius: var(--radius-md);
          color: var(--color-error);
          font-size: 0.875rem;
          margin-bottom: var(--spacing-lg);
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* ==================== BUTTONS ==================== */
        .modal-actions {
          display: flex;
          gap: var(--spacing-md);
          margin-top: var(--spacing-xl);
        }

        .btn {
          flex: 1;
          padding: 0.875rem 1.5rem;
          border-radius: var(--radius-md);
          font-size: 0.9375rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all var(--transition-base);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-xs);
          outline: none;
        }

        .btn:focus-visible {
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.3);
        }

        .btn-primary {
          background: var(--color-accent);
          color: #0f172a;
          box-shadow: 0 4px 14px rgba(56, 189, 248, 0.3);
        }

        .btn-primary:hover:not(:disabled) {
          background: var(--color-accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(56, 189, 248, 0.4);
        }

        .btn-primary:active:not(:disabled) {
          transform: translateY(0);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .btn-secondary {
          background: transparent;
          color: var(--color-text-secondary);
          border: 1px solid var(--color-border);
        }

        .btn-secondary:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--color-text-secondary);
        }

        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Loading spinner */
        .spinner {
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(15, 23, 42, 0.3);
          border-top-color: #0f172a;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ==================== RESPONSIVE ==================== */
        @media (max-width: 640px) {
          .modal-overlay {
            padding: 0;
            align-items: flex-end;
          }

          .modal {
            max-width: 100%;
            max-height: 95vh;
            border-radius: var(--radius-lg) var(--radius-lg) 0 0;
            animation: slideUpMobile 0.3s ease;
          }

          @keyframes slideUpMobile {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }

          .modal-header {
            padding: var(--spacing-md);
          }

          .modal-header h3 {
            font-size: 1.125rem;
          }

          form {
            padding: var(--spacing-md);
          }

          .form-group {
            margin-bottom: var(--spacing-md);
          }

          .modal-actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
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
          input,
          select {
            border-width: 2px;
          }

          .btn {
            border-width: 2px;
          }
        }

        /* Custom scrollbar for modal */
        .modal::-webkit-scrollbar {
          width: 8px;
        }

        .modal::-webkit-scrollbar-track {
          background: var(--color-bg-input);
        }

        .modal::-webkit-scrollbar-thumb {
          background: var(--color-border);
          border-radius: 4px;
        }

        .modal::-webkit-scrollbar-thumb:hover {
          background: var(--color-text-muted);
        }
      `}</style>
    </div>
  );
};

export default AddExpenseModal;