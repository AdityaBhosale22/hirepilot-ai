import React from 'react';
import { Bell, Sparkles, CheckCircle2, MessageSquare } from 'lucide-react';

export default function NotificationList({ notifications }) {
  if (!notifications || notifications.length === 0) {
    return (
      <div className="p-12 text-center bg-[#0a0a0a] border border-gray-800 rounded-xl">
        <Bell className="w-10 h-10 text-gray-600 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-white">No new notifications</h3>
        <p className="text-xs text-gray-500 mt-1">You're all caught up with your applications!</p>
      </div>
    );
  }

  const getIcon = (type) => {
    switch(type) {
      case 'ai': return <Sparkles className="w-4 h-4 text-[#06B6D4]" />;
      case 'interview': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default: return <MessageSquare className="w-4 h-4 text-[#4F46E5]" />;
    }
  };

  return (
    <div className="divide-y divide-gray-800 border border-gray-800 bg-[#0a0a0a] rounded-xl overflow-hidden">
      {notifications.map((item) => (
        <div key={item.id} className={`p-4 flex gap-4 hover:bg-gray-900/50 transition-colors ${!item.read ? 'bg-[#4F46E5]/5' : ''}`}>
          <div className="p-2 rounded-lg bg-gray-900 border border-gray-800 h-fit">
            {getIcon(item.type)}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-white">{item.title}</h4>
              <span className="text-[10px] text-gray-500">{item.time}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">{item.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}