document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     PAGE NAVIGATION
  ========================= */

  const navItems = document.querySelectorAll(".nav-item");
  const pages = document.querySelectorAll(".page");
  const pageTitle = document.getElementById("pageTitle");

  function showPage(pageName) {

    pages.forEach(page => {
      page.classList.remove("active-page");
    });

    navItems.forEach(item => {
      item.classList.remove("active");
    });

    const selectedPage = document.getElementById(pageName);
    const selectedNav = document.querySelector(
      `.nav-item[data-page="${pageName}"]`
    );

    if (selectedPage) {
      selectedPage.classList.add("active-page");
    }

    if (selectedNav) {
      selectedNav.classList.add("active");
    }

    if (pageTitle) {
      pageTitle.textContent =
        pageName === "profile" ? "My Profile" : "Dashboard";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }


  navItems.forEach(item => {

    item.addEventListener("click", () => {

      const pageName = item.dataset.page;

      if (pageName) {
        showPage(pageName);
      }

    });

  });


  /* =========================
     PROFILE QUICK ACTION
  ========================= */

  document.querySelectorAll(
    '.quick-btn[data-page="profile"]'
  ).forEach(button => {

    button.addEventListener("click", () => {
      showPage("profile");
    });

  });


  /* =========================
     PROFILE EDIT
  ========================= */

  const editBtn = document.getElementById("editBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const saveBtn = document.getElementById("saveBtn");
  const profileForm = document.getElementById("profileForm");

  const inputs = profileForm
    ? profileForm.querySelectorAll("input")
    : [];


  function setEditing(enabled) {

    inputs.forEach(input => {
      input.disabled = !enabled;
    });

    if (editBtn) {
      editBtn.hidden = enabled;
    }

    if (cancelBtn) {
      cancelBtn.hidden = !enabled;
    }

    if (saveBtn) {
      saveBtn.hidden = !enabled;
    }

  }


  if (editBtn) {

    editBtn.addEventListener("click", () => {
      setEditing(true);
    });

  }


  if (cancelBtn) {

    cancelBtn.addEventListener("click", () => {

      inputs.forEach(input => {
        input.value = input.defaultValue;
      });

      setEditing(false);

    });

  }


  if (profileForm) {

    profileForm.addEventListener("submit", event => {

      event.preventDefault();

      inputs.forEach(input => {
        input.defaultValue = input.value;
      });

      setEditing(false);

      alert("Profile changes saved successfully!");

    });

  }


  /* =========================
     OTHER BUTTONS
  ========================= */

  const continueBtn = document.getElementById("continueBtn");
  const learningBtn = document.getElementById("learningBtn");
  const certificateBtn = document.getElementById("certificateBtn");


  if (continueBtn) {

    continueBtn.addEventListener("click", () => {
      alert("Learning module opened!");
    });

  }


  if (learningBtn) {

    learningBtn.addEventListener("click", () => {
      alert("Your learning courses are shown on the dashboard.");
    });

  }


  if (certificateBtn) {

    certificateBtn.addEventListener("click", () => {
      alert("Certificates section is coming soon.");
    });

  }


  /* =========================
     INITIAL STATE
  ========================= */

  showPage("dashboard");

});
