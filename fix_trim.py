import sys

with open("GoogleAppsScript.gs", "r") as f:
    content = f.read()

old_loop = """    // Update kolom yang cocok dengan header
    for (let c = 0; c < headers.length; c++) {
      let key = headers[c];
      if (data[key] !== undefined && key !== 'id' && key !== 'action' && !key.includes('Base64') && !key.includes('Name')) {
        sheet.getRange(rowIndex, c + 1).setValue(data[key]);
      }
    }"""

new_loop = """    // Update kolom yang cocok dengan header
    for (let c = 0; c < headers.length; c++) {
      let key = headers[c] ? String(headers[c]).trim() : '';
      if (key && data[key] !== undefined && key !== 'id' && key !== 'action' && !key.includes('Base64') && !key.includes('Name')) {
        sheet.getRange(rowIndex, c + 1).setValue(data[key]);
      }
    }"""
    
content = content.replace(old_loop, new_loop)

with open("GoogleAppsScript.gs", "w") as f:
    f.write(content)
