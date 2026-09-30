const KEY = "lms_db_v2";
const seed = () => ({
  users: [
    { id: "USR-1", name: "Dr. Meera Krishnan", email: "meera@lms.edu", role: "faculty", status: "active" },
    { id: "USR-2", name: "Sanjana Iyer", email: "sanjana@lms.edu", role: "student", status: "active" },
    { id: "USR-3", name: "Rahul Menon", email: "rahul@lms.edu", role: "student", status: "active" }
  ],
  courses: [
    { id: "CRS-1", name: "Full-Stack Web Development", instructorId: "USR-1", status: "active" },
    { id: "CRS-2", name: "Database Systems", instructorId: "USR-1", status: "draft" }
  ],
  subjects: [
    { id: "SUB-1", name: "REST API Design", courseId: "CRS-1", facultyId: "USR-1", credits: 4 },
    { id: "SUB-2", name: "SQL Fundamentals", courseId: "CRS-2", facultyId: "USR-1", credits: 3 }
  ],
  assignments: [
    { id: "ASG-1", title: "Build a CRUD endpoint", subjectId: "SUB-1", studentId: "USR-2", dueDate: "2026-10-10", status: "submitted" }
  ],
  attendance: [
    { id: "ATD-1", studentId: "USR-2", subjectId: "SUB-1", date: "2026-09-28", status: "present" },
    { id: "ATD-2", studentId: "USR-3", subjectId: "SUB-1", date: "2026-09-28", status: "absent" }
  ],
  marks: [
    { id: "MRK-1", studentId: "USR-2", subjectId: "SUB-1", type: "assignment", max: 50, obtained: 42 }
  ],
  quizzes: [
    { id: "QZ-1", title: "REST Basics", subjectId: "SUB-1", duration: 15, status: "published",
      questions: [
        { q: "Which method fully replaces a resource?", options: ["GET", "POST", "PUT"], answer: "PUT" },
        { q: "Which status code means Created?", options: ["200", "201", "404"], answer: "201" }
      ] }
  ],
  results: [
    { id: "QR-1", quizId: "QZ-1", studentId: "USR-3", score: 2, total: 2 }
  ]
});
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || save(seed()); } catch { return save(seed()); } };
const save = (db) => { localStorage.setItem(KEY, JSON.stringify(db)); return db; };
const STATUS = ["active", "inactive", "draft", "published", "submitted", "pending", "present", "absent", "late"];
const opts = (...v) => v;
const R = {
  users: { label: "Users", fields: [
    { n: "name", req: 1 }, { n: "email", req: 1 },
    { n: "role", req: 1, opts: opts("student", "faculty", "admin") },
    { n: "status", req: 1, opts: opts("active", "inactive") }] },
  courses: { label: "Courses", fields: [
    { n: "name", req: 1 }, { n: "instructorId", label: "Instructor", req: 1, ref: "users", role: "faculty" },
    { n: "status", req: 1, opts: opts("active", "draft", "archived") }] },
  subjects: { label: "Subjects", fields: [
    { n: "name", req: 1 }, { n: "courseId", label: "Course", req: 1, ref: "courses" },
    { n: "facultyId", label: "Faculty", req: 1, ref: "users", role: "faculty" }, { n: "credits", type: "number", req: 1 }] },
  assignments: { label: "Assignments", fields: [
    { n: "title", req: 1 }, { n: "subjectId", label: "Subject", req: 1, ref: "subjects" },
    { n: "studentId", label: "Student", req: 1, ref: "users", role: "student" },
    { n: "dueDate", type: "date", req: 1 }, { n: "status", opts: opts("pending", "submitted", "graded", "late") }] },
  attendance: { label: "Attendance", fields: [
    { n: "studentId", label: "Student", req: 1, ref: "users", role: "student" },
    { n: "subjectId", label: "Subject", req: 1, ref: "subjects" }, { n: "date", type: "date", req: 1 },
    { n: "status", req: 1, opts: opts("present", "absent", "late") }] },
  marks: { label: "Marks", fields: [
    { n: "studentId", label: "Student", req: 1, ref: "users", role: "student" },
    { n: "subjectId", label: "Subject", req: 1, ref: "subjects" },
    { n: "type", req: 1, opts: opts("assignment", "quiz", "exam") },
    { n: "max", label: "Max marks", type: "number", req: 1 }, { n: "obtained", type: "number", req: 1 }] },
  quizzes: { label: "Quizzes", fields: [
    { n: "title", req: 1 }, { n: "subjectId", label: "Subject", req: 1, ref: "subjects" },
    { n: "duration", label: "Duration (min)", type: "number", req: 1 },
    { n: "status", opts: opts("draft", "published") },
    { n: "questions", type: "questions", full: 1,
      label: "Questions (one per line:  Question | option1, option2, option3 | answer)" }] },
  results: { label: "Quiz Results", fields: [
    { n: "quizId", label: "Quiz", req: 1, ref: "quizzes" }, { n: "studentId", label: "Student", req: 1, ref: "users", role: "student" },
    { n: "score", type: "number", req: 1 }, { n: "total", type: "number", req: 1 }] }
};
const PREFIX = { users: "USR", courses: "CRS", subjects: "SUB", assignments: "ASG", attendance: "ATD", marks: "MRK", quizzes: "QZ", results: "QR" };
function request(method, url, body = {}) {
  const [, api, name, id] = url.split("/");
  if (api !== "api" || !R[name]) return { status: 404, body: { error: "Unknown route " + url } };
  const db = load(), list = db[name], i = list.findIndex((r) => r.id === id);
  if (method === "GET") {
    if (!id) return { status: 200, body: { count: list.length, results: list } };
    return i < 0 ? { status: 404, body: { error: "Not found" } } : { status: 200, body: list[i] };
  }
  if (method === "POST") {
    const missing = R[name].fields.filter((f) => f.req && (body[f.n] === undefined || body[f.n] === "")).map((f) => f.n);
    if (missing.length) return { status: 400, body: { error: "Missing fields", missing } };
    if (body.id && list.some((r) => r.id === body.id)) return { status: 409, body: { error: "ID already exists" } };
    const rec = { id: body.id || `${PREFIX[name]}-${Date.now().toString(36).toUpperCase()}`, ...body };
    rec.id = body.id || rec.id;
    list.push(rec); save(db);
    return { status: 201, body: rec };
  }
  if (!id) return { status: 400, body: { error: "ID required" } };
  if (i < 0) return { status: 404, body: { error: "Not found" } };
  if (method === "PUT") { list[i] = { ...list[i], ...body, id }; save(db); return { status: 200, body: list[i] }; }
  if (method === "DELETE") { const [gone] = list.splice(i, 1); save(db); return { status: 200, body: { deleted: true, record: gone } }; }
  return { status: 400, body: { error: "Unsupported method " + method } };
}
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const nameOf = (col, id) => { const r = load()[col].find((x) => x.id === id); return r ? (r.name || r.title || r.id) : id; };
const toast = (msg, ok) => { const t = document.createElement("div"); t.className = "toast " + (ok ? "ok" : "err"); t.textContent = msg; $("toast-stack").appendChild(t); setTimeout(() => t.remove(), 3000); };
const label = (f) => f.label || f.n[0].toUpperCase() + f.n.slice(1);
const cell = (f, v) => {
  if (f.type === "questions") return (v || []).length;
  if (f.ref) return esc(nameOf(f.ref, v));
  if (STATUS.includes(v) && f.opts) return `<span class="badge badge-${["active", "published", "present", "submitted", "graded"].includes(v) ? "ok" : ["absent"].includes(v) ? "err" : "warn"}">${esc(v)}</span>`;
  return esc(v ?? "—");
};

let editing = null, current = null;
function crudView(name) {
  current = name;
  const r = R[name], rows = load()[name];
  $("view").innerHTML = `<section class="panel">
    <div class="panel-head"><h3>${r.label}</h3><button class="btn btn-primary" id="addBtn">+ Add</button></div>
    <div class="toolbar"><input type="search" id="search" placeholder="Search…"></div>
    <div class="table-wrap"><table class="data-table"><thead><tr><th>ID</th>${r.fields.map((f) => `<th>${esc(label(f))}</th>`).join("")}<th>Actions</th></tr></thead>
    <tbody id="tbody"></tbody></table></div></section>`;
  const draw = () => {
    const q = $("search").value.toLowerCase();
    const shown = rows.filter((x) => JSON.stringify(x).toLowerCase().includes(q));
    $("tbody").innerHTML = shown.length ? shown.map((x) => `<tr><td>${esc(x.id)}</td>${r.fields.map((f) => `<td>${cell(f, x[f.n])}</td>`).join("")}
      <td class="row-actions"><button class="btn btn-ghost btn-sm" data-edit="${esc(x.id)}">Edit</button>
      <button class="btn btn-danger btn-sm" data-del="${esc(x.id)}">Delete</button></td></tr>`).join("")
      : `<tr class="empty-row"><td colspan="${r.fields.length + 2}">No records.</td></tr>`;
  };
  draw();
  $("search").oninput = draw;
  $("addBtn").onclick = () => openForm(null);
  $("tbody").onclick = (e) => {
    if (e.target.dataset.edit) openForm(e.target.dataset.edit);
    if (e.target.dataset.del && confirm("Delete this record?")) {
      request("DELETE", `/api/${name}/${e.target.dataset.del}`); toast("Deleted", true); crudView(name);
    }
  };
}

const qToText = (qs) => (qs || []).map((x) => `${x.q} | ${x.options.join(", ")} | ${x.answer}`).join("\n");
const textToQ = (t) => t.split("\n").map((l) => l.split("|").map((s) => s.trim())).filter((p) => p[0])
  .map((p) => ({ q: p[0], options: (p[1] || "").split(",").map((s) => s.trim()).filter(Boolean), answer: p[2] || "" }));

function openForm(id) {
  const r = R[current], db = load(), rec = id ? db[current].find((x) => x.id === id) : {};
  editing = id;
  $("modalTitle").textContent = id ? "Edit " + id : "Add " + r.label;
  $("formFields").innerHTML = r.fields.map((f) => {
    let v = rec[f.n] ?? "", input;
    if (f.type === "questions") input = `<textarea name="${f.n}" rows="5">${esc(qToText(rec[f.n]))}</textarea>`;
    else if (f.opts || f.ref) {
      const o = f.opts ? f.opts.map((x) => [x, x]) : db[f.ref].filter((x) => !f.role || x.role === f.role).map((x) => [x.id, `${x.id} — ${x.name || x.title}`]);
      input = `<select name="${f.n}"><option value="">Select…</option>${o.map(([a, b]) => `<option value="${esc(a)}" ${a === v ? "selected" : ""}>${esc(b)}</option>`).join("")}</select>`;
    } else input = `<input type="${f.type || "text"}" name="${f.n}" value="${esc(v)}">`;
    return `<div class="field ${f.full ? "full" : ""}"><label>${esc(label(f))}${f.req ? " *" : ""}</label>${input}</div>`;
  }).join("");
  $("modal").classList.add("open");
}
const closeForm = () => $("modal").classList.remove("open");

$("form").onsubmit = (e) => {
  e.preventDefault();
  const data = {};
  R[current].fields.forEach((f) => {
    const v = $("form").elements[f.n].value;
    data[f.n] = f.type === "number" ? (v === "" ? "" : Number(v)) : f.type === "questions" ? textToQ(v) : v;
  });
  const res = editing ? request("PUT", `/api/${current}/${editing}`, data) : request("POST", `/api/${current}`, data);
  if (res.status >= 300) return toast(res.body.error + (res.body.missing ? ": " + res.body.missing.join(", ") : ""), false);
  toast("Saved", true); closeForm(); crudView(current);
};
$("modalClose").onclick = $("cancelBtn").onclick = closeForm;

// ---------- Dashboard ----------
function dashboardView() {
  const db = load();
  $("view").innerHTML = `<div class="stat-grid">${Object.keys(R).map((k) =>
    `<a class="stat-card" href="#${k}"><div class="label">${R[k].label}</div><div class="value">${db[k].length}</div><div class="delta">/api/${k}</div></a>`).join("")}</div>`;
}

function consoleView() {
  $("view").innerHTML = `<section class="panel">
    <div class="panel-head"><h3>API Console</h3><button class="btn btn-ghost btn-sm" id="resetBtn">Reset sample data</button></div>
    <div class="console-row">
      <select id="method"><option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option></select>
      <input type="text" id="endpoint" class="endpoint-url" value="/api/courses">
    </div>
    <div class="field"><label>Request body (JSON, for POST / PUT)</label><textarea id="body" class="code-area" spellcheck="false"></textarea></div>
    <button class="btn btn-primary" id="send">Send Request</button>
    <div class="response-status" id="status" style="margin-top:14px"></div>
    <pre class="response-json" id="response">// Response appears here</pre>
    <div class="api-ref">${Object.keys(R).map((k) => `<div class="api-line"><span class="method-tag method-GET">CRUD</span><span>/api/${k}[/:id]</span></div>`).join("")}</div>
  </section>`;
  $("send").onclick = () => {
    let body = {};
    try { body = $("body").value.trim() ? JSON.parse($("body").value) : {}; }
    catch { return toast("Invalid JSON body", false); }
    const res = request($("method").value, $("endpoint").value.trim(), body);
    $("status").innerHTML = `<span class="status-pill status-${res.status < 300 ? "2xx" : "4xx"}">${res.status}</span>`;
    $("response").textContent = JSON.stringify(res.body, null, 2);
  };
  $("resetBtn").onclick = () => { save(seed()); toast("Sample data restored", true); };
}

const pages = { dashboard: ["Dashboard", dashboardView], console: ["API Console", consoleView] };
Object.keys(R).forEach((k) => (pages[k] = [R[k].label, () => crudView(k)]));

$("nav").innerHTML = Object.keys(pages).map((k) => `<a href="#${k}" data-k="${k}">${pages[k][0]}</a>`).join("");
function route() {
  const k = pages[location.hash.slice(1)] ? location.hash.slice(1) : "dashboard";
  $("title").textContent = pages[k][0];
  document.querySelectorAll("#nav a").forEach((a) => a.classList.toggle("active", a.dataset.k === k));
  pages[k][1]();
  document.querySelector(".sidebar").classList.remove("open");
}
$("menuBtn").onclick = () => document.querySelector(".sidebar").classList.toggle("open");
window.addEventListener("hashchange", route);
route();
