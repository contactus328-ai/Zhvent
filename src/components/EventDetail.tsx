import React from 'react';
import type { Screen } from '../App';

interface Event {
  id: string;
  college: string;
  eventName: string;
  location: string;
  dates: string;
  type: string;
  competition: string;
  address?: string;
  contact?: string;
  entryFees?: string;
  deadline?: string;
  otse?: string;
  events?: Array<{
    name: string;
    type: string;
    competition: string;
    groupType: string;
    date: string;
    time: string;
    participants: string;
    rules: string[];
    contact?: string;
    entryFees?: string;
    deadline?: string;
    otse?: string;
  }>;
}

interface EventDetailProps {
  navigate: (screen: Screen) => void;
  event: Event;
  onRegister: (eventId: string, subEventIndex?: number) => void;
  registeredEvents: string[];
}

export function EventDetail({ navigate, event, onRegister, registeredEvents }: EventDetailProps) {
  // Handle Results button click
  const handleResultsClick = () => {
    alert('Results will be displayed, only if event officials decide to release it here, on event day.');
  };

  // Handle Live button click
  const handleLiveClick = () => {
    alert('Live feed will appear, if officials go live here, on event day');
  };
  // Format the date range for top right display
  const formatDateRange = (dates: string) => {
    return dates.replace(/(\\d+)(?:st|nd|rd|th)?\\s+to\\s+(\\d+)(?:st|nd|rd|th)?/, '$1–$2');
  };

  // Format participants display
  const formatParticipants = (participants: string) => {
    // Check if it's a range like "6–8" or "1"
    if (participants.includes('–')) {
      const [min, max] = participants.split('–');
      if (min.trim() === max.trim()) {
        return min.trim();
      }
    }
    return participants;
  };

  // Format time by adding space before am/pm
  const formatTime = (time: string) => {
    if (!time) return time;
    // Add space before am/pm if not already present
    return time.replace(/(\\d+)(am|pm)/gi, '$1 $2');
  };

  // Format deadline text by adding space before am/pm
  const formatDeadline = (deadline: string) => {
    if (!deadline || deadline === 'TBD') return deadline;
    // Add space before am/pm in deadline text
    return deadline.replace(/(\\d+)(am|pm)/gi, '$1 $2');
  };

  const isSubEventRegistered = (subEventIndex: number) => {
    const registrationKey = `${event.id}:${subEventIndex}`;
    return registeredEvents.includes(registrationKey);
  };

  const handleSubEventRegister = (subEventIndex: number) => {
    if (!isSubEventRegistered(subEventIndex)) {
      onRegister(event.id, subEventIndex);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white p-4">
      {/* Header section */}
      <div className="mb-6">
        {/* Centered college, presents, event name */}
        <div className="text-center">
          <p className="text-sm text-black">{event.college}</p>
          <p className="text-sm text-black">Presents</p>
          <h1 className="text-xl font-extrabold text-black">{event.eventName}</h1>
          
          {/* Address directly below event name with no space */}
          {event.address && (
            <p className="text-sm text-black">{event.address}</p>
          )}
          
          {/* Competition type with separator and date */}
          <p className="text-sm text-black">{event.competition}<span className="font-bold">.</span> {formatDateRange(event.dates)}</p>
        </div>
      </div>

      {/* Event Details - No "Results" heading */}
      {event.events && event.events.length > 0 && (
        <div className="mb-6">
          {event.events.map((eventItem, index) => (
            <div key={index}>
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm text-black">
                  <strong>{eventItem.name}</strong>
                  <br />
                  Event Type: {eventItem.type}
                  <br />
                  Competition: {eventItem.competition}
                  <br />
                  Group/Single: {eventItem.groupType}
                  <br />
                  Date: {eventItem.date}
                  <br />
                  Time: {formatTime(eventItem.time)}
                  <br />
                  Participants: {formatParticipants(eventItem.participants)}
                </div>
                
                {/* Live button on extreme right */}
                <button 
                  onClick={handleLiveClick}
                  className="px-2 py-1 bg-gray-200 border border-gray-400 rounded text-sm text-black ml-4 shrink-0 hover:bg-gray-300 transition-colors"
                >
                  Live
                </button>
              </div>

              <div className="text-sm text-black mb-6">
                {eventItem.rules && eventItem.rules.length > 0 ? (
                  <>
                    <strong>Rules:</strong>
                    <ol className="list-decimal list-inside">
                      {eventItem.rules.map((rule, ruleIndex) => (
                        <li key={ruleIndex}>{rule}</li>
                      ))}
                    </ol>
                  </>
                ) : (
                  <div><strong>Rules:</strong> No rules specified.</div>
                )}
              </div>

              {/* Event Information - Below Rules for each sub-event */}
              <div className="text-sm text-black mb-6">
                Contact Person: {(() => {
                  const contact = event.contact || eventItem.contact || 'TBD';
                  if (contact === 'TBD') return 'TBD';
                  // Extract just the name part from contact string like "Akhat • 9834672322"
                  const namePart = contact.split('•')[0].trim();
                  return namePart || contact;
                })()}
                <br />
                Contact No.: {(() => {
                  const contact = event.contact || eventItem.contact || 'TBD';
                  if (contact === 'TBD') return 'TBD';
                  // Extract phone number from contact string like "Akhat • 9834672322"
                  const phoneMatch = contact.match(/\\d{10}/);
                  return phoneMatch ? phoneMatch[0] : 'TBD';
                })()}
                <br />
                Entry Fees: {event.entryFees || eventItem.entryFees || 'TBD'}
                <br />
                Registration Deadline: {formatDeadline(event.deadline || eventItem.deadline || 'TBD')}
                <br />
                OTSE: {event.otse || eventItem.otse || 'TBD'}
              </div>

              {/* Action Buttons for this specific sub-event */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => handleSubEventRegister(index)}
                  disabled={isSubEventRegistered(index)}
                  className={`flex-1 h-10 ${isSubEventRegistered(index) ? 'bg-gray-200 border border-gray-400 text-black' : 'bg-gray-200 border border-gray-400 text-black hover:bg-gray-300'} rounded-lg font-semibold text-sm transition-colors flex justify-center items-center`}
                >
                  {isSubEventRegistered(index) ? 'Registered ✓' : 'Register'}
                </button>
                <button
                  onClick={handleResultsClick}
                  className="flex-1 h-10 bg-gray-200 border border-gray-400 rounded-lg font-semibold text-sm text-black hover:bg-gray-300 transition-colors flex justify-center items-center"
                >
                  Results
                </button>
              </div>

              {/* Disclaimer after every sub-event */}
              <div className="mb-6">
                <p className="text-xs text-black mb-4">
                  Event details are subject to change. Please check here periodically for updates.
                </p>
                
                {/* Separator line after disclaimer */}
                <div className="border-t border-gray-300 pt-4">
                </div>
              </div>
            </div>
          ))}
        </div>
      )}




      {/* Back Button */}
      <button
        onClick={() => navigate('home')}
        className="mt-6 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-semibold text-black hover:bg-gray-200 transition-colors"
      >
        ← Back to Home
      </button>
    </div>
  );
}