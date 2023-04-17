import ImageUploader from "@/components/upload-image";

export default function Home() {
  return (
    <div className="flex flex-col">
      <header className="p-2 flex justify-center font-semibold">
        <h1 className="text-2xl">Convertir precios de una imagen</h1>
      </header>
      <ImageUploader />
    </div>
  )
}
