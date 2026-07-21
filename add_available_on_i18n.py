import re

def append_to_dict(filename, block):
    with open(filename, 'r') as f:
        content = f.read()
    
    # insert before footer
    content = re.sub(r'(footer: \{)', block + r'\n  \1', content)
    
    with open(filename, 'w') as f:
        f.write(content)

id_content = """  platforms: {
    availableOn: "Juga tersedia untuk disewa melalui platform:",
    secure: "Transaksi aman & terjamin"
  },"""

en_content = """  platforms: {
    availableOn: "Also available for hire on these platforms:",
    secure: "Secure & guaranteed transactions"
  },"""

append_to_dict('src/lib/i18n/id.ts', id_content)
append_to_dict('src/lib/i18n/en.ts', en_content)
