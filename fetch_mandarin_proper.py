#!/usr/bin/env python3
"""
Fetch comprehensive Mandarin/Chinese dictionary from professional sources
"""

import urllib.request
import json

print("Searching for comprehensive Chinese/Mandarin dictionary...")

# Multiple sources for Chinese dictionaries
sources = [
    # Most common Chinese characters and words
    ('https://raw.githubusercontent.com/fxsjy/jieba/master/extra_dict/dict.txt.big', 'Jieba dictionary'),
    ('https://raw.githubusercontent.com/mozillazg/pinyin-data/master/pinyin_dict.py', 'Pinyin data'),
    ('https://raw.githubusercontent.com/fxsjy/jieba/master/extra_dict/dict.txt.small', 'Jieba small'),
]

best_result = None
best_count = 0

for url, name in sources:
    try:
        print(f"\nTrying: {name}")
        print(f"  URL: {url}")
        response = urllib.request.urlopen(url, timeout=10)
        content = response.read().decode('utf-8', errors='ignore')
        
        # Extract words - different formats for different sources
        words = []
        for line in content.split('\n'):
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            # Handle various formats
            parts = line.split()
            if parts:
                word = parts[0]
                if len(word) > 0 and '\x00' not in word:
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
        continue

if best_result and best_count > 300:
    with open('mandarin_words_list.json', 'w', encoding='utf-8') as f:
        json.dump(best_result, f, ensure_ascii=False, indent=1)
    print(f"\n✓ SUCCESS: Saved {best_count} Chinese words to mandarin_words_list.json")
else:
    print(f"\n✗ Could not find comprehensive dictionary (best found: {best_count} words)")
    print("\nAlternatives:")
    print("1. https://github.com/fxsjy/jieba - Chinese segmentation (has dictionaries)")
    print("2. https://github.com/mozillazg/pinyin-data - Pinyin dictionary")
    print("3. https://github.com/overtrue/pinyin - Another pinyin source")
    print("4. https://github.com/ysc/word - Chinese word list")
