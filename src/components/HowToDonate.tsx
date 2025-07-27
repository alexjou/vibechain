import React from "react";
import { useTranslation, Trans } from 'react-i18next';



const HowToDonate: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="py-16 px-4 max-w-3xl mx-auto text-center" id="how-to-donate">
      <div className="inline-block bg-gradient-to-r from-primary to-blue-500 p-4 rounded-full shadow mb-4 animate-fade-in">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-4xl font-extrabold mb-4 text-primary drop-shadow">
        {t('how_to_donate_title').split(' ')[0]}{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
          {t('how_to_donate_title').split(' ')[1] || ''}
        </span>
      </h2>
      <div className="flex flex-col items-center justify-center mt-8">
        <div className="w-full max-w-xl bg-white/80 rounded-lg shadow p-6">
          <ol className="list-decimal ml-6 text-base space-y-2 text-left">
            <li>
              <Trans i18nKey="how_to_donate_step1"
                components={{ 1: <span className="font-semibold text-primary" /> }}
              />
            </li>
            <li>
              <Trans i18nKey="how_to_donate_step2"
                components={{ 1: <span className="font-semibold text-primary" /> }}
              />
            </li>
            <li>
              <Trans i18nKey="how_to_donate_step3"
                components={{ 1: <span className="font-semibold text-primary" /> }}
              />
            </li>
            <li>
              <Trans i18nKey="how_to_donate_step4"
                components={{ 1: <span className="font-semibold text-primary" /> }}
              />
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default HowToDonate;
