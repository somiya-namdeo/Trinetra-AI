import React, { useState } from 'react';
import { Copy, Radio, Volume2, MessageSquare, Smartphone, Monitor, CheckCircle2, Sparkles, CheckSquare } from 'lucide-react';

const Alerts = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const englishAlert = "URGENT — ZONE A NOTICE: Due to a temporary water-supply issue and rising temperatures, please move to shaded rest areas in Zone B or Zone C. Free hydration is available at stations B-12 and C-04. Medical staff are on site. Stay calm and follow steward instructions.";
  const hindiAlert = "तत्काल सूचना — ज़ोन ए: पानी की अस्थायी समस्या और बढ़ते तापमान के कारण, कृपया ज़ोन बी या ज़ोन सी के छायादार विश्राम क्षेत्रों में जाएं। B-12 और C-04 स्टेशनों पर निःशुल्क पेयजल उपलब्ध है। चिकित्सा दल मौके पर मौजूद है। शांत रहें और स्वयंसेवकों के निर्देशों का पालन करें।";

  return (
    <div className="flex flex-col gap-6 pb-10">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Alerts & Communication</h1>
          <p className="text-sm text-gray-400">AI-drafted multilingual announcements ready for broadcast.</p>
        </div>
        <div>
          <div className="bg-primary/10 border border-primary/30 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <Sparkles size={14} className="text-primary" />
            <span className="text-xs font-medium text-primary">Generated for INC-2041 · Heat Stress Cluster</span>
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
          <div className="flex-1 bg-background/50 border border-cardBorder rounded-lg p-4 mb-4">
            <textarea 
              className="w-full h-[120px] bg-transparent text-gray-200 text-sm focus:outline-none resize-none leading-relaxed"
              defaultValue={englishAlert}
            />
          </div>
          <div className="flex gap-3">
            <button className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(14,165,233,0.3)]">
              <Radio size={16} /> Broadcast
            </button>
            <button className="bg-card hover:bg-cardBorder/50 border border-cardBorder text-gray-300 font-medium px-6 py-2.5 rounded-lg transition-colors">
              Edit
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
          <div className="flex-1 bg-background/50 border border-cardBorder rounded-lg p-4 mb-4">
            <textarea 
              className="w-full h-[120px] bg-transparent text-gray-200 text-sm focus:outline-none resize-none leading-relaxed font-sans"
              defaultValue={hindiAlert}
            />
          </div>
          <div className="flex gap-3">
            <button className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(14,165,233,0.3)]">
              <Radio size={16} /> Broadcast
            </button>
            <button className="bg-card hover:bg-cardBorder/50 border border-cardBorder text-gray-300 font-medium px-6 py-2.5 rounded-lg transition-colors">
              Edit
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
          ].map((channel) => (
            <label key={channel.id} className="cursor-pointer">
              <div className="bg-card/50 border border-primary/50 hover:bg-card/80 transition-colors p-4 rounded-lg flex items-start gap-3 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
                <div className="text-primary mt-0.5">
                  <CheckSquare size={16} className="fill-primary/20" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 text-white font-bold text-sm">
                    <channel.icon size={14} className="text-primary" /> {channel.name}
                  </div>
                  <div className="text-[10px] text-gray-400">{channel.reach}</div>
                </div>
              </div>
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-4 border-t border-cardBorder pt-5">
          <button className="bg-card border border-cardBorder hover:bg-cardBorder/50 text-gray-300 font-medium py-2.5 px-6 rounded-lg transition-colors">
            Save Draft
          </button>
          <button className="bg-[#ff003c] hover:bg-[#ff003c]/90 text-white font-bold py-2.5 px-8 rounded-lg transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(255,0,60,0.3)]">
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
              {[
                { time: '14:21', alert: 'Hydration reminder — Zone A', channels: 'PA · SMS · App', reach: '1.26M', status: 'DELIVERED' },
                { time: '13:48', alert: 'Gate 7 reroute notice', channels: 'PA · Signage', reach: '32K', status: 'DELIVERED' },
                { time: '13:12', alert: 'Lost child reunified', channels: 'App', reach: '1.2M', status: 'DELIVERED' },
                { time: '12:38', alert: 'Heatwave advisory', channels: 'All channels', reach: '1.26M', status: 'DELIVERED' },
                { time: '11:45', alert: 'Stage 2 schedule shift', channels: 'App · SMS', reach: '1.24M', status: 'DELIVERED' },
                { time: '10:15', alert: 'Welcome announcement', channels: 'PA', reach: 'All zones', status: 'DELIVERED' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-3.5 text-gray-400 font-mono text-xs">{row.time}</td>
                  <td className="py-3.5 font-bold text-white">{row.alert}</td>
                  <td className="py-3.5 text-xs">{row.channels}</td>
                  <td className="py-3.5 font-bold">{row.reach}</td>
                  <td className="py-3.5">
                    <span className="text-[9px] font-bold text-safe bg-safe/10 border border-safe/20 px-2 py-1 rounded tracking-widest">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Alerts;
