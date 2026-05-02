// Address gate — decides whether the JSON-LD `address` block may be emitted.
//
// The visible UI is allowed to show placeholder strings until launch, but the
// JSON-LD address block must NEVER include placeholder data — emitting a fake
// address risks a Google penalty and a Google Business Profile suspension.
//
// `PLACEHOLDER_VALUES` MUST stay aligned with the defaults in `.env.example`.

export const PLACEHOLDER_VALUES = {
  street: "123 Placeholder St",
  suburb: "Melbourne",
  postcode: "3000",
  region: "VIC",
  abn: "00 000 000 000",
} as const;

export interface AddressFields {
  street: string;
  suburb: string;
  postcode: string;
  region: string;
}

// Returns true ONLY when EVERY field is a real (non-placeholder) value.
// Any single placeholder field returns false (the address must be fully real
// to be schema-eligible — partial-real is treated as not-real).
export function shouldEmitAddress(values: AddressFields): boolean {
  if (!values.street || !values.suburb || !values.postcode || !values.region) {
    return false;
  }
  if (values.street === PLACEHOLDER_VALUES.street) return false;
  if (values.suburb === PLACEHOLDER_VALUES.suburb) return false;
  if (values.postcode === PLACEHOLDER_VALUES.postcode) return false;
  if (values.region === PLACEHOLDER_VALUES.region) return false;
  return true;
}

export function isPlaceholderAbn(abn: string): boolean {
  return !abn || abn === PLACEHOLDER_VALUES.abn;
}
