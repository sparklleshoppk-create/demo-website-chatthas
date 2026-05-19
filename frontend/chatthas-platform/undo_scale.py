import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Undo the cascade damage. Since everything collapsed to text-4xl, we will make it text-sm by default.
    # Then we will manually fix headers later if needed.
    replacements = {
        r'text-4xl': 'text-sm',
        r'text-5xl': 'text-lg',
        r'h-6 w-6': 'h-4 w-4',
        r'h-5 w-5': 'h-4 w-4',
        r'size=\{18\}': 'size={14}',
        r'size=\{20\}': 'size={16}',
        r'size=\{16\}': 'size={12}',
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
