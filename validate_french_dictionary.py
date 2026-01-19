import json
import re

# List of known invalid/corrupted words to remove from French dictionary
INVALID_WORDS = {
    "nuent",  # Not a real French word
    "dénuent",  # Not a standard French verb form
}

# Additional validation: words that look suspicious
SUSPICIOUS_PATTERNS = [
    # Single character followed by -ent (likely corrupted)
    r'^[a-z]ent$',
    # Words with unusual character combinations
]

def validate_french_word(word):
    """Check if a word is likely valid French"""
    if word in INVALID_WORDS:
        return False
    
    # Check suspicious patterns
    for pattern in SUSPICIOUS_PATTERNS:
        if re.match(pattern, word.lower()):
            return False
    
    # Word should have at least 2 characters and only French letters
    if len(word) < 2:
        return False
    
    # Allow only French characters
    if not re.match(r'^[a-zàâäéèêëïîôöùûüÿç\-]+$', word.lower()):
        return False
    
    return True

# Load dictionary
print("Loading French dictionary...")
with open('french_words_list.json', 'r', encoding='utf-8') as f:
    words = json.load(f)

print(f"Original dictionary size: {len(words)} words")

# Filter invalid words
valid_words = [w for w in words if validate_french_word(w)]

print(f"Cleaned dictionary size: {len(valid_words)} words")
print(f"Removed {len(words) - len(valid_words)} invalid entries")

# Show removed words
removed_words = set(words) - set(valid_words)
if removed_words:
    print(f"\nRemoved words: {sorted(removed_words)}")

# Save cleaned dictionary
with open('french_words_list.json', 'w', encoding='utf-8') as f:
    json.dump(valid_words, f, ensure_ascii=False)

print("\nDictionary cleaned and saved!")
