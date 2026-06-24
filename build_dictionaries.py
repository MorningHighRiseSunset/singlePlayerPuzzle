#!/usr/bin/env python3
"""Download and build Scrabble-quality word lists for Spanish, French, Hindi, and Mandarin."""

import json
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).parent

SPANISH_URL = (
    "https://raw.githubusercontent.com/kamilmielnik/scrabble-dictionaries/master/spanish/file-2017.txt"
)
FRENCH_URL = (
    "https://raw.githubusercontent.com/Thecoolsim/French-Scrabble-ODS8/main/French%20ODS%20dictionary.txt"
)
HINDI_URL = "https://raw.githubusercontent.com/tesseract-ocr/langdata_lstm/main/hin/hin.wordlist"
HINDI_WORDLE_URL = (
    "https://raw.githubusercontent.com/abcdeepakr/hindi-wordle/main/data/words.json"
)
MANDARIN_URL = (
    "https://raw.githubusercontent.com/fxsjy/jieba/master/extra_dict/dict.txt.small"
)

DEVANAGARI_RE = re.compile(r"^[\u0900-\u097F]+$")
CJK_RE = re.compile(r"^[\u4e00-\u9fff]+$")
FRENCH_RE = re.compile(r"^[a-zàâäéèêëïîôöùûüÿç\-']+$")
SPANISH_RE = re.compile(r"^[a-zñü\-']+$")


def fetch_text(url: str, timeout: int = 60) -> str:
    print(f"  Downloading {url}")
    with urllib.request.urlopen(url, timeout=timeout) as response:
        return response.read().decode("utf-8")


def save_json(name: str, words: list[str]) -> None:
    path = ROOT / name
    with path.open("w", encoding="utf-8") as handle:
        json.dump(words, handle, ensure_ascii=False)
    print(f"  Saved {len(words):,} words -> {name} ({path.stat().st_size // 1024} KB)")


def build_spanish() -> list[str]:
    print("\n[Spanish] FISE / FILE 2017 Scrabble lexicon")
    words = {
        word.strip().lower()
        for word in fetch_text(SPANISH_URL).splitlines()
        if word.strip() and len(word.strip()) >= 2 and SPANISH_RE.match(word.strip().lower())
    }
    return sorted(words)


def build_french() -> list[str]:
    print("\n[French] ODS8 official Scrabble lexicon")
    words = {
        word.strip().lower()
        for word in fetch_text(FRENCH_URL).splitlines()
        if word.strip() and len(word.strip()) >= 2 and FRENCH_RE.match(word.strip().lower())
    }
    return sorted(words)


def build_hindi() -> list[str]:
    print("\n[Hindi] Tesseract + hindi-wordle word lists")
    words: set[str] = set()

    for line in fetch_text(HINDI_URL, timeout=30).splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        word = line.split("|")[0].strip()
        if len(word) >= 2 and DEVANAGARI_RE.match(word):
            words.add(word)

    try:
        payload = json.loads(fetch_text(HINDI_WORDLE_URL, timeout=30))
        candidates = payload if isinstance(payload, list) else payload.get("words", [])
        for item in candidates:
            if isinstance(item, str) and len(item) >= 2 and DEVANAGARI_RE.match(item):
                words.add(item)
            elif isinstance(item, dict):
                for key in ("word", "hindi", "text"):
                    value = item.get(key)
                    if isinstance(value, str) and len(value) >= 2 and DEVANAGARI_RE.match(value):
                        words.add(value)
    except Exception as error:
        print(f"  Warning: could not merge hindi-wordle list: {error}")

    return sorted(words)


def build_mandarin() -> list[str]:
    print("\n[Mandarin] Jieba dictionary (pure CJK, 2-7 characters)")
    words: set[str] = set()
    for line in fetch_text(MANDARIN_URL, timeout=30).splitlines():
        parts = line.strip().split()
        if not parts:
            continue
        word = parts[0]
        if 2 <= len(word) <= 7 and CJK_RE.match(word):
            words.add(word)
    return sorted(words)


def main() -> None:
    print("Building language dictionaries...")
    save_json("spanish_words_list.json", build_spanish())
    save_json("french_words_list.json", build_french())
    save_json("hindi_words_list.json", build_hindi())
    save_json("mandarin_words_list.json", build_mandarin())
    print("\nDone.")


if __name__ == "__main__":
    main()
