import { jsPDF } from 'jspdf'
import { GoogleGenAI } from '@google/genai'
import { db } from '../store/db'

interface PdfThemeConfig {
  primaryColor: string
  fontFamily: 'helvetica' | 'times' | 'courier'
  fontSize: number
}

const COST_PER_PDF_IMAGE = 5

export async function createPdf({
  filename,
  content,
  theme,
  visualPrompts,
}: {
  filename: string
  content: string
  theme: PdfThemeConfig
  visualPrompts?: string[]
}) {
  try {
    const doc = new jsPDF()
    const margin = 20
    const pageWidth = doc.internal.pageSize.getWidth()
    const maxLineWidth = pageWidth - margin * 2
    let yOffset = 30

    const drawHeader = () => {
      doc.setFillColor(theme.primaryColor)
      doc.rect(0, 0, pageWidth, 15, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(10)
      doc.setFont(theme.fontFamily, 'bold')
      doc.text('VOXPACT-STRATEGIC REPORT', margin, 10)
    }

    drawHeader()

    const ai = new GoogleGenAI({
      apiKey: import.meta.env.VITE_GEMINI_API_KEY,
    })

    const paragraphs = content.split('\n').filter(p => p.trim())

    for (let i = 0; i < paragraphs.length; i++) {
      const p = paragraphs[i].trim()
      const isHeading = p.startsWith('#')
      const text = isHeading ? p.replace(/^#+\s*/, '') : p

      if (isHeading) {
        doc.setTextColor(theme.primaryColor)
        doc.setFont(theme.fontFamily, 'bold')
        doc.setFontSize(theme.fontSize + 5)
        yOffset += 12
      } else {
        doc.setTextColor(30, 30, 30)
        doc.setFont(theme.fontFamily, 'normal')
        doc.setFontSize(theme.fontSize)
      }

      const lines = doc.splitTextToSize(text, maxLineWidth)
      const textHeight = lines.length * (theme.fontSize * 0.6)

      if (yOffset + textHeight > 270) {
        doc.addPage()
        drawHeader()
        yOffset = 30
      }

      doc.text(lines, margin, yOffset)
      yOffset += textHeight + 8

      if (visualPrompts && visualPrompts[i] && yOffset < 200) {
        const user = db.getUser()
        if (user && user.credits >= COST_PER_PDF_IMAGE) {
          const imgResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
              parts: [
                {
                  text: `Technical visual for: ${visualPrompts[i]}. Dark tactical aesthetic.`,
                },
              ],
            },
          })

          const imgData =
            imgResponse.candidates?.[0]?.content?.parts?.find(p => p.inlineData)
              ?.inlineData?.data

          if (imgData) {
            doc.addImage(
              `data:image/png;base64,${imgData}`,
              'PNG',
              margin,
              yOffset,
              maxLineWidth,
              70
            )
            yOffset += 75
          }
        }
      }
    }

    doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`)
    return `Success: ${filename} synthesized.`
  } catch (e: any) {
    return `Error: ${e.message}`
  }
}
