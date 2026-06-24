/**
 * Vercel serverless endpoint: word definitions with DeepL translation fallback.
 * Set DEEPL_AUTH_KEY in Vercel environment variables (or .env.local for `vercel dev`).
 */

const DEEPL_FREE_URL = "https://api-free.deepl.com/v2/translate";
const DEEPL_PRO_URL = "https://api.deepl.com/v2/translate";

const LANG_CONFIG = {
  es: { dictionary: "es", deepl: "ES" },
  fr: { dictionary: "fr", deepl: "FR" },
  hi: { dictionary: "hi", deepl: null },
  zh: { dictionary: "zh", deepl: "ZH" },
  en: { dictionary: "en", deepl: "EN-US" },
};

function getDeepLBaseUrl(key) {
  return key.endsWith(":fx") ? DEEPL_FREE_URL : DEEPL_PRO_URL;
}

async function fetchDictionaryDefinition(word, langCode) {
  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/${langCode}/${encodeURIComponent(word.toLowerCase())}`,
  );
  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  if (!data?.[0]?.meanings?.length) {
    return null;
  }

  return data[0].meanings.map((meaning) => ({
    partOfSpeech: meaning.partOfSpeech || "definition",
    definitions: meaning.definitions
      .slice(0, 2)
      .map((entry) => entry.definition)
      .filter(Boolean),
  }));
}

async function translateWithDeepL(texts, targetLang, authKey) {
  if (!authKey || !targetLang || !texts.length) {
    return null;
  }

  const body = new URLSearchParams();
  body.set("target_lang", targetLang);
  texts.forEach((text) => body.append("text", text));

  const response = await fetch(getDeepLBaseUrl(authKey), {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${authKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return (data.translations || []).map((entry) => entry.text);
}

async function buildTranslatedDefinition(word, langKey, authKey) {
  const english = await fetchDictionaryDefinition(word, "en");
  if (!english?.length) {
    return null;
  }

  const config = LANG_CONFIG[langKey];
  if (!config?.deepl) {
    return english.map((meaning) => ({
      partOfSpeech: meaning.partOfSpeech,
      definitions: meaning.definitions.map(
        (definition) => `[EN] ${definition}`,
      ),
    }));
  }

  const flatDefinitions = english.flatMap((meaning) => meaning.definitions);
  const translated = await translateWithDeepL(
    flatDefinitions,
    config.deepl,
    authKey,
  );
  if (!translated?.length) {
    return english;
  }

  let index = 0;
  return english.map((meaning) => ({
    partOfSpeech: meaning.partOfSpeech,
    definitions: meaning.definitions.map(() => translated[index++] || ""),
  }));
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const word = String(req.query.word || "").trim();
  const langKey = String(req.query.lang || "en").trim().toLowerCase();
  const config = LANG_CONFIG[langKey];

  if (!word || !config) {
    return res.status(400).json({ error: "Missing or invalid word/lang" });
  }

  const authKey = process.env.DEEPL_AUTH_KEY || process.env.DEEPL_API_KEY;

  try {
    let meanings = await fetchDictionaryDefinition(word, config.dictionary);
    if (!meanings?.length) {
      meanings = await buildTranslatedDefinition(word, langKey, authKey);
    }

    if (!meanings?.length) {
      return res.status(404).json({ error: "No definition found" });
    }

    return res.status(200).json({ word, lang: langKey, meanings });
  } catch (error) {
    console.error("Definition lookup failed:", error);
    return res.status(500).json({ error: "Definition lookup failed" });
  }
}
