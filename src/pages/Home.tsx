import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import About from "../components/About";
import HowToDonate from "../components/HowToDonate";
import Impact from "../components/Impact";
import Partners from "../components/Partners";
import Header from "../components/Header";
import ImpactCard from "../components/ImpactCard";
import { DonationProvider } from "../contexts/DonationContext";
import { useDonation } from "../hooks/useDonation";

// Imagem alegre de crianças correndo (pode ser substituída por uma imagem real depois)
const kidsImg = "https://escoladainteligencia.com.br/wp-content/uploads/2016/09/familia.jpg";


const HomeContent: React.FC = () => {
  const { address, setAddress, saldo, loadingSaldo, donating, toast, setToast, fetchSaldo, handleDonate, walletBalance, fetchWalletBalance } = useDonation();
  useEffect(() => {
    AOS.init({ duration: 900, once: true, offset: 80 });
  }, []);


  // Buscar saldo do cofre e da carteira ao conectar carteira
  useEffect(() => {
    if (address) {
      fetchSaldo();
      fetchWalletBalance(address);
    }
    // eslint-disable-next-line
  }, [address]);

  return (
    <div className="w-full min-h-screen h-[100dvh] bg-gradient-to-br from-[#f8fafc] via-[#a7e9fb] to-[#fbc2eb] flex flex-col font-sans overflow-x-hidden">
      {/* Header extraído para componente próprio */}

      <Header
        address={address}
        onConnect={setAddress}
        walletBalance={walletBalance}
        toastMsg={toast?.msg}
        toastType={toast?.type}
        onToastClose={() => setToast(null)}
      />

      {/* Saldo da carteira agora aparece no Header */}
      {/* Hero/banner principal */}
      {/* Mensagem de feedback removida, agora via toast */}
      <section className="relative flex flex-col md:flex-row items-center justify-center px-4 py-12 w-full flex-1 gap-12 bg-gradient-to-br from-[#fbc2eb]/60 via-[#a7e9fb]/60 to-[#f8fafc]/60" data-aos="fade-up">
        <div className="flex-1 flex flex-col items-center md:items-start justify-center text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#232946] mb-6 leading-tight drop-shadow-lg">
            Doe <span className="text-pink-500">alegre</span>.<br />
            Impacte <span className="text-yellow-400">vidas reais</span>.
          </h1>
          <p className="text-xl md:text-2xl text-[#232946] mb-8 max-w-xl font-medium">
            Apresentamos o <span className="text-pink-500 font-bold">VibeChain</span>, um projeto revolucionário baseado em blockchain dedicado a apoiar crianças com câncer. Através de doações feitas em nossa moeda digital, unimos tecnologia e solidariedade para promover mensagens positivas e esperança. Seja parte dessa corrente do bem e faça a diferença na vida de muitas crianças. <span className="font-bold text-blue-500">Sua doação transforma e vibra com amor e solidariedade.</span>
            <br />
            <span className="text-blue-500 font-bold">Transparência</span>, <span className="text-pink-500 font-bold">alegria</span> e <span className="text-yellow-400 font-bold">impacto social real</span>.
          </p>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <img src={kidsImg} alt="Crianças correndo felizes" className="w-[640px] md:w-[420px] rounded-3xl shadow-2xl border-4 border-white/80 object-cover" />
        </div>
      </section>

      {/* Saldo e doar - agora no topo dos projetos, com layout melhorado */}
      <section className="w-full flex flex-col items-center pt-16 pb-4 bg-gradient-to-br from-[#fbc2eb]/40 via-[#a7e9fb]/40 to-[#f8fafc]/40" id="saldo-doacao">
        <div className="flex flex-col md:flex-row gap-20 items-center justify-center w-full max-w-6xl">
          <div className="bg-white/90 rounded-3xl shadow-2xl p-12 flex flex-col items-center border-2 border-[#a7e9fb] min-w-[320px] max-w-md w-full">
            <span className="text-2xl font-bold text-[#232946] mb-3">Saldo do Cofre Solidário</span>
            <span className="text-5xl font-extrabold text-blue-500 mb-4">{loadingSaldo ? '...' : saldo + ' ETH'}</span>
            <button onClick={fetchSaldo} className="px-6 py-3 rounded-full bg-blue-400 text-white font-bold hover:bg-blue-500 transition mb-3 text-lg">Atualizar saldo</button>
            <span className="text-base text-[#232946]/70 text-center">Este é o saldo total disponível no cofre atual para doações às crianças. Transparência garantida via blockchain.</span>
          </div>
          <div className="bg-white/90 rounded-3xl shadow-2xl p-12 flex flex-col items-center border-2 border-[#fbc2eb] min-w-[320px] max-w-md w-full">
            <span className="text-2xl font-bold text-[#232946] mb-3">Faça sua doação</span>
            <form onSubmit={e => {
              e.preventDefault();
              const target = e.target as typeof e.target & { valor: { value: string }, mensagem: { value: string } };
              const v = target.valor.value;
              const m = target.mensagem.value;
              if (v && m) handleDonate(v, m);
            }} className="flex flex-col gap-4 items-center w-full">
              <input name="valor" type="number" min="0.001" step="0.001" placeholder="Valor em ETH" className="px-5 py-3 rounded border border-gray-300 focus:outline-pink-400 text-xl w-full" required disabled={!address || donating} />
              <input name="mensagem" type="text" maxLength={120} placeholder="Mensagem de esperança (opcional)" className="px-5 py-3 rounded border border-gray-300 focus:outline-blue-400 text-xl w-full" disabled={!address || donating} />
              <button type="submit" className="px-8 py-3 rounded-full bg-pink-500 text-white font-bold hover:bg-pink-600 transition disabled:opacity-60 w-full text-lg" disabled={!address || donating}>Doar agora</button>
            </form>
            <span className="text-base text-[#232946]/70 mt-3 text-center">Doe qualquer valor em ETH e ajude a transformar vidas. Sua doação é registrada na blockchain!</span>
          </div>
        </div>
      </section>
      {/* Cards de impacto */}
      <section className="w-full flex flex-col items-center py-16 bg-transparent">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#232946] mb-12 text-center drop-shadow-lg">Nosso Impacto</h2>
        <div className="flex flex-wrap justify-center gap-12 w-full max-w-6xl">
          <ImpactCard
            icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /><path d="M12 6v6l4 2" /></svg>}
            title="Crianças Ajudadas"
            value="+120"
            description="Já impactamos mais de 120 crianças com doações diretas."
            colorFrom="#fbc2eb"
            colorTo="#a7e9fb"
          />
          <ImpactCard
            icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2v-7a2 2 0 00-2-2z" /><path d="M12 17v.01" /></svg>}
            title="Doações Recebidas"
            value="R$ 500mil+"
            description="Transparência total: cada centavo é rastreável na blockchain."
            colorFrom="#a7e9fb"
            colorTo="#fbc2eb"
          />
          <ImpactCard
            icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" /><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07-7.07l-1.41 1.41M6.34 17.66l-1.41 1.41m12.02 0l1.41-1.41M6.34 6.34L4.93 4.93" /></svg>}
            title="Projetos Realizados"
            value="15+"
            description="Apoiamos hospitais, eventos e campanhas de conscientização."
            colorFrom="#fbc2eb"
            colorTo="#f9f871"
          />
          <ImpactCard
            icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
            title="Voluntários"
            value="+40"
            description="Uma rede crescente de pessoas do bem apoiando a causa."
            colorFrom="#a7e9fb"
            colorTo="#fbc2eb"
          />
        </div>
      </section>

      {/* Seção de mensagens/depoimentos positivos fake */}
      <section className="w-full flex flex-col items-center py-12 bg-gradient-to-br from-[#fbc2eb]/30 via-[#a7e9fb]/30 to-[#f8fafc]/30">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#232946] mb-8 text-center drop-shadow-lg">Mensagens de Esperança</h2>
        <div className="flex flex-wrap justify-center gap-8 w-full max-w-5xl">
          {[
            { nome: "Ana Paula", valor: "0.05 ETH", msg: "Com muito carinho, desejo força e alegria para todas as crianças! 💖" },
            { nome: "Lucas S.", valor: "0.1 ETH", msg: "Vocês são inspiração! Continuem lutando, estamos juntos nessa corrente do bem!" },
            { nome: "Maria Eduarda", valor: "0.02 ETH", msg: "Que cada doação traga um sorriso novo. Vocês são guerreiros! 🌈" },
            { nome: "João Pedro", valor: "0.03 ETH", msg: "Muita luz e saúde para todos vocês. Nunca desistam dos seus sonhos!" },
            { nome: "Carla M.", valor: "0.08 ETH", msg: "Com amor e esperança, tudo é possível. Vocês são muito especiais! 💫" },
          ].map((d, i) => (
            <div key={i} className="bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-[#a7e9fb] min-w-[220px] max-w-xs w-full">
              <span className="text-lg font-bold text-pink-500 mb-1">{d.nome}</span>
              <span className="text-blue-500 font-semibold mb-2">{d.valor}</span>
              <span className="text-[#232946] text-center italic">“{d.msg}”</span>
            </div>
          ))}
        </div>
      </section>

      <main className="flex-1 w-full mx-auto text-[#232946] max-w-[1400px]">
        <section id="about" className="py-16 flex justify-center">
          <div className="w-full max-w-4xl bg-white/80 rounded-3xl shadow-xl p-12 md:p-20 border-2 border-[#a7e9fb]">
            <About />
          </div>
        </section>
        <section id="how-to-donate" className="py-16 flex justify-center">
          <div className="w-full max-w-4xl bg-gradient-to-br from-[#fbc2eb]/60 via-[#a7e9fb]/60 to-[#f8fafc]/60 rounded-3xl shadow-xl p-12 md:p-20 border-2 border-[#fbc2eb]">
            <HowToDonate />
          </div>
        </section>
        {/* Removido bloco DonateForm duplicado */}
        <section id="impact" className="py-16 flex justify-center">
          <div className="w-full max-w-4xl bg-gradient-to-br from-[#fbc2eb]/60 via-[#a7e9fb]/60 to-[#f8fafc]/60 rounded-3xl shadow-xl p-12 md:p-20 border-2 border-[#fbc2eb]">
            <Impact />
          </div>
        </section>
        <section id="partners" className="py-16 flex justify-center">
          <div className="w-full max-w-4xl bg-white/80 rounded-3xl shadow-xl p-12 md:p-20 border-2 border-[#a7e9fb]">
            <Partners />
          </div>
        </section>
      </main>
      <footer className="bg-gradient-to-r from-pink-200 via-blue-200 to-yellow-100 text-center py-6 text-[#232946] text-base mt-8 border-t border-[#a7e9fb] font-semibold shadow-inner">
        © {new Date().getFullYear()} <span className="text-pink-500 font-bold">VibeChain</span>. Todos os direitos reservados.
      </footer>
      {/* Navegação suave */}
      <style>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

const Home: React.FC = () => (
  <DonationProvider>
    <HomeContent />
  </DonationProvider>
);

export default Home;
