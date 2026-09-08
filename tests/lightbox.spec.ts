import { test, expect } from "@playwright/test";

/* Gate for iteration 8 of plan.md.
 *
 * Driven against /dev/grid because the catalogue is empty at launch. The
 * lightbox still has to be right for phase two, and keyboard behaviour is the
 * part that silently rots — it looks fine in a screenshot either way.
 */

test.beforeEach(async ({ page }) => {
  await page.goto("/dev/grid");
});

const firstCard = "button:has-text('22 Ayar Burma Bilezik')";

test("opens from a card", async ({ page }) => {
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeHidden();

  await page.locator(firstCard).first().click();

  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("heading", { name: "22 Ayar Burma Bilezik" }),
  ).toBeVisible();
});

test("arrow keys step through the category and wrap", async ({ page }) => {
  await page.locator(firstCard).first().click();
  const dialog = page.getByRole("dialog");

  await expect(dialog.getByText("1 / 6")).toBeVisible();

  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByText("2 / 6")).toBeVisible();
  await expect(
    dialog.getByRole("heading", { name: "Beyaz Altın Yüzük" }),
  ).toBeVisible();

  // Wrapping backwards from the first item must not dead-end.
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await expect(dialog.getByText("6 / 6")).toBeVisible();
});

test("closes on Escape", async ({ page }) => {
  await page.locator(firstCard).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("returns focus to the card that opened it", async ({ page }) => {
  const trigger = page.locator(firstCard).first();
  await trigger.click();
  await page.keyboard.press("Escape");

  await expect(page.getByRole("dialog")).toBeHidden();

  const focusedText = await page.evaluate(
    () => document.activeElement?.textContent ?? "",
  );
  expect(focusedText).toContain("22 Ayar Burma Bilezik");
});

test("traps focus while open", async ({ page }) => {
  await page.locator(firstCard).first().click();

  /* Tab all the way round and assert no interactive element BEHIND the dialog
   * ever takes focus. A hand-rolled trap is the usual source of this bug;
   * <dialog>.showModal() gives it to us, and this proves we got it.
   *
   * At the cycle boundary Chrome parks focus on document.body for one step
   * before wrapping back into the dialog. That is native behaviour and not an
   * escape — body is not interactive and nothing behind is reachable — so the
   * assertion targets reachable controls rather than raw containment. */
  const seen: string[] = [];

  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");

    const state = await page.evaluate(() => {
      const dialog = document.querySelector("dialog[open]");
      const el = document.activeElement;
      if (!dialog || !el) return { escaped: true, label: "no dialog" };

      const interactive = el.matches("a, button, input, select, textarea");
      const outside = !dialog.contains(el);

      return {
        escaped: interactive && outside,
        label: `${el.tagName}:${(el.textContent ?? "").trim().slice(0, 20)}`,
      };
    });

    seen.push(state.label);
    expect(
      state.escaped,
      `focus reached a control behind the dialog after ${i + 1} tabs: ${seen.join(" → ")}`,
    ).toBe(false);
  }
});

test("the page behind is inert while open", async ({ page }) => {
  await page.locator(firstCard).first().click();

  /* showModal() — not show() — is what makes the rest of the document inert.
   * Getting that wrong leaves a modal a keyboard user can tab straight out of. */
  const headerLinkFocusable = await page.evaluate(() => {
    const link = document.querySelector<HTMLElement>("header a");
    if (!link) return "no header link";
    link.focus();
    return document.activeElement === link ? "focusable" : "inert";
  });

  expect(headerLinkFocusable).toBe("inert");
});

test("the backdrop closes it", async ({ page }) => {
  await page.locator(firstCard).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();

  // Click well outside the panel, which lands on the dialog element itself.
  await page.mouse.click(5, 5);
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("states why no price is shown", async ({ page }) => {
  await page.locator(firstCard).first().click();

  /* Prices are never published (hard rule 7) — they track the daily gold rate.
   * Saying so where a price would be is more reassuring than a blank, and it
   * is the single most common question the shop is asked. */
  await expect(
    page.getByRole("dialog").getByText(/günün altın kuruna göre/),
  ).toBeVisible();

  // ...and it says what to do about it, on whichever channel is live.
  await expect(
    page.getByRole("dialog").getByText(/sorun/),
  ).toBeVisible();
});

test("carries a CTA that is never a dead wa.me link while pending", async ({
  page,
}) => {
  await page.locator(firstCard).first().click();
  const dialog = page.getByRole("dialog");

  await expect(dialog.getByRole("link", { name: "Bizi Arayın" })).toBeVisible();
  expect(await dialog.locator('a[href*="wa.me"]').count()).toBe(0);
});
