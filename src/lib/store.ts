import { create } from 'zustand';
import { SortType, SortOrder } from '@/types';

interface SortStore {
  sortType: SortType;
  sortOrder: SortOrder;
  setSortType: (type: SortType) => void;
  setSortOrder: (order: SortOrder) => void;
  toggleSortOrder: () => void;
}

export const useSortStore = create<SortStore>((set, get) => ({
  sortType: 'views', // デフォルトは再生数順
  sortOrder: 'desc', // デフォルトは降順（多い順）

  setSortType: (type: SortType) => {
    set({ sortType: type });
    // ソートタイプが変わったら、適切なデフォルト順序を設定
    if (type === 'date') {
      set({ sortOrder: 'desc' }); // 新しい順
    } else {
      set({ sortOrder: 'desc' }); // 多い順
    }
  },

  setSortOrder: (order: SortOrder) => {
    set({ sortOrder: order });
  },

  toggleSortOrder: () => {
    const currentOrder = get().sortOrder;
    set({ sortOrder: currentOrder === 'asc' ? 'desc' : 'asc' });
  },
}));