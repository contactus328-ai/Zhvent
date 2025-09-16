import React, { useState, useMemo } from 'react';
import type { Screen } from '../App';

interface HomeProps {
  navigate: (screen: Screen, eventId?: string) => void;
  events: any[];
}

/* ========= Date helpers (locale-aware) ========= */
function fmtDate(d: string | Date) {
  try {
    return new Date(d).toLocaleDateString(navigator.language || "en-US", {
      day: "numeric",
      month: "short", 
      year: "numeric"
    });
  } catch {
    return new Date(d).toDateString();
  }
}

function formatFriendlyRangeLocale(startISO: string, endISO?: string) {
  const s = new Date(startISO);
  const e = new Date(endISO || startISO);
  
  if (s.toDateString() === e.toDateString()) return fmtDate(s);
  
  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
    const startDay = s.toLocaleDateString(navigator.language || "en-US", { day: "numeric" });
    const monthYear = s.toLocaleDateString(navigator.language || "en-US", { month: "short", year: "numeric" });
    const endDay = e.toLocaleDateString(navigator.language || "en-US", { day: "numeric" });
    return `${startDay}–${endDay} ${monthYear}`;
  }
  
  if (s.getFullYear() === e.getFullYear()) {
    const startMY = s.toLocaleDateString(navigator.language || "en-US", { day: "numeric", month: "short" });
    const endMY = e.toLocaleDateString(navigator.language || "en-US", { day: "numeric", month: "short", year: "numeric" });
    return `${startMY} – ${endMY}`;
  }
  
  return `${fmtDate(s)} – ${fmtDate(e)}`;
}

/* ========= Fuzzy text + natural date parsing ========= */
function editDistance(a: string, b: string) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i-1] === b[j-1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i-1][j] + 1, dp[i][j-1] + 1, dp[i-1][j-1] + cost);
    }
  }
  return dp[m][n];
}

function tokenMatchesWord(token: string, word: string) {
  if (!token) return true;
  token = token.toLowerCase();
  word = word.toLowerCase();
  if (word.includes(token)) return true;
  const d = editDistance(token, word);
  const threshold = token.length <= 4 ? 1 : token.length <= 7 ? 2 : 3;
  return d <= threshold;
}

function tokenMatchesHaystack(token: string, haystack: string) {
  const s = (haystack || "").toLowerCase();
  if (s.includes(token.toLowerCase())) return true;
  const words = s.split(/[^a-z0-9]+/).filter(Boolean);
  for (const w of words) if (tokenMatchesWord(token, w)) return true;
  return false;
}

function parseDDMMYY(tok: string) {
  const m = tok.match(/^(\d{1,2})(?:st|nd|rd|th)?\/(\d{1,2})\/(\d{2}|\d{4})$/i);
  if (m) {
    let d = parseInt(m[1], 10), mo = parseInt(m[2], 10), y = parseInt(m[3], 10);
    if (y < 100) {
      y = y <= 79 ? 2000 + y : 1900 + y;
    }
    return new Date(y, mo-1, d);
  }
  // natural forms like "25th Nov", "Nov 25", "25 Nov 2025"
  const natural = tok.replace(/(\d+)(st|nd|rd|th)/i, "$1");
  const dt = Date.parse(natural);
  if (!isNaN(dt)) return new Date(dt);
  return null;
}

function dateInRange(d: Date, start: string, end?: string) {
  const t = d.setHours(0,0,0,0);
  const s = new Date(start).setHours(0,0,0,0);
  const e = new Date(end || start).setHours(0,0,0,0);
  return t >= s && t <= e;
}

// Convert existing events data to match the expected format
function convertEventData(events: any[]) {
  return events.map(event => ({
    college: event.college,
    event: event.eventName,
    city: event.location,
    start: convertDateToISO(event.dates),
    end: convertDateToISO(event.dates, true),
    type: event.type,
    comp: event.competition,
    id: event.id,
    createdAt: event.createdAt || 0,
    subEvents: event.events || [] // Include sub-events for search
  }));
}

// Helper function to convert date strings to ISO format
function convertDateToISO(dateStr: string, isEnd = false): string {
  // Handle formats like "25th to 26th Nov 25", "24th to 24th May 25"
  const rangeMatch = dateStr.match(/(\d{1,2})(?:st|nd|rd|th)?\s+to\s+(\d{1,2})(?:st|nd|rd|th)?\s+(\w+)\s+(\d{2})/);
  if (rangeMatch) {
    const [, startDay, endDay, month, year] = rangeMatch;
    const fullYear = parseInt(year) + 2000;
    const monthNum = getMonthNumber(month);
    const day = isEnd ? parseInt(endDay) : parseInt(startDay);
    return `${fullYear}-${monthNum.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }
  
  // Handle single date formats like "25th Nov 25", "24th Dec 25"
  const singleMatch = dateStr.match(/(\d{1,2})(?:st|nd|rd|th)?\s+(\w+)\s+(\d{2})/);
  if (singleMatch) {
    const [, day, month, year] = singleMatch;
    const fullYear = parseInt(year) + 2000;
    const monthNum = getMonthNumber(month);
    return `${fullYear}-${monthNum.toString().padStart(2, '0')}-${parseInt(day).toString().padStart(2, '0')}`;
  }
  
  // Fallback for other formats - use current date
  return '2025-01-01';
}

function getMonthNumber(monthStr: string): number {
  const months = {
    'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6,
    'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12
  };
  return months[monthStr.toLowerCase() as keyof typeof months] || 1;
}

/* ========= Layout components ========= */
const ROW_GRID = "grid grid-cols-[1fr_124px] items-start gap-3";

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="w-[360px] h-[800px] mx-auto bg-white border rounded-2xl shadow-sm flex flex-col overflow-hidden">
    {children}
  </div>
);

function TopBar({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <div className="h-14 bg-neutral-100/80 border-b backdrop-blur flex items-center px-4 justify-end shrink-0">
      <button 
        className="px-3 py-1.5 border rounded-lg bg-white hover:bg-neutral-50 transition-transform duration-75 active:scale-95" 
        aria-label="Login"
        onClick={() => navigate('org_dashboard')}
      >
        Login
      </button>
    </div>
  );
}

function SearchBarFixed({ query, setQuery }: { query: string; setQuery: (q: string) => void }) {
  return (
    <div className="shrink-0 bg-white border-b">
      <div className="px-4 py-2">
        <div className="h-10 w-full rounded-xl border bg-white flex items-center gap-2 px-2 text-neutral-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <input 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Search: College / Event / City / Type or date" 
            className="flex-1 outline-none placeholder:text-neutral-400" 
            aria-label="Search events" 
          />
          {query && (
            <button 
              onClick={() => setQuery("")} 
              className="px-2 py-1 border rounded-md hover:bg-neutral-50" 
              title="Clear search"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function HeaderBar() {
  return (
    <div className="shrink-0 border-b border-t bg-white">
      <div className="w-[360px] max-w-full mx-auto px-3 py-3">
        <div className={ROW_GRID}>
          <div className="min-w-0">
            <div className="leading-5">College Name</div>
            <div className="leading-5">Event Name</div>
            <div className="leading-5 text-neutral-700">City, Locality</div>
          </div>
          <div className="text-right leading-5">
            <div>Event Dates</div>
            <div>Event Type</div>
            <div>Competition Type</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-10 px-6">
      <div className="text-neutral-700">No events found</div>
      <div className="text-neutral-400 mt-1">Refine your search by another city, college, type, or date</div>
    </div>
  );
}

interface EventCardProps {
  data: {
    college: string;
    event: string;
    city: string;
    start: string;
    end: string;
    type: string;
    comp: string;
    id: string;
    category?: 'current' | 'upcoming' | 'past';
    subEvents?: any[];
  };
  onClick: () => void;
}

function EventCard({ data, onClick }: EventCardProps) {
  const friendlyDates = formatFriendlyRangeLocale(data.start, data.end);
  
  return (
    <div 
      className="w-[360px] max-w-full mx-auto block text-left px-3 py-3 rounded-xl border shadow-sm bg-white cursor-pointer transition-transform duration-75 active:scale-95"
      onClick={onClick}
    >
      <div className={ROW_GRID}>
        <div className="min-w-0">
          <div className="leading-5">{data.college}</div>
          <div className="leading-5 whitespace-pre-line">{data.event}</div>
          <div className="leading-5 text-neutral-700">{data.city}</div>
        </div>
        <div className="text-right leading-5 whitespace-pre-line">
          <div>{friendlyDates}</div>
          <div>{data.type}</div>
          {data.comp && <div>{data.comp}</div>}
        </div>
      </div>
    </div>
  );
}

function HomeList({ query, navigate, events }: { query: string; navigate: (screen: Screen, eventId?: string) => void; events: any[] }) {
  const baseEvents = convertEventData(events);
  
  // Use the base events directly without duplication
  let allEvents = baseEvents.map((event, idx) => ({
    ...event,
    key: `event-${idx}`
  }));

  // Filter out events that ended more than 7 days ago
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const filteredEvents = allEvents.filter(event => {
    const eventEndDate = new Date(event.end);
    eventEndDate.setHours(23, 59, 59, 999); // Set to end of day
    return eventEndDate >= sevenDaysAgo;
  });

  // Categorize and sort events by priority
  const categorizedEvents = filteredEvents.map(event => {
    const eventStartDate = new Date(event.start);
    const eventEndDate = new Date(event.end);
    eventStartDate.setHours(0, 0, 0, 0);
    eventEndDate.setHours(23, 59, 59, 999);
    
    let category: 'current' | 'upcoming' | 'past';
    let sortKey: number;
    
    if (today >= eventStartDate && today <= eventEndDate) {
      // Current/Ongoing events (happening today or multi-day events that include today)
      category = 'current';
      sortKey = eventStartDate.getTime(); // Earlier start dates rank higher
    } else if (today < eventStartDate) {
      // Upcoming events
      category = 'upcoming';
      sortKey = eventStartDate.getTime(); // Sooner events rank higher
    } else {
      // Past events (ended but within 7 days)
      category = 'past';
      sortKey = -eventEndDate.getTime(); // More recently ended rank higher (negative for reverse sort)
    }
    
    return {
      ...event,
      category,
      sortKey
    };
  });

  // Sort within each category
  const currentEvents = categorizedEvents
    .filter(e => e.category === 'current')
    .sort((a, b) => {
      if (a.sortKey !== b.sortKey) return a.sortKey - b.sortKey;
      return (a.createdAt || 0) - (b.createdAt || 0);
    });

  const upcomingEvents = categorizedEvents
    .filter(e => e.category === 'upcoming')
    .sort((a, b) => {
      if (a.sortKey !== b.sortKey) return a.sortKey - b.sortKey;
      return (a.createdAt || 0) - (b.createdAt || 0);
    });

  const pastEvents = categorizedEvents
    .filter(e => e.category === 'past')
    .sort((a, b) => {
      if (a.sortKey !== b.sortKey) return a.sortKey - b.sortKey;
      return (a.createdAt || 0) - (b.createdAt || 0);
    });

  // Combine in priority order: Current -> Upcoming -> Past
  allEvents = [...currentEvents, ...upcomingEvents, ...pastEvents];

  const filtered = useMemo(() => {
    const q = (query || "").trim();
    const tokens = q.split(/\s+/).filter(Boolean);
    
    if (!tokens.length) return allEvents;

    const dateTokens = [];
    const textTokens = [];
    
    for (const t of tokens) {
      // Day-only like "25th" or "25"
      if (/^\d{1,2}(st|nd|rd|th)?$/i.test(t)) {
        const d = parseInt(t);
        return allEvents.filter(ev => {
          const s = new Date(ev.start).getDate();
          const e = new Date(ev.end || ev.start).getDate();
          return d >= s && d <= e;
        });
      }
      
      if (/^\d{1,2}\/\d{1,2}\/(\d{2}|\d{4})$/.test(t) || /^[a-z]+$/i.test(t)) {
        dateTokens.push(t);
      } else {
        textTokens.push(t.toLowerCase());
      }
    }

    return allEvents.filter((e) => {
      // Date tokens must each land inside the event date range
      const dateOk = dateTokens.every(tok => {
        const dt = parseDDMMYY(tok);
        if (!dt) return false;
        return dateInRange(new Date(dt), e.start, e.end);
      });
      if (!dateOk) return false;
      
      if (textTokens.length === 0) return true;
      
      // Include sub-event types and names in search
      const subEventData = e.subEvents ? e.subEvents.map((sub: any) => `${sub.name} ${sub.type}`).join(" ") : "";
      const hay = [e.college, e.event, e.city, formatFriendlyRangeLocale(e.start, e.end), e.type, e.comp, subEventData].join(" ").toLowerCase();
      return textTokens.every((t) => tokenMatchesHaystack(t, hay));
    });
  }, [allEvents, query]);

  const handleEventClick = (eventId: string) => {
    // Check if it's one of the original hardcoded events
    const originalEvents = ['pandu', 'kaiso', 'maker', 'aitran', 'saman', 'sund'];
    if (originalEvents.includes(eventId)) {
      navigate(`detail_${eventId}` as Screen, eventId);
    } else {
      // For dynamically created events, use the general event_detail screen
      navigate('event_detail', eventId);
    }
  };

  return (
    <div className="pb-6">
      <div className="mt-2 space-y-2">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          filtered.map((e) => (
            <EventCard 
              key={e.key} 
              data={e} 
              onClick={() => handleEventClick(e.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export function Home({ navigate, events }: HomeProps) {
  const [query, setQuery] = useState("");

  return (
    <Frame>
      <TopBar navigate={navigate} />
      <SearchBarFixed query={query} setQuery={setQuery} />
      <HeaderBar />
      <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
        <HomeList query={query} navigate={navigate} events={events} />
      </div>
    </Frame>
  );
}