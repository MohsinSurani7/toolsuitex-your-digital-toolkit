import { useState, useRef } from "react";
import { Camera, Trash2, RotateCw, ZoomIn, ZoomOut, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface PhotoSettings {
  src: string;
  zoom: number;
  rotation: number;
  shape: "circle" | "square" | "rounded";
  alignment: "left" | "center" | "right";
}

interface ProfilePhotoUploadProps {
  photoSettings: PhotoSettings;
  onPhotoChange: (settings: PhotoSettings) => void;
  label?: string;
}

export const defaultPhotoSettings: PhotoSettings = {
  src: "",
  zoom: 100,
  rotation: 0,
  shape: "circle",
  alignment: "center",
};

export function ProfilePhotoUpload({ photoSettings, onPhotoChange, label = "Profile Photo" }: ProfilePhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onPhotoChange({
          ...photoSettings,
          src: event.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRotate = () => {
    onPhotoChange({
      ...photoSettings,
      rotation: (photoSettings.rotation + 90) % 360,
    });
  };

  const handleZoomChange = (value: number[]) => {
    onPhotoChange({
      ...photoSettings,
      zoom: value[0],
    });
  };

  const handleRemove = () => {
    onPhotoChange(defaultPhotoSettings);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleShapeChange = (shape: "circle" | "square" | "rounded") => {
    onPhotoChange({
      ...photoSettings,
      shape,
    });
  };

  const handleAlignmentChange = (alignment: "left" | "center" | "right") => {
    onPhotoChange({
      ...photoSettings,
      alignment,
    });
  };

  const getShapeClass = () => {
    switch (photoSettings.shape) {
      case "circle":
        return "rounded-full";
      case "square":
        return "rounded-none";
      case "rounded":
        return "rounded-lg";
      default:
        return "rounded-full";
    }
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      <div className={`flex ${photoSettings.alignment === "left" ? "justify-start" : photoSettings.alignment === "right" ? "justify-end" : "justify-center"}`}>
        <div className={`relative w-28 h-28 bg-muted ${getShapeClass()} overflow-hidden flex items-center justify-center border-2 border-dashed border-border`}>
          {photoSettings.src ? (
            <img
              src={photoSettings.src}
              alt="Profile"
              className="w-full h-full object-cover"
              style={{
                transform: `scale(${photoSettings.zoom / 100}) rotate(${photoSettings.rotation}deg)`,
              }}
            />
          ) : (
            <div
              className="flex flex-col items-center justify-center cursor-pointer w-full h-full text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="w-8 h-8 mb-1" />
              <span className="text-xs">Add Photo</span>
            </div>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {photoSettings.src && (
        <div className="space-y-3">
          {/* Zoom Control */}
          <div className="flex items-center gap-3">
            <ZoomOut className="w-4 h-4 text-muted-foreground" />
            <Slider
              value={[photoSettings.zoom]}
              onValueChange={handleZoomChange}
              min={50}
              max={200}
              step={5}
              className="flex-1"
            />
            <ZoomIn className="w-4 h-4 text-muted-foreground" />
          </div>

          {/* Shape Selection */}
          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground w-16">Shape:</Label>
            <Select value={photoSettings.shape} onValueChange={(v) => handleShapeChange(v as "circle" | "square" | "rounded")}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="circle">Circle</SelectItem>
                <SelectItem value="rounded">Rounded</SelectItem>
                <SelectItem value="square">Square</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground w-16">Align:</Label>
            <div className="flex gap-1">
              <Button
                variant={photoSettings.alignment === "left" ? "default" : "outline"}
                size="sm"
                onClick={() => handleAlignmentChange("left")}
              >
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button
                variant={photoSettings.alignment === "center" ? "default" : "outline"}
                size="sm"
                onClick={() => handleAlignmentChange("center")}
              >
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button
                variant={photoSettings.alignment === "right" ? "default" : "outline"}
                size="sm"
                onClick={() => handleAlignmentChange("right")}
              >
                <AlignRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRotate} className="flex-1">
              <RotateCw className="w-4 h-4 mr-1" /> Rotate
            </Button>
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="flex-1">
              <Camera className="w-4 h-4 mr-1" /> Change
            </Button>
            <Button variant="destructive" size="sm" onClick={handleRemove}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {!photoSettings.src && (
        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="w-full">
          <Camera className="w-4 h-4 mr-2" /> Upload Photo
        </Button>
      )}
    </div>
  );
}
