export const METAL_API_BASE_URL = 'https://api.metal.build'

export const METAL_API_HEADERS = {
  'Content-Type': 'application/json',
  'x-api-key': process.env.METAL_PUBLIC_KEY || ''
}

export async function handleMetalResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to process Metal API request')
  }
  return response.json()
} 