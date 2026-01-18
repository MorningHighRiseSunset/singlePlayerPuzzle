#!/usr/bin/env python3
"""
Fetch comprehensive Hindi dictionary from multiple sources
"""

import urllib.request
import json

print("Searching for comprehensive Hindi dictionary...\n")

sources = [
    # GitHub sources for Hindi
    ('https://raw.githubusercontent.com/ai4bharat/IndicNLP/master/src/main/resources/hindi/words.txt', 'Indic NLP words'),
    ('https://raw.githubusercontent.com/amanjeev/hindi-wordlist/master/all.txt', 'Amanjeev wordlist'),
    ('https://raw.githubusercontent.com/surya-veer/hindi-stop-words/master/hindi', 'Hindi stopwords'),
    ('https://raw.githubusercontent.com/khandelwals/hindi/master/hindi.txt', 'Hindi collection'),
    # Try a different approach - download from a simpler source
    ('https://raw.githubusercontent.com/dwyl/hindi-words/master/words.txt', 'DWYL Hindi words'),
]

best_result = None
best_count = 0
best_source = ""

for url, name in sources:
    try:
        print(f"Trying: {name}")
        print(f"  URL: {url}")
        response = urllib.request.urlopen(url, timeout=10)
        content = response.read().decode('utf-8', errors='ignore')
        
        words = []
        for line in content.split('\n'):
            line = line.strip()
            if not line or line.startswith('#') or line.startswith(';'):
                continue
            # Handle various formats - take first word/column
            parts = line.split()
            if parts:
                word = parts[0].strip()
                # Filter out junk, keep valid Hindi words
                if len(word) > 0 and len(word) < 50:
                    words.append(word)
        
        unique_words = sorted(list(set(words)))
        if len(unique_words) > best_count:
            best_count = len(unique_words)
            best_result = unique_words
            best_source = name
            print(f"  ✓ Found {len(unique_words)} unique words - NEW BEST\n")
        else:
            print(f"  ✓ Found {len(unique_words)} unique words\n")
            
    except Exception as e:
        print(f"  ✗ Failed: {type(e).__name__}\n")
        continue

if best_result and best_count > 300:
    with open('hindi_words_list.json', 'w', encoding='utf-8') as f:
        json.dump(best_result, f, ensure_ascii=False, indent=1)
    print(f"✓ SUCCESS: Saved {best_count} Hindi words from '{best_source}'")
    print(f"   File: hindi_words_list.json")
elif best_result:
    print(f"⚠ Found only {best_count} words (less than ideal)")
    print(f"   Keeping existing 639-word dictionary")
else:
    print("✗ No sources accessible")
    print("\nNote: Hindi dictionary sources are limited online.")
    print("Consider using existing extracted dictionary (639 words) as fallback.")
