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
const TRANSLATE_SELECT = ".goog-te-combo";

function waitForTranslateSelect(timeoutMs = 8000) {
  return new Promise<HTMLSelectElement | null>((resolve) => {
    const existingSelect = document.querySelector<HTMLSelectElement>(TRANSLATE_SELECT);
    if (existingSelect) {
      resolve(existingSelect);
      return;
    }

    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      const select = document.querySelector<HTMLSelectElement>(TRANSLATE_SELECT);
      if (select || Date.now() - startedAt >= timeoutMs) {
        window.clearInterval(interval);
        resolve(select);
      }
    }, 100);
  });
}

function setTranslationCookie(language: Language) {
  if (language === "vi") {
    document.cookie = "googtrans=/en/vi; path=/; SameSite=Lax";
    return;
  }

  document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
}

export function VietnameseTranslateButton() {
  const [language, setLanguage] = useState<Language>("en");
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      setLanguage(window.localStorage.getItem(STORAGE_KEY) === "vi" ? "vi" : "en");
    });
    const hideGoogleTranslateUi = () => {
      document.body.style.setProperty("top", "0", "important");
      document
        .querySelectorAll<HTMLElement>(
          "iframe.goog-te-banner-frame, .goog-te-banner-frame, body > .skiptranslate, body > [class*='VIpgJd-ZVi9od']",
        )
        .forEach((element) => {
          if (element.id !== "google_translate_element") {
            element.style.setProperty("display", "none", "important");
          }
        });
    };
    const googleUiObserver = new MutationObserver(hideGoogleTranslateUi);
    googleUiObserver.observe(document.body, { childList: true, subtree: true });
    hideGoogleTranslateUi();
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

    return () => {
      window.cancelAnimationFrame(animationFrame);
      googleUiObserver.disconnect();
    };
  }, []);

  async function switchLanguage() {
    if (isSwitching) return;

    const nextLanguage: Language = language === "en" ? "vi" : "en";
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    setTranslationCookie(nextLanguage);
    setLanguage(nextLanguage);

    if (nextLanguage === "en") {
      window.location.reload();
      return;
    }

    setIsSwitching(true);
    const select = await waitForTranslateSelect();
    if (select) {
      select.value = "vi";
      select.dispatchEvent(new Event("change"));
      setIsSwitching(false);
      return;
    }

    // The legacy widget can be delayed or blocked in production. Fall back to
    // Google's hosted translator so the control always has a working path.
    const translateUrl = new URL("https://translate.google.com/translate");
    translateUrl.searchParams.set("sl", "en");
    translateUrl.searchParams.set("tl", "vi");
    translateUrl.searchParams.set("u", window.location.href);
    window.location.assign(translateUrl.toString());
  }

  return (
    <>
      <div id="google_translate_element" aria-hidden="true" style={{ display: "none" }} />
      <button
        className="translate-button"
        type="button"
        onClick={switchLanguage}
        disabled={isSwitching}
        title={isSwitching ? "Loading Vietnamese translation" : language === "en" ? "Switch to Vietnamese" : "Switch to English"}
        aria-label={isSwitching ? "Loading Vietnamese translation" : language === "en" ? "Switch site language to Vietnamese" : "Switch site language to English"}
      >
        <span style={{ fontWeight: language === "en" ? 700 : 400 }}>EN</span>
        <span aria-hidden="true">/</span>
        <span style={{ fontWeight: language === "vi" ? 700 : 400 }}>VI</span>
      </button>
    </>
  );
}
