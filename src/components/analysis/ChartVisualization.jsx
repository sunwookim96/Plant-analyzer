import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ErrorBar, Cell } from "recharts";
import { BarChart3, Users, FlaskConical } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import _ from "lodash";
import { motion } from "framer-motion";

const COLORS = ['#007AFF', '#34C759', '#FF9500', '#AF52DE', '#5856D6', '#FF3B30', '#FF2D55', '#32D74B', '#64D2FF', '#BF5AF2'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="ios-card ios-blur rounded-2xl p-4 ios-shadow-lg border-0">
        <p className="text-gray-900 font-semibold text-base">{label}</p>
        <p className="text-gray-600 font-medium">평균: {data.value?.toFixed(3)} {data.unit}</p>
        {data.n !== undefined && <p className="text-gray-500 text-sm">샘플 수 (n): {data.n}</p>}
      </div>
    );
  }
  return null;
};

export default function ChartVisualization({ samples }) {
  const [groupByTreatment, setGroupByTreatment] = useState(true);

  if (samples.length === 0) {
    return (
      <Card className="ios-card ios-blur rounded-3xl ios-shadow-lg border-0">
        <CardContent className="p-8 text-center">
          <p className="text-gray-500 font-medium text-lg">시각화할 데이터가 없습니다</p>
        </CardContent>
      </Card>
    );
  }

  const treatmentGroups = _.groupBy(samples, 'treatment_name');
  const treatmentCount = Object.keys(treatmentGroups).length;

  let chartData;
  if (groupByTreatment) {
    chartData = Object.entries(treatmentGroups)
      .map(([name, groupSamples]) => {
        const values = groupSamples.map(s => s.result);
        const mean = _.mean(values);
        const stdDev = groupSamples.length > 1 
            ? Math.sqrt(_.sumBy(values, val => Math.pow(val - mean, 2)) / (groupSamples.length - 1))
            : 0; 
        const stdErr = groupSamples.length > 1 ? stdDev / Math.sqrt(groupSamples.length) : 0;
        return {
          name,
          value: mean,
          errorY: stdErr,
          unit: groupSamples[0]?.unit,
          n: groupSamples.length,
          rawValues: values
        };
      });
  } else {
    chartData = samples.map(sample => ({
      name: sample.sample_name,
      value: sample.result,
      unit: sample.unit,
      rawValues: [sample.result]
    }));
  }

  // 데이터 수에 따라 막대 너비를 동적으로 계산
  const MAX_BAR_SIZE = 80;
  const MIN_BAR_SIZE = 20;
  const dynamicBarSize = Math.max(
    MIN_BAR_SIZE, 
    Math.min(MAX_BAR_SIZE, 600 / chartData.length)
  );

  return (
    <Card className="ios-card ios-blur rounded-3xl ios-shadow-lg border-0">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-gray-900 text-xl font-semibold">데이터 시각화</CardTitle>
          <div className="flex items-center bg-white/80 rounded-2xl p-2 shadow-lg border border-gray-200/50">
            <div className="flex items-center space-x-3 px-3">
              <Users className="h-4 w-4 text-gray-500" />
              <Label htmlFor="group-switch" className="text-sm font-medium text-gray-600 whitespace-nowrap">처리구별</Label>
              <Switch
                id="group-switch"
                checked={groupByTreatment}
                onCheckedChange={setGroupByTreatment}
                className="data-[state=checked]:bg-blue-600"
              />
              <Label htmlFor="group-switch" className="text-sm font-medium text-gray-600 whitespace-nowrap">샘플별</Label>
              <FlaskConical className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div
           key={groupByTreatment ? "grouped" : "individual"}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.5 }}
        >
          <div className="h-96 p-4 rounded-2xl bg-white/60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  stroke="#374151" 
                  fontSize={16} 
                  fontWeight="600"
                  tick={{ fill: '#374151' }}
                  angle={0}
                  textAnchor="middle"
                  height={60}
                  interval={0}
                />
                <YAxis 
                  domain={[0, 'dataMax']}
                  stroke="#374151" 
                  fontSize={16} 
                  fontWeight="600" 
                  tick={{ fill: '#374151' }}
                  tickFormatter={(value) => value.toFixed(2)}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(142, 142, 147, 0.1)' }}/>
                <Bar dataKey="value" barSize={dynamicBarSize} radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  {groupByTreatment && <ErrorBar dataKey="errorY" width={6} stroke="#374151" strokeWidth={2} />}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        <div className="p-6 rounded-2xl bg-white/80 ios-shadow border border-gray-100/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
            <div>
              <p className="text-gray-500 text-sm font-semibold mb-1">총 샘플 수</p>
              <p className="text-gray-900 font-bold text-2xl">{samples.length}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-semibold mb-1">총 처리구 수</p>
              <p className="text-gray-900 font-bold text-2xl">{treatmentCount}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}