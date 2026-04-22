import { useEffect, useState, useRef } from 'react'
import * as pdfjsLib from 'pdfjs-dist'

interface SliderNavigationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pdfFile: File
}

interface ThumbnailCache {
  [key: number]: HTMLCanvasElement
}

export default function SliderNavigation({
  currentPage,
  totalPages,
  onPageChange,
  pdfFile,
}: SliderNavigationProps) {
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocument | null>(null)
  const [thumbnails, setThumbnails] = useState<ThumbnailCache>({})
  const [isExpanded, setIsExpanded] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Configurar worker
  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
  }, [])

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const arrayBuffer = await pdfFile.arrayBuffer()
        const loadedPdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        setPdf(loadedPdf)
      } catch (error) {
        console.error('Erro ao carregar PDF:', error)
      }
    }
    loadPdf()
  }, [pdfFile])

  const generateThumbnail = async (pageNum: number) => {
    if (!pdf || thumbnails[pageNum]) return

    try {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale: 0.5 })
      const canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height

      const renderContext = {
        canvasContext: canvas.getContext('2d')!,
        viewport: viewport,
      }

      await page.render(renderContext).promise

      setThumbnails(prev => ({
        ...prev,
        [pageNum]: canvas,
      }))
    } catch (error) {
      console.error('Erro ao gerar miniatura:', error)
    }
  }

  useEffect(() => {
    if (!pdf) return
    const pagesToGenerate = [currentPage - 1, currentPage, currentPage + 1, currentPage + 2].filter(
      p => p >= 1 && p <= totalPages
    )
    pagesToGenerate.forEach(pageNum => {
      if (!thumbnails[pageNum]) generateThumbnail(pageNum)
    })
  }, [currentPage, pdf, totalPages, thumbnails])

  useEffect(() => {
    if (scrollContainerRef.current) {
      const currentElement = scrollContainerRef.current.querySelector(
        `[data-page="${currentPage}"]`
      ) as HTMLElement | null
      if (currentElement) {
        currentElement.scrollIntoView({ behavior: 'smooth', inline: 'center' })
      }
    }
  }, [currentPage])

  const visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <>
      {/* Modal Grade */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsExpanded(false)}
        >
          <div
            className="w-full max-w-6xl max-h-96 glass-dark rounded-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-mira/20 flex justify-between">
              <h3 className="text-xl font-semibold">Todas as páginas</h3>
              <button onClick={() => setIsExpanded(false)} className="p-2 hover:bg-mira/20 rounded">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="overflow-y-auto p-6 h-80">
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {visiblePages.map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => {
                      onPageChange(pageNum)
                      setIsExpanded(false)
                    }}
                    className={`relative rounded-lg overflow-hidden aspect-[3/4] border-2 transition-all ${
                      currentPage === pageNum
                        ? 'border-mira shadow-lg shadow-mira/50'
                        : 'border-gray-700 hover:border-mira/50'
                    }`}
                  >
                    {thumbnails[pageNum] && (
                      <img
                        src={thumbnails[pageNum].toDataURL()}
                        alt={`Página ${pageNum}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 flex items-end justify-center pb-2">
                      <span className="text-sm font-semibold">{pageNum}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slider horizontal */}
      <div className="absolute bottom-6 right-0 left-0 px-6 z-30">
        <div className="flex justify-between items-end gap-4">
          {/* Botão Grade */}
          <button
            onClick={() => setIsExpanded(true)}
            className="glass rounded-lg px-4 py-3 hover:bg-mira/30 transition-all text-gray-300 hover:text-mira flex items-center gap-2"
          >
            <i className="fas fa-grip"></i>
            <span className="text-sm">Grade</span>
          </button>

          {/* Scrollable slider */}
          <div
            ref={scrollContainerRef}
            className="flex-1 flex overflow-x-auto gap-3 pb-2 scrollbar-hide"
          >
            {visiblePages.map(pageNum => (
              <button
                key={pageNum}
                data-page={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`relative flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                  currentPage === pageNum
                    ? 'w-20 h-28 border-mira shadow-lg shadow-mira/50'
                    : 'w-16 h-24 border-gray-700 hover:border-mira/50'
                }`}
              >
                {thumbnails[pageNum] ? (
                  <>
                    <img
                      src={thumbnails[pageNum].toDataURL()}
                      alt={`Página ${pageNum}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 flex items-end justify-center pb-1">
                      <span
                        className={`font-semibold text-xs ${
                          currentPage === pageNum ? 'text-mira' : 'text-gray-300'
                        }`}
                      >
                        {pageNum}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <i className="fas fa-file text-gray-600 text-sm"></i>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Botões de navegação */}
          <div className="flex gap-2">
            <button
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              className="glass rounded-lg p-3 hover:bg-mira/30 text-gray-300 hover:text-mira"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
              className="glass rounded-lg p-3 hover:bg-mira/30 text-gray-300 hover:text-mira"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  )
}
