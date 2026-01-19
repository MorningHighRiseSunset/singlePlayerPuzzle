import json
import re
from collections import Counter

def analyze_french_dictionary():
    """Comprehensive analysis of French dictionary for invalid/suspicious words"""
    
    print("Loading French dictionary...")
    with open('french_words_list.json', 'r', encoding='utf-8') as f:
        words = json.load(f)
    
    print(f"Total words: {len(words)}\n")
    
    suspicious_words = []
    
    # Check 1: Words that are too short (single letter before/after suffix)
    print("CHECK 1: Suspiciously short or malformed words...")
    short_pattern = r'^[a-z]ent$|^[a-z]ant$|^[a-z]est$|^[a-z]ait$|^[a-z]ent$'
    for word in words:
        if re.match(short_pattern, word.lower()):
            suspicious_words.append(('short_pattern', word))
    
    if suspicious_words:
        print(f"  Found {len([w for t,w in suspicious_words if t == 'short_pattern'])} suspicious short pattern words")
        short_words = [w for t,w in suspicious_words if t == 'short_pattern']
        print(f"  Examples: {short_words[:20]}")
    else:
        print("  ✓ No suspicious short pattern words found")
    
    # Check 2: Non-French characters (excluding hyphens and accents)
    print("\nCHECK 2: Words with non-French characters...")
    non_french_words = []
    for word in words:
        if not re.match(r'^[a-zàâäéèêëïîôöùûüÿç\-\']+$', word.lower()):
            non_french_words.append(word)
    
    if non_french_words:
        print(f"  ⚠ Found {len(non_french_words)} words with non-French characters!")
        print(f"  Examples: {non_french_words[:30]}")
        suspicious_words.extend([('non_french', w) for w in non_french_words])
    else:
        print("  ✓ No non-French character words found")
    
    # Check 3: Duplicate entries
    print("\nCHECK 3: Duplicate entries...")
    word_counts = Counter(words)
    duplicates = [w for w, c in word_counts.items() if c > 1]
    if duplicates:
        print(f"  ⚠ Found {len(duplicates)} duplicate words!")
        print(f"  Examples: {duplicates[:20]}")
    else:
        print("  ✓ No duplicates found")
    
    # Check 4: Common corrupted patterns
    print("\nCHECK 4: Common corruption patterns...")
    corruption_patterns = [
        (r'^[\d]+$', 'pure_numbers'),
        (r'[0-9]', 'contains_digits'),
        (r'[,;!?\(\)\[\]]', 'contains_punctuation'),
        (r'--+', 'multiple_hyphens'),
        (r"''", 'double_apostrophes'),
    ]
    
    corruption_found = {}
    for pattern, name in corruption_patterns:
        matches = [w for w in words if re.search(pattern, w)]
        if matches:
            corruption_found[name] = matches
            print(f"  ⚠ Found {len(matches)} words matching '{name}' pattern")
            print(f"    Examples: {matches[:20]}")
            suspicious_words.extend([(name, w) for w in matches])
        else:
            print(f"  ✓ No '{name}' patterns found")
    
    # Check 5: Words that are just accented versions of each other
    print("\nCHECK 5: Checking for potentially invalid verb forms...")
    # Words ending in -ent that might be invalid 3rd person plurals
    verb_forms = [w for w in words if w.endswith('ent') and len(w) >= 4]
    print(f"  Found {len(verb_forms)} words ending in '-ent' (likely verb conjugations)")
    
    # Check 6: Character frequency analysis (words with unusual character distributions)
    print("\nCHECK 6: Words with unusual patterns...")
    unusual_words = []
    for word in words:
        # Words with too many same characters in a row
        if re.search(r'(.)\1{3,}', word):  # 4+ same characters
            unusual_words.append(('repeated_chars', word))
        # Words that are just accents/diacritics repeated
        elif len(set(word)) < 2:
            unusual_words.append(('minimal_variety', word))
    
    if unusual_words:
        print(f"  ⚠ Found {len(unusual_words)} words with unusual patterns")
        print(f"  Examples: {unusual_words[:20]}")
        suspicious_words.extend(unusual_words)
    else:
        print("  ✓ No unusual pattern words found")
    
    # Summary
    print("\n" + "="*70)
    print("SUMMARY")
    print("="*70)
    total_suspicious = len(set(suspicious_words))
    print(f"\nTotal suspicious entries found: {total_suspicious}")
    
    if total_suspicious > 0:
        print("\nSuspicious word list (grouped by type):")
        by_type = {}
        for word_type, word in suspicious_words:
            if word_type not in by_type:
                by_type[word_type] = []
            by_type[word_type].append(word)
        
        for word_type in sorted(by_type.keys()):
            unique_words = sorted(set(by_type[word_type]))
            print(f"\n  {word_type} ({len(unique_words)} words):")
            print(f"    {unique_words}")
    else:
        print("\n✓ Dictionary appears clean! No suspicious words detected.")
    
    print(f"\nDictionary integrity: {len(words)} total words analyzed")

if __name__ == "__main__":
    analyze_french_dictionary()
