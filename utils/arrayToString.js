export const arrayToString = (arr) => {
    // Use JSON.stringify to convert array into string, then remove the quotes around the elements
    return `['${arr.join("','")}']`;
}