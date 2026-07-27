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

          }

        }
      );

    }
  );


// ==========================================
// LOGIN
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

      const email =
        document.getElementById(
          "email"
        ).value.trim();

      const password =
        document.getElementById(
          "password"
        ).value;


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


      try {

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
// ATBUTH BIOMEDICAL CMMS
// SUPABASE MOBILE WEB APPLICATION
// JAVASCRIPT - PART 3 OF 3
// ==========================================


// ==========================================
// SHOW APPLICATION AFTER LOGIN
// ==========================================

async function showApp(user) {

  try {

    // --------------------------------------
    // LOAD USER PROFILE
    // --------------------------------------

    const profile =
      await loadUserProfile(
        user.id
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
    // LOAD ALL FORM DROPDOWNS
    // --------------------------------------

    await loadFormData();


    // --------------------------------------
    // LOAD MAINTENANCE REPORTS
    // --------------------------------------

    await loadMaintenanceReports();


    // --------------------------------------
    // LOAD DASHBOARD
    // --------------------------------------

    await loadDashboard();


    console.log(
      "Application loaded successfully."
    );

  }

  catch (error) {

    console.error(
      "Show application error:",
      error
    );


    // --------------------------------------
    // SIGN OUT IF PROFILE LOAD FAILS
    // --------------------------------------

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
        error.message;

    }

  }

}


// ==========================================
// LOAD PM HISTORY
// ==========================================

async function loadPMHistory() {

  const tableBody =
    document.getElementById(
      "pmHistoryTableBody"
    );

  const message =
    document.getElementById(
      "pmHistoryMessage"
    );


  if (!tableBody) {

    console.warn(
      "pmHistoryTableBody not found."
    );

    return;

  }


  tableBody.innerHTML =
    `<tr>
      <td colspan="8">
        Loading preventive maintenance history...
      </td>
    </tr>`;


  if (message) {

    message.textContent =
      "";

  }


  try {

    // --------------------------------------
    // LOAD PM RECORDS
    // --------------------------------------

    const {
      data,
      error
    } = await client
      .from(
        "tblPreventiveMaintenance"
      )
      .select("*")
      .order(
        "PMDate",
        {
          ascending: false
        }
      );


    if (error) {

      throw error;

    }


    // --------------------------------------
    // NO RECORDS
    // --------------------------------------

    if (
      !data ||
      data.length === 0
    ) {

      tableBody.innerHTML =
        `<tr>
          <td colspan="8">
            No preventive maintenance records found.
          </td>
        </tr>`;

      return;

    }


    // --------------------------------------
    // CLEAR TABLE
    // --------------------------------------

    tableBody.innerHTML =
      "";


    // --------------------------------------
    // DISPLAY EACH PM RECORD
    // --------------------------------------

    for (
      const pm of data
    ) {

      let equipmentName =
        "";

      let bmeNumber =
        "";

      let engineerName =
        "";


      // ------------------------------------
      // LOAD EQUIPMENT INFORMATION
      // ------------------------------------

      if (
        pm.EquipmentID !== null &&
        pm.EquipmentID !== undefined
      ) {

        const {
          data: equipment
        } = await client
          .from(
            "tblEquipment"
          )
          .select(
            "EquipmentName, BMENumber"
          )
          .eq(
            "EquipmentID",
            pm.EquipmentID
          )
          .maybeSingle();


        if (equipment) {

          equipmentName =
            equipment.EquipmentName ||
            "";

          bmeNumber =
            equipment.BMENumber ||
            "";

        }

      }


      // ------------------------------------
      // LOAD ENGINEER INFORMATION
      // ------------------------------------

      if (
        pm.EngineerID !== null &&
        pm.EngineerID !== undefined
      ) {

        const {
          data: engineer
        } = await client
          .from(
            "tblEngineers"
          )
          .select(
            "FirstName, LastName"
          )
          .eq(
            "EngineerID",
            pm.EngineerID
          )
          .maybeSingle();


        if (engineer) {

          engineerName =
            `${engineer.FirstName || ""} ${
              engineer.LastName || ""
            }`.trim();

        }

      }


      // ------------------------------------
      // CREATE TABLE ROW
      // ------------------------------------

      const row =
        document.createElement(
          "tr"
        );


      row.innerHTML = `

        <td>
          ${
            pm.PMDate
              ? new Date(
                  pm.PMDate
                ).toLocaleDateString()
              : ""
          }
        </td>

        <td>
          ${bmeNumber}
        </td>

        <td>
          ${equipmentName}
        </td>

        <td>
          ${engineerName}
        </td>

        <td>
          ${
            pm.NextPMDate
              ? new Date(
                  pm.NextPMDate
                ).toLocaleDateString()
              : ""
          }
        </td>

        <td>
          ${pm.PMStatus || ""}
        </td>

        <td>
          ${pm.Findings || ""}
        </td>

        <td>
          ${pm.Remarks || ""}
        </td>

      `;


      tableBody.appendChild(
        row
      );

    }

  }

  catch (error) {

    console.error(
      "PM history error:",
      error
    );


    tableBody.innerHTML =
      `<tr>
        <td colspan="8">
          Unable to load preventive maintenance history.
        </td>
      </tr>`;


    if (message) {

      message.textContent =
        error.message;

    }

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

          loadPMEquipmentDropdown();

          loadPMEngineerDropdown();

          loadPMHistory();

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
