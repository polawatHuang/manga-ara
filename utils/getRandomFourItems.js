const getRandomFourItems = (array) => {
    if (!Array.isArray(array) || array.length === 0) return []; // Handle empty or invalid input
  
    // Shuffle the array using Fisher-Yates algorithm
    const shuffled = [...array].sort(() => Math.random() - 0.5);
  
    // Return the first 4 items (or fewer if array length < 4)
    return shuffled.slice(0, 4);
  }  

export default getRandomFourItems;