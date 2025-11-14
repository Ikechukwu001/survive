// src/Components/InstallerDashboardTabs.jsx
import { useState } from 'react';
import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from './ToastProvider';
import { Plus, Send, X } from 'lucide-react';
import { Button, Input, Textarea, Badge, EmptyState, Card } from './UI';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export function OverviewTab({ clients, tickets }) {
  const recentClients = clients.slice(0, 5);
  const recentTickets = tickets.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Recent Clients
        </h3>
        {recentClients.length === 0 ? (
          <EmptyState
            title="No clients yet"
            description="Share your invite code to get started with your first client!"
          />
        ) : (
          <div className="space-y-3">
            {recentClients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {client.fullName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {client.email}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-500 truncate">
                      {client.address}
                    </p>
                  </div>
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
            title="No tickets yet"
            description="Your clients haven't submitted any support tickets."
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
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {ticket.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {ticket.clientName}
                      </p>
                    </div>
                    <Badge variant={
                      ticket.status === 'pending' ? 'warning' :
                      ticket.status === 'in-progress' ? 'info' : 'success'
                    }>
                      {ticket.status}
                    </Badge>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ClientsTab({ clients, onSelectClient }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        All Clients ({clients.length})
      </h3>
      {clients.length === 0 ? (
        <EmptyState
          title="No clients yet"
          description="Share your invite code to get started with your first client!"
        />
      ) : (
        <div className="grid gap-4">
          {clients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 sm:p-5 hover:shadow-lg transition-all hover:border-orange-300 dark:hover:border-orange-700">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {client.fullName}
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600 dark:text-gray-400 truncate">
                        📧 {client.email}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 truncate">
                        📱 {client.phone}
                      </p>
                      <p className="text-gray-500 dark:text-gray-500">
                        📍 {client.address}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
                    Joined {new Date(client.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TicketsTab({ tickets }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [response, setResponse] = useState('');
  const [responding, setResponding] = useState(false);

  async function handleStatusChange(ticketId, newStatus) {
    try {
      await updateDoc(doc(db, 'tickets', ticketId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      toast.success('Ticket updated!', {
        description: `Status changed to ${newStatus}`
      });
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error('Failed to update ticket');
    }
  }

  async function handleResponse() {
    if (!response.trim() || !selectedTicket) return;

    try {
      setResponding(true);
      await updateDoc(doc(db, 'tickets', selectedTicket.id), {
        response: response,
        status: 'resolved',
        respondedAt: new Date().toISOString()
      });
      setResponse('');
      setSelectedTicket(null);
      toast.success('Response sent!', {
        description: 'Client will be notified of your response'
      });
    } catch (error) {
      console.error('Error sending response:', error);
      toast.error('Failed to send response');
    } finally {
      setResponding(false);
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Support Tickets ({tickets.length})
      </h3>
      {tickets.length === 0 ? (
        <EmptyState
          title="No tickets yet"
          description="Your clients haven't submitted any support tickets."
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
              <Card className="p-4 sm:p-5 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {ticket.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      From: {ticket.clientName}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {ticket.description}
                    </p>
                  </div>
                  <Badge variant={
                    ticket.status === 'pending' ? 'warning' :
                    ticket.status === 'in-progress' ? 'info' : 'success'
                  } className="whitespace-nowrap">
                    {ticket.status}
                  </Badge>
                </div>

                {ticket.status !== 'resolved' && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {ticket.status === 'pending' && (
                      <Button
                        onClick={() => handleStatusChange(ticket.id, 'in-progress')}
                        variant="secondary"
                        className="text-sm"
                      >
                        Mark In Progress
                      </Button>
                    )}
                    <Button
                      onClick={() => setSelectedTicket(ticket)}
                      variant="success"
                      className="text-sm"
                    >
                      <Send className="w-4 h-4" />
                      Respond & Resolve
                    </Button>
                  </div>
                )}

                {ticket.response && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                  >
                    <p className="text-sm font-medium text-green-900 dark:text-green-400 mb-2">
                      Your Response:
                    </p>
                    <p className="text-sm text-green-800 dark:text-green-300">
                      {ticket.response}
                    </p>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Response Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && setSelectedTicket(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Respond to Ticket
                </h3>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {selectedTicket.title}
              </p>

              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows="4"
                placeholder="Type your response here..."
                className="mb-4"
              />
              
              <div className="flex gap-3">
                <Button
                  onClick={handleResponse}
                  loading={responding}
                  variant="success"
                  className="flex-1"
                >
                  Send & Mark Resolved
                </Button>
                <Button
                  onClick={() => {
                    setSelectedTicket(null);
                    setResponse('');
                  }}
                  variant="secondary"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function GuidesTab({ guides, installerId }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'maintenance',
    content: ''
  });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setSubmitting(true);
      await addDoc(collection(db, 'guides'), {
        ...formData,
        installerId,
        createdAt: new Date().toISOString()
      });
      setFormData({ title: '', category: 'maintenance', content: '' });
      setShowForm(false);
      toast.success('Guide created!', {
        description: 'Your clients can now see this guide'
      });
    } catch (error) {
      console.error('Error creating guide:', error);
      toast.error('Failed to create guide');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Troubleshooting Guides ({guides.length})
        </h3>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          New Guide
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
            <Card className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900/50">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g., How to Reset Your Inverter"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-colors"
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="troubleshooting">Troubleshooting</option>
                    <option value="safety">Safety</option>
                    <option value="optimization">Optimization</option>
                  </select>
                </div>

                <Textarea
                  label="Content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows="6"
                  placeholder="Write step-by-step instructions..."
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
                    className="w-full sm:w-auto"
                  >
                    Create Guide
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {guides.length === 0 ? (
        <EmptyState
          title="No guides yet"
          description="Create your first guide to help your clients troubleshoot issues!"
          action={
            !showForm && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-5 h-5" />
                Create Your First Guide
              </Button>
            )
          }
        />
      ) : (
        <div className="grid gap-4">
          {guides.map((guide, index) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 sm:p-5 hover:shadow-lg transition-all hover:border-orange-300 dark:hover:border-orange-700">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    {guide.title}
                  </h4>
                  <Badge className="self-start capitalize">
                    {guide.category}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {guide.content}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}