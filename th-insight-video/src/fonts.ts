import {continueRender, delayRender, staticFile} from 'remotion';

const faces: [string, string, number][] = [
  ['Plus Jakarta Sans', 'fonts/plus-jakarta-sans-latin-700-normal.woff2', 700],
  ['Plus Jakarta Sans', 'fonts/plus-jakarta-sans-latin-800-normal.woff2', 800],
  ['Google Sans', 'fonts/google-sans-latin-400-normal.woff2', 400],
  ['Google Sans', 'fonts/google-sans-latin-500-normal.woff2', 500],
  ['Google Sans', 'fonts/google-sans-latin-700-normal.woff2', 700],
];

let started = false;
export const loadFonts = () => {
  if (started || typeof document === 'undefined') return;
  started = true;
  const handle = delayRender('fonts');
  Promise.all(
    faces.map(([family, file, weight]) => {
      const ff = new FontFace(family, `url(${staticFile(file)}) format('woff2')`, {weight: String(weight)});
      return ff.load().then((f) => document.fonts.add(f));
    }),
  )
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
};
