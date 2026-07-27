// ==========================================
// ATBUTH BIOMEDICAL CMMS
// SUPABASE MOBILE WEB APPLICATION
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
// GENERIC DROPDOWN LOADER
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

    .order(
      labelField,
      {
        ascending: true
      }
    );


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


    select.appendChild(
      option
    );

  }

}


// ==========================================
// LOAD FORM DROPDOWN DATA
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

      return `${row.EquipmentName || ""}${
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


  departmentInput.value = "";


  if (!equipmentId) {

    return;

  }


  departmentInput.value =
    "Loading department...";


  try {

    // --------------------------------------
    // GET EQUIPMENT DEPARTMENT ID
    // --------------------------------------

    const {

      data: equipment,

      error: equipmentError

    } = await client

      .from("tblEquipment")

      .select("DepartmentID")

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

      .select("DepartmentName")

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
// LOAD EQUIPMENT HISTORY DROPDOWN
// ==========================================

async function loadEquipmentHistoryDropdown() {

  const historyEquipmentSelect =
    document.getElementById(
      "historyEquipmentId"
    );


  if (!historyEquipmentSelect) {

    console.error(
      "Equipment History dropdown not found."
    );

    return;

  }


  historyEquipmentSelect.innerHTML =
    '<option value="">Loading equipment...</option>';


  try {

    const {

      data,

      error

    } = await client

      .from("tblEquipment")

      .select(
        "EquipmentID, BMENumber, EquipmentName"
      )

      .order(
        "BMENumber",
        {
          ascending: true
        }
      );


    if (error) {

      console.error(
        "Error loading Equipment History equipment:",
        error
      );

      historyEquipmentSelect.innerHTML =
        '<option value="">Unable to load equipment</option>';

      return;

    }


    historyEquipmentSelect.innerHTML =
      '<option value="">Select equipment</option>';


    if (
      !data ||
      data.length === 0
    ) {

      historyEquipmentSelect.innerHTML =
        '<option value="">No equipment found</option>';

      return;

    }


    data.forEach(

      equipment => {

        const option =
          document.createElement(
            "option"
          );


        option.value =
          equipment.EquipmentID;


        option.textContent =

          `${equipment.BMENumber || ""} — ${
            equipment.EquipmentName || ""
          }`;


        historyEquipmentSelect.appendChild(
          option
        );

      }

    );

  }

  catch (error) {

    console.error(
      "Equipment History dropdown error:",
      error
    );

    historyEquipmentSelect.innerHTML =
      '<option value="">Unable to load equipment</option>';

  }

}


// ==========================================
// LOAD SELECTED EQUIPMENT HISTORY
// ==========================================

async function loadEquipmentHistory(
  equipmentId
) {

  const details =
    document.getElementById(
      "equipmentHistoryDetails"
    );


  const tableBody =
    document.getElementById(
      "equipmentHistoryTableBody"
    );


  const message =
    document.getElementById(
      "equipmentHistoryMessage"
    );


  if (
    !details ||
    !tableBody
  ) {

    console.error(
      "Equipment History elements not found."
    );

    return;

  }


  // ----------------------------------------
  // CLEAR MESSAGE
  // ----------------------------------------

  if (message) {

    message.textContent = "";

  }


  // ----------------------------------------
  // SHOW LOADING
  // ----------------------------------------

  details.innerHTML =
    "<p>Loading equipment details...</p>";


  tableBody.innerHTML =

    `<tr>
      <td colspan="11">
        Loading maintenance history...
      </td>
    </tr>`;


  try {

    // ======================================
    // 1. GET EQUIPMENT DETAILS
    // ======================================

    const {

      data: equipment,

      error: equipmentError

    } = await client

      .from("tblEquipment")

      .select(
        `
        EquipmentID,
        BMENumber,
        EquipmentName,
        Manufacturer,
        Model,
        SerialNumber,
        Location,
        DepartmentID
        `
      )

      .eq(
        "EquipmentID",
        equipmentId
      )

      .maybeSingle();


    if (equipmentError) {

      console.error(
        "Equipment details error:",
        equipmentError
      );

      throw new Error(
        "Unable to load equipment details: " +
        equipmentError.message
      );

    }


    if (!equipment) {

      details.innerHTML =
        "<p>Equipment not found.</p>";

      tableBody.innerHTML =

        `<tr>
          <td colspan="11">
            Equipment not found.
          </td>
        </tr>`;

      return;

    }


    // ======================================
    // 2. GET DEPARTMENT
    // ======================================

    let departmentName =
      "Not assigned";


    if (

      equipment.DepartmentID !== null &&

      equipment.DepartmentID !== undefined

    ) {

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

        console.warn(
          "Department could not be loaded:",
          departmentError
        );

      }


      if (department) {

        departmentName =
          department.DepartmentName ||
          "Not assigned";

      }

    }


    // ======================================
    // 3. DISPLAY EQUIPMENT DETAILS
    // ======================================

    details.innerHTML = `

      <div class="equipment-history-info">

        <p>
          <strong>BME Number:</strong>
          ${equipment.BMENumber || ""}
        </p>

        <p>
          <strong>Equipment Name:</strong>
          ${equipment.EquipmentName || ""}
        </p>

        <p>
          <strong>Manufacturer:</strong>
          ${equipment.Manufacturer || ""}
        </p>

        <p>
          <strong>Model:</strong>
          ${equipment.Model || ""}
        </p>

        <p>
          <strong>Serial Number:</strong>
          ${equipment.SerialNumber || ""}
        </p>

        <p>
          <strong>Department:</strong>
          ${departmentName}
        </p>

        <p>
          <strong>Location:</strong>
          ${equipment.Location || ""}
        </p>

      </div>

    `;


    // ======================================
    // 4. GET MAINTENANCE HISTORY
    // ======================================

    const {

      data: history,

      error: historyError

    } = await client

      .from("vwMaintenanceReport")

      .select("*")

      .eq(
        "EquipmentID",
        equipmentId
      )

      .order(
        "ReportDate",
        {
          ascending: false
        }
      );


    if (historyError) {

      console.error(
        "Maintenance history error:",
        historyError
      );

      throw new Error(
        "Unable to load equipment history: " +
        historyError.message
      );

    }


    // ======================================
    // 5. NO HISTORY
    // ======================================

    if (

      !history ||

      history.length === 0

    ) {

      tableBody.innerHTML =

        `<tr>
          <td colspan="11">
            No maintenance history found for this equipment.
          </td>
        </tr>`;

      return;

    }


    // ======================================
    // 6. DISPLAY HISTORY
    // ======================================

    tableBody.innerHTML = "";


    history.forEach(

      report => {

        const row =
          document.createElement(
            "tr"
          );


        row.innerHTML = `

          <td>
            ${
              report.ReportDate
                ? new Date(
                    report.ReportDate
                  ).toLocaleDateString()
                : ""
            }
          </td>

          <td>
            ${
              report.JobOrderNumber ||
              ""
            }
          </td>

          <td>
            ${
              report.EngineerName ||
              ""
            }
          </td>

          <td>
            ${
              report.MaintenanceType ||
              ""
            }
          </td>

          <td>
            ${
              report.FaultReported ||
              ""
            }
          </td>

          <td>
            ${
              report.Diagnosis ||
              ""
            }
          </td>

          <td>
            ${
              report.ActionTaken ||
              ""
            }
          </td>

          <td>
            ${
              report.PartUsed ||
              ""
            }
          </td>

          <td>
            ${
              report.RequiredPart ||
              ""
            }
          </td>

          <td>
            ${
              report.StatusName ||
              ""
            }
          </td>

          <td>
            ${
              report.Remarks ||
              ""
            }
          </td>

        `;


        tableBody.appendChild(
          row
        );

      }

    );

  }

  catch (error) {

    console.error(
      "Equipment History error:",
      error
    );


    details.innerHTML =

      "<p>Unable to load equipment details.</p>";


    tableBody.innerHTML =

      `<tr>
        <td colspan="11">
          Unable to load equipment history.
        </td>
      </tr>`;


    if (message) {

      message.textContent =
        error.message;

    }

  }

}
// ==========================================
// EQUIPMENT HISTORY SELECTION EVENT
// ==========================================

const historyEquipmentSelect =
  document.getElementById(
    "historyEquipmentId"
  );


if (historyEquipmentSelect) {

  historyEquipmentSelect.addEventListener(

    "change",

    function() {

      const equipmentId =
        this.value;


      if (!equipmentId) {

        const details =
          document.getElementById(
            "equipmentHistoryDetails"
          );

        const tableBody =
          document.getElementById(
            "equipmentHistoryTableBody"
          );


        if (details) {

          details.innerHTML =

            "<p>Select an equipment to view its details.</p>";

        }


        if (tableBody) {

          tableBody.innerHTML =

            `<tr>
              <td colspan="11">
                Select an equipment to view history.
              </td>
            </tr>`;

        }


        return;

      }


      loadEquipmentHistory(
        equipmentId
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
// LOAD MAINTENANCE REPORTS
// ==========================================

async function loadMaintenanceReports() {

  const reportTableBody =
    document.getElementById(
      "reportsTableBody"
    );


  // ----------------------------------------
  // SAFELY EXIT IF REPORT TABLE IS NOT
  // PRESENT IN THE CURRENT HTML
  // ----------------------------------------

  if (!reportTableBody) {

    return;

  }


  // ----------------------------------------
  // SHOW LOADING MESSAGE
  // ----------------------------------------

  reportTableBody.innerHTML = `

    <tr>

      <td colspan="11">

        Loading maintenance reports...

      </td>

    </tr>

  `;


  try {

    // ======================================
    // LOAD REPORTS FROM SUPABASE VIEW
    // ======================================

    const {

      data,

      error

    } = await client

      .from(
        "vwMaintenanceReport"
      )

      .select("*")

      .order(
        "ReportDate",
        {
          ascending: false
        }
      );


    // ======================================
    // HANDLE SUPABASE ERROR
    // ======================================

    if (error) {

      console.error(
        "Error loading maintenance reports:",
        error
      );


      reportTableBody.innerHTML = `

        <tr>

          <td colspan="11">

            Error loading reports:
            ${error.message}

          </td>

        </tr>

      `;


      return;

    }


    // ======================================
    // NO REPORTS FOUND
    // ======================================

    if (

      !data ||

      data.length === 0

    ) {

      reportTableBody.innerHTML = `

        <tr>

          <td colspan="11">

            No maintenance reports found.

          </td>

        </tr>

      `;


      return;

    }


    // ======================================
    // CLEAR TABLE
    // ======================================

    reportTableBody.innerHTML = "";


    // ======================================
    // DISPLAY ALL REPORTS
    // ======================================

    data.forEach(

      report => {

        const row =
          document.createElement(
            "tr"
          );


        row.innerHTML = `

          <td>
            ${
              report.ReportDate
                ? new Date(
                    report.ReportDate
                  ).toLocaleDateString()
                : ""
            }
          </td>

          <td>
            ${
              report.JobOrderNumber ||
              ""
            }
          </td>

          <td>
            ${
              report.BMENumber ||
              ""
            }
          </td>

          <td>
            ${
              report.EquipmentName ||
              ""
            }
          </td>

          <td>
            ${
              report.DepartmentName ||
              ""
            }
          </td>

          <td>
            ${
              report.EngineerName ||
              ""
            }
          </td>

          <td>
            ${
              report.MaintenanceType ||
              ""
            }
          </td>

          <td>
            ${
              report.FaultReported ||
              ""
            }
          </td>

          <td>
            ${
              report.ActionTaken ||
              ""
            }
          </td>

          <td>
            ${
              report.StatusName ||
              ""
            }
          </td>

          <td>
            ${
              report.Remarks ||
              ""
            }
          </td>

        `;


        reportTableBody.appendChild(
          row
        );

      }

    );

  }

  catch (error) {

    console.error(
      "Unexpected maintenance reports error:",
      error
    );


    reportTableBody.innerHTML = `

      <tr>

        <td colspan="11">

          Unable to load maintenance reports.

        </td>

      </tr>

    `;

  }

}


// ==========================================
// SHOW APPLICATION
// ==========================================

async function showApp(
  user
) {

  // ----------------------------------------
  // LOAD USER PROFILE
  // ----------------------------------------

  const profile =
    await loadUserProfile(
      user.id
    );


  // ----------------------------------------
  // DISPLAY USER NAME AND ROLE
  // ----------------------------------------

  if (welcomeText) {

    welcomeText.textContent =

      `Welcome, ${
        profile["Full name"] ||
        user.email
      } (${
        profile.UserRole ||
        "User"
      })`;

  }


  // ----------------------------------------
  // HIDE LOGIN VIEW
  // ----------------------------------------

  if (loginView) {

    loginView.classList.add(
      "hidden"
    );

  }


  // ----------------------------------------
  // SHOW APPLICATION VIEW
  // ----------------------------------------

  if (appView) {

    appView.classList.remove(
      "hidden"
    );

  }


  // ----------------------------------------
  // LOAD FORM DROPDOWNS
  // ----------------------------------------

  await loadFormData();


  // ----------------------------------------
  // LOAD EQUIPMENT HISTORY DROPDOWN
  // ----------------------------------------

  await loadEquipmentHistoryDropdown();


  // ----------------------------------------
  // LOAD MAINTENANCE REPORTS
  // ----------------------------------------

  await loadMaintenanceReports();

}


// ==========================================
// LOGIN
// ==========================================

if (loginForm) {

  loginForm.addEventListener(

    "submit",

    async function(event) {

      event.preventDefault();


      // ------------------------------------
      // SHOW LOGIN MESSAGE
      // ------------------------------------

      if (loginMessage) {

        loginMessage.textContent =
          "Signing in...";

      }


      // ------------------------------------
      // GET EMAIL
      // ------------------------------------

      const emailInput =
        document.getElementById(
          "email"
        );


      // ------------------------------------
      // GET PASSWORD
      // ------------------------------------

      const passwordInput =
        document.getElementById(
          "password"
        );


      const email =

        emailInput

          ? emailInput.value.trim()

          : "";


      const password =

        passwordInput

          ? passwordInput.value

          : "";


      // ------------------------------------
      // VALIDATE LOGIN FIELDS
      // ------------------------------------

      if (

        !email ||

        !password

      ) {

        if (loginMessage) {

          loginMessage.textContent =

            "Please enter your email and password.";

        }

        return;

      }


      // ------------------------------------
      // SUPABASE LOGIN
      // ------------------------------------

      const {

        data,

        error

      } = await client.auth.signInWithPassword({

        email: email,

        password: password

      });


      // ------------------------------------
      // HANDLE LOGIN ERROR
      // ------------------------------------

      if (error) {

        console.error(
          "Login error:",
          error
        );


        if (loginMessage) {

          loginMessage.textContent =

            "Login failed: " +
            error.message;

        }


        return;

      }


      // ------------------------------------
      // LOAD APPLICATION
      // ------------------------------------

      try {

        await showApp(
          data.user
        );


        if (loginMessage) {

          loginMessage.textContent =
            "";

        }

      }

      catch (profileError) {

        console.error(
          "Application loading error:",
          profileError
        );


        // ----------------------------------
        // SIGN OUT IF PROFILE LOADING FAILS
        // ----------------------------------

        await client.auth.signOut();


        if (appView) {

          appView.classList.add(
            "hidden"
          );

        }


        if (loginView) {

          loginView.classList.remove(
            "hidden"
          );

        }


        if (loginMessage) {

          loginMessage.textContent =

            "Login successful, but application loading failed: " +

            profileError.message;

        }

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

      try {

        await client.auth.signOut();

      }

      catch (error) {

        console.error(
          "Logout error:",
          error
        );

      }


      // ------------------------------------
      // HIDE APPLICATION
      // ------------------------------------

      if (appView) {

        appView.classList.add(
          "hidden"
        );

      }


      // ------------------------------------
      // SHOW LOGIN
      // ------------------------------------

      if (loginView) {

        loginView.classList.remove(
          "hidden"
        );

      }


      // ------------------------------------
      // RESET LOGIN FORM
      // ------------------------------------

      if (loginForm) {

        loginForm.reset();

      }


      // ------------------------------------
      // CLEAR LOGIN MESSAGE
      // ------------------------------------

      if (loginMessage) {

        loginMessage.textContent =
          "";

      }

    }

  );

}


// ==========================================
// MENU NAVIGATION
// ==========================================

document
  .querySelectorAll(".menu button")
  .forEach(button => {

    button.addEventListener(

      "click",

      function() {

        // ----------------------------------
        // HIDE ALL APPLICATION SECTIONS
        // ----------------------------------

        document

          .querySelectorAll(
            ".app-section"
          )

          .forEach(

            section => {

              section.classList.add(
                "hidden"
              );

            }

          );


        // ----------------------------------
        // GET SELECTED SECTION
        // ----------------------------------

        const selectedSection =

          document.getElementById(

            button.dataset.section

          );


        // ----------------------------------
        // SHOW SELECTED SECTION
        // ----------------------------------

        if (selectedSection) {

          selectedSection.classList.remove(
            "hidden"
          );

        }


        // ----------------------------------
        // LOAD MAINTENANCE REPORTS
        // ----------------------------------

        if (

          button.dataset.section ===

          "reportsSection"

        ) {

          loadMaintenanceReports();

        }


        // ----------------------------------
        // LOAD EQUIPMENT HISTORY
        // ----------------------------------

        if (

          button.dataset.section ===

          "historySection"

        ) {

          loadEquipmentHistoryDropdown();

        }

      }

    );

  });


// ==========================================
// SUBMIT MAINTENANCE REPORT
// ==========================================

if (maintenanceForm) {

  maintenanceForm.addEventListener(

    "submit",

    async function(event) {

      event.preventDefault();


      // ------------------------------------
      // SHOW SUBMISSION MESSAGE
      // ------------------------------------

      if (maintenanceMessage) {

        maintenanceMessage.textContent =
          "Submitting report...";

      }


      // ------------------------------------
      // CHECK AUTHENTICATED USER
      // ------------------------------------

      const {

        data: authData,

        error: authError

      } = await client.auth.getUser();


      if (

        authError ||

        !authData.user

      ) {

        if (maintenanceMessage) {

          maintenanceMessage.textContent =

            "Your session has expired. Please log in again.";

        }

        return;

      }


      // ------------------------------------
      // GET PART STATUS SELECT
      // ------------------------------------

      const partStatusSelect =

        document.getElementById(
          "partStatusId"
        );


      // ------------------------------------
      // PREPARE PART STATUS
      // ------------------------------------

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


      // ------------------------------------
      // GET EQUIPMENT
      // ------------------------------------

      const equipmentElement =

        document.getElementById(
          "equipmentId"
        );


      // ------------------------------------
      // GET ENGINEER
      // ------------------------------------

      const engineerElement =

        document.getElementById(
          "engineerId"
        );


      // ------------------------------------
      // GET MAINTENANCE TYPE
      // ------------------------------------

      const maintenanceTypeElement =

        document.getElementById(
          "maintenanceTypeId"
        );


      // ------------------------------------
      // GET EQUIPMENT STATUS
      // ------------------------------------

      const statusElement =

        document.getElementById(
          "statusId"
        );


      const equipmentValue =

        equipmentElement

          ? equipmentElement.value

          : "";


      const engineerValue =

        engineerElement

          ? engineerElement.value

          : "";


      const maintenanceTypeValue =

        maintenanceTypeElement

          ? maintenanceTypeElement.value

          : "";


      const statusValue =

        statusElement

          ? statusElement.value

          : "";


      // ------------------------------------
      // VALIDATE REQUIRED IDs
      // ------------------------------------

      if (

        !equipmentValue ||

        !engineerValue ||

        !maintenanceTypeValue ||

        !statusValue

      ) {

        if (maintenanceMessage) {

          maintenanceMessage.textContent =

            "Please complete all required fields.";

        }

        return;

      }


      // ====================================
      // PREPARE MAINTENANCE REPORT PAYLOAD
      // ====================================

      const payload = {

        JobOrderNumber:

          document.getElementById(
            "jobOrderNumber"
          )?.value

            ? Number(

                document.getElementById(
                  "jobOrderNumber"
                ).value

              )

            : null,


        ReportDate:

          new Date().toISOString(),


        EquipmentID:

          Number(
            equipmentValue
          ),


        EngineerID:

          Number(
            engineerValue
          ),


        MaintenanceTypeID:

          Number(
            maintenanceTypeValue
          ),


        FaultReported:

          document.getElementById(
            "faultReported"
          )?.value ||

          null,


        Diagnosis:

          document.getElementById(
            "diagnosis"
          )?.value ||

          null,


        ActionTaken:

          document.getElementById(
            "actionTaken"
          )?.value ||

          null,


        PartUsed:

          document.getElementById(
            "partUsed"
          )?.value ||

          null,


        RequiredPart:

          document.getElementById(
            "requiredPart"
          )?.value ||

          null,


        QuantityRequired:

          document.getElementById(
            "quantityRequired"
          )?.value

            ? Number(

                document.getElementById(
                  "quantityRequired"
                ).value

              )

            : null,


        PartRequestedStatus:

          partRequestedStatus,


        PartStatusID:

          partStatusSelect &&

          partStatusSelect.value

            ? Number(
                partStatusSelect.value
              )

            : null,


        StatusID:

          Number(
            statusValue
          ),


        Remarks:

          document.getElementById(
            "remarks"
          )?.value ||

          null

      };


      // ====================================
      // INSERT MAINTENANCE REPORT
      // ====================================

      const {

        data: insertedReport,

        error

      } = await client

        .from(
          "tblMaintenanceReport"
        )

        .insert(
          payload
        )

        .select()
        .single();


      // ====================================
      // HANDLE INSERT ERROR
      // ====================================

      if (error) {

        console.error(
          "Maintenance report error:",
          error
        );


        if (maintenanceMessage) {

          maintenanceMessage.textContent =

            "Error submitting report: " +

            error.message;

        }


        return;

      }


      // ====================================
      // SUCCESS
      // ====================================

      console.log(
        "Maintenance report submitted:",
        insertedReport
      );


      if (maintenanceMessage) {

        maintenanceMessage.textContent =

          "Maintenance report submitted successfully.";

      }


      // ------------------------------------
      // RESET FORM
      // ------------------------------------

      maintenanceForm.reset();


      // ------------------------------------
      // CLEAR DEPARTMENT
      // ------------------------------------

      if (departmentInput) {

        departmentInput.value = "";

      }


      // ------------------------------------
      // REFRESH REPORTS
      // ------------------------------------

      await loadMaintenanceReports();

    }

  );

}


// ==========================================
// CHECK EXISTING LOGIN SESSION
// ==========================================

async function initializeApp() {

  try {

    const {

      data,

      error

    } = await client.auth.getSession();


    // --------------------------------------
    // HANDLE SESSION ERROR
    // --------------------------------------

    if (error) {

      console.error(
        "Session error:",
        error
      );

      return;

    }


    // --------------------------------------
    // USER ALREADY LOGGED IN
    // --------------------------------------

    if (

      data.session &&

      data.session.user

    ) {

      await showApp(

        data.session.user

      );

    }

  }

  catch (error) {

    console.error(
      "Application initialization error:",
      error
    );


    await client.auth.signOut();


    // --------------------------------------
    // SHOW LOGIN VIEW
    // --------------------------------------

    if (appView) {

      appView.classList.add(
        "hidden"
      );

    }


    if (loginView) {

      loginView.classList.remove(
        "hidden"
      );

    }


    if (loginMessage) {

      loginMessage.textContent =

        error.message;

    }

  }

}


// ==========================================
// SUPABASE AUTH STATE CHANGE
// ==========================================

client.auth.onAuthStateChange(

  async function(
    event,
    session
  ) {

    console.log(
      "Authentication event:",
      event
    );


    // --------------------------------------
    // USER SIGNED OUT
    // --------------------------------------

    if (

      event ===
      "SIGNED_OUT"

    ) {

      if (appView) {

        appView.classList.add(
          "hidden"
        );

      }


      if (loginView) {

        loginView.classList.remove(
          "hidden"
        );

      }


      return;

    }


    // --------------------------------------
    // USER SIGNED IN
    // --------------------------------------

    if (

      event ===
      "SIGNED_IN" &&

      session &&

      session.user

    ) {

      try {

        await showApp(
          session.user
        );

      }

      catch (error) {

        console.error(
          "Auth state application error:",
          error
        );

      }

    }

  }

);


// ==========================================
// START APPLICATION
// ==========================================

initializeApp();
