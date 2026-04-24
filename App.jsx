import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, MessageSquare, HelpCircle, ChevronRight, CheckCircle, 
  Award, Send, Landmark, Info, Clock, Moon, Sun, Menu, X, 
  BookOpen, MapPin, Volume2, Download, Share2, Trophy, Zap, 
  Search, BookText, Star
} from 'lucide-react';

// ==========================================
// CONFIGURATION & DATA
// ==========================================
const apiKey = ""; // Gemini API Key injected by environment

const timelineSteps = [
  { id: 1, title: "Spring (Year Prior)", subtitle: "Announcing Candidacy", content: "Candidates officially announce their intention to run for office, form exploratory committees, and begin fundraising and campaigning. They start testing the waters in early primary states.", icon: <Info className="w-5 h-5" />, xp: 10 },
  { id: 2, title: "January - June", subtitle: "Primaries and Caucuses", content: "States hold elections (primaries) or local gatherings (caucuses) to vote for their preferred party candidate. This process awards delegates. Iowa and New Hampshire traditionally go first.", icon: <Calendar className="w-5 h-5" />, xp: 10 },
  { id: 3, title: "July - August", subtitle: "National Conventions", content: "Political parties hold large, televised conventions to officially nominate their candidate for President and Vice President based on delegate counts, and to finalize their party platform.", icon: <Landmark className="w-5 h-5" />, xp: 10 },
  { id: 4, title: "September - October", subtitle: "General Campaigning & Debates", content: "The official nominees campaign nationwide, focusing heavily on 'swing states'. They participate in televised debates to present their platforms directly to the American public.", icon: <MessageSquare className="w-5 h-5" />, xp: 10 },
  { id: 5, title: "Early November", subtitle: "Election Day", content: "Citizens across the country cast their ballots on the first Tuesday after the first Monday in November. The popular vote in each state determines which electors are sent to the Electoral College.", icon: <CheckCircle className="w-5 h-5" />, xp: 10 },
  { id: 6, title: "December", subtitle: "Electoral College Vote", content: "Electors meet in their respective states to cast their official votes for President and Vice President. A candidate needs an absolute majority (270 out of 538 electoral votes) to win.", icon: <Award className="w-5 h-5" />, xp: 10 },
  { id: 7, title: "January 20", subtitle: "Inauguration Day", content: "The newly elected President and Vice President take the oath of office at the US Capitol, officially beginning their four-year term.", icon: <Clock className="w-5 h-5" />, xp: 10 }
];

const quizData = [
  { q: "What is the primary purpose of a National Convention?", opts: ["Elect the President", "Nominate a party candidate", "Cast Electoral votes", "Register voters"], ans: 1, exp: "Conventions lock in nominees based on primary results." },
  { q: "How many Electoral College votes are needed to win?", opts: ["270", "538", "100", "50"], ans: 0, exp: "There are 538 total electoral votes. A simple majority of 270 is required." },
  { q: "When is General Election Day?", opts: ["Oct 1st", "1st Tuesday after 1st Monday in Nov", "Last Friday in Nov", "Jan 20th"], ans: 1, exp: "By law, it's the Tuesday following the first Monday in November." },
  { q: "What is a swing state?", opts: ["A state with no voting machines", "A state that reliably votes for one party", "A state where either major party has a good chance of winning", "A state that changes its borders"], ans: 2, exp: "Swing states (or battleground states) are heavily targeted by campaigns because their outcomes are unpredictable." },
  { q: "Who breaks a tie in the Electoral College?", opts: ["The Supreme Court", "The sitting Vice President", "The House of Representatives", "A national popular vote revote"], ans: 2, exp: "If no candidate gets 270 votes, the House of Representatives elects the President (each state delegation gets one vote)." }
];

const glossaryTerms = [
  { term: "Absentee Ballot", def: "A ballot completed and typically mailed in advance of an election by a voter who is unable to be present at the polls." },
  { term: "Caucus", def: "A local meeting where registered members of a political party in a city, town or county gather to vote for their preferred party candidate." },
  { term: "Incumbent", def: "The person currently holding office." },
  { term: "PAC", def: "Political Action Committee; an organization formed to collect money and provide financial support for political candidates." },
  { term: "Gerrymandering", def: "The manipulation of the boundaries of an electoral constituency so as to favor one party or class." }
];

const dailyFacts = [
  "George Washington is the only U.S. president to have been elected unanimously by the Electoral College.",
  "The 15th, 19th, and 26th Amendments significantly expanded voting rights in the US.",
  "Election Day is on a Tuesday because in the 1800s, it gave farmers a day to travel after Sunday church.",
  "Alaska was the first state to allow 18-year-olds to vote, even before the 26th Amendment."
];

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Gamification State
  const [userStats, setUserStats] = useState({
    xp: 0,
    level: 1,
    timelineRead: [],
    quizHighscore: 0,
    aiChats: 0,
    badges: []
  });

  // Load persistence
  useEffect(() => {
    const savedStats = localStorage.getItem('civicStepStats');
    const savedTheme = localStorage.getItem('civicStepTheme');
    if (savedStats) setUserStats(JSON.parse(savedStats));
    if (savedTheme === 'dark') setIsDarkMode(true);
  }, []);

  // Save persistence
  useEffect(() => {
    localStorage.setItem('civicStepStats', JSON.stringify(userStats));
    localStorage.setItem('civicStepTheme', isDarkMode ? 'dark' : 'light');
    
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [userStats, isDarkMode]);

  const awardXP = (amount, reason) => {
    setUserStats(prev => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 100) + 1;
      
      // Check for new badges
      let newBadges = [...prev.badges];
      if (prev.timelineRead.length === timelineSteps.length && !newBadges.includes('Historian')) newBadges.push('Historian');
      if (prev.quizHighscore === quizData.length && !newBadges.includes('Quiz Master')) newBadges.push('Quiz Master');
      if (prev.aiChats >= 5 && !newBadges.includes('Curious Mind')) newBadges.push('Curious Mind');

      return { ...prev, xp: newXp, level: newLevel, badges: newBadges };
    });
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Trophy },
    { id: 'timeline', label: 'Journey Timeline', icon: Calendar },
    { id: 'assistant', label: 'AI Assistant', icon: Zap },
    { id: 'quiz', label: 'Knowledge Check', icon: HelpCircle },
    { id: 'glossary', label: 'Glossary', icon: BookText },
    { id: 'resources', label: 'Voter Hub', icon: MapPin },
  ];

  const dailyFact = dailyFacts[new Date().getDay() % dailyFacts.length];

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-auto bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-lg lg:shadow-none flex flex-col`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-sm">
              <Landmark className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">CivicStep</h1>
          </div>
          <button className="lg:hidden text-slate-500 hover:text-slate-900 dark:hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 pb-4">
          <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-2xl">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Your Progress</p>
            <div className="flex justify-between items-end mb-1">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">Lvl {userStats.level}</span>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{userStats.xp} XP</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${(userStats.xp % 100)}%` }}></div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveView(item.id); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeView === item.id 
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-blue-600 dark:text-blue-400' : ''}`} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
          >
            <span className="flex items-center gap-3">
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${isDarkMode ? 'bg-blue-600' : 'bg-slate-300'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isDarkMode ? 'left-5.5 translate-x-5' : 'left-0.5'}`}></div>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Landmark className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-xl">CivicStep</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeView === 'dashboard' && <DashboardView stats={userStats} fact={dailyFact} setView={setActiveView} />}
            {activeView === 'timeline' && <TimelineView stats={userStats} setStats={setUserStats} awardXP={awardXP} />}
            {activeView === 'assistant' && <AssistantView awardXP={awardXP} />}
            {activeView === 'quiz' && <QuizView stats={userStats} awardXP={awardXP} setStats={setUserStats} />}
            {activeView === 'glossary' && <GlossaryView />}
            {activeView === 'resources' && <ResourcesView />}
          </div>
        </div>
      </main>
      
      {/* Overlay for mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </div>
  );
}

// ==========================================
// VIEWS
// ==========================================

function DashboardView({ stats, fact, setView }) {
  const overallProgress = Math.round(((stats.timelineRead.length + (stats.quizHighscore > 0 ? 1 : 0)) / (timelineSteps.length + 1)) * 100);

  const generateLinkedInPost = () => {
    const text = `I just built my civic knowledge using the CivicStep AI Assistant for the #GoogleDevelopers #BuildWithAI Prompt Wars challenge! 🚀\n\nI've reached Level ${stats.level} with ${stats.xp} XP and unlocked ${stats.badges.length} badges. My favorite feature is the ELI5 Gemini AI integration.\n\nCheck out my build journey! 👇\n#AI #React #Hackathon #CivicTech`;
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-2">Welcome to CivicStep!</h2>
          <p className="text-blue-100 text-lg max-w-xl mb-6">Your interactive, AI-powered journey to mastering the democratic process. Perfect for the Prompt Wars challenge.</p>
          <button onClick={() => setView('timeline')} className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-sm">
            Start Learning
          </button>
        </div>
        <Landmark className="absolute right-[-10%] top-[-10%] w-64 h-64 text-white opacity-10 transform -rotate-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Fact Card */}
        <div className="col-span-1 md:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 text-amber-500 mb-3">
            <Star className="w-5 h-5 fill-current" />
            <span className="font-bold uppercase tracking-wider text-sm">Daily Civic Fact</span>
          </div>
          <p className="text-xl font-medium text-slate-800 dark:text-slate-200 leading-relaxed">"{fact}"</p>
        </div>

        {/* Stats Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-blue-500" /> Your Stats
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1 text-slate-600 dark:text-slate-400">
                <span>Overall Journey</span>
                <span className="font-bold">{overallProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${overallProgress}%` }}></div>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
              <span className="text-xs text-slate-500 block mb-2 uppercase font-bold">Unlocked Badges</span>
              <div className="flex flex-wrap gap-2">
                {stats.badges.length > 0 ? stats.badges.map(b => (
                  <span key={b} className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs px-2 py-1 rounded-md font-bold">{b}</span>
                )) : <span className="text-sm text-slate-400 italic">No badges yet. Start exploring!</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Narrative Submission Helper */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-3xl p-6 text-center">
        <h3 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2">Prompt Wars Challenge Tracker</h3>
        <p className="text-sm text-indigo-700 dark:text-indigo-400 mb-4">Complete modules to level up and generate your "Build-in-Public" Narrative post for the challenge submission phase.</p>
        <button 
          onClick={generateLinkedInPost}
          className="inline-flex items-center gap-2 bg-[#0a66c2] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#084e96] transition-colors"
        >
          <Share2 className="w-4 h-4" /> Generate LinkedIn Update
        </button>
      </div>
    </div>
  );
}

function TimelineView({ stats, setStats, awardXP }) {
  const [expandedId, setExpandedId] = useState(null);

  const handleRead = (id, xpAmount) => {
    setExpandedId(expandedId === id ? null : id);
    if (!stats.timelineRead.includes(id)) {
      setTimeout(() => {
        setStats(prev => ({ ...prev, timelineRead: [...prev.timelineRead, id] }));
        awardXP(xpAmount, 'Read timeline step');
      }, 1000); // Delay to simulate actual reading
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Path to the Presidency</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Explore the chronological journey of a US election. Read through all sections to earn the "Historian" badge.
        </p>
      </div>

      <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 md:ml-8 space-y-6 pb-8">
        {timelineSteps.map((step) => {
          const isExpanded = expandedId === step.id;
          const isRead = stats.timelineRead.includes(step.id);

          return (
            <div key={step.id} className="relative pl-8 md:pl-12 group">
              <div 
                className={`absolute left-[-9px] top-4 w-4 h-4 rounded-full border-2 transition-colors duration-300 ${
                  isRead ? 'bg-green-500 border-green-500' : isExpanded ? 'bg-blue-600 border-blue-600' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'
                }`}
              />
              
              <button 
                onClick={() => handleRead(step.id, step.xp)}
                className="w-full text-left outline-none"
              >
                <div className={`bg-white dark:bg-slate-800 rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isExpanded ? 'border-blue-400 shadow-md ring-2 ring-blue-100 dark:ring-blue-900/30' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-sm'
                }`}>
                  <div className="p-5 flex items-start gap-4">
                    <div className={`hidden sm:flex mt-1 p-3 rounded-xl transition-colors ${isExpanded ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{step.title}</span>
                        <div className="flex items-center gap-2">
                          {isRead && <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-md">+{step.xp} XP Done</span>}
                          <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{step.subtitle}</h3>
                      
                      <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-700">
                            {step.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AssistantView({ awardXP }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hello! I'm CivicStep AI powered by Gemini. Ask me anything about voting rules, timelines, or political processes." }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isELI5, setIsELI5] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // stop current speaking
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*#]/g, '')); // Strip markdown
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in this browser.");
    }
  };

  const exportChat = () => {
    const textContent = messages.map(m => `${m.role.toUpperCase()}:\n${m.text}\n\n`).join('');
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CivicStep_Chat_Export.txt';
    a.click();
  };

  const generateGeminiResponse = async (userMessage) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    const baseSystemPrompt = "You are CivicStep AI, an educational assistant helping users understand the democratic election process. Be factual, strictly neutral, and avoid partisan bias.";
    const eli5Modifier = " Explain this like I am a 5-year-old child using simple analogies and very simple words.";
    
    const payload = {
      contents: [{ parts: [{ text: userMessage }] }],
      systemInstruction: { parts: [{ text: baseSystemPrompt + (isELI5 ? eli5Modifier : " Provide concise, structured answers.") }] }
    };

    const delay = ms => new Promise(res => setTimeout(res, ms));
    const backoff = [1000, 2000, 4000, 8000, 16000];

    for (let i = 0; i < 6; i++) {
      try {
        const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error(`HTTP error`);
        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "Error generating response.";
      } catch (err) {
        if (i === 5) return "I'm currently experiencing high API traffic. Please try again later.";
        await delay(backoff[i]);
      }
    }
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const aiResponse = await generateGeminiResponse(userMsg);
    setMessages(prev => [...prev, { role: 'assistant', text: aiResponse }]);
    setIsLoading(false);
    awardXP(5, 'Used AI Assistant'); // Reward usage
  };

  const handlePreset = (q) => {
    setInputText(q);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] min-h-[600px] flex flex-col bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      
      {/* Header Area */}
      <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 p-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">CivicStep Assistant</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Gemini 2.5 Flash</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* ELI5 Toggle */}
          <button 
            onClick={() => setIsELI5(!isELI5)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
              isELI5 ? 'bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-900/50 dark:border-amber-700 dark:text-amber-300' : 'bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300'
            }`}
          >
            ELI5 Mode {isELI5 ? 'ON' : 'OFF'}
          </button>
          
          <button onClick={exportChat} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors" title="Export Chat">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50 dark:bg-slate-900/20">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="flex flex-col gap-1 max-w-[85%] md:max-w-[75%]">
              <div className={`rounded-2xl p-4 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none'
              }`}>
                {/* Simplified markdown rendering for code blocks/bold */}
                <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed" 
                     dangerouslySetInnerHTML={{__html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')}} />
              </div>
              
              {/* TTS Button for Assistant messages */}
              {msg.role === 'assistant' && (
                <button onClick={() => speakText(msg.text)} className="self-start ml-2 text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1 text-xs">
                  <Volume2 className="w-3 h-3" /> Read aloud
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length < 3 && !isLoading && (
        <div className="px-4 py-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex gap-2 overflow-x-auto no-scrollbar">
          {["How does the Electoral College work?", "What is Gerrymandering?", "Difference between primary and caucus?"].map((q, i) => (
            <button key={i} onClick={() => handlePreset(q)} className="whitespace-nowrap text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 px-3 py-2 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
        <form onSubmit={handleSend} className="flex gap-3 relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isELI5 ? "Ask a simple question..." : "Ask about the election process..."}
            className="flex-1 bg-slate-100 dark:bg-slate-900 dark:text-white border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 rounded-xl px-4 py-3 outline-none transition-all duration-200"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[50px] shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

function QuizView({ stats, awardXP, setStats }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showExp, setShowExp] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const handleSelect = (idx) => {
    if (showExp) return;
    setSelectedOpt(idx);
    setShowExp(true);
    
    if (idx === quizData[currentQ].ans) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
      awardXP(20 + (streak * 5), 'Correct Answer Bonus'); // Streak multiplier
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentQ < quizData.length - 1) {
      setCurrentQ(q => q + 1);
      setSelectedOpt(null);
      setShowExp(false);
    } else {
      setQuizDone(true);
      if (score > stats.quizHighscore) {
        setStats(prev => ({ ...prev, quizHighscore: score }));
      }
    }
  };

  if (quizDone) {
    const isPerfect = score === quizData.length;
    return (
      <div className="max-w-2xl mx-auto mt-8 bg-white dark:bg-slate-800 rounded-3xl p-10 text-center shadow-lg border border-slate-200 dark:border-slate-700 relative overflow-hidden">
        {/* Simple CSS Confetti representation if perfect */}
        {isPerfect && <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxjaXJjbGUgY3g9IjEwJSIgY3k9IjEwJSIgcj0iNSIgZmlsbD0iI2ZiYmYyNCIvPjxjaXJjbGUgY3g9IjIwJSIgY3k9IjMwJSIgcj0iNSIgZmlsbD0iIzYwYTVmYSIvPjxjaXJjbGUgY3g9IjgwJSIgY3k9IjIwJSIgcj0iNSIgZmlsbD0iIzM0ZDM5OSIvPjxjaXJjbGUgY3g9IjkwJSIgY3k9IjgwJSIgcj0iNSIgZmlsbD0iI2Y4NzE3MSIvPjwvc3ZnPg==')] opacity-50"></div>}
        
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ${isPerfect ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-500' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'}`}>
          <Trophy className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Quiz Complete!</h2>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
          You scored <span className="font-black text-blue-600 dark:text-blue-400 text-3xl mx-2">{score}</span> / {quizData.length}
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">XP Earned</p>
            <p className="text-2xl font-bold text-green-500">+{score * 20}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Accuracy</p>
            <p className="text-2xl font-bold text-blue-500">{Math.round((score/quizData.length)*100)}%</p>
          </div>
        </div>

        <button onClick={() => { setCurrentQ(0); setScore(0); setStreak(0); setQuizDone(false); setShowExp(false); setSelectedOpt(null); }} className="w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-8 py-4 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-md">
          Retry Knowledge Check
        </button>
      </div>
    );
  }

  const q = quizData[currentQ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Knowledge Check</h2>
          {streak > 1 && <span className="text-sm font-bold text-orange-500 flex items-center gap-1 mt-1"><Zap className="w-4 h-4 fill-current"/> {streak}x Streak!</span>}
        </div>
        <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-bold">
          {currentQ + 1} / {quizData.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mb-8 overflow-hidden">
        <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${((currentQ) / quizData.length) * 100}%` }}></div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 leading-snug">{q.q}</h3>
        
        <div className="space-y-3">
          {q.opts.map((opt, idx) => {
            let btnClass = "w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 font-medium ";
            if (!showExp) btnClass += "border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700";
            else if (idx === q.ans) btnClass += "border-green-500 bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-400";
            else if (idx === selectedOpt) btnClass += "border-red-500 bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-400";
            else btnClass += "border-slate-200 dark:border-slate-700 opacity-50 dark:text-slate-400";

            return (
              <button key={idx} onClick={() => handleSelect(idx)} disabled={showExp} className={btnClass}>
                <div className="flex justify-between items-center">
                  <span className="text-lg">{opt}</span>
                  {showExp && idx === q.ans && <CheckCircle className="w-6 h-6 text-green-500" />}
                </div>
              </button>
            );
          })}
        </div>

        {showExp && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-300 bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
            <p className={`font-black text-lg mb-2 ${selectedOpt === q.ans ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {selectedOpt === q.ans ? '🎯 Spot on!' : '❌ Not quite.'}
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">{q.exp}</p>
            
            <button onClick={handleNext} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 shadow-md">
              {currentQ < quizData.length - 1 ? 'Next Question' : 'View Final Score'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function GlossaryView() {
  const [search, setSearch] = useState('');
  const filtered = glossaryTerms.filter(t => t.term.toLowerCase().includes(search.toLowerCase()) || t.def.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Election Glossary</h2>
        <p className="text-slate-600 dark:text-slate-400">Master the vocabulary of democracy.</p>
      </div>

      <div className="relative mb-8 shadow-sm">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search terms like 'Caucus' or 'PAC'..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-4 text-lg outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((item, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">{item.term}</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{item.def}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-12 text-slate-500 dark:text-slate-400">
            No terms found matching "{search}". Try asking the AI Assistant!
          </div>
        )}
      </div>
    </div>
  );
}

function ResourcesView() {
  const states = ["California", "Texas", "Florida", "New York", "Pennsylvania"];
  const [selectedState, setSelectedState] = useState(states[0]);

  return (
    <div className="max-w-3xl mx-auto">
       <div className="mb-8 text-center">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Voter Resource Hub</h2>
        <p className="text-slate-600 dark:text-slate-400">Simulated resource portal for voter registration deadlines.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 text-center">
        <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-4 dark:text-white">Select Your State</h3>
        <select 
          value={selectedState} 
          onChange={(e) => setSelectedState(e.target.value)}
          className="w-full max-w-xs mx-auto block bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-blue-500 mb-8"
        >
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <div className="grid sm:grid-cols-2 gap-4 text-left">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-800">
             <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-1">Registration Deadline</h4>
             <p className="text-blue-700 dark:text-blue-400">Typically 15-30 days before Election Day in {selectedState}.</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-2xl border border-green-100 dark:border-green-800">
             <h4 className="font-bold text-green-900 dark:text-green-300 mb-1">Early Voting</h4>
             <p className="text-green-700 dark:text-green-400">Rules vary. Check local {selectedState} county websites.</p>
          </div>
        </div>
        
        <button className="mt-8 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3 rounded-xl hover:opacity-90 transition-opacity">
          Simulate Visiting Official .Gov Portal
        </button>
      </div>
    </div>
  );
}
