import type { DragEvent, ReactNode } from 'react';
import { GripVertical } from 'lucide-react';

type SortableGripProps = {
  index?: number;
  disabled?: boolean;
  onDragStart: (e: DragEvent<HTMLDivElement>, id: number) => void;
  onDragEnd: () => void;
  id: number;
};

export function SortableReorderHint({ reordering, disabled }: { reordering?: boolean; disabled?: boolean }) {
  if (disabled) {
    return <span className="text-xs text-gray-400">Clear search to reorder items.</span>;
  }
  return (
    <span className="text-xs text-gray-400">
      Drag the grip handle to set display order.
      {reordering && <span className="text-[#009900] ms-2">Saving order...</span>}
    </span>
  );
}

export function SortableGrip({ index, disabled, onDragStart, onDragEnd, id }: SortableGripProps) {
  return (
    <>
      <div
        draggable={!disabled}
        onDragStart={(e) => onDragStart(e, id)}
        onDragEnd={onDragEnd}
        className={`text-gray-300 hover:text-gray-500 flex-shrink-0 touch-none ${
          disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'
        }`}
        title={disabled ? 'Reordering disabled' : 'Drag to reorder'}
      >
        <GripVertical size={16} />
      </div>
      {index !== undefined && (
        <span className="text-[10px] font-semibold text-gray-400 w-4 text-center flex-shrink-0">{index + 1}</span>
      )}
    </>
  );
}

export function SortableRow({
  id,
  index,
  disabled,
  rowClassName,
  onDragOver,
  onDrop,
  onDragStart,
  onDragEnd,
  className,
  children,
}: {
  id: number;
  index?: number;
  disabled?: boolean;
  rowClassName: (id: number, base?: string) => string;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>, targetId: number) => void;
  onDragStart: (e: DragEvent<HTMLDivElement>, id: number) => void;
  onDragEnd: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, id)}
      className={rowClassName(id, className)}
    >
      <SortableGrip
        id={id}
        index={index}
        disabled={disabled}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
      {children}
    </div>
  );
}
