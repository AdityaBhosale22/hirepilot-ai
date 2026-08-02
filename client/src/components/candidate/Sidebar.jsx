import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, FileText, Sparkles, Target, 
  Video, Bell, User, Settings, Rocket, LogOut, X 
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const navItems = [
    { name: 'Dashboard', path: '/candidate/dashboard', icon: LayoutDashboard },
    { name: 'Browse Jobs', path: '/candidate/jobs', icon: Briefcase },
    { name: 'Applications', path: '/candidate/applications', icon: FileText, badge: '5' },
    { name: 'Resume Builder', path: '/candidate/resume', icon: FileText },
    { name: 'AI Resume Audit', path: '/candidate/resume-ai', icon: Sparkles, highlight: true },
    { name: 'AI Job Matching', path: '/candidate/job-matching', icon: Target },
    { name: 'Interviews', path: '/candidate/interviews', icon: Video, badge: '2' },
    { name: 'Notifications', path: '/candidate/notifications', icon: Bell, badge: '3' },
    { name: 'Profile', path: '/candidate/profile', icon: User },
    { name: 'Settings', path: '/candidate/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-gray-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          {/* Logo Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-gray-800">
            <Link to="/candidate/dashboard" className="flex items-center gap-2">
              <div className="bg-gradient-to-tr from-[#4F46E5] to-[#06B6D4] p-1.5 rounded-lg">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                HirePilot<span className="text-[#06B6D4]">.ai</span>
              </span>
            </Link>
            <button className="lg:hidden text-gray-400 hover:text-white" onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-thin">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#4F46E5]/10 text-[#4F46E5] border border-[#4F46E5]/20 font-semibold'
                        : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${item.highlight ? 'text-[#06B6D4]' : ''}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-gray-800 bg-[#050505]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#4F46E5] to-[#06B6D4] flex items-center justify-center font-bold text-white text-sm">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">John Doe</p>
              <p className="text-xs text-gray-500 truncate">john.doe@example.com</p>
            </div>
          </div>
          <Link
            to="/login"
            className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-red-400 transition-colors w-full px-2 py-1 rounded"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </Link>
        </div>
      </aside>
    </>
  );
}