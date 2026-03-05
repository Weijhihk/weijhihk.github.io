import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface PhotoData {
  id: string;
  url: string;
  file: File;
  description: string;
  date: string;
}

interface PhotoContextType {
  photos: PhotoData[];
  addPhotos: (files: File[]) => void;
  removePhoto: (id: string) => void;
  updatePhoto: (id: string, data: Partial<PhotoData>) => void;
  clearPhotos: () => void;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export function PhotoProvider({ children }: { children: ReactNode }) {
  const [photos, setPhotos] = useState<PhotoData[]>([]);

  // Cleanup object URLs when component unmounts or photos change
  useEffect(() => {
    return () => {
      photos.forEach((photo) => URL.revokeObjectURL(photo.url));
    };
  }, []); // Only on unmount for now, as revoking on every change might break images if we just re-render

  const addPhotos = (files: File[]) => {
    const newPhotos = files.map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      file,
      description: '',
      date: new Date().toISOString().split('T')[0], // Default to today
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const photoToRemove = prev.find((p) => p.id === id);
      if (photoToRemove) {
        URL.revokeObjectURL(photoToRemove.url);
      }
      return prev.filter((p) => p.id !== id);
    });
  };

  const updatePhoto = (id: string, data: Partial<PhotoData>) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
  };

  const clearPhotos = () => {
    setPhotos((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.url));
      return [];
    });
  };

  return (
    <PhotoContext.Provider
      value={{ photos, addPhotos, removePhoto, updatePhoto, clearPhotos }}
    >
      {children}
    </PhotoContext.Provider>
  );
}

export function usePhotos() {
  const context = useContext(PhotoContext);
  if (context === undefined) {
    throw new Error('usePhotos must be used within a PhotoProvider');
  }
  return context;
}
