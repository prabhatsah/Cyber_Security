var previousScannedResults: any;

export function setter(OGdata: any) {
  previousScannedResults = OGdata;
}

export function getter() {
  const val = previousScannedResults ? previousScannedResults : null;
  return val;
}
