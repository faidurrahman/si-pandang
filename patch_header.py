import re

with open('App.tsx', 'r') as f:
    content = f.read()

old_header_block = """      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between w-full">
          <div className="w-full flex justify-between items-center">
            {/* Left Side: Logo & Text */}
            <div className="flex items-center gap-2">"""

new_header_block = """      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-slate-900/80 backdrop-blur-md border-b border-white/10 print:hidden">
        {/* Left Side: Logo & Text */}
        <div className="flex items-center gap-2">"""
        
content = content.replace(old_header_block, new_header_block)

old_close_divs = """              </button>
            </div>
          </div>
        </div>
      </header>"""

new_close_divs = """              </button>
            </div>
      </header>"""

content = content.replace(old_close_divs, new_close_divs)

with open('App.tsx', 'w') as f:
    f.write(content)
