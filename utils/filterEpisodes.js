export function filterEpisodes(episodes, input) {
  if (!input) return episodes; // Return all episodes if no input

  // Check if input is a range (e.g., "1-12")
  const rangeMatch = input.match(/^(\d+)-(\d+)$/);
  if (rangeMatch) {
    const [_, start, end] = rangeMatch.map(Number);
    return episodes.filter((ep) => ep.episode >= start && ep.episode <= end);
  }

  // Otherwise, return exact match
  return episodes.filter((ep) => ep.episode.includes(input));
}
