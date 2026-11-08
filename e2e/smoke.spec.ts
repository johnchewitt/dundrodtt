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
  await expect(
    page.getByRole('heading', { name: 'The Ards TT' }),
  ).toBeVisible();
  await expect(page.getByText(/not a Dundrod event/)).toBeVisible();
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
  await expect(page.getByText(/No embedded footage yet/)).toBeVisible();
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
  await expect(page).toHaveTitle(/^Dundrod: A Golden Age of Motorsport$/);
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
  await expect(page.getByText(/No embedded footage yet/)).toBeVisible();
});

test('home lobby cards reach every experience', async ({ page }) => {
  await page.goto('');
  const lobby = page.getByRole('region', { name: 'Explore the exhibition' });
  await expect(lobby.getByRole('link')).toHaveCount(6);
  await lobby.getByRole('link', { name: /Six Racing Seasons/ }).click();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Six Racing Seasons' }),
  ).toBeVisible();
});

test('archive tabs follow the ARIA keyboard pattern', async ({ page }) => {
  await page.goto('#/archive');
  await page.getByRole('tab', { name: 'Photography' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Film' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.getByRole('tab', { name: 'Film' })).toBeFocused();
  await expect(page.getByText(/No embedded footage yet/)).toBeVisible();
});

test('viewer shows a position counter', async ({ page }) => {
  await page.goto('#/archive');
  await page.locator('.plate-button').first().click();
  await expect(page.locator('.viewer-count')).toHaveText(/1 of \d+/);
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.viewer-count')).toHaveText(/2 of \d+/);
  await page.keyboard.press('Escape');
});

test('story chapter rail marks the current chapter', async ({ page }) => {
  await page.goto('#/story#ch-end');
  await expect
    .poll(() =>
      page
        .locator('.season-rail a[aria-current="true"]')
        .getAttribute('aria-label'),
    )
    .toMatch(/The last flag/);
});

test('circuit page: catalogue selection opens the location story', async ({
  page,
}) => {
  await page.goto('#/circuit');
  await page.getByRole('button', { name: "Deer's Leap" }).click();
  const panel = page.getByRole('complementary', { name: /Deer's Leap/ });
  await expect(panel).toBeVisible();
  await expect(panel.getByText(/killed Jim Mayers and William Smith/)).toBeVisible();
  await expect(panel.getByText(/never guessed/)).toBeVisible();
  await expect(panel.getByText(/marker is provisional/)).toBeVisible();
  await panel.getByRole('link', { name: '1955' }).click();
  await expect
    .poll(async () => {
      const top = await page.evaluate(
        () => document.getElementById('y1955')?.getBoundingClientRect().top,
      );
      return top !== undefined && top >= 0 && top < 300;
    })
    .toBe(true);
});

test('circuit page: explorer live with provisional landmarks', async ({
  page,
}) => {
  await page.goto('#/circuit');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Explore the Circuit' }),
  ).toBeVisible();
  // The explorer loads, or reports failure honestly; never a dead panel.
  await expect
    .poll(async () =>
      page.evaluate(
        () =>
          !!document.querySelector('.explorer') ||
          !!document.querySelector('.map-fallback') ||
          !!document.querySelector('.loading-panel'),
      ),
    )
    .toBe(true);
  // When the SDK can reach its assets the toolbar renders; in a
  // network-restricted environment the labelled error state shows.
  const explorer = await page
    .waitForSelector('.explorer-toolbar', { timeout: 15000 })
    .catch(() => null);
  if (explorer) {
    await expect(page.getByRole('button', { name: 'Satellite' })).toBeVisible();
    await expect(page.getByRole('button', { name: '3D terrain' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Take a Lap of Dundrod|Lap again/ }),
    ).toBeVisible();
  } else {
    await expect(page.getByText(/could not load/)).toBeVisible();
  }
});

/* ---------- Stage 4: Six Racing Seasons timeline ---------- */

test('season timeline strip shows six stations with honest meeting dots', async ({
  page,
}) => {
  await page.goto('#/seasons');
  const strip = page.locator('.season-timeline');
  await expect(strip).toBeVisible();
  await expect(strip.locator('li')).toHaveCount(6);
  // 12 scheduled meetings, two of which did not run (1952 TT, 1954 UT).
  await expect(strip.locator('.tl-dot')).toHaveCount(12);
  await expect(strip.locator('.tl-dot[data-held]')).toHaveCount(10);
  await expect(strip.getByText('The Final Chapter')).toBeVisible();
});

test('1954 chapter keeps the two result systems distinct', async ({ page }) => {
  await page.goto('#/seasons#y1954');
  const chapter = page.locator('#y1954');
  await expect(
    chapter.getByText('Scratch / championship result', { exact: false }),
  ).toBeVisible();
  await expect(
    chapter.getByText('Handicap result', { exact: false }),
  ).toBeVisible();
  await expect(chapter.getByText(/Laureau/).first()).toBeVisible();
});

test('chapter photo strip opens the viewer scoped to its year', async ({
  page,
}) => {
  await page.goto('#/seasons#y1950');
  const strip = page.locator('#y1950 .photo-strip button');
  await strip.first().scrollIntoViewIfNeeded();
  await strip.first().click();
  const viewer = page.locator('.photo-viewer');
  await expect(viewer).toBeVisible();
  await expect(viewer.locator('.plate-id')).toHaveText(/DU-1950/);
  await page.keyboard.press('Escape');
  await expect(viewer).toBeHidden();
});

test('photograph viewer links to driver profiles', async ({ page }) => {
  await page.goto('#/seasons#y1952');
  const hero = page.locator('#y1952 .chapter-hero');
  await hero.scrollIntoViewIfNeeded();
  await hero.click();
  const viewer = page.locator('.photo-viewer');
  await expect(viewer).toBeVisible();
  const link = viewer.getByRole('link', { name: 'Juan Manuel Fangio' });
  await expect(link).toBeVisible();
  await link.click();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Juan Manuel Fangio' }),
  ).toBeVisible();
  await expect(page.getByText('The Dundrod record')).toBeVisible();
});

test('season chapter chips deep-link a documented circuit place', async ({
  page,
}) => {
  await page.goto('#/seasons#y1955');
  const chip = page.getByRole('link', { name: /Deer's Leap on the circuit/ });
  await chip.scrollIntoViewIfNeeded();
  await chip.click();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Explore the Circuit' }),
  ).toBeVisible();
  await expect(
    page.locator('.location-panel').getByText(/Deer's Leap/).first(),
  ).toBeVisible();
});

/* ---------- Refinement pass: period names, gallery, profiles, films ---------- */

test('archive shows the full 44-photo gallery with captions', async ({ page }) => {
  await page.goto('#/archive');
  await expect(page.locator('.masonry .plate')).toHaveCount(44);
  await expect(
    page.getByRole('heading', { name: 'The full archive, 1951–1955' }),
  ).toBeVisible();
});

test('film tab links out to the BFI film without embedding', async ({ page }) => {
  await page.goto('#/archive?section=film');
  const card = page.locator('.film-card', { hasText: 'Ulster Trophy, Dundrod (1955)' });
  await expect(card).toBeVisible();
  await expect(card.getByRole('link', { name: 'Watch the film' })).toHaveAttribute(
    'href',
    /player\.bfi\.org\.uk/,
  );
  await expect(page.locator('iframe')).toHaveCount(0);
});

test('driver cards carry archive photographs and new profiles', async ({ page }) => {
  await page.goto('#/drivers');
  await expect(page.locator('.driver-photo img').first()).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Bobby Baird' }).first(),
  ).toBeVisible();
  await expect(page.getByText(/Belfast Telegraph/).first()).toBeVisible();
});

test('circuit page shows the period programme map with OSNI credit', async ({ page }) => {
  await page.goto('#/circuit');
  await expect(
    page.getByRole('heading', { name: 'The circuit as the programmes drew it' }),
  ).toBeVisible();
  await expect(page.getByText(/H\.M\. Stationery Office/)).toBeVisible();
});

test('the lap now begins at the start and finish line', async ({ page }) => {
  await page.goto('#/circuit');
  await expect(
    page.getByRole('button', { name: 'Start & Finish and the Pits' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Start & Finish and the Pits' }).click();
  await expect(
    page.locator('.location-panel').getByText(/grandstands/).first(),
  ).toBeVisible();
});

/* ---------- QA pass additions ---------- */

test('season chapter archive links land on a filtered year gallery', async ({
  page,
}) => {
  await page.goto('#/archive?year=1952');
  await expect(
    page.getByRole('heading', { name: /photographs from 1952/ }),
  ).toBeVisible();
  await expect(page.locator('.masonry .plate')).toHaveCount(13);
  // Event filter narrows further; 1952 had no TT, so RAC TT yields the honest empty state.
  await page.getByRole('button', { name: 'RAC TT', exact: true }).click();
  await expect(page.getByText(/honest about its gaps/)).toBeVisible();
});

test('location panel walks the lap in sequence', async ({ page }) => {
  await page.goto('#/circuit?loc=loc-start-finish');
  const panel = page.locator('.location-panel');
  await expect(panel.getByRole('heading', { name: /Start & Finish/ })).toBeVisible();
  await panel.getByRole('button', { name: /Rushyhill/ }).click();
  await expect(panel.getByRole('heading', { name: 'Rushyhill' })).toBeVisible();
  await panel.getByRole('button', { name: /← Start & Finish/ }).click();
  await expect(panel.getByRole('heading', { name: /Start & Finish/ })).toBeVisible();
});

/* ---------- Stage 5: Drivers, Teams & Legendary Cars ---------- */

test('local heroes feature leads with Titterington', async ({ page }) => {
  await page.goto('#/drivers');
  await expect(
    page.getByRole('heading', { name: 'Local Heroes' }),
  ).toBeVisible();
  const lead = page.locator('.hero-feature-lead');
  await expect(lead.getByRole('heading', { name: 'Desmond Titterington' })).toBeVisible();
  await lead.getByRole('link', { name: /Full Dundrod record/ }).click();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Desmond Titterington' }),
  ).toBeVisible();
  await expect(page.getByText(/shared with Mike Hawthorn/i).first()).toBeVisible();
});

test('driver search finds the Belfast newspaperman', async ({ page }) => {
  await page.goto('#/drivers');
  await page.getByLabel('Search the catalogue').fill('Belfast');
  await expect(
    page.locator('#the-drivers').getByRole('heading', { name: 'Bobby Baird' }),
  ).toBeVisible();
  await page.getByLabel('Search the catalogue').fill('zzz');
  await expect(page.getByText(/only holds documented Dundrod competitors/)).toBeVisible();
});

test('driver profile derives the full Dundrod record', async ({ page }) => {
  await page.goto('#/drivers/p-stirling-moss');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Stirling Moss' }),
  ).toBeVisible();
  const record = page.locator('.record-list li');
  await expect(record).toHaveCount(5); // three TT wins + 1952 BRM + 1953 DNS
  await expect(page.locator('.record-win')).toHaveCount(3);
  await expect(page.locator('.photo-strip img').first()).toBeVisible();
});

test('team and car cards stay honest about kind and years', async ({ page }) => {
  await page.goto('#/drivers');
  const mercedes = page.locator('.team-card', { hasText: 'Mercedes-Benz' });
  await expect(mercedes.getByText('Works team · Germany')).toBeVisible();
  await expect(mercedes.getByRole('link', { name: 'Victory, 1955' })).toBeVisible();
  const vandervell = page.locator('.team-card', { hasText: 'Vandervell' });
  await expect(vandervell.getByText('Independent entrant · Great Britain')).toBeVisible();
  const brm = page.locator('.car-card', { hasText: 'BRM V16' });
  await expect(brm.getByText(/supercharged V16/)).toBeVisible();
});

/* ---------- Stage 5 QA pass ---------- */

test('profiles set their own document titles and link shared wins', async ({
  page,
}) => {
  await page.goto('#/drivers/p-stirling-moss');
  await expect(page).toHaveTitle(/Stirling Moss · Dundrod/);
  // 1955 win was shared with John Fitch — the record links him.
  const record = page.locator('.record-list');
  await record.getByRole('link', { name: 'John Fitch' }).click();
  await expect(
    page.getByRole('heading', { level: 1, name: 'John Fitch' }),
  ).toBeVisible();
  await expect(page).toHaveTitle(/John Fitch · Dundrod/);
});

test('search keeps its promise: cars and teams find their drivers', async ({
  page,
}) => {
  await page.goto('#/drivers');
  const input = page.getByLabel('Search the catalogue');
  await input.fill('BRM');
  const results = page.locator('#the-drivers');
  await expect(results.getByRole('heading', { name: 'Juan Manuel Fangio' })).toBeVisible();
  await input.fill('Ecurie Ecosse');
  await expect(results.getByRole('heading', { name: 'Desmond Titterington' })).toBeVisible();
});

test('record car links jump to the machine card', async ({ page }) => {
  await page.goto('#/drivers/p-stirling-moss');
  await page.locator('.record-list').getByRole('link', { name: 'Jaguar XK120' }).click();
  await expect
    .poll(async () => {
      const top = await page.evaluate(
        () => document.getElementById('c-jaguar-xk120')?.getBoundingClientRect().top,
      );
      return top !== undefined && top >= 0 && top < 400;
    })
    .toBe(true);
});

test('profiles surface the people seen in the same frames', async ({ page }) => {
  await page.goto('#/drivers/p-juan-manuel-fangio');
  await expect(page.getByRole('heading', { name: 'In the same frames' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Louis Rosier' })).toBeVisible();
});

/* ---------- Stage 6: the photographic & film archive ---------- */

test('the Lost Photographs of 1950 lead the archive', async ({ page }) => {
  await page.goto('#/archive');
  await expect(
    page.getByRole('heading', { name: 'The Lost Photographs of 1950' }),
  ).toBeVisible();
  await expect(page.locator('.lost-1950 .plate')).toHaveCount(7);
});

test('driver and search filters cut the gallery honestly', async ({ page }) => {
  await page.goto('#/archive');
  await page.getByLabel(/Driver/).selectOption({ label: 'Juan Manuel Fangio' });
  await expect(page.getByRole('heading', { name: /5 photographs of Juan Manuel Fangio/ })).toBeVisible();
  await page.getByLabel(/Search/).fill('BRM');
  await expect(page.locator('.masonry .plate')).toHaveCount(3);
  await page.getByLabel(/Search/).fill('zzz-nothing');
  await expect(page.getByText(/honest about its gaps/)).toBeVisible();
});

test('viewer shows subject, identification label and collection link', async ({ page }) => {
  await page.goto('#/archive?q=DU-1952-05');
  await page.locator('.masonry .plate-button').first().click();
  const viewer = page.locator('.photo-viewer');
  await expect(viewer.getByText(/Identification: probable/)).toBeVisible();
  await viewer.getByRole('link', { name: 'Contributed collection' }).click();
  await expect(
    page.getByRole('heading', { name: 'Behind the Photographs' }),
  ).toBeVisible();
});

test('behind the photographs honours the contributors correctly', async ({ page }) => {
  await page.goto('#/archive?section=behind');
  await expect(page.getByRole('heading', { name: 'Neville Armstrong' })).toBeVisible();
  await expect(page.locator('#panel-behind img').first()).toBeVisible();
  await expect(page.getByText(/second contributor/)).toBeVisible();
  // the hidden contributor never gets a name or placeholder
  const text = await page.locator('#panel-behind').innerText();
  expect(text).not.toMatch(/\[|TBC|placeholder|null/i);
});

test('film collection links out with full provenance', async ({ page }) => {
  await page.goto('#/archive?section=film');
  const cards = page.locator('.film-card');
  await expect(cards).toHaveCount(4);
  const pathe = cards.filter({ hasText: 'Ulster Tourist Trophy (1950)' });
  await expect(pathe.getByText('British Pathé').first()).toBeVisible();
  await expect(pathe.getByRole('link', { name: /Watch at British Pathé/ })).toHaveAttribute(
    'href',
    /britishpathe\.com/,
  );
  const niscreen = cards.filter({ hasText: 'Stirling Moss and the RAC' });
  await niscreen.getByRole('link', { name: 'Stirling Moss' }).click();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Stirling Moss' }),
  ).toBeVisible();
});

test('season chapters carry their films', async ({ page }) => {
  await page.goto('#/seasons#y1950');
  const films1950 = page.locator('#y1950 .chapter-films');
  await expect(films1950.getByRole('link', { name: /Ulster Tourist Trophy \(1950\)/ })).toBeVisible();
  await page.goto('#/seasons#y1955');
  await expect(
    page.locator('#y1955 .chapter-films a'),
  ).toHaveCount(3);
});

test('the portrait never shows its internal handling caption', async ({ page }) => {
  await page.goto('#/archive?section=behind');
  const panel = page.locator('#panel-behind');
  await expect(panel.getByText('DU-ACK-01')).toBeVisible();
  await expect(panel.getByText(/keep it separate/)).toHaveCount(0);
  await expect(panel.getByText(/Excluded from the main gallery/)).toHaveCount(0);
});

test('acknowledgements page never leaks the portrait handling note', async ({
  page,
}) => {
  await page.goto('#/credits');
  await expect(page.getByText('Neville and Beverley Armstrong.')).toBeVisible();
  await expect(page.getByText(/keep it separate/)).toHaveCount(0);
});

/* ---------- Stage 6 QA pass ---------- */

test('photographs are shareable by URL and the viewer syncs it', async ({
  page,
}) => {
  await page.goto('#/archive?photo=DU-1951-08');
  const viewer = page.locator('.photo-viewer');
  await expect(viewer).toBeVisible();
  await expect(viewer.getByText('DU-1951-08')).toBeVisible();
  // museum label: the catalogue title leads the caption
  await expect(viewer.locator('.viewer-title')).toHaveText(/Stirling Moss in a Jaguar C-Type/);
  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(/photo=DU-1951-09/);
  await page.keyboard.press('Escape');
  await expect(viewer).toBeHidden();
  await expect(page).not.toHaveURL(/photo=/);
});

test('clear-all-filters resets the archive in one step', async ({ page }) => {
  await page.goto('#/archive?year=1952&event=ulster-trophy');
  await expect(page.getByRole('heading', { name: /13 photographs from 1952/ })).toBeVisible();
  await page.getByRole('button', { name: 'Clear all filters' }).click();
  await expect(
    page.getByRole('heading', { name: 'The Lost Photographs of 1950' }),
  ).toBeVisible();
});

/* ---------- Stage 7: Discover Dundrod + Dundrod Today ---------- */

test('discover dundrod walks all eight scenes with full controls', async ({
  page,
}) => {
  await page.goto('#/discover');
  await expect(page).toHaveTitle(/Discover Dundrod/);
  await expect(page.getByRole('heading', { name: 'Racing comes back to Ulster' })).toBeVisible();
  await expect(page.locator('.discover-dots button')).toHaveCount(8);
  // controls
  await page.getByRole('button', { name: 'Pause' }).click();
  await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();
  await page.getByRole('button', { name: 'Next →' }).click();
  await expect(page.getByRole('heading', { name: 'Seven miles of country road' })).toBeVisible();
  // jump to the last scene by dot
  await page.getByRole('button', { name: /Scene 8/ }).click();
  await expect(page.getByRole('heading', { name: 'The roads remain' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Next →' })).toBeDisabled();
  await page.getByRole('button', { name: 'Restart' }).click();
  await expect(page.getByRole('heading', { name: 'Racing comes back to Ulster' })).toBeVisible();
  await page.getByRole('link', { name: 'Exit tour' }).click();
  await expect(page.locator('.cover')).toBeVisible();
});

test('tour copy comes from the canonical records', async ({ page }) => {
  await page.goto('#/discover');
  // scene 1 ends with the Ards chapter's own closing paragraph
  await expect(page.getByText(/not a Dundrod event/)).toBeVisible();
});

test('dundrod today opens on satellite with the respect note and changes', async ({
  page,
}) => {
  await page.goto('#/today');
  await expect(page.getByText(/drive gently/)).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'What changed, and when' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Leathemstown Bridge' })).toBeVisible();
  // satellite is this page's signature view when the live map loads
  const satellite = page.getByRole('button', { name: 'Satellite' });
  if (await satellite.isVisible().catch(() => false)) {
    await expect(satellite).toHaveAttribute('aria-pressed', 'true');
  }
  // deep link opens the place panel here too
  await page.goto('#/today?loc=loc-1950s-hairpin');
  await expect(
    page.locator('.location-panel').getByText(/1950s hairpin/).first(),
  ).toBeVisible();
});

test('home leads with the guided tour', async ({ page }) => {
  await page.goto('#/');
  await page.getByRole('link', { name: 'Discover Dundrod' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Discover Dundrod' })).toBeVisible();
});

/* ---------- Stage 7 QA pass ---------- */

test('tour announces its scene count and paces itself visibly', async ({
  page,
}) => {
  await page.goto('#/discover');
  await expect(page.getByText('Scene 1 of 8')).toBeVisible();
  await expect(page.locator('.discover-progress')).toBeVisible();
  await page.getByRole('button', { name: 'Pause' }).click();
  await expect(page.locator('.discover-progress')).toHaveCount(0);
  await page.getByRole('button', { name: 'Next →' }).click();
  await expect(page.getByText('Scene 2 of 8')).toBeVisible();
});

test('map toolbar explains the gold line when the SDK loads', async ({
  page,
}) => {
  await page.goto('#/circuit');
  const note = page.locator('.toolbar-note');
  const appeared = await note.isVisible().catch(() => false);
  if (appeared) {
    await expect(note).toContainText('gold line is the 1950–55 course');
  } else {
    // environment without the ArcGIS CDN: the labelled fallback shows
    await expect(
      page.locator('.map-fallback, .loading-panel').first(),
    ).toBeVisible();
  }
});
