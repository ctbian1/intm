import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const US_STATES = [
  "All","AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA",
  "ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK",
  "OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"
]

export default function SchoolFilters({ filters, setFilters }) {
  return (
    <div className="flex flex-wrap gap-4 items-end mb-4 p-4 border rounded-md bg-gray-50">

      {/* 搜索框 */}
      <div>
        <label className="block text-sm font-medium mb-1">Search School</label>
        <Input
          placeholder="Type school name..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="w-[250px]"
        />
      </div>

      {/* 州选择器 */}
      <div>
        <label className="block text-sm font-medium mb-1">State</label>
        <Select
          value={filters.state}
          onValueChange={(val) => setFilters({ ...filters, state: val })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All States" />
          </SelectTrigger>
          <SelectContent>
            {US_STATES.map((st) => (
              <SelectItem key={st} value={st}>{st}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Program Type 新增的选择器 */}
      <div>
        <label className="block text-sm font-medium mb-1">Program Type</label>
        <Select
          value={filters.programType || "All"}
          onValueChange={(val) => setFilters({ ...filters, programType: val })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="MD">MD</SelectItem>
            <SelectItem value="DO">DO</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tuition 范围 */}
      <div>
        <label className="block text-sm font-medium mb-1">Tuition Range</label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minTuition}
            onChange={(e) => setFilters({ ...filters, minTuition: e.target.value })}
            className="w-[100px]"
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxTuition}
            onChange={(e) => setFilters({ ...filters, maxTuition: e.target.value })}
            className="w-[100px]"
          />
        </div>
      </div>

      {/* ED 选择器 */}
      <div>
        <label className="block text-sm font-medium mb-1">Early Decision</label>
        <Select
          value={filters.ed}
          onValueChange={(val) => setFilters({ ...filters, ed: val })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 重置按钮 */}
      <div>
        <Button
          variant="outline"
          onClick={() =>
            setFilters({
              search: "",
              state: "All",
              programType: "All",  // ✅ Reset 时也清空
              minTuition: "",
              maxTuition: "",
              ed: "All",
            })
          }
        >
          Reset
        </Button>
      </div>
    </div>
  )
}
