import ImageUploader from "@/components/upload-image";

export default function Home() {
  return (
    <div className="flex flex-col">
      <header className="pt-5 flex justify-center font-semibold">
        <h1>Cargar precios de ganado</h1>
      </header>
      <ImageUploader />
    </div>
  )
}
