// ==========================================
// ATBUTH BIOMEDICAL CMMS
// Supabase Mobile Web Application
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
// LOAD DROPDOWN DATA
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
// LOAD FORM DATA
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

    console.error(
      "Department input not found."
    );

    return;

  }


  // Clear department

  departmentInput.value = "";


  if (!equipmentId) {

    departmentInput.value = "";

    return;

  }


  departmentInput.value =
    "Loading department...";


  try {

    // --------------------------------------
    // GET DEPARTMENT ID FROM EQUIPMENT
    // --------------------------------------

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


    // --------------------------------------
    // GET DEPARTMENT NAME
    // --------------------------------------

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


    // --------------------------------------
    // DISPLAY DEPARTMENT
    // --------------------------------------

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
      "but no matching profile was found in tblUsers. " +
      "Please make sure AuthUserID in tblUsers matches your Authentication User ID."

    );

  }


  if (

    String(
      data.Status
    ).toLowerCase() !==
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


  await loadFormData();

}


// ==========================================
// LOGIN
// ==========================================

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


// ==========================================
// LOGOUT
// ==========================================

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

        "click",

        function() {

          document
            .querySelectorAll(
              ".app-section"
            )
            .forEach(

              section =>

                section.classList.add(
                  "hidden"
                )

            );


          const selectedSection =

            document.getElementById(

              button.dataset.section

            );


          if (
            selectedSection
          ) {

            selectedSection.classList.remove(
              "hidden"
            );

          }

        }

      );

    }

  );


// ==========================================
// SUBMIT MAINTENANCE REPORT
// ==========================================

maintenanceForm.addEventListener(

  "submit",

  async function(event) {

    event.preventDefault();


    maintenanceMessage.textContent =
      "Submitting report...";


    const {

      data: authData

    } = await client.auth.getUser();


    if (
      !authData.user
    ) {

      maintenanceMessage.textContent =

        "Your session has expired. " +
        "Please log in again.";

      return;

    }


    // ======================================
    // GET PART REQUESTED STATUS TEXT
    // ======================================

    const partStatusSelect =
      document.getElementById(
        "partStatusId"
      );


    let partRequestedStatus =
      null;


    if (
      partStatusSelect &&
      partStatusSelect.value
    ) {

      partRequestedStatus =

        partStatusSelect
          .selectedOptions[0]
          .textContent
          .trim();

    }


    // ======================================
    // PREPARE REPORT DATA
    // ======================================

    const payload = {

      JobOrderNumber:

        document
          .getElementById(
            "jobOrderNumber"
          )
          .value

          ? Number(

              document
                .getElementById(
                  "jobOrderNumber"
                )
                .value

            )

          : null,


      ReportDate:

        new Date()
          .toISOString(),


      EquipmentID:

        Number(

          document
            .getElementById(
              "equipmentId"
            )
            .value

        ),


      EngineerID:

        Number(

          document
            .getElementById(
              "engineerId"
            )
            .value

        ),


      MaintenanceTypeID:

        Number(

          document
            .getElementById(
              "maintenanceTypeId"
            )
            .value

        ),


      FaultReported:

        document
          .getElementById(
            "faultReported"
          )
          .value || null,


      Diagnosis:

        document
          .getElementById(
            "diagnosis"
          )
          .value || null,


      ActionTaken:

        document
          .getElementById(
            "actionTaken"
          )
          .value || null,


      PartUsed:

        document
          .getElementById(
            "partUsed"
          )
          .value || null,


      RequiredPart:

        document
          .getElementById(
            "requiredPart"
          )
          .value || null,


      QuantityRequired:

        document
          .getElementById(
            "quantityRequired"
          )
          .value

          ? Number(

              document
                .getElementById(
                  "quantityRequired"
                )
                .value

            )

          : null,


      // Required text field

      PartRequestedStatus:

        partRequestedStatus,


      // Keep PartStatusID

      PartStatusID:

        partStatusSelect &&
        partStatusSelect.value

          ? Number(
              partStatusSelect.value
            )

          : null,


      StatusID:

        Number(

          document
            .getElementById(
              "statusId"
            )
            .value

        ),


      Remarks:

        document
          .getElementById(
            "remarks"
          )
          .value || null

    };


    // ======================================
    // INSERT REPORT
    // ======================================

    const {

      error

    } = await client

      .from(
        "tblMaintenanceReport"
      )

      .insert(
        payload
      );


    if (error) {

      console.error(
        "Maintenance report error:",
        error
      );


      maintenanceMessage.textContent =

        "Error submitting report: " +
        error.message;


      return;

    }


    maintenanceMessage.textContent =

      "Maintenance report submitted successfully.";


    maintenanceForm.reset();


    // Clear department after reset

    if (departmentInput) {

      departmentInput.value = "";

    }

  }

);


// ==========================================
// CHECK EXISTING LOGIN SESSION
// ==========================================

async function initializeApp() {

  const {

    data

  } = await client.auth.getSession();


  if (

    data.session &&
    data.session.user

  ) {

    try {

      await showApp(
        data.session.user
      );

    }

    catch (error) {

      console.error(
        "Session error:",
        error
      );


      await client.auth.signOut();


      loginMessage.textContent =

        error.message;

    }

  }

}


// ==========================================
// START APPLICATION
// ==========================================

initializeApp();
// ==========================================
// MAINTENANCE REPORT HISTORY
// ==========================================

const reportsSection =
  document.getElementById("reportsSection");

const reportsTableBody =
  document.getElementById("reportsTableBody");

const reportsLoading =
  document.getElementById("reportsLoading");

const reportsMessage =
  document.getElementById("reportsMessage");

const reportSearch =
  document.getElementById("reportSearch");


// Store all reports for searching

let allMaintenanceReports = [];


// ==========================================
// LOAD MAINTENANCE REPORT HISTORY
// ==========================================

async function loadMaintenanceReports() {

  if (!reportsTableBody) {
    return;
  }


  reportsLoading.textContent =
    "Loading reports...";


  reportsMessage.textContent =
    "";


  const {
    data: reports,
    error
  } = await client

    .from("tblMaintenanceReport")

    .select(`
      MaintenanceID,
      JobOrderNumber,
      ReportDate,
      EquipmentID,
      EngineerID,
      MaintenanceTypeID,
      FaultReported,
      ActionTaken,
      StatusID,
      Remarks,
      tblEquipment (
        EquipmentName,
        DepartmentID
      ),
      tblEngineers (
        FirstName,
        LastName
      ),
      tblMaintenanceType (
        MaintenanceType
      ),
      tblEquipmentStatus (
        StatusName
      )
    `)

    .order(
      "ReportDate",
      {
        ascending: false
      }
    );


  if (error) {

    console.error(
      "Error loading maintenance reports:",
      error
    );


    reportsLoading.textContent =
      "";


    reportsMessage.textContent =

      "Unable to load maintenance reports: " +
      error.message;


    return;

  }


  allMaintenanceReports =
    reports || [];


  reportsLoading.textContent =
    "";


  await displayMaintenanceReports(
    allMaintenanceReports
  );

}


// ==========================================
// DISPLAY MAINTENANCE REPORTS
// ==========================================

async function displayMaintenanceReports(
  reports
) {

  reportsTableBody.innerHTML = "";


  if (
    !reports ||
    reports.length === 0
  ) {

    reportsTableBody.innerHTML =

      `<tr>
        <td colspan="10">
          No maintenance reports found.
        </td>
      </tr>`;

    return;

  }


  // Get department IDs

  const departmentIds =

    reports

      .map(
        report =>

          report.tblEquipment
            ?.DepartmentID

      )

      .filter(
        id =>
          id !== null &&
          id !== undefined
      );


  // Load departments

  let departments = [];


  if (
    departmentIds.length > 0
  ) {

    const {
      data,
      error
    } = await client

      .from(
        "tblDepartment"
      )

      .select(
        "DepartmentID, DepartmentName"
      )

      .in(
        "DepartmentID",
        departmentIds
      );


    if (error) {

      console.error(
        "Department loading error:",
        error
      );

    }

    else {

      departments =
        data || [];

    }

  }


  // Create department lookup

  const departmentMap =
    new Map();


  departments.forEach(
    department => {

      departmentMap.set(

        String(
          department.DepartmentID
        ),

        department.DepartmentName

      );

    }
  );


  // Create table rows

  reports.forEach(
    report => {

      const row =
        document.createElement(
          "tr"
        );


      // ------------------------------------
      // DATE
      // ------------------------------------

      const reportDate =

        report.ReportDate

          ? new Date(
              report.ReportDate
            ).toLocaleDateString()

          : "";


      // ------------------------------------
      // EQUIPMENT
      // ------------------------------------

      const equipmentName =

        report.tblEquipment
          ?.EquipmentName

          || "Unknown";


      // ------------------------------------
      // DEPARTMENT
      // ------------------------------------

      const departmentId =

        report.tblEquipment
          ?.DepartmentID;


      const departmentName =

        departmentId !== null &&
        departmentId !== undefined

          ? departmentMap.get(
              String(
                departmentId
              )
            ) || "Unknown"

          : "Not assigned";


      // ------------------------------------
      // ENGINEER
      // ------------------------------------

      const engineerName =

        report.tblEngineers

          ? `${

              report.tblEngineers.FirstName
              || ""

            } ${

              report.tblEngineers.LastName
              || ""

            }`.trim()

          : "Unknown";


      // ------------------------------------
      // MAINTENANCE TYPE
      // ------------------------------------

      const maintenanceType =

        report.tblMaintenanceType
          ?.MaintenanceType

          || "Unknown";


      // ------------------------------------
      // STATUS
      // ------------------------------------

      const statusName =

        report.tblEquipmentStatus
          ?.StatusName

          || "Unknown";


      // ------------------------------------
      // CREATE ROW
      // ------------------------------------

      row.innerHTML = `

        <td>
          ${reportDate}
        </td>

        <td>
          ${report.JobOrderNumber || ""}
        </td>

        <td>
          ${equipmentName}
        </td>

        <td>
          ${departmentName}
        </td>

        <td>
          ${engineerName}
        </td>

        <td>
          ${maintenanceType}
        </td>

        <td>
          ${report.FaultReported || ""}
        </td>

        <td>
          ${report.ActionTaken || ""}
        </td>

        <td>
          ${statusName}
        </td>

        <td>
          ${report.Remarks || ""}
        </td>

      `;


      reportsTableBody.appendChild(
        row
      );

    }

  );

}


// ==========================================
// SEARCH MAINTENANCE REPORTS
// ==========================================

if (reportSearch) {

  reportSearch.addEventListener(

    "input",

    async function() {

      const searchText =

        this.value

          .toLowerCase()

          .trim();


      if (!searchText) {

        await displayMaintenanceReports(

          allMaintenanceReports

        );

        return;

      }


      const filteredReports =

        allMaintenanceReports.filter(

          report => {

            const equipmentName =

              report.tblEquipment
                ?.EquipmentName

                || "";


            const engineerName =

              report.tblEngineers

                ? `${

                    report.tblEngineers
                      .FirstName
                    || ""

                  } ${

                    report.tblEngineers
                      .LastName
                    || ""

                  }`

                : "";


            const maintenanceType =

              report.tblMaintenanceType
                ?.MaintenanceType

                || "";


            const faultReported =

              report.FaultReported
                || "";


            const actionTaken =

              report.ActionTaken
                || "";


            const remarks =

              report.Remarks
                || "";


            const searchableText =

              (

                equipmentName +

                " " +

                engineerName +

                " " +

                maintenanceType +

                " " +

                faultReported +

                " " +

                actionTaken +

                " " +

                remarks

              )

              .toLowerCase();


            return searchableText
              .includes(
                searchText
              );

          }

        );


      await displayMaintenanceReports(

        filteredReports

      );

    }

  );

}


// ==========================================
// LOAD REPORTS WHEN "MY REPORTS" IS OPENED
// ==========================================

document
  .querySelectorAll(
    '.menu button[data-section="reportsSection"]'
  )
  .forEach(

    button => {

      button.addEventListener(

        "click",

        function() {

          loadMaintenanceReports();

        }

      );

    }

  );
// ==========================================
// EQUIPMENT REGISTRATION
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

  // ========================================
  // LOAD DEPARTMENTS
  // ========================================

  try {

    await loadLookup(
      "tblDepartment",
      "DepartmentID",
      "DepartmentName",
      "newDepartmentId",
      "Select department"
    );

    console.log(
      "Departments loaded successfully"
    );

  }

  catch (error) {

    console.error(
      "Department loading error:",
      error
    );

  }


  // ========================================
  // LOAD EQUIPMENT CATEGORIES
  // ========================================

  try {

    await loadLookup(
      "tblEquipmentcategory",
      "CategoryID",
      "CategoryName",
      "newCategoryId",
      "Select category"
    );

    console.log(
      "Equipment categories loaded successfully"
    );

  }

  catch (error) {

    console.error(
      "Equipment category loading error:",
      error
    );

  }


  // ========================================
  // LOAD EQUIPMENT STATUS
  // ========================================

  try {

    await loadLookup(
      "tblEquipmentStatus",
      "StatusID",
      "StatusName",
      "newStatusId",
      "Select status"
    );

    console.log(
      "Equipment statuses loaded successfully"
    );

  }

  catch (error) {

    console.error(
      "Equipment status loading error:",
      error
    );

  }

}

// ==========================================
// LOAD REGISTRATION DROPDOWNS WHEN
// APPLICATION IS OPENED
// ==========================================

const originalShowApp =
  showApp;


// We don't replace the existing showApp.
// Instead, load registration dropdowns
// when the page is ready and the user
// is authenticated.

async function initializeEquipmentRegistration() {

  try {

    await loadEquipmentRegistrationDropdowns();

  }

  catch (error) {

    console.error(

      "Error loading equipment registration dropdowns:",

      error

    );

  }

}


// ==========================================
// SUBMIT NEW EQUIPMENT
// ==========================================

if (equipmentRegistrationForm) {

  equipmentRegistrationForm.addEventListener(

    "submit",

    async function(event) {

      event.preventDefault();


      equipmentRegistrationMessage.textContent =

        "Registering equipment...";


      // ------------------------------------
      // GET CURRENT USER
      // ------------------------------------

      const {

        data: authData

      } = await client.auth.getUser();


      if (
        !authData ||
        !authData.user
      ) {

        equipmentRegistrationMessage.textContent =

          "Your session has expired. Please log in again.";

        return;

      }


      // ------------------------------------
      // GET FORM VALUES
      // ------------------------------------

      const bmeNumber =

        document
          .getElementById(
            "newBmeNumber"
          )
          .value
          .trim();


      const equipmentName =

        document
          .getElementById(
            "newEquipmentName"
          )
          .value
          .trim();


      const manufacturer =

        document
          .getElementById(
            "newManufacturer"
          )
          .value
          .trim();


      const model =

        document
          .getElementById(
            "newModel"
          )
          .value
          .trim();


      const serialNumber =

        document
          .getElementById(
            "newSerialNumber"
          )
          .value
          .trim();


      const departmentId =

        document
          .getElementById(
            "newDepartmentId"
          )
          .value;


      const categoryId =

        document
          .getElementById(
            "newCategoryId"
          )
          .value;


      const statusId =

        document
          .getElementById(
            "newStatusId"
          )
          .value;


      const location =

        document
          .getElementById(
            "newLocation"
          )
          .value
          .trim();


      const remarks =

        document
          .getElementById(
            "newEquipmentRemarks"
          )
          .value
          .trim();


      // ------------------------------------
      // VALIDATE REQUIRED FIELDS
      // ------------------------------------

      if (

        !bmeNumber ||

        !equipmentName ||

        !departmentId ||

        !categoryId ||

        !statusId

      ) {

        equipmentRegistrationMessage.textContent =

          "Please complete all required fields.";

        return;

      }


      // ------------------------------------
      // PREPARE EQUIPMENT DATA
      // ------------------------------------

      const equipmentData = {

        BMENumber:
          bmeNumber,

        EquipmentName:
          equipmentName,

        Manufacturer:
          manufacturer || null,

        Model:
          model || null,

        SerialNumber:
          serialNumber || null,

        DepartmentID:
          Number(
            departmentId
          ),

        CategoryID:
          Number(
            categoryId
          ),

        StatusID:
          Number(
            statusId
          ),

        Location:
          location || null,

        Remarks:
          remarks || null

      };


      // ------------------------------------
      // INSERT INTO tblEquipment
      // ------------------------------------

      const {

        data,

        error

      } = await client

        .from(
          "tblEquipment"
        )

        .insert(
          equipmentData
        )

        .select();


      if (error) {

        console.error(

          "Equipment registration error:",

          error

        );


        equipmentRegistrationMessage.textContent =

          "Error registering equipment: " +

          error.message;

        return;

      }


      // ------------------------------------
      // SUCCESS
      // ------------------------------------

      equipmentRegistrationMessage.textContent =

        "Equipment registered successfully.";


      // ------------------------------------
      // RESET FORM
      // ------------------------------------

      equipmentRegistrationForm.reset();


      // ------------------------------------
      // REFRESH MAINTENANCE REPORT
      // EQUIPMENT DROPDOWN
      // ------------------------------------

      try {

        await loadLookup(

          "tblEquipment",

          "EquipmentID",

          "EquipmentName",

          "equipmentId",

          "Select equipment",

          row => {

            return `${row.EquipmentName}${
              row.BMENumber
                ? " — " +
                  row.BMENumber
                : ""
            }`;

          }

        );

      }

      catch (refreshError) {

        console.error(

          "Equipment dropdown refresh error:",

          refreshError

        );

      }

    }

  );

}


// ==========================================
// START EQUIPMENT REGISTRATION
// ==========================================

initializeEquipmentRegistration();
