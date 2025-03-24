let fetchedConfigDetails: Record<string, any>[];
export function configDataGetter() {
  console.log("Get Data: ", fetchedConfigDetails);
  return fetchedConfigDetails;
}

export function configDataSetter(fetchedData: Record<string, any>[]) {
  fetchedConfigDetails = fetchedData;
  console.log("Set Data: ", fetchedConfigDetails);
}
