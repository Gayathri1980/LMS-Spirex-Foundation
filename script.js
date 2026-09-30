const STORAGE_KEY = "studentManagementUsers";

const ADMIN_ACCOUNT = {
  id: "admin",
  name: "Admin User",
  email: "admin@example.com",
  password: "admin123",
  role: "Admin",
  studentId: ""
};

const defaultUsers = [
  {
    id: 2, name: "Student User", email: "student@example.com",
    password: "student123", role: "Student", studentId: "ST-001"
  }
];

const permissions = {
  Admin: [
    "view_dashboard", "view_profile", "edit_profile",
    "manage_users", "manage_students", "assign_roles"
  ],
  Teacher: [
    "view_dashboard", "view_profile", "edit_profile",
    "view_students", "manage_student_records"
  ],
  Staff: [
    "view_dashboard", "view_profile", "edit_profile",
    "view_students"
  ],
  Student: [
    "view_dashboard", "view_profile", "edit_profile"
  ],
  Parent: [
    "view_dashboard", "view_profile", "edit_profile",
    "view_student_progress"
  ]
};

const permissionNames = {
  view_dashboard: "View dashboard",
  view_profile: "View profile",
  edit_profile: "Edit own profile",
  manage_users: "Manage users",
  manage_students: "Manage students",
  assign_roles: "Assign roles",
  view_students: "View students",
  manage_student_records: "Manage student records",
  view_student_progress: "View student progress"
};

let users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultUsers;
// Keep the built-in Admin account separate from normal users.
users = users.filter(user => user.role !== "Admin" && user.email !== ADMIN_ACCOUNT.email);
let currentUser = { ...ADMIN_ACCOUNT };

function saveUsers() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function hasPermission(permission) {
  return currentUser && permissions[currentUser.role].includes(permission);
}

function findUser(id) {
  if (String(id) === String(ADMIN_ACCOUNT.id)) return ADMIN_ACCOUNT;
  return users.find(user => user.id === Number(id));
}

function showView(viewId) {
  document.querySelectorAll(".view").forEach(view => view.classList.add("hidden"));
  document.getElementById("accessDenied").classList.add("hidden");

  const target = document.getElementById(viewId);
  if (!target) return;

  const required = target.dataset.requiredPermission;
  if (required && !hasPermission(required)) {
    document.getElementById("accessDenied").classList.remove("hidden");
    return;
  }

  target.classList.remove("hidden");
  refreshUI();
}

function login(email, password) {
  const normalizedEmail = email.toLowerCase();

  if (normalizedEmail === ADMIN_ACCOUNT.email && password === ADMIN_ACCOUNT.password) {
    currentUser = { ...ADMIN_ACCOUNT };
    sessionStorage.setItem("currentUserId", ADMIN_ACCOUNT.id);
    return true;
  }

  const user = users.find(
    u => u.email.toLowerCase() === normalizedEmail && u.password === password
  );

  if (!user) return false;

  currentUser = user;
  sessionStorage.setItem("currentUserId", user.id);
  return true;
}

function logout() {
  currentUser = null;
  sessionStorage.removeItem("currentUserId");
  document.getElementById("dashboardPage").classList.add("hidden");
  document.getElementById("loginPage").classList.remove("hidden");
  document.getElementById("loginForm").reset();
}

function openDashboard() {
  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("dashboardPage").classList.remove("hidden");
  showView("dashboardView");
}

function refreshUI() {
  if (!currentUser) return;

  document.getElementById("dashboardTitle").textContent =
    currentUser.role + " Dashboard";
  document.getElementById("userBadge").textContent = currentUser.role;
  document.getElementById("welcomeName").textContent = currentUser.name;
  document.getElementById("welcomeText").textContent =
    currentUser.role === "Admin"
      ? "You can manage users, students, roles and profiles."
      : "You can view and update your own profile.";

  document.getElementById("userCount").textContent = users.length;
  document.getElementById("studentCount").textContent =
    users.filter(u => u.role === "Student").length;
  document.getElementById("roleCount").textContent = currentUser.role;

  document.querySelectorAll("[data-permission]").forEach(el => {
    el.classList.toggle("hidden", !hasPermission(el.dataset.permission));
  });

  document.getElementById("permissionList").innerHTML =
    permissions[currentUser.role]
      .map(p => `<li class="permission">${permissionNames[p]}</li>`)
      .join("");

  document.getElementById("profileName").value = currentUser.name;
  document.getElementById("profileEmail").value = currentUser.email;
  document.getElementById("profileStudentId").value = currentUser.studentId || "";
  document.getElementById("profileRole").value = currentUser.role;

  renderUsers();
  renderStudents();
  renderRoleAssignments();
}

function renderUsers() {
  const tbody = document.getElementById("usersTable");
  tbody.innerHTML = users.map(user => `
    <tr>
      <td>${escapeHtml(user.name)}</td>
      <td>${escapeHtml(user.email)}</td>
      <td>${user.role}</td>
      <td>
        <button class="small-btn" onclick="editUser(${user.id})">Edit</button>
        <button class="small-btn small-danger" onclick="deleteUser(${user.id})">Delete</button>
      </td>
    </tr>
  `).join("");
}

function renderStudents() {
  const students = users.filter(u => u.role === "Student");
  document.getElementById("studentsTable").innerHTML = students.map(user => `
    <tr>
      <td>${escapeHtml(user.name)}</td>
      <td>${escapeHtml(user.email)}</td>
      <td>${escapeHtml(user.studentId || "-")}</td>
      <td><button class="small-btn" onclick="editUser(${user.id})">Edit</button></td>
    </tr>
  `).join("");
}

function renderRoleAssignments() {
  document.getElementById("roleAssignmentList").innerHTML = users.map(user => `
    <div class="role-row">
      <div><strong>${escapeHtml(user.name)}</strong><br>
      <span class="muted">${escapeHtml(user.email)}</span></div>
      <select onchange="changeRole(${user.id}, this.value)" ${user.id === currentUser.id ? "disabled" : ""}>
        <option value="Student" ${user.role === "Student" ? "selected" : ""}>Student</option>
        <option value="Teacher" ${user.role === "Teacher" ? "selected" : ""}>Teacher</option>
        <option value="Staff" ${user.role === "Staff" ? "selected" : ""}>Staff</option>
        <option value="Parent" ${user.role === "Parent" ? "selected" : ""}>Parent</option>

      </select>
    </div>
  `).join("");
}

function editUser(id) {
  if (!hasPermission("manage_users")) return alert("Access denied.");
  const user = findUser(id);
  const newName = prompt("Enter new name:", user.name);
  if (newName && newName.trim()) {
    user.name = newName.trim();
    saveUsers();
    if (user.id === currentUser.id) currentUser = user;
    refreshUI();
  }
}

function deleteUser(id) {
  if (!hasPermission("manage_users")) return alert("Access denied.");
  if (id === currentUser.id) return alert("You cannot delete your own active account in this demo.");
  const user = findUser(id);
  if (!user) return;
  if (confirm(`Delete ${user.name}?`)) {
    users = users.filter(u => u.id !== id);
    saveUsers();
    refreshUI();
  }
}

function changeRole(id, role) {
  if (!hasPermission("assign_roles")) return alert("Access denied.");
  const user = findUser(id);
  if (!user || user.id === currentUser.id) return;
  user.role = role;
  saveUsers();
  refreshUI();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[char]));
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  alert("Login is not part of the Role & Permission Development module.");
});

document.querySelectorAll(".nav-tabs button").forEach(button => {
  button.addEventListener("click", () => showView(button.dataset.view));
});

document.getElementById("profileForm").addEventListener("submit", e => {
  e.preventDefault();
  if (!hasPermission("edit_profile")) return;

  currentUser.name = document.getElementById("profileName").value.trim();
  currentUser.studentId = document.getElementById("profileStudentId").value.trim();

  const storedUser = findUser(currentUser.id);
  Object.assign(storedUser, {
    name: currentUser.name,
    studentId: currentUser.studentId
  });

  saveUsers();
  document.getElementById("profileMessage").textContent = "Profile updated successfully.";
  refreshUI();
});

document.getElementById("addUserBtn").addEventListener("click", () => {
  if (!hasPermission("manage_users")) return alert("Access denied.");
  document.getElementById("userModal").classList.remove("hidden");
});

document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("userModal").classList.add("hidden");
});

document.getElementById("addUserForm").addEventListener("submit", e => {
  e.preventDefault();

  const email = document.getElementById("newEmail").value.trim();
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    document.getElementById("userMessage").textContent = "Email already exists.";
    return;
  }

  const newUser = {
    id: Date.now(),
    name: document.getElementById("newName").value.trim(),
    email,
    password: document.getElementById("newPassword").value,
    role: document.getElementById("newRole").value,
    studentId: document.getElementById("newRole").value === "Student"
      ? "ST-" + String(users.length + 1).padStart(3, "0") : ""
  };

  users.push(newUser);
  saveUsers();
  document.getElementById("addUserForm").reset();
  document.getElementById("userModal").classList.add("hidden");
  document.getElementById("userMessage").textContent = "";
  refreshUI();
});

window.editUser = editUser;
window.deleteUser = deleteUser;
window.changeRole = changeRole;
window.showView = showView;



// Login interface removed for the Role & Permission Development demo.
// Start directly on the existing dashboard without changing its interface.
showView("dashboardView");
