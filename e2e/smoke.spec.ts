import { expect, test } from '@playwright/test';

test('cover tells the story and preserves the headline distinction', async ({
  page,
}) => {
  await page.goto('');
  await expect(
    page.getByRole('heading', { name: /When Formula 1 Came to Northern Ireland/i }),
  ).toBeVisible();
  await expect(
    page.getByText(/never a championship Grand Prix/i).first(),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Explore the Story' }).click();
  await expect(
    page.getByRole('heading', { level: 1, name: 'The Dundrod Story' }),
  ).toBeVisible();
});

test('navigation reaches every experience', async ({ page }) => {
  await page.goto('');
  for (const [name, heading] of [
    ['The Dundrod Story', 'The Dundrod Story'],
    ['Explore the Circuit', 'Explore the Circuit'],
    ['Six Racing Seasons', 'Six Racing Seasons'],
    ['Drivers & Teams', 'Drivers & Teams'],
    ['The Archive', 'The Archive'],
    ['Dundrod Today', 'Dundrod Today'],
  ] as const) {
    await page
      .getByRole('navigation', { name: 'Experiences' })
      .first()
      .getByRole('link', { name })
      .click();
    await expect(
      page.getByRole('heading', { level: 1, name: heading }),
    ).toBeVisible();
  }
  // Acknowledgements lives in the footer.
  await page
    .getByRole('navigation', { name: /footer/i })
    .getByRole('link', { name: 'Acknowledgements' })
    .click();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Acknowledgements' }),
  ).toBeVisible();
});

test('story chapters render from content with working season links', async ({
  page,
}) => {
  await page.goto('#/story');
  await expect(page.getByText(/The race that stopped/)).toBeVisible();
  await expect(page.getByText(/Forty thousand pounds of road/)).toBeVisible();
  await page.getByRole('link', { name: 'The 1955 season in full' }).click();
  await expect
    .poll(async () => {
      const top = await page.evaluate(
        () => document.getElementById('y1955')?.getBoundingClientRect().top,
      );
      return top !== undefined && top >= 0 && top < 300;
    })
    .toBe(true);
});

test('seasons page keeps 1952 facts straight', async ({ page }) => {
  await page.goto('#/seasons');
  await expect(page.getByText(/Piero Taruffi/).first()).toBeVisible();
  await expect(
    page.getByText(/Cancelled after a weak entry/i).first(),
  ).toBeVisible();
});

test('archive photography loads images and the full-screen viewer works', async ({
  page,
}) => {
  await page.goto('#/archive');
  const img = page.locator('.plate img').first();
  await img.scrollIntoViewIfNeeded();
  await expect
    .poll(
      () =>
        img.evaluate(
          (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
        ),
      { timeout: 10_000 },
    )
    .toBe(true);
  await page.locator('.plate-button').first().click();
  const viewer = page.locator('.photo-viewer');
  await expect(viewer).toBeVisible();
  await expect(viewer.locator('img')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(viewer).toBeHidden();
});

test('archive film section shows an honest unavailable state', async ({
  page,
}) => {
  await page.goto('#/archive?section=film');
  await expect(page.getByRole('tab', { name: 'Film' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.getByText(/No authorised footage yet/)).toBeVisible();
});

test('year roundel-style anchors scroll to the season', async ({ page }) => {
  await page.goto('#/seasons#y1952');
  await expect
    .poll(async () => {
      const top = await page.evaluate(
        () => document.getElementById('y1952')?.getBoundingClientRect().top,
      );
      return top !== undefined && top >= 0 && top < 300;
    })
    .toBe(true);
});

test('document titles change per experience', async ({ page }) => {
  await page.goto('#/archive');
  await expect(page).toHaveTitle(/The Archive · Dundrod/);
  await page.goto('');
  await expect(page).toHaveTitle(/^Dundrod — The Forgotten Racing Years$/);
});

test('mobile menu opens, navigates and closes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('');
  await page.getByRole('button', { name: 'Menu' }).click();
  await page
    .getByRole('dialog')
    .getByRole('link', { name: 'Explore the Circuit' })
    .click();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Explore the Circuit' }),
  ).toBeVisible();
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('old films route redirects into the archive', async ({ page }) => {
  await page.goto('#/films');
  await expect(page.getByText(/No authorised footage yet/)).toBeVisible();
});
