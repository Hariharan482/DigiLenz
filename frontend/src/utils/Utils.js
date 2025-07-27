export function formatToHumanReadable(isoString) {
  const cleaned = isoString.split(".")[0];
  const date = new Date(cleaned);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleString("en-US", options);
}
