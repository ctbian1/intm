import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

import SchoolForm from "../components/SchoolForm"
import SchoolEditDialog from "../components/SchoolEditDialog"
import SchoolFilters from "../components/SchoolFilters"
import SchoolTable from "../components/SchoolTable"
import SchoolCardList from "../components/SchoolCardList"
import USMap from "../components/USMap"
import SchoolScatterPlot from "../components/SchoolScatterPlot"

export default function HomePage() {
  const [schools, setSchools] = useState([])
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [editOpen, setEditOpen] = useState(false)

  // ✅ 新增 programType: "All"
  const [filters, setFilters] = useState({
    search: "",
    state: "All",
    programType: "All",   // 新增
    minTuition: "",
    maxTuition: "",
    ed: "All",
  })

  const [view, setView] = useState("table") // "table" | "card"

  useEffect(() => {
    fetch("/schools")
      .then((res) => res.json())
      .then((data) => setSchools(data))
  }, [])

  // 添加
  const handleAddSchool = async (school) => {
    const res = await fetch("/schools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(school),
    })
    const newSchool = await res.json()
    setSchools((prev) => [...prev, newSchool])
  }

  // 编辑
  const handleEditSchool = async (updatedSchool) => {
    const res = await fetch(`/schools/${updatedSchool.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedSchool),
    })
    const saved = await res.json()
    setSchools((prev) => prev.map((s) => (s.id === saved.id ? saved : s)))
  }

  // 删除
  const handleDeleteSchool = async (id) => {
    await fetch(`/schools/${id}`, { method: "DELETE" })
    setSchools((prev) => prev.filter((s) => s.id !== id))
  }

  // 过滤
  const filteredSchools = schools.filter((s) => {
    // 搜索
    if (filters.search && !s.school_name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    // 州
    if (filters.state !== "All" && s.state !== filters.state) {
      return false
    }
    // ✅ Program Type 筛选
    if (filters.programType !== "All" && s.program_type !== filters.programType) {
      return false
    }
    // 学费范围
    if (filters.minTuition && Number(s.tuition) < Number(filters.minTuition)) {
      return false
    }
    if (filters.maxTuition && Number(s.tuition) > Number(filters.maxTuition)) {
      return false
    }
    // 提前录取
    if (filters.ed === "Yes" && !s.early_decision) return false
    if (filters.ed === "No" && s.early_decision) return false
    return true
  })

  return (
    <div className="mx-auto w-full max-w-[1280px] px-2 md:px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">
        US Medical School List for International Applicants
      </h1>

      {/* Add School Form —— 不再外包 Card */}
      <SchoolForm onSubmit={handleAddSchool} />

      {/* 筛选器 */}
      <SchoolFilters filters={filters} setFilters={setFilters} />

      {/* 视图切换 */}
      <div className="flex justify-end mb-3 gap-2">
        <Button
          variant={view === "table" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("table")}
        >
          Table View
        </Button>
        <Button
          variant={view === "card" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("card")}
        >
          Card View
        </Button>
      </div>

      {/* 内容视图 */}
      {view === "table" ? (
        <SchoolTable
          schools={filteredSchools}
          onEdit={(school) => {
            setSelectedSchool(school)
            setEditOpen(true)
          }}
          onDelete={handleDeleteSchool}
        />
      ) : (
        <SchoolCardList
          schools={filteredSchools}
          onEdit={(school) => {
            setSelectedSchool(school)
            setEditOpen(true)
          }}
          onDelete={handleDeleteSchool}
        />
      )}

      {/* 编辑对话框 */}
      <SchoolEditDialog
        open={editOpen}
        school={selectedSchool}
        onClose={() => setEditOpen(false)}
        onSave={handleEditSchool}
      />

      {/* 🚀 底部功能区 */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 左边：美国地图 */}
        <USMap
          schools={schools}
          onStateClick={(stateAbbr) =>
            setFilters((f) => ({ ...f, state: stateAbbr }))
          }
        />

        {/* 右边：GPA vs MCAT 散点图 */}
        <SchoolScatterPlot
          schools={schools}
          filters={filters}
          setFilters={setFilters}
        />
      </div>
    </div>
  )
}
