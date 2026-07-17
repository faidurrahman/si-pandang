import re

with open('App.tsx', 'r') as f:
    content = f.read()

import_statement = "import { DashboardRekapBmd } from './components/DashboardRekapBmd';\n"
content = "import { DashboardRekapBmd } from './components/DashboardRekapBmd';\n" + content

pantau_kgb = """         ) : activeTab === 'pantau-kgb' ? (
          <PantauKGB />
"""
dashboard_bmd = """        ) : activeTab === 'rekap-bmd' ? (
          <DashboardRekapBmd />
"""

content = content.replace(pantau_kgb, pantau_kgb + dashboard_bmd)

with open('App.tsx', 'w') as f:
    f.write(content)
