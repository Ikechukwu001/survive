// src/pages/ClientDashboard.jsx
import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  addDoc,
  doc,
  getDoc 
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { 
  Sun, 
  Book, 
  MessageSquare, 
  LogOut,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  Menu,
  X,
  Filter
} from 'lucide-react';
import { 
  Button, 
  Card, 
  Badge, 
  Input, 
  Textarea, 
  ThemeToggle, 
  EmptyState,
  Skeleton 
} from '../Components/UI';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [guides, setGuides] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [installerInfo, setInstallerInfo] = useState(null);
  const [userData, setUserData] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  useEffect(() => {
    if (userData?.installerId) {
      subscribeToGuides();
      subscribeToTickets();
      setTimeout(() => setLoading(false), 1000);
    }
  }, [userData]);

  async function fetchUserData() {
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      setUserData(data);
      
      if (data.installerId) {
        const installerDoc = await getDoc(doc(db, 'users', data.installerId));
        if (installerDoc.exists()) {
          setInstallerInfo(installerDoc.data());
        }
      }
    }
  }

  function subscribeToGuides() {
    const q = query(
      collection(db, 'guides'),
      where('installerId', '==', userData.installerId)
    );

    return onSnapshot(q, (snapshot) => {
      const guidesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGuides(guidesData);
    });
  }

  function subscribeToTickets() {
    const q = query(
      collection(db, 'tickets'),
      where('clientId', '==', currentUser.uid)
    );

    let isFirstLoad = true;

    return onSnapshot(q, (snapshot) => {
      const ticketsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Check for newly resolved tickets (only after first load)
      if (!isFirstLoad) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'modified') {
            const ticket = change.doc.data();
            if (ticket.status === 'resolved' && ticket.response) {
              toast.success('Ticket Resolved!', {
                description: `${ticket.title} - Check the response`,
                duration: 5000,
              });
            } else if (ticket.status === 'in-progress') {
              toast.info('Ticket Update', {
                description: `${ticket.title} is now in progress`,
                duration: 4000,
              });
            }
          }
        });
      }
      
      setMyTickets(ticketsData);
      isFirstLoad = false;
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

  const pendingCount = myTickets.filter(t => t.status !== 'resolved').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                <Sun className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Client Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Welcome, {userData?.fullName}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Installer Info Card */}
        {installerInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6 mb-6 sm:mb-8 bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Your Solar Installer</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm opacity-90 mb-1">Company</p>
                  <p className="text-lg sm:text-xl font-semibold truncate">
                    {installerInfo.companyName}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-90 mb-1">Phone</p>
                  <p className="text-lg sm:text-xl font-semibold truncate">
                    {installerInfo.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-90 mb-1">Location</p>
                  <p className="text-lg sm:text-xl font-semibold truncate">
                    {installerInfo.location}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Available Guides
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {guides.length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <Book className="w-8 h-8 text-green-600 dark:text-green-400" />
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
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    My Tickets
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {myTickets.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
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
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Pending Issues
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {pendingCount}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                  <AlertCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Tabs */}
        <Card className="overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <nav className="flex min-w-max sm:min-w-0">
              {['overview', 'guides', 'tickets'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={clsx(
                    'px-6 py-4 text-sm font-medium border-b-2 transition capitalize whitespace-nowrap',
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
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
                {activeTab === 'overview' && (
                  <OverviewTab 
                    guides={guides} 
                    tickets={myTickets} 
                    installerInfo={installerInfo}
                  />
                )}
                {activeTab === 'guides' && <GuidesTab guides={guides} />}
                {activeTab === 'tickets' && (
                  <TicketsTab 
                    tickets={myTickets} 
                    clientId={currentUser.uid}
                    clientName={userData?.fullName}
                    installerId={userData?.installerId}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Tab Components
function OverviewTab({ guides, tickets }) {
  const recentGuides = guides.slice(0, 3);
  const recentTickets = tickets.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Quick Access Guides
        </h3>
        {recentGuides.length === 0 ? (
          <EmptyState
            icon={Book}
            title="No guides yet"
            description="Your installer hasn't created any guides yet."
          />
        ) : (
          <div className="grid gap-3">
            {recentGuides.map((guide, index) => (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {guide.title}
                    </h4>
                    <Badge variant="success" className="flex-shrink-0 capitalize">
                      {guide.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {guide.content}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Recent Tickets
        </h3>
        {recentTickets.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No tickets yet"
            description="You haven't submitted any support tickets."
          />
        ) : (
          <div className="space-y-3">
            {recentTickets.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="font-medium text-gray-900 dark:text-gray-100 flex-1 min-w-0 truncate">
                      {ticket.title}
                    </p>
                    <Badge variant={
                      ticket.status === 'pending' ? 'warning' :
                      ticket.status === 'in-progress' ? 'info' : 'success'
                    } className="flex-shrink-0">
                      {ticket.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {ticket.description}
                  </p>
                  {ticket.response && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Installer responded
                    </p>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GuidesTab({ guides }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categories = ['all', 'maintenance', 'troubleshooting', 'safety', 'optimization'];

  const filteredGuides = selectedCategory === 'all' 
    ? guides 
    : guides.filter(g => g.category === selectedCategory);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Troubleshooting Guides ({filteredGuides.length})
        </h3>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-sm"
          >
            {categories.map(cat => (
              <option key={cat} value={cat} className="capitalize">
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredGuides.length === 0 ? (
        <EmptyState
          icon={Book}
          title="No guides available"
          description={selectedCategory === 'all' 
            ? "Your installer hasn't created any guides yet."
            : `No guides in the ${selectedCategory} category.`}
        />
      ) : (
        <div className="grid gap-4">
          {filteredGuides.map((guide, index) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-5 hover:shadow-lg transition-all hover:border-blue-300 dark:hover:border-blue-700">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {guide.title}
                  </h4>
                  <Badge className="flex-shrink-0 capitalize">
                    {guide.category}
                  </Badge>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {guide.content}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function TicketsTab({ tickets, clientId, clientName, installerId }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setSubmitting(true);
      await addDoc(collection(db, 'tickets'), {
        ...formData,
        clientId,
        clientName,
        installerId,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setFormData({ title: '', description: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Failed to submit ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          My Support Tickets ({tickets.length})
        </h3>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          <Send className="w-5 h-5" />
          New Ticket
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <Card className="p-5 bg-blue-50 dark:bg-blue-900/20">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Submit a New Ticket
              </h4>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Issue Title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g., Inverter not turning on"
                />

                <Textarea
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows="4"
                  placeholder="Describe the issue in detail..."
                />

                <div className="flex flex-col-reverse sm:flex-row gap-3">
                  <Button
                    type="button"
                    onClick={() => setShowForm(false)}
                    variant="secondary"
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={submitting}
                    className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    Submit Ticket
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {tickets.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No tickets yet"
          description="Having issues? Create a ticket to get help from your installer!"
          action={
            !showForm && (
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                <Send className="w-5 h-5" />
                Create Your First Ticket
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-5 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-1">
                      {ticket.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Submitted {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge 
                    variant={
                      ticket.status === 'pending' ? 'warning' :
                      ticket.status === 'in-progress' ? 'info' : 'success'
                    }
                    className="flex items-center gap-1 self-start"
                  >
                    {ticket.status === 'pending' && <Clock className="w-3 h-3" />}
                    {ticket.status === 'resolved' && <CheckCircle className="w-3 h-3" />}
                    {ticket.status}
                  </Badge>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {ticket.description}
                  </p>
                </div>

                {ticket.response && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
                  >
                    <p className="text-sm font-semibold text-green-900 dark:text-green-400 mb-2">
                      Installer Response:
                    </p>
                    <p className="text-sm text-green-800 dark:text-green-300">
                      {ticket.response}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-500 mt-2">
                      Responded {new Date(ticket.respondedAt).toLocaleDateString()}
                    </p>
                  </motion.div>
                )}

                {!ticket.response && ticket.status === 'in-progress' && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      Your installer is working on this issue...
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}