import React, { useState } from "react";
import { motion } from "framer-motion";
import "./LandingPage.css";
import Particles from "../components/Particles";
import CountUp from "../components/CountUp";
import { useNavigate } from "react-router-dom";
// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const fadeInUp = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const scaleUp = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const LandingPage = () => {
  const [isCardHovered, setIsCardHovered] = useState(false);


  const navigate = useNavigate();

    const handleGetStarted = () => {
  if (localStorage.getItem("token")) {
    navigate("/feature/academic-org");
  } else {
    navigate("/login", { state: { from: "/feature/academic-org" } });
  }}

  return (
    <>
      <div className="particles-bg">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      <div className="landingpage-container">
        {/* ========== NAVBAR ========== */}
        <motion.nav
          className="landingpage-navbar"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="landingpage-logo">YuktiVerse</div>
          <div className="landingpage-nav-links">
            <a href="#features">Features</a>
            <a href="#dashboard">Dashboard</a>
            <a href="#get-started">Get Started</a>
          </div>
          <div className="landingpage-nav-actions">
            <motion.button
              className="landingpage-btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Summarize PDF
            </motion.button>
            <motion.button
              className="landingpage-btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Upload Resume
            </motion.button>
          </div>
        </motion.nav>

        {/* ========== HERO SECTION ========== */}
        <section className="landingpage-hero">
          <div className="landingpage-hero-content">
            <motion.div
              className="landingpage-hero-text"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.span
                className="landingpage-badge"
                variants={itemVariants}
              >
                AI-powered MERN platform • Demo preview
              </motion.span>
              <motion.h1 variants={itemVariants}>
                Transform Your Career With <br />
                <span className="landingpage-gradient-text">YuktiVerse </span>
              </motion.h1>
              <motion.p variants={itemVariants}>
                Get instant, actionable resume insights, AI summaries for PDFs,
                job prep tools, and a personalized smart dashboard — all in a
                sleek professional experience.
              </motion.p>
              <div className="landingpage-hero-buttons">
                <motion.button
                  className="landingpage-btn-primary"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGetStarted}
                >
                  Get Started
                </motion.button>
                <motion.button
                  className="landingpage-btn-outline"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Dashboard
                </motion.button>
              </div>
              <motion.div
                className="landingpage-hero-checks"
                variants={itemVariants}
              >
                <span>✔ Fast, private demo preview</span>
                <span>★ Professional & ATS-friendly</span>
              </motion.div>
            </motion.div>

            <motion.div
              className={`landingpage-hero-card ${
                isCardHovered ? "hovered" : ""
              }`}
              onMouseEnter={() => setIsCardHovered(true)}
              onMouseLeave={() => setIsCardHovered(false)}
              initial={{ rotate: -5, y: 50, opacity: 0 }}
              animate={{ rotate: -5, y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              whileHover={{ rotate: 0 }}
            >
              <div className="landingpage-card-header">
                <h4>Resume Analysis • Demo</h4>
                <small>Instant AI insights</small>
              </div>
              <div className="landingpage-card-metrics">
                <motion.div
                  className="landingpage-metric"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="landingpage-circle">
                    <CountUp
                      from={0}
                      to={7.2}
                      separator=","
                      direction="up"
                      duration={1}
                      className="count-up-text"
                    />
                  </div>
                  <p>Clarity</p>
                </motion.div>
                <motion.div
                  className="landingpage-metric"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="landingpage-circle">
                    <CountUp
                      from={0}
                      to={8.4}
                      separator=","
                      direction="up"
                      duration={1}
                      className="count-up-text"
                    />
                  </div>
                  <p>Formatting</p>
                </motion.div>
                <motion.div
                  className="landingpage-metric"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="landingpage-circle">
                    <CountUp
                      from={0}
                      to={6.6}
                      separator=","
                      direction="up"
                      duration={1}
                      className="count-up-text"
                    />
                  </div>
                  <p>Relevance</p>
                </motion.div>
              </div>
              <motion.div
                className="landingpage-progress"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <span>Total Fit Score</span>
                <div className="landingpage-progress-bar">
                  <motion.div
                    className="landingpage-progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: "78%" }}
                    transition={{ duration: 1, delay: 1 }}
                  ></motion.div>
                </div>
                <span>
                  <CountUp
                    from={0}
                    to={78.5}
                    separator=","
                    direction="up"
                    duration={1}
                    className="count-up-text"
                  />
                  
                </span>
              </motion.div>
              <motion.div
                className="landingpage-ai-suggestion"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                <div className="ai-icon">AI</div>
                <p>
                  Strengthen your summary with impact verbs and measurable
                  outcomes.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ========== FEATURES SECTION ========== */}
        <motion.section
          id="features"
          className="landingpage-features"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.div className="section-header" variants={fadeInUp}>
            <h2>Everything for a Smarter Career Journey</h2>
            <p>Professional tools powered by AI to elevate your career</p>
          </motion.div>
          <div className="landingpage-feature-grid">
            {[
              {
                title: "AI Resume Analysis",
                desc: "Upload PDF, DOC, or DOCX for instant, detailed feedback.",
                icon: "📄",
                btn: "Try demo",
              },
              {
                title: "PDF Summarization",
                desc: "Turn long documents into clear, actionable summaries.",
                icon: "📑",
                btn: "Open demo",
              },
              {
                title: "Academic Note Storage",
                desc: "Keep notes in the cloud with a clean dashboard.",
                icon: "📚",
                btn: "Open notes",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="landingpage-feature-card"
                variants={fadeInUp}
                whileHover={{
                  y: -10,
                  boxShadow: "0 20px 30px rgba(0, 240, 255, 0.25)",
                }}
              >
                <div className="feature-icon-wrapper">
                  <motion.div
                    className="feature-icon"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    {item.icon}
                  </motion.div>
                </div>
                <div className="feature-content">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <motion.button
                    className="landingpage-btn-outline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.btn}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ========== DASHBOARD PREVIEW SECTION ========== */}
        <motion.section
          id="dashboard"
          className="landingpage-dashboard"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          <motion.div className="section-header" variants={fadeInUp}>
            <h2>Interactive Dashboard Preview</h2>
            <p>
              A futuristic glance at analytics, resume scores, and AI
              suggestions
            </p>
          </motion.div>

          <motion.div className="dashboard-preview" variants={scaleUp}>
            {/* Left Column */}
            <div className="dashboard-left">
              <motion.div className="dashboard-card" whileHover={{ y: -5 }}>
                <h3 className="dashboard-card-title">AI Insights</h3>
                <div className="scorecard-metrics">
                  <motion.div
                    className="scorecard-metric"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="metric-value">
                      <CountUp
                        from={0}
                        to={92}
                        separator=","
                        direction="up"
                        duration={1}
                        className="count-up-text"
                      />
                      %
                    </div>
                    <div className="metric-label">Resume Match</div>
                  </motion.div>
                  <motion.div
                    className="scorecard-metric"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="metric-value">
                      <CountUp
                        from={0}
                        to={85}
                        separator=","
                        direction="up"
                        duration={1}
                        className="count-up-text"
                      />
                      %
                    </div>
                    <div className="metric-label">Skill Coverage</div>
                  </motion.div>
                  <motion.div
                    className="scorecard-metric"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="metric-value">
                      <CountUp
                        from={0}
                        to={78}
                        separator=","
                        direction="up"
                        duration={1}
                        className="count-up-text"
                      />
                      %
                    </div>
                    <div className="metric-label">ATS Optimization</div>
                  </motion.div>
                </div>

                <div className="total-fit-score">
                  <div className="score-header">
                    <span>Overall Career Readiness</span>
                    <span><CountUp
  from={0}
  to={85}
  separator=","
  direction="up"
  duration={1}
  className="count-up-text"
/>%</span>
                  </div>
                  <motion.div
                    className="progress-bar"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      whileInView={{ width: "85%" }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      viewport={{ once: true }}
                    ></motion.div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                className="dashboard-card root-actions"
                whileHover={{ y: -5 }}
              >
                <h3 className="dashboard-card-title">Root Actions</h3>
                <ul className="action-list">
                  <motion.li whileHover={{ x: 5 }}>
                    <div className="action-icon">📄</div>
                    <div className="action-content">
                      <strong>AI Resume Analysis</strong>
                      <p>
                        Get instant insights on strengths, weaknesses, and
                        improvements
                      </p>
                    </div>
                  </motion.li>

                  <motion.li whileHover={{ x: 5 }}>
                    <div className="action-icon">📂</div>
                    <div className="action-content">
                      <strong>Secure Resume Storage</strong>
                      <p>
                        Save and access all your resumes for future job
                        applications
                      </p>
                    </div>
                  </motion.li>
                  <motion.li whileHover={{ x: 5 }}>
                    <div className="action-icon">📚</div>
                    <div className="action-content">
                      <strong>Academic Note Storage</strong>
                      <p>Store and organize your academic notes in one place</p>
                    </div>
                  </motion.li>
                  <motion.li whileHover={{ x: 5 }}>
                    <div className="action-icon">📑</div>
                    <div className="action-content">
                      <strong>PDF Summarization</strong>
                      <p>Quickly get AI-generated summaries of lengthy PDFs</p>
                    </div>
                  </motion.li>
                </ul>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="dashboard-right">
              <motion.div
                className="dashboard-card ai-suggestions"
                whileHover={{ y: -5 }}
              >
                <h3 className="dashboard-card-title">AI Suggestions</h3>
                <div className="suggestion-content">
                  <motion.p
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    Use strong action verbs and quantify results (e.g.,
                    "increased retention by 12%").
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    Keep formatting consistent: dates, headings, and spacing.
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    viewport={{ once: true }}
                  >
                    Match skills to the target role and reorder sections by
                    impact.
                  </motion.p>
                </div>
              </motion.div>

              <div className="dashboard-right-grid">
                <motion.div
                  className="dashboard-card suitable-roles"
                  whileHover={{ y: -5 }}
                >
                  <h3 className="dashboard-card-title">Suitable Roles</h3>
                  <div className="role-tags">
                    <motion.span
                      className="role-tag"
                      whileHover={{ scale: 1.05 }}
                    >
                      Frontend Engineer
                    </motion.span>
                    <motion.span
                      className="role-tag"
                      whileHover={{ scale: 1.05 }}
                    >
                      Product Analyst
                    </motion.span>
                    <motion.span
                      className="role-tag"
                      whileHover={{ scale: 1.05 }}
                    >
                      Data Engineer
                    </motion.span>
                  </div>
                </motion.div>

                <motion.div
                  className="dashboard-card progress-card"
                  whileHover={{ y: -5 }}
                >
                  <h3 className="dashboard-card-title">Progress</h3>
                  <div className="progress-content">
                    <motion.div
                      className="progress-item"
                      initial="hidden"
                      whileInView="visible"
                      variants={fadeInUp}
                    >
                      <span>Profile</span>
                      <div className="progress-bar small">
                        <motion.div
                          className="progress-fill"
                          initial={{ width: 0 }}
                          whileInView={{ width: "75%" }}
                          transition={{ duration: 1 }}
                          viewport={{ once: true }}
                        ></motion.div>
                      </div>
                      <span><CountUp
  from={0}
  to={75}
  separator=","
  direction="up"
  duration={1}
  className="count-up-text"
/>%</span>
                    </motion.div>
                    <motion.div
                      className="progress-item"
                      initial="hidden"
                      whileInView="visible"
                      variants={fadeInUp}
                    >
                      <span>Resume</span>
                      <div className="progress-bar small">
                        <motion.div
                          className="progress-fill"
                          initial={{ width: 0 }}
                          whileInView={{ width: "90%" }}
                          transition={{ duration: 1, delay: 0.2 }}
                          viewport={{ once: true }}
                        ></motion.div>
                      </div>
                      <span><CountUp
  from={0}
  to={90}
  separator=","
  direction="up"
  duration={1}
  className="count-up-text"
/>%</span>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  className="dashboard-card resources"
                  whileHover={{ y: -5 }}
                  initial="hidden"
                  whileInView="visible"
                  variants={fadeInUp}
                >
                  <h3 className="dashboard-card-title">Resources</h3>
                  <ul className="resource-list">
                    <motion.li whileHover={{ x: 5 }}>
                      📄 AI Resume Analyzer
                    </motion.li>
                    <motion.li whileHover={{ x: 5 }}>
                      📑 PDF Summarizer
                    </motion.li>
                    <motion.li whileHover={{ x: 5 }}>
                      📚 Academic Notes Storage
                    </motion.li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* ========== CALL TO ACTION ========== */}
        <motion.section
          className="landingpage-cta"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="cta-content">
            <h2>Level Up Your Career With Confidence</h2>
            <p>Start with a professional resume analysis today</p>
            <div className="landingpage-cta-buttons">
              <motion.button
                className="landingpage-btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/ResumeAnalyzer")}
              >
                Upload Resume
              </motion.button>
              <motion.button
                className="landingpage-btn-outline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/Pdf_summarizer")}
              >
                Try Summarizer
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* ========== FOOTER ========== */}
        <motion.footer
          className="landingpage-footer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="footer-content">
            <div className="footer-brand">
              <div className="landingpage-logo">YuktiVerse</div>
              <p>AI-powered career acceleration platform</p>
              <div className="footer-social">
                <motion.a href="#twitter" whileHover={{ y: -3 }}>
                  Twitter
                </motion.a>
                <motion.a href="#linkedin" whileHover={{ y: -3 }}>
                  LinkedIn
                </motion.a>
                <motion.a href="#github" whileHover={{ y: -3 }}>
                  GitHub
                </motion.a>
              </div>
            </div>

            <div className="footer-links">
              <div className="link-group">
                <h4>Product</h4>
                <motion.a href="#features" whileHover={{ x: 5 }}>
                  Features
                </motion.a>
                <motion.a href="#dashboard" whileHover={{ x: 5 }}>
                  Dashboard
                </motion.a>
                <motion.a href="#pricing" whileHover={{ x: 5 }}>
                  Pricing
                </motion.a>
              </div>

              <div className="link-group">
                <h4>Resources</h4>
                <motion.a href="#blog" whileHover={{ x: 5 }}>
                  Blog
                </motion.a>
                <motion.a href="#tutorials" whileHover={{ x: 5 }}>
                  Tutorials
                </motion.a>
                <motion.a href="#support" whileHover={{ x: 5 }}>
                  Support
                </motion.a>
              </div>

              <div className="link-group">
                <h4>Company</h4>
                <motion.a href="#about" whileHover={{ x: 5 }}>
                  About Us
                </motion.a>
                <motion.a href="#careers" whileHover={{ x: 5 }}>
                  Careers
                </motion.a>
                <motion.a href="#contact" whileHover={{ x: 5 }}>
                  Contact
                </motion.a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2025 YuktiVerse. All rights reserved.</p>
            <div className="legal-links">
              <motion.a href="#privacy" whileHover={{ y: -2 }}>
                Privacy Policy
              </motion.a>
              <motion.a href="#terms" whileHover={{ y: -2 }}>
                Terms of Service
              </motion.a>
              <motion.a href="#cookies" whileHover={{ y: -2 }}>
                Cookie Policy
              </motion.a>
            </div>
          </div>
        </motion.footer>
      </div>
    </>
  );
};

export default LandingPage;