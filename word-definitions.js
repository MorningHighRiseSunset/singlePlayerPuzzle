/**
 * Shared word-definition helper for non-English Scrabble games.
 * Uses /api/define (DeepL + dictionary fallback) when deployed on Vercel.
 */

async function fetchEnglishDefinition(word) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

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
    if (error.name !== 'AbortError') {
      console.error(`Error fetching English definition for ${word}:`, error);
    }
  }
  return null;
}

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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/${dictionaryLang}/${encodeURIComponent(cleanWord.toLowerCase())}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`Dictionary API returned ${response.status} for ${cleanWord} (${dictionaryLang})`);
      // Fallback to English if language-specific API fails
      if (dictionaryLang !== 'en') {
        console.log(`Falling back to English definition for ${cleanWord}`);
        return await fetchEnglishDefinition(cleanWord);
      }
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
    if (error.name === 'AbortError') {
      console.warn(`Dictionary API timeout for ${cleanWord} (${dictionaryLang})`);
      // Fallback to English on timeout
      if (dictionaryLang !== 'en') {
        console.log(`Falling back to English definition for ${cleanWord} after timeout`);
        return await fetchEnglishDefinition(cleanWord);
      }
    } else {
      console.error(`Error fetching definition for ${word}:`, error);
    }
  }

  return null;
}
