import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { calculationData, userInfo } = body

    // Generate PDF report content
    const reportData = {
      title: "Carbon Footprint Report",
      generatedAt: new Date().toISOString(),
      userInfo: userInfo || { name: "Anonymous User" },
      calculationData: calculationData || {
        totalEmissions: 0,
        breakdown: {},
        recommendations: [],
      },
      summary: {
        totalEmissions: calculationData?.totalEmissions || 0,
        comparedToAverage: "Below average",
        topCategories: ["Transportation", "Energy", "Food"],
        potentialSavings: 2.5,
      },
      recommendations: [
        {
          category: "Transportation",
          action: "Use public transport 2 days per week",
          impact: "Save 1.2 tons CO₂/year",
          difficulty: "Easy",
        },
        {
          category: "Energy",
          action: "Switch to LED bulbs",
          impact: "Save 0.5 tons CO₂/year",
          difficulty: "Easy",
        },
        {
          category: "Food",
          action: "Try Meatless Monday",
          impact: "Save 0.8 tons CO₂/year",
          difficulty: "Medium",
        },
      ],
    }

    // In a real implementation, you would generate a PDF here
    // For now, we'll return the data as JSON
    return NextResponse.json({
      success: true,
      reportData,
      downloadUrl: "/api/download-report/pdf", // Mock URL
      message: "Report generated successfully",
    })
  } catch (error) {
    console.error("Download report error:", error)
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 })
  }
}

// Mock PDF download endpoint
export async function GET(request: NextRequest) {
  try {
    // Mock PDF content
    const pdfContent = `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Carbon Footprint Report) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
300
%%EOF
`

    return new Response(pdfContent, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="carbon-footprint-report.pdf"',
      },
    })
  } catch (error) {
    console.error("PDF download error:", error)
    return NextResponse.json({ error: "Failed to download PDF" }, { status: 500 })
  }
}
