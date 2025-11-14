// src/pages/Login.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import { Sun, Zap, Shield, TrendingUp } from 'lucide-react';
import { Button, Input, ThemeToggle } from '../Components/UI';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(email, password);
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding & Features */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block"
        >
          <div className="space-y-8">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl shadow-lg">
                <Sun className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 dark:from-orange-400 dark:to-yellow-400 bg-clip-text text-transparent">
                  iSOLAR
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Powering connections, one panel at a time
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-6 mt-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-start gap-4"
              >
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Real-time Support
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Instant notifications and responses for all support tickets
                  </p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-start gap-4"
              >
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Secure & Reliable
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Your data is protected with enterprise-grade security
                  </p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-start gap-4"
              >
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Grow Your Business
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Manage unlimited clients with powerful tools
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 sm:p-10 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            {/* Mobile Logo */}
            <div className="flex items-center justify-center mb-8 lg:hidden">
              <Sun className="w-10 h-10 text-orange-500 mr-2" />
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">SolarConnect</h1>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to manage your solar connections
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                type="email"
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                autoComplete="email"
              />

              <Input
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete="current-password"
              />

              <Button
                type="submit"
                loading={loading}
                className="w-full py-3 text-base"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-8 space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Don't have an account?
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/signup/installer"
                  className="px-4 py-2 text-center text-sm font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-colors border border-orange-200 dark:border-orange-800"
                >
                  Installer Signup
                </Link>
                <Link
                  to="/signup/client"
                  className="px-4 py-2 text-center text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors border border-blue-200 dark:border-blue-800"
                >
                  Client Signup
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}