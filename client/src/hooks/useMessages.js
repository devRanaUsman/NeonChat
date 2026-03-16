import { useState, useCallback } from 'react';
import api from '../utils/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages, addMessage } from '../store/chatSlice';

export const useMessages = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const messages = useSelector(state => state.chat.messages);

  const fetchMessages = useCallback(async (conversationId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/messages/${conversationId}`);
      dispatch(setMessages(data.data));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const sendMessage = async (messageData) => {
    try {
      const { data } = await api.post('/messages', messageData);
      // Let socket broadcast it, or instantly push
      // dispatch(addMessage(data.data));
      return data.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      const { data } = await api.delete(`/messages/${messageId}`);
      return data.data;
    } catch (err) {
      throw err;
    }
  };

  return { loading, error, messages, fetchMessages, sendMessage, deleteMessage };
};
