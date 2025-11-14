// src/pages/InstallerDashboard.jsx
import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { useAuth } from '../Contexts/AuthContext';
import { db } from '../firebase';
import { toast } from '../Components/ToastProvider';
import ChatPanel from '../Components/ChatPanel';
import { 
  Sun, 
  Users, 
  AlertCircle, 
  FileText, 
  LogOut,
  Copy,
  Menu,
  X
} from 'lucide-react';
import { 
  Button, 
  Card, 
  ThemeToggle, 
  Skeleton 
} from '../Components/UI';
import { OverviewTab, ClientsTab, TicketsTab, GuidesTab } from '../Components/InstallerDashboardTabs';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function InstallerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [clients, setClients] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [guides, setGuides] = useState([]);
  const [inviteCode, setInviteCode] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [stats, setStats] = useState({
    totalClients: 0,
    pendingTickets: 0,
    totalGuides: 0
  });
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchOrCreateInviteCode();
      subscribeToClients();
      subscribeToTickets();
      subscribeToGuides();
      
      // Set loading to false after initial data fetch
      setTimeout(() => setLoading(false), 1000);
    }
  }, [currentUser]);

  async function fetchOrCreateInviteCode() {
    try {
      const codeDoc = await getDoc(doc(db, 'inviteCodes', currentUser.uid));
      if (codeDoc.exists()) {
        setInviteCode(currentUser.uid);
      } else {
        await setDoc(doc(db, 'inviteCodes', currentUser.uid), {
          installerId: currentUser.uid,
          createdAt: new Date().toISOString()
        });
        setInviteCode(currentUser.uid);
      }
    } catch (error) {
      console.error('Error with invite code:', error);
    }
  }

  function subscribeToClients() {
    const q = query(
      collection(db, 'users'),
      where('installerId', '==', currentUser.uid),
      where('role', '==', 'client')
    );

    let isFirstLoad = true;

    return onSnapshot(q, (snapshot) => {
      const clientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Notify about new clients (only after first load)
      if (!isFirstLoad) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const client = change.doc.data();
            toast.success('New Client Joined!', {
              description: `${client.fullName} is now connected`,
              duration: 5000,
            });
          }
        });
      }
      
      setClients(clientsData);
      setStats(prev => ({ ...prev, totalClients: clientsData.length }));
      isFirstLoad = false;
    });
  }

  function subscribeToTickets() {
    const q = query(
      collection(db, 'tickets'),
      where('installerId', '==', currentUser.uid)
    );

    let isFirstLoad = true;

    return onSnapshot(q, (snapshot) => {
      const ticketsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Notify about new tickets (only after first load)
      if (!isFirstLoad) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const ticket = change.doc.data();
            toast.info('New Support Ticket!', {
              description: `${ticket.clientName}: ${ticket.title}`,
              duration: 6000,
            });
          }
        });
      }
      
      setTickets(ticketsData);
      const pending = ticketsData.filter(t => t.status === 'pending').length;
      setStats(prev => ({ ...prev, pendingTickets: pending }));
      isFirstLoad = false;
    });
  }

  function subscribeToGuides() {
    const q = query(
      collection(db, 'guides'),
      where('installerId', '==', currentUser.uid)
    );

    return onSnapshot(q, (snapshot) => {
      const guidesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGuides(guidesData);
      setStats(prev => ({ ...prev, totalGuides: guidesData.length }));
    });
  }

  function copyInviteCode() {
    navigator.clipboard.writeText(inviteCode);
    toast.success('Invite code copied!', {
      description: 'Share this code with your clients'
    });
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Skeleton className="h-8 w-48" />
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <Card key={i} className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl shadow-lg">
                <Sun className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Installer Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Manage your solar clients
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="sm:hidden border-t dark:border-gray-700 overflow-hidden"
            >
              <div className="px-4 py-3">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Clients</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.totalClients}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending Tickets</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.pendingTickets}</p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                  <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Guides Created</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.totalGuides}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Invite Code Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 mb-6 sm:mb-8 bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-0 shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Your Client Invite Code</h3>
            <p className="text-sm opacity-90 mb-4">Share this code with your clients to let them sign up</p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 min-w-0">
                <p className="text-xl sm:text-2xl font-mono font-bold tracking-wider break-all">
                  {inviteCode || 'Loading...'}
                </p>
              </div>
              <Button
                onClick={copyInviteCode}
                className="bg-white text-orange-600 hover:bg-orange-50 border-0 whitespace-nowrap"
              >
                <Copy className="w-5 h-5" />
                <span>Copy Code</span>
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Card className="overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <nav className="flex min-w-max sm:min-w-0">
              {['overview', 'clients', 'tickets', 'guides'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={clsx(
                    'px-6 py-4 text-sm font-medium border-b-2 transition capitalize whitespace-nowrap',
                    activeTab === tab
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                  )}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'overview' && <OverviewTab clients={clients} tickets={tickets} />}
                {activeTab === 'clients' && <ClientsTab clients={clients} onSelectClient={setSelectedClient} />}
                {activeTab === 'tickets' && <TicketsTab tickets={tickets} />}
                {activeTab === 'guides' && <GuidesTab guides={guides} installerId={currentUser.uid} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </Card>
      </div>

      {/* Chat Panel */}
      {selectedClient && (
        <ChatPanel
          recipientId={selectedClient.id}
          recipientName={selectedClient.fullName}
          recipientRole="client"
        />
      )}
    </div>
  );
}