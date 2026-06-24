/**
 * Shared word-definition helper for non-English Scrabble games.
 * Uses /api/define (DeepL + dictionary fallback) when deployed on Vercel.
 */

async function fetchWordDefinition(word, langKey) {
  if (
    !word ||
    word === "SKIP" ||
    word === "EXCHANGE" ||
    word === "QUIT" ||
    word.includes("&")
  ) {
    return null;
  }

  const cleanWord = word.split("(")[0].trim();
  if (!cleanWord) {
    return null;
  }

  try {
    const response = await fetch(
      `/api/define?word=${encodeURIComponent(cleanWord)}&lang=${encodeURIComponent(langKey)}`,
    );
    if (response.ok) {
      const data = await response.json();
      if (data?.meanings?.length) {
        return data.meanings;
      }
    }
  } catch (_error) {
    // Local static server won't have /api/define — fall through.
  }

  const dictionaryLang = { es: "es", fr: "fr", hi: "hi", zh: "zh" }[langKey];
  if (!dictionaryLang) {
    return null;
  }

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/${dictionaryLang}/${encodeURIComponent(cleanWord.toLowerCase())}`,
    );
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data?.[0]?.meanings) {
      return data[0].meanings.map((meaning) => ({
        partOfSpeech: meaning.partOfSpeech,
        definitions: meaning.definitions
          .slice(0, 2)
          .map((entry) => entry.definition),
      }));
    }
  } catch (error) {
    console.error(`Error fetching definition for ${word}:`, error);
  }

  return null;
}
