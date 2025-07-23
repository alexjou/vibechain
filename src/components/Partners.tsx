import React from "react";


const Partners: React.FC = () => (
  <section className="py-16 px-4 max-w-3xl mx-auto text-center" id="partners">
    <div className="inline-block bg-gradient-to-r from-primary to-blue-500 p-4 rounded-full shadow mb-4 animate-fade-in">
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4V6a4 4 0 00-8 0v4m8 0a4 4 0 01-8 0m8 0v4a4 4 0 01-8 0v-4" />
      </svg>
    </div>
    <h2 className="text-4xl font-extrabold mb-4 text-primary drop-shadow">Parceiros</h2>
    <div className="flex flex-wrap gap-6 justify-center items-center mt-8">
      <div className="bg-white/90 border-l-4 border-primary px-8 py-6 rounded-lg shadow min-w-[200px] font-semibold text-lg hover:scale-105 transition-transform">Hospital do Câncer Infantil</div>
      <div className="bg-white/90 border-l-4 border-blue-500 px-8 py-6 rounded-lg shadow min-w-[200px] font-semibold text-lg hover:scale-105 transition-transform">Associação Viver</div>
      <div className="bg-white/90 border-l-4 border-green-500 px-8 py-6 rounded-lg shadow min-w-[200px] font-semibold text-lg hover:scale-105 transition-transform">Fundação Esperança</div>
    </div>
  </section>
);

export default Partners;
