import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setConversations, setActiveConversation } from '../store/chatSlice';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import { useMessages } from '../hooks/useMessages';
import { useNotifications } from '../hooks/useNotifications';
import api from '../utils/axiosInstance';

import Sidebar from '../components/Sidebar/Sidebar';
import MobileSidebar from '../components/MobileSidebar/MobileSidebar';
import ChatHeader from '../components/Chat/ChatHeader';
import MessageList from '../components/Chat/MessageList';
import MessageInput from '../components/Chat/MessageInput';
import VideoCallModal from '../components/VideoCall/VideoCallModal';
import NewChatModal from '../components/Sidebar/NewChatModal';
import NotificationToast from '../components/Notifications/NotificationToast';

const ChatPage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const socket = useSocket();
  const { fetchMessages, sendMessage, deleteMessage, messages } = useMessages();
  
  const conversations = useSelector(state => state.chat.conversations);
  const activeConversation = useSelector(state => state.chat.activeConversation);
  const typingUsers = useSelector(state => state.chat.typingUsers);
  
  const { notifications, unreadCount, toastNotification, markAsRead, markAllAsRead, clearToast } = useNotifications();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [newChatModalOpen, setNewChatModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const { data } = await api.get('/conversations');
        dispatch(setConversations(data.data));
        if (data.data.length > 0 && !activeConversation) {
          dispatch(setActiveConversation(data.data[0]));
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadConversations();
  }, [dispatch]);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation._id);
      if (socket) {
        socket.emit('join_conversation', activeConversation._id);
      }
    }
  }, [activeConversation?._id, socket, fetchMessages]);

  const handleSendMessage = async (content, type = 'text', attachment = null) => {
    if (!activeConversation) return;

    try {
      const newMsg = await sendMessage({
        conversationId: activeConversation._id,
        content,
        type,
        attachment
      });

      if (socket) {
        socket.emit('message:send', newMsg);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      if (activeConversation) {
        await deleteMessage(messageId);
        if (socket) {
          socket.emit('message:delete', { messageId, conversationId: activeConversation._id });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTypingStart = () => {
    if (socket && activeConversation) {
      socket.emit('typing:start', { conversationId: activeConversation._id, userId: user._id });
    }
  };

  const handleTypingStop = () => {
    if (socket && activeConversation) {
      socket.emit('typing:stop', { conversationId: activeConversation._id, userId: user._id });
    }
  };

  const filteredConversations = conversations.filter(c => {
    const contact = c.participants.find(p => p._id !== user._id) || c.participants[0];
    return contact?.displayName?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const activeContact = activeConversation?.participants?.find(p => p._id !== user._id);
  const isContactTyping = activeConversation && typingUsers[activeConversation._id]?.length > 0 && typingUsers[activeConversation._id].includes(activeContact?._id);

  return (
    <div className="h-full bg-[#0A0F1E]">
      <div className="flex h-full app-wrapper">
        {/* Left Sidebar Desktop */}
        <Sidebar 
          conversations={filteredConversations}
          activeConversation={activeConversation}
          onSelect={c => dispatch(setActiveConversation(c))}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onNewChat={() => setNewChatModalOpen(true)}
        />

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col h-full min-w-0">
          {activeConversation ? (
            <>
              <ChatHeader 
                conversation={activeConversation}
                user={user}
                onMobileMenu={() => setMobileMenuOpen(true)}
                onVideoCall={() => setVideoModalOpen(true)}
                notifications={notifications}
                unreadCount={unreadCount}
                markAsRead={markAsRead}
                markAllAsRead={markAllAsRead}
                onNotificationClick={(notif) => {
                  const conv = conversations.find(c => c._id === notif.conversationId);
                  if (conv) dispatch(setActiveConversation(conv));
                }}
              />
              <MessageList 
                messages={messages} 
                user={user} 
                activeConversation={activeConversation}
                isTyping={isContactTyping}
                onDeleteMessage={handleDeleteMessage}
              />
              <MessageInput 
                onSendMessage={handleSendMessage}
                onTypingStart={handleTypingStart}
                onTypingStop={handleTypingStop}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center flex-col relative">
               {/* Mobile header area when no chat selected */}
               <div className="md:hidden w-full p-4 border-b border-[#00C2FF]/20 flex justify-between items-center absolute top-0 left-0 bg-[#111827]">
                  <h1 className="text-[#F0F4F8] font-semibold">NeonChat</h1>
                  <button onClick={() => setMobileMenuOpen(true)} className="p-2">
                    <svg className="w-6 h-6 text-[#F0F4F8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                  </button>
               </div>
               <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00C2FF] to-[#00FFD1] blur-[80px] opacity-20 absolute pointer-events-none"></div>
               <p className="text-[#F0F4F8]/50 mt-4 relative z-10">Select a conversation to start chatting</p>
            </div>
          )}
        </main>
      </div>

      <VideoCallModal 
        isOpen={videoModalOpen} 
        onClose={() => setVideoModalOpen(false)}
        contact={activeContact}
        user={user}
      />

      <MobileSidebar 
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        conversations={filteredConversations}
        activeConversation={activeConversation}
        onSelect={c => dispatch(setActiveConversation(c))}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onNewChat={() => setNewChatModalOpen(true)}
      />

      <NewChatModal
        isOpen={newChatModalOpen}
        onClose={() => setNewChatModalOpen(false)}
        onStartChat={(conv) => {
          dispatch({ type: 'chat/addConversation', payload: conv });
          dispatch(setActiveConversation(conv));
        }}
      />
      
      <NotificationToast 
        notification={toastNotification} 
        onClose={clearToast} 
        onClick={(notif) => {
          const conv = conversations.find(c => c._id === notif.conversationId);
          if (conv) dispatch(setActiveConversation(conv));
          if (!notif.isRead) markAsRead(notif._id);
          clearToast();
        }}
      />
    </div>
  );
};

export default ChatPage;
