import React from "react";


const Impact: React.FC = () => (
  <section className="py-16 px-4 max-w-3xl mx-auto text-center" id="impact">
    <div className="inline-block bg-gradient-to-r from-primary to-blue-500 p-4 rounded-full shadow mb-4 animate-fade-in">
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
      </svg>
    </div>
    <h2 className="text-4xl font-extrabold mb-4 text-primary drop-shadow">Impacto & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Transparência</span></h2>
    <p className="mb-6 text-lg text-gray-700 font-medium">
      Veja abaixo o rastreamento das doações e o impacto gerado. Em breve, integraremos dados reais da blockchain Ethereum!
    </p>
    <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-8">
      <div className="flex-1 bg-gradient-to-br from-green-100 to-green-50 rounded-lg shadow p-8 text-center">
        <p className="text-lg font-semibold text-gray-700 mb-2">Total doado (simulado)</p>
        <span className="text-3xl font-extrabold text-green-600">Ξ 12.5 ETH</span>
      </div>
      <div className="flex-1 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg shadow p-8 text-center">
        <p className="text-lg font-semibold text-gray-700 mb-2">Crianças beneficiadas (simulado)</p>
        <span className="text-3xl font-extrabold text-blue-600">37</span>
      </div>
    </div>
  </section>
);

export default Impact;
