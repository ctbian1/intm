import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function SchoolTable({ schools, onEdit, onDelete }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })

  const handleSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const sortedSchools = [...schools].sort((a, b) => {
    if (!sortConfig.key) return 0

    const valA = a[sortConfig.key]
    const valB = b[sortConfig.key]

    if (valA == null) return 1
    if (valB == null) return -1

    if (typeof valA === "number" || !isNaN(valA)) {
      return sortConfig.direction === "asc"
        ? Number(valA) - Number(valB)
        : Number(valB) - Number(valA)
    } else {
      return sortConfig.direction === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA))
    }
  })

  const renderSortArrow = (key) => {
    if (sortConfig.key !== key) return "⇅"
    return sortConfig.direction === "asc" ? "↑" : "↓"
  }

  return (
    <Card className="shadow-sm border">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("school_name")} className="cursor-pointer">
                School {renderSortArrow("school_name")}
              </TableHead>
              <TableHead onClick={() => handleSort("state")} className="cursor-pointer">
                State {renderSortArrow("state")}
              </TableHead>
              {/* ⬅️ 新增 Program 列 */}
              <TableHead onClick={() => handleSort("program_type")} className="cursor-pointer">
                Program {renderSortArrow("program_type")}
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>

              {/* GPA */}
              <TableHead onClick={() => handleSort("gpa_50")} className="cursor-pointer">GPA 50% {renderSortArrow("gpa_50")}</TableHead>
              <TableHead onClick={() => handleSort("gpa_75")} className="cursor-pointer">GPA 75% {renderSortArrow("gpa_75")}</TableHead>
              <TableHead onClick={() => handleSort("gpa_90")} className="cursor-pointer">GPA 90% {renderSortArrow("gpa_90")}</TableHead>

              {/* MCAT */}
              <TableHead onClick={() => handleSort("mcat_50")} className="cursor-pointer">MCAT 50% {renderSortArrow("mcat_50")}</TableHead>
              <TableHead onClick={() => handleSort("mcat_75")} className="cursor-pointer">MCAT 75% {renderSortArrow("mcat_75")}</TableHead>
              <TableHead onClick={() => handleSort("mcat_90")} className="cursor-pointer">MCAT 90% {renderSortArrow("mcat_90")}</TableHead>

              <TableHead>AP</TableHead>
              <TableHead>Intl</TableHead>
              <TableHead>Intl From</TableHead>

              <TableHead onClick={() => handleSort("tuition")} className="cursor-pointer">
                Tuition {renderSortArrow("tuition")}
              </TableHead>

              <TableHead>Programs</TableHead>
              <TableHead>ED</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedSchools.map((s) => (
              <TableRow key={s.id} className="hover:bg-gray-50">
                <TableCell>{s.school_name}</TableCell>
                <TableCell>{s.state}</TableCell>
                {/* ⬅️ 新增 Program 列 */}
                <TableCell>{s.program_type}</TableCell>
                <TableCell>{s.public_private}</TableCell>
                <TableCell>{s.urban_rural}</TableCell>

                <TableCell>{s.gpa_50}</TableCell>
                <TableCell>{s.gpa_75}</TableCell>
                <TableCell>{s.gpa_90}</TableCell>

                <TableCell>{s.mcat_50}</TableCell>
                <TableCell>{s.mcat_75}</TableCell>
                <TableCell>{s.mcat_90}</TableCell>

                <TableCell>{s.accept_ap ? "Yes" : "No"}</TableCell>
                <TableCell>{s.consider_international ? "Yes" : "No"}</TableCell>
                <TableCell>{s.accepted_international_from || "-"}</TableCell>
                <TableCell>${s.tuition}</TableCell>
                <TableCell>{s.special_programs?.join(", ")}</TableCell>
                <TableCell>{s.early_decision ? "Yes" : "No"}</TableCell>
                <TableCell>{s.notes || "-"}</TableCell>

                <TableCell>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(s)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(s.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
