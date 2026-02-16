// CareerSelector.jsx — shared career picker for comparison tabs
// Shows selected careers as colored chips, with a dropdown to add/remove.

import { useState, useRef, useEffect } from "react";

const MAX_SELECTED = 6;

export default function CareerSelector({
  allCareers,
  selectedKeys,
  onChange,
  profColors,
  profLabels,
  maxSelected = MAX_SELECTED,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterProf, setFilterProf] = useState("ALL");
  const ref = useRef(null);

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedSet = new Set(selectedKeys);

  const toggle = (key) => {
    if (selectedSet.has(key)) {
      onChange(selectedKeys.filter((k) => k !== key));
    } else if (selectedKeys.length < maxSelected) {
      onChange([...selectedKeys, key]);
    }
  };

  // filter dropdown list
  const filtered = allCareers.filter((c) => {
    if (filterProf !== "ALL" && c.profession !== filterProf) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const profs = Object.keys(profColors);

  return (
    <div ref={ref} style={{ marginBottom: 12, position: "relative" }}>
      {/* selected chips */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        {selectedKeys.map((key) => {
          const c = allCareers.find((x) => x.key === key);
          if (!c) return null;
          return (
            <button
              key={key}
              onClick={() => toggle(key)}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                padding: "5px 10px",
                borderRadius: 20,
                border: `2px solid ${c.color}`,
                cursor: "pointer",
                background: c.color,
                color: "white",
                fontWeight: 600,
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {c.name}
              <span style={{ fontSize: 13, lineHeight: 1 }}>×</span>
            </button>
          );
        })}

        {/* add button */}
        {selectedKeys.length < maxSelected && (
          <button
            onClick={() => setOpen(!open)}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              padding: "5px 14px",
              borderRadius: 20,
              border: "2px dashed #ccc",
              cursor: "pointer",
              background: "white",
              color: "#888",
              fontWeight: 600,
            }}
          >
            + Add Career
          </button>
        )}
      </div>

      {/* dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(360px, 95vw)",
            background: "white",
            borderRadius: 12,
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            border: "1px solid #eee",
            zIndex: 100,
            maxHeight: 360,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* search */}
          <div style={{ padding: "8px 10px 4px" }}>
            <input
              type="text"
              placeholder="Search careers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              style={{
                width: "100%",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid #ddd",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* profession filter */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              padding: "4px 10px 6px",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            {["ALL", ...profs].map((p) => (
              <button
                key={p}
                onClick={() => setFilterProf(p)}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10,
                  padding: "3px 8px",
                  borderRadius: 12,
                  cursor: "pointer",
                  border: `1px solid ${p === "ALL" ? "#999" : profColors[p]}`,
                  background: filterProf === p
                    ? p === "ALL" ? "#555" : profColors[p]
                    : "white",
                  color: filterProf === p
                    ? "white"
                    : p === "ALL" ? "#555" : profColors[p],
                  fontWeight: 600,
                }}
              >
                {p === "ALL" ? "All" : p}
              </button>
            ))}
          </div>

          {/* career list */}
          <div style={{ overflowY: "auto", flex: 1 }}>
            {filtered.map((c) => {
              const sel = selectedSet.has(c.key);
              return (
                <button
                  key={c.key}
                  onClick={() => {
                    toggle(c.key);
                    if (!sel && selectedKeys.length + 1 >= maxSelected) setOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    width: "100%",
                    padding: "7px 12px",
                    border: "none",
                    borderBottom: "1px solid #f5f5f5",
                    background: sel ? `${c.color}10` : "white",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: c.color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 12, fontWeight: sel ? 700 : 400, color: "#333", flex: 1 }}>
                    {c.name}
                  </span>
                  <span style={{ fontSize: 10, color: "#aaa" }}>
                    {c.profession}
                  </span>
                  {sel && <span style={{ fontSize: 13, color: c.color }}>✓</span>}
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div
                style={{
                  padding: "16px",
                  textAlign: "center",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  color: "#aaa",
                }}
              >
                No careers match
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
