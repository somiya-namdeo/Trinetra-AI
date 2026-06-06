import React, { useState, useEffect } from 'react';
import { Copy, Radio, Volume2, MessageSquare, Smartphone, Monitor, CheckCircle2, Sparkles, CheckSquare, Loader2 } from 'lucide-react';
import { generateAlert, getAlerts } from '../services/api';

const Alerts = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [alertData, setAlertData] = useState<{ english: string, hindi: string } | null>(null);
  const [alertsList, setAlertsList] = useState<any[]>([]);
  
  const [isEditingEn, setIsEditingEn] = useState(false);
  const [isEditingHi, setIsEditingHi] = useState(false);
  const [enText, setEnText] = useState("");
  const [hiText, setHiText] = useState("");
  const [toastMessage, setToastMessage] = useState<{ show: boolean, msg: string }>({ show: false, msg: '' });
  
  const [selectedChannels, setSelectedChannels] = useState<Record<string, boolean>>({
    pa: true, sms: true, app: true, sign: true
  });

  useEffect(() => {
    const fetchRecentAlerts = async () => {
      const data = await getAlerts();
      if (data && Array.isArray(data) && data.length > 0) {
        setAlertsList(data);
      } else {
        setAlertsList([
          { time: '14:21', alert: 'Hydration reminder — Zone A', channels: 'PA · SMS · App', reach: '1.26M', status: 'DELIVERED' },
          { time: '13:48', alert: 'Gate 7 reroute notice', channels: 'PA · Signage', reach: '32K', status: 'DELIVERED' },
          { time: '13:12', alert: 'Lost child reunified', channels: 'App', reach: '1.2M', status: 'DELIVERED' },
          { time: '12:38', alert: 'Heatwave advisory', channels: 'All channels', reach: '1.26M', status: 'DELIVERED' },
          { time: '11:45', alert: 'Stage 2 schedule shift', channels: 'App · SMS', reach: '1.24M', status: 'DELIVERED' },
          { time: '10:15', alert: 'Welcome announcement', channels: 'PA', reach: 'All zones', status: 'DELIVERED' }
        ]);
      }
    };
    fetchRecentAlerts();
  }, []);

  useEffect(() => {
    if (alertData) {
      setEnText(alertData.english);
      setHiText(alertData.hindi);
    }
  }, [alertData]);

  const showToast = (msg: string) => {
    setToastMessage({ show: true, msg });
    setTimeout(() => setToastMessage({ show: false, msg: '' }), 3000);
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    showToast(`Copied ${type === 'en' ? 'English' : 'Hindi'} text`);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    const data = await generateAlert({
      incident_type: "Heat Stress Cluster",
      location: "Zone A",
      severity: "Critical"
    });
    if (data) {
      setAlertData(data);
      const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      setAlertsList([{ time, alert: 'AI Generated Alert: Heat Stress Cluster', channels: 'Pending', reach: '-', status: 'DRAFT' }, ...alertsList]);
    }
    setIsGenerating(false);
  };

  const handleSaveDraft = () => {
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    setAlertsList([{ time, alert: 'Saved Draft Alert', channels: 'Pending', reach: '-', status: 'DRAFT' }, ...alertsList]);
    showToast("Draft saved");
  };

  const handleBroadcastNow = () => {
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const chans = Object.keys(selectedChannels).filter(k => selectedChannels[k]).map(k => k.toUpperCase()).join(' · ');
    const reach = Object.keys(selectedChannels).filter(k => selectedChannels[k]).length * 32000;
    setAlertsList([{ time, alert: 'Emergency Broadcast', channels: chans || 'None', reach: reach > 0 ? `${(reach/1000).toFixed(0)}K` : '-', status: 'BROADCASTED' }, ...alertsList]);
    showToast("Broadcast sent successfully");
  };

  const handleIndividualBroadcast = (lang: string) => {
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    setAlertsList([{ time, alert: `Broadcasted (${lang})`, channels: 'PA', reach: 'Local', status: 'BROADCASTED' }, ...alertsList]);
    showToast(`Broadcasted ${lang} successfully`);
  };

  const englishAlert = enText || "URGENT — ZONE A NOTICE: Due to a temporary water-supply issue and rising temperatures, please move to shaded rest areas in Zone B or Zone C. Free hydration is available at stations B-12 and C-04. Medical staff are on site. Stay calm and follow steward instructions.";
  const hindiAlert = hiText || "तत्काल सूचना — ज़ोन ए: पानी की अस्थायी समस्या और बढ़ते तापमान के कारण, कृपया ज़ोन बी या ज़ोन सी के छायादार विश्राम क्षेत्रों में जाएं। B-12 और C-04 स्टेशनों पर निःशुल्क पेयजल उपलब्ध है। चिकित्सा दल मौके पर मौजूद है। शांत रहें और स्वयंसेवकों के निर्देशों का पालन करें।";

  return (
    <div className="flex flex-col gap-6 pb-10">
      
      {/* Toast Notification */}
      {toastMessage.show && (
        <div className="fixed top-8 right-8 z-50 transition-all duration-300">
          <div className="bg-safe/90 border border-safe text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 backdrop-blur-md">
            <CheckCircle2 size={20} />
            <span className="text-sm font-medium">{toastMessage.msg}</span>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Alerts & Communication</h1>
          <p className="text-sm text-gray-400">AI-drafted multilingual announcements ready for broadcast.</p>
        </div>
        <div>
          <div className="flex gap-3 items-center">
            <div className="bg-primary/10 border border-primary/30 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <Sparkles size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary">
                {alertData ? 'Generated just now by Trinetra AI' : 'Generated for INC-2041 · Heat Stress Cluster'}
              </span>
            </div>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-primary hover:bg-primary/90 text-white font-bold py-1.5 px-4 rounded-lg transition-colors flex items-center gap-2 text-xs shadow-[0_0_10px_rgba(14,165,233,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isGenerating ? <><Loader2 size={14} className="animate-spin" /> Generating...</> : <><Sparkles size={14} /> Generate AI Alert</>}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: AI Alert Generator (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* English Card */}
        <div className="glass-card p-5 flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="font-bold text-white text-sm">English · EN</h3>
              <p className="text-[10px] text-gray-400">AI-generated · review before broadcast</p>
            </div>
            <button 
              onClick={() => handleCopy(englishAlert, 'en')}
              className="flex items-center gap-1.5 text-xs text-gray-300 bg-card border border-cardBorder hover:bg-cardBorder/50 px-3 py-1.5 rounded transition-colors"
            >
              {copied === 'en' ? <CheckCircle2 size={14} className="text-safe" /> : <Copy size={14} />}
              {copied === 'en' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className={`flex-1 bg-background/50 border rounded-lg p-4 mb-4 transition-colors ${isEditingEn ? 'border-primary/50' : 'border-cardBorder'}`}>
            <textarea 
              disabled={!isEditingEn}
              value={englishAlert}
              onChange={(e) => setEnText(e.target.value)}
              className={`w-full h-[120px] bg-transparent text-gray-200 text-sm focus:outline-none resize-none leading-relaxed ${isEditingEn ? 'opacity-100' : 'opacity-80'}`}
            />
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => handleIndividualBroadcast('EN')}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(14,165,233,0.3)]"
            >
              <Radio size={16} /> Broadcast
            </button>
            <button 
              onClick={() => setIsEditingEn(!isEditingEn)}
              className="bg-card hover:bg-cardBorder/50 border border-cardBorder text-gray-300 font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              {isEditingEn ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>

        {/* Hindi Card */}
        <div className="glass-card p-5 flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="font-bold text-white text-sm">Hindi · हिन्दी</h3>
              <p className="text-[10px] text-gray-400">AI-generated · review before broadcast</p>
            </div>
            <button 
              onClick={() => handleCopy(hindiAlert, 'hi')}
              className="flex items-center gap-1.5 text-xs text-gray-300 bg-card border border-cardBorder hover:bg-cardBorder/50 px-3 py-1.5 rounded transition-colors"
            >
              {copied === 'hi' ? <CheckCircle2 size={14} className="text-safe" /> : <Copy size={14} />}
              {copied === 'hi' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className={`flex-1 bg-background/50 border rounded-lg p-4 mb-4 transition-colors ${isEditingHi ? 'border-primary/50' : 'border-cardBorder'}`}>
            <textarea 
              disabled={!isEditingHi}
              value={hindiAlert}
              onChange={(e) => setHiText(e.target.value)}
              className={`w-full h-[120px] bg-transparent text-gray-200 text-sm focus:outline-none resize-none leading-relaxed font-sans ${isEditingHi ? 'opacity-100' : 'opacity-80'}`}
            />
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => handleIndividualBroadcast('HI')}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(14,165,233,0.3)]"
            >
              <Radio size={16} /> Broadcast
            </button>
            <button 
              onClick={() => setIsEditingHi(!isEditingHi)}
              className="bg-card hover:bg-cardBorder/50 border border-cardBorder text-gray-300 font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              {isEditingHi ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>

      </div>

      {/* SECTION 2 & 3: Broadcast Channels & Actions */}
      <div className="glass-card p-6">
        <h3 className="font-bold text-white text-sm mb-1">Broadcast Channels</h3>
        <p className="text-[10px] text-gray-400 mb-5">Select where to deploy this alert</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { id: 'pa', name: 'On-site PA System', reach: 'Zone A · 18,000 ppl', icon: Volume2 },
            { id: 'sms', name: 'SMS Broadcast', reach: '42,500 numbers', icon: MessageSquare },
            { id: 'app', name: 'Event App Push', reach: '1.2M users', icon: Smartphone },
            { id: 'sign', name: 'Digital Signage', reach: '64 displays', icon: Monitor }
          ].map((channel) => {
            const isSelected = selectedChannels[channel.id];
            return (
            <label key={channel.id} className="cursor-pointer" onClick={(e) => { e.preventDefault(); setSelectedChannels(prev => ({...prev, [channel.id]: !prev[channel.id]}))}}>
              <div className={`bg-card/50 border hover:bg-card/80 transition-colors p-4 rounded-lg flex items-start gap-3 relative overflow-hidden group ${isSelected ? 'border-primary/50' : 'border-cardBorder'}`}>
                {isSelected && <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>}
                <div className={`mt-0.5 ${isSelected ? 'text-primary' : 'text-gray-500'}`}>
                  <CheckSquare size={16} className={isSelected ? 'fill-primary text-card' : ''} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 text-white font-bold text-sm">
                    <channel.icon size={14} className={isSelected ? 'text-primary' : 'text-gray-500'} /> {channel.name}
                  </div>
                  <div className="text-[10px] text-gray-400">{channel.reach}</div>
                </div>
              </div>
            </label>
          )})}
        </div>

        <div className="flex justify-end gap-4 border-t border-cardBorder pt-5">
          <button onClick={handleSaveDraft} className="bg-card border border-cardBorder hover:bg-cardBorder/50 text-gray-300 font-medium py-2.5 px-6 rounded-lg transition-colors">
            Save Draft
          </button>
          <button onClick={handleBroadcastNow} className="bg-[#ff003c] hover:bg-[#ff003c]/90 text-white font-bold py-2.5 px-8 rounded-lg transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(255,0,60,0.3)]">
            <Radio size={16} /> Broadcast Now
          </button>
        </div>
      </div>

      {/* SECTION 4: Recent Broadcasts */}
      <div className="glass-card p-6">
        <h3 className="font-bold text-white text-sm mb-1">Recent Broadcasts</h3>
        <p className="text-[10px] text-gray-400 mb-5">Last 6 alerts</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead>
              <tr className="text-[10px] text-gray-500 uppercase tracking-widest border-b border-cardBorder">
                <th className="pb-3 font-medium w-24">Time</th>
                <th className="pb-3 font-medium">Alert</th>
                <th className="pb-3 font-medium w-48">Channels</th>
                <th className="pb-3 font-medium w-32">Reach</th>
                <th className="pb-3 font-medium w-28">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cardBorder/50">
              {alertsList.map((row, i) => {
                const time = row.created_at ? new Date(row.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : row.time;
                const title = row.title || row.alert;
                const channels = Array.isArray(row.channels) ? row.channels.join(' · ') : row.channels;
                const reach = row.reach_estimate ? (row.reach_estimate > 1000 ? `${(row.reach_estimate / 1000).toFixed(1)}K` : row.reach_estimate) : row.reach;
                const status = row.status?.toUpperCase() || 'DELIVERED';
                
                return (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-3.5 text-gray-400 font-mono text-xs">{time}</td>
                    <td className="py-3.5 font-bold text-white">{title}</td>
                    <td className="py-3.5 text-xs">{channels}</td>
                    <td className="py-3.5 font-bold">{reach}</td>
                    <td className="py-3.5">
                      <span className={`text-[9px] font-bold px-2 py-1 rounded tracking-widest ${
                        status === 'DRAFT' ? 'text-warning bg-warning/10 border border-warning/20' : 
                        status === 'PENDING' ? 'text-primary bg-primary/10 border border-primary/20' : 
                        'text-safe bg-safe/10 border border-safe/20'
                      }`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Alerts;
