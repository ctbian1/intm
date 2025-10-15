import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
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
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA",
  "ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK",
  "OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"
]

export default function SchoolForm({ onSubmit }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    school_name: "",
    state: "",
    program_type: "", // ⬅️ 新增字段
    public_private: "",
    urban_rural: "",
    gpa_50: "",
    gpa_75: "",
    gpa_90: "",
    mcat_50: "",
    mcat_75: "",
    mcat_90: "",
    accept_ap: null,
    consider_international: null,
    accepted_international_from: "",
    tuition: "",
    special_programs: "",
    early_decision: null,
    notes: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // ✅ 必填校验
    if (!form.school_name || !form.state || !form.program_type || !form.public_private || !form.urban_rural) {
      alert("School Name, State, Program, Type, and Location are required.")
      return
    }
    if (form.accept_ap === null || form.consider_international === null || form.early_decision === null) {
      alert("AP, International, and ED must all be selected (Yes/No).")
      return
    }

    onSubmit(form)
    setOpen(false)
  }

  return (
    <div className="w-full max-w-6xl mb-4">
      <Button onClick={() => setOpen(!open)} className="mb-2">
        {open ? "Hide Form" : "Add / Edit School"}
      </Button>

      {open && (
        <Card className="shadow-sm border">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">

              {/* School Name 必填 */}
              <Input
                placeholder="School Name *"
                name="school_name"
                value={form.school_name}
                onChange={handleChange}
                className="w-[300px]"
              />

              {/* State 必填 */}
              <Select value={form.state} onValueChange={(val) => setForm({ ...form, state: val })}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="State *" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((st) => (
                    <SelectItem key={st} value={st}>{st}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* ⬅️ 新增 Program 必填 */}
              <Select value={form.program_type} onValueChange={(val) => setForm({ ...form, program_type: val })}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Program *" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MD">MD</SelectItem>
                  <SelectItem value="DO">DO</SelectItem>
                </SelectContent>
              </Select>

              {/* Public/Private 必填 */}
              <Select value={form.public_private} onValueChange={(val) => setForm({ ...form, public_private: val })}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type *" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Public">Public</SelectItem>
                  <SelectItem value="Private">Private</SelectItem>
                </SelectContent>
              </Select>

              {/* Urban/Rural 必填 */}
              <Select value={form.urban_rural} onValueChange={(val) => setForm({ ...form, urban_rural: val })}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Location *" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Urban">Urban</SelectItem>
                  <SelectItem value="Rural">Rural</SelectItem>
                </SelectContent>
              </Select>

              {/* Boolean: Accept AP (必填) */}
              <Select value={form.accept_ap === null ? "" : (form.accept_ap ? "Yes" : "No")}
                onValueChange={(val) => setForm({ ...form, accept_ap: val === "Yes" })}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Accept AP? *" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>

              {/* Boolean: Consider Intl (必填) */}
              <Select value={form.consider_international === null ? "" : (form.consider_international ? "Yes" : "No")}
                onValueChange={(val) => setForm({ ...form, consider_international: val === "Yes" })}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Consider Intl? *" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>

              {/* Boolean: Early Decision (必填) */}
              <Select value={form.early_decision === null ? "" : (form.early_decision ? "Yes" : "No")}
                onValueChange={(val) => setForm({ ...form, early_decision: val === "Yes" })}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="ED? *" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>

              {/* GPA */}
              <Input type="number" step="0.01" min="2.0" max="4.0" placeholder="GPA 50%" name="gpa_50" value={form.gpa_50} onChange={handleChange} className="w-[120px]" />
              <Input type="number" step="0.01" min="2.0" max="4.0" placeholder="GPA 75%" name="gpa_75" value={form.gpa_75} onChange={handleChange} className="w-[120px]" />
              <Input type="number" step="0.01" min="2.0" max="4.0" placeholder="GPA 90%" name="gpa_90" value={form.gpa_90} onChange={handleChange} className="w-[120px]" />

              {/* MCAT */}
              <Input type="number" min="490" max="528" placeholder="MCAT 50%" name="mcat_50" value={form.mcat_50} onChange={handleChange} className="w-[140px]" />
              <Input type="number" min="490" max="528" placeholder="MCAT 75%" name="mcat_75" value={form.mcat_75} onChange={handleChange} className="w-[140px]" />
              <Input type="number" min="490" max="528" placeholder="MCAT 90%" name="mcat_90" value={form.mcat_90} onChange={handleChange} className="w-[140px]" />

              {/* Tuition */}
              <Input type="number" placeholder="Tuition" name="tuition" value={form.tuition} onChange={handleChange} className="w-[180px]" />

              {/* Special Programs */}
              <Input placeholder="Programs (comma separated)" name="special_programs" value={form.special_programs} onChange={handleChange} className="w-[300px]" />

              {/* Intl From */}
              <Input placeholder="Accepted Intl From" name="accepted_international_from" value={form.accepted_international_from} onChange={handleChange} className="w-[250px]" />

              {/* Notes */}
              <Input placeholder="Notes" name="notes" value={form.notes} onChange={handleChange} className="w-full" />

              <div className="w-full flex justify-end mt-4">
                <Button type="submit">Save</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
