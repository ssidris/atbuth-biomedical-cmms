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

      return (

        `${row.FirstName || ""} ` +

        `${row.LastName || ""}`

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

    // --------------------------------------
    // GET DEPARTMENT ID
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

      throw new Error(

        "Unable to load equipment history: " +

        historyError.message

      );

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


      // ======================================
      // GET FORM VALUES
      // ======================================

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


      // ======================================
      // VALIDATE REQUIRED FIELDS
      // ======================================

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


      // ======================================
      // CHECK FOR DUPLICATE BME NUMBER
      // ======================================

      const {

        data: existingEquipment,

        error: checkError

      } = await client

        .from("tblEquipment")

        .select(
          "EquipmentID"
        )

        .eq(
          "BMENumber",
          bmeNumber
        )

        .maybeSingle();


      if (checkError) {

        console.error(
          "BME Number check error:",
          checkError
        );


        if (message) {

          message.textContent =

            "Unable to check BME Number: " +

            checkError.message;

        }


        return;

      }


      if (existingEquipment) {

        if (message) {

          message.textContent =

            "This BME Number already exists. Please enter a unique BME Number.";

        }


        return;

      }


      // ======================================
      // PREPARE EQUIPMENT DATA
      // ======================================

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


      // ======================================
      // INSERT NEW EQUIPMENT
      // ======================================

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

        .select()
        .single();


      // ======================================
      // HANDLE REGISTRATION ERROR
      // ======================================

      if (error) {

        console.error(
          "Equipment registration error:",
          error
        );


        if (message) {

          message.textContent =

            "Error registering equipment: " +

            error.message;

        }


        return;

      }


      // ======================================
      // REGISTRATION SUCCESS
      // ======================================

      console.log(
        "Equipment registered successfully:",
        data
      );


      if (message) {

        message.textContent =

          "Equipment registered successfully.";

      }


      // ======================================
      // RESET FORM
      // ======================================

      equipmentRegistrationForm.reset();


      // ======================================
      // REFRESH EQUIPMENT DROPDOWNS
      // ======================================

      await loadMaintenanceFormData();

      await loadEquipmentHistoryDropdown();


      // ======================================
      // CLEAR SUCCESS MESSAGE AFTER 5 SECONDS
      // ======================================

      setTimeout(

        function() {

          if (message) {

            message.textContent = "";

          }

        },

        5000

      );

    }

  );

}


// ==========================================
// MENU NAVIGATION
// ==========================================

document
  .querySelectorAll(".menu button")
  .forEach(

    button => {

      button.addEventListener(

        "click",

        function() {

          // --------------------------------
          // HIDE ALL APPLICATION SECTIONS
          // --------------------------------

          document
            .querySelectorAll(".app-section")
            .forEach(

              section => {

                section.classList.add(
                  "hidden"
                );

              }

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

          if (selectedSection) {

            selectedSection.classList.remove(
              "hidden"
            );

          }


          // --------------------------------
          // LOAD MAINTENANCE REPORTS
          // --------------------------------

          if (

            button.dataset.section ===
            "reportsSection"

          ) {

            loadMaintenanceReports();

          }


          // --------------------------------
          // REFRESH REGISTRATION DROPDOWNS
          // --------------------------------

          if (

            button.dataset.section ===
            "equipmentRegistrationSection"

          ) {

            loadEquipmentRegistrationDropdowns();

          }


          // --------------------------------
          // REFRESH HISTORY DROPDOWN
          // --------------------------------

          if (

            button.dataset.section ===
            "equipmentHistorySection"

          ) {

            loadEquipmentHistoryDropdown();

          }

        }

      );

    }

  );


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


      // ====================================
      // CHECK AUTHENTICATION
      // ====================================

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


      // ====================================
      // GET FORM VALUES
      // ====================================

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


      // ====================================
      // GET PART STATUS
      // ====================================

      let partRequestedStatus = null;


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


      // ====================================
      // VALIDATE REQUIRED FIELDS
      // ====================================

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
      // PREPARE MAINTENANCE REPORT
      // ====================================

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
          ).value ||

          null,


        Diagnosis:

          document.getElementById(
            "diagnosis"
          ).value ||

          null,


        ActionTaken:

          document.getElementById(
            "actionTaken"
          ).value ||

          null,


        PartUsed:

          document.getElementById(
            "partUsed"
          ).value ||

          null,


        RequiredPart:

          document.getElementById(
            "requiredPart"
          ).value ||

          null,


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
          ).value ||

          null

      };


      // ====================================
      // INSERT MAINTENANCE REPORT
      // ====================================

      const {

        error

      } = await client

        .from(
          "tblMaintenanceReport"
        )

        .insert(
          payload
        );


      // ====================================
      // HANDLE ERROR
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

      if (maintenanceMessage) {

        maintenanceMessage.textContent =

          "Maintenance report submitted successfully.";

      }


      // ====================================
      // RESET FORM
      // ====================================

      maintenanceForm.reset();


      if (departmentInput) {

        departmentInput.value = "";

      }


      // ====================================
      // REFRESH REPORTS
      // ====================================

      await loadMaintenanceReports();


      // ====================================
      // CLEAR MESSAGE
      // ====================================

      setTimeout(

        function() {

          if (maintenanceMessage) {

            maintenanceMessage.textContent = "";

          }

        },

        5000

      );

    }

  );

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


      // ====================================
      // SUPABASE LOGIN
      // ====================================

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


      // ====================================
      // LOAD APPLICATION
      // ====================================

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


        await client.auth.signOut();


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
  // SHOW APPLICATION
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
  // LOAD MAINTENANCE DROPDOWNS
  // ----------------------------------------

  await loadMaintenanceFormData();


  // ----------------------------------------
  // LOAD REGISTRATION DROPDOWNS
  // ----------------------------------------

  await loadEquipmentRegistrationDropdowns();


  // ----------------------------------------
  // LOAD HISTORY DROPDOWN
  // ----------------------------------------

  await loadEquipmentHistoryDropdown();


  // ----------------------------------------
  // LOAD REPORTS
  // ----------------------------------------

  await loadMaintenanceReports();

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


    if (error) {

      console.error(
        "Session error:",
        error
      );


      return;

    }


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
