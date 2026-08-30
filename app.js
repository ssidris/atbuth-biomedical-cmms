
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
const storeInventoryForm =
  document.getElementById(
    "storeInventoryForm"
  );
const printStoreInventoryBtn =
  document.getElementById(
    "printStoreInventoryBtn"
  );

const downloadStoreInventoryPDFBtn =
  document.getElementById(
    "downloadStoreInventoryPDFBtn"
  );
const storeInventoryTableBody =
  document.getElementById(
    "storeInventoryTableBody"
  );
const storeMovementHistoryTableBody =
  document.getElementById(
    "storeMovementHistoryTableBody"
  );

const storeMovementHistoryMessage =
  document.getElementById(
    "storeMovementHistoryMessage"
  );
if (downloadStoreInventoryPDFBtn) {

  downloadStoreInventoryPDFBtn.addEventListener(
    "click",
    function() {

      const table =
        document.getElementById(
          "storeInventoryTable"
        );

      if (!table) {

        alert(
          "Store inventory table not found."
        );

        return;
      }
      // ====================================
      // CHECK jsPDF
      // ====================================

      if (
        !window.jspdf ||
        !window.jspdf.jsPDF
      ) {

        alert(
          "PDF library is not available. Please refresh the page and try again."
        );

        return;
      }

      const {
        jsPDF
      } = window.jspdf;

      const doc =
        new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4"
        });


      // ====================================
      // HOSPITAL HEADER
      // ====================================

      doc.setFontSize(14);

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.text(
        "ABUBAKAR TAFAWA BALEWA UNIVERSITY",
        148.5,
        12,
        {
          align: "center"
        }
      );

      doc.text(
        "TEACHING HOSPITAL",
        148.5,
        19,
        {
          align: "center"
        }
      );

      doc.setFontSize(11);

      doc.text(
        "Biomedical Engineering Department",
        148.5,
        26,
        {
          align: "center"
        }
      );


      // ====================================
      // REPORT TITLE
      // ====================================

      doc.setFontSize(13);

      doc.text(
        "Biomedical Equipment Store Inventory",
        148.5,
        36,
        {
          align: "center"
        }
      );


      // ====================================
      // PRINTED DATE
      // ====================================

      doc.setFontSize(9);

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.text(
        "ATBUTH Biomedical CMMS",
        14,
        43
      );

      doc.text(
        "Printed: " +
        new Date().toLocaleString(),
        283,
        43,
        {
          align: "right"
        }
      );


      // ====================================
      // GET TABLE DATA
      // ====================================

      const headers = [];

      const headerCells =
        table.querySelectorAll(
          "thead th"
        );

      headerCells.forEach(
        th => {

          headers.push(
            th.textContent.trim()
          );

        }
      );


      const rows = [];

      const bodyRows =
        table.querySelectorAll(
          "tbody tr"
        );

      bodyRows.forEach(
        tr => {

          const row = [];

          tr.querySelectorAll(
            "td"
          ).forEach(
            td => {

              row.push(
                td.textContent.trim()
              );

            }
          );

          if (row.length > 0) {
            rows.push(row);
          }

        }
      );


      if (
        !headers.length ||
        !rows.length
      ) {

        alert(
          "There are no records available to download."
        );

        return;
      }


      // ====================================
      // CREATE PDF TABLE
      // ====================================

      doc.autoTable({

        head: [headers],

        body: rows,

        startY: 48,

        theme: "grid",

        styles: {
          fontSize: 7,
          cellPadding: 2,
          valign: "top"
        },

        headStyles: {
          fontStyle: "bold"
        },

        margin: {
          left: 10,
          right: 10
        },

        didDrawPage:
          function() {

            const pageNumber =
              doc.internal.getNumberOfPages();

            doc.setFontSize(8);

            doc.text(
              "ATBUTH Biomedical CMMS - Biomedical Engineering Department",
              148.5,
              202,
              {
                align: "center"
              }
            );

            doc.text(
              "Page " +
              pageNumber,
              283,
              202,
              {
                align: "right"
              }
            );

          }

      });


      // ====================================
      // DOWNLOAD
      // ====================================

      doc.save(
        "Biomedical_Equipment_Store_Inventory_" +
        new Date()
          .toISOString()
          .slice(0, 10) +
        ".pdf"
      );

    }
  );

}
if (printStoreInventoryBtn) {

  printStoreInventoryBtn.addEventListener(
    "click",
    function() {

      const table =
        document.getElementById(
          "storeInventoryTable"
        );

      if (!table) {

        alert(
          "Store inventory table was not found."
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
          "Please allow pop-ups to print the store inventory."
        );

        return;
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>Store Inventory</title>

            <style>

              body {
                font-family: Arial, sans-serif;
                padding: 20px;
              }

              h1 {
                text-align: center;
              }

              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }

              th,
              td {
                border: 1px solid #000;
                padding: 8px;
                text-align: left;
              }

              th {
                font-weight: bold;
              }

              @media print {

                body {
                  padding: 0;
                }

              }

            </style>
          </head>

          <body>

            <h1>
              Biomedical Equipment Store Inventory
            </h1>

            ${table.outerHTML}

          </body>
        </html>
      `);

      printWindow.document.close();

      printWindow.focus();

      printWindow.print();

    }
  );

}
const storeDeploymentForm =
  document.getElementById(
    "storeDeploymentForm"
  );
const deploymentStoreId =
  document.getElementById(
    "deploymentStoreId"
  );

const deploymentQuantity =
  document.getElementById(
    "deploymentQuantity"
  );

const deploymentDepartmentId =
  document.getElementById(
    "deploymentDepartmentId"
  );

const deploymentMovementDate =
  document.getElementById(
    "deploymentMovementDate"
  );
if (deploymentMovementDate) {

  deploymentMovementDate.value =
    new Date()
      .toISOString()
      .split("T")[0];

}

const deploymentMovedBy =
  document.getElementById(
    "deploymentMovedBy"
  );

const deploymentRemarks =
  document.getElementById(
    "deploymentRemarks"
  );

const storeDeploymentMessage =
  document.getElementById(
    "storeDeploymentMessage"
  );
const storeEquipmentName =
  document.getElementById(
    "storeEquipmentName"
  );

const storeQuantity =
  document.getElementById(
    "storeQuantity"
  );
const storeManufacturer =
  document.getElementById(
    "storeManufacturer"
  );

const storeModel =
  document.getElementById(
    "storeModel"
  );

const storeDateReceived =
  document.getElementById(
    "storeDateReceived"
  );

const storeSource =
  document.getElementById(
    "storeSource"
  );

const storeLocation =
  document.getElementById(
    "storeLocation"
  );

const storeRemarks =
  document.getElementById(
    "storeRemarks"
  );

const storeInventoryMessage =
  document.getElementById(
    "storeInventoryMessage"
  );
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
  formatter,
  sortField = labelField
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
        sortField,
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

},
"BMENumber"
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

    },
    "BMENumber"
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
  await loadStoreDeploymentDropdown();
  await loadStoreInventoryTable();
  await loadStoreMovementHistory();
  await loadStoreDeploymentDepartments();

}


async function loadStoreDeploymentDropdown() {

  if (!deploymentStoreId) {
    return;
  }

  deploymentStoreId.innerHTML = `
    <option value="">
      Loading store inventory...
    </option>
  `;

  try {

    const {
      data: inventory,
      error: inventoryError
    } = await client
      .from("tblEquipmentStore")
      .select(
        "StoreID, EquipmentName, Quantity, Manufacturer, Model"
      )
      .gt(
        "Quantity",
        0
      )
      .order(
        "EquipmentName",
        {
          ascending: true
        }
      );

    if (inventoryError) {
      throw inventoryError;
    }

    deploymentStoreId.innerHTML = `
      <option value="">
        Select equipment
      </option>
    `;

    if (
      !inventory ||
      inventory.length === 0
    ) {

      deploymentStoreId.innerHTML = `
        <option value="">
          No equipment available in store
        </option>
      `;

      return;
    }

    inventory.forEach(
      item => {

        const option =
          document.createElement(
            "option"
          );

        option.value =
          item.StoreID;

        let label =
          `${item.EquipmentName} — ${item.Quantity} available`;

        if (item.Manufacturer) {

          label +=
            ` — ${item.Manufacturer}`;

        }

        if (item.Model) {

          label +=
            ` ${item.Model}`;

        }

        option.textContent =
          label;

        deploymentStoreId.appendChild(
          option
        );

      }
    );

  }

  catch (error) {

    console.error(
      "Store deployment dropdown error:",
      error
    );

    deploymentStoreId.innerHTML = `
      <option value="">
        Unable to load store inventory
      </option>
    `;

  }

}
// ==========================================
// LOAD STORE INVENTORY TABLE
// ==========================================

async function loadStoreInventoryTable() {
  if (!storeInventoryTableBody) {
    return;
  }

  storeInventoryTableBody.innerHTML = `
    <tr>
      <td colspan="8">
        Loading store inventory...
      </td>
    </tr>
  `;
  try {

    const {
      data: inventory,
      error: inventoryError
    } = await client
      .from("tblEquipmentStore")
      .select(
        "StoreID, EquipmentName, Quantity, Manufacturer, Model, DateReceived, Source, StoreLocation, Remarks"
      )
      .order(
        "EquipmentName",
        {
          ascending: true
        }
      );

    if (inventoryError) {
      throw inventoryError;
    }
    if (
      !inventory ||
      inventory.length === 0
    ) {

      storeInventoryTableBody.innerHTML = `
        <tr>
          <td colspan="8">
            No equipment is currently available in the store.
          </td>
        </tr>
      `;

      return;
    }
    storeInventoryTableBody.innerHTML = "";

    inventory.forEach(
      item => {

        const row =
          document.createElement(
            "tr"
          );
        row.innerHTML = `
          <td>
            ${item.EquipmentName || ""}
          </td>

          <td>
            ${item.Quantity ?? 0}
          </td>

          <td>
            ${item.Manufacturer || ""}
          </td>

          <td>
            ${item.Model || ""}
          </td>

          <td>
            ${item.DateReceived || ""}
          </td>

          <td>
            ${item.Source || ""}
          </td>

          <td>
            ${item.StoreLocation || ""}
          </td>

          <td>
            ${item.Remarks || ""}
          </td>
        `;

        storeInventoryTableBody.appendChild(
          row
        );

      }
    );

  }

  catch (error) {

    console.error(
      "Store inventory table error:",
      error
    );

    storeInventoryTableBody.innerHTML = `
      <tr>
        <td colspan="8">
          Unable to load store inventory.
        </td>
      </tr>
    `;

  }

}
// ==========================================
// LOAD STORE MOVEMENT HISTORY
// ==========================================

async function loadStoreMovementHistory() {
  if (!storeMovementHistoryTableBody) {
    return;
  }

  if (storeMovementHistoryMessage) {
    storeMovementHistoryMessage.textContent =
      "Loading movement history...";
  }

  storeMovementHistoryTableBody.innerHTML = `
    <tr>
      <td colspan="7">
        Loading movement history...
      </td>
    </tr>
  `;

  try {

    const {
      data: movements,
      error: movementError
    } = await client
      .from("tblEquipmentStoreMovement")
      .select(`
        MovementID,
        StoreID,
        MovementType,
        Quantity,
        DepartmentID,
        MovementDate,
        MovedBy,
        Remarks,
        CreatedAt
      `)
      .order(
        "MovementDate",
        {
          ascending: false
        }
      )
      .order(
        "CreatedAt",
        {
          ascending: false
        }
      );

    if (movementError) {
      throw movementError;
    }

    if (
      !movements ||
      movements.length === 0
    ) {

      storeMovementHistoryTableBody.innerHTML = `
        <tr>
          <td colspan="7">
            No store movement records available.
          </td>
        </tr>
      `;

      if (storeMovementHistoryMessage) {
        storeMovementHistoryMessage.textContent = "";
      }

      return;
    }


    // ====================================
    // GET STORE EQUIPMENT NAMES
    // ====================================

    const storeIds = [
      ...new Set(
        movements
          .map(
            movement =>
              movement.StoreID
          )
          .filter(
            id =>
              id !== null &&
              id !== undefined
          )
      )
    ];

    let storeMap = {};

    if (storeIds.length > 0) {

      const {
        data: stores,
        error: storeError
      } = await client
        .from("tblEquipmentStore")
        .select(
          "StoreID, EquipmentName"
        )
        .in(
          "StoreID",
          storeIds
        );

      if (storeError) {
        throw storeError;
      }

      (stores || []).forEach(
        store => {

          storeMap[
            store.StoreID
          ] =
            store.EquipmentName ||
            "Unknown equipment";

        }
      );

    }


    // ====================================
    // GET DEPARTMENT NAMES
    // ====================================

    const departmentIds = [
      ...new Set(
        movements
          .map(
            movement =>
              movement.DepartmentID
          )
          .filter(
            id =>
              id !== null &&
              id !== undefined
          )
      )
    ];

    let departmentMap = {};

    if (departmentIds.length > 0) {

      const {
        data: departments,
        error: departmentError
      } = await client
        .from("tblDepartment")
        .select(
          "DepartmentID, DepartmentName"
        )
        .in(
          "DepartmentID",
          departmentIds
        );

      if (departmentError) {
        throw departmentError;
      }

      (departments || []).forEach(
        department => {

          departmentMap[
            department.DepartmentID
          ] =
            department.DepartmentName ||
            "Unknown department";

        }
      );

    }


    // ====================================
    // DISPLAY MOVEMENT HISTORY
    // ====================================

    storeMovementHistoryTableBody.innerHTML = "";

    movements.forEach(
      movement => {

        const row =
          document.createElement(
            "tr"
          );

        const movementDate =
          movement.MovementDate
            ? new Date(
                movement.MovementDate
              ).toLocaleDateString()
            : "";

        row.innerHTML = `
          <td>
            ${
              storeMap[
                movement.StoreID
              ] ||
              "Unknown equipment"
            }
          </td>

          <td>
            ${
              movement.MovementType ||
              ""
            }
          </td>

          <td>
            ${
              movement.Quantity ??
              0
            }
          </td>

          <td>
            ${
              departmentMap[
                movement.DepartmentID
              ] ||
              ""
            }
          </td>

          <td>
            ${movementDate}
          </td>

          <td>
            ${
              movement.MovedBy ||
              ""
            }
          </td>

          <td>
            ${
              movement.Remarks ||
              ""
            }
          </td>
        `;

        storeMovementHistoryTableBody.appendChild(
          row
        );

      }
    );

    if (storeMovementHistoryMessage) {
      storeMovementHistoryMessage.textContent =
        `${movements.length} movement record(s) found.`;
    }

  }

  catch (error) {

    console.error(
      "Store movement history error:",
      error
    );

    storeMovementHistoryTableBody.innerHTML = `
      <tr>
        <td colspan="7">
          Unable to load store movement history.
        </td>
      </tr>
    `;

    if (storeMovementHistoryMessage) {
      storeMovementHistoryMessage.textContent =
        "Error loading movement history: " +
        error.message;
    }

  }

}
// ==========================================
// LOAD DEPARTMENTS FOR STORE DEPLOYMENT
// ==========================================

async function loadStoreDeploymentDepartments() {

  if (!deploymentDepartmentId) {
    return;
  }

  deploymentDepartmentId.innerHTML = `
    <option value="">
      Loading departments...
    </option>
  `;

  try {

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

    deploymentDepartmentId.innerHTML = `
      <option value="">
        Select department
      </option>
    `;

    if (
      !departments ||
      departments.length === 0
    ) {

      deploymentDepartmentId.innerHTML = `
        <option value="">
          No departments available
        </option>
      `;

      return;
    }

    departments.forEach(
      department => {

        const option =
          document.createElement(
            "option"
          );

        option.value =
          department.DepartmentID;

        option.textContent =
          department.DepartmentName;

        deploymentDepartmentId.appendChild(
          option
        );

      }
    );

  }

  catch (error) {

    console.error(
      "Store deployment department error:",
      error
    );

    deploymentDepartmentId.innerHTML = `
      <option value="">
        Unable to load departments
      </option>
    `;

  }

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
  "BMENumber",
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
// REFRESH EQUIPMENT HISTORY
// ==========================================

const refreshEquipmentHistoryBtn =
  document.getElementById(
    "refreshEquipmentHistoryBtn"
  );

if (refreshEquipmentHistoryBtn) {

  refreshEquipmentHistoryBtn.addEventListener(
    "click",
    async function() {

      refreshEquipmentHistoryBtn.disabled =
        true;

      refreshEquipmentHistoryBtn.textContent =
        "🔄 Refreshing...";

      try {

        // ====================================
        // CLEAR SEARCH
        // ====================================

        const equipmentSearch =
          document.getElementById(
            "equipmentSearch"
          );

        const equipmentDepartmentFilter =
          document.getElementById(
            "equipmentDepartmentFilter"
          );

        const equipmentSourceFilter =
          document.getElementById(
            "equipmentSourceFilter"
          );

        const equipmentNGOSearch =
          document.getElementById(
            "equipmentNGOSearch"
          );

        if (equipmentSearch) {
          equipmentSearch.value = "";
        }

        if (equipmentDepartmentFilter) {
          equipmentDepartmentFilter.value = "";
        }

        if (equipmentSourceFilter) {
          equipmentSourceFilter.value = "";
        }

        if (equipmentNGOSearch) {
          equipmentNGOSearch.value = "";
        }


        // ====================================
        // RELOAD EQUIPMENT SEARCH DATA
        // ====================================

        await loadEquipmentSearchData();


        // ====================================
        // CLEAR SEARCH RESULTS
        // ====================================

        const equipmentSearchResults =
          document.getElementById(
            "equipmentSearchResults"
          );

        if (equipmentSearchResults) {
          equipmentSearchResults.innerHTML = "";
        }


        // ====================================
        // RESET SEARCH MESSAGE
        // ====================================

        const equipmentSearchCount =
          document.getElementById(
            "equipmentSearchCount"
          );

        if (equipmentSearchCount) {

          equipmentSearchCount.textContent =
            "Equipment list refreshed.";

        }


        // ====================================
        // RESET SELECTED EQUIPMENT
        // ====================================

        const historyEquipmentId =
          document.getElementById(
            "historyEquipmentId"
          );

        if (historyEquipmentId) {

          historyEquipmentId.value = "";

        }


        // ====================================
        // CLEAR EQUIPMENT DETAILS
        // ====================================

        const equipmentHistoryDetails =
          document.getElementById(
            "equipmentHistoryDetails"
          );

        if (equipmentHistoryDetails) {

          equipmentHistoryDetails.innerHTML = `
            <p>
              Select an equipment to view its details.
            </p>
          `;

        }


        // ====================================
        // CLEAR MAINTENANCE HISTORY TABLE
        // ====================================

        const equipmentHistoryTableBody =
          document.getElementById(
            "equipmentHistoryTableBody"
          );

        if (equipmentHistoryTableBody) {

          equipmentHistoryTableBody.innerHTML = `
            <tr>
              <td colspan="12">
                Select an equipment to view history.
              </td>
            </tr>
          `;

        }

      }

      catch (error) {

        console.error(
          "Equipment History refresh error:",
          error
        );

        alert(
          "Unable to refresh Equipment History: " +
          error.message
        );

      }

      finally {

        refreshEquipmentHistoryBtn.disabled =
          false;

        refreshEquipmentHistoryBtn.textContent =
          "🔄 Refresh Equipment History";

      }

    }
  );

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
        const continueTreatmentMessage =
  document.getElementById(
    "continueTreatmentMessage"
  );

if (continueTreatmentMessage) {
  continueTreatmentMessage.style.display =
    "none";
}

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
if (storeInventoryForm) {

  storeInventoryForm.addEventListener(
    "submit",
    async function(event) {

      event.preventDefault();

      if (storeInventoryMessage) {

        storeInventoryMessage.textContent =
          "Saving equipment to store...";

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

        const equipmentName =
          storeEquipmentName.value.trim();

        const quantity =
          Number(
            storeQuantity.value
          );

        const manufacturer =
          storeManufacturer.value.trim();

        const model =
          storeModel.value.trim();

        const dateReceived =
          storeDateReceived.value || null;

        const source =
          storeSource.value.trim();

        const storeLocationValue =
          storeLocation.value.trim();

        const remarks =
          storeRemarks.value.trim();


        // ----------------------------------
        // VALIDATE
        // ----------------------------------

        if (!equipmentName) {

          throw new Error(
            "Equipment Name is required."
          );

        }

        if (
          !quantity ||
          quantity < 1
        ) {

          throw new Error(
            "Quantity must be at least 1."
          );

        }


        // ----------------------------------
        // INSERT INTO STORE
        // ----------------------------------

        const {
          data: newInventory,
          error: insertError
        } = await client
          .from("tblEquipmentStore")
          .insert([
            {
              EquipmentName:
                equipmentName,

              Quantity:
                quantity,

              Manufacturer:
                manufacturer || null,

              Model:
                model || null,

              DateReceived:
                dateReceived,

              Source:
                source || null,

              StoreLocation:
                storeLocationValue ||
                null,

              Remarks:
                remarks || null
            }
          ])
          .select();


        if (insertError) {

          throw insertError;

        }


        // ----------------------------------
        // SUCCESS
        // ----------------------------------

        if (storeInventoryMessage) {

          storeInventoryMessage.textContent =
            "Equipment successfully added to store.";

        }

        storeInventoryForm.reset();


        // Refresh dashboard counters
        if (
          typeof loadDashboard ===
          "function"
        ) {

          await loadDashboard();

        }

      }

      catch (error) {

        console.error(
          "Store inventory error:",
          error
        );

        if (storeInventoryMessage) {

          storeInventoryMessage.textContent =
            "Error saving store inventory: " +
            error.message;

        }

      }

    }
  );

}

if (storeDeploymentForm) {

  storeDeploymentForm.addEventListener(
    "submit",
    async function(event) {

      event.preventDefault();

      if (storeDeploymentMessage) {

        storeDeploymentMessage.textContent =
          "Processing deployment...";

      }

      try {

        // Check login

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
        // GET DEPLOYMENT VALUES
        // ----------------------------------

        const storeId =
  Number(
    deploymentStoreId.value
  );

        const quantity =
          Number(
            deploymentQuantity.value
          );

        const departmentId =
  Number(
    deploymentDepartmentId.value
  );

        const movementDate =
          deploymentMovementDate.value;

        const movedBy =
          deploymentMovedBy.value.trim();

        const remarks =
          deploymentRemarks.value.trim();
        // ----------------------------------
        // VALIDATE DEPLOYMENT
        // ----------------------------------

        if (
          !storeId ||
          !quantity ||
          quantity < 1 ||
          !departmentId ||
          !movementDate ||
          !movedBy
        ) {

          throw new Error(
            "Please complete all required deployment fields."
          );

        }
        // ----------------------------------
// GET STORE ITEM
// ----------------------------------

const {
  data: storeItem,
  error: storeItemError
} = await client
  .from("tblEquipmentStore")
  .select(
    "StoreID, EquipmentName, Quantity"
  )
  .eq(
    "StoreID",
    storeId
  )
  .limit(1)
  .single();

if (storeItemError) {

  console.error(
    "Store item retrieval error:",
    storeItemError
  );

  throw storeItemError;

}

if (!storeItem) {

  throw new Error(
    "The selected equipment could not be retrieved from the store."
  );

}
        
        // ----------------------------------
        // CHECK AVAILABLE QUANTITY
        // ----------------------------------

        if (
          quantity >
          Number(storeItem.Quantity)
        ) {

          throw new Error(
            `Only ${storeItem.Quantity} unit(s) of ${storeItem.EquipmentName} are available in the store.`
          );

        }
        // ----------------------------------
        // DEPLOY EQUIPMENT SAFELY
        // ----------------------------------

        const {
          error: deploymentError
        } = await client.rpc(
          "deploy_store_equipment",
          {
            p_store_id:
              Number(storeId),

            p_quantity:
              quantity,

            p_department_id:
              Number(departmentId),

            p_movement_date:
              movementDate,

            p_moved_by:
              movedBy,

            p_remarks:
              remarks || null
          }
        );

        if (deploymentError) {

  console.error(
    "RPC deployment error:",
    deploymentError
  );

  alert(
    "RPC ERROR:\n" +
    deploymentError.message
  );

  throw deploymentError;

}
        // ----------------------------------
        // DEPLOYMENT SUCCESS
        // ----------------------------------

        if (storeDeploymentMessage) {

          storeDeploymentMessage.textContent =
            "Equipment successfully deployed.";

        }

    
        storeDeploymentForm.reset();
        await loadStoreDeploymentDropdown();

if (
  typeof loadDashboard ===
  "function"
) {

  await loadDashboard();

}

}

catch (error) {

  console.error(
    "Store deployment error:",
    error
  );

  if (storeDeploymentMessage) {

    storeDeploymentMessage.textContent =
      "Error deploying equipment: " +
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
  const outOfService =
  document.getElementById(
    "dashboardOutOfService"
  );

  const pmDueToday =
    document.getElementById(
      "dashboardPMDueToday"
    );

  const pmOverdue =
    document.getElementById(
      "dashboardPMOverdue"
    );
  const dashboardStoreUnits =
    document.getElementById(
      "dashboardStoreUnits"
    );
  const dashboardStoreTypes =
  document.getElementById(
    "dashboardStoreTypes"
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
    // Equipment Units in Store

    const {
      data: storeInventory,
      error: storeInventoryError
    } = await client
      .from("tblEquipmentStore")
      .select("Quantity");

    if (storeInventoryError) {
      throw storeInventoryError;
    }

    const storeUnits =
      (storeInventory || []).reduce(
        (total, item) =>
          total + (Number(item.Quantity) || 0),
        0
      );

    if (dashboardStoreUnits) {
      dashboardStoreUnits.textContent =
        storeUnits;
    }
    // Equipment Types in Store

const {
  count: storeTypesCount
} = await client
  .from("tblEquipmentStore")
  .select("*", {
    count: "exact",
    head: true
  });

if (dashboardStoreTypes) {
  dashboardStoreTypes.textContent =
    storeTypesCount || 0;
}
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
/* PRINT COLUMN WIDTHS */

th:nth-child(1),
td:nth-child(1) {
  width: 3%;
}

th:nth-child(2),
td:nth-child(2) {
  width: 7%;
}

th:nth-child(3),
td:nth-child(3) {
  width: 7%;
}

th:nth-child(4),
td:nth-child(4) {
  width: 7%;
}

th:nth-child(5),
td:nth-child(5) {
  width: 9%;
}

th:nth-child(6),
td:nth-child(6) {
  width: 8%;
}

th:nth-child(7),
td:nth-child(7) {
  width: 8%;
}

th:nth-child(8),
td:nth-child(8) {
  width: 8%;
}

th:nth-child(9),
td:nth-child(9) {
  width: 13%;
}

th:nth-child(10),
td:nth-child(10) {
  width: 13%;
}

th:nth-child(11),
td:nth-child(11) {
  width: 7%;
}

th:nth-child(12),
td:nth-child(12) {
  width: 10%;
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
// ==========================================
// DOWNLOAD FULL EQUIPMENT HISTORY PDF
// ==========================================

const downloadEquipmentHistoryPDFBtn =
  document.getElementById(
    "downloadEquipmentHistoryPDFBtn"
  );

if (downloadEquipmentHistoryPDFBtn) {

  downloadEquipmentHistoryPDFBtn.addEventListener(
    "click",
    async function () {

      // Check that an equipment is currently selected
      const equipmentSelect =
  document.getElementById(
    "historyEquipmentId"
  );

      if (
        !equipmentSelect ||
        !equipmentSelect.value
      ) {

        alert(
          "Please select an equipment first."
        );

        return;
      }

      // Check PDF library
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

        const equipmentId =
          equipmentSelect.value;

        // --------------------------------------
        // GET EQUIPMENT DETAILS
        // --------------------------------------

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

          alert(
            "Equipment details could not be found."
          );

          return;
        }

        // --------------------------------------
        // GET EQUIPMENT HISTORY
        // --------------------------------------

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

          alert(
            "No maintenance history found for this equipment."
          );

          return;
        }

        // --------------------------------------
        // GET DEPARTMENT NAME
        // --------------------------------------

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
            .select("DepartmentName")
            .eq(
              "DepartmentID",
              equipment.DepartmentID
            )
            .maybeSingle();

          if (departmentError) {
            throw departmentError;
          }

          if (department) {

            departmentName =
              department.DepartmentName ||
              "Not assigned";

          }

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
          "Equipment Maintenance History",
          148,
          29,
          {
            align: "center"
          }
        );

        // --------------------------------------
        // EQUIPMENT INFORMATION
        // --------------------------------------

        pdf.setFontSize(9);

        pdf.text(
          `BME Number: ${equipment.BMENumber || ""}`,
          10,
          36
        );

        pdf.text(
          `Equipment: ${equipment.EquipmentName || ""}`,
          10,
          42
        );

        pdf.text(
          `Department: ${departmentName}`,
          10,
          48
        );

        pdf.text(
          `Manufacturer: ${equipment.Manufacturer || ""}`,
          10,
          54
        );

        pdf.text(
          `Model: ${equipment.Model || ""}`,
          100,
          36
        );

        pdf.text(
          `Serial Number: ${equipment.SerialNumber || ""}`,
          100,
          42
        );

        pdf.text(
          `Location: ${equipment.Location || ""}`,
          100,
          48
        );

        // --------------------------------------
        // TABLE HEADERS
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

        // --------------------------------------
        // TABLE DATA
        // --------------------------------------

        const rows =
          history.map(
            report => [

              report.ReportDate
                ? new Date(
                    report.ReportDate
                  ).toLocaleDateString()
                : "",

              report.JobOrderNumber || "",

              report.EngineerName || "",

              report.MaintenanceType || "",

              report.FaultReported || "",

              report.Diagnosis || "",

              report.ActionTaken || "",

              report.PartUsed || "",

              report.RequiredPart || "",

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

          startY: 60,

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
          `ATBUTH_${equipment.BMENumber || "Equipment"}_Maintenance_History.pdf`
        );

      }

      catch (error) {

        console.error(
          "Equipment History PDF error:",
          error
        );

        alert(
          "Unable to generate Equipment History PDF: " +
          error.message
        );

      }

    }
  );

}

// ==========================================
// DASHBOARD CLICKABLE COUNTERS
// ==========================================

const totalEquipmentCard =
  document.getElementById("totalEquipmentCard");

const workingEquipmentCard =
  document.getElementById("workingEquipmentCard");

const maintenanceReportsCard =
  document.getElementById("maintenanceReportsCard");

const underRepairCard =
  document.getElementById("underRepairCard");

const awaitingPartsCard =
  document.getElementById("awaitingPartsCard");
const storeEquipmentCard =
  document.getElementById(
    "storeEquipmentCard"
  );

const storeEquipmentTypesCard =
  document.getElementById(
    "storeEquipmentTypesCard"
  );
const openStoreInventoryBtn =
  document.getElementById(
    "openStoreInventoryBtn"
  );
const openStoreDeploymentBtn =
  document.getElementById(
    "openStoreDeploymentBtn"
  );
const openStoreMovementHistoryBtn =
  document.getElementById(
    "openStoreMovementHistoryBtn"
  );

const dashboardDetailsSection =
  document.getElementById(
    "dashboardDetailsSection"
  );

const dashboardSection =
  document.getElementById(
    "dashboardSection"
  );

const backToDashboardBtn =
  document.getElementById(
    "backToDashboardBtn"
  );


// ==========================================
// OPEN DASHBOARD DETAILS
// ==========================================

function openDashboardDetails() {

  if (dashboardSection) {
    dashboardSection.classList.add("hidden");
  }

  if (dashboardDetailsSection) {
    dashboardDetailsSection.classList.remove(
      "hidden"
    );
  }

}


// ==========================================
// BACK TO DASHBOARD
// ==========================================

if (backToDashboardBtn) {

  backToDashboardBtn.addEventListener(
    "click",
    function() {

      if (dashboardDetailsSection) {
        dashboardDetailsSection.classList.add(
          "hidden"
        );
      }

      if (dashboardSection) {
        dashboardSection.classList.remove(
          "hidden"
        );
      }

    }
  );

}

// ==========================================
// TOTAL EQUIPMENT CARD
// ==========================================

if (totalEquipmentCard) {

  totalEquipmentCard.addEventListener(
    "click",
    async function() {

      openDashboardDetails();

      const title =
        document.getElementById(
          "dashboardDetailsTitle"
        );

      const loading =
        document.getElementById(
          "dashboardDetailsLoading"
        );

      const tableHead =
        document.getElementById(
          "dashboardDetailsTableHead"
        );

      const tableBody =
        document.getElementById(
          "dashboardDetailsTableBody"
        );

      if (title) {
        title.textContent =
          "Total Equipment";
      }

      if (loading) {
        loading.textContent =
          "Loading equipment...";
      }

      if (tableHead) {
        tableHead.innerHTML = `
          <tr>
            <th>BME Number</th>
            <th>Equipment</th>
            <th>Department</th>
            <th>Manufacturer</th>
            <th>Model</th>
            <th>Serial Number</th>
            <th>Status</th>
          </tr>
        `;
      }

      if (tableBody) {
        tableBody.innerHTML = "";
      }

      try {

        // Get all equipment
        const {
          data: equipment,
          error: equipmentError
        } = await client
          .from("tblEquipment")
          .select(
            "EquipmentID, BMENumber, EquipmentName, Manufacturer, Model, SerialNumber, DepartmentID, StatusID"
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
        // Display total number in the report heading

if (title) {

  title.textContent =
    `Total Equipment — ${
      (equipment || []).length
    } Records`;

}

        // Get departments
        const {
          data: departments,
          error: departmentError
        } = await client
          .from("tblDepartment")
          .select(
            "DepartmentID, DepartmentName"
          );

        if (departmentError) {
          throw departmentError;
        }

        // Get equipment statuses
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

        // Create lookup maps
        const departmentMap =
          {};

        (departments || []).forEach(
          department => {

            departmentMap[
              department.DepartmentID
            ] =
              department.DepartmentName;

          }
        );

        const statusMap =
          {};

        (statuses || []).forEach(
          status => {

            statusMap[
              status.StatusID
            ] =
              status.StatusName;

          }
        );

        if (
          !equipment ||
          equipment.length === 0
        ) {

          tableBody.innerHTML = `
            <tr>
              <td colspan="7">
                No equipment found.
              </td>
            </tr>
          `;

          loading.textContent =
            "No equipment found.";

          return;
        }

        // Display equipment
        equipment.forEach(
          item => {

            const row =
              document.createElement(
                "tr"
              );

            row.innerHTML = `
              <td>
                ${item.BMENumber || ""}
              </td>

              <td>
                ${item.EquipmentName || ""}
              </td>

              <td>
                ${
                  departmentMap[
                    item.DepartmentID
                  ] || ""
                }
              </td>

              <td>
                ${item.Manufacturer || ""}
              </td>

              <td>
                ${item.Model || ""}
              </td>

              <td>
                ${item.SerialNumber || ""}
              </td>

              <td>
                ${
                  statusMap[
                    item.StatusID
                  ] || ""
                }
              </td>
            `;

            tableBody.appendChild(
              row
            );

          }
        );

        loading.textContent =
          `${equipment.length} equipment record(s) found.`;

      }

      catch (error) {

        console.error(
          "Total equipment error:",
          error
        );

        tableBody.innerHTML = `
          <tr>
            <td colspan="7">
              Unable to load equipment.
            </td>
          </tr>
        `;

        loading.textContent =
          "Unable to load equipment.";

      }

    }
  );

}

// ==========================================
// PRINT DASHBOARD DETAILS
// ==========================================

const printDashboardDetailsBtn =
  document.getElementById(
    "printDashboardDetailsBtn"
  );

if (printDashboardDetailsBtn) {

  printDashboardDetailsBtn.addEventListener(
    "click",
    function() {

      const table =
        document.getElementById(
          "dashboardDetailsTable"
        );

      const title =
        document.getElementById(
          "dashboardDetailsTitle"
        );
      const countText =
  document.getElementById(
    "dashboardDetailsCount"
  );

      if (!table) {
        return;
      }

      const reportTitle =
        title
          ? title.textContent
          : "CMMS Report";
      const reportCount =
  countText
    ? countText.textContent
    : "";

      const printWindow =
        window.open(
          "",
          "_blank"
        );

      if (!printWindow) {

        alert(
          "Please allow pop-ups in your browser to print the report."
        );

        return;
      }

      const printedDate =
        new Date().toLocaleString();

      printWindow.document.write(`
        <!DOCTYPE html>

        <html>

        <head>

          <meta
            charset="UTF-8"
          >

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          >

          <title>
            ${reportTitle}
          </title>

          <style>

            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #000;
            }

            .hospital-header {
              text-align: center;
              margin-bottom: 15px;
            }

            .hospital-header h1 {
              margin: 0;
              font-size: 22px;
            }

            .hospital-header h2 {
              margin: 5px 0;
              font-size: 18px;
            }

            .report-title {
              text-align: center;
              margin: 15px 0;
              font-size: 18px;
              font-weight: bold;
            }
            .report-count {
  text-align: center;
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: bold;
}

            .report-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              font-size: 12px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }

            th,
            td {
              border: 1px solid #000;
              padding: 6px;
              font-size: 10px;
              text-align: left;
              vertical-align: top;
            }

            th {
              font-weight: bold;
            }

            .footer {
              margin-top: 20px;
              text-align: center;
              font-size: 10px;
            }

            @media print {

              body {
                margin: 10mm;
              }

              table {
                page-break-inside: auto;
              }

              tr {
                page-break-inside: avoid;
                page-break-after: auto;
              }

              thead {
                display: table-header-group;
              }

            }

          </style>

        </head>

        <body>

          <div class="hospital-header">

            <h1>
              ABUBAKAR TAFAWA BALEWA UNIVERSITY
              TEACHING HOSPITAL
            </h1>

            <h2>
              Biomedical Engineering Department
            </h2>

          </div>

          <div class="report-title">
            ${reportTitle}
          </div>
          <div
  class="report-count"
>
  ${reportCount}
</div>

          <div class="report-info">

            <span>
              ATBUTH Biomedical CMMS
            </span>

            <span>
              Printed:
              ${printedDate}
            </span>

          </div>

          ${table.outerHTML}

          <div class="footer">

            ATBUTH Biomedical CMMS
            -
            Biomedical Engineering Department

          </div>

        </body>

        </html>
      `);

      printWindow.document.close();

      printWindow.focus();

      setTimeout(
        function() {

          printWindow.print();

        },
        500
      );

    }
  );

}
// ==========================================
// DOWNLOAD DASHBOARD DETAILS PDF
// ==========================================

const downloadDashboardDetailsPDFBtn =
  document.getElementById(
    "downloadDashboardDetailsPDFBtn"
  );

if (downloadDashboardDetailsPDFBtn) {

  downloadDashboardDetailsPDFBtn.addEventListener(
    "click",
    function() {

      const table =
        document.getElementById(
          "dashboardDetailsTable"
        );

      const titleElement =
        document.getElementById(
          "dashboardDetailsTitle"
        );

      if (!table) {

        alert(
          "Dashboard details table not found."
        );

        return;
      }

      const reportTitle =
        titleElement
          ? titleElement.textContent.trim()
          : "CMMS Report";

      // ====================================
      // CHECK jsPDF
      // ====================================

      if (
        !window.jspdf ||
        !window.jspdf.jsPDF
      ) {

        alert(
          "PDF library is not available. Please refresh the page and try again."
        );

        return;
      }

      const {
        jsPDF
      } = window.jspdf;

      const doc =
        new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4"
        });


      // ====================================
      // HOSPITAL HEADER
      // ====================================

      doc.setFontSize(14);

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.text(
        "ABUBAKAR TAFAWA BALEWA UNIVERSITY",
        148.5,
        12,
        {
          align: "center"
        }
      );

      doc.text(
        "TEACHING HOSPITAL",
        148.5,
        19,
        {
          align: "center"
        }
      );

      doc.setFontSize(11);

      doc.text(
        "Biomedical Engineering Department",
        148.5,
        26,
        {
          align: "center"
        }
      );


      // ====================================
      // REPORT TITLE
      // ====================================

      doc.setFontSize(13);

      doc.text(
        reportTitle,
        148.5,
        36,
        {
          align: "center"
        }
      );


      // ====================================
      // PRINTED DATE
      // ====================================

      doc.setFontSize(9);

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.text(
        "ATBUTH Biomedical CMMS",
        14,
        43
      );

      doc.text(
        "Printed: " +
        new Date().toLocaleString(),
        283,
        43,
        {
          align: "right"
        }
      );


      // ====================================
      // GET TABLE DATA
      // ====================================

      const headers = [];

      const headerCells =
        table.querySelectorAll(
          "thead th"
        );

      headerCells.forEach(
        th => {

          headers.push(
            th.textContent.trim()
          );

        }
      );


      const rows = [];

      const bodyRows =
        table.querySelectorAll(
          "tbody tr"
        );

      bodyRows.forEach(
        tr => {

          const row = [];

          tr.querySelectorAll(
            "td"
          ).forEach(
            td => {

              row.push(
                td.textContent
                  .trim()
              );

            }
          );

          if (row.length > 0) {
            rows.push(row);
          }

        }
      );


      if (
        !headers.length ||
        !rows.length
      ) {

        alert(
          "There are no records available to download."
        );

        return;
      }


      // ====================================
      // CREATE PDF TABLE
      // ====================================

      doc.autoTable({

        head: [headers],

        body: rows,

        startY: 48,

        theme: "grid",

        styles: {
          fontSize: 7,
          cellPadding: 2,
          valign: "top"
        },

        headStyles: {
          fontStyle: "bold"
        },

        margin: {
          left: 10,
          right: 10
        },

        didDrawPage:
          function() {

            const pageNumber =
              doc.internal.getNumberOfPages();

            doc.setFontSize(8);

            doc.text(
              "ATBUTH Biomedical CMMS - Biomedical Engineering Department",
              148.5,
              202,
              {
                align: "center"
              }
            );

            doc.text(
              "Page " +
              pageNumber,
              283,
              202,
              {
                align: "right"
              }
            );

          }

      });


      // ====================================
      // DOWNLOAD
      // ====================================

      const safeTitle =
        reportTitle
          .replace(
            /[^a-z0-9]/gi,
            "_"
          )
          .replace(
            /_+/g,
            "_"
          );

      doc.save(
        safeTitle +
        "_" +
        new Date()
          .toISOString()
          .slice(0, 10) +
        ".pdf"
      );

    }
  );

}
// ==========================================
// WORKING EQUIPMENT CARD
// ==========================================

if (workingEquipmentCard) {

  workingEquipmentCard.addEventListener(
    "click",
    async function() {

      openDashboardDetails();

      const title =
        document.getElementById(
          "dashboardDetailsTitle"
        );

      const loading =
        document.getElementById(
          "dashboardDetailsLoading"
        );

      const tableHead =
        document.getElementById(
          "dashboardDetailsTableHead"
        );

      const tableBody =
        document.getElementById(
          "dashboardDetailsTableBody"
        );

      if (title) {
        title.textContent =
          "Working Equipment";
      }

      if (loading) {
        loading.textContent =
          "Loading working equipment...";
      }

      if (tableHead) {
        tableHead.innerHTML = `
          <tr>
            <th>BME Number</th>
            <th>Equipment</th>
            <th>Department</th>
            <th>Manufacturer</th>
            <th>Model</th>
            <th>Serial Number</th>
            <th>Status</th>
          </tr>
        `;
      }

      if (tableBody) {
        tableBody.innerHTML = "";
      }

      try {

        // Get working equipment
        // StatusID = 1 means Working
        const {
          data: equipment,
          error: equipmentError
        } = await client
          .from("tblEquipment")
          .select(
            "EquipmentID, BMENumber, EquipmentName, Manufacturer, Model, SerialNumber, DepartmentID, StatusID"
          )
          .eq(
            "StatusID",
            1
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
        // Display working equipment count in title

if (title) {

  title.textContent =
    `Working Equipment — ${
      (equipment || []).length
    } Records`;

}

        // Get departments
        const {
          data: departments,
          error: departmentError
        } = await client
          .from("tblDepartment")
          .select(
            "DepartmentID, DepartmentName"
          );

        if (departmentError) {
          throw departmentError;
        }

        // Get equipment statuses
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

        // Create department lookup
        const departmentMap =
          {};

        (departments || []).forEach(
          department => {

            departmentMap[
              department.DepartmentID
            ] =
              department.DepartmentName;

          }
        );

        // Create status lookup
        const statusMap =
          {};

        (statuses || []).forEach(
          status => {

            statusMap[
              status.StatusID
            ] =
              status.StatusName;

          }
        );

        if (
          !equipment ||
          equipment.length === 0
        ) {

          tableBody.innerHTML = `
            <tr>
              <td colspan="7">
                No working equipment found.
              </td>
            </tr>
          `;

          loading.textContent =
            "No working equipment found.";

          return;
        }

        // Display working equipment
        equipment.forEach(
          item => {

            const row =
              document.createElement(
                "tr"
              );

            row.innerHTML = `
              <td>
                ${item.BMENumber || ""}
              </td>

              <td>
                ${item.EquipmentName || ""}
              </td>

              <td>
                ${
                  departmentMap[
                    item.DepartmentID
                  ] || ""
                }
              </td>

              <td>
                ${item.Manufacturer || ""}
              </td>

              <td>
                ${item.Model || ""}
              </td>

              <td>
                ${item.SerialNumber || ""}
              </td>

              <td>
                ${
                  statusMap[
                    item.StatusID
                  ] || "Working"
                }
              </td>
            `;

            tableBody.appendChild(
              row
            );

          }
        );

        loading.textContent =
          `${equipment.length} working equipment record(s) found.`;

      }

      catch (error) {

        console.error(
          "Working equipment error:",
          error
        );

        tableBody.innerHTML = `
          <tr>
            <td colspan="7">
              Unable to load working equipment.
            </td>
          </tr>
        `;

        loading.textContent =
          "Unable to load working equipment.";

      }

    }
  );

}

// ==========================================
// MAINTENANCE REPORTS CARD
// ==========================================
if (maintenanceReportsCard) {

  maintenanceReportsCard.addEventListener(
    "click",
    async function() {

      openDashboardDetails();

      const title =
        document.getElementById(
          "dashboardDetailsTitle"
        );

      const loading =
        document.getElementById(
          "dashboardDetailsLoading"
        );

      const countText =
        document.getElementById(
          "dashboardDetailsCount"
        );

      const tableHead =
        document.getElementById(
          "dashboardDetailsTableHead"
        );

      const tableBody =
        document.getElementById(
          "dashboardDetailsTableBody"
        );

      if (title) {
        title.textContent =
          "Maintenance Reports";
      }

      if (loading) {
        loading.textContent =
          "Loading maintenance reports...";
      }

      if (countText) {
        countText.textContent = "";
      }

      if (tableHead) {
        tableHead.innerHTML = `
          <tr>
            <th>Date</th>
            <th>Job Order</th>
            <th>BME Number</th>
            <th>Equipment</th>
            <th>Department</th>
            <th>Engineer</th>
            <th>Maintenance Type</th>
            <th>Fault Reported</th>
            <th>Diagnosis</th>
            <th>Action Taken</th>
            <th>Part Used</th>
            <th>Required Part</th>
            <th>Quantity</th>
            <th>Part Status</th>
            <th>Status</th>
            <th>Remarks</th>
          </tr>
        `;
      }

      if (tableBody) {
        tableBody.innerHTML = "";
      }

      try {

        const {
          data,
          error
        } = await client
          .from("vwMaintenanceReport")
          .select(`
            MaintenanceID,
            JobOrderNumber,
            ReportDate,
            BMENumber,
            EquipmentName,
            DepartmentName,
            EngineerName,
            MaintenanceType,
            FaultReported,
            Diagnosis,
            ActionTaken,
            PartUsed,
            RequiredPart,
            QuantityRequired,
            PartRequestedStatus,
            StatusName,
            Remarks
          `)
          .order(
            "ReportDate",
            {
              ascending: false
            }
          );

        if (error) {
          throw error;
        }
        // Display maintenance report count in title

if (title) {

  title.textContent =
    `Maintenance Reports — ${
      (data || []).length
    } Records`;

}

        if (
          !data ||
          data.length === 0
        ) {

          tableBody.innerHTML = `
            <tr>
              <td colspan="16">
                No maintenance reports found.
              </td>
            </tr>
          `;

          if (loading) {
            loading.textContent =
              "No maintenance reports found.";
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
                ${report.QuantityRequired || ""}
              </td>

              <td>
                ${report.PartRequestedStatus || ""}
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

        if (loading) {
          loading.textContent =
            `${data.length} maintenance report(s) found.`;
        }

        if (countText) {
          countText.textContent =
            `Total: ${data.length} maintenance report(s)`;
        }

      }

      catch (error) {

        console.error(
          "Maintenance reports error:",
          error
        );

        if (tableBody) {
          tableBody.innerHTML = `
            <tr>
              <td colspan="16">
                Unable to load maintenance reports.
              </td>
            </tr>
          `;
        }

        if (loading) {
          loading.textContent =
            "Unable to load maintenance reports.";
        }

        if (countText) {
          countText.textContent = "";
        }

      }

    }
  );

}
// ==========================================
// UNDER REPAIR CARD
// ==========================================

if (underRepairCard) {

  underRepairCard.addEventListener(
    "click",
    async function() {

      openDashboardDetails();

      const title =
        document.getElementById(
          "dashboardDetailsTitle"
        );

      const loading =
        document.getElementById(
          "dashboardDetailsLoading"
        );

      const tableHead =
        document.getElementById(
          "dashboardDetailsTableHead"
        );

      const tableBody =
        document.getElementById(
          "dashboardDetailsTableBody"
        );

      if (title) {
        title.textContent =
          "Equipment Under Repair";
      }

      if (loading) {
        loading.textContent =
          "Loading equipment under repair...";
      }

      if (tableHead) {
        tableHead.innerHTML = `
          <tr>
            <th>BME Number</th>
            <th>Equipment</th>
            <th>Department</th>
            <th>Manufacturer</th>
            <th>Model</th>
            <th>Serial Number</th>
            <th>Status</th>
<th>Action</th>
          </tr>
        `;
      }

      if (tableBody) {
        tableBody.innerHTML = "";
      }

      try {

        // StatusID = 2 means Under Repair
        const {
          data: equipment,
          error: equipmentError
        } = await client
          .from("tblEquipment")
          .select(
            "EquipmentID, BMENumber, EquipmentName, Manufacturer, Model, SerialNumber, DepartmentID, StatusID"
          )
          .eq(
            "StatusID",
            2
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
        // Display under repair count in title

if (title) {

  title.textContent =
    `Equipment Under Repair — ${
      (equipment || []).length
    } Records`;

}

        // Get departments
        const {
          data: departments,
          error: departmentError
        } = await client
          .from("tblDepartment")
          .select(
            "DepartmentID, DepartmentName"
          );

        if (departmentError) {
          throw departmentError;
        }

        // Get equipment statuses
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

        // Department lookup
        const departmentMap =
          {};

        (departments || []).forEach(
          department => {

            departmentMap[
              department.DepartmentID
            ] =
              department.DepartmentName;

          }
        );

        // Status lookup
        const statusMap =
          {};

        (statuses || []).forEach(
          status => {

            statusMap[
              status.StatusID
            ] =
              status.StatusName;

          }
        );

        if (
          !equipment ||
          equipment.length === 0
        ) {

          tableBody.innerHTML = `
            <tr>
              <td colspan="8">
                No equipment is currently under repair.
              </td>
            </tr>
          `;

          loading.textContent =
            "No equipment is currently under repair.";

          return;
        }

        // Display equipment
        equipment.forEach(
          item => {

            const row =
              document.createElement(
                "tr"
              );

            row.innerHTML = `
  <td>
    ${item.BMENumber || ""}
  </td>

  <td>
    ${item.EquipmentName || ""}
  </td>

  <td>
    ${
      departmentMap[
        item.DepartmentID
      ] || ""
    }
  </td>

  <td>
    ${item.Manufacturer || ""}
  </td>

  <td>
    ${item.Model || ""}
  </td>

  <td>
    ${item.SerialNumber || ""}
  </td>

  <td>
    ${
      statusMap[
        item.StatusID
      ] || "Under Repair"
    }
  </td>

  <td>
    <button
      type="button"
      class="secondary under-repair-treatment-btn"
      data-equipment-id="${item.EquipmentID}"
    >
      🔧 Continue Treatment
    </button>
  </td>
`;

            tableBody.appendChild(
              row
            );
            const treatmentButton =
  row.querySelector(
    ".under-repair-treatment-btn"
  );

if (treatmentButton) {

  treatmentButton.addEventListener(
    "click",
    async function() {

      const equipmentId =
        this.dataset.equipmentId;

      const maintenanceSection =
        document.getElementById(
          "maintenanceSection"
        );

      const equipmentSelect =
        document.getElementById(
          "equipmentId"
        );

      if (!equipmentSelect) {

        alert(
          "Maintenance equipment selector was not found."
        );

        return;
      }

      // Select the equipment
      equipmentSelect.value =
        equipmentId;
      const continueTreatmentMessage =
  document.getElementById(
    "continueTreatmentMessage"
  );

if (continueTreatmentMessage) {
  continueTreatmentMessage.style.display =
    "block";
}
      const previousMaintenancePanel =
  document.getElementById(
    "previousMaintenancePanel"
  );

const previousMaintenanceLoading =
  document.getElementById(
    "previousMaintenanceLoading"
  );

if (previousMaintenancePanel) {
  previousMaintenancePanel.style.display =
    "block";
}

if (previousMaintenanceLoading) {
  previousMaintenanceLoading.textContent =
    "Loading previous maintenance record...";
}
try {

  const {
    data: previousMaintenance,
    error: previousMaintenanceError
  } = await client
    .from("vwMaintenanceReport")
    .select(`
      JobOrderNumber,
      ReportDate,
      EngineerName,
      FaultReported,
      Diagnosis,
      ActionTaken,
      PartUsed,
      RequiredPart,
      StatusName,
      Remarks
    `)
    .eq(
      "EquipmentID",
      Number(equipmentId)
    )
    .order(
      "ReportDate",
      {
        ascending: false
      }
    )
    .limit(1)
    .maybeSingle();

  if (previousMaintenanceError) {
    throw previousMaintenanceError;
  }

  if (!previousMaintenance) {

    if (previousMaintenanceLoading) {
      previousMaintenanceLoading.textContent =
        "No previous maintenance record found.";
    }

    return;
  }

  document.getElementById(
    "previousJobOrderNumber"
  ).textContent =
    previousMaintenance.JobOrderNumber || "-";

  document.getElementById(
    "previousReportDate"
  ).textContent =
    previousMaintenance.ReportDate || "-";

  document.getElementById(
    "previousEngineer"
  ).textContent =
    previousMaintenance.EngineerName || "-";

  document.getElementById(
    "previousFaultReported"
  ).textContent =
    previousMaintenance.FaultReported || "-";

  document.getElementById(
    "previousDiagnosis"
  ).textContent =
    previousMaintenance.Diagnosis || "-";

  document.getElementById(
    "previousActionTaken"
  ).textContent =
    previousMaintenance.ActionTaken || "-";

  document.getElementById(
    "previousPartUsed"
  ).textContent =
    previousMaintenance.PartUsed || "-";

  document.getElementById(
    "previousRequiredPart"
  ).textContent =
    previousMaintenance.RequiredPart || "-";

  document.getElementById(
    "previousStatus"
  ).textContent =
    previousMaintenance.StatusName || "-";

  document.getElementById(
    "previousRemarks"
  ).textContent =
    previousMaintenance.Remarks || "-";

  if (previousMaintenanceLoading) {
    previousMaintenanceLoading.textContent =
      "Previous maintenance record loaded.";
  }

}
catch (error) {

  console.error(
    "Previous maintenance error:",
    error
  );

  if (previousMaintenanceLoading) {
    previousMaintenanceLoading.textContent =
      "Unable to load previous maintenance record.";
  }

}

      // Trigger existing equipment change event
      equipmentSelect.dispatchEvent(
        new Event(
          "change",
          {
            bubbles: true
          }
        )
      );

      // Show Maintenance Report section
      if (maintenanceSection) {

        maintenanceSection.classList.remove(
          "hidden"
        );

        maintenanceSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

    }
  );

}

          }
        );

        loading.textContent =
          `${equipment.length} equipment under repair.`;

      }

      catch (error) {

        console.error(
          "Under repair error:",
          error
        );

        tableBody.innerHTML = `
          <tr>
            <td colspan="8">
              Unable to load equipment under repair.
            </td>
          </tr>
        `;

        loading.textContent =
          "Unable to load equipment under repair.";

      }

    }
  );

}

// ==========================================
// AWAITING PARTS CARD
// ==========================================

if (awaitingPartsCard) {

  awaitingPartsCard.addEventListener(
    "click",
    async function() {

      openDashboardDetails();

      const title =
        document.getElementById(
          "dashboardDetailsTitle"
        );

      const loading =
        document.getElementById(
          "dashboardDetailsLoading"
        );

      const tableHead =
        document.getElementById(
          "dashboardDetailsTableHead"
        );

      const tableBody =
        document.getElementById(
          "dashboardDetailsTableBody"
        );

      if (title) {
        title.textContent =
          "Equipment Awaiting Parts";
      }

      if (loading) {
        loading.textContent =
          "Loading equipment awaiting parts...";
      }

      if (tableHead) {
        tableHead.innerHTML = `
          <tr>
            <th>BME Number</th>
            <th>Equipment</th>
            <th>Department</th>
            <th>Manufacturer</th>
            <th>Model</th>
            <th>Serial Number</th>
            <th>Status</th>
<th>Action</th>
          </tr>
        `;
      }

      if (tableBody) {
        tableBody.innerHTML = "";
      }

      try {

        // StatusID = 3 means Awaiting Parts
        const {
          data: equipment,
          error: equipmentError
        } = await client
          .from("tblEquipment")
          .select(
            "EquipmentID, BMENumber, EquipmentName, Manufacturer, Model, SerialNumber, DepartmentID, StatusID"
          )
          .eq(
            "StatusID",
            3
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
        // Display awaiting parts count in title

if (title) {

  title.textContent =
    `Equipment Awaiting Parts — ${
      (equipment || []).length
    } Records`;

}

        // Get departments
        const {
          data: departments,
          error: departmentError
        } = await client
          .from("tblDepartment")
          .select(
            "DepartmentID, DepartmentName"
          );

        if (departmentError) {
          throw departmentError;
        }

        // Get equipment statuses
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

        // Department lookup
        const departmentMap =
          {};

        (departments || []).forEach(
          department => {

            departmentMap[
              department.DepartmentID
            ] =
              department.DepartmentName;

          }
        );

        // Status lookup
        const statusMap =
          {};

        (statuses || []).forEach(
          status => {

            statusMap[
              status.StatusID
            ] =
              status.StatusName;

          }
        );

        if (
          !equipment ||
          equipment.length === 0
        ) {

          tableBody.innerHTML = `
            <tr>
              <td colspan="7">
                No equipment is currently awaiting parts.
              </td>
            </tr>
          `;

          loading.textContent =
            "No equipment is currently awaiting parts.";

          return;
        }

        // Display equipment
        equipment.forEach(
          item => {

            const row =
              document.createElement(
                "tr"
              );

            row.innerHTML = `
              <td>
                ${item.BMENumber || ""}
              </td>

              <td>
                ${item.EquipmentName || ""}
              </td>

              <td>
                ${
                  departmentMap[
                    item.DepartmentID
                  ] || ""
                }
              </td>

              <td>
                ${item.Manufacturer || ""}
              </td>

              <td>
                ${item.Model || ""}
              </td>

              <td>
                ${item.SerialNumber || ""}
              </td>

              <td>
                ${
                  statusMap[
                    item.StatusID
                  ] || "Awaiting Parts"
                }
              </td>
              <td>
  <button
    type="button"
    class="secondary awaiting-parts-treatment-btn"
    data-equipment-id="${item.EquipmentID}"
  >
    🔧 Continue Treatment
  </button>
</td>
            `;

            tableBody.appendChild(
              row
            );
            const treatmentButton =
  row.querySelector(
    ".awaiting-parts-treatment-btn"
  );

if (treatmentButton) {

  treatmentButton.addEventListener(
    "click",
    async function() {

      const equipmentId =
        this.dataset.equipmentId;

      const maintenanceSection =
        document.getElementById(
          "maintenanceSection"
        );

      const equipmentSelect =
        document.getElementById(
          "equipmentId"
        );

      if (!equipmentSelect) {

        alert(
          "Maintenance equipment selector was not found."
        );

        return;
      }

      // Select the equipment
      equipmentSelect.value =
        equipmentId;

      // Show continuation message
      const continueTreatmentMessage =
        document.getElementById(
          "continueTreatmentMessage"
        );

      if (continueTreatmentMessage) {
        continueTreatmentMessage.style.display =
          "block";
      }

      // Show previous maintenance panel
      const previousMaintenancePanel =
        document.getElementById(
          "previousMaintenancePanel"
        );

      const previousMaintenanceLoading =
        document.getElementById(
          "previousMaintenanceLoading"
        );

      if (previousMaintenancePanel) {
        previousMaintenancePanel.style.display =
          "block";
      }

      if (previousMaintenanceLoading) {
        previousMaintenanceLoading.textContent =
          "Loading previous maintenance record...";
      }
      try {

  const {
    data: previousMaintenance,
    error: previousMaintenanceError
  } = await client
    .from("vwMaintenanceReport")
    .select(`
      JobOrderNumber,
      ReportDate,
      EngineerName,
      FaultReported,
      Diagnosis,
      ActionTaken,
      PartUsed,
      RequiredPart,
      StatusName,
      Remarks
    `)
    .eq(
      "EquipmentID",
      Number(equipmentId)
    )
    .order(
      "ReportDate",
      {
        ascending: false
      }
    )
    .limit(1)
    .maybeSingle();

  if (previousMaintenanceError) {
    throw previousMaintenanceError;
  }

  if (!previousMaintenance) {

    if (previousMaintenanceLoading) {
      previousMaintenanceLoading.textContent =
        "No previous maintenance record found for this equipment.";
    }

    return;
  }

  document.getElementById(
    "previousJobOrderNumber"
  ).textContent =
    previousMaintenance.JobOrderNumber || "-";

  document.getElementById(
    "previousReportDate"
  ).textContent =
    previousMaintenance.ReportDate || "-";

  document.getElementById(
    "previousEngineer"
  ).textContent =
    previousMaintenance.EngineerName || "-";

  document.getElementById(
    "previousFaultReported"
  ).textContent =
    previousMaintenance.FaultReported || "-";

  document.getElementById(
    "previousDiagnosis"
  ).textContent =
    previousMaintenance.Diagnosis || "-";

  document.getElementById(
    "previousActionTaken"
  ).textContent =
    previousMaintenance.ActionTaken || "-";

  document.getElementById(
    "previousPartUsed"
  ).textContent =
    previousMaintenance.PartUsed || "-";

  document.getElementById(
    "previousRequiredPart"
  ).textContent =
    previousMaintenance.RequiredPart || "-";

  document.getElementById(
    "previousStatus"
  ).textContent =
    previousMaintenance.StatusName || "-";

  document.getElementById(
    "previousRemarks"
  ).textContent =
    previousMaintenance.Remarks || "-";

  if (previousMaintenanceLoading) {
    previousMaintenanceLoading.textContent =
      "Previous maintenance record loaded.";
  }

}
catch (error) {

  console.error(
    "Previous maintenance error:",
    error
  );

  if (previousMaintenanceLoading) {
    previousMaintenanceLoading.textContent =
      "Unable to load previous maintenance record.";
  }

}

      // Trigger existing equipment change event
      equipmentSelect.dispatchEvent(
        new Event(
          "change",
          {
            bubbles: true
          }
        )
      );

      // Open Maintenance Report
      if (maintenanceSection) {

        maintenanceSection.classList.remove(
          "hidden"
        );

        maintenanceSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

    }
  );

}

          }
        );

        loading.textContent =
          `${equipment.length} equipment awaiting parts.`;

      }

      catch (error) {

        console.error(
          "Awaiting parts error:",
          error
        );

        tableBody.innerHTML = `
          <tr>
            <td colspan="7">
              Unable to load equipment awaiting parts.
            </td>
          </tr>
        `;

        loading.textContent =
          "Unable to load equipment awaiting parts.";

      }

    }
  );

}

if (storeEquipmentCard) {

  storeEquipmentCard.addEventListener(
    "click",
    async function() {

      openDashboardDetails();

      const title =
        document.getElementById(
          "dashboardDetailsTitle"
        );

      const loading =
        document.getElementById(
          "dashboardDetailsLoading"
        );

      const tableHead =
        document.getElementById(
          "dashboardDetailsTableHead"
        );

      const tableBody =
        document.getElementById(
          "dashboardDetailsTableBody"
        );

      if (title) {
        title.textContent =
          "Biomedical Equipment Store";
      }

      if (loading) {
        loading.textContent =
          "Loading store inventory...";
      }

      if (tableHead) {

        tableHead.innerHTML = `
          <tr>
            <th>Equipment Name</th>
            <th>Quantity</th>
            <th>Manufacturer</th>
            <th>Model</th>
            <th>Date Received</th>
            <th>Source</th>
            <th>Store Location</th>
            <th>Action</th>
          </tr>
        `;

      }

      if (tableBody) {
        tableBody.innerHTML = "";
      }

      try {

        const {
          data: inventory,
          error: inventoryError
        } = await client
          .from("tblEquipmentStore")
          .select(
            "StoreID, EquipmentName, Quantity, Manufacturer, Model, DateReceived, Source, StoreLocation"
          )
          .gt(
            "Quantity",
            0
          )
          .order(
            "EquipmentName",
            {
              ascending: true
            }
          );

        if (inventoryError) {
          throw inventoryError;
        }

        if (title) {

          title.textContent =
            `Biomedical Equipment Store — ${
              (inventory || []).length
            } Records`;

        }

        if (
          !inventory ||
          inventory.length === 0
        ) {

          tableBody.innerHTML = `
            <tr>
              <td colspan="8">
                No equipment is currently available in the store.
              </td>
            </tr>
          `;

          loading.textContent =
            "No equipment is currently available in the store.";

          return;
        }

        inventory.forEach(
          item => {

            const row =
              document.createElement(
                "tr"
              );

            row.innerHTML = `
              <td>
                ${item.EquipmentName || ""}
              </td>

              <td>
                ${item.Quantity || 0}
              </td>

              <td>
                ${item.Manufacturer || "-"}
              </td>

              <td>
                ${item.Model || "-"}
              </td>

              <td>
                ${item.DateReceived || "-"}
              </td>

              <td>
                ${item.Source || "-"}
              </td>

              <td>
                ${item.StoreLocation || "-"}
              </td>

              <td>
                <button
                  type="button"
                  class="secondary store-deploy-btn"
                  data-store-id="${item.StoreID}"
                >
                  🚚 Deploy
                </button>
              </td>
            `;

            tableBody.appendChild(
              row
            );

          }
        );

        loading.textContent =
          `${inventory.length} store inventory records loaded.`;

        document
          .querySelectorAll(
            ".store-deploy-btn"
          )
          .forEach(
            button => {

              button.addEventListener(
                "click",
                function() {
                  const storeId =
                    this.getAttribute(
                      "data-store-id"
                    );

                  const storeDeploymentSection =
                    document.getElementById(
                      "storeDeploymentSection"
                    );

                  if (
                    storeDeploymentSection
                  ) {

                    storeDeploymentSection.classList.remove(
                      "hidden"
                    );

                    storeDeploymentSection.scrollIntoView({
                      behavior: "smooth",
                      block: "start"
                    });

                  }

                  if (
                    deploymentStoreId
                  ) {

                    deploymentStoreId.value =
                      storeId;

                    deploymentStoreId.dispatchEvent(
                      new Event(
                        "change",
                        {
                          bubbles: true
                        }
                      )
                    );

                  }

                }
              );

            }
          );
        }

      catch (error) {

        console.error(
          "Store inventory error:",
          error
        );

        tableBody.innerHTML = `
          <tr>
            <td colspan="8">
              Unable to load store inventory.
            </td>
          </tr>
        `;

        loading.textContent =
          "Store error: " + error.message

      }

    }
  );

}

  if (storeEquipmentTypesCard) {

  storeEquipmentTypesCard.addEventListener(
    "click",
    async function() {

      openDashboardDetails();

      const title =
        document.getElementById(
          "dashboardDetailsTitle"
        );

      const loading =
        document.getElementById(
          "dashboardDetailsLoading"
        );

      const tableHead =
        document.getElementById(
          "dashboardDetailsTableHead"
        );

      const tableBody =
        document.getElementById(
          "dashboardDetailsTableBody"
        );

      if (title) {
        title.textContent =
          "Equipment Types in Store";
      }

      if (loading) {
        loading.textContent =
          "Loading store equipment types...";
      }

      if (tableHead) {

        tableHead.innerHTML = `
          <tr>
            <th>Equipment Name</th>
            <th>Total Quantity</th>
            <th>Manufacturer</th>
            <th>Model</th>
          </tr>
        `;

      }

      if (tableBody) {
        tableBody.innerHTML = "";
      }

      try {

        const {
          data: inventory,
          error: inventoryError
        } = await client
          .from("tblEquipmentStore")
          .select(
            "EquipmentName, Quantity, Manufacturer, Model"
          )
          .gt(
            "Quantity",
            0
          )
          .order(
            "EquipmentName",
            {
              ascending: true
            }
          );

        if (inventoryError) {
          throw inventoryError;
        }

        if (title) {

          title.textContent =
            `Equipment Types in Store — ${
              (inventory || []).length
            } Records`;

        }

        if (
          !inventory ||
          inventory.length === 0
        ) {

          tableBody.innerHTML = `
            <tr>
              <td colspan="4">
                No equipment types are currently in the store.
              </td>
            </tr>
          `;

          loading.textContent =
            "No equipment types are currently in the store.";

          return;
        }

        inventory.forEach(
          item => {

            const row =
              document.createElement(
                "tr"
              );

            row.innerHTML = `
              <td>
                ${item.EquipmentName || ""}
              </td>

              <td>
                ${item.Quantity || 0}
              </td>

              <td>
                ${item.Manufacturer || "-"}
              </td>

              <td>
                ${item.Model || "-"}
              </td>
            `;

            tableBody.appendChild(
              row
            );

          }
        );

        loading.textContent =
          `${inventory.length} equipment types found in store.`;

      }

      catch (error) {

        console.error(
          "Store equipment types error:",
          error
        );

        tableBody.innerHTML = `
          <tr>
            <td colspan="4">
              Unable to load equipment types in store.
            </td>
          </tr>
        `;

        loading.textContent =
          "Store types error: " +
          error.message;

      }

    }
  );

}
if (openStoreInventoryBtn) {

  openStoreInventoryBtn.addEventListener(
    "click",
    function() {

      const storeInventorySection =
        document.getElementById(
          "storeInventorySection"
        );

      const dashboardSection =
        document.getElementById(
          "dashboardSection"
        );

      if (storeInventorySection) {

        storeInventorySection.classList.remove(
          "hidden"
        );

        storeInventorySection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

    }
  );

}
if (openStoreDeploymentBtn) {

  openStoreDeploymentBtn.addEventListener(
    "click",
    function() {

      const storeDeploymentSection =
        document.getElementById(
          "storeDeploymentSection"
        );

      if (storeDeploymentSection) {

        storeDeploymentSection.classList.remove(
          "hidden"
        );

        storeDeploymentSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

    }
  );

}
if (openStoreMovementHistoryBtn) {

    openStoreMovementHistoryBtn.addEventListener(
      "click",
      function() {
        const storeMovementHistorySection =
          document.getElementById(
            "storeMovementHistorySection"
          );

        if (storeMovementHistorySection) {

          storeMovementHistorySection.classList.remove(
            "hidden"
          );

          storeMovementHistorySection.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }

      }
    );

  }
// ==========================================
// MAINTENANCE REPORT EQUIPMENT SEARCH
// ==========================================

async function setupMaintenanceEquipmentSearch() {

  const searchBox =
    document.getElementById(
      "equipmentSearchInput"
    );

  const maintenanceEquipmentDropdown =
    document.getElementById(
      "equipmentId"
    );

  if (
    !searchBox ||
    !maintenanceEquipmentDropdown
  ) {
    return;
  }

  searchBox.addEventListener(
    "input",
    async function() {

      const searchValue =
        searchBox.value
          .trim()
          .toLowerCase();

      // ======================================
      // EMPTY SEARCH
      // LOAD ALL EQUIPMENT AGAIN
      // ======================================

      if (!searchValue) {

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

          },
          "BMENumber"
        );

        return;
      }

      try {

        // ====================================
        // LOAD EQUIPMENT
        // ====================================

        const {
          data: equipmentData,
          error: equipmentError
        } = await client
          .from("tblEquipment")
          .select(`
            EquipmentID,
            BMENumber,
            EquipmentName,
            SerialNumber,
            DepartmentID
          `)
          .order(
            "BMENumber",
            {
              ascending: true
            }
          );

        if (equipmentError) {
          throw equipmentError;
        }


        // ====================================
        // LOAD DEPARTMENTS
        // ====================================

        const {
          data: departmentData,
          error: departmentError
        } = await client
          .from("tblDepartment")
          .select(`
            DepartmentID,
            DepartmentName
          `);

        if (departmentError) {
          throw departmentError;
        }


        // ====================================
        // FILTER EQUIPMENT
        // ====================================

        const matchingEquipment =
          (equipmentData || []).filter(
            equipment => {

              const bmeNumber =
                (
                  equipment.BMENumber || ""
                ).toLowerCase();

              const equipmentName =
                (
                  equipment.EquipmentName || ""
                ).toLowerCase();

              const serialNumber =
                (
                  equipment.SerialNumber || ""
                ).toLowerCase();

              const departmentName =
                (
                  departmentData || []
                )
                .find(
                  department =>
                    department.DepartmentID ===
                    equipment.DepartmentID
                )
                ?.DepartmentName
                ?.toLowerCase() || "";

              return (
                bmeNumber.includes(
                  searchValue
                ) ||

                equipmentName.includes(
                  searchValue
                ) ||

                serialNumber.includes(
                  searchValue
                ) ||

                departmentName.includes(
                  searchValue
                )
              );

            }
          );


        // ====================================
        // CLEAR EXISTING DROPDOWN
        // ====================================

        maintenanceEquipmentDropdown.innerHTML =
          "";


        // ====================================
        // DEFAULT OPTION
        // ====================================

        const defaultEquipmentOption =
          document.createElement(
            "option"
          );

        defaultEquipmentOption.value =
          "";

        if (
          matchingEquipment.length > 0
        ) {

          defaultEquipmentOption.textContent =
            "Select equipment";

        } else {

          defaultEquipmentOption.textContent =
            "No matching equipment found";

        }

        maintenanceEquipmentDropdown.appendChild(
          defaultEquipmentOption
        );


        // ====================================
        // ADD MATCHING EQUIPMENT
        // ====================================

        matchingEquipment.forEach(
          equipment => {

            const equipmentOption =
              document.createElement(
                "option"
              );

            equipmentOption.value =
              equipment.EquipmentID;

            const bme =
              equipment.BMENumber || "";

            const name =
              equipment.EquipmentName || "";

            const serial =
              equipment.SerialNumber || "";

            const department =
              (
                departmentData || []
              )
              .find(
                item =>
                  item.DepartmentID ===
                  equipment.DepartmentID
              )
              ?.DepartmentName || "";

            equipmentOption.textContent =
              bme
                ? `${bme} — ${name}`
                : name;

            // Store extra information
            // for the selected equipment

            equipmentOption.dataset.serial =
              serial;

            equipmentOption.dataset.department =
              department;

            maintenanceEquipmentDropdown.appendChild(
              equipmentOption
            );

          }
        );

      }

      catch (error) {

        console.error(
          "Maintenance equipment search error:",
          error
        );

        maintenanceEquipmentDropdown.innerHTML = `
          <option value="">
            Unable to search equipment
          </option>
        `;

      }

    }
  );

}


// ==========================================
// START MAINTENANCE EQUIPMENT SEARCH
// ==========================================

setupMaintenanceEquipmentSearch();

// ==========================================
// PREVENTIVE MAINTENANCE EQUIPMENT SEARCH
// ==========================================

async function setupPMEquipmentSearch() {

  const pmSearchBox =
    document.getElementById(
      "pmEquipmentSearchInput"
    );

  const pmEquipmentDropdown =
    document.getElementById(
      "pmEquipmentId"
    );

  if (
    !pmSearchBox ||
    !pmEquipmentDropdown
  ) {
    return;
  }

  pmSearchBox.addEventListener(
    "input",
    async function() {

      const searchValue =
        pmSearchBox.value
          .trim()
          .toLowerCase();

      // ====================================
      // EMPTY SEARCH
      // ====================================

      if (!searchValue) {

        await loadPMEquipmentDropdown();

        return;
      }

      try {

        // ==================================
        // LOAD EQUIPMENT
        // ==================================

        const {
          data: pmEquipmentData,
          error: pmEquipmentError
        } = await client
          .from("tblEquipment")
          .select(`
            EquipmentID,
            BMENumber,
            EquipmentName,
            SerialNumber,
            DepartmentID
          `)
          .order(
            "BMENumber",
            {
              ascending: true
            }
          );

        if (pmEquipmentError) {
          throw pmEquipmentError;
        }


        // ==================================
        // LOAD DEPARTMENTS
        // ==================================

        const {
          data: pmDepartmentData,
          error: pmDepartmentError
        } = await client
          .from("tblDepartment")
          .select(`
            DepartmentID,
            DepartmentName
          `);

        if (pmDepartmentError) {
          throw pmDepartmentError;
        }


        // ==================================
        // FILTER EQUIPMENT
        // ==================================

        const pmMatchingEquipment =
          (pmEquipmentData || []).filter(
            equipment => {

              const bmeNumber =
                (
                  equipment.BMENumber || ""
                ).toLowerCase();

              const equipmentName =
                (
                  equipment.EquipmentName || ""
                ).toLowerCase();

              const serialNumber =
                (
                  equipment.SerialNumber || ""
                ).toLowerCase();

              const departmentName =
                (
                  pmDepartmentData || []
                )
                .find(
                  department =>
                    department.DepartmentID ===
                    equipment.DepartmentID
                )
                ?.DepartmentName
                ?.toLowerCase() || "";

              return (
                bmeNumber.includes(
                  searchValue
                ) ||

                equipmentName.includes(
                  searchValue
                ) ||

                serialNumber.includes(
                  searchValue
                ) ||

                departmentName.includes(
                  searchValue
                )
              );

            }
          );


        // ==================================
        // CLEAR PM DROPDOWN
        // ==================================

        pmEquipmentDropdown.innerHTML =
          "";


        // ==================================
        // DEFAULT OPTION
        // ==================================

        const pmDefaultOption =
          document.createElement(
            "option"
          );

        pmDefaultOption.value =
          "";

        pmDefaultOption.textContent =
          pmMatchingEquipment.length
            ? "Select equipment"
            : "No matching equipment found";

        pmEquipmentDropdown.appendChild(
          pmDefaultOption
        );


        // ==================================
        // ADD MATCHING EQUIPMENT
        // ==================================

        pmMatchingEquipment.forEach(
          equipment => {

            const pmOption =
              document.createElement(
                "option"
              );

            pmOption.value =
              equipment.EquipmentID;

            const bme =
              equipment.BMENumber || "";

            const name =
              equipment.EquipmentName || "";

            pmOption.textContent =
              bme
                ? `${bme} — ${name}`
                : name;

            pmEquipmentDropdown.appendChild(
              pmOption
            );

          }
        );

      }

      catch (error) {

        console.error(
          "PM equipment search error:",
          error
        );

        pmEquipmentDropdown.innerHTML = `
          <option value="">
            Unable to search equipment
          </option>
        `;

      }

    }
  );

}


// ==========================================
// START PM EQUIPMENT SEARCH
// ==========================================

setupPMEquipmentSearch();
const printStoreMovementHistoryBtn =
  document.getElementById(
    "printStoreMovementHistoryBtn"
  );

if (printStoreMovementHistoryBtn) {

  printStoreMovementHistoryBtn.addEventListener(
    "click",
    function() {

      const table =
        document.getElementById(
          "storeMovementHistoryTable"
        );

      if (!table) {
        alert(
          "Store Movement History table was not found."
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
          "Unable to open print window. Please allow pop-ups."
        );

        return;
      }

      printWindow.document.write(`
        <html>
        <head>

          <title>
            Store Movement History
          </title>

          <style>

            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }

            h1 {
              text-align: center;
              margin-bottom: 20px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            th,
            td {
              border: 1px solid #000;
              padding: 8px;
              text-align: left;
            }

            th {
              font-weight: bold;
            }

            @media print {

              body {
                margin: 10mm;
              }

            }

          </style>

        </head>

        <body>

          <h1>
            Store Movement History
          </h1>

          ${table.outerHTML}

        </body>
        </html>
      `);

      printWindow.document.close();

      printWindow.focus();

      setTimeout(
        function() {

          printWindow.print();

        },
        500
      );

    }
  );

}

const downloadStoreMovementHistoryPdfBtn =
  document.getElementById(
    "downloadStoreMovementHistoryPdfBtn"
  );

if (downloadStoreMovementHistoryPdfBtn) {

  downloadStoreMovementHistoryPdfBtn.addEventListener(
    "click",
    function() {

      const table =
        document.getElementById(
          "storeMovementHistoryTable"
        );

      if (!table) {

        alert(
          "Store Movement History table was not found."
        );

        return;
      }

      if (
        typeof window.jspdf ===
        "undefined"
      ) {

        alert(
          "PDF library is not available."
        );

        return;
      }

      const {
        jsPDF
      } = window.jspdf;

      const doc =
        new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4"
        });

      doc.setFontSize(16);

      doc.text(
        "Store Movement History",
        148,
        15,
        {
          align: "center"
        }
      );

      doc.setFontSize(10);

      doc.text(
        "Generated: " +
        new Date().toLocaleString(),
        14,
        23
      );

      const rows = [];

      table
        .querySelectorAll(
          "tbody tr"
        )
        .forEach(
          row => {

            const cells =
              row.querySelectorAll(
                "td"
              );

            if (
              cells.length >= 7
            ) {

              rows.push([
                cells[0].innerText.trim(),
                cells[1].innerText.trim(),
                cells[2].innerText.trim(),
                cells[3].innerText.trim(),
                cells[4].innerText.trim(),
                cells[5].innerText.trim(),
                cells[6].innerText.trim()
              ]);

            }

          }
        );

      if (rows.length === 0) {

        alert(
          "There are no movement records to export."
        );

        return;
      }

      doc.autoTable({

        startY: 28,

        head: [[
          "Equipment Name",
          "Movement Type",
          "Quantity",
          "Department",
          "Movement Date",
          "Moved By",
          "Remarks"
        ]],

        body: rows,

        theme: "grid",

        styles: {
          fontSize: 8,
          cellPadding: 2
        },

        headStyles: {
          fontSize: 8
        }

      });

      doc.save(
        "Store_Movement_History.pdf"
      );

    }
  );

}

const storeInventorySearch =
  document.getElementById(
    "storeInventorySearch"
  );

const clearStoreInventorySearchBtn =
  document.getElementById(
    "clearStoreInventorySearchBtn"
  );

if (storeInventorySearch) {

  storeInventorySearch.addEventListener(
    "input",
    function() {

      const searchText =
        this.value
          .trim()
          .toLowerCase();

      const rows =
        storeInventoryTableBody
          ? storeInventoryTableBody.querySelectorAll(
              "tr"
            )
          : [];

      rows.forEach(
        row => {

          const rowText =
            row.textContent
              .toLowerCase();

          if (
            !searchText ||
            rowText.includes(searchText)
          ) {

            row.style.display = "";

          } else {

            row.style.display = "none";

          }

        }
      );

    }
  );

}

if (clearStoreInventorySearchBtn) {

  clearStoreInventorySearchBtn.addEventListener(
    "click",
    function() {

      if (storeInventorySearch) {

        storeInventorySearch.value = "";

        storeInventorySearch.dispatchEvent(
          new Event("input")
        );

        storeInventorySearch.focus();

      }

    }
  );

}
