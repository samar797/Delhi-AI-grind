import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('demo@solar.com');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role) => {
    if (role === 'demo') {
      setEmail('demo@solar.com');
      setPassword('demo123');
    } else if (role === 'admin') {
      setEmail('admin@solar.com');
      setPassword('admin123');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Section */}
      <motion.div 
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-solar-dark"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920&q=80')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-blue-900/70 to-solar-dark/90"></div>
        </div>

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              style={{
                width: Math.random() * 10 + 5,
                height: Math.random() * 10 + 5,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.5 + 0.2,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-16 text-white">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-solar-green to-solar-blue flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 22h20L12 2zm0 4l6 13H6l6-13z"/>
                </svg>
              </div>
              <span className="text-2xl font-orbitron font-bold gradient-text">Solar Intelligence</span>
            </div>

            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Power your future with{' '}
              <span className="gradient-text neon-text">AI Solar Intelligence</span>
            </h1>

            <p className="text-lg text-gray-300 mb-8 max-w-lg">
              Live IoT monitoring, predictive maintenance, smart recycling, and sustainability analytics — all in one intelligent platform.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="glass-card p-4">
                <div className="text-3xl font-bold gradient-text">98%</div>
                <div className="text-sm text-gray-400">Efficiency</div>
              </div>
              <div className="glass-card p-4">
                <div className="text-3xl font-bold gradient-text">2.5K+</div>
                <div className="text-sm text-gray-400">Panels Monitored</div>
              </div>
              <div className="glass-card p-4">
                <div className="text-3xl font-bold gradient-text">500+</div>
                <div className="text-sm text-gray-400">Recyclers</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-400">
              <CheckCircle className="w-5 h-5 text-solar-green" />
              <span>Trusted by 10,000+ sustainable communities worldwide</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-solar-dark/95">
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="glass-card p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
              <p className="text-gray-400">Sign in to your smart dashboard</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-6"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-solar-green/50 focus:ring-2 focus:ring-solar-green/20 transition-all text-white placeholder-gray-500"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-solar-green/50 focus:ring-2 focus:ring-solar-green/20 transition-all text-white placeholder-gray-500"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-solar-green focus:ring-solar-green/50"
                  />
                  <span className="text-sm text-gray-400">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-solar-green hover:text-solar-blue transition-colors">
                  Forgot password?
                </Link>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-gradient-to-r from-solar-green to-solar-blue rounded-xl font-semibold text-solar-dark flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-solar-green/20 hover:shadow-solar-green/40 transition-shadow"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-solar-dark border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-sm text-gray-400 mb-3 font-medium">Demo Credentials:</p>
              <div className="space-y-2">
                <button
                  onClick={() => fillDemoCredentials('demo')}
                  className="w-full text-left text-xs px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex justify-between items-center group"
                >
                  <span className="text-gray-300">User: demo@solar.com / demo123</span>
                  <ArrowRight className="w-3 h-3 text-solar-green opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button
                  onClick={() => fillDemoCredentials('admin')}
                  className="w-full text-left text-xs px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex justify-between items-center group"
                >
                  <span className="text-gray-300">Admin: admin@solar.com / admin123</span>
                  <ArrowRight className="w-3 h-3 text-solar-green opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                New here?{' '}
                <Link to="/signup" className="text-solar-green hover:text-solar-blue font-medium transition-colors">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
