import { NextResponse } from 'next/server'
import { METAL_API_BASE_URL, METAL_API_HEADERS, handleMetalResponse } from '../../metal-config'

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  try {
    const response = await fetch(
      `${METAL_API_BASE_URL}/token/${params.address}/holders`,
      {
        method: 'GET',
        headers: METAL_API_HEADERS
      }
    )

    const data = await handleMetalResponse(response)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Get token holders error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to get token holders' },
      { status: 400 }
    )
  }
} 