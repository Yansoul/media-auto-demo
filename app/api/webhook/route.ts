import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 从环境变量读取后端 API 地址
    const backendUrl = process.env.WEBHOOK_API_URL;

    if (!backendUrl) {
      throw new Error("Backend API URL is not configured");
    }

    // 转发请求到后端 HTTP 服务（服务端可以发送 HTTP 请求）
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend API error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Webhook proxy error:", error);
    return NextResponse.json(
      { error: "Failed to forward request to backend" },
      { status: 500 }
    );
  }
}
