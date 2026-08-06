"use client";

import { useEffect, useState } from "react";

type Language = "en" | "vi";

type GoogleTranslateWindow = Window & {
  google?: {
    translate?: {
      TranslateElement: new (
        options: { pageLanguage: string; includedLanguages: string; autoDisplay: boolean },
        elementId: string,
      ) => unknown;
    };
  };
  googleTranslateElementInit?: () => void;
};

const STORAGE_KEY = "kims-nails-language";

function setTranslationCookie(language: Language) {
  if (language === "vi") {
    document.cookie = "googtrans=/en/vi; path=/; SameSite=Lax";
    return;
  }

  document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
}

export function VietnameseTranslateButton() {
  const [language, setLanguage] = useState<Language>(() =>
    typeof window !== "undefined" && window.localStorage.getItem(STORAGE_KEY) === "vi" ? "vi" : "en",
  );

  useEffect(() => {
    const translateWindow = window as GoogleTranslateWindow;

    const initializeTranslate = () => {
      if (!translateWindow.google?.translate?.TranslateElement) return;
      const mount = document.getElementById("google_translate_element");
      if (!mount || mount.childElementCount > 0) return;

      new translateWindow.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "vi",
          autoDisplay: false,
        },
        "google_translate_element",
      );
    };

    translateWindow.googleTranslateElementInit = initializeTranslate;

    if (translateWindow.google?.translate?.TranslateElement) {
      initializeTranslate();
      return;
    }

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  function switchLanguage() {
    const nextLanguage: Language = language === "en" ? "vi" : "en";
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    setTranslationCookie(nextLanguage);
    setLanguage(nextLanguage);

    if (nextLanguage === "en") {
      window.location.reload();
      return;
    }

    const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (select) {
      select.value = "vi";
      select.dispatchEvent(new Event("change"));
      return;
    }

    window.location.reload();
  }

  return (
    <>
      <div id="google_translate_element" aria-hidden="true" style={{ display: "none" }} />
      <button
        className="translate-button"
        type="button"
        onClick={switchLanguage}
        title={language === "en" ? "Switch to Vietnamese" : "Switch to English"}
        aria-label={language === "en" ? "Switch site language to Vietnamese" : "Switch site language to English"}
      >
        <span style={{ fontWeight: language === "en" ? 700 : 400 }}>EN</span>
        <span aria-hidden="true">/</span>
        <span style={{ fontWeight: language === "vi" ? 700 : 400 }}>VI</span>
      </button>
    </>
  );
}
