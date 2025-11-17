import phrases from "./motivatedPhrases.json";

export const getRandomPhrase = () => {
  const i = Math.floor(Math.random() * phrases.length);
  return phrases[i].phrase;
};
