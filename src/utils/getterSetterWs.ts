var globalWsData: Record<string, string> | null = null;

export function setterWsData(data: Record<string, string>) {
  globalWsData = data;
}

export function getterWsData() {
  return globalWsData;
}
