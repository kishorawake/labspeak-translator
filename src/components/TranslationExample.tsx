import React, { useState } from 'react';
import { translateAndSpeak, translateText, speakText, LangCode, LANGUAGES } from '@/services/translate';

interface TranslationExampleProps {
  text: string;
}

export const TranslationExample: React.FC<TranslationExampleProps> = ({ text }) => {
  const [selectedLang, setSelectedLang] = useState<LangCode>('hi');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState<string>('');

  const handleTranslateAndSpeak = async () => {
    setIsTranslating(true);
    try {
      const translated = await translateAndSpeak(text, selectedLang);
      setTranslatedText(translated);
    } catch (error) {
      console.error('Translation and speech failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTranslateOnly = async () => {
    setIsTranslating(true);
    try {
      const translated = await translateText(text, selectedLang);
      setTranslatedText(translated);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSpeakOnly = () => {
    speakText(translatedText || text, selectedLang);
  };

  return (
    <div className="translation-example p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Translation & Speech Example</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Select Language:</label>
        <select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value as LangCode)}
          className="border rounded px-3 py-2"
        >
          {LANGUAGES.filter(lang => lang.code !== 'en').map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.label} ({lang.native})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">Original: {text}</p>
        {translatedText && (
          <p className="text-sm text-blue-600">Translated: {translatedText}</p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleTranslateAndSpeak}
          disabled={isTranslating}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isTranslating ? 'Processing...' : 'Translate & Speak'}
        </button>

        <button
          onClick={handleTranslateOnly}
          disabled={isTranslating}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {isTranslating ? 'Translating...' : 'Translate Only'}
        </button>

        <button
          onClick={handleSpeakOnly}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Speak {translatedText ? 'Translated' : 'Original'}
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>Note: Speech only works on user interaction (button clicks) to comply with browser autoplay policies.</p>
      </div>
    </div>
  );
};