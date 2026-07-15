const fs = require('fs');

function patchFile(file, actionName) {
  let content = fs.readFileSync(file, 'utf-8');
  
  // Replace the POST fetch logic
  const fetchRegex = new RegExp(`const response = await fetch\\(APPS_SCRIPT_URL, \\{[\\s\\S]*?body: JSON\\.stringify\\(\\{[\\s\\S]*?action: '${actionName}'[\\s\\S]*?\\}\\)[\\s\\S]*?\\}\\);[\\s\\S]*?const resultText = await response\\.text\\(\\);[\\s\\S]*?let result = \\{\\};[\\s\\S]*?try \\{ result = JSON\\.parse\\(resultText\\); \\} catch \\(e\\) \\{ result = \\{ status: resultText\\.includes\\("Success"\\) \\? "Success" : "Error" \\}; \\}[\\s\\S]*?if \\(result(?:\\.status === 'Success')?\\) \\{`, 'g');
  
  content = content.replace(fetchRegex, `
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          // The body will be replaced dynamically, but wait, my regex replaced the whole body!
          // I should just replace the fetch options instead.
        })
      });
  `);
  // This is too complex, let's use a simpler replace
}
