import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ErrorBar,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3 } from "lucide-react";
import _ from "lodash";
import { isCalibrationCurveHplcType } from "@/data/hplcProtocols";

const COLORS = [
  "#007AFF",
  "#34C759",
  "#FF9500",
  "#AF52DE",
  "#5856D6",
  "#FF3B30",
  "#FF2D55",
  "#32D74B",
  "#64D2FF",
  "#BF5AF2",
];

const CustomTooltip = ({ active, payload, label, unit, lang = "ko" }) => {
  const isEn = lang === "en";
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="ios-card ios-blur rounded-2xl p-4 ios-shadow-lg border-0">
        <p className="text-gray-900 font-semibold text-base">{label}</p>
        <p className="text-gray-600 font-medium">
          {isEn ? "Mean" : "평균"}: {data.value?.toFixed(4)} {unit}
        </p>
        {data.n !== undefined && (
          <p className="text-gray-500 text-sm">{isEn ? "Sample count (n)" : "샘플 수 (n)"}: {data.n}</p>
        )}
      </div>
    );
  }
  return null;
};

const ChartComponent = ({ data, unit, lang = "ko" }) => {
  const isEn = lang === "en";
  if (!data || data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <p className="text-gray-500">{isEn ? "No data for this item." : "이 항목에 대한 데이터가 없습니다."}</p>
      </div>
    );
  }

  const dynamicBarSize = Math.max(20, Math.min(80, 600 / data.length));

  return (
    <div className="h-[400px] p-4 rounded-2xl bg-white/60">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            stroke="#374151"
            fontSize={16}
            fontWeight="600"
            tick={{ fill: "#374151" }}
            angle={0}
            textAnchor="middle"
            height={20}
            interval={0}
          />
          <YAxis
            stroke="#374151"
            fontSize={16}
            fontWeight="600"
            tick={{ fill: "#374151" }}
            tickFormatter={(value) => value.toFixed(2)}
          />
          <Tooltip
            content={<CustomTooltip unit={unit} lang={lang} />}
            cursor={{ fill: "rgba(142, 142, 147, 0.1)" }}
          />
          <Bar dataKey="value" barSize={dynamicBarSize} radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            <ErrorBar dataKey="errorY" width={6} stroke="#ffffffff" strokeWidth={2} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default function ResultsChart({ results, analysisType, lang = "ko" }) {
  const isEn = lang === "en";
  if (!results || results.length === 0) {
    return (
      <Card className="ios-card ios-blur rounded-3xl ios-shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-gray-900 text-xl font-semibold flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>{isEn ? "Visualization" : "시각화"}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500 font-medium">{isEn ? "No data to visualize" : "시각화할 데이터가 없습니다"}</p>
        </CardContent>
      </Card>
    );
  }

  const validResults = results.filter(
    (r) => r.concentration !== null && r.concentration !== undefined && r.compound
  );

  const uniqueCompounds = [...new Set(validResults.map((r) => r.compound))];
  const uniqueFactors = [...new Set(validResults.map((r) => r.factor))];

  const treatmentGroups = _.groupBy(validResults, "treatment");
  const treatmentCount = Object.keys(treatmentGroups).length;

  const unit = isCalibrationCurveHplcType(analysisType) ? "mg/g DW" : "µmol/g dry wt.";

  const createCompoundChartData = (compound) => {
    return Object.entries(
      _.groupBy(validResults.filter((r) => r.compound === compound), "treatment")
    ).map(([name, groupSamples]) => {
      const values = groupSamples.map((s) => s.concentration);
      const mean = _.mean(values);
      const stdDev =
        groupSamples.length > 1
          ? Math.sqrt(
              _.sumBy(values, (val) => Math.pow(val - mean, 2)) / (groupSamples.length - 1)
            )
          : 0;
      const stdErr = groupSamples.length > 1 ? stdDev / Math.sqrt(groupSamples.length) : 0;
      return { name, value: mean, errorY: stdErr, n: groupSamples.length };
    });
  };

  const createFactorChartData = (factor) => {
    return Object.entries(
      _.groupBy(validResults.filter((r) => r.factor === factor), "treatment")
    ).map(([name, groupSamples]) => {
      const values = groupSamples.map((s) => s.concentration);
      const mean = _.mean(values);
      const stdDev =
        groupSamples.length > 1
          ? Math.sqrt(
              _.sumBy(values, (val) => Math.pow(val - mean, 2)) / (groupSamples.length - 1)
            )
          : 0;
      const stdErr = groupSamples.length > 1 ? stdDev / Math.sqrt(groupSamples.length) : 0;
      return { name, value: mean, errorY: stdErr, n: groupSamples.length };
    });
  };

  return (
    <Card className="ios-card ios-blur rounded-3xl ios-shadow-lg border-0">
      <CardContent className="space-y-6 pt-6">
        <div className="p-6 rounded-2xl bg-white/80 ios-shadow border border-gray-100/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
            <div>
              <p className="text-gray-500 text-sm font-semibold mb-1">{isEn ? "Total samples" : "총 샘플 수"}</p>
              <p className="text-gray-900 font-bold text-2xl">{validResults.length}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-semibold mb-1">{isEn ? "Total treatments" : "총 처리구 수"}</p>
              <p className="text-gray-900 font-bold text-2xl">{treatmentCount}</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="compound" className="w-full">
          {/* ✅ 상단({isEn ? "By compound" : "화합물별"}/{isEn ? "By factor" : "Factor별"}) */}
          <TabsList
            className="relative isolate overflow-hidden grid w-full grid-cols-2 rounded-xl p-1.5 h-12
              bg-[rgba(15,23,42,0.35)] border border-white/10 backdrop-blur-md shadow-lg"
          >
            <TabsTrigger
              value="compound"
              className="h-9 self-center rounded-lg text-sm font-semibold transition-all duration-200
                text-slate-200/70 hover:text-white
                data-[state=active]:text-[rgba(191,219,254,0.98)]
                data-[state=active]:bg-[rgba(59,130,246,0.22)]
                data-[state=active]:ring-1 data-[state=active]:ring-inset
                data-[state=active]:ring-[rgba(147,197,253,0.35)]
                data-[state=active]:shadow-none"
            >
              {isEn ? "By compound" : "화합물별"}
            </TabsTrigger>

            <TabsTrigger
              value="factor"
              className="h-9 self-center rounded-lg text-sm font-semibold transition-all duration-200
                text-slate-200/70 hover:text-white
                data-[state=active]:text-[rgba(187,247,208,0.98)]
                data-[state=active]:bg-[rgba(34,197,94,0.18)]
                data-[state=active]:ring-1 data-[state=active]:ring-inset
                data-[state=active]:ring-[rgba(134,239,172,0.35)]
                data-[state=active]:shadow-none"
            >
              {isEn ? "By factor" : "Factor별"}
            </TabsTrigger>
          </TabsList>

          {/* ✅ {isEn ? "By compound" : "화합물별"} */}
          <TabsContent value="compound" className="mt-6">
            <Tabs defaultValue={uniqueCompounds[0]} className="w-full">
              {/* ✅ 여기(틸리아닌/아카세틴)도 상단과 동일하게: h-12 + Trigger h-9 self-center */}
              <TabsList
                className="relative isolate overflow-hidden grid w-full grid-cols-2 md:grid-cols-4 rounded-xl p-1.5 h-12
                  bg-[rgba(15,23,42,0.28)] border border-white/10 backdrop-blur-md shadow-lg"
              >
                {uniqueCompounds.map((compound) => (
                  <TabsTrigger
                    key={compound}
                    value={compound}
                    className="h-9 self-center w-full min-w-0 truncate rounded-lg px-3 text-xs font-semibold transition-all duration-200
                      text-slate-200/70 hover:text-white
                      data-[state=active]:text-[rgba(191,219,254,0.98)]
                      data-[state=active]:bg-[rgba(59,130,246,0.20)]
                      data-[state=active]:ring-1 data-[state=active]:ring-inset
                      data-[state=active]:ring-[rgba(147,197,253,0.35)]
                      data-[state=active]:shadow-none"
                    title={compound}
                  >
                    {compound}
                  </TabsTrigger>
                ))}
              </TabsList>

              {uniqueCompounds.map((compound) => (
                <TabsContent key={compound} value={compound} className="mt-6">
                  <ChartComponent data={createCompoundChartData(compound)} unit={unit} lang={lang} />
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>

          {/* ✅ {isEn ? "By factor" : "Factor별"} */}
          <TabsContent value="factor" className="mt-6">
            <Tabs defaultValue={uniqueFactors[0]} className="w-full">
              <TabsList
                className="relative isolate overflow-hidden grid w-full grid-cols-3 md:grid-cols-5 rounded-xl p-1.5 h-12
                  bg-[rgba(15,23,42,0.28)] border border-white/10 backdrop-blur-md shadow-lg"
              >
                {uniqueFactors.map((factor) => (
                  <TabsTrigger
                    key={factor}
                    value={factor}
                    className="h-9 self-center w-full min-w-0 truncate rounded-lg px-3 text-xs font-semibold transition-all duration-200
                      text-slate-200/70 hover:text-white
                      data-[state=active]:text-[rgba(187,247,208,0.98)]
                      data-[state=active]:bg-[rgba(34,197,94,0.18)]
                      data-[state=active]:ring-1 data-[state=active]:ring-inset
                      data-[state=active]:ring-[rgba(134,239,172,0.35)]
                      data-[state=active]:shadow-none"
                    title={factor}
                  >
                    {factor}
                  </TabsTrigger>
                ))}
              </TabsList>

              {uniqueFactors.map((factor) => (
                <TabsContent key={factor} value={factor} className="mt-6">
                  <ChartComponent data={createFactorChartData(factor)} unit={unit} lang={lang} />
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
