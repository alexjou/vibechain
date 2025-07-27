import React from "react";
import { useTranslation } from 'react-i18next';
import { useDonation } from '../hooks/useDonation';

const Impact: React.FC = () => {
  const { t } = useTranslation();
  const {
    saldo,
    loadingSaldo,
    donating,
    fetchSaldo,
    handleDonate,
    address
  } = useDonation();

  return (
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
  );
};

export default Impact;
