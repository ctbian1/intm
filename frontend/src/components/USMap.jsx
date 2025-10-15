import { useState, useRef } from "react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"

// 州全名 → 缩写映射
const stateAbbr = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
}

export default function USMap({ schools, onStateClick }) {
  const [tooltipContent, setTooltipContent] = useState(null)
  const tooltipRef = useRef(null)

  // 统计每个州的学校数
  const stateCounts = schools.reduce((acc, s) => {
    acc[s.state] = (acc[s.state] || 0) + 1
    return acc
  }, {})

  return (
    <div className="relative">
      <ComposableMap
        projection="geoAlbersUsa"
        width={500}
        height={300}
        projectionConfig={{ scale: 600 }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name = geo.properties.name
              const abbr = stateAbbr[name]
              const count = abbr ? stateCounts[abbr] || 0 : 0
              const hasSchool = count > 0

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={hasSchool ? "#60a5fa" : "#e5e7eb"}
                  stroke="#374151"
                  strokeWidth={0.5}
                  onMouseEnter={(evt) => {
                    setTooltipContent(
                      `${abbr || name}: ${count} school${count !== 1 ? "s" : ""}`
                    )
                    const tooltipEl = tooltipRef.current
                    if (tooltipEl) {
                      tooltipEl.style.left = evt.clientX + 10 + "px"
                      tooltipEl.style.top = evt.clientY - 30 + "px"
                    }
                  }}
                  onMouseMove={(evt) => {
                    const tooltipEl = tooltipRef.current
                    if (tooltipEl) {
                      tooltipEl.style.left = evt.clientX + 10 + "px"
                      tooltipEl.style.top = evt.clientY - 30 + "px"
                    }
                  }}
                  onMouseLeave={() => setTooltipContent(null)}
                  onClick={() =>
                    hasSchool && abbr && onStateClick && onStateClick(abbr)
                  }
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#3b82f6", outline: "none" },
                    pressed: { fill: "#1d4ed8", outline: "none" },
                  }}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Tooltip —— 永远浮在页面上，不会撑开布局 */}
      <div
        ref={tooltipRef}
        className="fixed bg-white border px-2 py-1 text-xs shadow rounded pointer-events-none z-50"
        style={{
          visibility: tooltipContent ? "visible" : "hidden",
          opacity: tooltipContent ? 1 : 0,
          transition: "opacity 0.1s ease",
        }}
      >
        {tooltipContent}
      </div>

      {/* 图例 */}
      <div className="absolute bottom-2 right-2 bg-white border rounded px-2 py-1 text-xs shadow">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 bg-blue-400"></span> Has Schools
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 bg-gray-200"></span> No Schools
        </div>
      </div>
    </div>
  )
}
