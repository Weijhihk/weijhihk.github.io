import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { PhotoData } from '../context/PhotoContext';

interface EditPhotoModalProps {
  photo: PhotoData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: Partial<PhotoData>) => void;
}

export default function EditPhotoModal({ photo, isOpen, onClose, onSave }: EditPhotoModalProps) {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (photo) {
      setDate(photo.date);
      setDescription(photo.description);
    }
  }, [photo]);

  if (!isOpen || !photo) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(photo.id, { date, description });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">編輯照片資訊</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={photo.url}
                alt="Preview"
                className="max-w-full max-h-48 object-contain"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                拍照日期
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                圖片說明
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="請輸入說明..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow resize-none"
              />
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium shadow-sm"
            >
              儲存變更
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
