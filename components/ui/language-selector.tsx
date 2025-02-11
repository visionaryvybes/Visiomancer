'use client'

import React, { useState, useEffect } from 'react'
import { Globe, ChevronDown } from 'lucide-react'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
]

interface LanguageSelectorProps {
  onLanguageChange?: (language: typeof languages[0]) => void
}

export function LanguageSelector({ onLanguageChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0])

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selected-language')
    if (savedLanguage) {
      const language = languages.find(l => l.code === savedLanguage)
      if (language) {
        setSelectedLanguage(language)
      }
    }
  }, [])

  const handleLanguageSelect = (language: typeof languages[0]) => {
    setSelectedLanguage(language)
    localStorage.setItem('selected-language', language.code)
    setIsOpen(false)
    onLanguageChange?.(language)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-sm hover:text-primary"
      >
        <Globe className="w-4 h-4" />
        <span>{selectedLanguage.name}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 rounded-lg bg-background shadow-lg ring-1 ring-black/5 z-50">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-muted first:rounded-t-lg last:rounded-b-lg ${
                  language.code === selectedLanguage.code
                    ? 'bg-primary/10 text-primary'
                    : ''
                }`}
              >
                <span className="mr-2">{language.flag}</span>
                <span className="font-medium">{language.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
} 