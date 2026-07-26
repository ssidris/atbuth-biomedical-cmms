// ==========================================
// ATBUTH BIOMEDICAL CMMS
// COMPLETE APP.JS
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
// GENERAL LOOKUP FUNCTION
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
// LOAD MAINTENANCE REPORT FORM DATA
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
      "but no matching profile was found in tblUsers."

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
// EQUIPMENT REGISTRATION ELEMENTS
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

  // ----------------------------------------
  // DEPARTMENT
  // ----------------------------------------

  try {

    if (newDepartmentSelect) {

      await loadLookup(

        "tblDepartment",

        "DepartmentID",

        "DepartmentName",

        "newDepartmentId",

        "Select department"

      );

    }

  }

  catch (error) {

    console.error(
      "Department registration dropdown error:",
      error
    );

  }


  // ----------------------------------------
  // EQUIPMENT CATEGORY
  // ----------------------------------------

  try {

    if (newCategorySelect) {

      await loadLookup(

        "tblEquipmentcategory",

        "CategoryID",

        "CategoryName",

        "newCategoryId",

        "Select category"

      );

    }

  }

  catch (error) {

    console.error(
      "Category registration dropdown error:",
      error
    );

  }


  // ----------------------------------------
  // EQUIPMENT STATUS
  // ----------------------------------------

  try {

    if (newStatusSelect) {

      await loadLookup(

        "tblEquipmentStatus",

        "StatusID",

        "StatusName",

        "newStatusId",

        "Select status"

      );

    }

  }

  catch (error) {

    console.error(
      "Status registration dropdown error:",
      error
    );

  }

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


  // Load maintenance report dropdowns

  try {

    await loadFormData();

  }

  catch (error) {

    console.error(
      "Maintenance form loading error:",
      error
    );

  }


  // Load equipment registration dropdowns
  // AFTER successful authentication

  try {

    await loadEquipmentRegistrationDropdowns();

  }

  catch (error) {

    console.error(
      "Equipment registration loading error:",
      error
    );

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

}


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

if (maintenanceForm) {

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


      if (departmentInput) {

        departmentInput.value = "";

      }

    }

  );

}


// ==========================================
// EQUIPMENT REGISTRATION
// ==========================================

if (equipmentRegistrationForm) {

  equipmentRegistrationForm.addEventListener(

    "submit",

    async function(event) {

      event.preventDefault();


      equipmentRegistrationMessage.textContent =

        "Registering equipment...";


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


      const {
        error
      } = await client

        .from(
          "tblEquipment"
        )

        .insert(
          equipmentData
        );


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


      equipmentRegistrationMessage.textContent =

        "Equipment registered successfully.";


      equipmentRegistrationForm.reset();


      // Refresh equipment dropdown

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

      catch (error) {

        console.error(

          "Equipment dropdown refresh error:",

          error

        );

      }

    }

  );

}


// ==========================================
// MAINTENANCE REPORT HISTORY
// ==========================================

const reportsTableBody =
  document.getElementById(
    "reportsTableBody"
  );

const reportsLoading =
  document.getElementById(
    "reportsLoading"
  );

const reportsMessage =
  document.getElementById(
    "reportsMessage"
  );

const reportSearch =
  document.getElementById(
    "reportSearch"
  );


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


  const {
    data: reports,
    error
  } = await client

    .from(
      "tblMaintenanceReport"
    )

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


    if (!error) {

      departments =
        data || [];

    }

  }


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


  reports.forEach(

    report => {

      const row =
        document.createElement(
          "tr"
        );


      const reportDate =

        report.ReportDate

          ? new Date(

              report.ReportDate

            ).toLocaleDateString()

          : "";


      const equipmentName =

        report.tblEquipment
          ?.EquipmentName

          || "Unknown";


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


      const engineerName =

        report.tblEngineers

          ? `${

              report.tblEngineers
                .FirstName || ""

            } ${

              report.tblEngineers
                .LastName || ""

            }`.trim()

          : "Unknown";


      const maintenanceType =

        report.tblMaintenanceType
          ?.MaintenanceType

          || "Unknown";


      const statusName =

        report.tblEquipmentStatus
          ?.StatusName

          || "Unknown";


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
                      .FirstName || ""

                  } ${

                    report.tblEngineers
                      .LastName || ""

                  }`

                : "";


            const maintenanceType =

              report.tblMaintenanceType
                ?.MaintenanceType

                || "";


            const searchableText =

              (

                equipmentName +

                " " +

                engineerName +

                " " +

                maintenanceType +

                " " +

                (report.FaultReported || "") +

                " " +

                (report.ActionTaken || "") +

                " " +

                (report.Remarks || "")

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
// MY REPORTS BUTTON
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
// INITIALIZE APPLICATION
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
