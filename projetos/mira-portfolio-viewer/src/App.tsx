import { useState } from 'react'
import PDFViewer from './components/PDFViewer'
import SliderNavigation from './components/SliderNavigation'

function App() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setPdfFile(file)
      setCurrentPage(1)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type === 'application/pdf') {
      setPdfFile(file)
      setCurrentPage(1)
    }
  }

  return (
    <div className="w-full h-screen bg-dark flex flex-col overflow-hidden">
      {!pdfFile ? (
        <div
          className="w-full h-full flex flex-col items-center justify-center gap-8 p-8"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <div className="text-7xl mb-6 text-mira">
              <i className="fas fa-file-pdf"></i>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Mira Portfolio Viewer
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Visualizador moderno e fluido para seus portfólios em PDF
            </p>
          </div>

          <label className="relative">
            <div className="glass-dark px-8 py-4 rounded-xl cursor-pointer hover:border-mira transition-all">
              <div className="flex items-center gap-3 text-lg font-medium">
                <i className="fas fa-cloud-arrow-up text-mira text-xl"></i>
                <span>Clique ou arraste um PDF aqui</span>
              </div>
            </div>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>

          <div className="text-gray-500 text-sm flex items-center gap-2">
            <i className="fas fa-info-circle"></i>
            <span>Suporta arquivos PDF de qualquer tamanho</span>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col gap-0">
          <div className="glass-dark border-b border-mira/20 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <i className="fas fa-book text-mira"></i>
                {pdfFile.name}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 glass rounded-lg text-sm">
                <span className="text-mira font-semibold">{currentPage}</span>
                <span className="text-gray-400"> / {totalPages}</span>
              </div>
              <button
                onClick={() => setPdfFile(null)}
                className="p-2 rounded-lg hover:bg-mira/20 transition-colors text-gray-400 hover:text-mira"
              >
                <i className="fas fa-arrow-left text-lg"></i>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden relative">
            {pdfFile && (
              <>
                <PDFViewer
                  file={pdfFile}
                  pageNumber={currentPage}
                  onPageChange={setCurrentPage}
                  onTotalPagesChange={setTotalPages}
                />
                {totalPages > 0 && (
                  <SliderNavigation
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    pdfFile={pdfFile}
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
