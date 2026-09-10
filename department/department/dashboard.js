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
// LOAD DEPARTMENT EQUIPMENT
// ========================================

const {
  data: equipment,
  error: equipmentError
} =
  await client
    .from("tblEquipment")
    .select(
      "EquipmentID, BMENumber, EquipmentName, Manufacturer, Model, SerialNumber, Location, StatusID"
    )
    .eq(
      "DepartmentID",
      departmentId
    )
    .eq(
      "HospitalID",
      departmentUser.HospitalID
    )
    .order(
  "BMENumber",
  {
    ascending: true
  }
);


if (equipmentError) {
  throw equipmentError;
}


// ========================================
// DISPLAY EQUIPMENT
// ========================================

if (!equipment || equipment.length === 0) {

  equipmentLoading.textContent =
    "No equipment assigned to this department.";

  equipmentList.innerHTML =
    `
      <p style="color:#64748b;">
        No biomedical equipment was found
        for this department.
      </p>
    `;

} else {

  equipmentLoading.textContent =
    equipment.length +
    " equipment item(s) found.";

  equipmentList.innerHTML =
    equipment.map(function(item) {

      return `
        <div
          style="
            background:#f8fafc;
            border:1px solid #e2e8f0;
            border-radius:8px;
            padding:15px;
            margin-bottom:10px;
          "
        >

          <strong>
            ${item.BMENumber || "No BME Number"}
          </strong>

          <div>
            ${item.EquipmentName || "Unnamed Equipment"}
          </div>

          <div style="color:#64748b;">
            Manufacturer:
            ${item.Manufacturer || "N/A"}
          </div>

          <div style="color:#64748b;">
            Model:
            ${item.Model || "N/A"}
          </div>

          <div style="color:#64748b;">
            Serial Number:
            ${item.SerialNumber || "N/A"}
          </div>

          <div style="color:#64748b;">
            Location:
            ${item.Location || "N/A"}
          </div>

        </div>
      `;

    }).join("");

}
    


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
