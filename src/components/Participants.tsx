import React, { useState } from 'react';
import type { Screen } from '../App';
import { MessageCircle, Send, X, Mail, Clock, CheckCircle, FileText } from 'lucide-react';

interface ParticipantsProps {
  navigate: (screen: Screen) => void;
  event?: any;
  profileEmail?: string;
  emailSent?: boolean;
}

const mockParticipants = [
  {
    name: 'Arjun Patel',
    college: 'Pandurang College',
    phone: '9876543210',
    email: 'arjun@example.com'
  },
  {
    name: 'Priya Sharma',
    college: 'Sindhu College',
    phone: '9876543211',
    email: 'priya@example.com'
  }
];

export function Participants({ navigate, event, profileEmail, emailSent }: ParticipantsProps) {
  const eventName = event?.eventName || 'Event';
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [message, setMessage] = useState(`Hello! Important update regarding ${eventName}. `);
  const [emailSubject, setEmailSubject] = useState(`${eventName} by ${event?.college || 'College'}`);
  const [emailMessage, setEmailMessage] = useState(`Dear Participant,\n\nI hope this email finds you well.\n\nI am writing to share an important update regarding ${eventName}.\n\n\n\nBest regards,\nEvent Organizer`);
  
  // Get participant count
  const participantCount = mockParticipants.length;
  
  // Check if registration deadline has passed
  const isDeadlinePassed = () => {
    if (!event?.deadline) return false;
    const now = new Date();
    const deadlineStr = event.deadline.replace(/at|pm|am/g, '').trim();
    const deadlineDate = new Date(deadlineStr);
    return now > deadlineDate;
  };
  
  // Manual email sending function - generates Excel format
  const sendEmailManually = () => {
    if (!profileEmail) {
      alert('Please set your email in Profile first!');
      return;
    }
    
    // Generate Excel CSV format data
    const csvHeaders = ['S.No', 'Name', 'College', 'Phone', 'Email'];
    const csvData = mockParticipants.map((participant, index) => [
      index + 1,
      participant.name,
      participant.college,
      participant.phone,
      participant.email
    ]);
    
    // Convert to CSV format
    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${eventName}_Participants_List.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    // Create email with instructions
    const emailSubject = `${eventName} - Participant List (Excel Format)`;
    const emailBody = `Dear Organizer,

Please find the participant list for "${eventName}" attached as an Excel CSV file.

Event Details:
- Event Name: ${eventName}
- College: ${event?.college || 'N/A'}
- Total Participants: ${mockParticipants.length}

The file "${eventName}_Participants_List.csv" has been downloaded to your device. Please attach this file to share the complete participant list in Excel format.

File Contents:
- Serial Number
- Participant Name
- College Name
- Phone Number
- Email Address

Best regards,
Zhevents Event Management System`;
    
    // Open email client with the participant list email
    const mailtoUrl = `mailto:${profileEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoUrl, '_blank');
    
    // Show success message
    alert(`📧 Excel file "${eventName}_Participants_List.csv" has been downloaded!\n\nEmail client opened to send to ${profileEmail}. Please attach the downloaded file to complete sending the participant list in Excel format.`);
  };

  const sendWhatsAppMessages = () => {
    const encodedMessage = encodeURIComponent(message);
    
    mockParticipants.forEach((participant, index) => {
      // Clean phone number (remove any non-digits except +)
      const cleanPhone = participant.phone.replace(/[^\d+]/g, '');
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
      
      // Open each WhatsApp chat in a new tab with a small delay
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, index * 500); // 500ms delay between each message
    });
    
    setShowMessageModal(false);
    
    // Show success message
    alert(`Message will be sent to all ${mockParticipants.length} participants. WhatsApp chats will open automatically with your message pre-filled. Just click 'Send' in each chat!`);
  };

  const sendEmailToAllParticipants = () => {
    if (!profileEmail) {
      alert('Please set your email in Profile first!');
      return;
    }
    
    // Get all participant emails for BCC
    const participantEmails = mockParticipants.map(p => p.email).join(';');
    
    // Get organizing committee emails for CC (excluding the first member which is the sender)
    let ccEmails = '';
    if (event?.organizingCommittee && event.organizingCommittee.length > 1) {
      const organizingCommitteeEmails = event.organizingCommittee
        .slice(1) // Skip first member (sender)
        .filter(member => member.email && member.email.trim() !== '')
        .map(member => member.email);
      ccEmails = organizingCommitteeEmails.join(';');
    }
    
    // Create mailto URL with organizer as TO, organizing committee in CC, and participants in BCC for privacy
    let mailtoUrl = `mailto:${profileEmail}?bcc=${participantEmails}&subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailMessage)}`;
    
    // Add CC if there are organizing committee members
    if (ccEmails) {
      mailtoUrl += `&cc=${ccEmails}`;
    }
    
    // Open email client
    window.open(mailtoUrl, '_blank');
    
    setShowEmailModal(false);
    
    // Show success message
    const organizingCommitteeCount = event?.organizingCommittee ? event.organizingCommittee.length - 1 : 0;
    const ccMessage = organizingCommitteeCount > 0 ? ` with ${organizingCommitteeCount} organizing committee members in CC` : '';
    alert(`Email client opened with your email (${profileEmail}) as sender${ccMessage} and all ${mockParticipants.length} participants in BCC for privacy. Participants won't see each other's email addresses.`);
  };

  const handleSendToAll = () => {
    setShowMessageModal(true);
  };

  const handleEmailToAll = () => {
    setShowEmailModal(true);
  };
  
  return (
    <div className="w-full min-h-screen bg-white p-4">
      <h1 className="text-base font-bold text-black mb-4">{participantCount} Participants — {eventName}</h1>
      
      {/* Email Status Banner */}
      {emailSent && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle size={16} className="text-green-600" />
          <span className="text-sm text-green-800">
            Participant list automatically sent to {profileEmail} after registration deadline
          </span>
        </div>
      )}
      
      {isDeadlinePassed() && !emailSent && profileEmail && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
          <Clock size={16} className="text-yellow-600" />
          <span className="text-sm text-yellow-800">
            Registration deadline passed. Email will be sent shortly to {profileEmail}
          </span>
        </div>
      )}

      <div className="mb-4">
        <div className="mb-3">
          <div className="text-sm text-black">Name • College Name • Phone No. • Email id</div>
        </div>
        
        <div className="space-y-2 mb-4">
          {mockParticipants.map((participant, index) => (
            <div key={index} className="w-full min-h-14 bg-transparent border border-gray-300 rounded px-3 py-3 text-sm text-black">
              <div className="flex">
                <span className="font-bold mr-2">{index + 1}.</span>
                <div className="flex-1 leading-relaxed">
                  <span className="font-bold">{participant.name}</span> • {participant.college} • {participant.phone} • {participant.email}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons below participant list */}
        <div className="flex flex-col gap-3">
          {/* WhatsApp and Email buttons in one row */}
          <div className="flex gap-2">
            <button
              onClick={handleSendToAll}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-black hover:bg-gray-200 transition-colors"
            >
              <MessageCircle size={14} />
              WhatsApp - Participants
            </button>
            <button
              onClick={handleEmailToAll}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-black hover:bg-gray-200 transition-colors"
            >
              <Mail size={14} />
              Email - All Participants
            </button>
          </div>
          
          {/* Email Participant List button below */}
          <button
            onClick={sendEmailManually}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-transparent border border-gray-300 rounded-lg text-sm font-medium text-black hover:bg-gray-50 transition-colors"
          >
            <FileText size={14} />
            Email Participant List to Organiser
          </button>
        </div>
      </div>

      {/* WhatsApp Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-black">Message All Participants</h3>
              <button
                onClick={() => setShowMessageModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3 bg-blue-50 p-2 rounded">
                📱 This will automatically open {mockParticipants.length} WhatsApp chats with your message pre-filled. Just click 'Send' in each chat!
              </p>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your message:
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-24 p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Type your message here..."
              />
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowMessageModal(false)}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={sendWhatsAppMessages}
                disabled={!message.trim()}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={14} />
                Open All Chats
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email All Participants Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-black">Email All Participants</h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3 bg-blue-50 p-2 rounded">
                📧 This will open your email client with all {mockParticipants.length} participants in BCC (for privacy)
                {event?.organizingCommittee && event.organizingCommittee.length > 1 && `, organizing committee in CC`}. From/To: {profileEmail || 'Please set email in Profile'}
              </p>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject:
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Email subject..."
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message:
                </label>
                <textarea
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Type your email message here..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={sendEmailToAllParticipants}
                disabled={!emailSubject.trim() || !emailMessage.trim() || !profileEmail}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Mail size={14} />
                Open Email Client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => navigate('my_org')}
        className="mt-6 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-semibold text-black hover:bg-gray-200 transition-colors"
      >
        ← Back to My Events
      </button>
    </div>
  );
}