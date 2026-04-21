import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import { apiRequest } from '../utils/api';

const POLL_INTERVAL = 15000;

function NotificationBell({ inSidebar = false }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => !n.read).length
    : 0;

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await apiRequest('/api/notifications');
      setNotifications(data?.data || []);
    } catch {
      // Silently fail
    }
  }, []);

  const socket = useSocket();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (socket) {
      const handleNew = (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      };
      socket.on('new_notification', handleNew);
      return () => socket.off('new_notification', handleNew);
    }
  }, [socket]);

  // Close on outside click (only relevant in header mode)
  useEffect(() => {
    if (inSidebar) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [inSidebar]);

  const markAsRead = async (id) => {
    try {
      await apiRequest(`/api/notifications/${id}/read`, { method: 'PUT' });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch { /* ignore */ }
  };

  const markAllAsRead = async () => {
    try {
      await apiRequest('/api/notifications/read-all', { method: 'PUT' });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch { /* ignore */ }
  };

  const formatTime = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const handleAcceptRequest = async (e, n) => {
    e.stopPropagation();
    if (!n.request) return;
    try {
      const requestId = typeof n.request === 'object' ? n.request._id : n.request;
      await apiRequest(`/api/request/${requestId}/accept`, { method: 'POST' });
      await markAsRead(n._id);
    } catch (err) {
      console.error('Failed to accept request:', err);
    }
  };

  // ── Shared notification item rendering ──────────────────────────────
  const NotificationItems = () => (
    <>
      {(!Array.isArray(notifications) || notifications.length === 0) ? (
        <div className="py-10 text-center">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${inSidebar ? 'bg-white/10' : 'bg-gray-100'}`}>
            <svg className={`w-6 h-6 ${inSidebar ? 'text-white/30' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
          <p className={`text-sm font-semibold ${inSidebar ? 'text-white/40' : 'text-gray-400'}`}>
            No notifications yet
          </p>
          <p className={`text-xs mt-1 ${inSidebar ? 'text-white/20' : 'text-gray-300'}`}>
            Blood requests will appear here
          </p>
        </div>
      ) : (
        notifications.map((n) => (
          <div
            key={n._id}
            onClick={() => !n.read && markAsRead(n._id)}
            className={`px-5 py-4 cursor-pointer transition-all duration-200 ${
              inSidebar
                ? !n.read
                  ? 'bg-red-600/20 border-l-4 border-l-red-400 hover:bg-red-600/30'
                  : 'border-l-4 border-l-transparent hover:bg-white/5'
                : !n.read
                  ? 'bg-red-50 border-l-4 border-l-red-500 hover:bg-red-50/80'
                  : 'bg-white border-l-4 border-l-transparent hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
                !n.read ? 'bg-red-600 shadow-lg shadow-red-500/30' : inSidebar ? 'bg-white/15' : 'bg-gray-200'
              }`}>
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                </svg>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={`inline-block px-2 py-0.5 text-[11px] font-black rounded-md uppercase tracking-wide ${
                    !n.read
                      ? 'bg-red-600 text-white'
                      : inSidebar ? 'bg-white/20 text-white/70' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {n.bloodGroup}
                  </span>
                  <span className={`text-[11px] font-medium flex-shrink-0 ${inSidebar ? 'text-white/40' : 'text-gray-400'}`}>
                    {formatTime(n.createdAt)}
                  </span>
                </div>
                <p className={`text-sm leading-snug ${
                  !n.read
                    ? inSidebar ? 'text-white font-semibold' : 'text-gray-900 font-semibold'
                    : inSidebar ? 'text-white/50' : 'text-gray-500'
                }`}>
                  {n.message}
                </p>

                {/* Accept Button */}
                {!n.read && n.request && (
                  <div className="mt-2.5">
                    <button
                      onClick={(e) => handleAcceptRequest(e, n)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-lg shadow-sm transition-all duration-200 active:scale-95"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                      Accept Request
                    </button>
                  </div>
                )}
              </div>

              {/* Unread dot */}
              {!n.read && (
                <div className="flex-shrink-0 w-2 h-2 bg-red-400 rounded-full mt-1.5 shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
              )}
            </div>
          </div>
        ))
      )}
    </>
  );

  // ── SIDEBAR MODE: inline expandable accordion ──────────────────────
  if (inSidebar) {
    return (
      <div className="w-full">
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between px-6 py-4 text-white/60 hover:text-white hover:bg-white/5 transition-all"
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="font-bold text-sm">Notifications</span>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-black rounded-full animate-pulse">
                {unreadCount}
              </span>
            )}
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {open && (
          <div className="mx-4 mb-3 rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0f]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <span className="text-xs font-black text-white/40 uppercase tracking-widest">Recent</span>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-[11px] font-bold text-red-400 hover:text-red-300 transition-colors">
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-white/10">
              <NotificationItems />
            </div>
            {notifications.length > 0 && (
              <div className="px-4 py-2.5 border-t border-white/10 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-[10px] text-white/30 font-semibold">
                  Live · {notifications.length} total
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── HEADER MODE: floating dropdown ───────────────────────────────────
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group"
        aria-label="Notifications"
      >
        <svg className="w-6 h-6 transform group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-lg shadow-red-500/50 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden z-50">
          <div className="flex items-center justify-between px-5 py-4 bg-gray-900 text-white">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
              </svg>
              <h3 className="font-black text-sm tracking-wide">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-black rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs font-bold text-gray-400 hover:text-white transition-colors">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-[420px] overflow-y-auto divide-y divide-gray-100">
            <NotificationItems />
          </div>
          {notifications.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <p className="text-xs text-gray-500 font-semibold">
                Live · {notifications.length} total notification{notifications.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
