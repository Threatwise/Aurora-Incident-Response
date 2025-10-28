/**
 *
 * Opens a web url in an external browser window rather than in the electron app.
 * @param {string} url - url to open in external browser windows
 */
const browser_open = function(url){
    const { shell } = require('electron')
    shell.openExternal(url)
}


/**
 *
 * Return array of string values, or NULL if CSV string not well formed.
 * @param {string} text - csv line
 */
function CSVtoArray(text) {
    // Simplified CSV parser to avoid regex complexity issues
    // Handles basic quoted fields and commas
    const result = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = '';

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (!inQuotes && (char === '"' || char === "'")) {
            // Start of quoted field
            inQuotes = true;
            quoteChar = char;
        } else if (inQuotes && char === quoteChar) {
            if (nextChar === quoteChar) {
                // Escaped quote
                current += char;
                i++; // Skip next quote
            } else {
                // End of quoted field
                inQuotes = false;
                quoteChar = '';
            }
        } else if (!inQuotes && char === ',') {
            // Field separator
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    // Add the last field
    result.push(current.trim());

    return result;
}

function CSVtoArrayEasy(text){

    return text.split(",")

}


