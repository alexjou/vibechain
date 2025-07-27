import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
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
import * as ethers from "ethers";

// Cheerful image of running children (can be replaced by a real image later)
const kidsImg = "https://escoladainteligencia.com.br/wp-content/uploads/2016/09/familia.jpg";
// const bankContract = '0xE0CeDEF67A7b10355236bD6087DC1ADF494b4817';
const proxyContract = '0x0595d3f5EE5cFb8Ba4FC7Bad31846cd264BFA0CC';
// const clientContract = '0x22A0f7ce33e44702Badd7B31DfDF940535b79dB2';


const HomeContent: React.FC = () => {
  const { t } = useTranslation();
  const { address, setAddress, saldo, loadingSaldo, donating, toast, setToast, fetchSaldo, handleDonate,
    walletBalance, fetchWalletBalance } = useDonation();

  // Estado para mensagens reais
  const [donationMessages, setDonationMessages] = useState<{ name: string, value: string, msg: string }[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  async function fetchMessages() {
    setLoadingMessages(true);
    try {
      // ethers já está disponível no contexto global do projeto
      const eth = (window as typeof window & { ethereum?: unknown }).ethereum;
      if (!eth) throw new Error("Wallet not found");
      const provider = new ethers.BrowserProvider(eth as ethers.Eip1193Provider);
      // Buscar o endereço do cofre atual
      const proxyABI = [
        { "inputs": [], "name": "getCurrentVault", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }
      ];
      const proxy = new ethers.Contract(proxyContract, proxyABI, provider);
      const vaultAddr = await proxy.getCurrentVault();
      // ABI mínima para evento Deposit
      const bankABI = [
        {
          "anonymous": false,
          "inputs": [
            { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
            { "indexed": false, "internalType": "string", "name": "message", "type": "string" }
          ],
          "name": "Deposit",
          "type": "event"
        }
      ];
      const bank = new ethers.Contract(vaultAddr, bankABI, provider);
      // Busca todos os eventos Deposit do cofre
      const filter = bank.filters.Deposit();
      const events = await bank.queryFilter(filter, 0, "latest");
      const formatted = events.map(ev => {
        // ev.args is a Result object, so we need to extract by index or by key if available
        // For ethers v6, args is an array-like object with named properties
        const args = (ev as ethers.EventLog).args as unknown as { from: string; amount: bigint; message: string };
        return {
          name: args && args.from ? args.from : "Anônimo",
          value: ethers.formatEther(args.amount) + " ETH",
          msg: args.message
        };
      }).reverse(); // mais recentes primeiro
      setDonationMessages(formatted);
    } catch {
      setDonationMessages([]);
    }
    setLoadingMessages(false);
  }

  useEffect(() => {
    AOS.init({ duration: 900, once: true, offset: 80 });
    fetchMessages();
    fetchSaldo();
    if (address) {
      fetchWalletBalance(address);
    }
  }, [address, fetchSaldo, fetchWalletBalance]);

  return (
    <div className="w-full min-h-screen h-[100dvh] bg-gradient-to-br from-[#f8fafc] via-[#a7e9fb] to-[#fbc2eb] flex flex-col font-sans overflow-x-hidden">

      <Header
        address={address}
        onConnect={setAddress}
        walletBalance={walletBalance}
        toastMsg={toast?.msg}
        toastType={toast?.type}
        onToastClose={() => setToast(null)}
      />

      <section className="relative flex flex-col md:flex-row items-center justify-center px-4 py-12 w-full flex-1 gap-12 bg-gradient-to-br from-[#fbc2eb]/60 via-[#a7e9fb]/60 to-[#f8fafc]/60" data-aos="fade-up">
        <div className="flex-1 flex flex-col items-center md:items-start justify-center text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#232946] mb-6 leading-tight drop-shadow-lg">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl text-[#232946] mb-8 max-w-2/3 font-medium">
            {t('subtitle')}
            <br />
            <span className="text-blue-500 font-bold">{t('transparency')}</span>, <span className="text-pink-500 font-bold">{t('joy')}</span> and <span className="text-yellow-400 font-bold">{t('real_impact')}</span>.
          </p>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <img src={kidsImg} alt="Happy running children" className="w-[640px] md:w-[420px] rounded-3xl shadow-2xl border-4 border-white/80 object-cover" />
        </div>
      </section>

      {/* Balance and donate - now at the top of the projects, with improved layout */}
      <section className="w-full flex flex-col items-center pt-16 pb-4 bg-gradient-to-br from-[#fbc2eb]/40 via-[#a7e9fb]/40 to-[#f8fafc]/40" id="saldo-doacao">
        <div className="flex flex-col md:flex-row gap-20 items-center justify-center w-full max-w-6xl">
          <div className="bg-white/90 rounded-3xl shadow-2xl p-12 flex flex-col items-center border-2 border-[#a7e9fb] min-w-[320px] max-w-md w-full">
            <span className="text-2xl font-bold text-[#232946] mb-3">{t('cofre_balance')}</span>
            <span className="text-5xl font-extrabold text-blue-500 mb-4">{loadingSaldo ? '...' : saldo + ' ETH'}</span>
            <button
              onClick={fetchSaldo}
              className="px-6 py-3 rounded-full bg-blue-400 text-white font-bold hover:bg-blue-500 transition mb-3 text-lg flex items-center justify-center gap-2 disabled:opacity-60"
              disabled={loadingSaldo || donating}
            >
              {loadingSaldo && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              )}
              {t('update_balance')}
            </button>
            <span className="text-base text-[#232946]/70 text-center">{t('cofre_balance_desc')}</span>
          </div>
          <div className="bg-white/90 rounded-3xl shadow-2xl p-12 flex flex-col items-center border-2 border-[#fbc2eb] min-w-[320px] max-w-md w-full">
            <span className="text-2xl font-bold text-[#232946] mb-3">{t('donate_title')}</span>
            <form onSubmit={e => {
              e.preventDefault();
              const target = e.target as typeof e.target & { valor: { value: string }, mensagem: { value: string } };
              const v = target.valor.value;
              const m = target.mensagem.value;
              if (v && m) handleDonate(v, m);
            }} className="flex flex-col gap-4 items-center w-full">
              <input name="valor" type="number" min="0.001" step="0.001" placeholder={t('donate_placeholder')} className="px-5 py-3 rounded border border-gray-300 focus:outline-pink-400 text-xl w-full" required disabled={!address || donating} />
              <textarea name="mensagem" placeholder={t('donate_message_placeholder')} className="px-5 py-3 rounded border border-gray-300 focus:outline-blue-400 text-xl w-full min-h-[80px] resize-y" disabled={!address || donating} />
              <button
                type="submit"
                className="px-8 py-3 rounded-full bg-pink-500 text-white font-bold hover:bg-pink-600 transition disabled:opacity-60 w-full text-lg flex items-center justify-center gap-2"
                disabled={!address || donating || loadingSaldo}
              >
                {donating && (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                )}
                {t('donate_button')}
              </button>
            </form>
            <span className="text-base text-[#232946]/70 mt-3 text-center">{t('donate_desc')}</span>
          </div>
        </div>
      </section>

      <Impact />

      {/* Mensagens reais de esperança */}
      <section className="w-full flex flex-col items-center py-12 bg-gradient-to-br from-[#fbc2eb]/30 via-[#a7e9fb]/30 to-[#f8fafc]/30">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#232946] mb-8 text-center drop-shadow-lg">{t('messages_title')}</h2>
        {loadingMessages ? (
          <div className="text-lg text-blue-500 font-semibold">Carregando mensagens...</div>
        ) : donationMessages.length === 0 ? (
          <div className="text-lg text-gray-500 font-semibold">Nenhuma mensagem encontrada.</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8 w-full max-w-5xl">
            {donationMessages.map((d, i) => (
              <div key={i} className="bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-[#a7e9fb] min-w-[220px] max-w-lg w-full">
                <span className="text-lg font-bold text-pink-500 mb-1">{d.name}</span>
                <span className="text-[#232946] text-center italic">“{d.msg}”</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Impact cards */}
      <section className="w-full flex flex-col items-center py-16 bg-transparent">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#232946] mb-12 text-center drop-shadow-lg">{t('impact_title')}</h2>
        <div className="flex flex-wrap justify-center gap-12 w-full max-w-6xl">
          <ImpactCard
            icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /><path d="M12 6v6l4 2" /></svg>}
            title={t('impact_children')}
            value="+120"
            description={t('impact_children_desc')}
            colorFrom="#fbc2eb"
            colorTo="#a7e9fb"
          />
          <ImpactCard
            icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2v-7a2 2 0 00-2-2z" /><path d="M12 17v.01" /></svg>}
            title={t('impact_donations')}
            value="R$ 500k+"
            description={t('impact_donations_desc')}
            colorFrom="#a7e9fb"
            colorTo="#fbc2eb"
          />
          <ImpactCard
            icon={<svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" /><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07-7.07l-1.41 1.41M6.34 17.66l-1.41 1.41m12.02 0l1.41-1.41M6.34 6.34L4.93 4.93" /></svg>}
            title={t('impact_projects')}
            value="15+"
            description={t('impact_projects_desc')}
            colorFrom="#fbc2eb"
            colorTo="#f9f871"
          />
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
        <section id="partners" className="py-16 flex justify-center">
          <div className="w-full max-w-4xl bg-white/80 rounded-3xl shadow-xl p-12 md:p-20 border-2 border-[#a7e9fb]">
            <Partners />
          </div>
        </section>
      </main>

      <footer className="bg-gradient-to-r from-pink-200 via-blue-200 to-yellow-100 text-center py-6 text-[#232946] text-base mt-8 border-t border-[#a7e9fb] font-semibold shadow-inner">
        © {new Date().getFullYear()} <span className="text-pink-500 font-bold">VibeChain</span>. {t('footer')}
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
