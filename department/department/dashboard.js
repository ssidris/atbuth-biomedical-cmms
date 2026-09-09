const SUPABASE_URL =
  "https://vfnfbhrgmptgleytmeyq.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_O058LKa9owIjewDHfC84Yg_lMVdXD95";

const client = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


// ==========================================
// DASHBOARD ELEMENTS
// ==========================================

const welcomeText =
  document.getElementById("welcomeText");

const departmentName =
  document.getElementById("departmentName");

const equipmentLoading =
  document.getElementById("equipmentLoading");

const equipmentList =
  document.getElementById("equipmentList");

const departmentLogoutBtn =
  document.getElementById(
    "departmentLogoutBtn"
  );


// ==========================================
// LOAD DEPARTMENT DASHBOARD
// ==========================================

async function loadDepartmentDashboard() {

  try {

    // ========================================
    // CHECK SUPABASE SESSION
    // ========================================

    const {
      data: sessionData,
      error: sessionError
    } = await client.auth.getSession();


    if (sessionError) {
      throw sessionError;
    }


    const session =
      sessionData.session;


    if (!session) {

      window.location.href =
        "../index.html";

      return;
    }


    // ========================================
    // GET LOGGED-IN USER
    // ========================================

    const authUser =
      session.user;


    // ========================================
    // GET DEPARTMENT PROFILE
    // ========================================

    const {
      data: departmentUser,
      error: userError
    } =
      await client
        .from("tblUsers")
        .select(
          '"UserID", "Username", "Full name", "UserRole", "Status", "AuthUserID", "DepartmentID", "HospitalID"'
        )
        .eq(
          "AuthUserID",
          authUser.id
        )
        .eq(
          "UserRole",
          "Department"
        )
        .eq(
          "Status",
          "Active"
        )
        .maybeSingle();


    if (userError) {
      throw userError;
    }


    if (!departmentUser) {

      await client.auth.signOut();

      window.location.href =
        "../index.html";

      return;
    }


    // ========================================
    // DISPLAY DEPARTMENT INFORMATION
    // ========================================

    const fullName =
      departmentUser["Full name"];

    const departmentId =
      departmentUser.DepartmentID;
    
alert(
  "DepartmentID: " +
  departmentId
);

    welcomeText.textContent =
      "Welcome, " + fullName;


    // ========================================
    // GET DEPARTMENT NAME
    // ========================================

    const {
      data: department,
      error: departmentError
    } =
      await client
        .from("tblDepartment")
        .select(
          '"DepartmentID", "DepartmentName"'
        )
        .eq(
          "DepartmentID",
          departmentId
        )
        .maybeSingle();


    if (departmentError) {
      throw departmentError;
    }


    if (department) {

      departmentName.textContent =
        department.DepartmentName;

    } else {

      departmentName.textContent =
        "Department not found";

    }


    // ========================================
    // TEMPORARY EQUIPMENT MESSAGE
    // ========================================

    equipmentLoading.textContent =
      "Department identified successfully.";

    equipmentList.innerHTML =
      `
        <p style="color:#64748b;">
          Equipment loading will be connected
          in the next step.
        </p>
      `;


  } catch (error) {

    console.error(
      "Dashboard loading error:",
      error
    );


    departmentName.textContent =
      "Unable to load department";

    equipmentLoading.textContent =
      "Unable to load dashboard information.";


  }

}


// ==========================================
// LOGOUT
// ==========================================

if (departmentLogoutBtn) {

  departmentLogoutBtn.addEventListener(
    "click",
    async function () {

      await client.auth.signOut();

      sessionStorage.removeItem(
        "departmentUser"
      );

      window.location.href =
        "../index.html";

    }
  );

}


// ==========================================
// START DASHBOARD
// ==========================================

loadDepartmentDashboard();
