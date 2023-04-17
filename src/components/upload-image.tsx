import { useState, ChangeEvent } from 'react';
import Image from 'next/image';
import DataTable from './data-table';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Rates } from './data-table.types';

const MySwal = withReactContent(Swal);

const ImageUploader = () => {
  const previewNameImage = 'formato-2023.jpg';
  const previewNameFormatoOld = 'formato-2020.jpg';
  const [previewImage, setPreviewImage] = useState<string>(`/${previewNameImage}`);
  const [previewImageFormatOld] = useState<string>(`/${previewNameFormatoOld}`);
  const [dataImage, setDataImage] = useState<Rates>({titleSeason: 'Debe convertir sus precios'});
  const [status, setStatus] = useState('newFormat');

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setStatus(event.target.value);
  };

  const handleFileInputChange = async(event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
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
      formData.append('formatImage', status);

      MySwal.fire({
        title: 'Por favor espera mientras convertimos su imagen...',
        allowOutsideClick: false,
        didOpen: async() => {
          Swal.showLoading()

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            Swal.hideLoading()
            Swal.fire({
              icon: 'error',
              title: response.statusText,
              text: 'No pudimos procesar su imagen: Es probable que el formato no sea correcto o no es un archivo soportado',
            })
          } else {
            const data = await response.json();
            setDataImage(data);
            Swal.hideLoading()
            Swal.fire({
              icon: 'success',
              title: '¡Su precios fueron procesados!',
              showConfirmButton: false,
              timer: 1500
            });
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
            <div className='mb-6 border-b border-slate-200 pb-2 text-base font-semibold'>
              Formatos aceptados
            </div>
            <input id="newFormat" className="peer/newFormat form-radio mr-2 mb-0.5 border-slate-300 text-sky-400 focus:ring-sky-300" type="radio" name="status" value="newFormat" checked={status === 'newFormat'} onChange={handleStatusChange} />
            <label htmlFor="newFormat" className="peer-checked/newFormat:text-sky-500 font-medium">Formato 2023</label>

            <input id="formatOld" className="peer/formatOld form-radio mr-2 mb-0.5 ml-4 border-slate-300 text-sky-400 focus:ring-sky-30" type="radio" name="status" value="formatOld" checked={status === 'formatOld'} onChange={handleStatusChange} />
            <label htmlFor="formatOld" className="peer-checked/formatOld:text-sky-500 peer/formatOld font-medium">Formato 2020</label>

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

            <div className={status === 'newFormat' ? "block p-2" : "hidden p-2"}>
              <Image className='max-h-screen' src={previewImage} alt="Preview" width={400} height={300} />
            </div>
            <div className={status === 'formatOld' ? "block p-2" : "hidden p-2"}>
              <Image className='max-h-screen' src={previewImageFormatOld} alt="Preview" width={400} height={300} />
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
