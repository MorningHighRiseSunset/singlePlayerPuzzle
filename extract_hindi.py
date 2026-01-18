#!/usr/bin/env python3
"""
Extract Hindi dictionary from hindi.js and save as JSON
"""

import re
import json

print("Extracting Hindi dictionary from hindi.js...")

with open('hindi.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract the hindiWords array
match = re.search(r"const hindiWords = \[([\s\S]*?)\]", content)
if match:
    array_content = match.group(1)
    # Split by comma and clean up
    words = re.findall(r"'([^']*)'", array_content)
    
    # Remove duplicates and filter
    hindi_words = sorted(list(set(w for w in words if w.strip() and len(w.strip()) > 0)))
    
    with open('hindi_words_list.json', 'w', encoding='utf-8') as f:
        json.dump(hindi_words, f, ensure_ascii=False, indent=1)
    
    print(f"Hindi: Extracted {len(hindi_words)} unique words from hindi.js")
    print(f"Saved to hindi_words_list.json")
else:
    print("Error: Could not find hindiWords array in hindi.js")
