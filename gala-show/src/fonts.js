// Josefin Sans, the Gala's one face, inlined so the deck works offline and
// from file:// (Chrome won't load font files from disk).
import josefinNormal from '../node_modules/@fontsource-variable/josefin-sans/files/josefin-sans-latin-wght-normal.woff2';
import josefinItalic from '../node_modules/@fontsource-variable/josefin-sans/files/josefin-sans-latin-wght-italic.woff2';

export function injectFonts() {
  const style = document.createElement('style');
  style.textContent = `
@font-face{font-family:'Josefin Show';src:url(${josefinNormal}) format('woff2');font-weight:100 700;font-style:normal;font-display:block}
@font-face{font-family:'Josefin Show';src:url(${josefinItalic}) format('woff2');font-weight:100 700;font-style:italic;font-display:block}`;
  document.head.append(style);
  return document.fonts.ready;
}
