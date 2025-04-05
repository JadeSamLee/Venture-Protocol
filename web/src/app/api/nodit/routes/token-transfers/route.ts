import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Your Nodit API key (store this in environment variables in production)
const NODIT_API_KEY = process.env.NODIT_API_KEY || "your_nodit_api_key_here";

// Base URL for Nodit API
const NODIT_API_BASE = "https://api.nodit.io/v1";

// Your contract addresses
const CONTRACT_ADDRESSES = {
  distribution: "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8",
  escrow: "0xd9145CCE52D386f254917e481eB44e9943F39138",
  investment: "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8",

// Chain ID (e.g., 1 for Ethereum Mainnet, adjust as needed)
const CHAIN_ID = 1;

// GET: Fetch token contract metadata
export async function GET(req: NextRequest) {
  try {
    const url = `${NODIT_API_BASE}/token/contracts/metadata?contract_addresses=${CONTRACT_ADDRESSES.distribution},${CONTRACT_ADDRESSES.escrow}&chain_id=${CHAIN_ID}`;
    
    const response = await axios.get(url, {
      headers: {
        "x-api-key": NODIT_API_KEY,
      },
    });

    return NextResponse.json({
      success: true,
      data: response.data,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}

// POST: Log webhook events
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { webhook_id, event_type, data } = body;

    // Validate request body
    if (!webhook_id || !event_type || !data) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields: webhook_id, event_type, or data",
      }, { status: 400 });
    }

    // Supported event types from your contracts
    const validEventTypes = [
      "token_distribution",
      "stake",
      "deposit",
      "released",
      "refunded",
      "phase_completed",
      "metal_tokens_distributed",
    ];

    if (!validEventTypes.includes(event_type)) {
      return NextResponse.json({
        success: false,
        error: `Invalid event_type. Must be one of: ${validEventTypes.join(", ")}`,
      }, { status: 400 });
    }

    const url = `${NODIT_API_BASE}/webhook/log`;
    const payload = {
      webhook_id,
      event_type,
      data: {
        ...data,
        contract_address: data.contract_address || CONTRACT_ADDRESSES[event_type === "deposit" ? "escrow" : "distribution"],
        timestamp: new Date().toISOString(),
      },
    };

    const response = await axios.post(url, payload, {
      headers: {
        "x-api-key": NODIT_API_KEY,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json({
      success: true,
      data: response.data,
    }, { status: 200 });
  } catch (error) {
    console.error("Error logging webhook:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}
