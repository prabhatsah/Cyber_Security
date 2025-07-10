// import { entries, parentEntries } from "./your-json";
type DropdownNode = {
  id: string;
  title: string;
  description: string;
  index: string;
  children?: DropdownNode[];
};
export function convertToDropdownNodes(entriesMap: Record<string, any>, parentEntries: any[]): DropdownNode[] {
  const map: Record<string, DropdownNode> = {};

  // Create base nodes
  Object.values(entriesMap).forEach((entry) => {
    map[entry.id] = {
      id: entry.id,
      index: entry.index,
      title: entry.title,
      description: entry.description,
      children: [],
    };
  });

  // Build tree
  parentEntries.forEach((entry) => {
    const node = map[entry.id];
    entry.childrenArray?.forEach((childId: string) => {
      node.children?.push(map[childId]);
    });
  });

  // Return top-level (no parentId)
  return parentEntries.filter(e => !e.parentId).map(e => map[e.id]);
}
