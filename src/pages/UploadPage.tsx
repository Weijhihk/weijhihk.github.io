import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, ArrowRight, Edit2 } from 'lucide-react';
import { usePhotos, PhotoData } from '../context/PhotoContext';
import EditPhotoModal from '../components/EditPhotoModal';

export default function UploadPage() {
  const { photos, addPhotos, removePhoto, clearPhotos, updatePhoto } = usePhotos();
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<PhotoData | null>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if we are really leaving the dropzone or just entering a child element
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const imageFiles = Array.from(e.dataTransfer.files).filter((file: File) =>
        file.type.startsWith('image/')
      );
      if (imageFiles.length > 0) {
        addPhotos(imageFiles);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const imageFiles = Array.from(e.target.files).filter((file: File) =>
        file.type.startsWith('image/')
      );
      if (imageFiles.length > 0) {
        addPhotos(imageFiles);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">施工照片報告產生器</h1>
          <p className="text-gray-600">拖曳照片至此，自動生成標準施工報告格式</p>
        </header>

        {/* Dropzone */}
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:border-gray-400'}
          `}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          <input
            type="file"
            id="fileInput"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-blue-100 rounded-full">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                點擊或拖曳照片至此上傳
              </p>
              <p className="text-sm text-gray-500 mt-1">支援 JPG, PNG 格式</p>
            </div>
          </div>
        </div>

        {/* Photo Grid */}
        {photos.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                已上傳照片 ({photos.length})
              </h2>
              <div className="flex space-x-3">
                <button
                  onClick={clearPhotos}
                  className="px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                  清空全部
                </button>
                <button
                  onClick={() => navigate('/report')}
                  className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                  產生報告
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  onClick={() => setEditingPhoto(photo)}
                  className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="aspect-[4/3] bg-gray-100 relative">
                    <img
                      src={photo.url}
                      alt="Upload preview"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 bg-white/90 p-2 rounded-full shadow-sm transform scale-90 group-hover:scale-100 transition-all">
                        <Edit2 className="w-5 h-5 text-gray-700" />
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removePhoto(photo.id);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
                      #{index + 1}
                    </div>
                  </div>
                  <div className="p-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">
                      {photo.date || '未設定日期'}
                    </div>
                    <div className="text-sm text-gray-900 truncate font-medium">
                      {photo.description || '點擊新增說明...'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <EditPhotoModal
        photo={editingPhoto}
        isOpen={!!editingPhoto}
        onClose={() => setEditingPhoto(null)}
        onSave={updatePhoto}
      />
    </div>
  );
}
