import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, Clock, Send, Eye, Shield, Bell, HelpCircle, AlertTriangle } from 'lucide-react';

export default function ReminderSettings() {
  const [config, setConfig] = useState({
    userEmail: 'ashraks97@gmail.com',
    wifeEmail: '',
    userName: 'Ashrak & Family',
    smtp: {
      service: 'gmail',
      user: 'ashraks97@gmail.com',
      pass: '',
      isConfigured: false
    },
    schedules: {
      fridayReminder: { enabled: true, time: '09:00', nameId: 27 },
      fajrReminder: { enabled: true, time: '05:30', nameId: 2 },
      thursdayZuhrReminder: { enabled: true, time: '13:00', nameId: 26 }
    }
  });

  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [showSmtpGuide, setShowSmtpGuide] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/reminders/config');
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (err) {
      console.error('Failed to fetch reminder settings:', err);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSaveStatus('');
    try {
      const res = await fetch('/api/reminders/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const data = await res.json();
      if (data.success) {
        setSaveStatus('✅ Settings saved successfully!');
        setTimeout(() => setSaveStatus(''), 4000);
      }
    } catch (err) {
      setSaveStatus('❌ Failed to save settings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendTest = async (type = 'test') => {
    if (!config.userEmail) {
      alert('Please enter your email address first!');
      return;
    }
    setLoading(true);
    setTestResult(null);
    try {
      const endpoint = type === 'friday' ? '/api/reminders/trigger-friday' : '/api/reminders/send-test';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetEmail: config.userEmail, nameId: 27 })
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({ success: false, mode: 'error', error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-neutral-900 to-emerald-950/60 border border-amber-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Mail className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-100">
                Personal Email Reminder Center
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300">
              Receive automated reminders for Friday continuous recitations and post-prayer wazaif with exact counts and benefits from the book.
            </p>
          </div>
          <span className="hidden sm:inline-block text-xs px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
            Active System
          </span>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal Email Info & Schedules */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Email Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              1. Family Email Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Your Email Address (Husband) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="ashraks97@gmail.com"
                  value={config.userEmail || ''}
                  onChange={(e) => setConfig({ ...config, userEmail: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-sm focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Wife's Email Address (Co-Recipient)
                </label>
                <input
                  type="email"
                  placeholder="wife@gmail.com"
                  value={config.wifeEmail || ''}
                  onChange={(e) => setConfig({ ...config, wifeEmail: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-sm focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Greeting / Family Name
                </label>
                <input
                  type="text"
                  placeholder="Ashrak & Family"
                  value={config.userName || ''}
                  onChange={(e) => setConfig({ ...config, userName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-sm focus:outline-none focus:border-amber-400"
                />
                <p className="text-[11px] text-neutral-400 mt-1.5">
                  💡 When both emails are configured, every Friday and post-prayer wazifa reminder will be dispatched to <strong>both of you simultaneously</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Preset Reminder Schedules */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-5">
            <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              2. Configured Reminder Schedules
            </h3>

            {/* Friday Reminder */}
            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <strong className="text-neutral-100 text-sm">🌟 Friday Continuous Wazifa Reminder</strong>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">Every Friday 09:00 AM</span>
                </div>
                <p className="text-xs text-neutral-400">
                  Prescription: <strong>AL-BASIR</strong> (100x between Farz & Sunnah for esteem) & <strong>AL-AWWAL</strong> (1,000x for 40 Fridays to have a child or reunion with a traveler).
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={config.schedules?.fridayReminder?.enabled ?? true}
                  onChange={(e) => setConfig({
                    ...config,
                    schedules: {
                      ...config.schedules,
                      fridayReminder: { ...config.schedules.fridayReminder, enabled: e.target.checked }
                    }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {/* Daily Fajr Reminder */}
            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <strong className="text-neutral-100 text-sm">🌅 Daily Post-Fajr Wazifa Reminder</strong>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">Daily at Dawn (05:30 AM)</span>
                </div>
                <p className="text-xs text-neutral-400">
                  Prescription: <strong>AR-RAHIM</strong> (100x after Fajr prayer for friendly treatment from everyone) & <strong>AR-RAHMAN</strong> (100x for sharp memory).
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={config.schedules?.fajrReminder?.enabled ?? true}
                  onChange={(e) => setConfig({
                    ...config,
                    schedules: {
                      ...config.schedules,
                      fajrReminder: { ...config.schedules.fajrReminder, enabled: e.target.checked }
                    }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {/* Thursday Zuhr Reminder */}
            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <strong className="text-neutral-100 text-sm">☀️ Thursday Silent Post-Zuhr Reminder</strong>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold">Every Thursday 01:00 PM</span>
                </div>
                <p className="text-xs text-neutral-400">
                  Prescription: <strong>AS-SAMI'</strong> (100x after Zuhr in complete silence without speaking to anyone for fulfillment of any desire).
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={config.schedules?.thursdayZuhrReminder?.enabled ?? true}
                  onChange={(e) => setConfig({
                    ...config,
                    schedules: {
                      ...config.schedules,
                      thursdayZuhrReminder: { ...config.schedules.thursdayZuhrReminder, enabled: e.target.checked }
                    }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm transition shadow-lg disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Reminder Preferences'}
            </button>
            {saveStatus && <span className="text-xs font-semibold">{saveStatus}</span>}
          </div>
        </div>

        {/* Right Column: Actions & SMTP Configuration */}
        <div className="space-y-6">
          {/* Quick Dispatch & Test Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-400" />
              Test & Instant Delivery
            </h3>
            <p className="text-xs text-neutral-400">
              Test your email notification immediately or trigger the Friday wazifa reminder on-demand.
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleSendTest('friday')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition"
              >
                <Sparkles className="w-4 h-4" />
                Trigger Friday Reminder Now
              </button>

              <button
                type="button"
                onClick={() => handleSendTest('test')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition border border-neutral-700"
              >
                <Send className="w-4 h-4" />
                Send General Test Reminder
              </button>

              <a
                href="/api/reminders/preview-latest"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold transition border border-neutral-800"
              >
                <Eye className="w-4 h-4" />
                Preview Last Email in Browser
              </a>
            </div>

            {/* Test result message */}
            {testResult && (
              <div className={`p-3 rounded-xl text-xs ${testResult.success ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-200' : 'bg-red-950/60 border border-red-500/30 text-red-200'}`}>
                <div className="font-semibold mb-1">
                  {testResult.mode === 'sent' ? '🎉 Real Email Dispatched!' : testResult.mode === 'preview' ? '📄 Saved to Local Preview!' : '❌ Delivery Notice'}
                </div>
                <p className="leading-relaxed">{testResult.message || testResult.error}</p>
                {testResult.mode === 'preview' && (
                  <a
                    href="/api/reminders/preview-latest"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-2 text-amber-300 underline font-semibold"
                  >
                    Click here to open and view the email preview →
                  </a>
                )}
              </div>
            )}
          </div>

          {/* SMTP Credentials Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                Live Email Dispatch (SMTP)
              </h3>
              <button
                type="button"
                onClick={() => setShowSmtpGuide(!showSmtpGuide)}
                className="text-neutral-400 hover:text-amber-400"
                title="Help"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              To send real emails to your inbox automatically, enter your Gmail address and 16-character Google App Password below.
            </p>

            {showSmtpGuide && (
              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-300 space-y-1.5">
                <strong className="text-amber-400 block">How to get a Gmail App Password:</strong>
                <ol className="list-decimal list-inside space-y-1 text-neutral-400">
                  <li>Go to <code>myaccount.google.com/security</code></li>
                  <li>Enable 2-Step Verification if not active</li>
                  <li>Search for <strong>"App passwords"</strong></li>
                  <li>Create one named <em>99NamesApp</em> and copy the 16 letters</li>
                </ol>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Sender Gmail
                </label>
                <input
                  type="email"
                  placeholder="youraccount@gmail.com"
                  value={config.smtp?.user || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    smtp: { ...config.smtp, user: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Gmail 16-Char App Password
                </label>
                <input
                  type="password"
                  placeholder="xxxx xxxx xxxx xxxx"
                  value={config.smtp?.pass || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    smtp: { ...config.smtp, pass: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <p className="text-[11px] text-neutral-500">
              * Note: Your credentials stay completely local on your machine in <code>backend/data/reminders_config.json</code>.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

function Sparkles({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  );
}
