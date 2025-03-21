let fetchedConfigDetails: Record<string, any>[];
export function configDataGetter() {
  return fetchedConfigDetails;
}

export function configDataSetter(fetchedData: Record<string, any>[]) {
  fetchedConfigDetails = fetchedData;
}
