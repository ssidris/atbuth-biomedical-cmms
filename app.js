// ==========================================
// ATBUTH BIOMEDICAL CMMS
// Supabase Mobile Web Application
// ==========================================

// Supabase Project URL
const SUPABASE_URL =
  "https://vfnfbhrgmptgleytmeyq.supabase.co";

// Supabase Publishable Key
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_O058LKa9owIjewDHfC84Yg_lMVdXD95";


// ==========================================
// CREATE SUPABASE CONNECTION
// ==========================================

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
      "Error loading table:",
      table,
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
// LOAD FORM DATA
// ==========================================

async function loadFormData() {

  // Equipment

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


  // Engineers

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


  // Maintenance Type

  await loadLookup(
    "tblMaintenanceType",
    "MaintenanceTypeID",
    "MaintenanceType",
    "maintenanceTypeId",
    "Select maintenance type"
  );


  // Part Status

  await loadLookup(
    "tblPartRequestedStatus",
    "PartStatusID",
    "PartStatusName",
    "partStatusId",
    "Select part status"
  );


  // Equipment Status

  await loadLookup(
    "tblEquipmentStatus",
    "StatusID",
    "StatusName",
    "statusId",
    "Select equipment status"
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


  await loadFormData();

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


// ==========================================
// LOGOUT
// ==========================================

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


    // ======================================
    // PREPARE MAINTENANCE REPORT
    // ======================================

    const payload = {

      // Correct column name:
      // JobOrderNumber
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

  document
    .getElementById(
      "partStatusId"
    )
    .selectedOptions[0]
    .textContent
    .trim(),


PartStatusID:

  document
    .getElementById(
      "partStatusId"
    )
    .value

    ? Number(

        document
          .getElementById(
            "partStatusId"
          )
          .value

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


    // ======================================
    // INSERT REPORT
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
