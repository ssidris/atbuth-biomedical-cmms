// ==========================================
// ATBUTH BIOMEDICAL CMMS
// SUPABASE MOBILE WEB APPLICATION
// CORRECTED APP.JS - PART 1 OF 3
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

const equipmentRegistrationForm =
  document.getElementById(
    "equipmentRegistrationForm"
  );


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

    console.warn(
      "Dropdown not found:",
      selectId
    );

    return;

  }

  select.innerHTML =
    `<option value="">${placeholder}</option>`;

  try {

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

      select.innerHTML =
        `<option value="">Unable to load data</option>`;

      return;

    }


    for (
      const row of data || []
    ) {

      const option =
        document.createElement(
          "option"
        );


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

  catch (error) {

    console.error(
      `Unexpected error loading ${table}:`,
      error
    );

    select.innerHTML =
      `<option value="">Unable to load data</option>`;

  }

}


// ==========================================
// LOAD MAINTENANCE FORM DROPDOWNS
// ==========================================

async function loadMaintenanceFormData() {

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

      const equipmentName =
        row.EquipmentName || "";

      const bmeNumber =
        row.BMENumber || "";


      if (bmeNumber) {

        return (
          bmeNumber +
          " — " +
          equipmentName
        );

      }

      return equipmentName;

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

      const firstName =
        row.FirstName || "";

      const lastName =
        row.LastName || "";

      return (
        `${firstName} ${lastName}`
      ).trim();

    }

  );


  // ----------------------------------------
  // PM ENGINEERS
  // ----------------------------------------

  await loadLookup(

    "tblEngineers",

    "EngineerID",

    "FirstName",

    "pmEngineerId",

    "Select engineer",

    row => {

      const firstName =
        row.FirstName || "";

      const lastName =
        row.LastName || "";

      return (
        `${firstName} ${lastName}`
      ).trim();

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
// LOAD EQUIPMENT REGISTRATION DROPDOWNS
// ==========================================

async function loadEquipmentRegistrationDropdowns() {

  // ----------------------------------------
  // DEPARTMENT
  // ----------------------------------------

  await loadLookup(

    "tblDepartment",

    "DepartmentID",

    "DepartmentName",

    "newDepartmentId",

    "Select department"

  );


  // ----------------------------------------
  // CATEGORY
  // TABLE: tblEquipmentcategory
  // COLUMNS: CategoryID, CategoryName, Description
  // ----------------------------------------

  await loadLookup(

    "tblEquipmentcategory",

    "CategoryID",

    "CategoryName",

    "newCategoryId",

    "Select category"

  );


  // ----------------------------------------
  // EQUIPMENT STATUS
  // ----------------------------------------

  await loadLookup(

    "tblEquipmentStatus",

    "StatusID",

    "StatusName",

    "newStatusId",

    "Select status"

  );

}


// ==========================================
// LOAD ALL FORM DATA
// ==========================================

async function loadFormData() {

  await loadMaintenanceFormData();

  await loadEquipmentRegistrationDropdowns();

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
// MAINTENANCE EQUIPMENT CHANGE EVENT
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

    console.warn(
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


  if (message) {

    message.textContent = "";

  }


  details.innerHTML =
    "<p>Loading equipment details...</p>";


  tableBody.innerHTML =

    `<tr>
      <td colspan="11">
        Loading maintenance history...
      </td>
    </tr>`;


  if (!equipmentId) {

    details.innerHTML =
      "<p>Select an equipment to view its details.</p>";

    tableBody.innerHTML =

      `<tr>
        <td colspan="11">
          Select an equipment to view history.
        </td>
      </tr>`;

    return;

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
    // GET DEPARTMENT
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
    // GET ONLY SELECTED EQUIPMENT HISTORY
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

      throw new Error(
        "Unable to load equipment history: " +
        historyError.message
      );

    }


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
            ${report.JobOrderNumber || ""}
          </td>

          <td>
            ${report.EngineerName || ""}
          </td>

          <td>
            ${report.MaintenanceType || ""}
          </td>

          <td>
            ${report.FaultReported || ""}
          </td>

          <td>
            ${report.Diagnosis || ""}
          </td>

          <td>
            ${report.ActionTaken || ""}
          </td>

          <td>
            ${report.PartUsed || ""}
          </td>

          <td>
            ${report.RequiredPart || ""}
          </td>

          <td>
            ${report.StatusName || ""}
          </td>

          <td>
            ${report.Remarks || ""}
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

      loadEquipmentHistory(
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
      "reportsTableBody"
    );


  const loading =
    document.getElementById(
      "reportsLoading"
    );


  if (!reportTableBody) {

    return;

  }


  if (loading) {

    loading.textContent =
      "Loading reports...";

  }


  reportTableBody.innerHTML =

    `<tr>
      <td colspan="11">
        Loading maintenance reports...
      </td>
    </tr>`;


  try {

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


    if (error) {

      console.error(
        "Error loading maintenance reports:",
        error
      );


      reportTableBody.innerHTML =

        `<tr>
          <td colspan="11">
            Error loading reports:
            ${error.message}
          </td>
        </tr>`;

      return;

    }


    if (
      !data ||
      data.length === 0
    ) {

      reportTableBody.innerHTML =

        `<tr>
          <td colspan="11">
            No maintenance reports found.
          </td>
        </tr>`;

      return;

    }


    reportTableBody.innerHTML = "";


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
            ${report.JobOrderNumber || ""}
          </td>

          <td>
            ${report.BMENumber || ""}
          </td>

          <td>
            ${report.EquipmentName || ""}
          </td>

          <td>
            ${report.DepartmentName || ""}
          </td>

          <td>
            ${report.EngineerName || ""}
          </td>

          <td>
            ${report.MaintenanceType || ""}
          </td>

          <td>
            ${report.FaultReported || ""}
          </td>

          <td>
            ${report.ActionTaken || ""}
          </td>

          <td>
            ${report.StatusName || ""}
          </td>

          <td>
            ${report.Remarks || ""}
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


    reportTableBody.innerHTML =

      `<tr>
        <td colspan="11">
          Unable to load maintenance reports.
        </td>
      </tr>`;

  }

}
// ==========================================
// PM FORM ELEMENTS
// ==========================================

const preventiveMaintenanceForm =
  document.getElementById(
    "preventiveMaintenanceForm"
  );

const pmEquipmentSelect =
  document.getElementById(
    "pmEquipmentId"
  );

const pmEngineerSelect =
  document.getElementById(
    "pmEngineerId"
  );

const pmDepartmentInput =
  document.getElementById(
    "pmDepartmentName"
  );

const pmMessage =
  document.getElementById(
    "pmMessage"
  );


// ==========================================
// LOAD PM EQUIPMENT DROPDOWN
// ==========================================

async function loadPMEquipmentDropdown() {

  const select =
    document.getElementById(
      "pmEquipmentId"
    );

  if (!select) {

    console.error(
      "PM Equipment dropdown not found."
    );

    return;

  }

  select.innerHTML =
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
        "Error loading PM equipment:",
        error
      );

      select.innerHTML =
        '<option value="">Unable to load equipment</option>';

      return;

    }


    select.innerHTML =
      '<option value="">Select equipment</option>';


    if (
      !data ||
      data.length === 0
    ) {

      select.innerHTML =
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


        select.appendChild(
          option
        );

      }
    );

  }

  catch (error) {

    console.error(
      "PM equipment dropdown error:",
      error
    );

    select.innerHTML =
      '<option value="">Unable to load equipment</option>';

  }

}


// ==========================================
// LOAD PM ENGINEER DROPDOWN
// ==========================================

async function loadPMEngineerDropdown() {

  const select =
    document.getElementById(
      "pmEngineerId"
    );


  if (!select) {

    console.error(
      "PM Engineer dropdown not found."
    );

    return;

  }


  select.innerHTML =
    '<option value="">Loading engineers...</option>';


  try {

    const {
      data,
      error
    } = await client

      .from("tblEngineers")

      .select(
        "EngineerID, FirstName, LastName"
      )

      .order(
        "FirstName",
        {
          ascending: true
        }
      );


    if (error) {

      console.error(
        "Error loading PM engineers:",
        error
      );

      select.innerHTML =
        '<option value="">Unable to load engineers</option>';

      return;

    }


    select.innerHTML =
      '<option value="">Select engineer</option>';


    if (
      !data ||
      data.length === 0
    ) {

      select.innerHTML =
        '<option value="">No engineers found</option>';

      return;

    }


    data.forEach(
      engineer => {

        const option =
          document.createElement(
            "option"
          );


        option.value =
          engineer.EngineerID;


        const fullName =

          `${engineer.FirstName || ""} ${
            engineer.LastName || ""
          }`.trim();


        option.textContent =
          fullName || "Unnamed Engineer";


        select.appendChild(
          option
        );

      }
    );

  }

  catch (error) {

    console.error(
      "PM Engineer dropdown error:",
      error
    );

    select.innerHTML =
      '<option value="">Unable to load engineers</option>';

  }

}


// ==========================================
// LOAD PM DEPARTMENT
// ==========================================

async function loadPMDepartment(
  equipmentId
) {

  const departmentInput =
    document.getElementById(
      "pmDepartmentName"
    );


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

    // --------------------------------------
    // GET EQUIPMENT DEPARTMENT ID
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
        "PM equipment department error:",
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
        "PM department lookup error:",
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
      "Unexpected PM department error:",
      error
    );

    departmentInput.value =
      "Unable to load department";

  }

}


// ==========================================
// PM EQUIPMENT CHANGE EVENT
// ==========================================

if (pmEquipmentSelect) {

  pmEquipmentSelect.addEventListener(

    "change",

    function() {

      loadPMDepartment(
        this.value
      );

    }

  );

}


// ==========================================
// SUBMIT PREVENTIVE MAINTENANCE
// ==========================================

if (preventiveMaintenanceForm) {

  preventiveMaintenanceForm.addEventListener(

    "submit",

    async function(event) {

      event.preventDefault();


      if (pmMessage) {

        pmMessage.textContent =
          "Submitting Preventive Maintenance report...";

      }


      try {

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

          if (pmMessage) {

            pmMessage.textContent =
              "Your session has expired. Please log in again.";

          }

          return;

        }


        // ------------------------------------
        // GET FORM VALUES
        // ------------------------------------

        const equipmentValue =
          document.getElementById(
            "pmEquipmentId"
          ).value;


        const engineerValue =
          document.getElementById(
            "pmEngineerId"
          ).value;


        const pmDateValue =
          document.getElementById(
            "pmDate"
          ).value;


        const nextPMDateValue =
          document.getElementById(
            "nextPMDate"
          ).value;


        const workPerformedValue =
          document.getElementById(
            "workPerformed"
          ).value;


        const findingsValue =
          document.getElementById(
            "pmFindings"
          ).value;


        const recommendationsValue =
          document.getElementById(
            "pmRecommendations"
          ).value;


        const pmStatusValue =
          document.getElementById(
            "pmStatus"
          ).value;


        const remarksValue =
          document.getElementById(
            "pmRemarks"
          ).value;


        // ------------------------------------
        // VALIDATE REQUIRED FIELDS
        // ------------------------------------

        if (
          !equipmentValue ||
          !engineerValue ||
          !pmDateValue ||
          !nextPMDateValue ||
          !pmStatusValue
        ) {

          if (pmMessage) {

            pmMessage.textContent =
              "Please complete all required PM fields.";

          }

          return;

        }


        // ====================================
        // PREPARE PM PAYLOAD
        // ====================================

        const pmPayload = {

          EquipmentID:
            Number(
              equipmentValue
            ),

          PMDate:
            pmDateValue,

          NextPMDate:
            nextPMDateValue,

          EngineerID:
            Number(
              engineerValue
            ),

          // IMPORTANT:
          // This matches the actual Supabase
          // column name: Work Performed

          "Work Performed":
            workPerformedValue ||
            null,

          Findings:
            findingsValue ||
            null,

          Recommendations:
            recommendationsValue ||
            null,

          PMStatus:
            pmStatusValue,

          Remarks:
            remarksValue ||
            null

        };


        console.log(
          "PM payload:",
          pmPayload
        );


        // ====================================
        // INSERT PM RECORD
        // ====================================

        const {
          data,
          error
        } = await client

          .from(
            "tblPreventiveMaintenance"
          )

          .insert(
            pmPayload
          )

          .select();


        // ====================================
        // HANDLE ERROR
        // ====================================

        if (error) {

          console.error(
            "Preventive Maintenance error:",
            error
          );


          if (pmMessage) {

            pmMessage.textContent =
              "Error submitting PM report: " +
              error.message;

          }

          return;

        }


        // ====================================
        // SUCCESS
        // ====================================

        console.log(
          "PM record inserted successfully:",
          data
        );


        if (pmMessage) {

          pmMessage.textContent =
            "Preventive Maintenance report submitted successfully.";

        }


        // ------------------------------------
        // RESET FORM
        // ------------------------------------

        preventiveMaintenanceForm.reset();


        // ------------------------------------
        // CLEAR DEPARTMENT
        // ------------------------------------

        if (pmDepartmentInput) {

          pmDepartmentInput.value =
            "";

        }


        // ------------------------------------
        // REFRESH PM HISTORY
        // ------------------------------------

        if (
          typeof loadPMHistory ===
          "function"
        ) {

          await loadPMHistory();

        }


      }

      catch (error) {

        console.error(
          "Unexpected PM submission error:",
          error
        );


        if (pmMessage) {

          pmMessage.textContent =
            "Error submitting PM report: " +
            error.message;

        }

      }

    }

  );

}


// ==========================================
// INITIALIZE PM MODULE
// ==========================================

async function initializePreventiveMaintenance() {

  try {

    // Load PM equipment
    await loadPMEquipmentDropdown();


    // Load PM engineers
    await loadPMEngineerDropdown();

  }

  catch (error) {

    console.error(
      "PM initialization error:",
      error
    );

  }

}


// ==========================================
// START PM MODULE
// ==========================================

initializePreventiveMaintenance();


// ==========================================
// PREVENTIVE MAINTENANCE HISTORY
// ==========================================


// ==========================================
// LOAD PM HISTORY
// ==========================================

async function loadPMHistory() {

  const tableBody =
    document.getElementById(
      "pmTableBody"
    );


  const loadingMessage =
    document.getElementById(
      "pmLoading"
    );


  if (!tableBody) {

    console.warn(
      "PM history table body not found."
    );

    return;

  }


  if (loadingMessage) {

    loadingMessage.textContent =
      "Loading Preventive Maintenance records...";

  }


  tableBody.innerHTML = `

    <tr>

      <td colspan="12">

        Loading Preventive Maintenance records...

      </td>

    </tr>

  `;


  try {

    // ======================================
    // GET PM RECORDS
    // ======================================

    const {
      data: pmRecords,
      error: pmError
    } = await client

      .from(
        "tblPreventiveMaintenance"
      )

      .select(
        `
        PMID,
        EquipmentID,
        PMDate,
        NextPMDate,
        EngineerID,
        "Work Performed",
        Findings,
        Recommendations,
        PMStatus,
        Remarks
        `
      )

      .order(
        "PMDate",
        {
          ascending: false
        }
      );


    if (pmError) {

      console.error(
        "PM history error:",
        pmError
      );


      tableBody.innerHTML = `

        <tr>

          <td colspan="12">

            Error loading PM records:
            ${pmError.message}

          </td>

        </tr>

      `;


      if (loadingMessage) {

        loadingMessage.textContent =
          "";

      }


      return;

    }


    // ======================================
    // NO PM RECORDS
    // ======================================

    if (
      !pmRecords ||
      pmRecords.length === 0
    ) {

      tableBody.innerHTML = `

        <tr>

          <td colspan="12">

            No Preventive Maintenance records found.

          </td>

        </tr>

      `;


      if (loadingMessage) {

        loadingMessage.textContent =
          "";

      }


      return;

    }


    // ======================================
    // LOAD EQUIPMENT DATA
    // ======================================

    const {
      data: equipmentData,
      error: equipmentError
    } = await client

      .from(
        "tblEquipment"
      )

      .select(
        `
        EquipmentID,
        BMENumber,
        EquipmentName,
        DepartmentID
        `
      );


    if (equipmentError) {

      throw equipmentError;

    }


    // ======================================
    // LOAD DEPARTMENT DATA
    // ======================================

    const {
      data: departmentData,
      error: departmentError
    } = await client

      .from(
        "tblDepartment"
      )

      .select(
        `
        DepartmentID,
        DepartmentName
        `
      );


    if (departmentError) {

      throw departmentError;

    }


    // ======================================
    // LOAD ENGINEER DATA
    // ======================================

    const {
      data: engineerData,
      error: engineerError
    } = await client

      .from(
        "tblEngineers"
      )

      .select(
        `
        EngineerID,
        FirstName,
        LastName
        `
      );


    if (engineerError) {

      throw engineerError;

    }


    // ======================================
    // CREATE LOOKUP MAPS
    // ======================================

    const equipmentMap =
      new Map();

    const departmentMap =
      new Map();

    const engineerMap =
      new Map();


    (equipmentData || []).forEach(
      equipment => {

        equipmentMap.set(

          String(
            equipment.EquipmentID
          ),

          equipment

        );

      }
    );


    (departmentData || []).forEach(
      department => {

        departmentMap.set(

          String(
            department.DepartmentID
          ),

          department.DepartmentName

        );

      }
    );


    (engineerData || []).forEach(
      engineer => {

        engineerMap.set(

          String(
            engineer.EngineerID
          ),

          `${engineer.FirstName || ""} ${
            engineer.LastName || ""
          }`.trim()

        );

      }
    );


    // ======================================
    // DISPLAY PM RECORDS
    // ======================================

    tableBody.innerHTML =
      "";


    pmRecords.forEach(
      pm => {

        const row =
          document.createElement(
            "tr"
          );


        // ----------------------------------
        // EQUIPMENT
        // ----------------------------------

        const equipment =
          equipmentMap.get(

            String(
              pm.EquipmentID
            )

          );


        const equipmentName =

          equipment
            ? equipment.EquipmentName || ""
            : "";


        const bmeNumber =

          equipment
            ? equipment.BMENumber || ""
            : "";


        // ----------------------------------
        // DEPARTMENT
        // ----------------------------------

        const departmentName =

          equipment &&
          equipment.DepartmentID !== null

            ? (

                departmentMap.get(

                  String(
                    equipment.DepartmentID
                  )

                ) || ""

              )

            : "";


        // ----------------------------------
        // ENGINEER
        // ----------------------------------

        const engineerName =

          engineerMap.get(

            String(
              pm.EngineerID
            )

          ) || "";


        // ----------------------------------
        // PM DATE
        // ----------------------------------

        const pmDate =

          pm.PMDate

            ? new Date(
                pm.PMDate
              ).toLocaleDateString()

            : "";


        // ----------------------------------
        // NEXT PM DATE
        // ----------------------------------

        const nextPMDate =

          pm.NextPMDate

            ? new Date(
                pm.NextPMDate
              ).toLocaleDateString()

            : "";


        // ==================================
        // DETERMINE PM DUE STATUS
        // ==================================

        let dueStatus =
          "";


        if (pm.NextPMDate) {

          const today =
            new Date();


          today.setHours(
            0,
            0,
            0,
            0
          );


          const nextDate =
            new Date(
              pm.NextPMDate
            );


          nextDate.setHours(
            0,
            0,
            0,
            0
          );


          const difference =

            nextDate.getTime() -

            today.getTime();


          const daysRemaining =

            Math.ceil(

              difference /

              (
                1000 *
                60 *
                60 *
                24
              )

            );


          if (
            daysRemaining < 0
          ) {

            dueStatus =
              "OVERDUE";

          }

          else if (
            daysRemaining === 0
          ) {

            dueStatus =
              "DUE TODAY";

          }

          else if (
            daysRemaining <= 30
          ) {

            dueStatus =
              "DUE SOON";

          }

          else {

            dueStatus =
              "NOT DUE";

          }

        }


        // ==================================
        // CREATE TABLE ROW
        // ==================================

        row.innerHTML = `

          <td>
            ${bmeNumber}
          </td>

          <td>
            ${equipmentName}
          </td>

          <td>
            ${departmentName}
          </td>

          <td>
            ${pmDate}
          </td>

          <td>
            ${nextPMDate}
          </td>

          <td>
            ${dueStatus}
          </td>

          <td>
            ${engineerName}
          </td>

          <td>
            ${pm["Work Performed"] || ""}
          </td>

          <td>
            ${pm.Findings || ""}
          </td>

          <td>
            ${pm.Recommendations || ""}
          </td>

          <td>
            ${pm.PMStatus || ""}
          </td>

          <td>
            ${pm.Remarks || ""}
          </td>

        `;


        tableBody.appendChild(
          row
        );

      }
    );


    if (loadingMessage) {

      loadingMessage.textContent =
        "";

    }

  }

  catch (error) {

    console.error(
      "Unexpected PM history error:",
      error
    );


    tableBody.innerHTML = `

      <tr>

        <td colspan="12">

          Unable to load Preventive Maintenance history.

        </td>

      </tr>

    `;


    if (loadingMessage) {

      loadingMessage.textContent =
        error.message;

    }

  }

}


// ==========================================
// LOAD PM HISTORY WHEN MENU IS OPENED
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

          if (

            this.dataset.section ===
            "pmSection"

          ) {

            loadPMHistory();

          }

        }

      );

    }

  );


// ==========================================
// REFRESH PM HISTORY AFTER SUBMISSION
// ==========================================

if (preventiveMaintenanceForm) {

  preventiveMaintenanceForm.addEventListener(

    "submit",

    function() {

      setTimeout(

        function() {

          loadPMHistory();

        },

        1000

      );

    }

  );

}
// ==========================================
// PREVENTIVE MAINTENANCE FORM ELEMENTS
// ==========================================

const preventiveMaintenanceForm =
  document.getElementById(
    "preventiveMaintenanceForm"
  );

const pmEquipmentSelect =
  document.getElementById(
    "pmEquipmentId"
  );

const pmEngineerSelect =
  document.getElementById(
    "pmEngineerId"
  );

const pmDepartmentInput =
  document.getElementById(
    "pmDepartmentName"
  );

const pmMessage =
  document.getElementById(
    "pmMessage"
  );


// ==========================================
// LOAD PM EQUIPMENT DROPDOWN
// ==========================================

async function loadPMEquipmentDropdown() {

  const select =
    document.getElementById(
      "pmEquipmentId"
    );

  if (!select) {
    console.warn(
      "PM Equipment dropdown not found."
    );
    return;
  }

  select.innerHTML =
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
        "PM equipment error:",
        error
      );

      select.innerHTML =
        '<option value="">Unable to load equipment</option>';

      return;

    }


    select.innerHTML =
      '<option value="">Select equipment</option>';


    (data || []).forEach(

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

        select.appendChild(
          option
        );

      }

    );

  }

  catch (error) {

    console.error(
      "Unexpected PM equipment error:",
      error
    );

    select.innerHTML =
      '<option value="">Unable to load equipment</option>';

  }

}


// ==========================================
// LOAD PM ENGINEER DROPDOWN
// ==========================================

async function loadPMEngineerDropdown() {

  const select =
    document.getElementById(
      "pmEngineerId"
    );

  if (!select) {

    console.warn(
      "PM Engineer dropdown not found."
    );

    return;

  }


  select.innerHTML =
    '<option value="">Loading engineers...</option>';


  try {

    const {
      data,
      error
    } = await client

      .from("tblEngineers")

      .select(
        "EngineerID, FirstName, LastName"
      )

      .order(
        "FirstName",
        {
          ascending: true
        }
      );


    if (error) {

      console.error(
        "PM Engineer loading error:",
        error
      );

      select.innerHTML =
        '<option value="">Unable to load engineers</option>';

      return;

    }


    select.innerHTML =
      '<option value="">Select engineer</option>';


    if (
      !data ||
      data.length === 0
    ) {

      select.innerHTML =
        '<option value="">No engineers found</option>';

      return;

    }


    data.forEach(

      engineer => {

        const option =
          document.createElement(
            "option"
          );


        option.value =
          engineer.EngineerID;


        option.textContent =

          `${engineer.FirstName || ""} ${
            engineer.LastName || ""
          }`.trim();


        select.appendChild(
          option
        );

      }

    );

  }

  catch (error) {

    console.error(
      "Unexpected PM Engineer error:",
      error
    );

    select.innerHTML =
      '<option value="">Unable to load engineers</option>';

  }

}


// ==========================================
// LOAD PM DEPARTMENT
// ==========================================

async function loadPMDepartment(
  equipmentId
) {

  const departmentInput =
    document.getElementById(
      "pmDepartmentName"
    );


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
        "PM department equipment error:",
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
        "PM department lookup error:",
        departmentError
      );

      departmentInput.value =
        "Unable to load department";

      return;

    }


    departmentInput.value =

      department

        ? department.DepartmentName || ""

        : "Department not found";

  }

  catch (error) {

    console.error(
      "Unexpected PM department error:",
      error
    );

    departmentInput.value =
      "Unable to load department";

  }

}


// ==========================================
// PM EQUIPMENT CHANGE EVENT
// ==========================================

if (pmEquipmentSelect) {

  pmEquipmentSelect.addEventListener(

    "change",

    function() {

      loadPMDepartment(
        this.value
      );

    }

  );

}


// ==========================================
// SUBMIT PREVENTIVE MAINTENANCE
// ==========================================

if (preventiveMaintenanceForm) {

  preventiveMaintenanceForm.addEventListener(

    "submit",

    async function(event) {

      event.preventDefault();


      if (pmMessage) {

        pmMessage.textContent =
          "Submitting Preventive Maintenance report...";

      }


      try {

        // ----------------------------------
        // CHECK LOGIN
        // ----------------------------------

        const {

          data: authData,

          error: authError

        } = await client.auth.getUser();


        if (

          authError ||

          !authData ||

          !authData.user

        ) {

          if (pmMessage) {

            pmMessage.textContent =
              "Your session has expired. Please log in again.";

          }

          return;

        }


        // ----------------------------------
        // GET FORM VALUES
        // ----------------------------------

        const equipmentValue =
          document.getElementById(
            "pmEquipmentId"
          ).value;


        const engineerValue =
          document.getElementById(
            "pmEngineerId"
          ).value;


        const pmDateValue =
          document.getElementById(
            "pmDate"
          ).value;


        const nextPMDateValue =
          document.getElementById(
            "nextPMDate"
          ).value;


        const workPerformedElement =
          document.getElementById(
            "workPerformed"
          );


        const findingsElement =
          document.getElementById(
            "pmFindings"
          );


        const recommendationsElement =
          document.getElementById(
            "pmRecommendations"
          );


        const pmStatusValue =
          document.getElementById(
            "pmStatus"
          ).value;


        const pmRemarksElement =
          document.getElementById(
            "pmRemarks"
          );


        // ----------------------------------
        // VALIDATE
        // ----------------------------------

        if (

          !equipmentValue ||

          !engineerValue ||

          !pmDateValue ||

          !nextPMDateValue ||

          !pmStatusValue

        ) {

          if (pmMessage) {

            pmMessage.textContent =
              "Please complete all required PM fields.";

          }

          return;

        }


        // ----------------------------------
        // PREPARE PM DATA
        // IMPORTANT:
        // DATABASE COLUMN IS "Work Performed"
        // ----------------------------------

        const pmPayload = {

          EquipmentID:
            Number(
              equipmentValue
            ),

          PMDate:
            pmDateValue,

          NextPMDate:
            nextPMDateValue,

          EngineerID:
            Number(
              engineerValue
            ),

          "Work Performed":

            workPerformedElement

              ? workPerformedElement.value.trim() || null

              : null,

          Findings:

            findingsElement

              ? findingsElement.value.trim() || null

              : null,

          Recommendations:

            recommendationsElement

              ? recommendationsElement.value.trim() || null

              : null,

          PMStatus:
            pmStatusValue,

          Remarks:

            pmRemarksElement

              ? pmRemarksElement.value.trim() || null

              : null

        };


        console.log(
          "PM Payload:",
          pmPayload
        );


        // ----------------------------------
        // INSERT PM RECORD
        // ----------------------------------

        const {

          data,

          error

        } = await client

          .from(
            "tblPreventiveMaintenance"
          )

          .insert(
            pmPayload
          )

          .select();


        // ----------------------------------
        // HANDLE ERROR
        // ----------------------------------

        if (error) {

          console.error(
            "Preventive Maintenance insert error:",
            error
          );

          if (pmMessage) {

            pmMessage.textContent =
              "Error submitting PM report: " +
              error.message;

          }

          return;

        }


        // ----------------------------------
        // SUCCESS
        // ----------------------------------

        console.log(
          "PM record successfully inserted:",
          data
        );


        if (pmMessage) {

          pmMessage.textContent =
            "Preventive Maintenance report submitted successfully.";

        }


        // ----------------------------------
        // RESET FORM
        // ----------------------------------

        preventiveMaintenanceForm.reset();


        if (pmDepartmentInput) {

          pmDepartmentInput.value =
            "";

        }


        // ----------------------------------
        // RELOAD PM DROPDOWNS
        // ----------------------------------

        await loadPMEquipmentDropdown();

        await loadPMEngineerDropdown();


        // ----------------------------------
        // REFRESH PM HISTORY
        // ----------------------------------

        await loadPMHistory();


        // ----------------------------------
        // CLEAR MESSAGE
        // ----------------------------------

        setTimeout(

          function() {

            if (pmMessage) {

              pmMessage.textContent =
                "";

            }

          },

          5000

        );

      }

      catch (error) {

        console.error(
          "Unexpected PM submission error:",
          error
        );


        if (pmMessage) {

          pmMessage.textContent =
            "Error submitting PM report: " +
            error.message;

        }

      }

    }

  );

}


// ==========================================
// PREVENTIVE MAINTENANCE HISTORY
// ==========================================

async function loadPMHistory() {

  const tableBody =
    document.getElementById(
      "pmTableBody"
    );


  const loadingMessage =
    document.getElementById(
      "pmLoading"
    );


  if (!tableBody) {

    console.warn(
      "PM history table not found."
    );

    return;

  }


  if (loadingMessage) {

    loadingMessage.textContent =
      "Loading Preventive Maintenance records...";

  }


  tableBody.innerHTML = `

    <tr>

      <td colspan="12">

        Loading Preventive Maintenance records...

      </td>

    </tr>

  `;


  try {

    // --------------------------------------
    // LOAD PM RECORDS
    // --------------------------------------

    const {

      data: pmRecords,

      error: pmError

    } = await client

      .from(
        "tblPreventiveMaintenance"
      )

      .select(
        `
        PMID,
        EquipmentID,
        PMDate,
        NextPMDate,
        EngineerID,
        "Work Performed",
        Findings,
        Recommendations,
        PMStatus,
        Remarks
        `
      )

      .order(
        "PMDate",
        {
          ascending: false
        }
      );


    if (pmError) {

      throw pmError;

    }


    if (

      !pmRecords ||

      pmRecords.length === 0

    ) {

      tableBody.innerHTML = `

        <tr>

          <td colspan="12">

            No Preventive Maintenance records found.

          </td>

        </tr>

      `;


      if (loadingMessage) {

        loadingMessage.textContent =
          "";

      }


      return;

    }


    // --------------------------------------
    // LOAD EQUIPMENT
    // --------------------------------------

    const {

      data: equipmentData,

      error: equipmentError

    } = await client

      .from(
        "tblEquipment"
      )

      .select(
        `
        EquipmentID,
        BMENumber,
        EquipmentName,
        DepartmentID
        `
      );


    if (equipmentError) {

      throw equipmentError;

    }


    // --------------------------------------
    // LOAD DEPARTMENTS
    // --------------------------------------

    const {

      data: departmentData,

      error: departmentError

    } = await client

      .from(
        "tblDepartment"
      )

      .select(
        `
        DepartmentID,
        DepartmentName
        `
      );


    if (departmentError) {

      throw departmentError;

    }


    // --------------------------------------
    // LOAD ENGINEERS
    // --------------------------------------

    const {

      data: engineerData,

      error: engineerError

    } = await client

      .from(
        "tblEngineers"
      )

      .select(
        `
        EngineerID,
        FirstName,
        LastName
        `
      );


    if (engineerError) {

      throw engineerError;

    }


    // --------------------------------------
    // CREATE LOOKUP MAPS
    // --------------------------------------

    const equipmentMap =
      new Map();


    const departmentMap =
      new Map();


    const engineerMap =
      new Map();


    (equipmentData || []).forEach(

      equipment => {

        equipmentMap.set(

          String(
            equipment.EquipmentID
          ),

          equipment

        );

      }

    );


    (departmentData || []).forEach(

      department => {

        departmentMap.set(

          String(
            department.DepartmentID
          ),

          department.DepartmentName

        );

      }

    );


    (engineerData || []).forEach(

      engineer => {

        engineerMap.set(

          String(
            engineer.EngineerID
          ),

          `${engineer.FirstName || ""} ${
            engineer.LastName || ""
          }`.trim()

        );

      }

    );


    // --------------------------------------
    // DISPLAY RECORDS
    // --------------------------------------

    tableBody.innerHTML =
      "";


    pmRecords.forEach(

      pm => {

        const equipment =
          equipmentMap.get(

            String(
              pm.EquipmentID
            )

          );


        const equipmentName =

          equipment

            ? equipment.EquipmentName || ""

            : "";


        const bmeNumber =

          equipment

            ? equipment.BMENumber || ""

            : "";


        const departmentName =

          equipment &&

          equipment.DepartmentID !== null

            ? (

                departmentMap.get(

                  String(
                    equipment.DepartmentID
                  )

                ) || ""

              )

            : "";


        const engineerName =

          engineerMap.get(

            String(
              pm.EngineerID
            )

          ) || "";


        const pmDate =

          pm.PMDate

            ? new Date(
                pm.PMDate
              ).toLocaleDateString()

            : "";


        const nextPMDate =

          pm.NextPMDate

            ? new Date(
                pm.NextPMDate
              ).toLocaleDateString()

            : "";


        // ----------------------------------
        // CALCULATE DUE STATUS
        // ----------------------------------

        let dueStatus =
          "";


        if (pm.NextPMDate) {

          const today =
            new Date();


          today.setHours(
            0,
            0,
            0,
            0
          );


          const nextDate =
            new Date(
              pm.NextPMDate
            );


          nextDate.setHours(
            0,
            0,
            0,
            0
          );


          const difference =

            nextDate.getTime() -

            today.getTime();


          const daysRemaining =

            Math.ceil(

              difference /

              (
                1000 *
                60 *
                60 *
                24
              )

            );


          if (
            daysRemaining < 0
          ) {

            dueStatus =
              "OVERDUE";

          }

          else if (
            daysRemaining === 0
          ) {

            dueStatus =
              "DUE TODAY";

          }

          else if (
            daysRemaining <= 30
          ) {

            dueStatus =
              "DUE SOON";

          }

          else {

            dueStatus =
              "NOT DUE";

          }

        }


        // ----------------------------------
        // CREATE ROW
        // ----------------------------------

        const row =
          document.createElement(
            "tr"
          );


        row.innerHTML = `

          <td>
            ${bmeNumber}
          </td>

          <td>
            ${equipmentName}
          </td>

          <td>
            ${departmentName}
          </td>

          <td>
            ${pmDate}
          </td>

          <td>
            ${nextPMDate}
          </td>

          <td>
            ${dueStatus}
          </td>

          <td>
            ${engineerName}
          </td>

          <td>
            ${pm["Work Performed"] || ""}
          </td>

          <td>
            ${pm.Findings || ""}
          </td>

          <td>
            ${pm.Recommendations || ""}
          </td>

          <td>
            ${pm.PMStatus || ""}
          </td>

          <td>
            ${pm.Remarks || ""}
          </td>

        `;


        tableBody.appendChild(
          row
        );

      }

    );


    if (loadingMessage) {

      loadingMessage.textContent =
        "";

    }

  }

  catch (error) {

    console.error(
      "PM history error:",
      error
    );


    tableBody.innerHTML = `

      <tr>

        <td colspan="12">

          Unable to load Preventive Maintenance history.

        </td>

      </tr>

    `;


    if (loadingMessage) {

      loadingMessage.textContent =
        error.message;

    }

  }

}


// ==========================================
// MENU EVENTS FOR PM
// ==========================================

document
  .querySelectorAll(
    ".menu button"
  )
  .forEach(

    button => {

      button.addEventListener(

        "click",

        async function() {

          if (

            this.dataset.section ===
            "pmSection"

          ) {

            await loadPMEquipmentDropdown();

            await loadPMEngineerDropdown();

            await loadPMHistory();

          }

        }

      );

    }

  );


// ==========================================
// LOGIN FORM
// ==========================================

if (loginForm) {

  loginForm.addEventListener(

    "submit",

    async function(event) {

      event.preventDefault();


      if (loginMessage) {

        loginMessage.textContent =
          "Signing in...";

      }


      try {

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


        const {

          data,

          error

        } = await client.auth.signInWithPassword({

          email:
            email,

          password:
            password

        });


        if (error) {

          throw error;

        }


        if (

          !data ||

          !data.user

        ) {

          throw new Error(
            "Login was not completed."
          );

        }


        await showApp(
          data.user
        );


        if (loginMessage) {

          loginMessage.textContent =
            "";

        }

      }

      catch (error) {

        console.error(
          "Login error:",
          error
        );


        if (loginMessage) {

          loginMessage.textContent =
            "Login failed: " +
            error.message;

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


      if (loginForm) {

        loginForm.reset();

      }


      if (loginMessage) {

        loginMessage.textContent =
          "";

      }

    }

  );

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
  // WELCOME MESSAGE
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
  // SHOW APP
  // ----------------------------------------

  if (loginView) {

    loginView.classList.add(
      "hidden"
    );

  }


  if (appView) {

    appView.classList.remove(
      "hidden"
    );

  }


  // ----------------------------------------
  // LOAD ALL DATA
  // ----------------------------------------

  await loadMaintenanceFormData();

  await loadEquipmentRegistrationDropdowns();

  await loadEquipmentHistoryDropdown();

  await loadPMEquipmentDropdown();

  await loadPMEngineerDropdown();

  await loadMaintenanceReports();

}


// ==========================================
// INITIALIZE APPLICATION
// ==========================================

async function initializeApp() {

  try {

    const {

      data,

      error

    } = await client.auth.getSession();


    if (error) {

      throw error;

    }


    if (

      data &&

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


    if (loginView) {

      loginView.classList.remove(
        "hidden"
      );

    }


    if (appView) {

      appView.classList.add(
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
// START APPLICATION
// ==========================================

initializeApp();
