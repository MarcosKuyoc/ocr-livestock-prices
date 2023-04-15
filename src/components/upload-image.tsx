import { useState, ChangeEvent } from 'react';
import Image from 'next/image';
import DataTable from './data-table';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Rates } from './data-table.types';

const MySwal = withReactContent(Swal);

const ImageUploader = () => {
  const previewNameImage = 'formato.jpg';
  const [previewImage, setPreviewImage] = useState<string>(`/${previewNameImage}`);
  const [nameImage, setNameImage] = useState<string>(`Fomato Actual`);
  const [dataImage, setDataImage] = useState<Rates>({titleSeason: 'Debe cargar sus precios'});

  const handleFileInputChange = async(event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
      setNameImage(file.name);
    };
  }

  const onParseImageToText = async () => {
    const miInput = document.getElementById('input-upload-imagen') as HTMLInputElement;
    const archivo = miInput.files![0];
    
    if (!archivo) {
      MySwal.fire({
        title: 'Estas seguro?',
        text: "Quieres convertir la imagen 'Preview' o deseas cargar tu imagen?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Convertir'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Convirtiendo la imagen!',
            'Espere unos minutos mientras convertimos la imagen',
            'success'
          )
        }
      });
    } else {
      const formData = new FormData();
      formData.append('file', archivo);

      MySwal.fire({
        title: 'Por favor espera mientras convertimos su imagen...',
        allowOutsideClick: false,
        didOpen: async() => {
          Swal.showLoading()

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
      
          if (response.ok) {
            const data = await response.json();
            setDataImage(data);
            Swal.hideLoading()
            Swal.fire({
              icon: 'success',
              title: '¡Su precios fueron procesados!',
              showConfirmButton: false,
              timer: 1500
            })
          } else {
            console.error(response.statusText);
            Swal.hideLoading()
              Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: `Ocurrió un error: ${response.statusText}`,
              })
          }
        },
      })
    }
  }

  return (
    <div className='flex justify-center'>
      <div id='upload-image' className='flex w-1/3
          p-4 shadow-lg bg-white rounded-xl'>
        <div className='m-auto'>
          <div id='select-file' className='p-2'>
            <label className="block">
              <span className="sr-only">Cargar Imagen</span>
              <input
                id='input-upload-imagen'
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
          <div id='preview'>
            <h1 className='text-center'>Preview: {nameImage}</h1>
            <Image className='max-h-screen' src={previewImage} alt="Preview" width={400} height={300} />
          </div>  
        </div>
      </div>
      <div id='parse-image' className='flex justify-center items-center w-1/6'>
        <button className='flex justify-center item-center' onClick={onParseImageToText}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
          </svg>
          Convertir
        </button>
      </div>
      <div id='results' className='flex justify-center w-1/3
      p-4 shadow-lg bg-white rounded-xl
      '>
        <DataTable titleSeason={dataImage.titleSeason} pricesList={dataImage.pricesList} />
      </div>
    </div>
  );
}

export default ImageUploader;
