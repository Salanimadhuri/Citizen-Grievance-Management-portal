import { useEffect, useState, useRef } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { communicationAPI, complaintAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const OfficerCommunication = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { fetchComplaints(); }, []);

  useEffect(() => {
    if (selectedComplaint) fetchMessages(selectedComplaint.id || selectedComplaint._id);
  }, [selectedComplaint]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await complaintAPI.getOfficerComplaints();
      const data = response.data?.data || response.data || [];
      setComplaints(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (complaintId) => {
    try {
      const response = await communicationAPI.getMessages(complaintId);
      const data = response.data?.data || response.data || [];
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedComplaint) return;
    const citizen = selectedComplaint.citizenId || selectedComplaint.userId;
    const receiverId = citizen?.id || citizen?.id || citizen;
    if (!receiverId) return;

    try {
      setSending(true);
      await communicationAPI.sendMessage({
        complaintId: selectedComplaint.id || selectedComplaint._id,
        receiverId,
        message: newMessage,
      });
      setNewMessage('');
      fetchMessages(selectedComplaint.id || selectedComplaint._id);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Communication</h1>
        <p className="text-gray-600">Message citizens about their complaints</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assigned Complaints List */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Assigned Complaints</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {complaints.length > 0 ? complaints.map((complaint) => {
              const id = complaint.id || complaint._id;
              const citizen = complaint.citizenId || complaint.userId;
              return (
                <button
                  key={id}
                  onClick={() => setSelectedComplaint(complaint)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    (selectedComplaint?.id || selectedComplaint?._id) === id
                      ? 'bg-primary-100 border border-primary-300'
                      : 'hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <p className="font-medium text-gray-900 truncate">{complaint.title}</p>
                  <p className="text-sm text-gray-600">Citizen: {citizen?.name || 'N/A'}</p>
                  <p className="text-xs text-gray-500 mt-1">{complaint.status}</p>
                </button>
              );
            }) : (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle size={32} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No assigned complaints</p>
              </div>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="lg:col-span-2 card flex flex-col" style={{ minHeight: '400px' }}>
          {selectedComplaint ? (
            <>
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="font-semibold text-gray-900">{selectedComplaint.title}</h3>
                <p className="text-sm text-gray-600">
                  Citizen: {(selectedComplaint.citizenId || selectedComplaint.userId)?.name || 'N/A'}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto mb-4 space-y-3 max-h-80">
                {messages.length > 0 ? messages.map((msg) => {
                  const senderId = msg.senderId?.id || msg.senderId?._id || msg.senderId;
                  const isMe = senderId === user?.id;
                  return (
                    <div key={msg.id || msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-4 py-2 rounded-lg ${isMe ? 'bg-primary-100 text-gray-900' : 'bg-gray-100 text-gray-900'}`}>
                        <p className="text-sm font-medium">{msg.senderId?.name || 'Unknown'}</p>
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No messages yet. Start the conversation!</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="input-field flex-1"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sending || !newMessage.trim()}
                  className="btn-primary flex items-center gap-2"
                >
                  <Send size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <MessageCircle size={48} className="mx-auto mb-3 text-gray-300" />
                <p>Select a complaint to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfficerCommunication;
