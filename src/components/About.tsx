
import React from "react";
import { useTranslation, Trans } from 'react-i18next';



const About: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="py-16 px-4 max-w-3xl mx-auto text-center" id="about">
      <div className="inline-block bg-gradient-to-r from-primary to-blue-500 p-4 rounded-full shadow mb-4 animate-fade-in">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3zm0 0V4m0 7v9m-7-7h14" />
        </svg>
      </div>
      <h2 className="text-4xl font-extrabold mb-4 text-primary drop-shadow">
        {t('about_title_full')}
      </h2>
      <p className="mb-4 text-lg text-gray-700 font-medium">
        <Trans i18nKey="about_paragraph"
          components={{
            1: <span className="font-bold text-primary" />,
            2: <span className="text-blue-600 font-semibold" />,
            3: <span className="text-green-600 font-semibold" />
          }}
        />
      </p>
      <ul className="flex flex-col md:flex-row gap-4 justify-center items-center mt-6">
        <li className="bg-white/80 border-l-4 border-primary px-6 py-3 rounded shadow text-left w-full md:w-auto font-semibold">{t('about_item_smart')}</li>
        <li className="bg-white/80 border-l-4 border-blue-500 px-6 py-3 rounded shadow text-left w-full md:w-auto font-semibold">{t('about_item_transparency')}</li>
        <li className="bg-white/80 border-l-4 border-green-500 px-6 py-3 rounded shadow text-left w-full md:w-auto font-semibold">{t('about_item_security')}</li>
      </ul>
    </section>
  );
};

export default About;
