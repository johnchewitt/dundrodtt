import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility scan of every experience. Serious and critical axe
 * violations fail the build; the third-party ArcGIS map canvas is
 * excluded (its internals are Esri's), while everything around it is
 * scanned.
 */
const routes = [
  ['home', '#/'],
  ['discover', '#/discover'],
  ['story', '#/story'],
  ['circuit', '#/circuit'],
  ['seasons', '#/seasons'],
  ['drivers', '#/drivers'],
  ['profile', '#/drivers/p-stirling-moss'],
  ['archive', '#/archive'],
  ['film', '#/archive?section=film'],
  ['behind', '#/archive?section=behind'],
  ['today', '#/today'],
  ['credits', '#/credits'],
] as const;

for (const [name, route] of routes) {
  test(`axe: ${name} has no serious or critical violations`, async ({ page }) => {
    await page.goto(route);
    await page.waitForTimeout(route.includes('circuit') || route.includes('today') ? 6000 : 900);
    const results = await new AxeBuilder({ page })
      .exclude('.explorer-map')
      .analyze();
    const bad = results.violations.filter((v) =>
      ['serious', 'critical'].includes(v.impact ?? ''),
    );
    expect(
      bad.map((v) => `${v.id}: ${v.nodes.length}x — ${v.help}`),
    ).toEqual([]);
  });
}
