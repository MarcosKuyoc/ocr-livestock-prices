import { useState, ChangeEvent } from 'react';
import Image from 'next/image';
import DataTable from './data-table';

function ImageUploader() {
  const [previewImage, setPreviewImage] = useState<string>('/formato.jpg');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  async function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      setUploadedImage(data.url);
    } else {
      console.error(response.statusText);
    }
  }

  return (
    <div className='flex justify-center'>
      <div id='upload-image' className='flex w-1/3
          p-4 shadow-lg bg-white rounded-xl'>
        <div>
          <div id='select-file' className='p-2'>
            <label className="block">
              <span className="sr-only">Cargar Imagen</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100" />
            </label>
          </div>
          {
            previewImage !== 'formato.jpg' && (
              <div>
                {
                  uploadedImage ?
                  (
                    <div>
                      <h1 className='text-center'>Imagen subida: 100%</h1>
                      <Image src={uploadedImage} alt="Preview" width={400} height={300} />
                    </div>
                  )
                  :
                  ( 
                    <div>
                      <h1 className='text-center'>Preview: Formato Actual</h1>
                      <Image className='max-h-screen' src={previewImage} alt="Preview" width={400} height={300} />
                    </div>
                  )
                }
              </div>
            )
          }
        </div>
      </div>
      <div id='arrow' className='flex justify-center items-center w-1/6'>
        <button className='flex justify-center item-center'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
          </svg>
          Convertir
        </button>
      </div>
      <div id='results' className='flex justify-center w-1/3
      p-4 shadow-lg bg-white rounded-xl
      '>
        <DataTable />
      </div>
    </div>
  );
}

export default ImageUploader;
