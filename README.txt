# Student Management System — Role & Permission Development

This is a beginner-friendly frontend demo using HTML, CSS and JavaScript.

## Features
- Separate built-in Admin account
- Student, Teacher, Staff and Parent roles
- Login and logout
- Admin dashboard
- Role-based dashboard and navigation
- User management
- Student management
- Role assignment
- Permission checking
- Protected dashboard sections
- Profile view/edit
- Unauthorized access handling
- Basic client-side validation
- Session-style login using sessionStorage
- Demo data stored in localStorage
- SpireX Foundation logo and blue/cyan visual theme

## Admin account
- Email: admin@example.com
- Password: admin123

The Admin account is separate from normal users. It is not counted as a normal user, cannot be deleted, and is not available as a role when creating or assigning normal users.

## Other demo account
Student:
- Email: student@example.com
- Password: student123

## How to run
1. Extract the ZIP.
2. Open the extracted project folder in VS Code using File > Open Folder.
3. Make sure index.html, style.css and script.js are visible in the Explorer.
4. Right-click index.html and select Open with Live Server.
5. The browser should open the project through a local address such as http://127.0.0.1:5500/.

## Important security note
This project is a FRONTEND DEMONSTRATION for learning role/permission concepts.
Passwords are stored in browser localStorage in this demo and are NOT secure for a real application.
A production system should use a backend/database, password hashing, secure sessions or properly implemented tokens, server-side authorization, HTTPS, input validation, and other security controls.


Update: Only the login interface was removed. The existing dashboard, controls, permissions, and styling were preserved. The SpireX Foundation logo was added to the left side of the existing dashboard header.
