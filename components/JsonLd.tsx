/* Renders a JSON-LD block.
 *
 * `<` is escaped because a literal `</script>` inside the JSON — which a
 * product name could contain once real data arrives — would close the tag
 * early and break the page. Cheap insurance on data we do not control.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
