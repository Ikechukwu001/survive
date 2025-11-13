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
  User,
  LogOut,
  Send,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import clsx from 'clsx';

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [guides, setGuides] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [installerInfo, setInstallerInfo] = useState(null);
  const [userData, setUserData] = useState(null);
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchUserData();
      subscribeToGuides();
      subscribeToTickets();
    }
  }, [currentUser]);

  async function fetchUserData() {
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      setUserData(data);
      
      // Fetch installer info
      if (data.installerId) {
        const installerDoc = await getDoc(doc(db, 'users', data.installerId));
        if (installerDoc.exists()) {
          setInstallerInfo(installerDoc.data());
        }
      }
    }
  }

  function subscribeToGuides() {
    if (!userData?.installerId) return;

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

    return onSnapshot(q, (snapshot) => {
      const ticketsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMyTickets(ticketsData);
    });
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Sun className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Client Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome, {userData?.fullName}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Installer Info Card */}
        {installerInfo && (
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg p-6 mb-8 text-white">
            <h3 className="text-lg font-semibold mb-2">Your Solar Installer</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm opacity-90">Company</p>
                <p className="text-xl font-semibold">{installerInfo.companyName}</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Phone</p>
                <p className="text-xl font-semibold">{installerInfo.phone}</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Location</p>
                <p className="text-xl font-semibold">{installerInfo.location}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Available Guides</p>
                <p className="text-3xl font-bold text-gray-900">{guides.length}</p>
              </div>
              <Book className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">My Tickets</p>
                <p className="text-3xl font-bold text-gray-900">{myTickets.length}</p>
              </div>
              <MessageSquare className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Issues</p>
                <p className="text-3xl font-bold text-gray-900">
                  {myTickets.filter(t => t.status !== 'resolved').length}
                </p>
              </div>
              <AlertCircle className="w-12 h-12 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {['overview', 'guides', 'tickets'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={clsx(
                    'px-6 py-4 text-sm font-medium border-b-2 transition capitalize',
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  )}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
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
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ guides, tickets, installerInfo }) {
  const recentGuides = guides.slice(0, 3);
  const recentTickets = tickets.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Access Guides</h3>
        {recentGuides.length === 0 ? (
          <p className="text-gray-500">No guides available yet.</p>
        ) : (
          <div className="grid gap-3">
            {recentGuides.map(guide => (
              <div key={guide.id} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{guide.title}</h4>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded capitalize">
                    {guide.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{guide.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tickets</h3>
        {recentTickets.length === 0 ? (
          <p className="text-gray-500">No tickets submitted yet. Need help? Create a ticket!</p>
        ) : (
          <div className="space-y-3">
            {recentTickets.map(ticket => (
              <div key={ticket.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{ticket.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                  {ticket.response && (
                    <p className="text-sm text-green-600 mt-2">✓ Installer responded</p>
                  )}
                </div>
                <span className={clsx(
                  'px-3 py-1 rounded-full text-xs font-medium ml-4',
                  ticket.status === 'pending' && 'bg-yellow-100 text-yellow-800',
                  ticket.status === 'in-progress' && 'bg-blue-100 text-blue-800',
                  ticket.status === 'resolved' && 'bg-green-100 text-green-800'
                )}>
                  {ticket.status}
                </span>
              </div>
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
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Troubleshooting Guides</h3>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          {categories.map(cat => (
            <option key={cat} value={cat} className="capitalize">
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>

      {filteredGuides.length === 0 ? (
        <p className="text-gray-500">No guides available in this category.</p>
      ) : (
        <div className="grid gap-4">
          {filteredGuides.map(guide => (
            <div key={guide.id} className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-900">{guide.title}</h4>
                <span className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full capitalize">
                  {guide.category}
                </span>
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{guide.content}</p>
              </div>
            </div>
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

  async function handleSubmit(e) {
    e.preventDefault();
    try {
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
      alert('Ticket submitted successfully! Your installer will respond soon.');
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Failed to submit ticket. Please try again.');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">My Support Tickets</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          <Send className="w-5 h-5" />
          New Ticket
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-5 border border-gray-200 rounded-lg bg-blue-50">
          <h4 className="font-semibold text-gray-900 mb-4">Submit a New Ticket</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g., Inverter not turning on"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Describe the issue in detail..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Submit Ticket
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {tickets.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No tickets yet. Having issues? Create a ticket above!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map(ticket => (
            <div key={ticket.id} className="border border-gray-200 rounded-lg p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-lg">{ticket.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Submitted {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={clsx(
                  'px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1',
                  ticket.status === 'pending' && 'bg-yellow-100 text-yellow-800',
                  ticket.status === 'in-progress' && 'bg-blue-100 text-blue-800',
                  ticket.status === 'resolved' && 'bg-green-100 text-green-800'
                )}>
                  {ticket.status === 'pending' && <Clock className="w-3 h-3" />}
                  {ticket.status === 'resolved' && <CheckCircle className="w-3 h-3" />}
                  {ticket.status}
                </span>
              </div>

              <div className="bg-gray-50 rounded p-3 mb-3">
                <p className="text-sm text-gray-700">{ticket.description}</p>
              </div>

              {ticket.response && (
                <div className="bg-green-50 border border-green-200 rounded p-4">
                  <p className="text-sm font-semibold text-green-900 mb-2">
                    Installer Response:
                  </p>
                  <p className="text-sm text-green-800">{ticket.response}</p>
                  <p className="text-xs text-green-600 mt-2">
                    Responded {new Date(ticket.respondedAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              {!ticket.response && ticket.status === 'in-progress' && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-sm text-blue-800">
                    Your installer is working on this issue...
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}