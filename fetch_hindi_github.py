#!/usr/bin/env python3
"""
Fetch Hindi wordlist from GitHub
Using popular Hindi wordlists available on GitHub
"""

import urllib.request
import json

print("Downloading Hindi wordlist from GitHub...")

# Try multiple Hindi wordlist sources from GitHub
hindi_sources = [
    # Option 1: Popular Hindi wordlist
    'https://raw.githubusercontent.com/agarwal-harshit/hindi-wordlist/master/words.txt',
    # Option 2: Alternative source
    'https://raw.githubusercontent.com/khandelwals/hindi/master/dictionary.txt',
]

hindi_words = []

for url in hindi_sources:
    try:
        print(f"Trying: {url}")
        response = urllib.request.urlopen(url, timeout=5)
        content = response.read().decode('utf-8')
        words = [word.strip() for word in content.split('\n') if word.strip() and len(word.strip()) > 1]
        if words:
            hindi_words.extend(words)
            print(f"  ✓ Downloaded {len(words)} words")
            break
    except Exception as e:
        print(f"  ✗ Failed: {type(e).__name__}")
        continue

if hindi_words:
    # Remove duplicates and sort
    hindi_words = sorted(list(set(hindi_words)))
    
    with open('hindi_words_list.json', 'w', encoding='utf-8') as f:
        json.dump(hindi_words, f, ensure_ascii=False, indent=1)
    
    print(f"\nHindi: Downloaded {len(hindi_words)} unique words, saved to hindi_words_list.json")
else:
    print("\nAll sources failed. Creating minimal fallback Hindi dictionary...")
    # Create a basic fallback with common Hindi words
    basic_hindi = ["है", "और", "की", "को", "में", "का", "के", "एक", "यह", "उस", "से", "भी", "या", "सी", 
                   "नहीं", "थी", "होगा", "वह", "मेरे", "तुम्हारे", "उनके", "जो", "हम", "तुम", "आप", "वे"]
    
    with open('hindi_words_list.json', 'w', encoding='utf-8') as f:
        json.dump(basic_hindi, f, ensure_ascii=False, indent=1)
    
    print(f"Hindi: Created minimal fallback with {len(basic_hindi)} words")

print("\nNote: For better Hindi dictionaries, consider:")
print("- https://github.com/agarwal-harshit/hindi-wordlist")
print("- https://huggingface.co/datasets/cfilt/iwn_wordlists (requires manual download)")
