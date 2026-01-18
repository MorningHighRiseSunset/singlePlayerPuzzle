#!/usr/bin/env python3
import urllib.request
import json

url = "https://raw.githubusercontent.com/JorgeDuenasLerin/diccionario-espanol-txt/master/data/allwords.txt"

try:
    print("Downloading Spanish word list...")
    with urllib.request.urlopen(url) as response:
        data = response.read().decode('utf-8')
        words = data.strip().split('\n')
        
    print(f"Downloaded {len(words)} words")
    
    # Save as JSON array format for JavaScript
    with open('spanish_words_list.json', 'w', encoding='utf-8') as f:
        json.dump(words, f, ensure_ascii=False, indent=1)
    
    print(f"Saved to spanish_words_list.json")
    
    # Also create a version ready for JavaScript
    js_array = ','.join([f'"{word}"' for word in words])
    
    with open('spanish_words_array.txt', 'w', encoding='utf-8') as f:
        f.write(js_array)
    
    print(f"Also saved JavaScript-ready format to spanish_words_array.txt")
    print(f"First 10 words: {words[:10]}")
    
except Exception as e:
    print(f"Error: {e}")
