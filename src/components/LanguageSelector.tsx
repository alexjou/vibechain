import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
const languages = [
  { code: 'pt', label: 'Português', flag: 'https://flagcdn.com/br.svg' },
  { code: 'en', label: 'English', flag: 'https://flagcdn.com/us.svg' },
  { code: 'es', label: 'Español', flag: 'https://flagcdn.com/es.svg' },
];

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-2 px-2 py-1 border border-blue-200 bg-white text-blue-700 font-semibold rounded shadow-sm focus:outline-pink-400"
        onClick={() => setOpen(o => !o)}
        aria-label="Selecionar idioma"
        type="button"
      >
        <img src={current.flag} alt={current.label} className="w-5 h-5 rounded-full" />
        <span className="hidden md:inline">{current.label}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white border border-blue-200 rounded shadow-lg z-50">
          {languages.map(lang => (
            <button
              key={lang.code}
              className={`flex items-center gap-2 w-full px-3 py-2 hover:bg-blue-100 ${i18n.language === lang.code ? 'font-bold' : ''}`}
              onClick={() => { i18n.changeLanguage(lang.code); setOpen(false); }}
              type="button"
            >
              <img src={lang.flag} alt={lang.label} className="w-5 h-5 rounded-full" />
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
