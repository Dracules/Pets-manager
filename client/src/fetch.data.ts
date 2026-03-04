async function fetchJSON(Url: string): Promise<unknown> {
  const response = await fetch(Url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  const result: unknown = await response.json();
  return result;
}

export default async function fetchAllDogs(): Promise<unknown> {
  return fetchJSON('/animals/dogs');
}
