// src/pages/InstallerDashboard.jsx
import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  getDoc 
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { 
  Sun, 
  Users, 
  AlertCircle, 
  FileText, 
  LogOut,
  Copy,
  Plus,
  CheckCircle,
  Clock
} from 'lucide-react';
import clsx from 'clsx';

export default function InstallerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [clients, setClients] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [guides, setGuides] = useState([]);
  const [inviteCode, setInviteCode] = useState('');
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
    }
  }, [currentUser]);

  async function fetchOrCreateInviteCode() {
    const codeDoc = await getDoc(doc(db, 'inviteCodes', currentUser.uid));
    if (codeDoc.exists()) {
      setInviteCode(codeDoc.id);
    } else {
      // Create a new invite code
      const newCode = generateInviteCode();
      await addDoc(collection(db, 'inviteCodes'), {
        installerId: currentUser.uid,
        createdAt: new Date().toISOString()
      }).then((docRef) => {
        // Update document ID to be the invite code
        const code = docRef.id.substring(0, 8).toUpperCase();
        setInviteCode(code);
      });
    }
  }

  function generateInviteCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  function subscribeToClients() {
    const q = query(
      collection(db, 'users'),
      where('installerId', '==', currentUser.uid),
      where('role', '==', 'client')
    );

    return onSnapshot(q, (snapshot) => {
      const clientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setClients(clientsData);
      setStats(prev => ({ ...prev, totalClients: clientsData.length }));
    });
  }

  function subscribeToTickets() {
    const q = query(
      collection(db, 'tickets'),
      where('installerId', '==', currentUser.uid)
    );

    return onSnapshot(q, (snapshot) => {
      const ticketsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTickets(ticketsData);
      const pending = ticketsData.filter(t => t.status === 'pending').length;
      setStats(prev => ({ ...prev, pendingTickets: pending }));
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
    alert('Invite code copied to clipboard!');
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
              <Sun className="w-8 h-8 text-orange-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Installer Dashboard</h1>
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

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Clients</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalClients}</p>
              </div>
              <Users className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Tickets</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingTickets}</p>
              </div>
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Guides Created</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalGuides}</p>
              </div>
              <FileText className="w-12 h-12 text-green-500" />
            </div>
          </div>
        </div>

        {/* Invite Code Card */}
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl shadow-lg p-6 mb-8 text-white">
          <h3 className="text-lg font-semibold mb-2">Your Client Invite Code</h3>
          <p className="text-sm opacity-90 mb-4">Share this code with your clients to let them sign up</p>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 flex-1">
              <p className="text-2xl font-mono font-bold tracking-wider">{inviteCode || 'Loading...'}</p>
            </div>
            <button
              onClick={copyInviteCode}
              className="bg-white text-orange-600 px-4 py-3 rounded-lg font-semibold hover:bg-orange-50 transition flex items-center gap-2"
            >
              <Copy className="w-5 h-5" />
              Copy
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {['overview', 'clients', 'tickets', 'guides'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={clsx(
                    'px-6 py-4 text-sm font-medium border-b-2 transition capitalize',
                    activeTab === tab
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  )}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && <OverviewTab clients={clients} tickets={tickets} />}
            {activeTab === 'clients' && <ClientsTab clients={clients} />}
            {activeTab === 'tickets' && <TicketsTab tickets={tickets} clients={clients} />}
            {activeTab === 'guides' && <GuidesTab guides={guides} installerId={currentUser.uid} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components for each tab
function OverviewTab({ clients, tickets }) {
  const recentClients = clients.slice(0, 5);
  const recentTickets = tickets.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Clients</h3>
        {recentClients.length === 0 ? (
          <p className="text-gray-500">No clients yet. Share your invite code!</p>
        ) : (
          <div className="space-y-3">
            {recentClients.map(client => (
              <div key={client.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{client.fullName}</p>
                  <p className="text-sm text-gray-600">{client.email}</p>
                </div>
                <p className="text-sm text-gray-500">{client.address}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tickets</h3>
        {recentTickets.length === 0 ? (
          <p className="text-gray-500">No tickets submitted yet.</p>
        ) : (
          <div className="space-y-3">
            {recentTickets.map(ticket => (
              <div key={ticket.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{ticket.title}</p>
                  <p className="text-sm text-gray-600">{ticket.clientName}</p>
                </div>
                <span className={clsx(
                  'px-3 py-1 rounded-full text-xs font-medium',
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

function ClientsTab({ clients }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">All Clients</h3>
      {clients.length === 0 ? (
        <p className="text-gray-500">No clients yet. Share your invite code to get started!</p>
      ) : (
        <div className="grid gap-4">
          {clients.map(client => (
            <div key={client.id} className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{client.fullName}</h4>
                  <p className="text-sm text-gray-600 mt-1">{client.email}</p>
                  <p className="text-sm text-gray-600">{client.phone}</p>
                  <p className="text-sm text-gray-500 mt-2">{client.address}</p>
                </div>
                <span className="text-xs text-gray-500">
                  Joined {new Date(client.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TicketsTab({ tickets, clients }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [response, setResponse] = useState('');

  async function handleStatusChange(ticketId, newStatus) {
    try {
      await updateDoc(doc(db, 'tickets', ticketId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  }

  async function handleResponse() {
    if (!response.trim() || !selectedTicket) return;

    try {
      await updateDoc(doc(db, 'tickets', selectedTicket.id), {
        response: response,
        status: 'resolved',
        respondedAt: new Date().toISOString()
      });
      setResponse('');
      setSelectedTicket(null);
      alert('Response sent successfully!');
    } catch (error) {
      console.error('Error sending response:', error);
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Support Tickets</h3>
      {tickets.length === 0 ? (
        <p className="text-gray-500">No tickets submitted yet.</p>
      ) : (
        <div className="space-y-4">
          {tickets.map(ticket => (
            <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{ticket.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">From: {ticket.clientName}</p>
                  <p className="text-sm text-gray-500 mt-2">{ticket.description}</p>
                </div>
                <span className={clsx(
                  'px-3 py-1 rounded-full text-xs font-medium',
                  ticket.status === 'pending' && 'bg-yellow-100 text-yellow-800',
                  ticket.status === 'in-progress' && 'bg-blue-100 text-blue-800',
                  ticket.status === 'resolved' && 'bg-green-100 text-green-800'
                )}>
                  {ticket.status}
                </span>
              </div>

              <div className="flex gap-2 mt-3">
                {ticket.status !== 'resolved' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(ticket.id, 'in-progress')}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      Mark In Progress
                    </button>
                    <button
                      onClick={() => setSelectedTicket(ticket)}
                      className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                      Respond & Resolve
                    </button>
                  </>
                )}
              </div>

              {ticket.response && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm font-medium text-green-900">Your Response:</p>
                  <p className="text-sm text-green-800 mt-1">{ticket.response}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-4">Respond to: {selectedTicket.title}</h3>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              rows="4"
              placeholder="Type your response here..."
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleResponse}
                className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
              >
                Send & Mark Resolved
              </button>
              <button
                onClick={() => {
                  setSelectedTicket(null);
                  setResponse('');
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GuidesTab({ guides, installerId }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'maintenance',
    content: ''
  });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'guides'), {
        ...formData,
        installerId,
        createdAt: new Date().toISOString()
      });
      setFormData({ title: '', category: 'maintenance', content: '' });
      setShowForm(false);
      alert('Guide created successfully!');
    } catch (error) {
      console.error('Error creating guide:', error);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Troubleshooting Guides</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          <Plus className="w-5 h-5" />
          New Guide
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="e.g., How to Reset Your Inverter"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              >
                <option value="maintenance">Maintenance</option>
                <option value="troubleshooting">Troubleshooting</option>
                <option value="safety">Safety</option>
                <option value="optimization">Optimization</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Write step-by-step instructions..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                Create Guide
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

      {guides.length === 0 ? (
        <p className="text-gray-500">No guides created yet. Create your first guide to help your clients!</p>
      ) : (
        <div className="grid gap-4">
          {guides.map(guide => (
            <div key={guide.id} className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{guide.title}</h4>
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded capitalize">
                  {guide.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{guide.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}