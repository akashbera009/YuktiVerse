import { useState, useEffect } from "react";
import axios from "axios";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
const backendURL = import.meta.env.VITE_BACKEND_URL;
const frontenedURL = import.meta.env.VITE_FRONTENED_URL;
import "./Login.css"; // ✅ dedicated styling for login

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendURL}/api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.id);
      console.log(res);

      console.log("token is", localStorage.getItem("token"));

      // alert("Logged in successfully");
      const navigateLink = `/feature/academic-org`;
      navigate(navigateLink);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  if (!mounted) return null;
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  };

  const backgroundStyle = {
    position: 'absolute',
    inset: '0',
    overflow: 'hidden',
    pointerEvents: 'none'
  };

  const orbStyle = (i) => ({
    position: 'absolute',
    borderRadius: '50%',
    mixBlendMode: 'screen',
    filter: 'blur(40px)',
    opacity: '0.3',
    animation: `float ${10 + Math.random() * 20}s ease-in-out infinite`,
    animationDelay: `${i * 0.5}s`,
    background: i % 3 === 0 
      ? 'linear-gradient(45deg, #8b5cf6, #06b6d4)' 
      : i % 3 === 1
      ? 'linear-gradient(45deg, #ec4899, #f59e0b)'
      : 'linear-gradient(45deg, #10b981, #3b82f6)',
    width: `${Math.random() * 200 + 100}px`,
    height: `${Math.random() * 200 + 100}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`
  });

  const cardStyle = {
    position: 'relative',
    zIndex: '10',
    width: '100%',
    maxWidth: '448px',
    backdropFilter: 'blur(20px)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    padding: '32px',
    transform: 'scale(1)',
    transition: 'all 0.5s ease'
  };

  const logoContainerStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '64px',
    height: '64px',
    background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    borderRadius: '16px',
    marginBottom: '16px',
    transform: 'rotate(0deg)',
    transition: 'transform 0.3s ease'
  };

  const titleStyle = {
    fontSize: '30px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #ffffff, #e9d5ff, #fce7f3)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
    textAlign: 'center'
  };

  const subtitleStyle = {
    color: '#d1d5db',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '32px'
  };

  const inputContainerStyle = {
    position: 'relative',
    marginBottom: '24px'
  };

  const iconStyle = {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    transition: 'color 0.3s ease',
    pointerEvents: 'none'
  };

  const inputStyle = {
    width: '100%',
    paddingLeft: '48px',
    paddingRight: '16px',
    paddingTop: '16px',
    paddingBottom: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '16px',
    outline: 'none',
    backdropFilter: 'blur(8px)',
    transition: 'all 0.3s ease'
  };

  const passwordInputStyle = {
    ...inputStyle,
    paddingRight: '48px'
  };

  const toggleButtonStyle = {
    position: 'absolute',
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
    transition: 'color 0.3s ease'
  };

  const errorStyle = {
    color: '#f87171',
    fontSize: '14px',
    marginTop: '8px'
  };

  const buttonStyle = {
    width: '100%',
    padding: '16px 24px',
    background: 'linear-gradient(135deg, #8b5cf6, #ec4899, #3b82f6)',
    color: '#ffffff',
    fontWeight: '600',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    boxShadow: '0 10px 25px rgba(139, 92, 246, 0.25)',
    transform: 'scale(1)',
    transition: 'all 0.2s ease',
    marginTop: '24px'
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    opacity: '0.7',
    cursor: 'not-allowed'
  };

  const spinnerStyle = {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  const footerStyle = {
    marginTop: '32px',
    textAlign: 'center'
  };

  const linkStyle = {
    color: '#a78bfa',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.3s ease'
  };

  const dividerStyle = {
    margin: '24px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const dividerLineStyle = {
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
    flexGrow: '1'
  };

  const dividerTextStyle = {
    padding: '0 16px',
    color: '#9ca3af',
    fontSize: '12px'
  };

  const socialContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginTop: '24px'
  };

  const socialButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(8px)'
  };

  return (
    <div style={containerStyle}>
      {/* Keyframe animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-30px) rotate(120deg); }
            66% { transform: translateY(-60px) rotate(240deg); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .login-card:hover {
            transform: scale(1.02);
          }
          .logo-container:hover {
            transform: rotate(12deg);
          }
          .login-input:focus {
            background-color: rgba(255, 255, 255, 0.1);
            box-shadow: 0 0 0 2px #8b5cf6;
            border-color: transparent;
          }
          .login-input:focus + .input-icon {
            color: #a78bfa;
          }
          .login-button:hover:not(:disabled) {
            transform: scale(1.05);
            background: linear-gradient(135deg, #7c3aed, #db2777, #2563eb);
          }
          .login-button:active:not(:disabled) {
            transform: scale(0.95);
          }
          .social-button:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
          .login-link:hover {
            color: #c4b5fd;
            text-decoration: underline;
          }
        `}
      </style>

      {/* Animated background elements */}
      <div style={backgroundStyle}>
        {/* Floating orbs */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={orbStyle(i)} />
        ))}

        {/* Grid pattern */}
        <div style={{
          position: 'absolute',
          inset: '0',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: '0.2'
        }} />
      </div>

      {/* Main login card */}
      <div style={cardStyle} className="login-card">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={logoContainerStyle} className="logo-container">
            <Sparkles size={32} color="#ffffff" />
          </div>
          <h1 style={titleStyle}>Welcome Back</h1>
          <p style={subtitleStyle}>Sign in to continue your journey</p>
        </div>

        {/* Form */}
        <div style={{ marginBottom: '32px' }}>
          {/* Email field */}
          <div style={inputContainerStyle}>
            <div style={iconStyle} className="input-icon">
              <Mail size={20} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              className="login-input"
              placeholder="Enter your email"
              required
            />
            {errors.email && (
              <p style={errorStyle}>{errors.email}</p>
            )}
          </div>

          {/* Password field */}
          <div style={inputContainerStyle}>
            <div style={iconStyle} className="input-icon">
              <Lock size={20} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={passwordInputStyle}
              className="login-input"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={toggleButtonStyle}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p style={errorStyle}>{errors.password}</p>
            )}
          </div>

          {/* Submit error */}
          {errors.submit && (
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              marginBottom: '16px'
            }}>
              <p style={{ ...errorStyle, margin: '0', textAlign: 'center' }}>{errors.submit}</p>
            </div>
          )}

          {/* Login button */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoading}
            style={isLoading ? disabledButtonStyle : buttonStyle}
            className="login-button"
          >
            {isLoading ? (
              <>
                <div style={spinnerStyle} />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          <p style={{ color: '#d1d5db', fontSize: '14px', margin: '0' }}>
            Don't have an account?{" "}
            <a href="/register" style={linkStyle} className="login-link">
              Create one here
            </a>
          </p>
        </div>

        {/* Social divider */}
        {/* <div style={dividerStyle}>
          <div style={dividerLineStyle}></div>
          <span style={dividerTextStyle}>OR CONTINUE WITH</span>
          <div style={dividerLineStyle}></div>
        </div> */}

        {/* Social buttons */}
        {/* <div style={socialContainerStyle}>
          <button style={socialButtonStyle} className="social-button">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </button>
          <button style={socialButtonStyle} className="social-button">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
            </svg>
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default  Login;