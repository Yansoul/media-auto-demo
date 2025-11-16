"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
  Spinner,
  Progress,
  Chip,
  Divider,
  Textarea,
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";

type Industry = {
  id: string;
  name: string;
};

type Niche = {
  id: string;
  name: string;
  description?: string;
};

type CategoryData = {
  [key: string]: Array<{
    id: string;
    name: string;
    value: number;
  }>;
};

const steps = ["选择行业", "选择赛道", "输入文案(可选)", "完成配置"];

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [selectedIndustryName, setSelectedIndustryName] = useState<string>("");
  const [selectedNiche, setSelectedNiche] = useState<string>("");
  const [contentScripts, setContentScripts] = useState<string[]>(["", "", ""]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [niches, setNiches] = useState<Niche[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadIndustries();
  }, []);

  // 初始加载行业列表（无 loading 状态）
  const loadIndustries = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('✅ API 调用成功:', data);
      setCategoryData(data.niches || {});
      setIndustries(data.industry || []);
    } catch (err) {
      console.error('❌ 加载分类失败:', err);
      setError("获取行业数据失败，请稍后重试");
    }
  };

  // 从缓存数据中加载细分赛道
  const loadNiches = (industryName: string) => {
    setLoading(true);
    setError("");
    try {
      console.log('=== loadNiches 调试 ===');
      console.log('传入的 industryName:', industryName);
      console.log('categoryData 对象:', categoryData);
      const nicheData = categoryData[industryName] || [];
      console.log('找到的 nicheData:', nicheData);

      const nicheList: Niche[] = nicheData.map(item => ({
        id: item.id,
        name: item.name,
        description: item.name,
      }));
      console.log('转换后的 nicheList:', nicheList);
      setNiches(nicheList);
    } catch (err) {
      setError("获取赛道数据失败");
      console.error('加载赛道失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!selectedIndustry) {
        setError("请先选择一个行业");
        return;
      }
      const industry = industries.find(i => i.id === selectedIndustry);
      if(industry) {
        setSelectedIndustryName(industry.name);
        loadNiches(industry.name);
      }
      setCurrentStep(2);
      setError("");
    } else if (currentStep === 2) {
      if (!selectedNiche) {
        setError("请先选择一个赛道");
        return;
      }
      setCurrentStep(3);
      setError("");
    } else if (currentStep === 3) {
      setCurrentStep(4);
      setError("");
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError("");
    }
  };

  const handleComplete = () => {
    console.log("用户选择:", {
      industry: selectedIndustry,
      niche: selectedNiche,
    });
  };

  const getIndustryName = (id: string) => {
    return industries.find((i) => i.id === id)?.name || "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 顶部标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            AI 自媒体选题助手
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            智能分析您的领域，提供优质选题建议
          </p>
        </motion.div>

        {/* 步骤指示器 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8"
        >
          <Progress
            value={(currentStep / steps.length) * 100}
            className="max-w-md mx-auto"
            size="sm"
            color="success"
          />
          <div className="flex justify-center mt-4 space-x-6">
            {steps.map((step, index) => {
              const isActive = currentStep >= index + 1;
              return (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      isActive
                        ? "bg-success text-white shadow-lg shadow-success-500/30"
                        : "bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className={`text-xs mt-2 text-center font-medium max-w-20 ${
                    isActive ? "text-success dark:text-success-400" : "text-gray-500 dark:text-gray-400"
                  }`}>
                    {step}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* 主要内容 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="w-full max-w-2xl mx-auto">
              {loading && (
                <div className="py-8 flex justify-center">
                  <Spinner size="lg" color="primary" />
                </div>
              )}

              {!loading && currentStep === 1 && (
                <>
                  <CardHeader className="flex flex-col items-start">
                    <h2 className="text-2xl font-bold">第一步：选择您的行业领域</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      请选择您的自媒体账号所属的行业领域
                    </p>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    {error && (
                      <div className="mb-4">
                        <Chip color="danger" variant="solid">
                          {error}
                        </Chip>
                      </div>
                    )}
                    <Select
                      label="选择行业领域"
                      placeholder="请选择一个行业"
                      selectedKeys={selectedIndustry ? [selectedIndustry] : []}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      size="lg"
                      className="w-full"
                    >
                      {industries.map((industry) => (
                        <SelectItem key={industry.id} textValue={industry.name}>
                          <div className="py-1">
                            <span className="text-base font-medium text-gray-900 dark:text-gray-100">{industry.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </Select>
                    <div className="flex justify-end mt-6">
                      <Button
                        color="success"
                        size="lg"
                        onPress={handleNextStep}
                        className="w-full sm:w-auto bg-success text-white"
                      >
                        下一步
                      </Button>
                    </div>
                  </CardBody>
                </>
              )}

              {!loading && currentStep === 2 && (
                <>
                  <CardHeader className="flex flex-col items-start">
                    <h2 className="text-2xl font-bold">第二步：选择细分赛道</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      已选择行业：{selectedIndustryName}
                    </p>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    {error && (
                      <div className="mb-4">
                        <Chip color="danger" variant="solid">
                          {error}
                        </Chip>
                      </div>
                    )}
                    <Select
                      label="选择细分赛道"
                      placeholder="请选择一个赛道"
                      selectedKeys={selectedNiche ? [selectedNiche] : []}
                      onChange={(e) => setSelectedNiche(e.target.value)}
                      size="lg"
                      className="w-full"
                    >
                      {niches.map((niche) => (
                        <SelectItem key={niche.id} textValue={niche.name}>
                          <div className="flex flex-col gap-1 py-1">
                            <span className="font-medium text-gray-900 dark:text-gray-100">{niche.name}</span>
                            {niche.description && (
                              <span className="text-sm text-gray-600 dark:text-gray-400">{niche.description}</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </Select>
                    <div className="flex justify-between mt-6 gap-4">
                      <Button
                        variant="bordered"
                        size="lg"
                        onPress={handlePreviousStep}
                        className="w-full sm:w-auto"
                      >
                        返回
                      </Button>
                      <Button
                        color="success"
                        size="lg"
                        onPress={handleNextStep}
                        className="w-full sm:w-auto text-white"
                      >
                        下一步
                      </Button>
                    </div>
                  </CardBody>
                </>
              )}

              {!loading && currentStep === 3 && (
                <>
                  <CardHeader className="flex flex-col items-start">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold">输入历史视频文案词稿（可选）</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      提供您已发布的视频文案词稿，AI 将学习您的风格和特点，生成更符合您账号风格的选题建议
                    </p>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    {error && (
                      <div className="mb-4">
                        <Chip color="danger" variant="solid">
                          {error}
                        </Chip>
                      </div>
                    )}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-400">请复制您已发布视频的代表性文案：</p>
                        <Button
                          size="sm"
                          color="success"
                          variant="flat"
                          onPress={() => {
                            if (contentScripts.length < 10) {
                              setContentScripts([...contentScripts, ""]);
                            }
                          }}
                          isDisabled={contentScripts.length >= 10}
                        >
                          + 添加文案
                        </Button>
                      </div>
                      {contentScripts.map((script, index) => (
                        <div key={index} className="relative">
                          <Textarea
                            label={`文案词稿 ${index + 1}（${script.length}/500）`}
                            placeholder="请输入视频文案内容..."
                            value={script}
                            onValueChange={(value) => {
                              const newScripts = [...contentScripts];
                              newScripts[index] = value.slice(0, 500);
                              setContentScripts(newScripts);
                            }}
                            maxLength={500}
                            minRows={4}
                            maxRows={8}
                            className="w-full"
                          />
                          {contentScripts.length > 1 && (
                            <button
                              onClick={() => {
                                const newScripts = contentScripts.filter((_, i) => i !== index);
                                setContentScripts(newScripts);
                              }}
                              className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-all opacity-60 hover:opacity-100"
                              title="删除此文案"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                        <p className="text-sm text-emerald-700 dark:text-emerald-400">
                          <span className="font-semibold">💡 小贴士：</span>
                          选择最能代表您账号风格的文案，包含开头钩子、中间内容和结尾引导语，这样 AI 能更好地学习您的独特风格
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between mt-6 gap-4">
                      <Button
                        variant="bordered"
                        size="lg"
                        onPress={handlePreviousStep}
                        className="w-full sm-w-auto"
                      >
                        返回
                      </Button>
                      <Button
                        variant="light"
                        size="lg"
                        onPress={() => {
                          setContentScripts(["", "", ""]);
                          handleNextStep();
                        }}
                        className="w-full sm:w-auto text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        跳过此步骤
                      </Button>
                      <Button
                        color="success"
                        size="lg"
                        onPress={handleNextStep}
                        className="w-full sm-w-auto text-white"
                      >
                        继续
                      </Button>
                    </div>
                  </CardBody>
                </>
              )}

              {!loading && currentStep === 4 && (
                <>
                  <CardHeader className="flex flex-col items-start">
                    <h2 className="text-2xl font-bold">配置完成！</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      您已完成领域选择，可以开始获取选题建议了
                    </p>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 mb-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">行业领域</p>
                          <p className="font-medium">{getIndustryName(selectedIndustry)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">细分赛道</p>
                          <p className="font-medium">
                            {niches.find((n) => n.id === selectedNiche)?.name}
                          </p>
                        </div>
                        {contentScripts.some(s => s.trim()) && (
                          <div className="sm:col-span-2">
                            <p className="text-sm text-gray-500 dark:text-gray-400">已提供文案样本</p>
                            <p className="font-medium text-success">{contentScripts.filter(s => s.trim()).length} 个</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-center gap-4">
                      <Button
                        variant="bordered"
                        size="lg"
                        onPress={handlePreviousStep}
                        className="w-full sm-w-auto"
                      >
                        返回修改
                      </Button>
                      <Button
                        color="success"
                        size="lg"
                        onPress={handleComplete}
                        className="w-full sm-w-auto text-white"
                      >
                        获取选题建议
                      </Button>
                    </div>
                  </CardBody>
                </>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
