import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replacements to make text larger
    replacements = {
        r'text-\[9px\]': 'text-xs',
        r'text-\[10px\]': 'text-sm',
        r'text-\[11px\]': 'text-sm',
        r'text-xs': 'text-base',
        r'text-sm': 'text-lg',
        r'text-lg': 'text-xl',
        r'text-xl': 'text-2xl',
        r'text-2xl': 'text-3xl',
        r'text-3xl': 'text-4xl',
        r'h-3 w-3': 'h-4 w-4',
        r'h-3\.5 w-3\.5': 'h-5 w-5',
        r'h-4 w-4': 'h-6 w-6',
        r'size=\{8\}': 'size={12}',
        r'size=\{10\}': 'size={16}',
        r'size=\{12\}': 'size={18}',
        r'size=\{14\}': 'size={20}',
    }

    new_content = content
    for pattern, repl in replacements.items():
        new_content = re.sub(pattern, repl, new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

def main():
    root_dir = os.path.join(os.getcwd(), 'src', 'app', 'admin')
    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith('.tsx'):
                process_file(os.path.join(dirpath, filename))

if __name__ == '__main__':
    main()
