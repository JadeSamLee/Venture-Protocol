import { NextResponse } from 'next/server'
import { CreateLiquiditySchema } from '../types'
import { METAL_API_BASE_URL, METAL_API_HEADERS, handleMetalResponse } from '../metal-config'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = CreateLiquiditySchema.parse(body)

    const response = await fetch(`${METAL_API_BASE_URL}/token/${validatedData.tokenAddress}/liquidity`, {
      method: 'POST',
      headers: METAL_API_HEADERS,
      body: JSON.stringify({
        amount: validatedData.amount
      })
    })

    const data = await handleMetalResponse(response)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Create liquidity error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create liquidity' },
      { status: 400 }
    )
  }
} 