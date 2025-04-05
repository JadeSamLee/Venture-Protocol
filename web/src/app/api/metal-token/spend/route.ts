import { NextResponse } from 'next/server'
import { SpendTokenSchema } from '../types'
import { METAL_API_BASE_URL, METAL_API_HEADERS, handleMetalResponse } from '../metal-config'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = SpendTokenSchema.parse(body)

    const response = await fetch(`${METAL_API_BASE_URL}/token/${validatedData.tokenAddress}/spend`, {
      method: 'POST',
      headers: METAL_API_HEADERS,
      body: JSON.stringify({
        userId: validatedData.userId,
        amount: validatedData.amount
      })
    })

    const data = await handleMetalResponse(response)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Spend token error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to spend tokens' },
      { status: 400 }
    )
  }
} 