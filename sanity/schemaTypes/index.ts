import { category } from "./category";
import { product } from "./product";
import { siteSettings } from "./siteSettings";

/* The schema list for phase two. See sanity/README.md for the wiring steps.
 *
 * Written now and left unused deliberately (§11): after handling fifty real
 * photographs the requirements will be clearer than either of us can guess
 * today, but the shapes are already fixed by lib/content.ts — so this is a
 * swap, not a design exercise.
 */
export const schemaTypes = [category, product, siteSettings];
