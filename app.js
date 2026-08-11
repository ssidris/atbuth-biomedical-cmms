
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
  await loadEquipmentSearchData();

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
// EQUIPMENT SEARCH
// ==========================================

async function loadEquipmentSearchData() {

  const searchInput =
    document.getElementById(
      "equipmentSearch"
    );

  const departmentFilter =
    document.getElementById(
      "equipmentDepartmentFilter"
    );
  const sourceFilter =
  document.getElementById(
    "equipmentSourceFilter"
  );

const ngoSearch =
  document.getElementById(
    "equipmentNGOSearch"
  );

  const results =
    document.getElementById(
      "equipmentSearchResults"
    );

  const count =
    document.getElementById(
      "equipmentSearchCount"
    );

  if (
  !searchInput ||
  !departmentFilter ||
  !sourceFilter ||
  !ngoSearch ||
  !results ||
  !count
) {
  return;
}

  try {

    // Load departments

    const {
      data: departments,
      error: departmentError
    } = await client
      .from("tblDepartment")
      .select(
        "DepartmentID, DepartmentName"
      )
      .order(
        "DepartmentName",
        {
          ascending: true
        }
      );

    if (departmentError) {
      throw departmentError;
    }

    departmentFilter.innerHTML =
      '<option value="">All Departments</option>';

    (departments || []).forEach(
      department => {

        const option =
          document.createElement(
            "option"
          );

        option.value =
          department.DepartmentID;

        option.textContent =
          department.DepartmentName;

        departmentFilter.appendChild(
          option
        );

      }
    );

    // Load equipment

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
DepartmentID,
StatusID,
SourceOfEquipment,
NGOName
        `
      )
      .order(
        "EquipmentName",
        {
          ascending: true
        }
      );

    if (equipmentError) {
      throw equipmentError;
    }

    // Store equipment locally

    searchInput.dataset.loaded =
      "true";

    window.equipmentSearchData =
      equipment || [];

    window.equipmentDepartmentData =
      departments || [];
    // Load equipment statuses

const {
  data: statuses,
  error: statusError
} = await client
  .from("tblEquipmentStatus")
  .select(
    "StatusID, StatusName"
  );

if (statusError) {
  throw statusError;
}

window.equipmentStatusData =
  statuses || [];

    // Search function

    function performEquipmentSearch() {

      const searchText =
        searchInput.value
          .trim()
          .toLowerCase();

      const selectedDepartment =
  departmentFilter.value;

const selectedSource =
  sourceFilter.value;

const ngoSearchText =
  ngoSearch.value
    .trim()
    .toLowerCase();

let filtered =
        window.equipmentSearchData
          .filter(
            equipment => {

              const name =
                (
                  equipment.EquipmentName ||
                  ""
                ).toLowerCase();

              const bme =
                (
                  equipment.BMENumber ||
                  ""
                ).toLowerCase();

              const matchesSearch =
                !searchText ||
                name.includes(
                  searchText
                ) ||
                bme.includes(
                  searchText
                );

              const matchesDepartment =
  !selectedDepartment ||
  String(
    equipment.DepartmentID
  ) ===
  String(
    selectedDepartment
  );

const matchesSource =
  !selectedSource ||
  String(
    equipment.SourceOfEquipment || ""
  ).toLowerCase() ===
  String(
    selectedSource
  ).toLowerCase();

const matchesNGO =
  !ngoSearchText ||
  String(
    equipment.NGOName || ""
  )
    .toLowerCase()
    .includes(
      ngoSearchText
    );

return (
  matchesSearch &&
  matchesDepartment &&
  matchesSource &&
  matchesNGO
);
  

            }
          );

      count.textContent =
        `${filtered.length} equipment found`;

      if (!filtered.length) {

        results.innerHTML =
          "<p>No matching equipment found.</p>";

        return;

      }

      let html = `
  <table>
    <thead>
      <tr>
        <th>BME Number</th>
        <th>Equipment</th>
        <th>Department</th>
        <th>Source</th>
        <th>NGO Name</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
`;
            

      filtered.forEach(
        equipment => {

          const department =
            window.equipmentDepartmentData
              .find(
                d =>
                  String(
                    d.DepartmentID
                  ) ===
                  String(
                    equipment.DepartmentID
                  )
              );
          const status =
  window.equipmentStatusData
    .find(
      s =>
        String(
          s.StatusID
        ) ===
        String(
          equipment.StatusID
        )
    );

          html += `
            <tr
              class="equipment-search-row"
              data-equipment-id="${equipment.EquipmentID}"
              style="cursor:pointer;"
            >

              <td>
                ${
                  equipment.BMENumber ||
                  ""
                }
              </td>

              <td>
                ${
                  equipment.EquipmentName ||
                  ""
                }
              </td>

              <td>
  ${
    department
      ? department.DepartmentName
      : "Unknown"
  }
</td>

<td>
  ${
    equipment.SourceOfEquipment ||
    "Unknown"
  }
</td>

<td>
  ${
    equipment.NGOName ||
    "-"
  }
</td>

<td>
  ${
    status
      ? status.StatusName
      : "Unknown"
  }
</td>

            </tr>
          `;

        }
      );

      html += `
          </tbody>
        </table>
      `;

      results.innerHTML =
        html;

      // Clicking a result opens
      // the existing Equipment History

      results
        .querySelectorAll(
          ".equipment-search-row"
        )
        .forEach(
          row => {

            row.addEventListener(
              "click",
              function() {

                const equipmentId =
                  this.dataset
                    .equipmentId;

                const historySelect =
                  document.getElementById(
                    "historyEquipmentId"
                  );

                if (
                  historySelect
                ) {

                  historySelect.value =
                    equipmentId;

                  historySelect.dispatchEvent(
                    new Event(
                      "change"
                    )
                  );

                }

              }
            );

          }
        );

    }

    searchInput.addEventListener(
      "input",
      performEquipmentSearch
    );

    departmentFilter.addEventListener(
      "change",
      performEquipmentSearch
    );
sourceFilter.addEventListener(
  "change",
  performEquipmentSearch
);

ngoSearch.addEventListener(
  "input",
  performEquipmentSearch
);
  }

  catch (error) {

    console.error(
      "Equipment search error:",
      error
    );

    count.textContent =
      "Unable to load equipment.";

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
      <td colspan="12">
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
          <td colspan="12">
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
          <td colspan="12">
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
  <input
    type="checkbox"
    class="equipment-history-select-checkbox"
    data-maintenanceid="${report.MaintenanceID}"
  >
</td>
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
        <td colspan="12">
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
      <td colspan="12">
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
          <td colspan="12">
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
          <td colspan="12">
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
    <input
      type="checkbox"
      class="maintenance-select-checkbox"
      data-maintenanceid="${report.MaintenanceID}"
    >
  </td>

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
        <td colspan="12">
          Unable to load maintenance reports.
        </td>
      </tr>`;

  }

}

// ==========================================
// LOAD DASHBOARD RECENT MAINTENANCE REPORTS
// ==========================================

async function loadDashboardRecentReports() {

  const loading =
    document.getElementById(
      "dashboardReportsLoading"
    );

  const tableBody =
    document.getElementById(
      "dashboardReportsBody"
    );

  if (!tableBody) {
    return;
  }

  if (loading) {
    loading.textContent =
      "Loading recent reports...";
  }

  try {

    const {
      data,
      error
    } = await client
      .from(
        "vwMaintenanceReport"
      )
      .select(
        "ReportDate, BMENumber, EquipmentName, DepartmentName, EngineerName, StatusName"
      )
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

    tableBody.innerHTML = "";

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

      if (loading) {
        loading.textContent =
          "No recent reports.";
      }

      return;
    }

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

        `;

        tableBody.appendChild(
          row
        );

      }
    );

    if (loading) {
      loading.textContent =
        `${data.length} recent report(s).`;
    }

  }

  catch (error) {

    console.error(
      "Dashboard recent reports error:",
      error
    );

    tableBody.innerHTML = `
      <tr>
        <td colspan="6">
          Unable to load recent reports.
        </td>
      </tr>
    `;

    if (loading) {
      loading.textContent =
        "Unable to load recent reports.";
    }

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

const sourceOfEquipment =
  document.getElementById(
    "newSourceOfEquipment"
  ).value;

const ngoName =
  document.getElementById(
    "newNGOName"
  ).value.trim();
        if (
  sourceOfEquipment === "NGO" &&
  !ngoName
) {

  throw new Error(
    "Please enter the NGO name."
  );

}

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

SourceOfEquipment:
  sourceOfEquipment || null,

NGOName:
  ngoName || null,

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
// VALIDATE REQUIRED PART DETAILS
// ----------------------------------

const requiredPart =
  document.getElementById(
    "requiredPart"
  ).value.trim();

const quantityRequired =
  document.getElementById(
    "quantityRequired"
  ).value;

const partStatusValue =
  partStatusSelect
    ? partStatusSelect.value
    : "";


// If a part is required,
// quantity and part status must be provided.

if (requiredPart) {

  if (
    !quantityRequired ||
    Number(quantityRequired) <= 0
  ) {

    throw new Error(
      "Please enter the quantity required for the part."
    );

  }

  if (!partStatusValue) {

    throw new Error(
      "Please select the Part Requested Status."
    );

  }

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
// ==========================================
// UPDATE EQUIPMENT CURRENT STATUS
// ==========================================
alert(
  "Equipment value: " + equipmentValue +
  "\nConverted EquipmentID: " + Number(equipmentValue) +
  "\nStatus value: " + statusValue +
  "\nConverted StatusID: " + Number(statusValue)
);
const {
  data: updatedEquipment,
  error: equipmentStatusError
} = await client
  .from("tblEquipment")
  .update({
    StatusID: Number(statusValue)
  })
  .eq(
    "EquipmentID",
    Number(equipmentValue)
  )
  .select("EquipmentID, BMENumber, EquipmentName, StatusID");

if (equipmentStatusError) {
  throw equipmentStatusError;
}

console.log(
  "UPDATED EQUIPMENT:",
  updatedEquipment
);

if (
  !updatedEquipment ||
  updatedEquipment.length === 0
) {
  throw new Error(
    "Equipment status was not updated. No matching equipment row was returned."
  );
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
await loadDashboard();


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

let treatedPMID = null;

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

        let data;
let error;

if (treatedPMID) {

  // ----------------------------------
  // UPDATE EXISTING PM
  // ----------------------------------

  const result = await client
  .from("tblPreventiveMaintenance")
  .update(pmPayload)
  .eq(
    "PMID",
    treatedPMID
  )
  .select();

data = result.data;
error = result.error;

if (error) {
  throw error;
}

if (
  !data ||
  data.length === 0
) {
  throw new Error(
    "PM record was not updated. The selected PMID could not be updated."
  );
}

console.log(
  "PM record successfully updated:",
  data
);

} else {

  // ----------------------------------
  // CREATE NEW PM
  // ----------------------------------

  const result = await client
    .from("tblPreventiveMaintenance")
    .insert(pmPayload)
    .select();

  data = result.data;
  error = result.error;

  console.log(
    "New PM record inserted:",
    data
  );

}

if (error) {

  throw error;

}

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
treatedPMID = null;

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
    <input
      type="checkbox"
      class="pm-select-checkbox"
    >
  </td>

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
.select(
  "NextPMDate, PMStatus"
);


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

    // Ignore PMs without a next PM date
    if (!pm.NextPMDate) {
      return;
    }

    // Ignore completed PMs
    if (
      pm.PMStatus &&
      pm.PMStatus.trim().toLowerCase() ===
        "completed"
    ) {
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

    // PM DUE TODAY
    if (
      nextPMDate.getTime() ===
      today.getTime()
    ) {

      dueToday++;

    }

    // PM OVERDUE
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
    if (
  pm.PMStatus &&
  pm.PMStatus.toLowerCase() ===
    "completed"
) {

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

          <tr data-pmid="${pm.PMID}">

            <td>${pm.BMENumber || ""}</td>

            <td>${pm.EquipmentName || ""}</td>

            <td>${pm.DepartmentName || ""}</td>

            <td>${pm.NextPMDate || ""}</td>

            <td>${status}</td>
            <td>
  <button
    type="button"
    class="treat-pm-btn"
    data-pmid="${pm.PMID}">
    Treat PM
  </button>
</td>


          </tr>

        `;

      }
    );

    if (records === 0) {

      tableBody.innerHTML = `

        <tr>

          <td colspan="6">

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

// ======================================
// TREAT PM
// ======================================

document.addEventListener(
  "click",
  async function(event) {

    const button =
      event.target.closest(
        ".treat-pm-btn"
      );

    if (!button) {
      return;
    }

    const pmid =
      button.dataset.pmid;
    
treatedPMID = pmid;
    if (!pmid) {
      console.error(
        "PMID not found."
      );
      return;
    }

    try {

      const {
  data: pm,
  error
} = await client
  .from(
    "tblPreventiveMaintenance"
  )
  .select("*")
  .eq(
    "PMID",
    pmid
  )
  .single();

      if (error) {
        throw error;
      }

      if (!pm) {
        throw new Error(
          "PM record not found."
        );
      }

      // Select the PM section
      const pmSection =
        document.getElementById(
          "pmSection"
        );

      if (pmSection) {

        pmSection.scrollIntoView({
          behavior: "smooth"
        });

      }

      // Select equipment
      const equipmentSelect =
        document.getElementById(
          "pmEquipmentId"
        );

      if (
        equipmentSelect &&
        pm.EquipmentID
      ) {

        equipmentSelect.value =
          String(
            pm.EquipmentID
          );

        equipmentSelect.dispatchEvent(
          new Event("change")
        );
        // ----------------------------------
// LOAD EXISTING PM DETAILS
// ----------------------------------

const engineerSelect =
  document.getElementById(
    "pmEngineerId"
  );

if (
  engineerSelect &&
  pm.EngineerID
) {

  engineerSelect.value =
    String(
      pm.EngineerID
    );

}


// PM DATE

const pmDateInput =
  document.getElementById(
    "pmDate"
  );

if (
  pmDateInput &&
  pm.PMDate
) {

  pmDateInput.value =
    String(
      pm.PMDate
    ).substring(
      0,
      10
    );

}


// NEXT PM DATE

const nextPMDateInput =
  document.getElementById(
    "nextPMDate"
  );

if (
  nextPMDateInput &&
  pm.NextPMDate
) {

  nextPMDateInput.value =
    String(
      pm.NextPMDate
    ).substring(
      0,
      10
    );

}


// WORK PERFORMED

const workPerformedInput =
  document.getElementById(
    "workPerformed"
  );

if (workPerformedInput) {

  workPerformedInput.value =
    pm["Work Performed"] || "";

}


// FINDINGS

const findingsInput =
  document.getElementById(
    "pmFindings"
  );

if (findingsInput) {

  findingsInput.value =
    pm.Findings || "";

}


// RECOMMENDATIONS

const recommendationsInput =
  document.getElementById(
    "pmRecommendations"
  );

if (recommendationsInput) {

  recommendationsInput.value =
    pm.Recommendations || "";

}


// PM STATUS

const pmStatusInput =
  document.getElementById(
    "pmStatus"
  );

if (
  pmStatusInput &&
  pm.PMStatus
) {

  pmStatusInput.value =
    pm.PMStatus;

}


// REMARKS

const remarksInput =
  document.getElementById(
    "pmRemarks"
  );

if (remarksInput) {

  remarksInput.value =
    pm.Remarks || "";

}

      }

      console.log(
        "Treat PM loaded:",
        pm
      );

    }

    catch (error) {

      console.error(
        "Treat PM error:",
        error
      );

      alert(
        "Unable to load PM record: " +
        error.message
      );

    }

  }
);
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
// REFRESH DASHBOARD BUTTON
// ==========================================

const refreshDashboardBtn =
  document.getElementById(
    "refreshDashboardBtn"
  );

if (refreshDashboardBtn) {

  refreshDashboardBtn.addEventListener(
    "click",
    async function() {

      refreshDashboardBtn.disabled =
        true;

      refreshDashboardBtn.textContent =
        "🔄 Refreshing...";

      try {

        // Refresh PM counters
        await loadPMCounters();

        // Refresh PM notifications
        await loadPMNotifications();

        // Refresh recent maintenance reports
        await loadDashboardRecentReports();

        // Refresh dashboard data
        await loadDashboard();

      }

      catch (error) {

        console.error(
          "Dashboard refresh error:",
          error
        );

        alert(
          "Unable to refresh dashboard: " +
          error.message
        );

      }

      finally {

        refreshDashboardBtn.disabled =
          false;

        refreshDashboardBtn.textContent =
          "🔄 Refresh Dashboard";

      }

    }
  );

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
  const workingEquipment =
  document.getElementById(
    "dashboardWorkingEquipment"
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
  !workingEquipment ||
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
    // Working Equipment

const {
  count: workingEquipmentCount
} = await client
  .from("tblEquipment")
  .select("*", {
    count: "exact",
    head: true
  })
  .eq("StatusID", 1);

workingEquipment.textContent =
  workingEquipmentCount || 0;
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
    // PM Due Today

const {
  data: pmRecords,
  error: pmRecordsError
} = await client
  .from("vwPMHistory")
  .select(
    "NextPMDate, PMStatus"
  );

if (pmRecordsError) {
  throw pmRecordsError;
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

(pmRecords || []).forEach(
  pm => {

    // Ignore PMs without a next date
    if (!pm.NextPMDate) {
      return;
    }

    // Ignore completed PMs
    if (
      pm.PMStatus &&
      pm.PMStatus.trim().toLowerCase() ===
        "completed"
    ) {
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

    // PM DUE TODAY
    if (
      nextPM.getTime() ===
      today.getTime()
    ) {

      dueToday++;

    }

    // PM OVERDUE
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
    // Awaiting Parts Equipment

const {
  count: awaitingPartsCount
} = await client
  .from("tblEquipment")
  .select("*", {
    count: "exact",
    head: true
  })
  .eq("StatusID", 3);

awaitingParts.textContent =
  awaitingPartsCount || 0;
    await loadDashboardRecentReports();
    
  }

  catch (error) {

    console.error(
      "Dashboard error:",
      error
    );

  }

}

// ==========================================
// MAINTENANCE REPORT SEARCH
// ==========================================

const reportSearch =
  document.getElementById("reportSearch");

if (reportSearch) {

  reportSearch.addEventListener("input", function () {

    const search =
      this.value.toLowerCase().trim();

    const rows =
      document.querySelectorAll(
        "#reportsTableBody tr"
      );

    rows.forEach(row => {

      if (
        row.textContent
          .toLowerCase()
          .includes(search)
      ) {

        row.style.display = "";

      } else {

        row.style.display = "none";

      }

    });

  });

}

        

// ==========================================
// PRINT MAINTENANCE REPORT HISTORY
// ==========================================

const printReportsBtn =
  document.getElementById("printReportsBtn");


if (printReportsBtn) {

  printReportsBtn.addEventListener(
    "click",
    function () {

      const table =
        document.getElementById(
          "reportsTable"
        );


      if (!table) {

        alert(
          "Report table not found"
        );

        return;

      }


      const printWindow =
        window.open(
          "",
          "_blank"
        );


      if (!printWindow) {

        alert(
          "Allow popup window for printing"
        );

        return;

      }


      printWindow.document.write(`

        <html>

        <head>

        <title>
          Maintenance Report History
        </title>


        <style>

        body {
          font-family: Arial;
          padding: 20px;
        }


        table {
          width:100%;
          border-collapse:collapse;
        }


        th, td {
          border:1px solid black;
          padding:6px;
          font-size:12px;
        }


        </style>


        </head>


        <body>


        <h2>
        ATBUTH Biomedical CMMS
        </h2>


        <h3>
        Maintenance Report History
        </h3>


        ${table.outerHTML}


        </body>


        </html>

      `);


      printWindow.document.close();


      printWindow.onload =
        function () {

          printWindow.print();

        };


    }
  );

}


// ==========================================
// PRINT EQUIPMENT HISTORY (ANDROID FIX)
// ==========================================

document.addEventListener("click", function(e){

  if(e.target.id === "printEquipmentHistoryBtn") {


    const table =
      document.querySelector(
        "#equipmentHistorySection table"
      );


    if(!table){

      alert("Equipment history table not found");

      return;

    }


    const printContents =
      table.outerHTML;


    const newWindow =
      window.open(
        "",
        "",
        "width=1200,height=700"
      );


    if(!newWindow){

      alert("Popup blocked");

      return;

    }


    newWindow.document.write(`

      <html>

      <head>

      <title>
      Equipment History
      </title>

      <style>

      body{
        font-family:Arial;
        padding:20px;
      }

      table{
        width:100%;
        border-collapse:collapse;
      }

      th,td{
        border:1px solid black;
        padding:6px;
      }

      </style>

      </head>


      <body>

      <h2>
      ATBUTH Biomedical CMMS
      </h2>

      <h3>
      Equipment Maintenance History
      </h3>


      ${printContents}


      </body>

      </html>

    `);


    newWindow.document.close();


    setTimeout(()=>{

      newWindow.print();

    },1000);


  }

});

// ==========================================
// PRINT PM HISTORY
// ==========================================

const printPMBtn = document.getElementById("printPMBtn");

if (printPMBtn) {

  printPMBtn.addEventListener("click", function () {

    const printArea = document.getElementById("pmPrintArea");

    if (!printArea) {
      alert("PM history not found.");
      return;
    }

    const newWindow = window.open("", "_blank");

    newWindow.document.write(`
      <!DOCTYPE html>
      <html>

      <head>

      <title>Preventive Maintenance History</title>

      <style>

      body{
        font-family:Arial,sans-serif;
        margin:20px;
      }

      h1,h2,h3{
        text-align:center;
        margin:5px;
      }

      table{
        width:100%;
        border-collapse:collapse;
        margin-top:20px;
      }

      th,td{
        border:1px solid #000;
        padding:8px;
        font-size:12px;
      }

      th{
        background:#e6e6e6;
      }

      footer{
        margin-top:25px;
        text-align:center;
        font-size:11px;
      }

      </style>

      </head>

      <body>

      <h1>ATBUTH</h1>

      <h2>Biomedical Engineering Department</h2>

      <h3>Preventive Maintenance History</h3>

      ${printArea.innerHTML}

      <footer>

      Generated by ATBUTH Biomedical CMMS

      </footer>

      </body>

      </html>
    `);

    newWindow.document.close();

    newWindow.focus();

    setTimeout(function () {

      newWindow.print();

    }, 700);

  });

}
// ==========================================
// DOWNLOAD PM HISTORY AS PDF
// ==========================================

const downloadPMBtn =
  document.getElementById("downloadPMBtn");

if (downloadPMBtn) {

  downloadPMBtn.addEventListener(
    "click",
    function () {

      const printArea =
        document.getElementById(
          "pmPrintArea"
        );

      if (!printArea) {

        alert(
          "PM history not found."
        );

        return;
      }

      if (
        typeof window.jspdf ===
        "undefined"
      ) {

        alert(
          "PDF library is not loaded. Please refresh the page."
        );

        return;
      }

      const {
        jsPDF
      } = window.jspdf;

      const pdf =
        new jsPDF(
          "l",
          "mm",
          "a4"
        );

      pdf.setFontSize(16);

      pdf.text(
        "ATBUTH",
        148,
        15,
        {
          align: "center"
        }
      );

      pdf.setFontSize(12);

      pdf.text(
        "Biomedical Engineering Department",
        148,
        22,
        {
          align: "center"
        }
      );

      pdf.setFontSize(11);

      pdf.text(
        "Preventive Maintenance History",
        148,
        29,
        {
          align: "center"
        }
      );

      const table =
        printArea.querySelector(
          "table"
        );

      if (!table) {

        alert(
          "No PM history table found."
        );

        return;
      }

      const headers = [];

      table
        .querySelectorAll(
          "thead th"
        )
        .forEach(
          th => {

            headers.push(
              th.textContent.trim()
            );

          }
        );

      const rows = [];

      table
        .querySelectorAll(
          "tbody tr"
        )
        .forEach(
          tr => {

            const cells = [];

            tr.querySelectorAll(
              "td"
            ).forEach(
              td => {

                cells.push(
                  td.textContent
                    .trim()
                );

              }
            );

            if (
              cells.length ===
              headers.length
            ) {

              rows.push(
                cells
              );

            }

          }
        );

      if (!rows.length) {

        alert(
          "No PM records available to download."
        );

        return;
      }

      pdf.autoTable({

        head: [
          headers
        ],

        body: rows,

        startY: 35,

        theme: "grid",

        styles: {
          fontSize: 7,
          cellPadding: 2
        },

        headStyles: {
          fontSize: 7
        },

        margin: {
          left: 8,
          right: 8
        }

      });

      pdf.setFontSize(8);

      pdf.text(
        "Generated by ATBUTH Biomedical CMMS",
        148,
        202,
        {
          align: "center"
        }
      );

      pdf.save(
        "ATBUTH_PM_History.pdf"
      );

    }
  );

}
// ==========================================
// DOWNLOAD SELECTED PM RECORD
// ==========================================

const downloadSelectedPMBtn =
  document.getElementById(
    "downloadSelectedPMBtn"
  );

if (downloadSelectedPMBtn) {

  downloadSelectedPMBtn.addEventListener(
    "click",
    function () {

      const selected =
        document.querySelectorAll(
          ".pm-select-checkbox:checked"
        );

      if (selected.length === 0) {

        alert(
          "Please select a PM record first."
        );

        return;
      }

      if (selected.length > 1) {

        alert(
          "Please select only ONE PM record."
        );

        return;
      }

      const checkbox =
        selected[0];

      const row =
        checkbox.closest("tr");

      if (!row) {

        alert(
          "Selected PM record could not be found."
        );

        return;
      }

      if (
        typeof window.jspdf ===
        "undefined"
      ) {

        alert(
          "PDF library is not loaded. Please refresh the page."
        );

        return;
      }

      const {
        jsPDF
      } = window.jspdf;

      const pdf =
        new jsPDF(
          "l",
          "mm",
          "a4"
        );

      pdf.setFontSize(16);

      pdf.text(
        "ATBUTH",
        148,
        15,
        {
          align: "center"
        }
      );

      pdf.setFontSize(12);

      pdf.text(
        "Biomedical Engineering Department",
        148,
        22,
        {
          align: "center"
        }
      );

      pdf.setFontSize(11);

      pdf.text(
        "Preventive Maintenance Record",
        148,
        29,
        {
          align: "center"
        }
      );

      const cells =
        row.querySelectorAll("td");

      const values = [];

      cells.forEach(
        (cell, index) => {

          // Skip the checkbox column
          if (index === 0) {
            return;
          }

          values.push(
            cell.textContent.trim()
          );

        }
      );

      const headers = [
        "BME Number",
        "Equipment",
        "Department",
        "PM Date",
        "Next PM Date",
        "Due Status",
        "Engineer",
        "Work Performed",
        "Findings",
        "Recommendations",
        "PM Status",
        "Remarks"
      ];

      const body =
        values.map(
          (value, index) => [
            headers[index],
            value
          ]
        );

      pdf.autoTable({

        head: [
          [
            "Field",
            "Information"
          ]
        ],

        body: body,

        startY: 38,

        theme: "grid",

        styles: {
          fontSize: 9,
          cellPadding: 3
        },

        columnStyles: {
          0: {
            cellWidth: 45
          },
          1: {
            cellWidth: 225
          }
        },

        margin: {
          left: 10,
          right: 10
        }

      });

      pdf.setFontSize(8);

      pdf.text(
        "Generated by ATBUTH Biomedical CMMS",
        148,
        202,
        {
          align: "center"
        }
      );

      const bmeNumber =
        values[0] ||
        "Selected_Record";

      const safeName =
        bmeNumber
          .replace(
            /[^a-z0-9_-]/gi,
            "_"
          );

      pdf.save(
        `ATBUTH_PM_${safeName}.pdf`
      );

    }
  );

}

// ==========================================
// DOWNLOAD SELECTED MAINTENANCE RECORDS PDF
// ==========================================

const downloadSelectedMaintenancePDFBtn =
  document.getElementById(
    "downloadSelectedMaintenancePDFBtn"
  );

if (downloadSelectedMaintenancePDFBtn) {

  downloadSelectedMaintenancePDFBtn.addEventListener(
    "click",
    function () {

      const selected =
        document.querySelectorAll(
          ".maintenance-select-checkbox:checked"
        );

      if (selected.length === 0) {

        alert(
          "Please select at least one maintenance record first."
        );

        return;
      }

      if (
        typeof window.jspdf ===
        "undefined"
      ) {

        alert(
          "PDF library is not loaded. Please refresh the page."
        );

        return;
      }

      const {
        jsPDF
      } = window.jspdf;

      const pdf =
        new jsPDF(
          "l",
          "mm",
          "a4"
        );

      // --------------------------------------
      // PDF HEADER
      // --------------------------------------

      pdf.setFontSize(16);

      pdf.text(
        "ATBUTH",
        148,
        15,
        {
          align: "center"
        }
      );

      pdf.setFontSize(12);

      pdf.text(
        "Biomedical Engineering Department",
        148,
        22,
        {
          align: "center"
        }
      );

      pdf.setFontSize(11);

      pdf.text(
        "Selected Maintenance Records",
        148,
        29,
        {
          align: "center"
        }
      );

      // --------------------------------------
      // TABLE HEADERS
      // --------------------------------------

      const headers = [
        "Date",
        "Job Order",
        "BME Number",
        "Equipment",
        "Department",
        "Engineer",
        "Maintenance Type",
        "Fault Reported",
        "Action Taken",
        "Status",
        "Remarks"
      ];

      const rows = [];

      // --------------------------------------
      // GET SELECTED RECORDS
      // --------------------------------------

      selected.forEach(
        checkbox => {

          const row =
            checkbox.closest("tr");

          if (!row) {
            return;
          }

          const cells =
            row.querySelectorAll("td");

          const values = [];

          cells.forEach(
            (cell, index) => {

              // Skip Select/checkbox column
              if (index === 0) {
                return;
              }

              values.push(
                cell.textContent.trim()
              );

            }
          );

          if (values.length) {

            rows.push(values);

          }

        }
      );

      if (!rows.length) {

        alert(
          "No maintenance records available to download."
        );

        return;
      }

      // --------------------------------------
      // CREATE PDF TABLE
      // --------------------------------------

      pdf.autoTable({

        head: [
          headers
        ],

        body: rows,

        startY: 35,

        theme: "grid",

        styles: {
          fontSize: 7,
          cellPadding: 2,
          overflow: "linebreak"
        },

        headStyles: {
          fontSize: 7
        },

        margin: {
          left: 8,
          right: 8
        }

      });

      // --------------------------------------
      // FOOTER
      // --------------------------------------

      pdf.setFontSize(8);

      pdf.text(
        "Generated by ATBUTH Biomedical CMMS",
        148,
        202,
        {
          align: "center"
        }
      );

      // --------------------------------------
      // SAVE PDF
      // --------------------------------------

      pdf.save(
        "ATBUTH_Selected_Maintenance_Records.pdf"
      );

    }
  );

}

// ==========================================
// DOWNLOAD FULL MAINTENANCE HISTORY PDF
// ==========================================

const downloadMaintenancePDFBtn =
  document.getElementById(
    "downloadMaintenancePDFBtn"
  );

if (downloadMaintenancePDFBtn) {

  downloadMaintenancePDFBtn.addEventListener(
    "click",
    async function () {

      if (
        typeof window.jspdf ===
        "undefined"
      ) {

        alert(
          "PDF library is not loaded. Please refresh the page."
        );

        return;
      }

      try {

        // --------------------------------------
        // GET ALL MAINTENANCE REPORTS
        // --------------------------------------

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

        if (
          !data ||
          data.length === 0
        ) {

          alert(
            "No maintenance records available to download."
          );

          return;
        }

        // --------------------------------------
        // CREATE PDF
        // --------------------------------------

        const {
          jsPDF
        } = window.jspdf;

        const pdf =
          new jsPDF(
            "l",
            "mm",
            "a4"
          );

        // --------------------------------------
        // HEADER
        // --------------------------------------

        pdf.setFontSize(16);

        pdf.text(
          "ATBUTH",
          148,
          15,
          {
            align: "center"
          }
        );

        pdf.setFontSize(12);

        pdf.text(
          "Biomedical Engineering Department",
          148,
          22,
          {
            align: "center"
          }
        );

        pdf.setFontSize(11);

        pdf.text(
          "Maintenance Report History",
          148,
          29,
          {
            align: "center"
          }
        );

        // --------------------------------------
        // TABLE HEADERS
        // --------------------------------------

        const headers = [
          "Date",
          "Job Order",
          "BME Number",
          "Equipment",
          "Department",
          "Engineer",
          "Maintenance Type",
          "Fault Reported",
          "Action Taken",
          "Status",
          "Remarks"
        ];

        // --------------------------------------
        // TABLE DATA
        // --------------------------------------

        const rows =
          data.map(
            report => [

              report.ReportDate
                ? new Date(
                    report.ReportDate
                  ).toLocaleDateString()
                : "",

              report.JobOrderNumber || "",

              report.BMENumber || "",

              report.EquipmentName || "",

              report.DepartmentName || "",

              report.EngineerName || "",

              report.MaintenanceType || "",

              report.FaultReported || "",

              report.ActionTaken || "",

              report.StatusName || "",

              report.Remarks || ""

            ]
          );

        // --------------------------------------
        // CREATE TABLE
        // --------------------------------------

        pdf.autoTable({

          head: [
            headers
          ],

          body: rows,

          startY: 35,

          theme: "grid",

          styles: {
            fontSize: 7,
            cellPadding: 2,
            overflow: "linebreak"
          },

          headStyles: {
            fontSize: 7
          },

          margin: {
            left: 8,
            right: 8
          }

        });

        // --------------------------------------
        // FOOTER
        // --------------------------------------

        pdf.setFontSize(8);

        pdf.text(
          "Generated by ATBUTH Biomedical CMMS",
          148,
          202,
          {
            align: "center"
          }
        );

        // --------------------------------------
        // SAVE
        // --------------------------------------

        pdf.save(
          "ATBUTH_Maintenance_History.pdf"
        );

      }

      catch (error) {

        console.error(
          "Maintenance PDF error:",
          error
        );

        alert(
          "Unable to generate Maintenance History PDF: " +
          error.message
        );

      }

    }
  );

}

// ==========================================
// DOWNLOAD SELECTED EQUIPMENT HISTORY PDF
// ==========================================

const downloadSelectedEquipmentHistoryPDFBtn =
  document.getElementById(
    "downloadSelectedEquipmentHistoryPDFBtn"
  );

if (downloadSelectedEquipmentHistoryPDFBtn) {

  downloadSelectedEquipmentHistoryPDFBtn.addEventListener(
    "click",
    function () {

      const selected =
        document.querySelectorAll(
          ".equipment-history-select-checkbox:checked"
        );

      if (selected.length === 0) {

        alert(
          "Please select at least one equipment history record first."
        );

        return;
      }

      if (
        typeof window.jspdf ===
        "undefined"
      ) {

        alert(
          "PDF library is not loaded. Please refresh the page."
        );

        return;
      }

      const {
        jsPDF
      } = window.jspdf;

      const pdf =
        new jsPDF(
          "l",
          "mm",
          "a4"
        );

      // --------------------------------------
      // HEADER
      // --------------------------------------

      pdf.setFontSize(16);

      pdf.text(
        "ATBUTH",
        148,
        15,
        {
          align: "center"
        }
      );

      pdf.setFontSize(12);

      pdf.text(
        "Biomedical Engineering Department",
        148,
        22,
        {
          align: "center"
        }
      );

      pdf.setFontSize(11);

      pdf.text(
        "Selected Equipment Maintenance History",
        148,
        29,
        {
          align: "center"
        }
      );

      // --------------------------------------
      // HEADERS
      // --------------------------------------

      const headers = [
        "Date",
        "Job Order",
        "Engineer",
        "Maintenance Type",
        "Fault Reported",
        "Diagnosis",
        "Action Taken",
        "Part Used",
        "Required Part",
        "Status",
        "Remarks"
      ];

      const rows = [];

      // --------------------------------------
      // GET SELECTED RECORDS
      // --------------------------------------

      selected.forEach(
        checkbox => {

          const row =
            checkbox.closest("tr");

          if (!row) {
            return;
          }

          const cells =
            row.querySelectorAll("td");

          const values = [];

          cells.forEach(
            (cell, index) => {

              // Skip checkbox column
              if (index === 0) {
                return;
              }

              values.push(
                cell.textContent.trim()
              );

            }
          );

          if (values.length) {

            rows.push(values);

          }

        }
      );

      if (!rows.length) {

        alert(
          "No equipment history records available to download."
        );

        return;
      }

      // --------------------------------------
      // CREATE TABLE
      // --------------------------------------

      pdf.autoTable({

        head: [
          headers
        ],

        body: rows,

        startY: 35,

        theme: "grid",

        styles: {
          fontSize: 7,
          cellPadding: 2,
          overflow: "linebreak"
        },

        headStyles: {
          fontSize: 7
        },

        margin: {
          left: 8,
          right: 8
        }

      });

      // --------------------------------------
      // FOOTER
      // --------------------------------------

      pdf.setFontSize(8);

      pdf.text(
        "Generated by ATBUTH Biomedical CMMS",
        148,
        202,
        {
          align: "center"
        }
      );

      // --------------------------------------
      // SAVE
      // --------------------------------------

      pdf.save(
        "ATBUTH_Selected_Equipment_History.pdf"
      );

    }
  );

}

}
