import json
import re

# Common English words and non-French entries that shouldn't be in French dictionary
ENGLISH_WORDS_TO_REMOVE = {
    'amble',      # English: to walk slowly
    'morios',     # Archaic/obscure
    'skip',       # English verb/noun
    'name',       # English
    'test',       # English
    'sound',      # English
    'drill',      # English
    'play',       # English
    'score',      # English word used as French
    'word',       # English
    'computer',   # English
    'player',     # English
    'game',       # English
}

# Common English words that might be in French form but shouldn't be
ENGLISH_PATTERNS = [
    r'^[a-z]*ing$',        # English gerunds (-ing)
    r'^un[a-z]*able$',     # English -able words
]

print("Loading French dictionary...")
with open('french_words_list.json', 'r', encoding='utf-8') as f:
    words = json.load(f)

print(f"Starting with {len(words)} words\n")

# Find English words
found_english = [w for w in words if w.lower() in ENGLISH_WORDS_TO_REMOVE]
print(f"Found {len(found_english)} English words to remove:")
print(f"  {found_english}\n")

# Find pattern matches
found_patterns = []
for pattern in ENGLISH_PATTERNS:
    matches = [w for w in words if re.match(pattern, w.lower())]
    if matches:
        found_patterns.extend(matches)
        print(f"Pattern '{pattern}': {len(matches)} matches (examples: {matches[:10]})")

# Remove all invalid words
to_remove = set(found_english + found_patterns)
cleaned = [w for w in words if w.lower() not in to_remove and w not in to_remove]

print(f"\nTotal removed: {len(to_remove)} words")
print(f"Dictionary now has {len(cleaned)} words (down from {len(words)})")

# Save cleaned dictionary
with open('french_words_list.json', 'w', encoding='utf-8') as f:
    json.dump(cleaned, f, ensure_ascii=False)

print("\n✓ Dictionary cleaned and saved!")
