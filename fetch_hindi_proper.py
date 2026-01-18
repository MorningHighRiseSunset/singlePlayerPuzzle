#!/usr/bin/env python3
"""
Fetch comprehensive Hindi dictionary from professional sources
"""

import urllib.request
import json

print("Searching for comprehensive Hindi dictionary...")

# Hindi dictionary sources
sources = [
    ('https://raw.githubusercontent.com/amanjeev/hindi-wordlist/master/all.txt', 'Hindi wordlist repo'),
    ('https://raw.githubusercontent.com/ai4bharat/IndicSentences/main/indic_nlp_resources/lexicons/hi_IN.txt', 'Indic NLP'),
]

best_result = None
best_count = 0

for url, name in sources:
    try:
        print(f"\nTrying: {name}")
        response = urllib.request.urlopen(url, timeout=10)
        content = response.read().decode('utf-8', errors='ignore')
        
        words = []
        for line in content.split('\n'):
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            parts = line.split()
            if parts:
                word = parts[0]
                if len(word) > 0 and len(word) > 1:
                    words.append(word)
        
        unique_words = sorted(list(set(words)))
        if len(unique_words) > best_count:
            best_count = len(unique_words)
            best_result = unique_words
            print(f"  ✓ Found {len(unique_words)} unique words - NEW BEST")
        else:
            print(f"  ✓ Found {len(unique_words)} unique words")
            
    except Exception as e:
        print(f"  ✗ Failed: {type(e).__name__}")

if best_result and best_count > 300:
    with open('hindi_words_list.json', 'w', encoding='utf-8') as f:
        json.dump(best_result, f, ensure_ascii=False, indent=1)
    print(f"\n✓ SUCCESS: Saved {best_count} Hindi words to hindi_words_list.json")
else:
    print(f"\n✗ Could not find comprehensive dictionary (best found: {best_count} words)")
    print("Using existing extracted dictionary from hindi.js")
