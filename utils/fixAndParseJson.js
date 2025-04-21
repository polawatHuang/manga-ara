export const fixAndParseJson = (inputStr) => {
    // Step 1: Remove the outer double quotes
    const unquoted = inputStr.slice(1, -1);

    // Step 2: Add quotes around keys using RegEx
    const quotedKeys = unquoted.replace(/([{,])\s*(\w+)\s*:/g, '$1"$2":');

    // Step 3: Add quotes around date value (optional, for safety)
    const quotedDates = quotedKeys.replace(
        /"created_date":\s*([0-9\-:\s]+)/g,
        (_, date) => `"created_date": "${date.trim()}"`
    );

    // Step 4: Parse as JSON
    return JSON.parse(quotedDates);
}