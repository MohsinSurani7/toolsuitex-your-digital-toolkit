import { useState, useCallback, ReactNode } from "react";
import { Upload } from "lucide-react";

interface DragDropZoneProps {
  onFileDrop: (file: File) => void;
  accept?: string;
  children?: ReactNode;
  className?: string;
  compact?: boolean;
}

export function DragDropZone({ onFileDrop, accept = "image/*", children, className = "", compact = false }: DragDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith("image/")) {
          onFileDrop(file);
        }
      }
    },
    [onFileDrop]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        onFileDrop(e.target.files[0]);
      }
    },
    [onFileDrop]
  );

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-lg transition-all cursor-pointer ${
        isDragging
          ? "border-primary bg-primary/10 scale-[1.02]"
          : "border-border hover:border-primary/50"
      } ${compact ? "p-3" : "p-6"} ${className}`}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      {children || (
        <div className={`text-center ${compact ? "" : "py-4"}`}>
          <Upload className={`mx-auto mb-2 text-muted-foreground ${compact ? "w-4 h-4" : "w-8 h-8"}`} />
          <p className={`text-muted-foreground ${compact ? "text-xs" : "text-sm"}`}>
            {isDragging ? "Drop image here!" : "Drag & drop or click to upload"}
          </p>
        </div>
      )}
    </div>
  );
}
