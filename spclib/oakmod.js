/************************************ 
* Oakmod - Modular.
* Oak + JS Uber Preformance Library
* By SpcFORK / SpectCOW 'Cow'
************************************/

var prettyPrintJSON = (obj) => {
  console.log(JSON.stringify(obj, null, 2));
  return JSON.stringify(obj, null, 2);
}

function extractTexts(text) {
  const regex = /(?:\/\/\*[\*]+\*\/\n)+?([^*]+?)(?:\n\/\/\*[\*]+\*\/)+?/g;
  const piq = /([-]+)+?\n([^]*)+?\n([-]+)+?/g;
  const modak = /(-=)+-\n((?!\1\3)[^=]+)+?(-=)+?-/g;
  const indent = /^(\s+)/gm;

  let __m = []

  const indentdashObjBuilder = (txt) => {
    const obj = {};

    const lines = txt.split('\n');

    let lastgreatest = 0;
    let last;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes("'") && line.includes("-")) {
        let allowCross = true;
        
        var [key, value] = line.split("'").map(s => s.trim());

        key = key.replace(/[ -]+/g, "").trim();

        // Get Indent
        let lem = line.match(indent) || '';
        
        if (value === "true" || value === "false") {
          obj[key] = value === "true";
        } else if (value === "{") {
          obj[key] = indentdashObjBuilder(lines.slice(i + 1).join('\n').split('}')[0]);
        } else if (value === "[") {
          obj[key] = indentdashObjBuilder(lines.slice(i + 1).join('\n').split(']')[0]);
        } else if (value === "{}") {
          obj[key] = {};
        } else if (value === "\/?\/") {
          allowCross = false;

          if (obj[key]) {
            obj[last] = obj[key];
          } else {
            obj[last] = key;
          }
          
        } else if (value === "_") {

        } else {
          obj[key] = value;
        }

        if (allowCross) {
          last = key;
        }
        
        // Set Indent
        if (lastgreatest < lem.length) {
          lastgreatest = lem.length;
        }
      }

      
    }

    console.log(obj);
    
    return obj;
  };
  
  const matches = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1]);
  }

  let meta = {
    
  }
  
  rif: while ((match = piq.exec(text)) !== null) {
    // matches.push(match[1]);

    if (!match[2]) break rif;
    
    meta = {
      ...indentdashObjBuilder(match[2])
    }
  }
  
  while ((match = modak.exec(text)) !== null) {
    match[2] = indentdashObjBuilder(match[2]);

    __m.push(match[2]);
  }

  return {
    matches,
    __m,
    meta
  };
}

// console.log(extractTexts(`
// //***/
// Hello World
// ---
// - wow ' {}
// - sick ' {}
// - wow ' _
// - sick ' /?/
// ---
// //***/
// `))