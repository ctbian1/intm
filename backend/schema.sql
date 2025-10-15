-- 删除旧表（如果存在）
DROP TABLE IF EXISTS schools;

-- 创建 schools 表
CREATE TABLE schools (
    id SERIAL PRIMARY KEY,
    school_name VARCHAR(255) NOT NULL,
    state VARCHAR(50) NOT NULL,
    public_private VARCHAR(20) CHECK (public_private IN ('Public', 'Private')) NOT NULL,
    urban_rural VARCHAR(20) CHECK (urban_rural IN ('Urban', 'Rural')) NOT NULL,

    program_type VARCHAR(10) CHECK (program_type IN ('MD', 'DO')) NOT NULL,  -- 新增: 必填 MD 或 DO

    gpa_50 DECIMAL(3,2),
    gpa_75 DECIMAL(3,2),
    gpa_90 DECIMAL(3,2),

    mcat_50 INT,
    mcat_75 INT,
    mcat_90 INT,

    accept_ap BOOLEAN,
    consider_international BOOLEAN,
    accepted_international_from TEXT,

    tuition INT,

    special_programs TEXT[],

    early_decision BOOLEAN,

    notes TEXT
);

-- 插入示例数据
INSERT INTO schools 
(school_name, state, public_private, urban_rural, program_type,
 gpa_50, gpa_75, gpa_90, 
 mcat_50, mcat_75, mcat_90, 
 accept_ap, consider_international, accepted_international_from, 
 tuition, special_programs, early_decision, notes)
VALUES
('Harvard Medical School', 'MA', 'Private', 'Urban', 'MD',
 3.80, 3.90, 4.00,
 517, 520, 523,
 true, true, '2024 Canada, UK',
 65000, ARRAY['MD/PHD','MD/MPH'], false, 'Top-ranked MD program'),

('Lake Erie College of Osteopathic Medicine', 'PA', 'Private', 'Urban', 'DO',
 3.50, 3.65, 3.80,
 502, 506, 510,
 false, false, NULL,
 35000, ARRAY['DO/MPH'], true, 'Largest DO school in the US');
