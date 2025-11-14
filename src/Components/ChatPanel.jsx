// src/Components/ChatPanel.jsx
import { useState, useEffect, useRef } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from './ToastProvider';
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { Button, Input, Badge } from './UI';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function ChatPanel({ recipientId, recipientName, recipientRole }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { currentUser, userRole } = useAuth();

  // Generate chat room ID (consistent for both users)
  const chatRoomId = [currentUser.uid, recipientId].sort().join('_');

  useEffect(() => {
    if (!recipientId) return;

    // Subscribe to messages
    const messagesQuery = query(
      collection(db, 'chats', chatRoomId, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setMessages(msgs);

      // Count unread messages
      if (!isOpen) {
        const unread = msgs.filter(
          msg => !msg.read && msg.senderId !== currentUser.uid
        ).length;
        setUnreadCount(unread);
      }

      // Mark messages as read when chat is open
      if (isOpen) {
        msgs.forEach(msg => {
          if (!msg.read && msg.senderId !== currentUser.uid) {
            updateDoc(doc(db, 'chats', chatRoomId, 'messages', msg.id), {
              read: true,
            }).catch(err => console.error('Error marking as read:', err));
          }
        });
        setUnreadCount(0);
      }

      // Auto scroll to bottom
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [recipientId, chatRoomId, currentUser.uid, isOpen]);

  // Subscribe to typing indicator
  useEffect(() => {
    if (!recipientId || !isOpen) return;

    const typingDocRef = doc(db, 'chats', chatRoomId, 'typing', recipientId);
    
    const unsubscribe = onSnapshot(typingDocRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const isRecentlyTyping = data.isTyping && 
          data.lastTypingTime?.toMillis() > Date.now() - 3000;
        setIsTyping(isRecentlyTyping);
      } else {
        setIsTyping(false);
      }
    });

    return () => unsubscribe();
  }, [recipientId, chatRoomId, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTyping = () => {
    // Update typing indicator
    const typingDocRef = doc(db, 'chats', chatRoomId, 'typing', currentUser.uid);
    updateDoc(typingDocRef, {
      isTyping: true,
      lastTypingTime: serverTimestamp(),
    }).catch(() => {
      // Create if doesn't exist
      addDoc(collection(db, 'chats', chatRoomId, 'typing'), {
        userId: currentUser.uid,
        isTyping: true,
        lastTypingTime: serverTimestamp(),
      });
    });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      updateDoc(typingDocRef, {
        isTyping: false,
      }).catch(() => {});
    }, 2000);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    try {
      setLoading(true);
      
      await addDoc(collection(db, 'chats', chatRoomId, 'messages'), {
        text: newMessage,
        senderId: currentUser.uid,
        senderRole: userRole,
        receiverId: recipientId,
        read: false,
        createdAt: serverTimestamp(),
      });

      setNewMessage('');
      
      // Stop typing indicator
      const typingDocRef = doc(db, 'chats', chatRoomId, 'typing', currentUser.uid);
      await updateDoc(typingDocRef, { isTyping: false }).catch(() => {});

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  return (
    <>
      {/* Chat Button - Fixed position */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 p-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-full shadow-2xl transition-colors"
      >
        <MessageSquare className="w-6 h-6" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-6 right-24 z-50 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-700 dark:to-cyan-700 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{recipientName}</h3>
                <p className="text-xs opacity-90 capitalize">{recipientRole}</p>
              </div>
              <button
                onClick={toggleChat}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((msg, index) => {
                    const isOwn = msg.senderId === currentUser.uid;
                    const showDate = index === 0 || 
                      new Date(messages[index - 1].createdAt?.toDate()).toDateString() !== 
                      new Date(msg.createdAt?.toDate()).toDateString();

                    return (
                      <div key={msg.id}>
                        {showDate && (
                          <div className="flex justify-center my-4">
                            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full">
                              {new Date(msg.createdAt?.toDate()).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={clsx(
                            'flex',
                            isOwn ? 'justify-end' : 'justify-start'
                          )}
                        >
                          <div
                            className={clsx(
                              'max-w-[75%] rounded-2xl px-4 py-2 shadow-sm',
                              isOwn
                                ? 'bg-blue-600 text-white rounded-br-sm'
                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm'
                            )}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {msg.text}
                            </p>
                            <p
                              className={clsx(
                                'text-xs mt-1',
                                isOwn
                                  ? 'text-blue-100'
                                  : 'text-gray-500 dark:text-gray-400'
                              )}
                            >
                              {msg.createdAt?.toDate().toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl rounded-bl-sm px-4 py-2 shadow-sm">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || loading}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[50px]"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}