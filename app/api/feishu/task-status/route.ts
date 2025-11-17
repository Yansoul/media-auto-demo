import { NextRequest, NextResponse } from 'next/server';
import { searchTaskStatus } from '@/app/services/feishuApi';

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

    const taskRecord = await searchTaskStatus(jobId);

    if (!taskRecord) {
      return NextResponse.json(
        { error: '未找到任务记录', status: 'not_found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      status: taskRecord.fields.status,
      data: taskRecord,
    });
  } catch (error) {
    console.error('查询任务状态失败:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '查询任务状态失败',
        status: 'error',
      },
      { status: 500 }
    );
  }
}
