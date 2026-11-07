import { expect, test } from '@playwright/test';

test('home tells the story and preserves the headline distinction', async ({
  page,
}) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: /When Formula 1 Came to Northern Ireland/i }),
  ).toBeVisible();
  await expect(
    page.getByText(/never a championship Grand Prix/i).first(),
  ).toBeVisible();
});

test('navigation reaches every experience by keyboard-visible links', async ({
  page,
}) => {
  await page.goto('/');
  for (const [name, heading] of [
    ['Six Seasons', 'Six Racing Seasons'],
    ['The Circuit', 'Explore the Circuit'],
    ['Photo Archive', 'The Photographic Archive'],
    ['Drivers & Teams', 'Drivers & Teams'],
    ['Film Archive', 'Film Archive'],
    ['Dundrod Today', 'Dundrod Today'],
    ['Acknowledgements', 'Acknowledgements'],
  ] as const) {
    await page.getByRole('navigation').first().getByRole('link', { name }).click();
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
  }
});

test('seasons page keeps 1952 facts straight', async ({ page }) => {
  await page.goto('#/seasons');
  await expect(page.getByText(/Piero Taruffi/).first()).toBeVisible();
  await expect(
    page.getByText(/Cancelled after a weak entry/i).first(),
  ).toBeVisible();
});

test('archive photographs load real images', async ({ page }) => {
  await page.goto('#/archive');
  const img = page.locator('.plate img').first();
  await img.scrollIntoViewIfNeeded();
  await expect(img).toBeVisible();
  await expect
    .poll(
      () =>
        img.evaluate(
          (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
        ),
      { timeout: 10_000 },
    )
    .toBe(true);
});
