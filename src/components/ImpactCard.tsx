import React from "react";

interface ImpactCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  colorFrom: string;
  colorTo: string;
}

const ImpactCard: React.FC<ImpactCardProps> = ({ icon, title, value, description, colorFrom, colorTo }) => (
  <div className={`group relative rounded-3xl shadow-xl p-8 flex flex-col items-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl hover:scale-105 border-2 border-white/80 min-w-[220px] max-w-[270px]`}
    style={{ background: `linear-gradient(135deg, ${colorFrom} 0%, ${colorTo} 100%)` }}
  >
    <div className="text-5xl mb-4 animate-bounce-slow">{icon}</div>
    <div className="text-3xl font-extrabold text-[#232946] mb-1 drop-shadow-sm">{value}</div>
    <div className="text-lg font-bold text-[#232946] mb-2">{title}</div>
    <div className="text-base text-[#232946]/80 text-center">{description}</div>
    <div className="absolute -top-3 -right-3 bg-white rounded-full shadow p-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
      <svg className="w-6 h-6 text-pink-400 animate-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /></svg>
    </div>
  </div>
);

export default ImpactCard;
