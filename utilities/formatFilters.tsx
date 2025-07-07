export function buildShopifyFilters(
  selectedFilters: Record<string, string[]>,
  allFilters: any[]
) {
  const filters: any[] = [];

  for (const [filterId, values] of Object.entries(selectedFilters)) {
    if (!values || values.length === 0) continue;

    // Find the filter definition in the available filters to get value labels
    const filterDef = allFilters.find((f: any) => f.id === filterId);
    if (!filterDef) continue;

    // Metafield filter
    if (filterId.startsWith("filter.p.m.custom.")) {
      for (const valueId of values) {
        // Find the value object for this id to get its correct label (case-sensitive)
        const valueObj = filterDef.values.find((v: any) => v.id === valueId);
        if (!valueObj) continue;
        // Now parse key and use valueObj.label (case-sensitive)
        const key = filterId.replace("filter.p.m.custom.", "");
        filters.push({
          productMetafield: {
            namespace: "custom",
            key,
            value: valueObj.label // <-- always case-sensitive label
          }
        });
      }
    }
    // Product Type
    else if (filterId === "filter.p.product_type") {
      for (const valueId of values) {
        const valueObj = filterDef.values.find((v: any) => v.id === valueId);
        if (!valueObj) continue;
        filters.push({ productType: valueObj.label });
      }
    }
    // Vendor
    else if (filterId === "filter.p.vendor") {
      for (const valueId of values) {
        const valueObj = filterDef.values.find((v: any) => v.id === valueId);
        if (!valueObj) continue;
        filters.push({ vendor: valueObj.label });
      }
    }
    // Tag
    else if (filterId === "filter.p.tag") {
      for (const valueId of values) {
        const valueObj = filterDef.values.find((v: any) => v.id === valueId);
        if (!valueObj) continue;
        filters.push({ tag: valueObj.label });
      }
    }
    // TODO: Handle price, availability, other filter types as needed.
  }

  return filters;
}