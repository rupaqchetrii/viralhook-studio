import React, { useState } from 'react';
import {
  X, Sun, Moon, Monitor, LogOut, User, Mail, Bell, BellOff,
  Type, Palette, Info, ChevronRight, Shield, Trash2, RefreshCw,
  Volume2, VolumeX, Flame, Check,
} from 'lucide-react';
import { useHookStore } from '../../store/useHookStore';

function SectionTitle({ children }) {
  return (
    <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#9E9EA7] dark:text-[#555566]">
      {children}
    </div>
  );
}

function SettingsRow({ icon: Icon, label, sublabel, children, onClick, danger }) {
  const base =
    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ' +
    (danger
      ? 'hover:bg-rose-50 dark:hover:bg-rose-900/20 group'
      : 'hover:bg-[#F8F7F4] dark:hover:bg-white/5');

  return (
    <div className={base} onClick={onClick}>
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          danger
            ? 'bg-rose-50 dark:bg-rose-900/30'
            : 'bg-[#F3F3F6] dark:bg-white/10'
        }`}
      >
        <Icon
          className={`w-4 h-4 ${
            danger ? 'text-rose-500' : 'text-[#6E6D7A] dark:text-[#9E9EA7]'
          }`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div
          className={`text-sm font-semibold ${
            danger ? 'text-rose-600 dark:text-rose-400' : 'text-[#0D0C22] dark:text-white'
          }`}
        >
          {label}
        </div>
        {sublabel && (
          <div className="text-[11px] text-[#9E9EA7] dark:text-[#666677] mt-0.5 truncate">
            {sublabel}
          </div>
        )}
      </div>
      {children && <div className="shrink-0">{children}</div>}
      {!children && onClick && (
        <ChevronRight className="w-4 h-4 text-[#9E9EA7] dark:text-[#666677] shrink-0" />
      )}
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onChange(!checked); }}
      className={`relative w-10 h-6 rounded-full transition-all duration-200 ${
        checked ? 'bg-[#EA4C89]' : 'bg-[#E7E7E9] dark:bg-[#333344]'
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export function SettingsPanel() {
  const {
    settingsPanelOpen, setSettingsPanelOpen,
    theme, setTheme,
    fontSize, setFontSize,
    userName, setUserName,
    userEmail, setUserEmail,
    isLoggedIn, logout, loginBack,
    clearAllHistory, battleHistory,
  } = useHookStore();

  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [nameVal, setNameVal] = useState(userName);
  const [emailVal, setEmailVal] = useState(userEmail);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  if (!settingsPanelOpen) return null;

  const handleLogout = () => {
    if (!confirmLogout) { setConfirmLogout(true); return; }
    logout();
    setSettingsPanelOpen(false);
    setConfirmLogout(false);
  };

  const handleClearHistory = () => {
    if (!confirmClear) { setConfirmClear(true); return; }
    clearAllHistory();
    setConfirmClear(false);
  };

  const saveProfile = () => {
    setUserName(nameVal);
    setUserEmail(emailVal);
    setEditingName(false);
    setEditingEmail(false);
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const fontSizes = ['small', 'medium', 'large'];

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-[#0D0C22]/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => { setSettingsPanelOpen(false); setConfirmLogout(false); setConfirmClear(false); }}
    >
      <div
        className="absolute inset-y-0 right-0 max-w-full flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Panel */}
        <div className="w-screen max-w-sm bg-white dark:bg-[#0F0F1A] border-l border-[#E7E7E9] dark:border-white/10 shadow-2xl flex flex-col">

          {/* Header */}
          <div className="px-5 py-5 border-b border-[#E7E7E9] dark:border-white/10 flex items-center justify-between bg-white dark:bg-[#0F0F1A]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FDF2F7] dark:bg-[#EA4C89]/20 flex items-center justify-center">
                <Flame className="w-4 h-4 text-[#EA4C89]" />
              </div>
              <div>
                <h2 className="text-sm font-black text-[#0D0C22] dark:text-white tracking-tight">Settings</h2>
                <p className="text-[11px] text-[#9E9EA7] dark:text-[#666677]">ViralHook Studio</p>
              </div>
            </div>
            <button
              onClick={() => setSettingsPanelOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-[#F3F3F6] dark:hover:bg-white/10 flex items-center justify-center text-[#6E6D7A] dark:text-[#9E9EA7] hover:text-[#0D0C22] dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto py-3">

            {/* Profile Section */}
            <SectionTitle>Profile</SectionTitle>
            <div className="mx-3 mb-2 p-4 rounded-2xl bg-[#F8F7F4] dark:bg-white/5 border border-[#E7E7E9] dark:border-white/10">
              <div className="flex items-center gap-3 mb-3">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#EA4C89] to-[#0D0C22] flex items-center justify-center text-white font-black text-lg select-none shrink-0">
                  {(userName || 'C')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  {editingName ? (
                    <input
                      autoFocus
                      value={nameVal}
                      onChange={(e) => setNameVal(e.target.value)}
                      onBlur={saveProfile}
                      onKeyDown={(e) => e.key === 'Enter' && saveProfile()}
                      className="w-full text-sm font-bold bg-white dark:bg-[#1A1A2E] border border-[#EA4C89] rounded-lg px-2 py-1 text-[#0D0C22] dark:text-white outline-none"
                    />
                  ) : (
                    <button
                      onClick={() => setEditingName(true)}
                      className="text-sm font-bold text-[#0D0C22] dark:text-white hover:text-[#EA4C89] transition-colors text-left"
                    >
                      {userName}
                    </button>
                  )}
                  {editingEmail ? (
                    <input
                      autoFocus
                      value={emailVal}
                      onChange={(e) => setEmailVal(e.target.value)}
                      onBlur={saveProfile}
                      onKeyDown={(e) => e.key === 'Enter' && saveProfile()}
                      className="w-full text-[11px] mt-0.5 bg-white dark:bg-[#1A1A2E] border border-[#EA4C89] rounded-lg px-2 py-0.5 text-[#6E6D7A] dark:text-[#9E9EA7] outline-none"
                    />
                  ) : (
                    <button
                      onClick={() => setEditingEmail(true)}
                      className="text-[11px] text-[#6E6D7A] dark:text-[#9E9EA7] hover:text-[#EA4C89] transition-colors text-left truncate block w-full mt-0.5"
                    >
                      {userEmail}
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                  {isLoggedIn ? 'Active Session' : 'Logged out'}
                </span>
                <span className="text-[11px] text-[#9E9EA7] dark:text-[#666677] ml-1">•</span>
                <span className="text-[11px] text-[#9E9EA7] dark:text-[#666677]">Group M B.Tech</span>
              </div>
            </div>

            {/* Appearance */}
            <SectionTitle>Appearance</SectionTitle>

            {/* Theme Picker */}
            <div className="mx-3 mb-1 p-3 rounded-2xl bg-[#F8F7F4] dark:bg-white/5 border border-[#E7E7E9] dark:border-white/10">
              <div className="text-xs font-semibold text-[#6E6D7A] dark:text-[#9E9EA7] mb-2.5 px-1">
                Color Theme
              </div>
              <div className="grid grid-cols-3 gap-2">
                {themeOptions.map(({ value, label, icon: Icon }) => {
                  const active = theme === value;
                  return (
                    <button
                      key={value}
                      onClick={() => setTheme(value)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                        active
                          ? 'bg-[#EA4C89] border-[#EA4C89] text-white shadow-md shadow-[#EA4C89]/30'
                          : 'bg-white dark:bg-white/5 border-[#E7E7E9] dark:border-white/10 text-[#6E6D7A] dark:text-[#9E9EA7] hover:border-[#EA4C89]/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[11px] font-bold">{label}</span>
                      {active && <Check className="w-3 h-3" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Font Size */}
            <div className="mx-3 mb-3 p-3 rounded-2xl bg-[#F8F7F4] dark:bg-white/5 border border-[#E7E7E9] dark:border-white/10">
              <div className="text-xs font-semibold text-[#6E6D7A] dark:text-[#9E9EA7] mb-2.5 px-1 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5" /> Font Size
              </div>
              <div className="flex gap-2">
                {fontSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`flex-1 py-1.5 rounded-full text-[11px] font-bold capitalize border transition-all ${
                      fontSize === size
                        ? 'bg-[#0D0C22] dark:bg-white text-white dark:text-[#0D0C22] border-[#0D0C22] dark:border-white'
                        : 'bg-white dark:bg-white/5 border-[#E7E7E9] dark:border-white/10 text-[#6E6D7A] dark:text-[#9E9EA7] hover:border-[#0D0C22] dark:hover:border-white/40'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <SectionTitle>Preferences</SectionTitle>
            <div className="mx-3 rounded-2xl border border-[#E7E7E9] dark:border-white/10 overflow-hidden mb-3">
              <SettingsRow
                icon={notifications ? Bell : BellOff}
                label="Notifications"
                sublabel="Battle result alerts"
              >
                <Toggle checked={notifications} onChange={setNotifications} />
              </SettingsRow>
              <div className="border-t border-[#E7E7E9] dark:border-white/10" />
              <SettingsRow
                icon={sounds ? Volume2 : VolumeX}
                label="Sound Effects"
                sublabel="UI feedback sounds"
              >
                <Toggle checked={sounds} onChange={setSounds} />
              </SettingsRow>
            </div>

            {/* About */}
            <SectionTitle>Studio Info</SectionTitle>
            <div className="mx-3 rounded-2xl border border-[#E7E7E9] dark:border-white/10 overflow-hidden mb-3">
              <SettingsRow icon={Info} label="About ViralHook Studio" sublabel="v3.0 • Day 3 Build" />
              <div className="border-t border-[#E7E7E9] dark:border-white/10" />
              <SettingsRow icon={Shield} label="Privacy & Disclaimer" sublabel="All inference runs locally • No data sent" />
              <div className="border-t border-[#E7E7E9] dark:border-white/10" />
              <SettingsRow
                icon={RefreshCw}
                label="Reset to Defaults"
                sublabel="Clear settings, keep history"
                onClick={() => { setTheme('light'); setFontSize('medium'); }}
              />
            </div>

            {/* Danger Zone */}
            <SectionTitle>Danger Zone</SectionTitle>
            <div className="mx-3 rounded-2xl border border-rose-100 dark:border-rose-900/30 overflow-hidden mb-3">
              <SettingsRow
                icon={Trash2}
                label={confirmClear ? '⚠️ Tap again to confirm' : `Clear Battle History`}
                sublabel={`${battleHistory.length} saved battles will be deleted`}
                danger
                onClick={handleClearHistory}
              />
              <div className="border-t border-rose-100 dark:border-rose-900/30" />
              <SettingsRow
                icon={LogOut}
                label={confirmLogout ? '⚠️ Tap again to confirm logout' : 'Log Out'}
                sublabel="End session and clear workspace"
                danger
                onClick={handleLogout}
              />
            </div>

          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-[#E7E7E9] dark:border-white/10 bg-[#F8F7F4] dark:bg-[#0F0F1A]/80 text-center">
            <p className="text-[11px] text-[#9E9EA7] dark:text-[#555566]">
              ViralHook Studio • Group M B.Tech • Nov 2026
            </p>
            <p className="text-[10px] text-[#9E9EA7]/70 dark:text-[#444455] mt-0.5">
              Mentor: Prof. Megha Gupta
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
