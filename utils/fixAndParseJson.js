export const fixAndParseJson = (inputStr) => {
    // Step 1: Remove the outer quotes from the string (to work with the array part)
    const unquoted = inputStr.slice(1, -1);

    // Step 2: Fix keys by adding double quotes around them
    const fixedKeys = unquoted.replace(/([{,])\s*(\w+)\s*:/g, '$1"$2":');

    console.log("Fixed JSON string:", fixedKeys);  // Debugging line

    // Step 3: Parse the corrected string into JSON
    try {
        return JSON.parse(fixedKeys);
    } catch (err) {
        console.error("Error parsing JSON:", err);
        return null;  // Return null if parsing fails
    }
}