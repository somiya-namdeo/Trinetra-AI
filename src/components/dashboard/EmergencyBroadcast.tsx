import React from 'react';
import { Megaphone, Languages } from 'lucide-react';

const EmergencyBroadcast = () => {
  return (
    <div className="glass-card flex flex-col h-full">
      <div className="p-4 border-b border-cardBorder">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Megaphone size={16} className="text-warning" />
          Emergency Broadcast
        </h3>
      </div>
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div className="bg-card/80 border border-cardBorder rounded p-3">
          <div className="flex items-center gap-2 mb-1 text-xs text-gray-400">
            <Languages size={12} />
            <span>English (Auto-generated)</span>
          </div>
          <p className="text-xs text-gray-200">ATTENTION: High crowd density near North Gate. Please use East Entry or Gate 4B. Emergency services are active.</p>
        </div>
        <div className="bg-card/80 border border-cardBorder rounded p-3">
          <div className="flex items-center gap-2 mb-1 text-xs text-gray-400">
            <Languages size={12} />
            <span>Hindi (Auto-generated)</span>
          </div>
          <p className="text-xs text-gray-200">ध्यान दें: उत्तरी गेट के पास भारी भीड़ है। कृपया पूर्वी प्रवेश द्वार या गेट 4B का उपयोग करें।</p>
        </div>
        <button className="btn-primary w-full mt-auto py-2">
          Generate Broadcast
        </button>
      </div>
    </div>
  );
};

export default EmergencyBroadcast;
