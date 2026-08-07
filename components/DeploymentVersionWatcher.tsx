"use client";

import { useEffect } from "react";

const CHECK_INTERVAL_MS = 60_000;
const RELOAD_ATTEMPT_KEY = "kims-nails-reload-version";

export function DeploymentVersionWatcher({ currentVersion }: { currentVersion: string }) {
  useEffect(() => {
    let active = true;

    async function checkForNewDeployment() {
      try {
        const response = await fetch(`/api/version?t=${Date.now()}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });

        if (!response.ok) return;

        const data = (await response.json()) as { version?: string };
        const latestVersion = data.version;

        if (
          active &&
          latestVersion &&
          latestVersion !== currentVersion &&
          sessionStorage.getItem(RELOAD_ATTEMPT_KEY) !== latestVersion
        ) {
          sessionStorage.setItem(RELOAD_ATTEMPT_KEY, latestVersion);
          window.location.reload();
        }
      } catch {
        // A temporary network failure should never interrupt the customer.
      }
    }

    function checkWhenVisible() {
      if (document.visibilityState === "visible") void checkForNewDeployment();
    }

    void checkForNewDeployment();
    const interval = window.setInterval(checkForNewDeployment, CHECK_INTERVAL_MS);
    window.addEventListener("focus", checkForNewDeployment);
    window.addEventListener("pageshow", checkForNewDeployment);
    document.addEventListener("visibilitychange", checkWhenVisible);

    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", checkForNewDeployment);
      window.removeEventListener("pageshow", checkForNewDeployment);
      document.removeEventListener("visibilitychange", checkWhenVisible);
    };
  }, [currentVersion]);

  return null;
}
