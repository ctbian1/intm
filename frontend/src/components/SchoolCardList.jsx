import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SchoolCardList({ schools, onEdit, onDelete }) {
  if (!schools?.length) {
    return <div className="text-sm text-gray-500">No schools found.</div>
  }

  return (
    <div className="space-y-4">
      {schools.map((s) => (
        <Card
          key={s.id}
          className="shadow-sm border hover:bg-gray-50 transition-colors"
        >
          {/* 顶部行：左边学校名，右边属性+按钮 */}
          <CardHeader className="flex flex-row justify-between items-center pb-2">
            <CardTitle className="text-lg font-semibold">
              {s.school_name}
            </CardTitle>
            <div className="flex items-center gap-3 flex-wrap justify-end text-sm text-gray-600">
              <span>
                {/* ✅ 在 State 后面新增 ProgramType */}
                {s.state} · {s.program_type} · {s.public_private} · {s.urban_rural}
              </span>
              <Button size="sm" variant="outline" onClick={() => onEdit(s)}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(s.id)}
              >
                Delete
              </Button>
            </div>
          </CardHeader>

          {/* 内容区域：和校名左对齐 */}
          <CardContent className="pt-0">
            {/* GPA / MCAT / Tuition */}
            <div className="flex flex-wrap gap-4 text-sm mb-2">
              <span>
                <strong>GPA:</strong> {s.gpa_50}/{s.gpa_75}/{s.gpa_90}
              </span>
              <span>
                <strong>MCAT:</strong> {s.mcat_50}/{s.mcat_75}/{s.mcat_90}
              </span>
              <span>
                <strong>Tuition:</strong> ${s.tuition}
              </span>
              <span>
                <strong>ED:</strong> {s.early_decision ? "Yes" : "No"}
              </span>
            </div>

            {/* 其他信息 */}
            <div className="flex flex-wrap gap-4 text-sm mb-2">
              <span>
                <strong>AP:</strong> {s.accept_ap ? "Yes" : "No"}
              </span>
              <span>
                <strong>Intl:</strong> {s.consider_international ? "Yes" : "No"}
              </span>
              {s.accepted_international_from && (
                <span>
                  <strong>From:</strong> {s.accepted_international_from}
                </span>
              )}
              {s.special_programs?.length > 0 && (
                <span>
                  <strong>Programs:</strong> {s.special_programs.join(", ")}
                </span>
              )}
            </div>

            {/* Notes */}
            {s.notes && (
              <p className="text-sm text-gray-600 mt-2">
                <strong>Notes:</strong> {s.notes}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
