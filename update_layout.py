with open('src/components/LayoutWrapper.tsx', 'r') as f:
    content = f.read()

# Replace Navbar links
content = content.replace(
    'Layanan\n              </button>',
    '{t.nav.services}\n              </button>'
)
content = content.replace(
    'Kontak\n              </button>',
    '{t.nav.contact}\n              </button>'
)

# Replace Legal Links
content = content.replace(
    'KEBIJAKAN PRIVASI\n                </button>',
    '{t.legal.privacy}\n                </button>'
)
content = content.replace(
    'SYARAT & KETENTUAN\n                </button>',
    '{t.legal.terms}\n                </button>'
)

with open('src/components/LayoutWrapper.tsx', 'w') as f:
    f.write(content)
