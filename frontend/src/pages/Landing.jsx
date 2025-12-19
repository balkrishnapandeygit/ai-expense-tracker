import { Link } from "react-router-dom";
import logo from "../assest/logo.png";

const Landing = () => {
  return (
    <div className="landing">
      <Header />
      <Hero />
      <Footer />
    </div>
  );
};

// ==================== HEADER COMPONENT ====================
// ==================== HEADER COMPONENT ====================
const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        {/* Brand */}
        <div className="brand">
          <img src={logo} alt="AI Expense Tracker Logo" loading="eager" />
          <h2>AI Expense Tracker</h2>
        </div>

        {/* Navigation */}
        <nav className="nav">
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#about" className="nav-link">About</a>
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          <Link to="/login" className="nav-login">Login</Link>
          <Link to="/register" className="nav-cta">Get Started</Link>
        </div>
      </div>
    </header>
  );
};


// ==================== HERO COMPONENT ====================
const Hero = () => {
  const features = [
    {
      icon: "📊",
      title: "Smart Analytics",
      description: "Beautiful charts and insights to understand spending.",
    },
    {
      icon: "💰",
      title: "Category Tracking",
      description: "Track expenses by category automatically.",
    },
    {
      icon: "📅",
      title: "Monthly Reports",
      description: "Auto-generated reports to review finances.",
    },
    {
      icon: "🤖",
      title: "AI Insights",
      description: "Smart suggestions to reduce unnecessary expenses.",
    },
  ];

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Manage Your Money Smarter with AI</h1>
          <p className="hero-description">
            Track expenses, analyze spending habits, and receive AI-powered
            insights to save more and spend smarter every month.
          </p>

          <div className="features-grid">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>

          <div className="cta-buttons">
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==================== FEATURE CARD COMPONENT ====================
const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="feature-card">
      <span className="feature-icon" role="img" aria-label={title}>
        {icon}
      </span>
      <h4 className="feature-title">{title}</h4>
      <p className="feature-description">{description}</p>
    </div>
  );
};

// ==================== FOOTER COMPONENT ====================
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    about: {
      title: "AI Expense Tracker",
      description:
        "A modern AI-powered expense tracking platform built to help users take full control of their personal finances.",
    },
    contact: {
      title: "Contact",
      items: [
        { icon: "📧", text: "balkrishnapandey2005@gmail.com" },
        { icon: "📞", text: "+91 9021181633" },
      ],
    },
    social: {
      title: "Connect",
      links: [
        {
          icon: "🔗",
          text: "LinkedIn Profile",
          url: "https://www.linkedin.com/in/balkrishan-pandey-649aa9325",
        },
      ],
    },
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* About Section */}
          <div className="footer-section footer-about">
            <h3 className="footer-heading">{footerSections.about.title}</h3>
            <p className="footer-text">{footerSections.about.description}</p>
          </div>

          {/* Contact Section */}
          <div className="footer-section">
            <h4 className="footer-heading">{footerSections.contact.title}</h4>
            {footerSections.contact.items.map((item, index) => (
              <p key={index} className="footer-text">
                {item.icon} {item.text}
              </p>
            ))}
          </div>

          {/* Social Section */}
          <div className="footer-section">
            <h4 className="footer-heading">{footerSections.social.title}</h4>
            {footerSections.social.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.text}
              >
                {link.icon} {link.text}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} AI Expense Tracker · Built by Balkrishna Pandey
          </p>
        </div>
      </div>

      <style jsx>{`
        /* ==================== GLOBAL RESET ==================== */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* ==================== ROOT VARIABLES ==================== */
        :root {
          --color-bg-primary: #020617;
          --color-bg-secondary: #0f172a;
          --color-bg-card: rgba(255, 255, 255, 0.06);
          --color-bg-card-hover: rgba(255, 255, 255, 0.08);
          --color-border: rgba(255, 255, 255, 0.12);
          --color-text-primary: #ffffff;
          --color-text-secondary: rgba(255, 255, 255, 0.85);
          --color-text-muted: rgba(255, 255, 255, 0.75);
          --color-accent: #38bdf8;
          --color-accent-dark: #0284c7;
          
          --spacing-xs: 0.5rem;
          --spacing-sm: 1rem;
          --spacing-md: 1.5rem;
          --spacing-lg: 2rem;
          --spacing-xl: 3rem;
          --spacing-2xl: 4rem;
          
          --radius-sm: 0.5rem;
          --radius-md: 0.625rem;
          --radius-lg: 1rem;
          
          --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          --shadow-accent: 0 12px 35px rgba(56, 189, 248, 0.35);
          
          --transition-fast: 0.15s ease;
          --transition-base: 0.3s ease;
          --transition-slow: 0.5s ease;
          
          --container-max-width: 1280px;
          --container-padding: 1.25rem;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* ==================== LANDING CONTAINER ==================== */
        .landing {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: radial-gradient(
            ellipse at top,
            var(--color-bg-secondary) 0%,
            var(--color-bg-primary) 100%
          );
          color: var(--color-text-primary);
        }

        /* ==================== HEADER STYLES ==================== */
        .header {
          width: 100%;
          height: 85px;
          padding: var(--spacing-md) 0;
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(2, 6, 23, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--color-border);
        }

        .header-container {
          max-width: var(--container-max-width);
          margin: 0 auto;
          padding: 0 var(--container-padding);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
          /* ==================== HEADER NAVIGATION ==================== */
.nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.nav-link:hover {
  color: var(--color-accent);
}

/* ==================== HEADER ACTIONS ==================== */
.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-login {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.nav-login:hover {
  color: var(--color-text-primary);
}

.nav-cta {
  padding: 0.55rem 1.25rem;
  border-radius: var(--radius-sm);
  background: var(--color-accent);
  color: var(--color-bg-primary);
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-base);
}

.nav-cta:hover {
  background: var(--color-accent-dark);
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(56, 189, 248, 0.4);
}

/* ==================== HEADER RESPONSIVE ==================== */
@media (max-width: 768px) {
  .nav {
    display: none;
  }

  .header-actions {
    gap: 0.75rem;
  }

  .nav-cta {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
}


        .brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: transform var(--transition-base);
        }

        .brand:hover {
          transform: scale(1.02);
        }

        .brand img {
          width: 2.75rem;
          height: 2.75rem;
          object-fit: contain;
        }

        .brand h2 {
          font-size: 1.5rem;
          font-weight: 600;
          letter-spacing: -0.02em;
        }

        /* ==================== HERO STYLES ==================== */
        .hero {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: var(--spacing-2xl) 0;
        }

        .hero-container {
          max-width: var(--container-max-width);
          margin: 0 auto;
          padding: 0 var(--container-padding);
          width: 100%;
        }

        .hero-content {
          max-width: 56rem;
          margin: 0 auto;
          text-align: center;
        }

        .hero-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: var(--spacing-md);
          background: linear-gradient(
            to bottom right,
            var(--color-text-primary),
            var(--color-text-secondary)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: clamp(1rem, 2vw, 1.15rem);
          line-height: 1.6;
          color: var(--color-text-secondary);
          margin-bottom: var(--spacing-xl);
          max-width: 42rem;
          margin-left: auto;
          margin-right: auto;
        }

        /* ==================== FEATURES GRID ==================== */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .feature-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          backdrop-filter: blur(12px);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          text-align: left;
          transition: all var(--transition-base);
          cursor: default;
        }

        .feature-card:hover {
          transform: translateY(-0.375rem);
          background: var(--color-bg-card-hover);
          border-color: rgba(56, 189, 248, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .feature-icon {
          font-size: 2rem;
          display: block;
          margin-bottom: var(--spacing-sm);
          line-height: 1;
        }

        .feature-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: var(--spacing-xs);
          letter-spacing: -0.01em;
        }

        .feature-description {
          font-size: 0.9375rem;
          color: var(--color-text-muted);
          line-height: 1.5;
        }

        /* ==================== CTA BUTTONS ==================== */
        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: var(--spacing-md);
          flex-wrap: wrap;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.875rem 2.25rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 1rem;
          text-decoration: none;
          transition: all var(--transition-base);
          cursor: pointer;
          white-space: nowrap;
          border: none;
          outline: none;
        }

        .btn-primary {
          background: var(--color-accent);
          color: var(--color-bg-primary);
          box-shadow: var(--shadow-accent);
        }

        .btn-primary:hover {
          background: var(--color-accent-dark);
          transform: translateY(-0.1875rem);
          box-shadow: 0 16px 45px rgba(56, 189, 248, 0.45);
        }

        .btn-primary:active {
          transform: translateY(-0.0625rem);
        }

        .btn-secondary {
          background: transparent;
          color: var(--color-accent);
          border: 1px solid var(--color-accent);
        }

        .btn-secondary:hover {
          background: rgba(56, 189, 248, 0.1);
          transform: translateY(-0.1875rem);
          border-color: var(--color-accent-dark);
        }

        .btn-secondary:active {
          transform: translateY(-0.0625rem);
        }

        /* ==================== FOOTER STYLES ==================== */
        .footer {
          width: 100%;
          border-top: 1px solid var(--color-border);
          background: rgba(2, 6, 23, 0.95);
          backdrop-filter: blur(12px);
        }

        .footer-container {
          max-width: var(--container-max-width);
          margin: 0 auto;
          padding: var(--spacing-xl) var(--container-padding) var(--spacing-md);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: var(--spacing-xl);
          margin-bottom: var(--spacing-lg);
        }

        .footer-section {
          display: flex;
          flex-direction: column;
        }

        .footer-heading {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: var(--spacing-sm);
          letter-spacing: -0.01em;
        }

        .footer-about .footer-heading {
          font-size: 1.25rem;
        }

        .footer-text {
          font-size: 0.9375rem;
          color: var(--color-text-muted);
          line-height: 1.6;
          margin-bottom: var(--spacing-xs);
        }

        .footer-link {
          font-size: 0.9375rem;
          color: var(--color-text-muted);
          text-decoration: none;
          transition: all var(--transition-fast);
          margin-bottom: var(--spacing-xs);
          display: inline-block;
        }

        .footer-link:hover {
          color: var(--color-accent);
          transform: translateX(0.25rem);
        }

        .footer-bottom {
          padding-top: var(--spacing-md);
          border-top: 1px solid var(--color-border);
        }

        .footer-copyright {
          text-align: center;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
        }

        /* ==================== RESPONSIVE BREAKPOINTS ==================== */
        
        /* Large Tablets and Small Desktops */
        @media (max-width: 1024px) {
          :root {
            --container-padding: 2rem;
          }

          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Tablets */
        @media (max-width: 768px) {
          :root {
            --container-padding: 1.5rem;
            --spacing-xl: 2.5rem;
            --spacing-2xl: 3rem;
          }

          .header {
            padding: var(--spacing-sm) 0;
          }

          .brand img {
            width: 2.5rem;
            height: 2.5rem;
          }

          .brand h2 {
            font-size: 1.25rem;
          }

          .hero {
            padding: var(--spacing-xl) 0;
          }

          .features-grid {
            gap: var(--spacing-sm);
          }

          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: var(--spacing-lg);
          }

          .footer-about {
            grid-column: 1 / -1;
          }
        }

        /* Mobile Devices */
        @media (max-width: 640px) {
          :root {
            --container-padding: 1.25rem;
            --spacing-lg: 1.5rem;
            --spacing-xl: 2rem;
            --spacing-2xl: 2.5rem;
          }

          .header-container {
            padding: 0 var(--container-padding);
          }

          .brand img {
            width: 2.25rem;
            height: 2.25rem;
          }

          .brand h2 {
            font-size: 1.125rem;
          }

          .hero-title {
            font-size: clamp(1.75rem, 8vw, 2.5rem);
            margin-bottom: var(--spacing-sm);
          }

          .hero-description {
            font-size: 1rem;
            margin-bottom: var(--spacing-lg);
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-sm);
          }

          .feature-card {
            padding: var(--spacing-md);
          }

          .feature-icon {
            font-size: 1.75rem;
          }

          .feature-title {
            font-size: 1rem;
          }

          .feature-description {
            font-size: 0.875rem;
          }

          .cta-buttons {
            flex-direction: column;
            gap: var(--spacing-sm);
            width: 100%;
          }

          .btn {
            width: 100%;
            padding: 1rem 2rem;
          }

          .footer-container {
            padding: var(--spacing-lg) var(--container-padding) var(--spacing-sm);
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-lg);
            text-align: center;
          }

          .footer-about {
            grid-column: 1;
          }

          .footer-section {
            align-items: center;
          }

          .footer-link:hover {
            transform: translateX(0);
          }
        }

        /* Small Mobile Devices */
        @media (max-width: 375px) {
          :root {
            --container-padding: 1rem;
          }

          .brand h2 {
            font-size: 1rem;
          }

          .hero-title {
            font-size: 1.5rem;
          }

          .btn {
            padding: 0.875rem 1.5rem;
            font-size: 0.9375rem;
          }
        }

        /* Print Styles */
        @media print {
          .header,
          .cta-buttons,
          .footer-bottom {
            display: none;
          }

          .landing {
            background: white;
            color: black;
          }

          .feature-card {
            break-inside: avoid;
          }
        }

        /* Reduced Motion Support */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* High Contrast Mode Support */
        @media (prefers-contrast: high) {
          .feature-card {
            border-width: 2px;
          }

          .btn {
            border-width: 2px;
          }
        }
      `}</style>
    </footer>
  );
};

export default Landing;