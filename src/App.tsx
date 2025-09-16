import React, { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { EventDetail } from './components/EventDetail';
import { Register } from './components/Register';
import { Results } from './components/Results';
import { OrgDashboard } from './components/OrgDashboard';
import { AddEvent } from './components/AddEvent';
import { MyOrganisedEvents } from './components/MyOrganisedEvents';
import { Participants } from './components/Participants';
import { MyParticipatingEvents } from './components/MyParticipatingEvents';
import { Profile } from './components/Profile';

export type Screen = 
  | 'home'
  | 'event_detail'
  | 'register'
  | 'results'
  | 'org_dashboard'
  | 'add_event'
  | 'my_org'
  | 'participants'
  | 'my_part'
  | 'profile';

// Storage keys
const STORAGE_KEYS = {
  USER_EVENTS: 'zhevents_user_events',
  PROFILE_EMAIL: 'zhevents_profile_email',
  SENT_EMAILS: 'zhevents_sent_emails',
  REGISTERED_EVENTS: 'zhevents_registered_sub_events'
} as const;

// Safe localStorage operations (moved outside component to avoid JSX parsing issues)
function saveToLocalStorage(key: string, value: any): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
    return false;
  }
}

function loadFromLocalStorage(key: string, defaultValue: any): any {
  try {
    const saved = localStorage.getItem(key);
    if (saved === null) return defaultValue;
    
    const parsed = JSON.parse(saved);
    return parsed;
  } catch (error) {
    // For backward compatibility with raw strings
    const saved = localStorage.getItem(key);
    if (saved && saved !== 'undefined' && saved !== 'null' && typeof defaultValue === 'string') {
      return saved;
    }
    console.warn(`Error loading from localStorage (${key}):`, error);
    return defaultValue;
  }
}

const initialEvents = [
  {
    id: 'pandu',
    college: 'Pandurang College',
    eventName: 'Pandu Fest',
    location: 'Mumbai, Vile Parle',
    dates: '12th to 13th Dec 25',
    type: 'Mixed',
    competition: 'Intra‑Collegiate',
    color: 'bg-green-200',
    createdAt: 1704063600000,
    address: '89th Road, Near Aar Centre, Vile Parle, Mumbai 400054',
    contact: 'Akhat • 9834672322',
    entryFees: 'Free',
    deadline: '11 Dec 2025 at 10:00 pm (or until slots are available)',
    otse: 'Yes (Subject to availability)',
    events: [{
      name: 'Event 1',
      type: 'Dancing',
      competition: 'Inter‑Collegiate',
      groupType: 'Group',
      date: '12 Dec 2025',
      time: '10:00 am',
      participants: '6–8',
      rules: ['Rule 1', 'Rule 2', 'Rule 3', 'Rule 4', 'Rule 5'],
      contact: 'Akhat • 9834672322',
      entryFees: 'Free',
      deadline: '11 Dec 2025 at 10:00 pm (or until slots are available)',
      otse: 'Yes (Subject to availability)'
    }, {
      name: 'Event 2',
      type: 'Singing',
      competition: 'Inter‑Collegiate',
      groupType: 'Solo',
      date: '13 Dec 2025',
      time: '2:00 pm',
      participants: '1',
      rules: ['Rule A', 'Rule B', 'Rule C'],
      contact: 'Akhat • 9834672322',
      entryFees: 'Free',
      deadline: '11 Dec 2025 at 10:00 pm (or until slots are available)',
      otse: 'Yes (Subject to availability)'
    }]
  },
  {
    id: 'kaiso',
    college: 'Sindhu College',
    eventName: 'Kaiso',
    location: 'Mumbai, Mira Road',
    dates: '15th to 17th Dec 25',
    type: 'Mixed',
    competition: 'Inter‑Collegiate',
    color: 'bg-yellow-200',
    createdAt: 1704150000000
  },
  {
    id: 'maker',
    college: 'ABV College',
    eventName: 'Maker',
    location: 'Mumbai, Ghatkopar',
    dates: '20th to 22nd Dec 25',
    type: 'Mixed',
    competition: 'Inter‑Collegiate',
    color: 'bg-orange-300',
    createdAt: 1704236400000
  },
  {
    id: 'aitran',
    college: 'Newbei College',
    eventName: 'Aitran',
    location: 'Mumbai, Charni Road',
    dates: '10th to 11th Dec 25',
    type: 'Singing',
    competition: 'Intra‑Collegiate',
    color: 'bg-amber-200',
    createdAt: 1704322800000
  },
  {
    id: 'saman',
    college: 'Sanghi College',
    eventName: 'Saman',
    location: 'Mumbai, Jogeshwari',
    dates: '8th to 9th Dec 25',
    type: 'Sports',
    competition: 'Intra‑Collegiate',
    color: 'bg-green-300',
    createdAt: 1704409200000
  },
  {
    id: 'sund',
    college: 'Sund College',
    eventName: 'Sund Fest',
    location: 'Mumbai',
    dates: '25th to 28th Dec 25',
    type: 'Dramatics',
    competition: 'Inter‑Collegiate',
    color: 'bg-purple-300',
    createdAt: 1704495600000
  }
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedEvent, setSelectedEvent] = useState<string>('pandu');
  const [eventsState, setEventsState] = useState(initialEvents);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [isNewFromDashboard, setIsNewFromDashboard] = useState<boolean>(false);
  const [profileEmail, setProfileEmail] = useState<string>('');
  const [sentEmails, setSentEmails] = useState<string[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize data from localStorage (run once on mount)
  useEffect(() => {
    // Load user events
    const userEvents = loadFromLocalStorage(STORAGE_KEYS.USER_EVENTS, []);
    if (Array.isArray(userEvents) && userEvents.length > 0) {
      const allEvents = [...initialEvents];
      userEvents.forEach((userEvent: any) => {
        if (!allEvents.some(event => event.id === userEvent.id)) {
          allEvents.push(userEvent);
        }
      });
      setEventsState(allEvents);
    }

    // Load other data with type checking
    const email = loadFromLocalStorage(STORAGE_KEYS.PROFILE_EMAIL, '');
    if (typeof email === 'string') {
      setProfileEmail(email);
    }

    const emails = loadFromLocalStorage(STORAGE_KEYS.SENT_EMAILS, []);
    if (Array.isArray(emails)) {
      setSentEmails(emails);
    }

    const registered = loadFromLocalStorage(STORAGE_KEYS.REGISTERED_EVENTS, []);
    if (Array.isArray(registered)) {
      setRegisteredEvents(registered);
    }

    // Mark as initialized after loading
    setIsInitialized(true);
  }, []); // Empty dependency array - run only on mount

  // Save user events to localStorage (only after initialization)
  useEffect(() => {
    if (!isInitialized) return;
    const userEvents = eventsState.filter(event => event.createdByUser);
    saveToLocalStorage(STORAGE_KEYS.USER_EVENTS, userEvents);
  }, [eventsState, isInitialized]);

  // Save profile email to localStorage (only after initialization)
  useEffect(() => {
    if (!isInitialized || !profileEmail) return;
    saveToLocalStorage(STORAGE_KEYS.PROFILE_EMAIL, profileEmail);
  }, [profileEmail, isInitialized]);

  // Save sent emails to localStorage (only after initialization)
  useEffect(() => {
    if (!isInitialized) return;
    saveToLocalStorage(STORAGE_KEYS.SENT_EMAILS, sentEmails);
  }, [sentEmails, isInitialized]);

  // Save registered events to localStorage (only after initialization)
  useEffect(() => {
    if (!isInitialized) return;
    saveToLocalStorage(STORAGE_KEYS.REGISTERED_EVENTS, registeredEvents);
  }, [registeredEvents, isInitialized]);

  // Auto-email checking (simplified to prevent infinite loops)
  useEffect(() => {
    if (!profileEmail || !isInitialized) return;

    // Simple check once per minute without state updates during the effect
    const intervalId = setInterval(() => {
      const now = new Date();
      
      eventsState.forEach(event => {
        if (!event.createdByUser || !event.deadline) return;
        
        try {
          let deadlineDate;
          if (event.deadline.includes('at')) {
            const parts = event.deadline.split('at');
            const datePart = parts[0].trim();
            const timePart = parts[1].trim().replace(/pm|am/i, '');
            deadlineDate = new Date(`${datePart} ${timePart}`);
          } else {
            deadlineDate = new Date(event.deadline);
          }
          
          if (now > deadlineDate) {
            // Check if email was already sent using localStorage directly
            const sentEmailsFromStorage = loadFromLocalStorage(STORAGE_KEYS.SENT_EMAILS, []);
            if (!sentEmailsFromStorage.includes(event.id)) {
              console.log(`📧 Participant list for "${event.eventName}" sent to ${profileEmail}`);
              // Update localStorage directly to avoid state update loops
              const updatedSentEmails = [...sentEmailsFromStorage, event.id];
              saveToLocalStorage(STORAGE_KEYS.SENT_EMAILS, updatedSentEmails);
              // Update state only once
              setSentEmails(updatedSentEmails);
            }
          }
        } catch (error) {
          console.warn(`Could not parse deadline for event ${event.eventName}:`, error);
        }
      });
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [profileEmail, isInitialized]); // Removed eventsState to prevent loops

  const navigate = (screen: Screen, eventId?: string, editEvent?: any, isNewFromDashboard?: boolean) => {
    if (eventId) setSelectedEvent(eventId);
    if (editEvent !== undefined) setEditingEvent(editEvent);
    setIsNewFromDashboard(isNewFromDashboard || false);
    setCurrentScreen(screen);
  };

  const addEvent = (eventData: any, isEdit: boolean = false) => {
    if (isEdit && editingEvent) {
      setEventsState(prev => 
        prev.map(event => 
          event.id === editingEvent.id 
            ? { ...eventData, id: editingEvent.id, createdAt: editingEvent.createdAt, createdByUser: editingEvent.createdByUser }
            : event
        )
      );
    } else {
      const eventWithTimestamp = {
        ...eventData,
        createdAt: Date.now(),
        createdByUser: true
      };
      setEventsState(prev => [...prev, eventWithTimestamp]);
    }
  };

  const deleteEvent = (eventId: string) => {
    setEventsState(prev => prev.filter(event => event.id !== eventId));
  };

  const registerForEvent = (eventId: string, subEventIndex?: number) => {
    // Create composite key for sub-event registration: "eventId:subEventIndex"
    const registrationKey = subEventIndex !== undefined 
      ? `${eventId}:${subEventIndex}` 
      : eventId;
    
    console.log('Registering for:', registrationKey);
    console.log('Current registered events before:', registeredEvents);
    
    setRegisteredEvents(prev => {
      const newRegistrations = prev.includes(registrationKey) ? prev : [...prev, registrationKey];
      console.log('New registered events:', newRegistrations);
      return newRegistrations;
    });
  };

  const withdrawFromEvent = (registrationKey: string) => {
    setRegisteredEvents(prev => prev.filter(id => id !== registrationKey));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Home navigate={navigate} events={eventsState} />;
      case 'event_detail':
        const selectedEventData = eventsState.find(e => e.id === selectedEvent);
        return selectedEventData 
          ? <EventDetail navigate={navigate} event={selectedEventData} onRegister={registerForEvent} registeredEvents={registeredEvents} />
          : <Home navigate={navigate} events={eventsState} />;
      case 'register':
        return <Register navigate={navigate} />;
      case 'results':
        return <Results navigate={navigate} />;
      case 'org_dashboard':
        return <OrgDashboard navigate={navigate} />;
      case 'add_event':
        return <AddEvent navigate={navigate} addEvent={addEvent} editingEvent={editingEvent} isNewFromDashboard={isNewFromDashboard} />;
      case 'my_org':
        return <MyOrganisedEvents navigate={navigate} events={eventsState} deleteEvent={deleteEvent} />;
      case 'participants':
        const participantsEventData = eventsState.find(e => e.id === selectedEvent);
        return <Participants 
          navigate={navigate} 
          event={participantsEventData} 
          profileEmail={profileEmail}
          emailSent={sentEmails.includes(selectedEvent)}
        />;
      case 'my_part':
        return <MyParticipatingEvents 
          navigate={navigate} 
          events={eventsState}
          registeredEvents={registeredEvents}
          onWithdrawParticipation={withdrawFromEvent}
        />;
      case 'profile':
        return <Profile navigate={navigate} onEmailUpdate={setProfileEmail} savedEmail={profileEmail} />;
      default:
        return <Home navigate={navigate} events={eventsState} />;
    }
  };

  return (
    <div className="min-h-screen bg-white max-w-sm mx-auto">
      {renderScreen()}
    </div>
  );
}