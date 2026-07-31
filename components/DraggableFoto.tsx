import React, { useState, useRef, useEffect } from 'react';

interface FotoData {
  id: string;
  url: string;
  offsetX: number;
  offsetY: number;
}

interface DraggableFotoProps {
  foto: FotoData;
  index: number;
  petugasId: string;
  onRemove: (petugasId: string, index: number) => void;
  onUpdatePosition: (petugasId: string, index: number, posX: number, posY: number) => void;
  onDragStart: (e: React.DragEvent, petugasId: string, index: number) => void;
  onDrop: (e: React.DragEvent, targetPetugasId: string, targetIndex: number) => void;
  onDragOver: (e: React.DragEvent) => void;
}

export const DraggableFoto: React.FC<DraggableFotoProps> = ({
  foto, index, petugasId, onRemove, onUpdatePosition, onDragStart, onDrop, onDragOver
}) => {
  const [isPanning, setIsPanning] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentOffset, setCurrentOffset] = useState({ x: foto.offsetX || 50, y: foto.offsetY || 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentOffset({ x: foto.offsetX || 50, y: foto.offsetY || 50 });
  }, [foto.offsetX, foto.offsetY]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPanning(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanning || !containerRef.current) return;
      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;
      
      // Calculate new percentage (moving mouse right decreases percentage to shift image right)
      let newX = currentOffset.x - (dx / width) * 100;
      let newY = currentOffset.y - (dy / height) * 100;
      
      newX = Math.max(0, Math.min(100, newX));
      newY = Math.max(0, Math.min(100, newY));
      
      setCurrentOffset({ x: newX, y: newY });
      setStartPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      if (isPanning) {
        setIsPanning(false);
        onUpdatePosition(petugasId, index, currentOffset.x, currentOffset.y);
      }
    };

    if (isPanning) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPanning, startPos, currentOffset, petugasId, index, onUpdatePosition]);

  return (
    <div 
      className="relative aspect-[4/3] rounded-lg overflow-hidden border border-slate-300 group"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, petugasId, index)}
    >
      <div 
        ref={containerRef}
        className="absolute inset-0 w-full h-full cursor-move"
        onMouseDown={handleMouseDown}
        style={{
          backgroundImage: `url("${foto.url}")`,
          backgroundSize: 'cover',
          backgroundPosition: `${currentOffset.x}% ${currentOffset.y}%`,
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Drag handle for sorting */}
      <div 
        className="absolute top-2 left-2 bg-white text-slate-700 rounded p-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab z-10 shadow-sm border border-slate-200"
        draggable
        onDragStart={(e) => onDragStart(e, petugasId, index)}
        title="Klik dan tahan untuk memindahkan urutan"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9h8M8 15h8"></path></svg>
      </div>

      <button 
        onClick={() => onRemove(petugasId, index)}
        className="absolute top-2 right-2 bg-red-500 text-white rounded p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
        title="Hapus foto"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
      
      {isPanning && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full pointer-events-none">
          Menggeser posisi...
        </div>
      )}
    </div>
  );
};
