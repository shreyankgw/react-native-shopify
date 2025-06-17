type SpecificationRow =
  | { type: 'title'; title: string }
  | { type: 'spec'; key: string; value: string };

export default function parseSpecificationString(specString: string): SpecificationRow[] {
  return specString
    .split('\n')
    .map(line => line.trim())
    .filter(line => !!line)
    .map(line => {
      // Split only on the first colon or tab (support both delimiters)
      const match = line.match(/^([^:]+):(.*)$/);
      if (!match) return null;
      const key = match[1].trim();
      const value = match[2].trim();
      if (!value) {
        // Title or section header
        return { type: 'title', title: key };
      }
      // Regular spec row
      return { type: 'spec', key, value };
    })
    .filter((row): row is SpecificationRow => !!row);
}
