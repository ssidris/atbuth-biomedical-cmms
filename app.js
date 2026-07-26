// ==========================================
// ATBUTH BIOMEDICAL CMMS
// COMPLETE APP.JS
// ==========================================

// ==========================================
// SUPABASE CONFIGURATION
// ==========================================

const SUPABASE_URL =
  "https://vfnfbhrgmptgleytmeyq.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_O058LKa9owIjewDHfC84Yg_lMVdXD95";

const client = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


// ==========================================
// PAGE ELEMENTS
// ==========================================

const loginView =
  document.getElementById("loginView");

const appView =
  document.getElementById("appView");

const loginForm =
  document.getElementById("loginForm");

const loginMessage =
  document.getElementById("loginMessage");

const logoutBtn =
  document.getElementById("logoutBtn");

const welcomeText =
  document.getElementById("welcomeText");

const maintenanceForm =
  document.getElementById("maintenanceForm");

const maintenanceMessage =
  document.getElementById("maintenanceMessage");

const equipmentSelect =
  document.getElementById("equipmentId");

const departmentInput =
  document.getElementById("departmentName");


// ==========================================
// GENERAL LOOKUP FUNCTION
// ==========================================

async function loadLookup(
  table,
  valueField,
  labelField,
  selectId,
  placeholder,
  formatter
) {

  const select =
    document.getElementById(selectId);

  if (!select) {
    console.error(
      "Dropdown not found:",
      selectId
    );
    return;
  }

  select.innerHTML =
    `<option value="">${placeholder}</option>`;


  const {
    data,
    error
  } = await client
    .from(table)
    .select("*")
    .order(labelField, {
      ascending: true
    });


  if (error) {

    console.error(
      `Error loading ${table}:`,
      error
    );

    throw error;

  }


  for (const row of data || []) {

    const option =
      document.createElement("option");

    option.value =
      row[valueField];

    option.textContent =
      formatter
        ? formatter(row)
        : row[labelField];

    select.appendChild(option);

  }

}


// ==========================================
// LOAD MAINTENANCE REPORT FORM DATA
// ==========================================

async function loadFormData() {

  // ----------------------------------------
  // EQUIPMENT
  // ----------------------------------------

  await loadLookup(

    "tblEquipment",

    "EquipmentID",

    "EquipmentName",

    "equipmentId",

    "Select equipment",

    row => {

      return `${row.EquipmentName}${
        row.BMENumber
          ? " — " + row.BMENumber
          : ""
      }`;

    }

  );


  // ----------------------------------------
  // ENGINEERS
  // ----------------------------------------

  await loadLookup(

    "tblEngineers",

    "EngineerID",

    "FirstName",

    "engineerId",

    "Select engineer",

    row => {

      return `${row.FirstName || ""} ${
        row.LastName || ""
      }`.trim();

    }

  );


  // ----------------------------------------
  // MAINTENANCE TYPE
  // ----------------------------------------

  await loadLookup(

    "tblMaintenanceType",

    "MaintenanceTypeID",

    "MaintenanceType",

    "maintenanceTypeId",

    "Select maintenance type"

  );


  // ----------------------------------------
  // PART REQUESTED STATUS
  // ----------------------------------------

  await loadLookup(

    "tblPartRequestedStatus",

    "PartStatusID",

    "PartStatusName",

    "partStatusId",

    "Select part status"

  );


  // ----------------------------------------
  // EQUIPMENT STATUS
  // ----------------------------------------

  await loadLookup(

    "tblEquipmentStatus",

    "StatusID",

    "StatusName",

    "statusId",

    "Select equipment status"

  );

}


// ==========================================
// LOAD DEPARTMENT FOR SELECTED EQUIPMENT
// ==========================================

async function loadDepartmentForEquipment(
  equipmentId
) {

  if (!departmentInput) {
    return;
  }


  departmentInput.value = "";


  if (!equipmentId) {
    return;
  }


  departmentInput.value =
    "Loading department...";


  try {

    const {
      data: equipment,
      error: equipmentError
    } = await client

      .from("tblEquipment")

      .select(
        "DepartmentID"
      )

      .eq(
        "EquipmentID",
        equipmentId
      )

      .maybeSingle();


    if (equipmentError) {

      console.error(
        "Equipment lookup error:",
        equipmentError
      );

      departmentInput.value =
        "Unable to load department";

      return;

    }


    if (!equipment) {

      departmentInput.value =
        "Equipment not found";

      return;

    }


    if (
      equipment.DepartmentID === null ||
      equipment.DepartmentID === undefined
    ) {

      departmentInput.value =
        "No department assigned";

      return;

    }


    const {
      data: department,
      error: departmentError
    } = await client

      .from("tblDepartment")

      .select(
        "DepartmentName"
      )

      .eq(
        "DepartmentID",
        equipment.DepartmentID
      )

      .maybeSingle();


    if (departmentError) {

      console.error(
        "Department lookup error:",
        departmentError
      );

      departmentInput.value =
        "Unable to load department";

      return;

    }


    if (!department) {

      departmentInput.value =
        "Department not found";

      return;

    }


    departmentInput.value =
      department.DepartmentName || "";

  }

  catch (error) {

    console.error(
      "Unexpected department error:",
      error
    );

    departmentInput.value =
      "Unable to load department";

  }

}


// ==========================================
// EQUIPMENT CHANGE EVENT
// ==========================================

if (equipmentSelect) {

  equipmentSelect.addEventListener(
    "change",
    function() {

      loadDepartmentForEquipment(
        this.value
      );

    }
  );

}


// ==========================================
// LOAD USER PROFILE
// ==========================================

async function loadUserProfile(
  userId
) {

  const {
    data,
    error
  } = await client

    .from("tblUsers")

    .select(
      'UserID, Username, "Full name", UserRole, Status, AuthUserID'
    )

    .eq(
      "AuthUserID",
      userId
    )

    .maybeSingle();


  if (error) {

    console.error(
      "User profile error:",
      error
    );

    throw error;

  }


  if (!data) {

    throw new Error(

      "Your Supabase account is authenticated, " +
      "but no matching profile was found in tblUsers."

    );

  }


  if (
    String(data.Status).toLowerCase() !==
    "active"
  ) {

    throw new Error(

      "Your account is not active. " +
      "Please contact the administrator."

    );

  }


  return data;

}


// ==========================================
// EQUIPMENT REGISTRATION ELEMENTS
// ==========================================

const equipmentRegistrationForm =
  document.getElementById(
    "equipmentRegistrationForm"
  );

const newDepartmentSelect =
  document.getElementById(
    "newDepartmentId"
  );

const newCategorySelect =
  document.getElementById(
    "newCategoryId"
  );

const newStatusSelect =
  document.getElementById(
    "newStatusId"
  );

const equipmentRegistrationMessage =
  document.getElementById(
    "equipmentRegistrationMessage"
  );


// ==========================================
// LOAD EQUIPMENT REGISTRATION DROPDOWNS
// ==========================================

async function loadEquipmentRegistrationDropdowns() {

  // ----------------------------------------
  // DEPARTMENT
  // ----------------------------------------

  try {

    if (newDepartmentSelect) {

      await loadLookup(

        "tblDepartment",

        "DepartmentID",

        "DepartmentName",

        "newDepartmentId",

        "Select department"

      );

    }

  }

  catch (error) {

    console.error(
      "Department registration dropdown error:",
      error
    );

  }


  // ----------------------------------------
  // EQUIPMENT CATEGORY
  // ----------------------------------------

  try {

    if (newCategorySelect) {

      await loadLookup(

        "tblEquipmentcategory",

        "CategoryID",

        "CategoryName",

        "newCategoryId",

        "Select category"

      );

    }

  }

  catch (error) {

    console.error(
      "Category registration dropdown error:",
      error
    );

  }


  // ----------------------------------------
  // EQUIPMENT STATUS
  // ----------------------------------------

  try {

    if (newStatusSelect) {

      await loadLookup(

        "tblEquipmentStatus",

        "StatusID",

        "StatusName",

        "newStatusId",

        "Select status"

      );

    }

  }

  catch (error) {

    console.error(
      "Status registration dropdown error:",
      error
    );

  }

}


// ==========================================
// SHOW APPLICATION
// ==========================================

async function showApp(
  user
) {

  const profile =
    await loadUserProfile(
      user.id
    );


  welcomeText.textContent =

    `Welcome, ${
      profile["Full name"] ||
      user.email
    } (${
      profile.UserRole ||
      "User"
    })`;


  loginView.classList.add(
    "hidden"
  );


  appView.classList.remove(
    "hidden"
  );


  // Load maintenance report dropdowns

  try {

    await loadFormData();

  }

  catch (error) {

    console.error(
      "Maintenance form loading error:",
      error
    );

  }


  // Load equipment registration dropdowns
  // AFTER successful authentication

  try {

    await loadEquipmentRegistrationDropdowns();

  }

  catch (error) {

    console.error(
      "Equipment registration loading error:",
      error
    );

  }

}


// ==========================================
// LOGIN
// ==========================================

if (loginForm) {

  loginForm.addEventListener(

    "submit",

    async function(event) {

      event.preventDefault();


      loginMessage.textContent =
        "Signing in...";


      const email =

        document
          .getElementById("email")
          .value
          .trim();


      const password =

        document
          .getElementById("password")
          .value;


      if (
        !email ||
        !password
      ) {

        loginMessage.textContent =

          "Please enter your email and password.";

        return;

      }


      const {
        data,
        error
      } = await client.auth.signInWithPassword({

        email: email,

        password: password

      });


      if (error) {

        console.error(
          "Login error:",
          error
        );


        loginMessage.textContent =

          "Login failed: " +
          error.message;


        return;

      }


      try {

        await showApp(
          data.user
        );


        loginMessage.textContent =
          "";

      }

      catch (profileError) {

        console.error(
          "Profile error:",
          profileError
        );


        await client.auth.signOut();


        loginMessage.textContent =

          "Login successful, but profile loading failed: " +
          profileError.message;

      }

    }

  );

}


// ==========================================
// LOGOUT
// ==========================================

if (logoutBtn) {

  logoutBtn.addEventListener(

    "click",

    async function() {

      await client.auth.signOut();


      appView.classList.add(
        "hidden"
      );


      loginView.classList.remove(
        "hidden"
      );


      loginForm.reset();


      loginMessage.textContent =
        "";

    }

  );

}


// ==========================================
// MENU NAVIGATION
// ==========================================

document
  .querySelectorAll(
    ".menu button"
  )
  .forEach(

    button => {

      button.addEventListener(
