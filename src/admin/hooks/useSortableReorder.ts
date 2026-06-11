import { useState, useCallback, type DragEvent } from 'react';
import { api } from '../../lib/api';

type SortableItem = { id: number };

type UseSortableReorderOptions<T extends SortableItem> = {
  items: T[];
  setItems: (items: T[]) => void;
  resource: string;
  section?: string;
  onError?: () => void;
  disabled?: boolean;
};

export function useSortableReorder<T extends SortableItem>({
  items,
  setItems,
  resource,
  section,
  onError,
  disabled = false,
}: UseSortableReorderOptions<T>) {
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);

  const handleDragStart = useCallback((e: DragEvent<HTMLDivElement>, id: number) => {
    if (disabled) return;
    setDraggingId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(id));
  }, [disabled]);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, [disabled]);

  const handleDrop = useCallback(async (e: DragEvent<HTMLDivElement>, targetId: number) => {
    if (disabled) return;
    e.preventDefault();
    const sourceId = draggingId ?? Number(e.dataTransfer.getData('text/plain'));
    setDraggingId(null);
    if (!sourceId || sourceId === targetId) return;

    const fromIndex = items.findIndex((item) => item.id === sourceId);
    const toIndex = items.findIndex((item) => item.id === targetId);
    if (fromIndex < 0 || toIndex < 0) return;

    const reordered = [...items];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);

    setItems(reordered);
    setReordering(true);
    try {
      const body: Record<string, unknown> = {
        resource,
        ids: reordered.map((item) => item.id),
      };
      if (section) body.section = section;
      await api.put('/reorder', body);
    } catch (err) {
      console.error('Failed to reorder:', err);
      onError?.();
    } finally {
      setReordering(false);
    }
  }, [disabled, draggingId, items, onError, resource, section, setItems]);

  const rowClassName = useCallback(
    (id: number, baseClassName = '') =>
      [baseClassName, draggingId === id ? 'opacity-50 border-green-400' : ''].filter(Boolean).join(' '),
    [draggingId],
  );

  return {
    reordering,
    draggingId,
    handleDragStart,
    handleDragOver,
    handleDrop,
    clearDragging: () => setDraggingId(null),
    rowClassName,
  };
}
