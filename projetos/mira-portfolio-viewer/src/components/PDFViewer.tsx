import { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'

interface PDFViewerProps {
  file: File
  pageNumber: number
  onPageChange: (page: number) => void
  onTotalPagesChange: (total: number) => void
}

export default function PDFViewer({
  file,
  pageNumber,
  onPageChange,
  onTotalPagesChange,
}: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocument | null>(null)
  const [scale, setScale] = useState(2)
  const [loading, setLoading] = useState(false)

  // Configurar worker
  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
  }, [])

  // Carregar PDF
  useEffect(() => {
    const loadPdf = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer()
        const loadedPdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        setPdf(loadedPdf)
        onTotalPagesChange(loadedPdf.numPages)
      } catch (error) {
        console.error('Erro ao carregar PDF:', error)
      }
    }
    loadPdf()
  }, [file, onTotalPagesChange])

  // Renderizar página no canvas
  useEffect(() => {
    const renderPage = async () => {
      if (!pdf || !canvasRef.current || pageNumber < 1 || pageNumber > pdf.numPages) return

      setLoading(true)
      try {
        const page = await pdf.getPage(pageNumber)
        const viewport = page.getViewport({ scale })

        const canvas = canvasRef.current
        canvas.width = viewport.width
        canvas.height = viewport.height

        const renderContext = {
          canvasContext: canvas.getContext('2d')!,
          viewport: viewport,
        }

        await page.render(renderContext).promise
        setLoading(false)
      } catch (error) {
        console.error('Erro ao renderizar página:', error)
        setLoading(false)
      }
    }

    renderPage()
  }, [pdf, pageNumber, scale])

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        if (pdf && pageNumber < pdf.numPages) {
          onPageChange(pageNumber + 1)
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (pageNumber > 1) {
          onPageChange(pageNumber - 1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [pageNumber, pdf, onPageChange])

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-950 via-dark to-gray-950 flex flex-col items-center justify-center relative overflow-hidden group p-6">
      {/* Canvas para o PDF */}
      <div className="flex-1 w-full flex items-center justify-center overflow-auto">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
            <div className="text-center">
              <div className="animate-spin mb-4">
                <i className="fas fa-spinner text-4xl text-mira"></i>
              </div>
              <p className="text-gray-400">Carregando página...</p>
            </div>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="max-w-4xl max-h-full shadow-2xl rounded-lg"
          style={{ boxShadow: '0 0 40px rgba(228, 22, 78, 0.4)' }}
        />
      </div>

      {/* Controles de zoom */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex items-center gap-4 glass rounded-full p-4 z-20">
        <button
          onClick={() => setScale(prev => Math.max(0.5, prev - 0.5))}
          className="p-2 rounded-lg hover:bg-mira/30 transition-all text-gray-300 hover:text-mira"
          title="Diminuir zoom"
        >
          <i className="fas fa-minus"></i>
        </button>
        <div className="text-sm text-gray-400 w-16 text-center">
          {Math.round(scale * 50)}%
        </div>
        <button
          onClick={() => setScale(prev => Math.min(4, prev + 0.5))}
          className="p-2 rounded-lg hover:bg-mira/30 transition-all text-gray-300 hover:text-mira"
          title="Aumentar zoom"
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>

      {/* Setas de navegação */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <button
          onClick={() => pageNumber > 1 && onPageChange(pageNumber - 1)}
          className="p-4 rounded-lg glass hover:bg-mira/30 text-gray-300 hover:text-mira transition-all"
          title="Página anterior"
        >
          <i className="fas fa-chevron-left text-2xl"></i>
        </button>
      </div>

      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <button
          onClick={() => pdf && pageNumber < pdf.numPages && onPageChange(pageNumber + 1)}
          className="p-4 rounded-lg glass hover:bg-mira/30 text-gray-300 hover:text-mira transition-all"
          title="Próxima página"
        >
          <i className="fas fa-chevron-right text-2xl"></i>
        </button>
      </div>
    </div>
  )
}
