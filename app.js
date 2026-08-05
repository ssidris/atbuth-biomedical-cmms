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
        `${row.FirstName || ""} ${row.LastName || ""}`
      ).trim();

    }
  );

  // ==========================================
  // AUTO-SELECT LOGGED-IN ENGINEER
  // ==========================================

  if (
    window.currentUser &&
    window.currentUser.EngineerID
  ) {

    document.getElementById(
      "engineerId"
    ).value =
      window.currentUser.EngineerID;

  }
  // ==========================================
  // MAINTENANCE TYPE
  // ==========================================

  await loadLookup(
    "tblMaintenanceType",
    "MaintenanceTypeID",
    "MaintenanceType",
    "maintenanceTypeId",
    "Select maintenance type"
  );

  // ==========================================
  // PART REQUESTED STATUS
  // ==========================================

  await loadLookup(
    "tblPartRequestedStatus",
    "PartStatusID",
    "PartStatusName",
    "partStatusId",
    "Select part status"
  );

  // ==========================================
  // EQUIPMENT STATUS
  // ==========================================

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
        `${row.FirstName || ""} ${row.LastName || ""}`
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
          `${equipment.BMENumber || ""} — ${equipment.EquipmentName || ""}`;

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
      .select(`
        EquipmentID,
        BMENumber,
        EquipmentName,
        Manufacturer,
        Model,
        SerialNumber,
        Location,
        DepartmentID
      `)
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

        <p><strong>BME Number:</strong>
        ${equipment.BMENumber || ""}</p>

        <p><strong>Equipment Name:</strong>
        ${equipment.EquipmentName || ""}</p>

        <p><strong>Manufacturer:</strong>
        ${equipment.Manufacturer || ""}</p>

        <p><strong>Model:</strong>
        ${equipment.Model || ""}</p>

        <p><strong>Serial Number:</strong>
        ${equipment.SerialNumber || ""}</p>

        <p><strong>Department:</strong>
        ${departmentName}</p>

        <p><strong>Location:</strong>
        ${equipment.Location || ""}</p>

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

          <td>${report.JobOrderNumber || ""}</td>

          <td>${report.EngineerName || ""}</td>

          <td>${report.MaintenanceType || ""}</td>

          <td>${report.FaultReported || ""}</td>

          <td>${report.Diagnosis || ""}</td>

          <td>${report.ActionTaken || ""}</td>

          <td>${report.PartUsed || ""}</td>

          <td>${report.RequiredPart || ""}</td>

          <td>${report.StatusName || ""}</td>

          <td>${report.Remarks || ""}</td>

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
// LOAD MAINTENANCE REPORTS
// ==========================================

async function loadMaintenanceReports() {

  const reportsTableBody =
    document.getElementById(
      "reportsTableBody"
    );

  const reportsLoading =
    document.getElementById(
      "reportsLoading"
    );

  if (!reportsTableBody) {
    return;
  }

  if (reportsLoading) {
    reportsLoading.textContent =
      "Loading maintenance reports...";
  }

  reportsTableBody.innerHTML = "";

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
      throw error;
    }

    if (!data || data.length === 0) {

      reportsTableBody.innerHTML =
        `<tr>
          <td colspan="11">
            No maintenance reports found.
          </td>
        </tr>`;

      if (reportsLoading) {
        reportsLoading.textContent = "";
      }

      return;

    }

    data.forEach(report => {

      const row =
        document.createElement("tr");

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

        <td>${report.JobOrderNumber || ""}</td>

        <td>${report.BMENumber || ""}</td>

        <td>${report.EquipmentName || ""}</td>

        <td>${report.DepartmentName || ""}</td>

        <td>${report.EngineerName || ""}</td>

        <td>${report.MaintenanceType || ""}</td>

        <td>${report.FaultReported || ""}</td>

        <td>${report.ActionTaken || ""}</td>

        <td>${report.StatusName || ""}</td>

        <td>${report.Remarks || ""}</td>

      `;

      reportsTableBody.appendChild(row);

    });

    if (reportsLoading) {
      reportsLoading.textContent = "";
    }

  }

  catch (error) {

    console.error(
      "Maintenance reports error:",
      error
    );

    reportsTableBody.innerHTML =
      `<tr>
        <td colspan="11">
          Unable to load maintenance reports.
        </td>
      </tr>`;

    if (reportsLoading) {
      reportsLoading.textContent = "";
    }

  }

}
// ==========================================
// EQUIPMENT REGISTRATION
// ==========================================

if (equipmentRegistrationForm) {

  equipmentRegistrationForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();

      try {

        const bmeNumber =
          document.getElementById("newBMENumber").value.trim();

        const equipmentName =
          document.getElementById("newEquipmentName").value.trim();

        const manufacturer =
          document.getElementById("newManufacturer").value.trim();

        const model =
          document.getElementById("newModel").value.trim();

        const serialNumber =
          document.getElementById("newSerialNumber").value.trim();

        const location =
          document.getElementById("newLocation").value.trim();

        const departmentId =
          document.getElementById("newDepartmentId").value;

        const categoryId =
          document.getElementById("newCategoryId").value;

        const statusId =
          document.getElementById("newStatusId").value;

        if (
          !bmeNumber ||
          !equipmentName ||
          !departmentId ||
          !categoryId ||
          !statusId
        ) {

          throw new Error(
            "Please complete all required fields."
          );

        }

        // Check duplicate BME Number

        const {
          data: existingEquipment
        } = await client
          .from("tblEquipment")
          .select("EquipmentID")
          .eq("BMENumber", bmeNumber)
          .maybeSingle();

        if (existingEquipment) {

          throw new Error(
            "This BME Number already exists."
          );

        }

        const { error } =
          await client
            .from("tblEquipment")
            .insert({

              BMENumber: bmeNumber,

              EquipmentName: equipmentName,

              Manufacturer: manufacturer || null,

              Model: model || null,

              SerialNumber: serialNumber || null,

              Location: location || null,

              DepartmentID: Number(departmentId),

              CategoryID: Number(categoryId),

              StatusID: Number(statusId)

            });

        if (error) {

          throw error;

        }

        alert(
          "Equipment registered successfully."
        );

        equipmentRegistrationForm.reset();

        await loadEquipmentRegistrationDropdowns();

        await loadMaintenanceFormData();

        await loadPMEquipmentDropdown();

        await loadEquipmentHistoryDropdown();

        await loadDashboard();

      }

      catch (error) {

        console.error(
          "Equipment registration error:",
          error
        );

        alert(error.message);

      }

    }
  );

}
// ==========================================
// MAINTENANCE REPORT FORM
// ==========================================

if (maintenanceForm) {

  maintenanceForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();

      if (maintenanceMessage) {
        maintenanceMessage.textContent =
          "Submitting maintenance report...";
      }

      try {

        const {
          data: authData,
          error: authError
        } = await client.auth.getUser();

        if (authError || !authData.user) {
          throw new Error(
            "Your session has expired. Please log in again."
          );
        }

        const equipmentValue =
          document.getElementById("equipmentId").value;

        const engineerValue =
          document.getElementById("engineerId").value;

        const payload = {

          EquipmentID:
            Number(equipmentValue),

          ReportDate:
            document.getElementById("reportDate").value,

          JobOrderNumber:
            document.getElementById("jobOrderNumber").value || null,

          EngineerID:
            Number(engineerValue),

          MaintenanceTypeID:
            Number(
              document.getElementById("maintenanceTypeId").value
            ),

          FaultReported:
            document.getElementById("faultReported").value || null,

          Diagnosis:
            document.getElementById("diagnosis").value || null,

          ActionTaken:
            document.getElementById("actionTaken").value || null,

          PartUsed:
            document.getElementById("partUsed").value || null,

          RequiredPart:
            document.getElementById("requiredPart").value || null,

          PartStatusID:
            document.getElementById("partStatusId").value
              ? Number(document.getElementById("partStatusId").value)
              : null,

          StatusID:
            Number(
              document.getElementById("statusId").value
            ),

          Remarks:
            document.getElementById("remarks").value || null

        };
       // ==================================
        // INSERT REPORT
        // ==================================

        const { error } =
          await client
            .from("tblMaintenanceReport")
            .insert(payload);

        if (error) {
          throw error;
        }

        // ==================================
        // SUCCESS
        // ==================================

        if (maintenanceMessage) {

          maintenanceMessage.textContent =
            "Maintenance report submitted successfully.";

        }

        maintenanceForm.reset();

        if (departmentInput) {

          departmentInput.value = "";

        }

        await loadMaintenanceReports();

        await loadRecentMaintenanceReports();

        await loadDashboard();

        setTimeout(() => {

          if (maintenanceMessage) {

            maintenanceMessage.textContent = "";

          }

        }, 5000);

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
    async function (event) {

      event.preventDefault();

      if (pmMessage) {

        pmMessage.textContent =
          "Submitting Preventive Maintenance report...";

      }

      try {

        const {
          data: authData,
          error: authError
        } = await client.auth.getUser();

        if (authError || !authData.user) {

          throw new Error(
            "Your session has expired. Please log in again."
          );

        }

        const equipmentValue =
          document.getElementById("pmEquipmentId").value;

        const engineerValue =
          document.getElementById("pmEngineerId").value;

        const pmDateValue =
          document.getElementById("pmDate").value;

        const nextPMDateValue =
          document.getElementById("nextPMDate").value;

        const pmStatusValue =
          document.getElementById("pmStatus").value;

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

        const pmPayload = {

          EquipmentID:
            Number(equipmentValue),

          PMDate:
            pmDateValue,

          NextPMDate:
            nextPMDateValue,

          EngineerID:
            Number(engineerValue),

          "Work Performed":
            document.getElementById("workPerformed").value || null,

          Findings:
            document.getElementById("pmFindings").value || null,

          Recommendations:
            document.getElementById("pmRecommendations").value || null,

          PMStatus:
            pmStatusValue,

          Remarks:
            document.getElementById("pmRemarks").value || null

        };
       // ==================================
        // INSERT PM REPORT
        // ==================================

        const {
          data,
          error
        } = await client
          .from("tblPreventiveMaintenance")
          .insert(pmPayload)
          .select();

        if (error) {

          throw error;

        }

        console.log(
          "PM record inserted:",
          data
        );

        // ==================================
        // SUCCESS
        // ==================================

        if (pmMessage) {

          pmMessage.textContent =
            "Preventive Maintenance report submitted successfully.";

        }

        preventiveMaintenanceForm.reset();

        if (pmDepartmentInput) {

          pmDepartmentInput.value = "";

        }

        // Refresh PM information

        await loadPMHistory();

        await loadPMCounters();

        await loadPMNotifications();

        await loadDashboard();

        setTimeout(function () {

          if (pmMessage) {

            pmMessage.textContent = "";

          }

        }, 5000);

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
  .querySelectorAll(".menu button")
  .forEach(button => {

    button.addEventListener(
      "click",
      async function () {

        const sectionId =
          this.dataset.section;

        document
          .querySelectorAll(".app-section")
          .forEach(section => {

            section.classList.add(
              "hidden"
            );

          });

        const selectedSection =
          document.getElementById(
            sectionId
          );

        if (selectedSection) {

          selectedSection.classList.remove(
            "hidden"
          );

        }

        // Maintenance Reports

        if (
          sectionId ===
          "reportsSection"
        ) {

          await loadMaintenanceReports();

        }

        // Equipment Registration

        if (
          sectionId ===
          "equipmentRegistrationSection"
        ) {

          await loadEquipmentRegistrationDropdowns();

        }

        // Equipment History

        if (
          sectionId ===
          "equipmentHistorySection"
        ) {

          await loadEquipmentHistoryDropdown();

        }

        // Preventive Maintenance

        if (
          sectionId ===
          "pmSection"
        ) {

          await loadPMEquipmentDropdown();

          await loadPMEngineerDropdown();

          await loadPMHistory();

          await loadPMCounters();

          await loadPMNotifications();

        }

        // User Management

        if (
          sectionId ===
          "usersSection"
        ) {

          await loadUsers();

        }

      }

    );

  });


// ==========================================
// LOGIN
// ==========================================

if (loginForm) {

  loginForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();

      if (loginMessage) {

        loginMessage.textContent =
          "Signing in...";

      }

      const email =
        document
          .getElementById("email")
          .value
          .trim();

      const password =
        document
          .getElementById("password")
          .value;

      if (!email || !password) {

        loginMessage.textContent =
          "Please enter your email and password.";

        return;

      }

      try {

        const {
          data,
          error
        } =
          await client.auth.signInWithPassword({

            email,
            password

          });

        if (error) {

          throw error;

        }

        const profile =
          await loadUserProfile(
            data.user.id
          );

        if (!profile) {

          throw new Error(
            "User profile not found."
          );

        }

        if (
          profile.Status
            .toLowerCase() !==
          "active"
        ) {

          await client.auth.signOut();

          throw new Error(
            "Your account has been disabled."
          );

        }

        window.currentUser =
          profile;

        await showApp(
          data.user
        );

      }

      catch (error) {

        console.error(error);

        loginMessage.textContent =
          error.message;

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

    window.currentUser = profile;

    const userRole =
      (profile.UserRole || "")
        .trim()
        .toLowerCase();

    console.log(
      "User profile loaded:",
      profile
    );

    // --------------------------------------
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
    // WELCOME MESSAGE
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
    // MENU PERMISSIONS
    // --------------------------------------

    document
      .querySelectorAll(
        ".menu button"
      )
      .forEach(button => {

        button.style.display = "";

      });

    if (userRole === "engineer") {

      const userButton =
        document.querySelector(
          '[data-section="usersSection"]'
        );

      if (userButton) {

        userButton.style.display =
          "none";

      }

    }

    // --------------------------------------
    // LOAD FORM DATA
    // --------------------------------------

    await loadFormData();

    // --------------------------------------
    // LOAD REPORTS
    // --------------------------------------

    await loadMaintenanceReports();

    await loadRecentMaintenanceReports();

    // --------------------------------------
    // LOAD PM
    // --------------------------------------

    await loadPMHistory();

    await loadPMCounters();

    await loadPMNotifications();
    // --------------------------------------
    // LOAD DASHBOARD
    // --------------------------------------

    await loadDashboard();

    console.log(
      "Application loaded successfully."
    );

    if (loginMessage) {

      loginMessage.textContent = "";

    }

  }

  catch (error) {

    console.error(
      "Show application error:",
      error
    );

    if (loginMessage) {

      loginMessage.textContent =
        "Login succeeded, but the application could not load: " +
        error.message;

    }

    try {

      await client.auth.signOut();

    }

    catch (signOutError) {

      console.error(
        "Sign out error:",
        signOutError
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

  }

}
// ==========================================
// LOGOUT
// ==========================================

if (logoutBtn) {

  logoutBtn.addEventListener(
    "click",
    async function () {

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
          "hidden";

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

        loginMessage.textContent = "";

      }

    }

  );

}


// ==========================================
// CHECK EXISTING SESSION
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

      await showApp(
        data.session.user
      );

    }

    else {

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

  }

}
// ==========================================
// AUTH STATE CHANGE
// ==========================================

client.auth.onAuthStateChange(
  async function (
    event,
    session
  ) {

    console.log(
      "Auth event:",
      event
    );

    if (
      event === "SIGNED_IN" &&
      session &&
      session.user
    ) {

      await showApp(
        session.user
      );

    }

    if (
      event === "SIGNED_OUT"
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
  async function () {

    console.log(
      "ATBUTH Biomedical CMMS starting..."
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

    await checkExistingSession();

  }
);


// ==========================================
// FINAL STARTUP LOG
// ==========================================

console.log(
  "ATBUTH Biomedical CMMS JavaScript loaded successfully."
);
// ==========================================
// LOAD PREVENTIVE MAINTENANCE HISTORY
// ==========================================

async function loadPMHistory() {

  const pmTableBody =
    document.getElementById(
      "pmHistoryTableBody"
    );

  const pmLoading =
    document.getElementById(
      "pmLoading"
    );

  const pmHistoryMessage =
    document.getElementById(
      "pmHistoryMessage"
    );

  if (!pmTableBody) {
    return;
  }

  if (pmLoading) {

    pmLoading.textContent =
      "Loading preventive maintenance history...";

  }

  if (pmHistoryMessage) {

    pmHistoryMessage.textContent = "";

  }

  try {

    const {
      data,
      error
    } = await client
      .from("vwPMHistory")
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

    pmTableBody.innerHTML = "";

    if (!data || data.length === 0) {

      pmTableBody.innerHTML = `
        <tr>
          <td colspan="12">
            No PM records found.
          </td>
        </tr>
      `;

      if (pmLoading) {

        pmLoading.textContent = "";

      }

      return;

    }

    data.forEach(pm => {

      let dueStatus = "";

      if (pm.NextPMDate) {

        const today = new Date();

        today.setHours(
          0,
          0,
          0,
          0
        );

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

        if (days < 0) {

          dueStatus =
            "Overdue";

        }

        else if (days === 0) {

          dueStatus =
            "Due Today";

        }

        else if (days <= 7) {

          dueStatus =
            "Due Soon";

        }

        else {

          dueStatus =
            "Not Due";

        }

      }

      else {

        dueStatus =
          "No Date";

      }

      const row =
        document.createElement(
          "tr"
        );

      row.innerHTML = `

        <td>${pm.BMENumber || ""}</td>

        <td>${pm.EquipmentName || ""}</td>

        <td>${pm.DepartmentName || ""}</td>

        <td>${pm.PMDate || ""}</td>

        <td>${pm.NextPMDate || ""}</td>

        <td>${dueStatus}</td>

        <td>${pm.EngineerName || ""}</td>

        <td>${pm.WorkPerformed || ""}</td>

        <td>${pm.Findings || ""}</td>

        <td>${pm.Recommendations || ""}</td>

        <td>${pm.PMStatus || ""}</td>

        <td>${pm.Remarks || ""}</td>

      `;

      pmTableBody.appendChild(
        row
      );

    });

    if (pmLoading) {

      pmLoading.textContent = "";

    }

  }

  catch (error) {

    console.error(
      "PM History Error:",
      error
    );

    pmTableBody.innerHTML = `
      <tr>
        <td colspan="12">
          Unable to load PM history.
        </td>
      </tr>
    `;

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


  if (
    !pmDueTodayCount ||
    !pmOverdueCount
  ) {

    return;

  }


  pmDueTodayCount.textContent =
    "...";

  pmOverdueCount.textContent =
    "...";


  try {

    const {
      data,
      error
    } = await client
      .from("vwPMHistory")
      .select(
        "NextPMDate"
      );


    if (error) {

      throw error;

    }


    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );


    let dueToday = 0;

    let overdue = 0;


    (data || []).forEach(pm => {


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


      if (
        nextPM.getTime() ===
        today.getTime()
      ) {

        dueToday++;

      }

      else if (
        nextPM < today
      ) {

        overdue++;

      }


    });


    pmDueTodayCount.textContent =
      dueToday;


    pmOverdueCount.textContent =
      overdue;


  }


  catch(error) {

    console.error(
      "PM Counter Error:",
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


  if (
    !tableBody ||
    !message
  ) {

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


    tableBody.innerHTML =
      "";


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

          status =
            "Overdue";

        }

        else if (days === 0) {

          status =
            "Due Today";

        }

        else if (days <= 7) {

          status =
            "Due Soon";

        }

        else {

          return;

        }


        records++;


        tableBody.innerHTML += `

          <tr>

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
              ${pm.NextPMDate || ""}
            </td>

            <td>
              ${status}
            </td>

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


  catch(error) {

    console.error(
      "PM Notification Error:",
      error
    );


    message.textContent =
      "Unable to load PM notifications.";

  }

}
// ==========================================
// LOAD RECENT MAINTENANCE REPORTS
// ==========================================

async function loadRecentMaintenanceReports() {

  const loading =
    document.getElementById(
      "dashboardReportsLoading"
    );

  const tableBody =
    document.getElementById(
      "dashboardReportsBody"
    );


  if (
    !loading ||
    !tableBody
  ) {

    return;

  }


  loading.textContent =
    "Loading recent reports...";


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
      )
      .limit(5);



    if (error) {

      throw error;

    }


    tableBody.innerHTML =
      "";



    if (
      !data ||
      data.length === 0
    ) {


      tableBody.innerHTML = `

        <tr>

          <td colspan="6">

            No maintenance reports found.

          </td>

        </tr>

      `;


      loading.textContent =
        "";


      return;

    }



    data.forEach(
      report => {


        tableBody.innerHTML += `

          <tr>


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

              ${report.StatusName || ""}

            </td>


          </tr>

        `;


      }
    );



    loading.textContent =
      "";



  }


  catch(error) {


    console.error(
      "Recent Maintenance Reports Error:",
      error
    );


    loading.textContent =
      "Unable to load recent reports.";


  }

}
// ==========================================
// LOAD DASHBOARD
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


    // TOTAL EQUIPMENT

    const {
      count: equipmentCount
    } = await client
      .from("tblEquipment")
      .select(
        "*",
        {
          count: "exact",
          head: true
        }
      );


    totalEquipment.textContent =
      equipmentCount || 0;



    // TOTAL MAINTENANCE REPORTS

    const {
      count: maintenanceCount
    } = await client
      .from("tblMaintenanceReport")
      .select(
        "*",
        {
          count: "exact",
          head: true
        }
      );


    totalMaintenance.textContent =
      maintenanceCount || 0;



    // UNDER REPAIR

    const {
      count: underRepairCount
    } = await client
      .from("tblEquipment")
      .select(
        "*",
        {
          count: "exact",
          head: true
        }
      )
      .eq(
        "StatusID",
        2
      );


    underRepair.textContent =
      underRepairCount || 0;



    // AWAITING PARTS

    const {
      count: awaitingPartsCount
    } = await client
      .from("tblEquipment")
      .select(
        "*",
        {
          count: "exact",
          head: true
        }
      )
      .eq(
        "StatusID",
        4
      );


    awaitingParts.textContent =
      awaitingPartsCount || 0;



    // PM COUNTERS

    const {
      data: pmRecords
    } = await client
      .from("vwPMHistory")
      .select(
        "NextPMDate"
      );



    const today =
      new Date();


    today.setHours(
      0,
      0,
      0,
      0
    );



    let dueToday = 0;

    let overdue = 0;



    (pmRecords || []).forEach(
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



        if (
          nextPM.getTime() ===
          today.getTime()
        ) {

          dueToday++;

        }


        else if (
          nextPM < today
        ) {

          overdue++;

        }


      }
    );



    pmDueToday.textContent =
      dueToday;


    pmOverdue.textContent =
      overdue;



    // LOAD DASHBOARD RECENT REPORTS

    await loadRecentMaintenanceReports();



  }


  catch(error) {


    console.error(
      "Dashboard Error:",
      error
    );


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
        "Existing session found."
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


  catch(error) {


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

        if (loginMessage) {

          loginMessage.textContent =
            "Please enter email and password.";

        }

        return;

      }



      try {


        const {
          data,
          error
        } =
        await client.auth.signInWithPassword({

          email:
            email,

          password:
            password

        });



        if (error) {

          throw error;

        }



        const profile =
          await loadUserProfile(
            data.user.id
          );



        if (!profile) {

          throw new Error(
            "User profile not found."
          );

        }



        if (
          profile.Status
            .toLowerCase() !==
          "active"
        ) {


          await client.auth.signOut();


          throw new Error(
            "Account is disabled."
          );

        }



        window.currentUser =
          profile;



        await showApp(
          data.user
        );



      }


      catch(error) {


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
// SHOW APPLICATION AFTER LOGIN
// ==========================================

async function showApp(user) {

  try {


    const profile =
      await loadUserProfile(
        user.id
      );


    if (!profile) {

      throw new Error(
        "User profile not found."
      );

    }


    window.currentUser =
      profile;



    const userRole =
      (profile.UserRole || "")
      .trim()
      .toLowerCase();



    // HIDE LOGIN

    if (loginView) {

      loginView.classList.add(
        "hidden"
      );

    }



    // SHOW APPLICATION

    if (appView) {

      appView.classList.remove(
        "hidden"
      );

    }



    // DISPLAY USER NAME

    if (welcomeText) {


      welcomeText.textContent =
        `Welcome, ${
          profile["Full name"] ||
          profile.Username ||
          user.email
        }`;


    }



    // USER PERMISSION

    document
      .querySelectorAll(
        ".menu button"
      )
      .forEach(
        button => {

          button.style.display =
            "";

        }
      );



    if (
      userRole ===
      "engineer"
    ) {


      const userManagementButton =
        document.querySelector(
          '[data-section="usersSection"]'
        );


      if (userManagementButton) {

        userManagementButton.style.display =
          "none";

      }

    }



    // LOAD FORM DATA

    await loadFormData();



    // LOAD REPORTS

    await loadMaintenanceReports();



    // LOAD DASHBOARD

    await loadDashboard();



    // LOAD PM INFORMATION

    await loadPMHistory();

    await loadPMCounters();

    await loadPMNotifications();



    console.log(
      "Application loaded successfully."
    );


  }


  catch(error) {


    console.error(
      "Show application error:",
      error
    );


    if (loginMessage) {

      loginMessage.textContent =
        "Application loading error: " +
        error.message;

    }


    await client.auth.signOut();


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


      catch(error) {

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
// APPLICATION STARTUP
// ==========================================

document.addEventListener(
  "DOMContentLoaded",
  async function() {


    console.log(
      "ATBUTH Biomedical CMMS starting..."
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



    await checkExistingSession();



  }
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



      const rows =
        document.querySelectorAll(
          "#pmHistoryTableBody tr"
        );



      let visibleRows = 0;



      rows.forEach(
        row => {


          const text =
            row.textContent
              .toLowerCase();



          if (
            searchText === "" ||
            text.includes(searchText)
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



      const message =
        document.getElementById(
          "pmHistoryMessage"
        );



      if (
        searchText !== ""
      ) {


        if (
          visibleRows === 0
        ) {


          if (message) {

            message.textContent =
              "No matching PM records found.";

          }


        }

        else {


          if (message) {

            message.textContent =
              `${visibleRows} matching PM record(s) found.`;

          }


        }


      }

      else {


        if (message) {

          message.textContent =
            "";

        }


      }


    }
  );

}



// ==========================================
// MAINTENANCE REPORT SEARCH
// ==========================================

const reportSearch =
  document.getElementById(
    "reportSearch"
  );



if (reportSearch) {


  reportSearch.addEventListener(
    "input",
    function() {


      const search =
        this.value
          .toLowerCase()
          .trim();



      const rows =
        document.querySelectorAll(
          "#reportsTableBody tr"
        );



      rows.forEach(
        row => {


          if (
            row.textContent
              .toLowerCase()
              .includes(search)
          ) {


            row.style.display =
              "";


          }

          else {


            row.style.display =
              "none";


          }


        }
      );


    }
  );

}
// ==========================================
// PRINT TABLE FUNCTION
// ==========================================

function printTable(
  sectionId,
  title
) {


  const section =
    document.getElementById(
      sectionId
    );



  if (!section) {

    alert(
      "Section not found."
    );

    return;

  }



  const table =
    section.querySelector(
      "table"
    );



  if (!table) {

    alert(
      "Table not found."
    );

    return;

  }



  const printWindow =
    window.open(
      "",
      "_blank"
    );



  printWindow.document.write(`

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>
${title}
</title>


<style>

body {

  font-family: Arial, sans-serif;

  margin: 20px;

}


h1,
h2 {

  text-align: center;

}


table {

  width:100%;

  border-collapse:collapse;

  margin-top:20px;

}


th,
td {

  border:1px solid black;

  padding:8px;

  font-size:12px;

  text-align:left;

}


</style>


</head>


<body>


<h1>
ATBUTH Biomedical CMMS
</h1>


<h2>
${title}
</h2>


${table.outerHTML}


</body>


</html>

`);




  printWindow.document.close();



  setTimeout(
    function() {


      printWindow.focus();


      printWindow.print();



    },
    800
  );


}




// ==========================================
// PRINT REPORTS
// ==========================================

const printReportsBtn =
  document.getElementById(
    "printReportsBtn"
  );


if (printReportsBtn) {


  printReportsBtn.addEventListener(
    "click",
    function() {


      printTable(
        "reportsSection",
        "Maintenance Report History"
      );


    }
  );


}



// ==========================================
// PRINT EQUIPMENT HISTORY
// ==========================================

const printEquipmentHistoryBtn =
  document.getElementById(
    "printEquipmentHistoryBtn"
  );



if (printEquipmentHistoryBtn) {


  printEquipmentHistoryBtn.addEventListener(
    "click",
    function() {


      printTable(
        "equipmentHistorySection",
        "Equipment History"
      );


    }
  );


}



// ==========================================
// PRINT PM HISTORY
// ==========================================

const printPMBtn =
  document.getElementById(
    "printPMBtn"
  );



if (printPMBtn) {


  printPMBtn.addEventListener(
    "click",
    function() {


      printTable(
        "pmPrintArea",
        "Preventive Maintenance History"
      );


    }
  );


}
// ==========================================
// USER MANAGEMENT
// ==========================================

const userForm =
  document.getElementById(
    "userForm"
  );


if (userForm) {


  userForm.addEventListener(
    "submit",
    async function(event) {


      event.preventDefault();



      const newUser = {


        fullName:
          document.getElementById(
            "userFullName"
          ).value.trim(),


        username:
          document.getElementById(
            "userUsername"
          ).value.trim(),


        email:
          document.getElementById(
            "userEmail"
          ).value.trim(),


        password:
          document.getElementById(
            "userPassword"
          ).value,


        role:
          document.getElementById(
            "userRole"
          ).value,


        status:
          document.getElementById(
            "userStatus"
          ).value


      };



      console.log(
        "New user information:",
        newUser
      );



      alert(
        "User information captured successfully.\n\n" +
        "Next step: Create Supabase Auth account securely."
      );


    }
  );

}




// ==========================================
// LOAD USERS
// ==========================================

async function loadUsers() {


  const usersTableBody =
    document.getElementById(
      "usersTableBody"
    );



  if (!usersTableBody) {

    return;

  }



  usersTableBody.innerHTML = `

    <tr>

      <td colspan="4">
        Loading users...
      </td>

    </tr>

  `;



  try {


    const {
      data,
      error
    } = await client
      .from(
        "tblUsers"
      )
      .select(
        `
        Username,
        "Full name",
        UserRole,
        Status
        `
      )
      .order(
        "Username"
      );



    if (error) {

      throw error;

    }



    usersTableBody.innerHTML =
      "";



    if (
      !data ||
      data.length === 0
    ) {


      usersTableBody.innerHTML = `

        <tr>

          <td colspan="4">
            No users found.
          </td>

        </tr>

      `;


      return;

    }




    data.forEach(
      user => {


        usersTableBody.innerHTML += `

          <tr>

            <td>
              ${user.Username || ""}
            </td>


            <td>
              ${user["Full name"] || ""}
            </td>


            <td>
              ${user.UserRole || ""}
            </td>


            <td>
              ${user.Status || ""}
            </td>


          </tr>

        `;


      }
    );


  }


  catch(error) {


    console.error(
      "Load users error:",
      error
    );



    usersTableBody.innerHTML = `

      <tr>

        <td colspan="4">
          Unable to load users.
        </td>

      </tr>

    `;


  }


}



// ==========================================
// FINAL STARTUP MESSAGE
// ==========================================

console.log(
  "ATBUTH Biomedical CMMS JavaScript loaded successfully."
);
