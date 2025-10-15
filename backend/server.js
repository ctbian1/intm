import express from "express";
import cors from "cors";
import { Pool } from "pg";

const app = express();
app.use(cors());
app.use(express.json());

// ⚠️ 数据库配置
const pool = new Pool({
  user: "school_user",
  host: "localhost",
  database: "school_db",
  password: "Bbctbctbct2",
  port: 5432,
});

// =============== 工具函数 ===============
function normalize(value) {
  return value === "" ? null : value;
}

function normalizeArray(value) {
  if (!value) return null;

  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    if (value.trim() === "") return null;
    return value.split(",").map((v) => v.trim()).filter(Boolean);
  }

  return [String(value).trim()];
}

// =============== 路由部分 ===============

// 获取所有学校
app.get("/schools", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM schools ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// 添加新学校
app.post("/schools", async (req, res) => {
  try {
    const {
      school_name, state, public_private, urban_rural, program_type,
      gpa_50, gpa_75, gpa_90,
      mcat_50, mcat_75, mcat_90,
      accept_ap, consider_international, accepted_international_from,
      tuition, special_programs, early_decision, notes,
    } = req.body;

    const query = `
      INSERT INTO schools 
      (school_name, state, public_private, urban_rural, program_type,
       gpa_50, gpa_75, gpa_90,
       mcat_50, mcat_75, mcat_90,
       accept_ap, consider_international, accepted_international_from,
       tuition, special_programs, early_decision, notes)
      VALUES
      ($1,$2,$3,$4,$5,
       $6,$7,$8,
       $9,$10,$11,
       $12,$13,$14,
       $15,$16,$17,$18)
      RETURNING *;
    `;

    const values = [
      school_name, state, public_private, urban_rural, program_type,
      normalize(gpa_50), normalize(gpa_75), normalize(gpa_90),
      normalize(mcat_50), normalize(mcat_75), normalize(mcat_90),
      accept_ap, consider_international, accepted_international_from,
      normalize(tuition), normalizeArray(special_programs), early_decision, notes,
    ];

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error in POST /schools:", err);
    res.status(500).send("Server error");
  }
});

// 更新学校
app.put("/schools/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      school_name, state, public_private, urban_rural, program_type,
      gpa_50, gpa_75, gpa_90,
      mcat_50, mcat_75, mcat_90,
      accept_ap, consider_international, accepted_international_from,
      tuition, special_programs, early_decision, notes,
    } = req.body;

    const query = `
      UPDATE schools SET
        school_name=$1, state=$2, public_private=$3, urban_rural=$4, program_type=$5,
        gpa_50=$6, gpa_75=$7, gpa_90=$8,
        mcat_50=$9, mcat_75=$10, mcat_90=$11,
        accept_ap=$12, consider_international=$13, accepted_international_from=$14,
        tuition=$15, special_programs=$16, early_decision=$17, notes=$18
      WHERE id=$19
      RETURNING *;
    `;

    const values = [
      school_name, state, public_private, urban_rural, program_type,
      normalize(gpa_50), normalize(gpa_75), normalize(gpa_90),
      normalize(mcat_50), normalize(mcat_75), normalize(mcat_90),
      accept_ap, consider_international, accepted_international_from,
      normalize(tuition), normalizeArray(special_programs), early_decision, notes,
      id,
    ];

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error in PUT /schools/:id:", err);
    res.status(500).send("Server error");
  }
});

// 删除学校
app.delete("/schools/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM schools WHERE id=$1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error in DELETE /schools/:id:", err);
    res.status(500).send("Server error");
  }
});

// =============== 启动服务器 ===============
app.listen(5000, () =>
  console.log("✅ Backend running on http://localhost:5000")
);
