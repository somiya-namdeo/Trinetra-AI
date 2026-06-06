import React, { useState } from 'react';
import { Megaphone, Languages, Loader2, CheckCircle2 } from 'lucide-react';
import { generateAlert } from '../../services/api';

const EmergencyBroadcast = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [broadcast, setBroadcast] = useState({
    english: "ATTENTION: High crowd density near North Gate. Please use East Entry or Gate 4B. Emergency services are active.",
    hindi: "ध्यान दें: उत्तरी गेट के पास भारी भीड़ है। कृपया पूर्वी प्रवेश द्वार या गेट 4B का उपयोग करें।"
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    setIsGenerated(false);
    
    try {
      const response = await generateAlert({
        incident_type: "Fire Hazard Escalation",
        location: "Food Court",
        severity: "Critical"
      });
      if (response && response.english && response.hindi) {
        setBroadcast({ english: response.english, hindi: response.hindi });
        setIsGenerated(true);
      }
    } catch (error) {
      console.error("Error generating broadcast", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="glass-card flex flex-col h-full">
      <div className="p-4 border-b border-cardBorder flex justify-between items-center">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Megaphone size={16} className="text-warning" />
          Emergency Broadcast
        </h3>
        {isGenerated && <span className="text-[10px] text-safe font-mono flex items-center gap-1 bg-safe/10 px-2 py-0.5 rounded border border-safe/20"><CheckCircle2 size={10}/> Generated just now by Trinetra AI</span>}
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="bg-card/80 border border-cardBorder rounded p-3">
          <div className="flex items-center gap-2 mb-1 text-xs text-gray-400">
            <Languages size={12} />
            <span>English {isGenerated ? '(AI Generated)' : '(Auto-generated)'}</span>
          </div>
          <p className="text-xs text-gray-200">{broadcast.english}</p>
        </div>
        <div className="bg-card/80 border border-cardBorder rounded p-3">
          <div className="flex items-center gap-2 mb-1 text-xs text-gray-400">
            <Languages size={12} />
            <span>Hindi {isGenerated ? '(AI Generated)' : '(Auto-generated)'}</span>
          </div>
          <p className="text-xs text-gray-200">{broadcast.hindi}</p>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="btn-primary w-full mt-auto py-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : 'Generate Broadcast'}
        </button>
      </div>
    </div>
  );
};

export default EmergencyBroadcast;
