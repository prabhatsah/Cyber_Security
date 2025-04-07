export let previousScannedResults: any;
let vulnerabilities: Record<string, any> | null = null;

export function setter(OGdata: any) {
  previousScannedResults = OGdata;
}

export function getter() {
  const val = previousScannedResults ? previousScannedResults : null;
  return val;
}

export function VulnerabilitiesSetter(imgVul: any) {
  vulnerabilities = imgVul;
}

export function Vulnerabilitiesgetter() {
  const val = vulnerabilities ? vulnerabilities : null;
  return val;
}

export function fetchDetailsOfParticularImage(imageName: string) {
  if (previousScannedResults?.data[1]) {
    const images = previousScannedResults?.data[1].data;
    console.log(images);
    return images[imageName];
  }
  return null;
}

export function fetchDetailsOfParticularFile(fileName: string) {
  if (previousScannedResults?.data[0]) {
    const images = previousScannedResults?.data[0].data;
    console.log(images);
    return images[fileName];
  }
  return null;
}
