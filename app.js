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
// LOAD FORM DATA
// ==========================================
// ==========================================
// LOAD EQUIPMENT FOR EQUIPMENT HISTORY
// ==========================================

async function loadEquipmentHistoryDropdown() {

  const historyEquipmentSelect =
    document.getElementById("historyEquipmentId");

  if (!historyEquipmentSelect) {

    console.error(
      "Equipment History dropdown not found."
    );

    return;

  }


  // ----------------------------------------
  // SHOW LOADING
  // ----------------------------------------

  historyEquipmentSelect.innerHTML =
    '<option value="">Loading equipment...</option>';


  // ----------------------------------------
  // GET EQUIPMENT FROM SUPABASE
  // ----------------------------------------

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


  // ----------------------------------------
  // HANDLE ERROR
  // ----------------------------------------

  if (error) {

    console.error(
      "Error loading Equipment History equipment:",
      error
    );

    historyEquipmentSelect.innerHTML =
      '<option value="">Unable to load equipment</option>';

    return;

  }


  // ----------------------------------------
  // CLEAR DROPDOWN
  // ----------------------------------------

  historyEquipmentSelect.innerHTML =
    '<option value="">Select equipment</option>';


  // ----------------------------------------
  // CHECK IF EQUIPMENT EXISTS
  // ----------------------------------------

  if (
    !data ||
    data.length === 0
  ) {

    historyEquipmentSelect.innerHTML =
      '<option value="">No equipment found</option>';

    return;

  }


  // ----------------------------------------
  // ADD EQUIPMENT TO DROPDOWN
  // ----------------------------------------

  data.forEach(
    equipment => {

      const option =
        document.createElement("option");


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
// ==========================================
// EQUIPMENT HISTORY SELECTION
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

        document.getElementById(
          "equipmentHistoryDetails"
        ).innerHTML =

          "<p>Select an equipment to view its details.</p>";


        document.getElementById(
          "equipmentHistoryTableBody"
        ).innerHTML =

          `<tr>
            <td colspan="11">
              Select an equipment to view history.
            </td>
          </tr>`;

        return;

      }


      loadEquipmentHistory(
        equipmentId
      );

    }

  );

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


  if (!details || !tableBody) {

    console.error(
      "Equipment History elements not found."
    );

    return;

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


  if (message) {

    message.textContent = "";

  }


  try {

    // ======================================
    // GET EQUIPMENT DETAILS
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

      throw equipmentError;

    }


    if (!equipment) {

      details.innerHTML =
        "<p>Equipment not found.</p>";

      tableBody.innerHTML =

        `<tr>
          <td colspan="11">
            No equipment found.
          </td>
        </tr>`;

      return;

    }


    // ======================================
    // GET DEPARTMENT
    // ======================================

    let departmentName =
      "Not assigned";


    if (
      equipment.DepartmentID
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


      if (!departmentError && department) {

        departmentName =
          department.DepartmentName ||
          "Not assigned";

      }

    }


    // ======================================
    // DISPLAY EQUIPMENT DETAILS
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
    // GET MAINTENANCE HISTORY
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

      throw historyError;

    }


    // ======================================
    // NO HISTORY
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
    // DISPLAY HISTORY
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
          Error loading maintenance history:
          ${error.message}
        </td>
      </tr>`;


    if (message) {

      message.textContent =
        "Unable to load equipment history.";

    }

  }

}
// ==========================================
// LOAD EQUIPMENT FOR EQUIPMENT HISTORY
// ==========================================

async function loadEquipmentHistoryDropdown() {

  const historyEquipmentSelect =
    document.getElementById("historyEquipmentId");

  if (!historyEquipmentSelect) {

    console.error(
      "Equipment History dropdown not found: historyEquipmentId"
    );

    return;

  }

  // ----------------------------------------
  // SHOW LOADING
  // ----------------------------------------

  historyEquipmentSelect.innerHTML =
    '<option value="">Loading equipment...</option>';


  // ----------------------------------------
  // GET EQUIPMENT FROM SUPABASE
  // ----------------------------------------

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


  // ----------------------------------------
  // HANDLE ERROR
  // ----------------------------------------

  if (error) {

    console.error(
      "Error loading Equipment History equipment:",
      error
    );

    historyEquipmentSelect.innerHTML =
      '<option value="">Unable to load equipment</option>';

    return;

  }


  // ----------------------------------------
  // CLEAR DROPDOWN
  // ----------------------------------------

  historyEquipmentSelect.innerHTML =
    '<option value="">Select equipment</option>';


  // ----------------------------------------
  // NO EQUIPMENT
  // ----------------------------------------

  if (
    !data ||
    data.length === 0
  ) {

    historyEquipmentSelect.innerHTML =
      '<option value="">No equipment found</option>';

    return;

  }


  // ----------------------------------------
  // ADD EQUIPMENT
  // ----------------------------------------

  data.forEach(
    equipment => {

      const option =
        document.createElement("option");


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


  // ----------------------------------------
  // CLEAR DEPARTMENT
  // ----------------------------------------

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
// LOAD MAINTENANCE REPORTS
// ==========================================

async function loadMaintenanceReports() {

  const reportTableBody =
    document.getElementById(
      "maintenanceReportBody"
    );


  if (!reportTableBody) {

    console.error(
      "Maintenance report table body not found."
    );

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


  // ----------------------------------------
  // GET REPORTS FROM SUPABASE VIEW
  // ----------------------------------------

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


  // ----------------------------------------
  // HANDLE ERROR
  // ----------------------------------------

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


  // ----------------------------------------
  // NO REPORTS
  // ----------------------------------------

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


  // ----------------------------------------
  // CLEAR TABLE
  // ----------------------------------------

  reportTableBody.innerHTML = "";


  // ----------------------------------------
  // DISPLAY EACH REPORT
  // ----------------------------------------

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


  // ----------------------------------------
  // DISPLAY USER NAME AND ROLE
  // ----------------------------------------

  welcomeText.textContent =

    `Welcome, ${
      profile["Full name"] ||
      user.email
    } (${
      profile.UserRole ||
      "User"
    })`;


  // ----------------------------------------
  // SHOW APPLICATION
  // ----------------------------------------

  loginView.classList.add(
    "hidden"
  );


  appView.classList.remove(
    "hidden"
  );


  // ----------------------------------------
  // LOAD FORM DROPDOWNS
  // ----------------------------------------

  await loadFormData();

await loadEquipmentHistoryDropdown();
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

loginForm.addEventListener(

  "submit",

  async function(event) {

    event.preventDefault();


    loginMessage.textContent =
      "Signing in...";


    const email =

      document

        .getElementById(
          "email"
        )

        .value

        .trim();


    const password =

      document

        .getElementById(
          "password"
        )

        .value;


    // --------------------------------------
    // VALIDATE LOGIN INPUT
    // --------------------------------------

    if (

      !email ||

      !password

    ) {

      loginMessage.textContent =

        "Please enter your email and password.";

      return;

    }


    // --------------------------------------
    // SUPABASE LOGIN
    // --------------------------------------

    const {

      data,

      error

    } = await client.auth.signInWithPassword({

      email: email,

      password: password

    });


    // --------------------------------------
    // LOGIN ERROR
    // --------------------------------------

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


    // --------------------------------------
    // LOAD APPLICATION
    // --------------------------------------

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

        "click",

        function() {

          // --------------------------------
          // HIDE ALL SECTIONS
          // --------------------------------

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


          // --------------------------------
          // GET SELECTED SECTION
          // --------------------------------

          const selectedSection =

            document.getElementById(

              button.dataset.section

            );


          // --------------------------------
          // SHOW SELECTED SECTION
          // --------------------------------

          if (
            selectedSection
          ) {

            selectedSection.classList.remove(
              "hidden"
            );

          }


          // --------------------------------
          // REFRESH MAINTENANCE REPORTS
          // --------------------------------

          if (

            button.dataset.section ===
            "maintenanceReports"

          ) {

            loadMaintenanceReports();

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


    // --------------------------------------
    // CHECK AUTHENTICATED USER
    // --------------------------------------

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

          .value ||

        null,


      Diagnosis:

        document

          .getElementById(
            "diagnosis"
          )

          .value ||

        null,


      ActionTaken:

        document

          .getElementById(
            "actionTaken"
          )

          .value ||

        null,


      PartUsed:

        document

          .getElementById(
            "partUsed"
          )

          .value ||

        null,


      RequiredPart:

        document

          .getElementById(
            "requiredPart"
          )

          .value ||

        null,


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


      // ------------------------------------
      // PART REQUESTED STATUS TEXT
      // ------------------------------------

      PartRequestedStatus:

        partRequestedStatus,


      // ------------------------------------
      // PART STATUS ID
      // ------------------------------------

      PartStatusID:

        partStatusSelect &&

        partStatusSelect.value

          ? Number(
              partStatusSelect.value
            )

          : null,


      // ------------------------------------
      // EQUIPMENT STATUS
      // ------------------------------------

      StatusID:

        Number(

          document

            .getElementById(
              "statusId"
            )

            .value

        ),


      // ------------------------------------
      // REMARKS
      // ------------------------------------

      Remarks:

        document

          .getElementById(
            "remarks"
          )

          .value ||

        null

    };


    // ======================================
    // INSERT REPORT INTO SUPABASE
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


    // ======================================
    // HANDLE INSERT ERROR
    // ======================================

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


    // ======================================
    // SUCCESS MESSAGE
    // ======================================

    maintenanceMessage.textContent =

      "Maintenance report submitted successfully.";


    // --------------------------------------
    // RESET FORM
    // --------------------------------------

    maintenanceForm.reset();


    // --------------------------------------
    // CLEAR DEPARTMENT
    // --------------------------------------

    if (departmentInput) {

      departmentInput.value = "";

    }


    // --------------------------------------
    // REFRESH REPORT TABLE
    // --------------------------------------

    await loadMaintenanceReports();

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
