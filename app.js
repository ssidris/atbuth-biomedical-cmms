// ==========================================
// ATBUTH BIOMEDICAL CMMS
// SUPABASE MOBILE WEB APPLICATION
// JAVASCRIPT - PART 1 OF 3
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

    (data || []).forEach(
      row => {

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
    );

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

  // EQUIPMENT

  await loadLookup(
    "tblEquipment",
    "EquipmentID",
    "EquipmentName",
    "equipmentId",
    "Select equipment",
    row => {

      const bme =
        row.BMENumber || "";

      const name =
        row.EquipmentName || "";

      return bme
        ? `${bme} — ${name}`
        : name;

    }
  );


  // ENGINEERS

  await loadLookup(
    "tblEngineers",
    "EngineerID",
    "FirstName",
    "engineerId",
    "Select engineer",
    row => {

      return (
        `${row.FirstName || ""} ` +
        `${row.LastName || ""}`
      ).trim();

    }
  );


  // MAINTENANCE TYPE

  await loadLookup(
    "tblMaintenanceType",
    "MaintenanceTypeID",
    "MaintenanceType",
    "maintenanceTypeId",
    "Select maintenance type"
  );


  // PART REQUESTED STATUS

  await loadLookup(
    "tblPartRequestedStatus",
    "PartStatusID",
    "PartStatusName",
    "partStatusId",
    "Select part status"
  );


  // EQUIPMENT STATUS

  await loadLookup(
    "tblEquipmentStatus",
    "StatusID",
    "StatusName",
    "statusId",
    "Select equipment status"
  );

}


// ==========================================
// LOAD PM ENGINEER DROPDOWN
// ==========================================

async function loadPMEngineerDropdown() {

  await loadLookup(
    "tblEngineers",
    "EngineerID",
    "FirstName",
    "pmEngineerId",
    "Select engineer",
    row => {

      return (
        `${row.FirstName || ""} ` +
        `${row.LastName || ""}`
      ).trim();

    }
  );

}


// ==========================================
// LOAD PM EQUIPMENT DROPDOWN
// ==========================================

async function loadPMEquipmentDropdown() {

  await loadLookup(
    "tblEquipment",
    "EquipmentID",
    "EquipmentName",
    "pmEquipmentId",
    "Select equipment",
    row => {

      const bme =
        row.BMENumber || "";

      const name =
        row.EquipmentName || "";

      return bme
        ? `${bme} — ${name}`
        : name;

    }
  );

}


// ==========================================
// LOAD EQUIPMENT REGISTRATION DROPDOWNS
// ==========================================

async function loadEquipmentRegistrationDropdowns() {

  // DEPARTMENT

  await loadLookup(
    "tblDepartment",
    "DepartmentID",
    "DepartmentName",
    "newDepartmentId",
    "Select department"
  );


  // CATEGORY
  // IMPORTANT:
  // TABLE NAME IS tblEquipmentcategory

  await loadLookup(
    "tblEquipmentcategory",
    "CategoryID",
    "CategoryName",
    "newCategoryId",
    "Select category"
  );


  // EQUIPMENT STATUS

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

  await loadPMEquipmentDropdown();

  await loadPMEngineerDropdown();

  await loadEquipmentRegistrationDropdowns();

  await loadEquipmentHistoryDropdown();

}


// ==========================================
// LOAD DEPARTMENT FOR EQUIPMENT
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
      .select("DepartmentID")
      .eq(
        "EquipmentID",
        equipmentId
      )
      .maybeSingle();

    if (equipmentError) {
      throw equipmentError;
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
      .select("DepartmentName")
      .eq(
        "DepartmentID",
        equipment.DepartmentID
      )
      .maybeSingle();

    if (departmentError) {
      throw departmentError;
    }

    departmentInput.value =
      department
        ? department.DepartmentName || ""
        : "Department not found";

  }

  catch (error) {

    console.error(
      "Department loading error:",
      error
    );

    departmentInput.value =
      "Unable to load department";

  }

}


// ==========================================
// MAINTENANCE EQUIPMENT CHANGE
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
// LOAD PM DEPARTMENT
// ==========================================

async function loadPMDepartment(
  equipmentId
) {

  const input =
    document.getElementById(
      "pmDepartmentName"
    );

  if (!input) {
    return;
  }

  input.value = "";

  if (!equipmentId) {
    return;
  }

  input.value =
    "Loading department...";

  try {

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
      throw equipmentError;
    }

    if (!equipment) {

      input.value =
        "Equipment not found";

      return;
    }

    if (
      equipment.DepartmentID === null ||
      equipment.DepartmentID === undefined
    ) {

      input.value =
        "No department assigned";

      return;
    }

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
      throw departmentError;
    }

    input.value =
      department
        ? department.DepartmentName || ""
        : "Department not found";

  }

  catch (error) {

    console.error(
      "PM department error:",
      error
    );

    input.value =
      "Unable to load department";

  }

}


// ==========================================
// PM EQUIPMENT CHANGE EVENT
// ==========================================

const pmEquipmentSelect =
  document.getElementById(
    "pmEquipmentId"
  );

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
// LOAD EQUIPMENT HISTORY DROPDOWN
// ==========================================

async function loadEquipmentHistoryDropdown() {

  const select =
    document.getElementById(
      "historyEquipmentId"
    );

  if (!select) {
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
      throw error;
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
      "History equipment error:",
      error
    );

    select.innerHTML =
      '<option value="">Unable to load equipment</option>';

  }

}


// ==========================================
// EQUIPMENT HISTORY
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
    return;
  }

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
            Equipment not found.
          </td>
        </tr>`;

      return;
    }

    let departmentName =
      "Not assigned";

    if (
      equipment.DepartmentID !== null &&
      equipment.DepartmentID !== undefined
    ) {

      const {
        data: department
      } = await client
        .from("tblDepartment")
        .select("DepartmentName")
        .eq(
          "DepartmentID",
          equipment.DepartmentID
        )
        .maybeSingle();

      if (department) {
        departmentName =
          department.DepartmentName ||
          "Not assigned";
      }

    }

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
      "Equipment history error:",
      error
    );

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
// HISTORY CHANGE EVENT
// ==========================================

const historyEquipmentSelect =
  document.getElementById(
    "historyEquipmentId"
  );

if (historyEquipmentSelect) {

  historyEquipmentSelect.addEventListener(
    "change",
    function() {

      if (this.value) {

        loadEquipmentHistory(
          this.value
        );

      }

      else {

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

      }

    }
  );

}
// ==========================================
// ATBUTH BIOMEDICAL CMMS
// JAVASCRIPT - PART 2 OF 3
// ==========================================


// ==========================================
// LOAD USER PROFILE
// ==========================================

async function loadUserProfile(userId) {

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
      .from("vwMaintenanceReport")
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
// EQUIPMENT REGISTRATION
// ==========================================

if (equipmentRegistrationForm) {

  equipmentRegistrationForm.addEventListener(
    "submit",
    async function(event) {

      event.preventDefault();

      const message =
        document.getElementById(
          "equipmentRegistrationMessage"
        );

      if (message) {

        message.textContent =
          "Registering equipment...";

      }

      try {

        // ------------------------------------
        // GET FORM VALUES
        // ------------------------------------

        const bmeNumber =
          document.getElementById(
            "newBmeNumber"
          ).value.trim();

        const equipmentName =
          document.getElementById(
            "newEquipmentName"
          ).value.trim();

        const manufacturer =
          document.getElementById(
            "newManufacturer"
          ).value.trim();

        const model =
          document.getElementById(
            "newModel"
          ).value.trim();

        const serialNumber =
          document.getElementById(
            "newSerialNumber"
          ).value.trim();

        const departmentId =
          document.getElementById(
            "newDepartmentId"
          ).value;

        const categoryId =
          document.getElementById(
            "newCategoryId"
          ).value;

        const statusId =
          document.getElementById(
            "newStatusId"
          ).value;

        const location =
          document.getElementById(
            "newLocation"
          ).value.trim();

        const remarks =
          document.getElementById(
            "newEquipmentRemarks"
          ).value.trim();


        // ------------------------------------
        // VALIDATION
        // ------------------------------------

        if (
          !bmeNumber ||
          !equipmentName ||
          !departmentId ||
          !categoryId ||
          !statusId
        ) {

          if (message) {

            message.textContent =
              "Please complete all required fields.";

          }

          return;

        }


        // ------------------------------------
        // CHECK DUPLICATE BME NUMBER
        // ------------------------------------

        const {
          data: existingEquipment,
          error: checkError
        } = await client
          .from("tblEquipment")
          .select("EquipmentID")
          .eq(
            "BMENumber",
            bmeNumber
          )
          .maybeSingle();

        if (checkError) {

          throw new Error(
            "Unable to check BME Number: " +
            checkError.message
          );

        }

        if (existingEquipment) {

          if (message) {

            message.textContent =
              "This BME Number already exists. Please enter a unique BME Number.";

          }

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
            Number(departmentId),

          CategoryID:
            Number(categoryId),

          StatusID:
            Number(statusId),

          Location:
            location || null,

          Remarks:
            remarks || null

        };


        // ------------------------------------
        // INSERT EQUIPMENT
        // ------------------------------------

        const {
          data,
          error
        } = await client
          .from("tblEquipment")
          .insert(
            equipmentData
          )
          .select()
          .single();

        if (error) {

          throw error;

        }


        // ------------------------------------
        // SUCCESS
        // ------------------------------------

        console.log(
          "Equipment registered successfully:",
          data
        );

        if (message) {

          message.textContent =
            "Equipment registered successfully.";

        }


        equipmentRegistrationForm.reset();


        // ------------------------------------
        // REFRESH DROPDOWNS
        // ------------------------------------

        await loadMaintenanceFormData();

        await loadPMEquipmentDropdown();

        await loadEquipmentHistoryDropdown();


        setTimeout(
          function() {

            if (message) {
              message.textContent = "";
            }

          },
          5000
        );

      }

      catch (error) {

        console.error(
          "Equipment registration error:",
          error
        );

        if (message) {

          message.textContent =
            "Error registering equipment: " +
            error.message;

        }

      }

    }
  );

}


// ==========================================
// SUBMIT MAINTENANCE REPORT
// ==========================================

if (maintenanceForm) {

  maintenanceForm.addEventListener(
    "submit",
    async function(event) {

      event.preventDefault();

      if (maintenanceMessage) {

        maintenanceMessage.textContent =
          "Submitting report...";

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
          !authData.user
        ) {

          throw new Error(
            "Your session has expired. Please log in again."
          );

        }


        // ----------------------------------
        // GET VALUES
        // ----------------------------------

        const equipmentValue =
          document.getElementById(
            "equipmentId"
          ).value;

        const engineerValue =
          document.getElementById(
            "engineerId"
          ).value;

        const maintenanceTypeValue =
          document.getElementById(
            "maintenanceTypeId"
          ).value;

        const statusValue =
          document.getElementById(
            "statusId"
          ).value;

        const partStatusSelect =
          document.getElementById(
            "partStatusId"
          );


        // ----------------------------------
        // VALIDATE
        // ----------------------------------

        if (
          !equipmentValue ||
          !engineerValue ||
          !maintenanceTypeValue ||
          !statusValue
        ) {

          throw new Error(
            "Please complete all required fields."
          );

        }


        // ----------------------------------
        // PREPARE PAYLOAD
        // ----------------------------------

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


        const payload = {

          JobOrderNumber:
            document.getElementById(
              "jobOrderNumber"
            ).value
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
            ).value || null,

          Diagnosis:
            document.getElementById(
              "diagnosis"
            ).value || null,

          ActionTaken:
            document.getElementById(
              "actionTaken"
            ).value || null,

          PartUsed:
            document.getElementById(
              "partUsed"
            ).value || null,

          RequiredPart:
            document.getElementById(
              "requiredPart"
            ).value || null,

          QuantityRequired:
            document.getElementById(
              "quantityRequired"
            ).value
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
            ).value || null

        };


        // ----------------------------------
        // INSERT REPORT
        // ----------------------------------

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
          throw error;
        }


        // ----------------------------------
        // SUCCESS
        // ----------------------------------

        if (maintenanceMessage) {

          maintenanceMessage.textContent =
            "Maintenance report submitted successfully.";

        }

        maintenanceForm.reset();

        if (departmentInput) {
          departmentInput.value = "";
        }

        await loadMaintenanceReports();


        setTimeout(
          function() {

            if (maintenanceMessage) {
              maintenanceMessage.textContent = "";
            }

          },
          5000
        );

      }

      catch (error) {

        console.error(
          "Maintenance report error:",
          error
        );

        if (maintenanceMessage) {

          maintenanceMessage.textContent =
            "Error submitting report: " +
            error.message;

        }

      }

    }
  );

}


// ==========================================
// PREVENTIVE MAINTENANCE FORM
// ==========================================

const preventiveMaintenanceForm =
  document.getElementById(
    "preventiveMaintenanceForm"
  );

const pmMessage =
  document.getElementById(
    "pmMessage"
  );

const pmDepartmentInput =
  document.getElementById(
    "pmDepartmentName"
  );


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
          !authData.user
        ) {

          throw new Error(
            "Your session has expired. Please log in again."
          );

        }


        // ----------------------------------
        // GET PM VALUES
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

        const pmStatusValue =
          document.getElementById(
            "pmStatus"
          ).value;


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

          throw new Error(
            "Please complete all required PM fields."
          );

        }


        // ----------------------------------
        // PREPARE PM PAYLOAD
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

          // IMPORTANT:
          // Database column has a SPACE
          // Work Performed

          "Work Performed":
            document.getElementById(
              "workPerformed"
            ).value || null,

          Findings:
            document.getElementById(
              "pmFindings"
            ).value || null,

          Recommendations:
            document.getElementById(
              "pmRecommendations"
            ).value || null,

          PMStatus:
            pmStatusValue,

          Remarks:
            document.getElementById(
              "pmRemarks"
            ).value || null

        };


        // ----------------------------------
        // INSERT PM REPORT
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

        if (error) {

          throw error;

        }


        console.log(
          "PM record inserted:",
          data
        );


        // ----------------------------------
        // SUCCESS
        // ----------------------------------

        if (pmMessage) {

          pmMessage.textContent =
            "Preventive Maintenance report submitted successfully.";

        }


        preventiveMaintenanceForm.reset();

        if (pmDepartmentInput) {

          pmDepartmentInput.value =
            "";

        }


        // REFRESH PM HISTORY

        await loadPMHistory();
        // REFRESH PM DUE TODAY AND OVERDUE COUNTERS

await loadPMCounters();
        await loadPMNotifications();

        
        setTimeout(
          function() {

            if (pmMessage) {
              pmMessage.textContent = "";
            }

          },
          5000
        );

      }

      catch (error) {

        console.error(
          "Preventive Maintenance error:",
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
              section => {

                section.classList.add(
                  "hidden"
                );

              }
            );


          const selectedSection =
            document.getElementById(
              this.dataset.section
            );


          if (selectedSection) {

            selectedSection.classList.remove(
              "hidden"
            );

          }


          // REPORTS

          if (
            this.dataset.section ===
            "reportsSection"
          ) {

            loadMaintenanceReports();

          }


          // EQUIPMENT REGISTRATION

          if (
            this.dataset.section ===
            "equipmentRegistrationSection"
          ) {

            loadEquipmentRegistrationDropdowns();

          }


          // EQUIPMENT HISTORY

          if (
            this.dataset.section ===
            "equipmentHistorySection"
          ) {

            loadEquipmentHistoryDropdown();

          }


          // PM

if (
  this.dataset.section ===
  "pmSection"
) {

  loadPMEquipmentDropdown();

  loadPMEngineerDropdown();

  loadPMHistory();

  loadPMCounters();
  loadPMNotifications();

}
        }
      );

    }
  );

// ==========================================
// ==========================================
// LOGIN
// ==========================================

if (loginForm) {

loginForm.addEventListener(
"submit",
async function(event) {

  event.preventDefault();

  console.log("Login form submitted.");

  if (loginMessage) {
    loginMessage.textContent = "Signing in...";
  }

  const emailInput =
    document.getElementById("email");

  const passwordInput =
    document.getElementById("password");

  if (!emailInput || !passwordInput) {

    console.error(
      "Email or password input was not found."
    );

    if (loginMessage) {
      loginMessage.textContent =
        "Login fields were not found.";
    }

    return;
  }

  const email =
    emailInput.value.trim();

  const password =
    passwordInput.value;

  // --------------------------------------
  // VALIDATE LOGIN INPUT
  // --------------------------------------

  if (!email || !password) {

    if (loginMessage) {
      loginMessage.textContent =
        "Please enter your email and password.";
    }

    return;
  }

  try {

    console.log(
      "Attempting Supabase login:",
      email
    );

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
    // CHECK LOGIN ERROR
    // --------------------------------------

    if (error) {

      console.error(
        "Supabase login error:",
        error
      );

      throw new Error(
        error.message
      );

    }

    // --------------------------------------
    // CHECK USER
    // --------------------------------------

    if (
      !data ||
      !data.user
    ) {

      throw new Error(
        "Login failed. No authenticated user was returned."
      );

    }

    console.log(
      "Login successful."
    );

    console.log(
      "User ID:",
      data.user.id
    );

    console.log(
      "User Email:",
      data.user.email
    );

    // --------------------------------------
    // LOAD APPLICATION
    // --------------------------------------

    await showApp(
      data.user
    );

  }

  catch (error) {

    console.error(
      "Login process error:",
      error
    );

    if (loginMessage) {

      loginMessage.textContent =
        "Login failed: " +
        (
          error.message ||
          "Please check your email and password."
        );

    }

  }

}

);

}

// ==========================================
// SHOW APPLICATION AFTER LOGIN
// ==========================================

async function showApp(user) {

  try {

    console.log(
      "Loading application for user:",
      user.id
    );


    // --------------------------------------
    // LOAD USER PROFILE
    // --------------------------------------

    const profile =
      await loadUserProfile(
        user.id
      );


    console.log(
      "User profile successfully loaded:",
      profile
    );


    // --------------------------------------
    // HIDE LOGIN
    // SHOW APPLICATION
    // --------------------------------------

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


    // --------------------------------------
    // SHOW USER NAME
    // --------------------------------------

    if (welcomeText) {

      const fullName =
        profile["Full name"] ||
        profile.Username ||
        user.email ||
        "User";

      welcomeText.textContent =
        `Welcome, ${fullName}`;

    }


    // --------------------------------------
    // LOAD FORM DROPDOWNS
    // --------------------------------------

    console.log(
      "Loading application form data..."
    );

    await loadFormData();


    // --------------------------------------
    // LOAD MAINTENANCE REPORTS
    // --------------------------------------

    console.log(
      "Loading maintenance reports..."
    );

    await loadMaintenanceReports();

// ==========================================
// LOAD PM DUE TODAY AND OVERDUE COUNTERS
// ==========================================

async function loadPMCounters() {

  const pmDueTodayCount =
    document.getElementById(
      "pmDueTodayCount"
    );

  const pmOverdueCount =
    document.getElementById(
      "pmOverdueCount"
    );


  // ----------------------------------------
  // CHECK COUNTER ELEMENTS
  // ----------------------------------------

  if (
    !pmDueTodayCount ||
    !pmOverdueCount
  ) {

    console.warn(
      "PM counter elements not found."
    );

    return;

  }


  // ----------------------------------------
  // SHOW LOADING
  // ----------------------------------------

  pmDueTodayCount.textContent =
    "...";

  pmOverdueCount.textContent =
    "...";


  try {

    // --------------------------------------
    // GET TODAY'S DATE
    // --------------------------------------

    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );


    // --------------------------------------
    // LOAD PM HISTORY
    // --------------------------------------

    const {
      data,
      error
    } = await client
      .from("vwPMHistory")
      .select("NextPMDate");


    // --------------------------------------
    // CHECK DATABASE ERROR
    // --------------------------------------

    if (error) {

      throw error;

    }


    // --------------------------------------
    // INITIALIZE COUNTERS
    // --------------------------------------

    let dueToday =
      0;

    let overdue =
      0;


    // --------------------------------------
    // CHECK EACH PM RECORD
    // --------------------------------------

    (data || []).forEach(
      pm => {

        if (!pm.NextPMDate) {

          return;

        }


        const nextPMDate =
          new Date(
            pm.NextPMDate
          );


        nextPMDate.setHours(
          0,
          0,
          0,
          0
        );


        // ----------------------------------
        // PM DUE TODAY
        // ----------------------------------

        if (
          nextPMDate.getTime() ===
          today.getTime()
        ) {

          dueToday++;

        }


        // ----------------------------------
        // PM OVERDUE
        // ----------------------------------

        else if (
          nextPMDate < today
        ) {

          overdue++;

        }

      }
    );


    // --------------------------------------
    // DISPLAY COUNTERS
    // --------------------------------------

    pmDueTodayCount.textContent =
      dueToday;

    pmOverdueCount.textContent =
      overdue;


    console.log(
      "PM Due Today:",
      dueToday
    );

    console.log(
      "PM Overdue:",
      overdue
    );

  }


  catch (error) {

    console.error(
      "Error loading PM counters:",
      error
    );


    pmDueTodayCount.textContent =
      "0";

    pmOverdueCount.textContent =
      "0";

  }

}
    // --------------------------------------
    // LOAD DASHBOARD
    // --------------------------------------

    console.log(
      "Loading dashboard..."
    );

    await loadDashboard();


    console.log(
      "Application loaded successfully."
    );


    // --------------------------------------
    // CLEAR LOGIN MESSAGE
    // --------------------------------------

    if (loginMessage) {

      loginMessage.textContent =
        "";

    }


  }

  catch (error) {

    console.error(
      "Show application error:",
      error
    );


    // --------------------------------------
    // DO NOT HIDE THE REAL ERROR
    // --------------------------------------

    if (loginMessage) {

      loginMessage.textContent =
        "Login succeeded, but the application could not load: " +
        error.message;

    }


    // --------------------------------------
    // SIGN OUT
    // --------------------------------------

    try {

      await client.auth.signOut();

    }

    catch (signOutError) {

      console.error(
        "Sign out after failed application load:",
        signOutError
      );

    }


    // --------------------------------------
    // SHOW LOGIN
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

  }

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
// ATBUTH BIOMEDICAL CMMS
// SUPABASE MOBILE WEB APPLICATION
// JAVASCRIPT - PART 3 OF 3
// ==========================================


// ==========================================
// LOAD PREVENTIVE MAINTENANCE HISTORY
// ==========================================

async function loadPMHistory() {

  const pmTableBody = document.getElementById("pmHistoryTableBody");
  const pmLoading = document.getElementById("pmLoading");
  const pmHistoryMessage = document.getElementById("pmHistoryMessage");

  // Check that the table exists
  if (!pmTableBody) {
    console.error("pmTableBody was not found.");
    return;
  }

  // Show loading message
  if (pmLoading) {
    pmLoading.textContent =
      "Loading preventive maintenance history...";
  }

  // Clear previous message
  if (pmHistoryMessage) {
    pmHistoryMessage.textContent = "";
  }

  try {

    // ======================================
    // FETCH PM HISTORY
    // ======================================

    const { data, error } = await client
      .from("vwPMHistory")
      .select("*")
      .order("PMDate", { ascending: false });


    // ======================================
    // CHECK FOR DATABASE ERROR
    // ======================================

    if (error) {

      console.error(
        "Error loading PM history:",
        error
      );

      pmTableBody.innerHTML = `
        <tr>
          <td colspan="12">
            Error loading PM history:
            ${error.message}
          </td>
        </tr>
      `;

      if (pmHistoryMessage) {
        pmHistoryMessage.textContent =
          "Unable to load Preventive Maintenance history.";
      }

      return;
    }


    // ======================================
    // NO RECORDS
    // ======================================

    if (!data || data.length === 0) {

      pmTableBody.innerHTML = `
        <tr>
          <td colspan="12">
            No PM records found.
          </td>
        </tr>
      `;

      if (pmLoading) {
        pmLoading.textContent =
          "No preventive maintenance records found.";
      }

      return;
    }


    // ======================================
    // DISPLAY PM RECORDS
    // ======================================

    pmTableBody.innerHTML = "";


    data.forEach(pm => {

      // Calculate Due Status

let dueStatus = "";

if (pm.NextPMDate) {

  const today = new Date();

  const nextPMDate =
    new Date(pm.NextPMDate);


  // Remove time portion

  today.setHours(
    0,
    0,
    0,
    0
  );

  nextPMDate.setHours(
    0,
    0,
    0,
    0
  );


  // Calculate difference in days

  const differenceInMilliseconds =
    nextPMDate.getTime() -
    today.getTime();

  const differenceInDays =
    Math.ceil(
      differenceInMilliseconds /
      (1000 * 60 * 60 * 24)
    );


  // ------------------------------------
  // OVERDUE
  // ------------------------------------

  if (
    differenceInDays < 0
  ) {

    dueStatus =
      "Overdue";

  }


  // ------------------------------------
  // DUE TODAY
  // ------------------------------------

  else if (
    differenceInDays === 0
  ) {

    dueStatus =
      "Due Today";

  }


  // ------------------------------------
  // DUE SOON
  // WITHIN 7 DAYS
  // ------------------------------------

  else if (
    differenceInDays <= 7
  ) {

    dueStatus =
      "Due Soon";

  }


  // ------------------------------------
  // NOT DUE
  // MORE THAN 7 DAYS
  // ------------------------------------

  else {

    dueStatus =
      "Not Due";

  }

}


else {

  dueStatus =
    "No Date";

}
      
      // ====================================
      // CREATE TABLE ROW
      // ====================================

      const row = document.createElement("tr");


      row.innerHTML = `

        <td>
          ${pm.BMENumber || ""}
        </td>

        <td>
          ${pm.EquipmentName || ""}
        </td>

        <td>
          ${pm.DepartmentName || ""}
        </td>

        <td>
          ${pm.PMDate || ""}
        </td>

        <td>
          ${pm.NextPMDate || ""}
        </td>

        <td>
  <span class="pm-due-status ${dueStatus
    .toLowerCase()
    .replace(/\s+/g, "-")}">
    ${dueStatus}
  </span>
</td>

        <td>
          ${pm.EngineerName || ""}
        </td>

        <td>
          ${pm.WorkPerformed || ""}
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


      pmTableBody.appendChild(row);

    });


    // ======================================
    // HIDE LOADING MESSAGE
    // ======================================

    if (pmLoading) {

  pmLoading.textContent = "";

}

  } catch (err) {

    // ======================================
    // UNEXPECTED ERROR
    // ======================================

    console.error(
      "Unexpected error loading PM history:",
      err
    );


    pmTableBody.innerHTML = `
      <tr>
        <td colspan="12">
          An unexpected error occurred while
          loading PM history.
        </td>
      </tr>
    `;


    if (pmHistoryMessage) {

      pmHistoryMessage.textContent =
        "An unexpected error occurred.";

    }

  }

}
// ==========================================
// LOAD PM DUE TODAY AND OVERDUE COUNTERS
// ==========================================

async function loadPMCounters() {

  const pmDueTodayCount =
    document.getElementById(
      "pmDueTodayCount"
    );

  const pmOverdueCount =
    document.getElementById(
      "pmOverdueCount"
    );


  // ----------------------------------------
  // CHECK COUNTER ELEMENTS
  // ----------------------------------------

  if (
    !pmDueTodayCount ||
    !pmOverdueCount
  ) {

    console.warn(
      "PM counter elements not found."
    );

    return;

  }


  // ----------------------------------------
  // SHOW LOADING
  // ----------------------------------------

  pmDueTodayCount.textContent =
    "...";

  pmOverdueCount.textContent =
    "...";


  try {

    // --------------------------------------
    // LOAD PM HISTORY
    // --------------------------------------

    const {
      data,
      error
    } = await client
      .from("vwPMHistory")
      .select("NextPMDate");


    // --------------------------------------
    // CHECK DATABASE ERROR
    // --------------------------------------

    if (error) {

      throw error;

    }


    // --------------------------------------
    // GET TODAY'S DATE
    // --------------------------------------

    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );


    // --------------------------------------
    // INITIALIZE COUNTERS
    // --------------------------------------

    let dueToday =
      0;

    let overdue =
      0;


    // --------------------------------------
    // CHECK EACH PM RECORD
    // --------------------------------------

    (data || []).forEach(
      pm => {

        if (!pm.NextPMDate) {

          return;

        }


        const nextPMDate =
          new Date(
            pm.NextPMDate
          );


        nextPMDate.setHours(
          0,
          0,
          0,
          0
        );


        // ----------------------------------
        // PM DUE TODAY
        // ----------------------------------

        if (
          nextPMDate.getTime() ===
          today.getTime()
        ) {

          dueToday++;

        }


        // ----------------------------------
        // PM OVERDUE
        // ----------------------------------

        else if (
          nextPMDate < today
        ) {

          overdue++;

        }

      }
    );


    // --------------------------------------
    // DISPLAY COUNTERS
    // --------------------------------------

    pmDueTodayCount.textContent =
      dueToday;

    pmOverdueCount.textContent =
      overdue;


    console.log(
      "PM Due Today:",
      dueToday
    );

    console.log(
      "PM Overdue:",
      overdue
    );

  }


  catch (error) {

    console.error(
      "Error loading PM counters:",
      error
    );


    pmDueTodayCount.textContent =
      "0";

    pmOverdueCount.textContent =
      "0";

  }

}
// ==========================================
// LOAD PM DUE NOTIFICATIONS
// ==========================================

async function loadPMNotifications() {

  const tableBody =
    document.getElementById(
      "pmNotificationTableBody"
    );

  const message =
    document.getElementById(
      "pmNotificationMessage"
    );

  if (!tableBody || !message) {
    return;
  }

  message.textContent =
    "Loading PM notifications...";
  try {

    const {
      data,
      error
    } = await client
      .from("vwPMHistory")
      .select("*")
      .order(
        "NextPMDate",
        {
          ascending: true
        }
      );

    if (error) {

      throw error;

    }

    tableBody.innerHTML = "";

    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    let records = 0;

    (data || []).forEach(
      pm => {

        if (!pm.NextPMDate) {

          return;

        }

        const nextPM =
          new Date(
            pm.NextPMDate
          );

        nextPM.setHours(
          0,
          0,
          0,
          0
        );

        const days =
          Math.ceil(
            (nextPM - today) /
            (1000 * 60 * 60 * 24)
          );

        let status = "";
        if (days < 0) {

          status = "🔴 Overdue";

        }

        else if (days === 0) {

          status = "🟠 Due Today";

        }

        else if (days <= 7) {

          status = "🟡 Due Soon";

        }

        else {

          return;

        }

        records++;

        tableBody.innerHTML += `

          <tr>

            <td>${pm.BMENumber || ""}</td>

            <td>${pm.EquipmentName || ""}</td>

            <td>${pm.DepartmentName || ""}</td>

            <td>${pm.NextPMDate || ""}</td>

            <td>${status}</td>

          </tr>

        `;

      }
    );

    if (records === 0) {

      tableBody.innerHTML = `

        <tr>

          <td colspan="5">

            No PM notifications.

          </td>

        </tr>

      `;

    }

    message.textContent =
      `${records} notification(s).`;

  }

  catch (error) {

    console.error(
      "PM notification error:",
      error
    );

    message.textContent =
      "Unable to load PM notifications.";

  }

}
// ==========================================
// LOAD DASHBOARD
// ==========================================

async function loadDashboard() {

  // ----------------------------------------
  // EQUIPMENT COUNTER
  // ----------------------------------------

  const equipmentCounter =
    document.getElementById(
      "totalEquipment"
    );


  if (equipmentCounter) {

    try {

      const {
        count,
        error
      } = await client
        .from(
          "tblEquipment"
        )
        .select(
          "*",
          {
            count: "exact",
            head: true
          }
        );


      if (error) {

        throw error;

      }


      equipmentCounter.textContent =
        count || 0;

    }

    catch (error) {

      console.error(
        "Equipment counter error:",
        error
      );

      equipmentCounter.textContent =
        "0";

    }

  }


  // ----------------------------------------
  // ENGINEER COUNTER
  // ----------------------------------------

  const engineerCounter =
    document.getElementById(
      "totalEngineers"
    );


  if (engineerCounter) {

    try {

      const {
        count,
        error
      } = await client
        .from(
          "tblEngineers"
        )
        .select(
          "*",
          {
            count: "exact",
            head: true
          }
        );


      if (error) {

        throw error;

      }


      engineerCounter.textContent =
        count || 0;

    }

    catch (error) {

      console.error(
        "Engineer counter error:",
        error
      );

      engineerCounter.textContent =
        "0";

    }

  }


  // ----------------------------------------
  // MAINTENANCE REPORT COUNTER
  // ----------------------------------------

  const maintenanceCounter =
    document.getElementById(
      "totalMaintenanceReports"
    );


  if (maintenanceCounter) {

    try {

      const {
        count,
        error
      } = await client
        .from(
          "tblMaintenanceReport"
        )
        .select(
          "*",
          {
            count: "exact",
            head: true
          }
        );


      if (error) {

        throw error;

      }


      maintenanceCounter.textContent =
        count || 0;

    }

    catch (error) {

      console.error(
        "Maintenance counter error:",
        error
      );

      maintenanceCounter.textContent =
        "0";

    }

  }


  // ----------------------------------------
  // PM COUNTER
  // ----------------------------------------

  const pmCounter =
    document.getElementById(
      "totalPreventiveMaintenance"
    );


  if (pmCounter) {

    try {

      const {
        count,
        error
      } = await client
        .from(
          "tblPreventiveMaintenance"
        )
        .select(
          "*",
          {
            count: "exact",
            head: true
          }
        );


      if (error) {

        throw error;

      }


      pmCounter.textContent =
        count || 0;

    }

    catch (error) {

      console.error(
        "PM counter error:",
        error
      );

      pmCounter.textContent =
        "0";

    }

  }

}


// ==========================================
// AUTH SESSION CHECK
// ==========================================

async function checkExistingSession() {

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

      console.log(
        "Existing Supabase session found."
      );


      await showApp(
        data.session.user
      );

    }

    else {

      console.log(
        "No active session."
      );


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

    }

  }

  catch (error) {

    console.error(
      "Session check error:",
      error
    );


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

  }

}


// ==========================================
// AUTH STATE CHANGE
// ==========================================

client.auth.onAuthStateChange(
  async function(
    event,
    session
  ) {

    console.log(
      "Auth event:",
      event
    );


    if (
      event ===
      "SIGNED_IN"
    ) {

      if (
        session &&
        session.user
      ) {

        await showApp(
          session.user
        );

      }

    }


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

    }

  }
);


// ==========================================
// INITIAL APPLICATION STARTUP
// ==========================================

document.addEventListener(
  "DOMContentLoaded",
  async function() {

    console.log(
      "ATBUTH Biomedical CMMS starting..."
    );


    // --------------------------------------
    // SET INITIAL VISIBILITY
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


    // --------------------------------------
    // CHECK EXISTING LOGIN SESSION
    // --------------------------------------

    await checkExistingSession();

  }
);


// ==========================================
// EXTRA SAFETY:
// RELOAD PM ENGINEER DROPDOWN WHEN PM
// SECTION IS OPENED
// ==========================================

const pmSection =
  document.getElementById(
    "pmSection"
  );


if (pmSection) {

  const pmObserver =
    new MutationObserver(
      function() {

        if (
          !pmSection.classList.contains(
            "hidden"
          )
        ) {

  
          loadPMHistory();
          loadPMCounters();

        }

      }
    );


  pmObserver.observe(
    pmSection,
    {
      attributes: true,
      attributeFilter: [
        "class"
      ]
    }
  );

}


// ==========================================
// FINAL STARTUP LOG
// ==========================================

console.log(
  "ATBUTH Biomedical CMMS JavaScript loaded successfully - Parts 1, 2 and 3."
);
// ==========================================
// PM HISTORY SEARCH
// ==========================================

const pmHistorySearch =
  document.getElementById(
    "pmHistorySearch"
  );


if (pmHistorySearch) {

  pmHistorySearch.addEventListener(
    "input",
    function() {

      const searchText =
        this.value
          .toLowerCase()
          .trim();


      const pmTableBody =
        document.getElementById(
          "pmHistoryTableBody"
        );


      if (!pmTableBody) {
        return;
      }


      const rows =
        pmTableBody.querySelectorAll(
          "tr"
        );


      let visibleRows = 0;


      rows.forEach(
        row => {

          const rowText =
            row.textContent
              .toLowerCase();


          if (
            searchText === "" ||
            rowText.includes(
              searchText
            )
          ) {

            row.style.display =
              "";

            visibleRows++;

          }

          else {

            row.style.display =
              "none";

          }

        }
      );


      // --------------------------------------
      // SHOW SEARCH RESULT MESSAGE
      // --------------------------------------

      const pmHistoryMessage =
        document.getElementById(
          "pmHistoryMessage"
        );


      if (
        searchText !== ""
      ) {

        if (
          visibleRows === 0
        ) {

          if (pmHistoryMessage) {

            pmHistoryMessage.textContent =
              "No matching PM records found.";

          }

        }

        else {

          if (pmHistoryMessage) {

            pmHistoryMessage.textContent =
              `${visibleRows} matching PM record(s) found.`;

          }

        }

      }

      else {

        if (pmHistoryMessage) {

          pmHistoryMessage.textContent =
            "";

        }

      }

    }
  );

}

// ==========================================
// DASHBOARD
// ==========================================

async function loadDashboard() {

  const totalEquipment =
    document.getElementById(
      "dashboardTotalEquipment"
    );

  const totalMaintenance =
    document.getElementById(
      "dashboardTotalMaintenance"
    );

  const underRepair =
    document.getElementById(
      "dashboardUnderRepair"
    );

  const awaitingParts =
    document.getElementById(
      "dashboardAwaitingParts"
    );

  const pmDueToday =
    document.getElementById(
      "dashboardPMDueToday"
    );

  const pmOverdue =
    document.getElementById(
      "dashboardPMOverdue"
    );

  if (
    !totalEquipment ||
    !totalMaintenance ||
    !underRepair ||
    !awaitingParts ||
    !pmDueToday ||
    !pmOverdue
  ) {
    return;
  }
  try {

    // Total Equipment

    const {
      count: equipmentCount
    } = await client
      .from("tblEquipment")
      .select("*", {
        count: "exact",
        head: true
      });

    totalEquipment.textContent =
      equipmentCount || 0;
    // Total Maintenance Reports

const {
  count: maintenanceCount
} = await client
  .from("tblMaintenanceReport")
  .select("*", {
    count: "exact",
    head: true
  });

totalMaintenance.textContent =
  maintenanceCount || 0;
    // Under Repair Equipment

const {
  count: underRepairCount
} = await client
  .from("tblEquipment")
  .select("*", {
    count: "exact",
    head: true
  })
  .eq("StatusID", 2);

underRepair.textContent =
  underRepairCount || 0;

  }

  catch (error) {

    console.error(
      "Dashboard error:",
      error
    );

  }

}
