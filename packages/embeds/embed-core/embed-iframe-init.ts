export default function EmbedInitIframe() {
  if (typeof window === "undefined" || window.isEmbed) {
    return;
  }

  const calEmbedMode = typeof new URL(document.URL).searchParams.get("embed") === "string";

  /* Iframe Name */
  window.name.includes("cal-embed");

  window.isEmbed = () => {
    // Once an embed mode always an embed mode
    return calEmbedMode;
  };

  window.resetEmbedStatus = () => {
    try {
      // eslint-disable-next-line @calcom/eslint/avoid-web-storage
      window.sessionStorage.removeItem("calEmbedMode");
    } catch (e) {}
  };

  window.getEmbedTheme = () => {
    const url = new URL(document.URL);
    return url.searchParams.get("theme") as "light" | "dark" | null;
  };

  window.getEmbedNamespace = () => {
    const url = new URL(document.URL);
    const namespace = url.searchParams.get("embed");
    return namespace;
  };

  window.CalEmbed = window.CalEmbed || {};

  window.CalEmbed.applyCssVars = (cssVarsPerTheme) => {
    const cssVarsStyle = [];
    if (cssVarsPerTheme) {
      for (const [themeName, cssVars] of Object.entries(cssVarsPerTheme)) {
        cssVarsStyle.push(`.${themeName} {`);
        for (const [cssVarName, value] of Object.entries(cssVars)) {
          // The styles are applied inline on .light/.dark elements by the codebase(useCalcomTheme). So, to make sure embed styles take precedence, we add !important
          cssVarsStyle.push(`--${cssVarName}: ${value} !important;`);
        }
        cssVarsStyle.push(`}`);
      }
    }

    const existingStyleEl = document.head.querySelector("#embed-css-vars") as HTMLStyleElement;
    if (existingStyleEl) {
      console.warn("Existing embed CSS Vars are being reset");
      existingStyleEl.innerText = cssVarsStyle.join("\n");
      return;
    }

    const style = document.createElement("style");
    style.id = "embed-css-vars";
    style.innerText = cssVarsStyle.join("\n");
    document.head.appendChild(style);
  };
}
