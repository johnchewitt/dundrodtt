import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PhotoPlate from './PhotoPlate';
import Credits from '../pages/Credits';
import { photoById, photos } from '../model/content';

describe('PhotoPlate', () => {
  it('renders the catalogue caption and alt text, never the review note', () => {
    const photo = photoById.get('DU-1950-01')!; // has a review note
    expect(photo.reviewNote).toBeTruthy();
    render(<PhotoPlate photo={photo} />);
    expect(screen.getByRole('img')).toHaveAccessibleName(photo.altText!);
    expect(screen.getByText(photo.caption!, { exact: false })).toBeVisible();
    expect(
      screen.queryByText(photo.reviewNote!, { exact: false }),
    ).toBeNull();
  });
});

describe('Credits page', () => {
  it('shows the Armstrong collection credit', () => {
    render(
      <MemoryRouter>
        <Credits />
      </MemoryRouter>,
    );
    expect(
      screen.getByText(/Neville Armstrong kindly contributed/i),
    ).toBeVisible();
  });

  it('never renders the hidden contributor acknowledgement', () => {
    render(
      <MemoryRouter>
        <Credits />
      </MemoryRouter>,
    );
    expect(screen.queryByText(/second contributor/i)).toBeNull();
  });

  it('never renders any review note anywhere on the page', () => {
    const { container } = render(
      <MemoryRouter>
        <Credits />
      </MemoryRouter>,
    );
    const text = container.textContent ?? '';
    for (const p of photos) {
      if (p.reviewNote) expect(text).not.toContain(p.reviewNote);
    }
  });
});
