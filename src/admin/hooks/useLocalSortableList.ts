import { useState, useCallback, type DragEvent } from 'react';

type UseLocalSortableListOptions = {
  onReorder: (fromIndex: number, toIndex: number) => void;
  disabled?: boolean;
};

export function useLocalSortableList({ onReorder, disabled = false }: UseLocalSortableListOptions) {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((e: DragEvent<HTMLDivElement>, index: number) => {
    if (disabled) return;
    setDraggingIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  }, [disabled]);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, [disabled]);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>, targetIndex: number) => {
    if (disabled) return;
    e.preventDefault();
    const sourceIndex = draggingIndex ?? Number(e.dataTransfer.getData('text/plain'));
    setDraggingIndex(null);
    if (Number.isNaN(sourceIndex) || sourceIndex === targetIndex) return;
    onReorder(sourceIndex, targetIndex);
  }, [disabled, draggingIndex, onReorder]);

  const rowClassName = useCallback(
    (index: number, baseClassName = '') =>
      [baseClassName, draggingIndex === index ? 'opacity-50 border-green-400' : ''].filter(Boolean).join(' '),
    [draggingIndex],
  );

  return {
    draggingIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    clearDragging: () => setDraggingIndex(null),
    rowClassName,
  };
}
