import { useState, useMemo } from "react"
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export default function SchoolScatterPlot({ schools, filters, setFilters }) {
  const [percentile, setPercentile] = useState("50") // 默认 50%

  // 根据选择的百分位生成数据
  const data = useMemo(() => {
    return schools
      .map((s) => {
        const gpa = Number(s[`gpa_${percentile}`])
        const mcat = Number(s[`mcat_${percentile}`])
        if (!gpa || !mcat) return null
        return { x: gpa, y: mcat, name: s.school_name }
      })
      .filter(Boolean)
  }, [schools, percentile])

  // Reset 按钮功能：清空筛选器
  const handleResetFilters = () => {
    setFilters({
      search: "",
      state: "All",
      programType: "All",
      minTuition: "",
      maxTuition: "",
      ed: "All",
    })
  }

  return (
    <div className="w-full h-[450px] border rounded p-4 overflow-hidden">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold">GPA vs MCAT ({percentile}%)</h2>

        {/* Reset + 百分位选择器 */}
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
          >
            Reset
          </Button>

          <Select value={percentile} onValueChange={setPercentile}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Percentile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="50">50%</SelectItem>
              <SelectItem value="75">75%</SelectItem>
              <SelectItem value="90">90%</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 散点图 */}
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid />
          <XAxis
            type="number"
            dataKey="x"
            name="GPA"
            domain={[3.0, 4.0]}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="MCAT"
            domain={[490, 528]}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            formatter={(value, name) => {
              if (name === "x") return [`${value}`, "GPA"]
              if (name === "y") return [`${value}`, "MCAT"]
              return value
            }}
            labelFormatter={(label, payload) =>
              payload[0] ? payload[0].payload.name : ""
            }
          />
          <Scatter
            name="Schools"
            data={data}
            fill="#2563eb"
            shape="circle"
            onClick={(point) => {
              // 点击点时自动搜索该学校
              setFilters({ ...filters, search: point.name })
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
