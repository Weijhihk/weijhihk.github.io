import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { usePhotos, PhotoData } from '../context/PhotoContext';

export default function ReportPage() {
  const { photos, updatePhoto } = usePhotos();
  const navigate = useNavigate();
  const componentRef = useRef<HTMLDivElement>(null);

  // Chunk photos into groups of 4 for each page
  const pages = [];
  for (let i = 0; i < photos.length; i += 4) {
    pages.push(photos.slice(i, i + 4));
  }

  // If no photos, add one empty page or redirect
  if (pages.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-gray-500 mb-4">沒有照片可顯示</p>
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:underline"
        >
          返回上傳頁面
        </button>
      </div>
    );
  }

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: '施工照片報告',
    onAfterPrint: () => console.log('Print finished'),
  });

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      {/* Toolbar - Hidden when printing */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 print:hidden shadow-sm">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回編輯
        </button>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            共 {pages.length} 頁，{photos.length} 張照片
          </span>
          <button
            onClick={() => handlePrint && handlePrint()}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Printer className="w-4 h-4 mr-2" />
            列印 / 存為 PDF
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div ref={componentRef} className="p-8 print:p-0 flex flex-col items-center space-y-8 print:space-y-0 print:block">
        {pages.map((pagePhotos, pageIndex) => (
          <div
            key={pageIndex}
            className="bg-white shadow-lg print:shadow-none w-[297mm] min-h-[210mm] p-[10mm] mx-auto print:w-full print:h-screen print:mx-0 print:break-after-page relative box-border"
          >
            <h1 className="text-center text-2xl font-serif font-bold mb-4 tracking-widest border-b-2 border-transparent">
              施工照片
            </h1>
            
            {/* 2x2 Grid */}
            <div className="grid grid-cols-2 grid-rows-2 gap-0 border-2 border-black h-[calc(100%-3rem)]">
              {[0, 1, 2, 3].map((offset) => {
                const photo = pagePhotos[offset];
                const photoNumber = pageIndex * 4 + offset + 1;
                
                return (
                  <div 
                    key={offset} 
                    className={`
                      relative border border-black flex
                      ${offset % 2 === 0 ? 'border-r-black' : ''}
                      ${offset < 2 ? 'border-b-black' : ''}
                    `}
                  >
                    {photo ? (
                      <PhotoCell 
                        photo={photo} 
                        index={photoNumber} 
                        onUpdate={(data) => updatePhoto(photo.id, data)}
                      />
                    ) : (
                      <EmptyCell index={photoNumber} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {/* Print Styles injected by react-to-print or global styles */}
        <style>{`
          @media print {
            @page {
              size: A4 landscape;
              margin: 0;
            }
            body {
              background: white;
            }
            /* Ensure background graphics are printed if needed, though usually browser setting */
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

function PhotoCell({ photo, index, onUpdate }: { photo: PhotoData; index: number; onUpdate: (data: Partial<PhotoData>) => void }) {
  return (
    <div className="flex w-full h-full">
      {/* Photo Area (Left) - ~70% */}
      <div className="w-[70%] border-r border-black p-2 flex items-center justify-center overflow-hidden bg-gray-50 print:bg-white">
        <img 
          src={photo.url} 
          alt={`Photo ${index}`} 
          className="max-w-full max-h-full object-contain"
        />
      </div>
      
      {/* Metadata Area (Right) - ~30% */}
      <div className="w-[30%] flex flex-col text-sm">
        {/* Row 1: Number */}
        <div className="flex border-b border-black h-8">
          <div className="w-20 border-r border-black flex items-center justify-center bg-gray-100 print:bg-transparent font-medium text-xs">
            照片編號
          </div>
          <div className="flex-1 flex items-center justify-center font-mono">
            {index}.
          </div>
        </div>
        
        {/* Row 2: Date */}
        <div className="flex border-b border-black h-8">
          <div className="w-20 border-r border-black flex items-center justify-center bg-gray-100 print:bg-transparent font-medium text-xs">
            拍照日期
          </div>
          <div className="flex-1 flex items-center justify-center">
            <input 
              type="text" 
              value={photo.date}
              onChange={(e) => onUpdate({ date: e.target.value })}
              className="w-full h-full text-center bg-transparent outline-none px-1"
              placeholder="YYYY-MM-DD"
            />
          </div>
        </div>
        
        {/* Row 3: Description Label */}
        <div className="h-8 border-b border-black flex items-center justify-center bg-gray-100 print:bg-transparent font-medium text-xs">
          圖片說明
        </div>
        
        {/* Row 4: Description Content */}
        <div className="flex-1 p-2">
          <textarea 
            value={photo.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="w-full h-full bg-transparent outline-none resize-none text-sm leading-relaxed"
            placeholder="請輸入說明..."
          />
        </div>
      </div>
    </div>
  );
}

function EmptyCell({ index }: { index: number }) {
  return (
    <div className="flex w-full h-full">
      <div className="w-[70%] border-r border-black p-2 flex items-center justify-center bg-gray-50 print:bg-white">
        <span className="text-gray-300">無照片</span>
      </div>
      <div className="w-[30%] flex flex-col text-sm">
        <div className="flex border-b border-black h-8">
          <div className="w-20 border-r border-black flex items-center justify-center bg-gray-100 print:bg-transparent font-medium text-xs">
            照片編號
          </div>
          <div className="flex-1 flex items-center justify-center font-mono">
            {index}.
          </div>
        </div>
        <div className="flex border-b border-black h-8">
          <div className="w-20 border-r border-black flex items-center justify-center bg-gray-100 print:bg-transparent font-medium text-xs">
            拍照日期
          </div>
          <div className="flex-1"></div>
        </div>
        <div className="h-8 border-b border-black flex items-center justify-center bg-gray-100 print:bg-transparent font-medium text-xs">
          圖片說明
        </div>
        <div className="flex-1"></div>
      </div>
    </div>
  );
}
