// src/pages/SignupClient.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { Sun, CheckCircle } from 'lucide-react';
import { Button, Input, Textarea, ThemeToggle, LoadingSpinner } from '../Components/UI';
import { motion } from 'framer-motion';
import SEO from "../Components/SEO";


export default function SignupClient() {
  const { inviteCode } = useParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    address: '',
    inviteCode: inviteCode || ''
  });
  const [installerInfo, setInstallerInfo] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (formData.inviteCode) {
      verifyInviteCode(formData.inviteCode);
    }
  }, [formData.inviteCode]);

  async function verifyInviteCode(code) {
    if (!code || code.trim() === '') {
      setInstallerInfo(null);
      return;
    }

    try {
      setVerifying(true);
      const inviteDoc = await getDoc(doc(db, 'inviteCodes', code));
      
      if (inviteDoc.exists()) {
        const inviteData = inviteDoc.data();
        const installerDoc = await getDoc(doc(db, 'users', inviteData.installerId));
        
        if (installerDoc.exists()) {
          setInstallerInfo({
            id: inviteData.installerId,
            ...installerDoc.data()
          });
          setError('');
        } else {
          setInstallerInfo(null);
          setError('Installer not found. Please contact your installer.');
        }
      } else {
        setInstallerInfo(null);
        setError('Invalid invite code. Please check with your installer.');
      }
    } catch (err) {
      console.error('Error verifying invite code:', err);
      setError(`Error: ${err.message}`);
      setInstallerInfo(null);
    } finally {
      setVerifying(false);
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!installerInfo) {
      return setError('Please enter a valid invite code');
    }

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setError('');
      setLoading(true);
      
      await signup(formData.email, formData.password, 'client', {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        installerId: installerInfo.id,
        installerName: installerInfo.companyName
      });

      navigate('/client/dashboard');
    } catch (err) {
      setError('Failed to create account. Email may already be in use.');
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <>
      <SEO
        title="iSOLAR – Sign up page - Connect Solar Installers and Clients"
        description="iSOLAR connects verified solar installers with clients, provides troubleshooting tips, and enables direct communication for solar system support."
        url="https://isolar.vercel.app"
      />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center justify-center mb-8">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg mr-3">
            <Sun className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">iSOLAR</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">For Clients</p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Create Client Account
        </h2>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4"
          >
            {error}
          </motion.div>
        )}

        {installerInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg mb-4 flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span>
              Connected to: <strong>{installerInfo.companyName}</strong>
            </span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              name="inviteCode"
              label="Installer Invite Code"
              value={formData.inviteCode}
              onChange={handleChange}
              required
              placeholder="Enter your installer's code"
            />
            {verifying && (
              <div className="mt-2 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                <LoadingSpinner size="sm" />
                <span>Verifying code...</span>
              </div>
            )}
          </div>

          <Input
            type="text"
            name="fullName"
            label="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            placeholder="John Doe"
          />

          <Input
            type="email"
            name="email"
            label="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your@email.com"
            autoComplete="email"
          />

          <Input
            type="tel"
            name="phone"
            label="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="+234 xxx xxx xxxx"
          />

          <Textarea
            name="address"
            label="Installation Address"
            value={formData.address}
            onChange={handleChange}
            required
            rows="2"
            placeholder="Full address where solar is installed"
          />

          <Input
            type="password"
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
            autoComplete="new-password"
          />

          <Input
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="••••••••"
            autoComplete="new-password"
          />

          <Button
            type="submit"
            loading={loading}
            disabled={!installerInfo}
            variant="primary"
            className="w-full py-3 mt-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Create Client Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
    </>
  );
}