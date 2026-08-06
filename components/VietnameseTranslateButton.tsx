"use client";

export function VietnameseTranslateButton() {
  function translatePage() {
    const translationUrl = new URL("https://translate.google.com/translate");
    translationUrl.searchParams.set("sl", "en");
    translationUrl.searchParams.set("tl", "vi");
    translationUrl.searchParams.set("u", window.location.href);
    window.location.assign(translationUrl.toString());
  }

  return <button className="translate-button" type="button" onClick={translatePage} title="Translate this page to Vietnamese" aria-label="Translate this page to Vietnamese">A <span aria-hidden="true">文</span><b>VI</b></button>;
}
