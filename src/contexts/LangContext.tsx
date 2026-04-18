import { createContext, useContext, useState, type ReactNode } from "react";
import type { LangCode } from "@/services/translate";

interface LangContextValue {
  lang: LangCode;
  setLang: (l: LangCode) => void;
}

const LangContext = createContext<LangContextValue>({
  lang: "en",
  setLang: () => {},
});

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<LangCode>("en");
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
