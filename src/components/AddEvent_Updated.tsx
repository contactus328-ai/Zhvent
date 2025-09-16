import React, { useState, useEffect, useRef } from 'react';
import type { Screen } from '../App';
import { Plus, Camera, Users, Minus, ChevronDown, ChevronUp, Calendar } from 'lucide-react';

interface AddEventProps {
  navigate: (screen: Screen) => void;
}

interface TeamMember {
  name: string;
  dept: string;
  phone: string;
}

interface SubEvent {
  id: string;
  competitionType: string;
  eventType: string;
  groupSingle: string;
  minParticipants: string;
  maxParticipants: string;
  startDate: string;
  endDate: string;
  timeHour: string;
  timeAmPm: string;
  rules: string[];
  entryFees: string;
  registrationDeadlineDate: string;
  registrationDeadlineHour: string;
  registrationDeadlineAmPm: string;
  otse: string;
  performanceDurationMin: string;
  performanceDurationMax: string;
  activateLiveFeed: boolean;
}

interface OrganizingCommittee {
  name: string;
  position: string;
  phone: string;
  email: string;
  otpSent: boolean;
  otpVerified: boolean;
  otp: string;
}

export function AddEvent({ navigate }: AddEventProps) {
  // Mock user registration details (in real app, this would come from user profile/auth)
  const userRegistrationDetails = {
    collegeName: 'St. Xavier\\'s College',
    address: '5, Mahapalika Marg, Dhobi Talao',
    locality: 'Fort',
    city: 'Mumbai',
    pinCode: '400001'
  };

  // Mock profile details for contact info
  const profileDetails = {
    contactPerson: 'Dr. John Smith',
    contactNumber: '+91 9876543210'
  };

  const [eventData, setEventData] = useState({
    collegeName: userRegistrationDetails.collegeName,
    eventName: '',
    address: userRegistrationDetails.address,
    locality: userRegistrationDetails.locality,
    city: userRegistrationDetails.city,
    pinCode: userRegistrationDetails.pinCode,
    competitionType: '',
    eventType: '',
    groupSingle: '',
    minParticipants: '0',
    maxParticipants: '0',
    startDate: '',
    endDate: '',
    timeHour: '10',
    timeAmPm: 'am',
    rules: [''],
    entryFees: '',
    registrationDeadlineDate: '',
    registrationDeadlineHour: '11',
    registrationDeadlineAmPm: 'pm',
    otse: '',
    performanceDurationMin: '',
    performanceDurationMax: '',
    activateLiveFeed: false,
    eventTeam: [
      { name: '', dept: '', phone: '' },
      { name: '', dept: '', phone: '' },
      { name: '', dept: '', phone: '' }
    ]
  });

  const [subEvents, setSubEvents] = useState<SubEvent[]>([]);
  const [organizingCommittee, setOrganizingCommittee] = useState<OrganizingCommittee[]>([
    { name: '', position: '', phone: '', email: '', otpSent: false, otpVerified: false, otp: '' }
  ]);
  const [eventTypeSearch, setEventTypeSearch] = useState('');
  const [showEventTypeDropdown, setShowEventTypeDropdown] = useState(false);
  const [collapsedSubEvents, setCollapsedSubEvents] = useState<Set<string>>(new Set());
  const [isMainEventCollapsed, setIsMainEventCollapsed] = useState(true);
  const eventTypeRef = useRef<HTMLDivElement>(null);

  const eventTypes = ['Dancing', 'Singing', 'Theatre', 'Treasure Hunt', 'Debate', 'Impromptu Speech'];
  const competitionTypes = ['Inter-collegiate', 'Intra-collegiate', 'Inter-school', 'Intra-school', 'Others'];
  
  const filteredEventTypes = eventTypes.filter(type => 
    type.toLowerCase().includes(eventTypeSearch.toLowerCase())
  );

  // localStorage key for persistence
  const STORAGE_KEY = 'zhevents_add_event_form';

  // Load saved data on component mount (excluding sub-events for clean start)
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setEventData(parsed.eventData || eventData);
        // Don't load sub-events - start fresh each time
        // setSubEvents(parsed.subEvents || []);
        setOrganizingCommittee(parsed.organizingCommittee || organizingCommittee);
      } catch (error) {
        console.error('Failed to load saved form data:', error);
      }
    }
  }, []);

  // Save data whenever form changes
  useEffect(() => {
    const dataToSave = {
      eventData,
      subEvents,
      organizingCommittee,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [eventData, subEvents, organizingCommittee]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (eventTypeRef.current && !eventTypeRef.current.contains(event.target as Node)) {
        setShowEventTypeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const generateNumberOptions = (start: number, end: number) => {
    const options = [];
    for (let i = start; i <= end; i++) {
      options.push(i.toString());
    }
    return options;
  };

  const generateParticipantOptions = (start: number, end: number) => {
    const options = [];
    for (let i = start; i <= end; i++) {
      options.push(i.toString());
    }
    return options;
  };

  const addRule = () => {
    if (eventData.rules.length < 5) {
      setEventData(prev => ({
        ...prev,
        rules: [...prev.rules, '']
      }));
    }
  };

  const removeRule = (index: number) => {
    if (eventData.rules.length > 1) {
      const newRules = eventData.rules.filter((_, i) => i !== index);
      setEventData(prev => ({
        ...prev,
        rules: newRules
      }));
    }
  };

  const updateRule = (index: number, value: string) => {
    if (value.length <= 250) {
      const newRules = [...eventData.rules];
      newRules[index] = value;
      setEventData(prev => ({
        ...prev,
        rules: newRules
      }));
    }
  };

  const handleEventTypeSelect = (type: string) => {
    setEventData(prev => ({ ...prev, eventType: type }));
    setEventTypeSearch(type);
    setShowEventTypeDropdown(false);
  };

  const handleLiveFeedClick = () => {
    if (!eventData.activateLiveFeed) {
      // Simulate camera access
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => {
          setEventData(prev => ({ ...prev, activateLiveFeed: true }));
        })
        .catch(() => {
          alert('Camera access denied or not available');
        });
    } else {
      setEventData(prev => ({ ...prev, activateLiveFeed: false }));
    }
  };

  const addCommitteeMember = () => {
    setOrganizingCommittee(prev => [...prev, { name: '', position: '', phone: '', email: '', otpSent: false, otpVerified: false, otp: '' }]);
  };

  const removeCommitteeMember = (index: number) => {
    if (organizingCommittee.length > 1) {
      const newCommittee = organizingCommittee.filter((_, i) => i !== index);
      setOrganizingCommittee(newCommittee);
    }
  };

  const updateCommitteeMember = (index: number, field: keyof OrganizingCommittee, value: string) => {
    const newCommittee = [...organizingCommittee];
    newCommittee[index] = { ...newCommittee[index], [field]: value };
    setOrganizingCommittee(newCommittee);
  };

  // Sub-event management functions
  const updateSubEvent = (subEventId: string, field: keyof SubEvent, value: any) => {
    setSubEvents(prev => prev.map(subEvent => 
      subEvent.id === subEventId 
        ? { ...subEvent, [field]: value }
        : subEvent
    ));
  };

  const addSubEventRule = (subEventId: string) => {
    setSubEvents(prev => prev.map(subEvent => 
      subEvent.id === subEventId && subEvent.rules.length < 5
        ? { ...subEvent, rules: [...subEvent.rules, ''] }
        : subEvent
    ));
  };

  const removeSubEventRule = (subEventId: string, ruleIndex: number) => {
    setSubEvents(prev => prev.map(subEvent => 
      subEvent.id === subEventId && subEvent.rules.length > 1
        ? { ...subEvent, rules: subEvent.rules.filter((_, i) => i !== ruleIndex) }
        : subEvent
    ));
  };

  const updateSubEventRule = (subEventId: string, ruleIndex: number, value: string) => {
    if (value.length <= 250) {
      setSubEvents(prev => prev.map(subEvent => 
        subEvent.id === subEventId 
          ? { 
              ...subEvent, 
              rules: subEvent.rules.map((rule, i) => i === ruleIndex ? value : rule)
            }
          : subEvent
      ));
    }
  };

  const handleSubEventLiveFeedClick = (subEventId: string) => {
    const subEvent = subEvents.find(se => se.id === subEventId);
    if (!subEvent) return;

    if (!subEvent.activateLiveFeed) {
      // Simulate camera access
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => {
          updateSubEvent(subEventId, 'activateLiveFeed', true);
        })
        .catch(() => {
          alert('Camera access denied or not available');
        });
    } else {
      updateSubEvent(subEventId, 'activateLiveFeed', false);
    }
  };

  const toggleSubEventCollapse = (subEventId: string) => {
    setCollapsedSubEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subEventId)) {
        newSet.delete(subEventId);
      } else {
        newSet.add(subEventId);
      }
      return newSet;
    });
  };

  const sendOTP = async (index: number) => {
    const member = organizingCommittee[index];
    if (!member.email) {
      alert('Please enter email address first');
      return;
    }
    
    // Simulate OTP sending (in real app, this would call an API)
    const newCommittee = [...organizingCommittee];
    newCommittee[index] = { ...newCommittee[index], otpSent: true };
    setOrganizingCommittee(newCommittee);
    alert(`OTP sent to ${member.email}`);
  };

  const verifyOTP = (index: number) => {
    const member = organizingCommittee[index];
    if (!member.otp) {
      alert('Please enter OTP');
      return;
    }
    
    // Simulate OTP verification (in real app, this would call an API)
    if (member.otp === '123456') { // Mock OTP
      const newCommittee = [...organizingCommittee];
      newCommittee[index] = { ...newCommittee[index], otpVerified: true };
      setOrganizingCommittee(newCommittee);
      alert('OTP verified successfully!');
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  // Add sub-event function
  const addSubEvent = () => {
    const newSubEvent: SubEvent = {
      id: `event_${Date.now()}`,
      competitionType: eventData.competitionType,
      eventType: eventData.eventType,
      groupSingle: eventData.groupSingle,
      minParticipants: eventData.minParticipants,
      maxParticipants: eventData.maxParticipants,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      timeHour: eventData.timeHour,
      timeAmPm: eventData.timeAmPm,
      rules: [...eventData.rules],
      entryFees: eventData.entryFees,
      registrationDeadlineDate: eventData.registrationDeadlineDate,
      registrationDeadlineHour: eventData.registrationDeadlineHour,
      registrationDeadlineAmPm: eventData.registrationDeadlineAmPm,
      otse: eventData.otse,
      performanceDurationMin: eventData.performanceDurationMin,
      performanceDurationMax: eventData.performanceDurationMax,
      activateLiveFeed: eventData.activateLiveFeed
    };
    setSubEvents(prev => [...prev, newSubEvent]);
  };

  const handleSubmit = () => {
    // Clear saved form data on successful submit
    localStorage.removeItem(STORAGE_KEY);
    alert('Event added successfully!');
    navigate('org_dashboard');
  };

  // Event details form component
  const renderEventDetails = (subEvent?: SubEvent, subEventIndex?: number) => {
    const isSubEvent = !!subEvent;
    const eventTypeValue = isSubEvent ? subEvent.eventType : eventData.eventType;
    const eventTypeSearchValue = isSubEvent ? subEvent.eventType : eventTypeSearch;
    
    return (
      <div className="space-y-0.5">
        {/* Event Type with Search */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">Event Type:</label>
          <div className="relative" ref={isSubEvent ? undefined : eventTypeRef}>
            <input
              type="text"
              value={eventTypeSearchValue}
              onChange={(e) => {
                if (isSubEvent && subEvent) {
                  updateSubEvent(subEvent.id, 'eventType', e.target.value);
                } else {
                  setEventTypeSearch(e.target.value);
                  setShowEventTypeDropdown(true);
                  setEventData(prev => ({ ...prev, eventType: e.target.value }));
                }
              }}
              onFocus={() => !isSubEvent && setShowEventTypeDropdown(true)}
              className="w-full h-5 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-none"
              placeholder="Search or select event type"
            />
            {!isSubEvent && showEventTypeDropdown && filteredEventTypes.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded mt-0.5 max-h-24 overflow-y-auto z-10">
                {filteredEventTypes.map(type => (
                  <div
                    key={type}
                    onClick={() => handleEventTypeSelect(type)}
                    className="px-1 py-0.5 text-sm text-black hover:bg-gray-100 cursor-pointer"
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Group/Single */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">Group/Single:</label>
          <select
            value={isSubEvent ? subEvent.groupSingle : eventData.groupSingle}
            onChange={(e) => {
              if (isSubEvent && subEvent) {
                updateSubEvent(subEvent.id, 'groupSingle', e.target.value);
              } else {
                setEventData(prev => ({ ...prev, groupSingle: e.target.value }));
              }
            }}
            className="h-5 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-none"
          >
            <option value="">Select</option>
            <option value="Group">Group</option>
            <option value="Single">Single</option>
          </select>
        </div>

        {/* Participants */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">Participants:</label>
          <div className="flex gap-1 items-center">
            <select
              value={isSubEvent ? subEvent.minParticipants : eventData.minParticipants}
              onChange={(e) => {
                if (isSubEvent && subEvent) {
                  updateSubEvent(subEvent.id, 'minParticipants', e.target.value);
                } else {
                  setEventData(prev => ({ ...prev, minParticipants: e.target.value }));
                }
              }}
              className="h-5 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-none w-12"
            >
              {generateParticipantOptions(0, 20).map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <span className="text-xs">Min</span>
            <select
              value={isSubEvent ? subEvent.maxParticipants : eventData.maxParticipants}
              onChange={(e) => {
                if (isSubEvent && subEvent) {
                  updateSubEvent(subEvent.id, 'maxParticipants', e.target.value);
                } else {
                  setEventData(prev => ({ ...prev, maxParticipants: e.target.value }));
                }
              }}
              className="h-5 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-none w-12"
            >
              {generateParticipantOptions(0, 20).map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <span className="text-xs">Max</span>
          </div>
        </div>

        {/* Event Dates */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">Event Dates:</label>
          <div className="flex gap-1 items-center">
            <input
              type="date"
              value={isSubEvent ? subEvent.startDate : eventData.startDate}
              onChange={(e) => {
                if (isSubEvent && subEvent) {
                  updateSubEvent(subEvent.id, 'startDate', e.target.value);
                } else {
                  setEventData(prev => ({ ...prev, startDate: e.target.value }));
                }
              }}
              className="h-5 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-none flex-1 min-w-0"
              style={{ colorScheme: 'light' }}
            />
            <span className="text-xs">to</span>
            <input
              type="date"
              value={isSubEvent ? subEvent.endDate : eventData.endDate}
              onChange={(e) => {
                if (isSubEvent && subEvent) {
                  updateSubEvent(subEvent.id, 'endDate', e.target.value);
                } else {
                  setEventData(prev => ({ ...prev, endDate: e.target.value }));
                }
              }}
              className="h-5 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-none flex-1 min-w-0"
              style={{ colorScheme: 'light' }}
            />
          </div>
        </div>

        {/* Time */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">Time:</label>
          <div className="flex gap-1">
            <select
              value={isSubEvent ? subEvent.timeHour : eventData.timeHour}
              onChange={(e) => {
                if (isSubEvent && subEvent) {
                  updateSubEvent(subEvent.id, 'timeHour', e.target.value);
                } else {
                  setEventData(prev => ({ ...prev, timeHour: e.target.value }));
                }
              }}
              className="h-5 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-none"
            >
              {generateNumberOptions(1, 12).map(hour => (
                <option key={hour} value={hour}>{hour}</option>
              ))}
            </select>
            <select
              value={isSubEvent ? subEvent.timeAmPm : eventData.timeAmPm}
              onChange={(e) => {
                if (isSubEvent && subEvent) {
                  updateSubEvent(subEvent.id, 'timeAmPm', e.target.value);
                } else {
                  setEventData(prev => ({ ...prev, timeAmPm: e.target.value }));
                }
              }}
              className="h-5 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-none"
            >
              <option value="am">am</option>
              <option value="pm">pm</option>
            </select>
          </div>
        </div>

        {/* Rules */}
        <div className="grid grid-cols-[85px_1fr] items-start">
          <label className="text-sm text-black">Rules:</label>
          <div className="space-y-0.5">
            {(isSubEvent ? subEvent.rules : eventData.rules).map((rule, ruleIndex) => (
              <div key={ruleIndex} className="flex gap-1 items-center">
                <input
                  type="text"
                  value={rule}
                  onChange={(e) => {
                    if (isSubEvent && subEvent) {
                      updateSubEventRule(subEvent.id, ruleIndex, e.target.value);
                    } else {
                      updateRule(ruleIndex, e.target.value);
                    }
                  }}
                  className="flex-1 h-5 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-none"
                  placeholder={`${rule.length}/250`}
                  maxLength={250}
                />
                {(isSubEvent ? subEvent.rules.length : eventData.rules.length) > 1 && (
                  <button
                    onClick={() => {
                      if (isSubEvent && subEvent) {
                        removeSubEventRule(subEvent.id, ruleIndex);
                      } else {
                        removeRule(ruleIndex);
                      }
                    }}
                    className="h-5 w-5 bg-red-100 border border-red-300 rounded text-xs text-red-700 hover:bg-red-200 flex items-center justify-center"
                  >
                    <Minus size={10} />
                  </button>
                )}
                {ruleIndex === (isSubEvent ? subEvent.rules.length : eventData.rules.length) - 1 && 
                 (isSubEvent ? subEvent.rules.length : eventData.rules.length) < 5 && (
                  <button
                    onClick={() => {
                      if (isSubEvent && subEvent) {
                        addSubEventRule(subEvent.id);
                      } else {
                        addRule();
                      }
                    }}
                    className="h-5 w-5 bg-blue-100 border border-blue-300 rounded text-xs text-blue-700 hover:bg-blue-200 flex items-center justify-center"
                  >
                    <Plus size={10} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Entry Fees */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">Entry Fees:</label>
          <input
            type="text"
            value={isSubEvent ? subEvent.entryFees : eventData.entryFees}
            onChange={(e) => {
              if (isSubEvent && subEvent) {
                updateSubEvent(subEvent.id, 'entryFees', e.target.value);
              } else {
                setEventData(prev => ({ ...prev, entryFees: e.target.value }));
              }
            }}
            className="h-5 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-none"
            placeholder="₹ amount or Free"
          />
        </div>

        {/* Reg. Deadline */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">Reg. Deadline:</label>
          <div className="flex gap-1">
            <input
              type="date"
              value={isSubEvent ? subEvent.registrationDeadlineDate : eventData.registrationDeadlineDate}
              onChange={(e) => {
                if (isSubEvent && subEvent) {
                  updateSubEvent(subEvent.id, 'registrationDeadlineDate', e.target.value);
                } else {
                  setEventData(prev => ({ ...prev, registrationDeadlineDate: e.target.value }));
                }
              }}
              className="h-5 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-none flex-1 min-w-0"
              style={{ colorScheme: 'light' }}
            />
            <select
              value={isSubEvent ? subEvent.registrationDeadlineHour : eventData.registrationDeadlineHour}
              onChange={(e) => {
                if (isSubEvent && subEvent) {
                  updateSubEvent(subEvent.id, 'registrationDeadlineHour', e.target.value);
                } else {
                  setEventData(prev => ({ ...prev, registrationDeadlineHour: e.target.value }));
                }
              }}
              className="h-5 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-none"
            >
              {generateNumberOptions(1, 12).map(hour => (
                <option key={hour} value={hour}>{hour}</option>
              ))}
            </select>
            <select
              value={isSubEvent ? subEvent.registrationDeadlineAmPm : eventData.registrationDeadlineAmPm}
              onChange={(e) => {
                if (isSubEvent && subEvent) {
                  updateSubEvent(subEvent.id, 'registrationDeadlineAmPm', e.target.value);
                } else {
                  setEventData(prev => ({ ...prev, registrationDeadlineAmPm: e.target.value }));
                }
              }}
              className="h-5 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-none"
            >
              <option value="am">am</option>
              <option value="pm">pm</option>
            </select>
          </div>
        </div>

        {/* OTSE */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">OTSE:</label>
          <select
            value={isSubEvent ? subEvent.otse : eventData.otse}
            onChange={(e) => {
              if (isSubEvent && subEvent) {
                updateSubEvent(subEvent.id, 'otse', e.target.value);
              } else {
                setEventData(prev => ({ ...prev, otse: e.target.value }));
              }
            }}
            className="h-5 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-none"
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Duration */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">Duration:</label>
          <div className="flex gap-1 items-center">
            <input
              type="text"
              value={isSubEvent ? subEvent.performanceDurationMin : eventData.performanceDurationMin}
              onChange={(e) => {
                if (isSubEvent && subEvent) {
                  updateSubEvent(subEvent.id, 'performanceDurationMin', e.target.value);
                } else {
                  setEventData(prev => ({ ...prev, performanceDurationMin: e.target.value }));
                }
              }}
              className="h-5 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-none w-12"
              placeholder="Min"
            />
            <span className="text-xs">to</span>
            <input
              type="text"
              value={isSubEvent ? subEvent.performanceDurationMax : eventData.performanceDurationMax}
              onChange={(e) => {
                if (isSubEvent && subEvent) {
                  updateSubEvent(subEvent.id, 'performanceDurationMax', e.target.value);
                } else {
                  setEventData(prev => ({ ...prev, performanceDurationMax: e.target.value }));
                }
              }}
              className="h-5 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-none w-12"
              placeholder="Max"
            />
            <span className="text-xs">min</span>
          </div>
        </div>

        {/* Live Feed Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-black">Activate Live Feed:</span>
          <button
            onClick={() => {
              if (isSubEvent && subEvent) {
                handleSubEventLiveFeedClick(subEvent.id);
              } else {
                handleLiveFeedClick();
              }
            }}
            className={`flex items-center gap-1 h-6 px-2 rounded text-xs transition-colors ${
              (isSubEvent ? subEvent.activateLiveFeed : eventData.activateLiveFeed)
                ? 'bg-green-100 border border-green-300 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Camera size={12} />
            {(isSubEvent ? subEvent.activateLiveFeed : eventData.activateLiveFeed) ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Contact No. (only for main event) */}
        {!isSubEvent && (
          <>
            {/* Contact No. */}
            <div className="grid grid-cols-[85px_1fr] items-center">
              <label className="text-sm text-black">Contact No.:</label>
              <div className="h-5 px-1 bg-gray-100 border border-gray-300 rounded text-sm text-black leading-none flex items-center">
                {profileDetails.contactNumber}
              </div>
            </div>

            {/* Add Event 2 Button */}
            <div className="mt-1">
              <button
                onClick={addSubEvent}
                className="flex items-center gap-1 h-6 px-2 bg-blue-100 border border-blue-300 rounded text-xs text-blue-700 hover:bg-blue-200 transition-colors"
              >
                <Plus size={12} />
                Add Event {subEvents.length + 2}
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-white p-4">
      <h1 className="text-lg font-bold text-black mb-1">Add Event</h1>
      <p className="text-xs text-black mb-3">Fill all details exactly as per form in PDF.</p>
      
      <div className="space-y-0.5">
        {/* College Name */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">College name:</label>
          <input
            type="text"
            value={eventData.collegeName}
            onChange={(e) => setEventData(prev => ({ ...prev, collegeName: e.target.value }))}
            className="h-5 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-none"
            placeholder="College name will be auto-populated"
          />
        </div>

        {/* Event Name */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">Event Name:</label>
          <input
            type="text"
            value={eventData.eventName}
            onChange={(e) => setEventData(prev => ({ ...prev, eventName: e.target.value }))}
            className="h-5 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-none"
            placeholder="Enter event name"
          />
        </div>

        {/* Address */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">Address:</label>
          <input
            type="text"
            value={eventData.address}
            onChange={(e) => setEventData(prev => ({ ...prev, address: e.target.value }))}
            className="h-5 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-none"
            placeholder="Address will be auto-populated"
          />
        </div>

        {/* Locality */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">Locality:</label>
          <input
            type="text"
            value={eventData.locality}
            onChange={(e) => setEventData(prev => ({ ...prev, locality: e.target.value }))}
            className="h-5 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-none"
            placeholder="Locality will be auto-populated"
          />
        </div>

        {/* City */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">City:</label>
          <div className="h-5 px-1 bg-gray-100 border border-gray-300 rounded text-sm text-black leading-none flex items-center">
            {eventData.city}
          </div>
        </div>

        {/* Pin Code */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">Pin Code:</label>
          <div className="h-5 px-1 bg-gray-100 border border-gray-300 rounded text-sm text-black leading-none flex items-center">
            {eventData.pinCode}
          </div>
        </div>

        {/* Comp. Type */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">Comp. Type:</label>
          <select
            value={eventData.competitionType}
            onChange={(e) => setEventData(prev => ({ ...prev, competitionType: e.target.value }))}
            className="h-5 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-none"
          >
            <option value="">Select competition type</option>
            {competitionTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Event Dates */}
        <div className="grid grid-cols-[85px_1fr] items-center">
          <label className="text-sm text-black">Event Dates:</label>
          <div className="flex gap-1 items-center">
            <input
              type="date"
              value={eventData.startDate}
              onChange={(e) => setEventData(prev => ({ ...prev, startDate: e.target.value }))}
              className="h-5 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-none flex-1 min-w-0"
              style={{ colorScheme: 'light' }}
            />
            <span className="text-xs">to</span>
            <input
              type="date"
              value={eventData.endDate}
              onChange={(e) => setEventData(prev => ({ ...prev, endDate: e.target.value }))}
              className="h-5 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-none flex-1 min-w-0"
              style={{ colorScheme: 'light' }}
            />
          </div>
        </div>

        {/* Add Event Button */}
        {isMainEventCollapsed && (
          <div className="mt-1">
            <button
              onClick={() => setIsMainEventCollapsed(false)}
              className="flex items-center gap-1 h-6 px-2 bg-blue-100 border border-blue-300 rounded text-xs text-blue-700 hover:bg-blue-200 transition-colors"
            >
              <Plus size={12} />
              Add Event 1
            </button>
          </div>
        )}

        {/* Event Form Section */}
        {!isMainEventCollapsed && (
          <div className="border border-gray-300 rounded p-1 mt-1">
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span className="text-sm font-semibold text-black">Event Details</span>
              </div>
              <button
                onClick={() => setIsMainEventCollapsed(true)}
                className="text-gray-500 hover:text-gray-700"
              >
                <ChevronUp size={12} />
              </button>
            </div>

            {renderEventDetails()}
          </div>
        )}

        {/* Sub-events rendering */}
        {subEvents.map((subEvent, subEventIndex) => (
          <div key={subEvent.id}>
            <div className="border border-gray-300 rounded p-1 mt-1">
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span className="text-sm font-semibold text-black">Event {subEventIndex + 2} Details</span>
                </div>
                <button
                  onClick={() => toggleSubEventCollapse(subEvent.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {collapsedSubEvents.has(subEvent.id) ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
                </button>
              </div>

              {!collapsedSubEvents.has(subEvent.id) && renderEventDetails(subEvent, subEventIndex)}
            </div>

            {/* Add Next Event Button after each sub-event */}
            {!collapsedSubEvents.has(subEvent.id) && (
              <div className="mt-1">
                <button
                  onClick={addSubEvent}
                  className="flex items-center gap-1 h-6 px-2 bg-blue-100 border border-blue-300 rounded text-xs text-blue-700 hover:bg-blue-200 transition-colors"
                >
                  <Plus size={12} />
                  Add Event {subEvents.length + 2}
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Organizing Committee */}
        <div className="border border-gray-300 rounded p-1 mt-3">
          <div className="flex items-center gap-1 mb-0.5">
            <Users size={12} />
            <span className="text-sm font-semibold text-black">Organizing Committee</span>
          </div>

          <div className="space-y-1">
            {organizingCommittee.map((member, index) => (
              <div key={index} className="space-y-0.5">
                <div className="grid grid-cols-[60px_1fr_20px] items-center gap-1">
                  <label className="text-sm text-black">Name:</label>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => updateCommitteeMember(index, 'name', e.target.value)}
                    className="h-5 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-none"
                    placeholder="Enter name"
                  />
                  {organizingCommittee.length > 1 && (
                    <button
                      onClick={() => removeCommitteeMember(index)}
                      className="h-5 w-5 bg-red-100 border border-red-300 rounded text-xs text-red-700 hover:bg-red-200 flex items-center justify-center"
                    >
                      <Minus size={10} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-[60px_1fr] items-center gap-1">
                  <label className="text-sm text-black">Position:</label>
                  <input
                    type="text"
                    value={member.position}
                    onChange={(e) => updateCommitteeMember(index, 'position', e.target.value)}
                    className="h-5 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-none"
                    placeholder="Enter position"
                  />
                </div>

                <div className="grid grid-cols-[60px_1fr] items-center gap-1">
                  <label className="text-sm text-black">Phone:</label>
                  <input
                    type="tel"
                    value={member.phone}
                    onChange={(e) => updateCommitteeMember(index, 'phone', e.target.value)}
                    className="h-5 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-none"
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="grid grid-cols-[60px_1fr] items-center gap-1">
                  <label className="text-sm text-black">Email:</label>
                  <input
                    type="email"
                    value={member.email}
                    onChange={(e) => updateCommitteeMember(index, 'email', e.target.value)}
                    className="h-5 px-1 bg-gray-50 border border-gray-300 rounded text-sm text-black leading-none"
                    placeholder="Enter email"
                  />
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => sendOTP(index)}
                    disabled={member.otpSent || !member.email}
                    className={`h-6 px-2 rounded text-xs transition-colors ${
                      member.otpSent
                        ? 'bg-green-100 border border-green-300 text-green-700'
                        : 'bg-blue-100 border border-blue-300 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {member.otpSent ? 'OTP Sent' : 'Send OTP'}
                  </button>

                  {member.otpSent && !member.otpVerified && (
                    <>
                      <input
                        type="text"
                        value={member.otp}
                        onChange={(e) => updateCommitteeMember(index, 'otp', e.target.value)}
                        className="h-6 px-1 bg-gray-50 border border-gray-300 rounded text-xs text-black leading-none w-16"
                        placeholder="OTP"
                        maxLength={6}
                      />
                      <button
                        onClick={() => verifyOTP(index)}
                        className="h-6 px-2 bg-green-100 border border-green-300 rounded text-xs text-green-700 hover:bg-green-200 transition-colors"
                      >
                        Verify
                      </button>
                    </>
                  )}

                  {member.otpVerified && (
                    <span className="h-6 px-2 bg-green-100 border border-green-300 rounded text-xs text-green-700 flex items-center">
                      ✓ Verified
                    </span>
                  )}
                </div>

                {index < organizingCommittee.length - 1 && (
                  <div className="border-t border-gray-200 mt-1 pt-1" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-1">
            <button
              onClick={addCommitteeMember}
              className="flex items-center gap-1 h-6 px-2 bg-blue-100 border border-blue-300 rounded text-xs text-blue-700 hover:bg-blue-200 transition-colors"
            >
              <Plus size={12} />
              Add Member
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-3">
          <button
            onClick={handleSubmit}
            className="w-full h-8 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
          >
            Submit Event
          </button>
        </div>
      </div>
    </div>
  );
}