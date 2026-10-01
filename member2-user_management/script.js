const storageKey="spirexFoundationUsersV2";

let users=JSON.parse(localStorage.getItem(storageKey))||[
{
id:1,
learnerId:"SPX2026001",
name:"Ananya R",
email:"ananya.r@spirexfoundation.org",
program:"Frontend Development",
department:"Technology",
status:"active",
lastActive:"Today, 10:42 AM",
joined:"05 Sep 2026"
},
{
id:2,
learnerId:"SPX2026002",
name:"Rahul K",
email:"rahul.k@spirexfoundation.org",
program:"UI/UX Design",
department:"Design",
status:"active",
lastActive:"Today, 09:18 AM",
joined:"08 Sep 2026"
},
{
id:3,
learnerId:"SPX2026003",
name:"Meera S",
email:"meera.s@spirexfoundation.org",
program:"Full Stack Development",
department:"Technology",
status:"active",
lastActive:"Yesterday",
joined:"11 Sep 2026"
},
{
id:4,
learnerId:"SPX2026004",
name:"Vishal M",
email:"vishal.m@spirexfoundation.org",
program:"Data Analytics",
department:"Data",
status:"inactive",
lastActive:"22 Sep 2026",
joined:"15 Sep 2026"
},
{
id:5,
learnerId:"SPX2026005",
name:"Keerthana P",
email:"keerthana.p@spirexfoundation.org",
program:"Frontend Development",
department:"Technology",
status:"active",
lastActive:"Today, 08:35 AM",
joined:"18 Sep 2026"
}
];

const pageData={
dashboard:[
"Dashboard",
"Overview of the SpireX Foundation learning platform."
],
learning:[
"Learning Programs",
"Manage learning programs available on the LMS."
],
users:[
"User Management",
"Manage learners, interns and platform accounts."
],
roles:[
"Roles & Access",
"View system access roles and permission management."
],
profile:[
"My Profile",
"View your administrator account information."
],
settings:[
"Settings",
"Configure your LMS preferences."
]
};

document.querySelectorAll("nav a").forEach(link=>{

link.addEventListener("click",function(e){

e.preventDefault();

const page=this.dataset.page;

document.querySelectorAll(".page").forEach(section=>{
section.classList.add("hidden");
});

document.getElementById(page).classList.remove("hidden");

document.querySelectorAll("nav a").forEach(item=>{
item.classList.remove("active");
});

this.classList.add("active");

document.getElementById("pageTitle").textContent=pageData[page][0];

document.getElementById("pageSubtitle").textContent=pageData[page][1];

if(page==="dashboard"){
updateDashboard();
}

});

});

function saveUsers(){

localStorage.setItem(
storageKey,
JSON.stringify(users)
);

}

function displayUsers(){

const table=document.getElementById("userTable");

const search=document
.getElementById("searchInput")
.value
.toLowerCase()
.trim();

const status=document.getElementById("statusFilter").value;

const program=document.getElementById("programFilter").value;

const filtered=users.filter(user=>{

const searchMatch=
user.name.toLowerCase().includes(search)||
user.email.toLowerCase().includes(search)||
user.learnerId.toLowerCase().includes(search);

const statusMatch=
status==="all"||
user.status===status;

const programMatch=
program==="all"||
user.program===program;

return searchMatch&&statusMatch&&programMatch;

});

table.innerHTML="";

if(filtered.length===0){

table.innerHTML=`
<tr>
<td colspan="7" style="text-align:center;padding:30px">
No matching users found
</td>
</tr>
`;

updateStats();

return;

}

filtered.forEach(user=>{

table.innerHTML+=`

<tr>

<td>

<div class="user-name">${user.name}</div>

<div class="user-id">${user.learnerId}</div>

<div class="user-email">${user.email}</div>

</td>

<td>${user.program}</td>

<td>${user.department}</td>

<td>

<span class="status ${user.status}">

${user.status==="active"?"Active":"Inactive"}

</span>

</td>

<td>${user.lastActive}</td>

<td>${user.joined}</td>

<td>

<button
class="action-btn edit"
onclick="editUser(${user.id})">
Edit
</button>

<button
class="action-btn toggle"
onclick="toggleStatus(${user.id})">
${user.status==="active"?"Deactivate":"Activate"}
</button>

<button
class="action-btn delete"
onclick="deleteUser(${user.id})">
Delete
</button>

</td>

</tr>

`;

});

updateStats();

}

function updateStats(){

const activeUsers=users.filter(
user=>user.status==="active"
).length;

const inactiveUsers=users.filter(
user=>user.status==="inactive"
).length;

document.getElementById("totalUsers").textContent=users.length;

document.getElementById("activeUsers").textContent=activeUsers;

document.getElementById("inactiveUsers").textContent=inactiveUsers;

document.getElementById("recentUsers").textContent=
Math.min(users.length,30);

updateDashboard();

}

function updateDashboard(){

const total=document.getElementById("dashboardTotal");

const active=document.getElementById("dashboardActive");

const newUsers=document.getElementById("dashboardNew");

if(total){
total.textContent=users.length;
}

if(active){
active.textContent=
users.filter(
user=>user.status==="active"
).length;
}

if(newUsers){
newUsers.textContent=
Math.min(users.length,30);
}

}

function openModal(){

document.getElementById("userModal").classList.add("show");

document.getElementById("modalTitle").textContent="Add User";

document.getElementById("userForm").reset();

document.getElementById("editId").value="";

}

function closeModal(){

document
.getElementById("userModal")
.classList
.remove("show");

}

document
.getElementById("userForm")
.addEventListener(
"submit",
function(e){

e.preventDefault();

const editId=
document.getElementById("editId").value;

const learnerId=
document.getElementById("learnerId").value.trim();

const name=
document.getElementById("name").value.trim();

const email=
document.getElementById("email").value.trim();

const program=
document.getElementById("program").value;

const department=
document.getElementById("department").value;

if(editId){

const user=users.find(
item=>item.id==editId
);

user.learnerId=learnerId;

user.name=name;

user.email=email;

user.program=program;

user.department=department;

}else{

users.push({

id:Date.now(),

learnerId:learnerId,

name:name,

email:email,

program:program,

department:department,

status:"active",

lastActive:"Just now",

joined:new Date()
.toLocaleDateString(
"en-GB",
{
day:"2-digit",
month:"short",
year:"numeric"
}
)

});

}

saveUsers();

displayUsers();

closeModal();

}
);

function editUser(id){

const user=users.find(
item=>item.id===id
);

if(!user){
return;
}

document.getElementById("modalTitle").textContent="Edit User";

document.getElementById("editId").value=user.id;

document.getElementById("learnerId").value=user.learnerId;

document.getElementById("name").value=user.name;

document.getElementById("email").value=user.email;

document.getElementById("program").value=user.program;

document.getElementById("department").value=user.department;

document.getElementById("userModal").classList.add("show");

}

function deleteUser(id){

const user=users.find(
item=>item.id===id
);

if(!user){
return;
}

const confirmDelete=confirm(
"Are you sure you want to remove "+user.name+" from the user directory?"
);

if(confirmDelete){

users=users.filter(
item=>item.id!==id
);

saveUsers();

displayUsers();

}

}

function toggleStatus(id){

const user=users.find(
item=>item.id===id
);

if(!user){
return;
}

if(user.status==="active"){

user.status="inactive";

}else{

user.status="active";

user.lastActive="Just now";

}

saveUsers();

displayUsers();

}

displayUsers();
