import { create } from 'zustand';

/**
 * Lightweight shared UI state. Facts never live here — only what the
 * visitor currently has selected across experiences.
 */
interface UiState {
  selectedYearId: string | null;
  selectedLocationId: string | null;
  archiveFilters: { year: number | null; event: string | null };
  selectYear: (id: string | null) => void;
  selectLocation: (id: string | null) => void;
  setArchiveFilters: (f: Partial<UiState['archiveFilters']>) => void;
}

export const useUiStore = create<UiState>((set) => ({
  selectedYearId: null,
  selectedLocationId: null,
  archiveFilters: { year: null, event: null },
  selectYear: (id) => set({ selectedYearId: id }),
  selectLocation: (id) => set({ selectedLocationId: id }),
  setArchiveFilters: (f) =>
    set((s) => ({ archiveFilters: { ...s.archiveFilters, ...f } })),
}));
