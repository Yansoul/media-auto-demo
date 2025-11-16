import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';

interface NicheItem {
  id: string;
  name: string;
  label: string;
  value: number;
}

interface CategoryData {
  [key: string]: NicheItem[];
}

interface CategoryResponse {
  industry: Array<{ id: string; name: string }>;
  niches: CategoryData;
}

const getCategories = unstable_cache(
  async (): Promise<CategoryResponse> => {
    const apiKey = process.env.TIKUB_API_KEY;

    if (!apiKey) {
      throw new Error('请配置 TIKUB_API_KEY 环境变量');
    }

    const response = await fetch(
      'https://api.tikhub.io/api/v1/douyin/billboard/fetch_content_tag',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`);
    }

    const data = await response.json();

    // 数据结构是三层嵌套：response.data.data.data
    // response: { data: { code: 0, data: [...], ... } }
    const categories = data?.data?.data || [];

    // 确保 categories 是数组
    if (!Array.isArray(categories)) {
      console.error('无法提取分类数据，完整的响应:', JSON.stringify(data, null, 2));
      throw new Error('API 返回的数据格式不符合预期，缺少 data.data.data 数组');
    }

    // 解析数据结构
    const industries: Array<{ id: string; name: string }> = [];
    const niches: CategoryData = {};

    // 遍历一级分类
    categories.forEach((item: any) => {
      const industryName = item.label || '';
      const industryValue = item.value || 0;

      if (!industryName) return;

      // 添加一级分类
      industries.push({
        id: String(industryValue),
        name: industryName,
      });

      // 处理二级分类（children）
      const children = item.children || [];
      niches[industryName] = [];

      children.forEach((child: any) => {
        const nicheName = child.label || '';
        const nicheValue = child.value || 0;

        if (!nicheName) return;

        niches[industryName].push({
          id: String(nicheValue),
          name: nicheName,
          label: nicheName,
          value: nicheValue,
        });
      });
    });

    return {
      industry: industries,
      niches: niches,
    };
  },
  ['douyin-categories'],
  {
    revalidate: 86400, // 24 小时缓存
    tags: ['douyin-categories'],
  }
);

export async function GET() {
  try {
    const data = await getCategories();
    return NextResponse.json(data);
  } catch (error) {
    console.error('获取分类失败:', error);
    return NextResponse.json(
      { error: '获取分类数据失败' },
      { status: 500 }
    );
  }
}
