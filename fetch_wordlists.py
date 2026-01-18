#!/usr/bin/env python3
import urllib.request
import json

print("Downloading French wordlist from CDN...")
try:
    response = urllib.request.urlopen('https://cdn.jsdelivr.net/npm/french-wordlist/words.txt')
    french_content = response.read().decode('utf-8')
    french_words = [word.strip().lower() for word in french_content.split('\n') if word.strip() and len(word.strip()) > 1]
    french_words = list(set(french_words))  # Remove duplicates
    french_words.sort()
    
    with open('french_words_list.json', 'w', encoding='utf-8') as f:
        json.dump(french_words, f, ensure_ascii=False, indent=1)
    
    print(f"French: Downloaded {len(french_words)} unique words, saved to french_words_list.json")
except Exception as e:
    print(f"Error downloading French wordlist: {e}")

print("\nNote: For Hindi, use the Hugging Face dataset at https://huggingface.co/datasets/cfilt/iwn_wordlists")
print("You can download from there manually or use the Hugging Face API")
