#!/usr/bin/env python
import os

files = ['script.js', 'spanish.js', 'french.js', 'hindi.js', 'mandarin.js']
old_msg = "game.appendConsoleMessage('Console copied to clipboard')"
new_msg = "game.appendConsoleMessage(typeof t === 'function' ? t('copied-clipboard') : 'Console copied to clipboard')"

for fname in files:
    fpath = os.path.join(os.getcwd(), fname)
    if os.path.exists(fpath):
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        old_count = content.count(old_msg)
        content = content.replace(old_msg, new_msg)
        
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f'{fname}: Replaced {old_count} occurrences')
    else:
        print(f'{fname}: Not found')

print('Done!')
