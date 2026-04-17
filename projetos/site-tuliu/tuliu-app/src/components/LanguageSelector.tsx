import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import type { Language } from '../translations';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown se clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  const options: { value: Language; label: string }[] = [
    { value: 'pt', label: 'Português' },
    { value: 'en', label: 'English' }
  ];

  const currentOption = options.find(opt => opt.value === language) || options[0];

  return (
    <div className="custom-language-selector" ref={dropdownRef}>
      <button 
        className="language-selector-button" 
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <i className="fas fa-globe icon"></i>
        <span className="label">{currentOption.value.toUpperCase()}</span>
        <i className={`fas fa-chevron-down arrow ${isOpen ? 'open' : ''}`}></i>
      </button>

      {isOpen && (
        <ul className="language-selector-menu" role="listbox">
          {options.map((option) => (
            <li 
              key={option.value}
              className={`language-selector-item ${language === option.value ? 'selected' : ''}`}
              role="option"
              aria-selected={language === option.value}
              onClick={() => handleSelect(option.value)}
            >
              <span className="label">{option.label}</span>
              {language === option.value && <i className="fas fa-check check"></i>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
