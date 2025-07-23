import React from "react";


const HowToDonate: React.FC = () => (
  <section className="py-16 px-4 max-w-3xl mx-auto text-center" id="how-to-donate">
    <div className="inline-block bg-gradient-to-r from-primary to-blue-500 p-4 rounded-full shadow mb-4 animate-fade-in">
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h2 className="text-4xl font-extrabold mb-4 text-primary drop-shadow">Como <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Doar</span></h2>
    <div className="flex flex-col md:flex-row gap-6 justify-center items-start mt-8">
      <div className="flex-1 bg-white/80 rounded-lg shadow p-6 text-left">
        <ol className="list-decimal ml-6 text-base space-y-2">
          <li><span className="font-semibold text-primary">Conecte sua carteira Ethereum</span> (MetaMask ou outra compatível).</li>
          <li><span className="font-semibold text-primary">Escolha o valor</span> que deseja doar em nossa moeda digital.</li>
          <li><span className="font-semibold text-primary">Confirme a transação</span> na sua carteira.</li>
          <li><span className="font-semibold text-primary">Acompanhe o impacto</span> da sua doação em tempo real!</li>
        </ol>
      </div>
    </div>
  </section>
);

export default HowToDonate;
