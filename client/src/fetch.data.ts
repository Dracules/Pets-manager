async function fetchJSON(Url: string) {
  const response = await fetch(Url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  const result = await response.json();
  return result;
}

export default async function fetchAllDogs() {
  return fetchJSON('/animals/dogs');
}
