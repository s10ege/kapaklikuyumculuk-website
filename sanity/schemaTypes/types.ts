/* A minimal local shape for the schema definitions in this folder.
 *
 * §11 defers Sanity to phase two, so `sanity` is deliberately NOT a dependency
 * yet — adding it now would pull a studio into the bundle for a catalogue that
 * has nothing to edit. These files still typecheck and stay reviewable.
 *
 * When Sanity is installed, wrap each export in `defineType(...)` and delete
 * this file. The object shapes below are already exactly what defineType takes,
 * so that is a mechanical change, not a rewrite.
 */

export type SanityField = {
  name: string;
  title: string;
  type: string;
  description?: string;
  options?: Record<string, unknown>;
  validation?: unknown;
  of?: unknown[];
  fields?: SanityField[];
  initialValue?: unknown;
  readOnly?: boolean;
  /** `text` fields only — height of the editor box. */
  rows?: number;
};

export type SanitySchemaType = {
  name: string;
  title: string;
  type: "document" | "object";
  description?: string;
  fields: SanityField[];
  preview?: Record<string, unknown>;
  orderings?: unknown[];
};
