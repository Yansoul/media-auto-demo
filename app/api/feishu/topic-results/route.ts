import { NextRequest, NextResponse } from 'next/server';
import { searchTopicResults } from '@/app/services/feishuApi';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json(
        { error: '缺少 jobId 参数' },
        { status: 400 }
      );
    }

    const topicResults = await searchTopicResults(jobId);

    return NextResponse.json({
      success: true,
      count: topicResults.length,
      data: topicResults,
    });
  } catch (error) {
    console.error('查询选题结果失败:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '查询选题结果失败',
      },
      { status: 500 }
    );
  }
}
