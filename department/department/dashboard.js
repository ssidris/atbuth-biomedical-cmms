const SUPABASE_URL =
  "https://vfnfbhrgmptgleytmeyq.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_O058LKa9owIjewDHfC84Yg_lMVdXD95";

const client = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


// ==========================================
// DASHBOARD ELEMENTS
// ==========================================

const welcomeText =
  document.getElementById("welcomeText");

const departmentName =
  document.getElementById("departmentName");

const equipmentLoading =
  document.getElementById("equipmentLoading");

const equipmentList =
  document.getElementById("equipmentList");

const departmentLogoutBtn =
  document.getElementById(
    "departmentLogoutBtn"
  );


// ==========================================
// LOAD DEPARTMENT DASHBOARD
// ==========================================

async function loadDepartmentDashboard() {

  try {

    // ========================================
    // CHECK SUPABASE SESSION
    // ========================================

    const {
      data: sessionData,
      error: sessionError
    } = await client.auth.getSession();


    if (sessionError) {
      throw sessionError;
    }


    const session =
      sessionData.session;


    if (!session) {

      window.location.href =
        "../index.html";

      return;
    }


    // ========================================
    // GET LOGGED-IN USER
    // ========================================

    const authUser =
      session.user;


    // ========================================
    // GET DEPARTMENT PROFILE
    // ========================================

    const {
      data: departmentUser,
      error: userError
    } =
      await client
        .from("tblUsers")
        .select(
          '"UserID", "Username", "Full name", "UserRole", "Status", "AuthUserID", "DepartmentID", "HospitalID"'
        )
        .eq(
          "AuthUserID",
          authUser.id
        )
        .eq(
          "UserRole",
          "Department"
        )
        .eq(
          "Status",
          "Active"
        )
        .maybeSingle();


    if (userError) {
      throw userError;
    }


    if (!departmentUser) {

      await client.auth.signOut();

      window.location.href =
        "../index.html";

      return;
    }


    // ========================================
    // DISPLAY DEPARTMENT INFORMATION
    // ========================================

    const fullName =
      departmentUser["Full name"];

    const departmentId =
      departmentUser.DepartmentID;
    


    welcomeText.textContent =
      "Welcome, " + fullName;


    // ========================================
    // GET DEPARTMENT NAME
    // ========================================

    const {
      data: department,
      error: departmentError
    } =
      await client
        .from("tblDepartment")
        .select(
          '"DepartmentID", "DepartmentName"'
        )
        .eq(
          "DepartmentID",
          departmentId
        )
        .maybeSingle();


    if (departmentError) {
      throw departmentError;
    }


    if (department) {

      departmentName.textContent =
        department.DepartmentName;

    } else {

      departmentName.textContent =
        "Department not found";

    }

// ========================================
// LOAD DEPARTMENT EQUIPMENT
// ========================================

const {
  data: equipment,
  error: equipmentError
} =
  await client
    .from("tblEquipment")
    .select(
      "EquipmentID, BMENumber, EquipmentName, Manufacturer, Model, SerialNumber, Location, StatusID"
    )
    .eq(
      "DepartmentID",
      departmentId
    )
    .eq(
      "HospitalID",
      departmentUser.HospitalID
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


// ========================================
// DISPLAY EQUIPMENT
// ========================================

if (!equipment || equipment.length === 0) {

  equipmentLoading.textContent =
    "No equipment assigned to this department.";

  equipmentList.innerHTML =
    `
      <p style="color:#64748b;">
        No biomedical equipment was found
        for this department.
      </p>
    `;

} else {

  equipmentLoading.textContent =
    equipment.length +
    " equipment item(s) found.";

  equipmentList.innerHTML =
    equipment.map(function(item) {

      return `
        <div
          style="
            background:#f8fafc;
            border:1px solid #e2e8f0;
            border-radius:8px;
            padding:15px;
            margin-bottom:10px;
          "
        >

          <strong>
            ${item.BMENumber || "No BME Number"}
          </strong>

          <div>
            ${item.EquipmentName || "Unnamed Equipment"}
          </div>

          <div style="color:#64748b;">
            Manufacturer:
            ${item.Manufacturer || "N/A"}
          </div>

          <div style="color:#64748b;">
            Model:
            ${item.Model || "N/A"}
          </div>

          <div style="color:#64748b;">
            Serial Number:
            ${item.SerialNumber || "N/A"}
          </div>

          <div style="color:#64748b;">
            Location:
            ${item.Location || "N/A"}
          </div>

        </div>
      `;

    }).join("");

}
    


  } catch (error) {

    console.error(
      "Dashboard loading error:",
      error
    );


    departmentName.textContent =
      "Unable to load department";

    equipmentLoading.textContent =
      "Unable to load dashboard information.";


  }

}


// ==========================================
// LOGOUT
// ==========================================

if (departmentLogoutBtn) {

  departmentLogoutBtn.addEventListener(
    "click",
    async function () {

      await client.auth.signOut();

      sessionStorage.removeItem(
        "departmentUser"
      );

      window.location.href =
        "../index.html";

    }
  );

}


// ==========================================
// START DASHBOARD
// ==========================================

loadDepartmentDashboard();

// ==========================================
// DEPARTMENT COMPLAINT SUBMISSION
// ==========================================

const departmentComplaintForm =
  document.getElementById(
    "departmentComplaintForm"
  );

const complaintEquipment =
  document.getElementById(
    "complaintEquipment"
  );

const complaintFault =
  document.getElementById(
    "complaintFault"
  );

const submitComplaintBtn =
  document.getElementById(
    "submitComplaintBtn"
  );

const complaintMessage =
  document.getElementById(
    "complaintMessage"
  );


// ==========================================
// LOAD EQUIPMENT INTO COMPLAINT DROPDOWN
// ==========================================

async function loadComplaintEquipment() {

  try {

    const {
      data: sessionData,
      error: sessionError
    } = await client.auth.getSession();


    if (sessionError) {
      throw sessionError;
    }


    const session =
      sessionData.session;


    if (!session) {
      return;
    }


    const {
      data: departmentUser,
      error: userError
    } =
      await client
        .from("tblUsers")
        .select(
          '"DepartmentID", "HospitalID", "UserRole", "Status"'
        )
        .eq(
          "AuthUserID",
          session.user.id
        )
        .eq(
          "UserRole",
          "Department"
        )
        .eq(
          "Status",
          "Active"
        )
        .maybeSingle();


    if (userError) {
      throw userError;
    }


    if (!departmentUser) {
      throw new Error(
        "Department profile not found."
      );
    }


    const {
      data: equipment,
      error: equipmentError
    } =
      await client
        .from("tblEquipment")
        .select(
          '"EquipmentID", "BMENumber", "EquipmentName", "DepartmentID"'
        )
        .eq(
          "DepartmentID",
          departmentUser.DepartmentID
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


    complaintEquipment.innerHTML =
      `
        <option value="">
          Select equipment
        </option>
      `;


    (equipment || []).forEach(
      function (item) {

        const option =
          document.createElement("option");

        option.value =
          item.EquipmentID;

        option.textContent =
          item.BMENumber +
          " — " +
          item.EquipmentName;

        complaintEquipment.appendChild(
          option
        );

      }
    );


  } catch (error) {

    console.error(
      "Complaint equipment loading error:",
      error
    );

    complaintEquipment.innerHTML =
      `
        <option value="">
          Unable to load equipment
        </option>
      `;

  }

}


// ==========================================
// SUBMIT COMPLAINT
// ==========================================

if (departmentComplaintForm) {

  departmentComplaintForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      const equipmentId =
        complaintEquipment.value;

      const fault =
        complaintFault.value.trim();


      if (!equipmentId || !fault) {

        complaintMessage.textContent =
          "Please select equipment and describe the fault.";

        complaintMessage.style.color =
          "red";

        return;
      }


      submitComplaintBtn.disabled =
        true;

      complaintMessage.textContent =
        "Submitting fault report...";

      complaintMessage.style.color =
        "#64748b";


      try {

        // ========================================
        // GET CURRENT AUTHENTICATED USER
        // ========================================

        const {
          data: sessionData,
          error: sessionError
        } = await client.auth.getSession();


        if (sessionError) {
          throw sessionError;
        }


        const session =
          sessionData.session;


        if (!session) {

          throw new Error(
            "Your session has expired. Please sign in again."
          );

        }


        // ========================================
        // GET DEPARTMENT USER
        // ========================================

        const {
          data: departmentUser,
          error: userError
        } =
          await client
            .from("tblUsers")
            .select(
              '"UserID", "DepartmentID", "HospitalID", "UserRole", "Status"'
            )
            .eq(
              "AuthUserID",
              session.user.id
            )
            .eq(
              "UserRole",
              "Department"
            )
            .eq(
              "Status",
              "Active"
            )
            .maybeSingle();


        if (userError) {
          throw userError;
        }


        if (!departmentUser) {

          throw new Error(
            "Department account could not be identified."
          );

        }


        // ========================================
        // VERIFY SELECTED EQUIPMENT
        // ========================================

        const {
          data: selectedEquipment,
          error: equipmentError
        } =
          await client
            .from("tblEquipment")
            .select(
              '"EquipmentID", "BMENumber", "EquipmentName", "DepartmentID"'
            )
            .eq(
              "EquipmentID",
              Number(equipmentId)
            )
            .eq(
              "DepartmentID",
              departmentUser.DepartmentID
            )
            .maybeSingle();


        if (equipmentError) {
          throw equipmentError;
        }


        if (!selectedEquipment) {

          throw new Error(
            "The selected equipment does not belong to your department."
          );

        }


        // ========================================
        // GET CURRENT EQUIPMENT STATUS
        // ========================================

        const {
          data: equipmentStatus,
          error: statusError
        } =
          await client
            .from("tblEquipment")
            .select(
              '"StatusID"'
            )
            .eq(
              "EquipmentID",
              Number(equipmentId)
            )
            .maybeSingle();


        if (statusError) {
          throw statusError;
        }


        // ========================================
        // CREATE MAINTENANCE REPORT
        // ========================================

        const {
          data: maintenanceReport,
          error: maintenanceError
        } =
          await client
            .from("tblMaintenanceReport")
.insert([
  {

    JobOrderNumber:
      Date.now(),

    ReportDate:
      new Date()
        .toISOString()
        .split("T")[0],

    EquipmentID:
      Number(equipmentId),

    EngineerID:
      null,

    MaintenanceTypeID:
      1,

    FaultReported:
      fault,

    Diagnosis:
      null,

    ActionTaken:
      null,

    PartUsed:
      null,

    RequiredPart:
      null,

    QuantityRequired:
      null,

    PartRequestedStatus:
      null,

    // Equipment's current physical status
    StatusID:
      equipmentStatus?.StatusID ||
      null,

    // Maintenance job workflow status
    MaintenanceStatus:
      "Submitted",

    Remarks:
      "Reported by " +
      departmentUser.UserID +
      " through Department Portal.",

    PartStatusID:
      null,

    HospitalID:
      departmentUser.HospitalID

  }
])
.select()
.single();


if (maintenanceError) {
  throw maintenanceError;
}
            

// ==========================================
// CREATE CMMS NOTIFICATION
// ==========================================

const { error: notificationError } = await client
  .from("tblNotifications")
  .insert({
    NotificationType: "Maintenance",
    Title: "New Maintenance Report",
    Message:
      "A new fault report has been submitted for " +
      selectedEquipment.BMENumber +
      " — " +
      selectedEquipment.EquipmentName +
      ".",
    MaintenanceID:
      maintenanceReport.MaintenanceID,
    HospitalID:
      departmentUser.HospitalID,
    IsRead: false,
    CreatedAt: new Date().toISOString(),
    ReadAt: null
  });

if (notificationError) {
  console.error(
  "Notification creation error:",
  notificationError
);

if (notificationError) {
  throw notificationError;
}
}
        // ========================================
        // SUCCESS
        // ========================================

        complaintMessage.textContent =
          "Fault report submitted successfully.";

        complaintMessage.style.color =
          "green";


        complaintFault.value = "";

        complaintEquipment.value = "";


        console.log(
          "Maintenance report created:",
          maintenanceReport
        );


      } catch (error) {

        console.error(
          "Complaint submission error:",
          error
        );


        complaintMessage.textContent =
          error.message ||
          "Unable to submit fault report.";

        complaintMessage.style.color =
          "red";


      } finally {

        submitComplaintBtn.disabled =
          false;

      }

    }
  );

}


// ==========================================
// START COMPLAINT EQUIPMENT LOADING
// ==========================================

loadComplaintEquipment();
loadDepartmentMaintenanceRequests();
// ==========================================
// LOAD MY MAINTENANCE REQUESTS
// ==========================================

async function loadDepartmentMaintenanceRequests() {

  const loading =
    document.getElementById("maintenanceRequestsLoading");

  const list =
    document.getElementById("maintenanceRequestsList");

  if (!loading || !list) {
    return;
  }

  loading.textContent =
    "Loading maintenance requests...";

  list.innerHTML = "";

  try {

    // ------------------------------------------
    // GET LOGGED-IN DEPARTMENT
    // ------------------------------------------

    const departmentUser =
      JSON.parse(
        sessionStorage.getItem("departmentUser")
      );

    if (!departmentUser) {
      loading.textContent =
        "Department session not found.";
      return;
    }


    const departmentID =
      departmentUser.DepartmentID;

    const hospitalID =
      departmentUser.HospitalID;


    // ------------------------------------------
    // GET EQUIPMENT BELONGING TO THIS DEPARTMENT
    // ------------------------------------------

    const {
      data: departmentEquipment,
      error: equipmentError
    } = await client
      .from("tblEquipment")
      .select(
        "EquipmentID, BMENumber, EquipmentName, Manufacturer, Model"
      )
      .eq("DepartmentID", departmentID)
      .eq("HospitalID", hospitalID);


    if (equipmentError) {
      throw equipmentError;
    }


    if (
      !departmentEquipment ||
      departmentEquipment.length === 0
    ) {

      loading.textContent =
        "No equipment found for this department.";

      return;
    }


    // ------------------------------------------
    // GET EQUIPMENT IDs
    // ------------------------------------------

    const equipmentIDs =
      departmentEquipment.map(
        equipment => equipment.EquipmentID
      );


    // ------------------------------------------
    // GET MAINTENANCE REPORTS
    // ------------------------------------------

    const {
      data: maintenanceReports,
      error: maintenanceError
    } = await client
      .from("tblMaintenanceReport")
      .select(`
        MaintenanceID,
        JobOrderNumber,
        ReportDate,
        EquipmentID,
        FaultReported,
        MaintenanceStatus,
        StatusID,
        Diagnosis,
        ActionTaken,
        RequiredPart,
        PartUsed,
        Remarks
      `)
      .in("EquipmentID", equipmentIDs)
      .eq("HospitalID", hospitalID)
      .order("ReportDate", {
        ascending: false
      });


    if (maintenanceError) {
      throw maintenanceError;
    }


    loading.style.display = "none";


    // ------------------------------------------
    // NO REPORTS
    // ------------------------------------------

    if (
      !maintenanceReports ||
      maintenanceReports.length === 0
    ) {

      list.innerHTML = `
        <div
          style="
            padding:20px;
            text-align:center;
            color:#64748b;
            background:#f8fafc;
            border-radius:8px;
          "
        >
          No maintenance requests submitted yet.
        </div>
      `;

      return;
    }


    // ------------------------------------------
    // DISPLAY REPORTS
    // ------------------------------------------

    maintenanceReports.forEach(report => {

      const equipment =
        departmentEquipment.find(
          item =>
            item.EquipmentID === report.EquipmentID
        );


      const status =
        report.MaintenanceStatus ||
        "Submitted";


      const card =
        document.createElement("div");


      card.style.cssText = `
        border:1px solid #e2e8f0;
        border-radius:10px;
        padding:16px;
        margin-bottom:15px;
        background:#f8fafc;
      `;


      card.innerHTML = `

        <div
          style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            gap:10px;
            flex-wrap:wrap;
            margin-bottom:12px;
          "
        >

          <strong
            style="
              font-size:16px;
              color:#0f172a;
            "
          >
            Job Order:
            ${report.JobOrderNumber || "N/A"}
          </strong>

          <div
  style="
    width:100%;
    margin-top:10px;
    padding:12px;
    background:#f8fafc;
    border:1px solid #e2e8f0;
    border-radius:8px;
    box-sizing:border-box;
  "
>

  <div
    style="
      font-size:13px;
      font-weight:600;
      margin-bottom:10px;
      color:#334155;
    "
  >
    Maintenance Progress
  </div>


  <div
    style="
      display:flex;
      flex-wrap:wrap;
      gap:6px;
      align-items:center;
    "
  >

    <span
      style="
        padding:6px 9px;
        border-radius:15px;
        background:${
          status === "Submitted"
            ? "#166534"
            : "#dcfce7"
        };
        color:${
          status === "Submitted"
            ? "white"
            : "#166534"
        };
        font-size:12px;
        font-weight:600;
      "
    >
      ✓ Submitted
    </span>


    <span style="color:#94a3b8;">
      →
    </span>


    <span
      style="
        padding:6px 9px;
        border-radius:15px;
        background:${
          status === "Acknowledged"
            ? "#166534"
            : "#e2e8f0"
        };
        color:${
          status === "Acknowledged"
            ? "white"
            : "#64748b"
        };
        font-size:12px;
        font-weight:600;
      "
    >
      ${
        status === "Acknowledged"
          ? "✓ "
          : ""
      }Acknowledged
    </span>


    <span style="color:#94a3b8;">
      →
    </span>


    <span
      style="
        padding:6px 9px;
        border-radius:15px;
        background:${
          status === "Under Maintenance"
            ? "#166534"
            : "#e2e8f0"
        };
        color:${
          status === "Under Maintenance"
            ? "white"
            : "#64748b"
        };
        font-size:12px;
        font-weight:600;
      "
    >
      ${
        status === "Under Maintenance"
          ? "✓ "
          : ""
      }Under Maintenance
    </span>


    <span style="color:#94a3b8;">
      →
    </span>


    <span
      style="
        padding:6px 9px;
        border-radius:15px;
        background:${
          status === "Awaiting Parts"
            ? "#166534"
            : "#e2e8f0"
        };
        color:${
          status === "Awaiting Parts"
            ? "white"
            : "#64748b"
        };
        font-size:12px;
        font-weight:600;
      "
    >
      ${
        status === "Awaiting Parts"
          ? "✓ "
          : ""
      }Awaiting Parts
    </span>


    <span style="color:#94a3b8;">
      →
    </span>


    <span
      style="
        padding:6px 9px;
        border-radius:15px;
        background:${
          status === "Completed"
            ? "#166534"
            : "#e2e8f0"
        };
        color:${
          status === "Completed"
            ? "white"
            : "#64748b"
        };
        font-size:12px;
        font-weight:600;
      "
    >
      ${
        status === "Completed"
          ? "✓ "
          : ""
      }Completed
    </span>

  </div>

</div>

        </div>


        <p>
          <strong>Date:</strong>
          ${
            report.ReportDate
              ? new Date(
                  report.ReportDate
                ).toLocaleDateString()
              : "N/A"
          }
        </p>


        <p>
          <strong>Equipment:</strong>
          ${
            equipment
              ? equipment.BMENumber +
                " — " +
                equipment.EquipmentName
              : "N/A"
          }
        </p>


        <p>
  <strong>Fault Reported:</strong>
  ${report.FaultReported || "N/A"}
</p>

<button
  type="button"
  onclick="printDepartmentMaintenanceReport(${report.MaintenanceID})"
  style="
    width:100%;
    margin-top:12px;
    padding:11px;
    border:none;
    border-radius:8px;
    background:#166534;
    color:white;
    font-size:15px;
    font-weight:600;
    cursor:pointer;
  "
>
  🖨️ Print Maintenance Report
</button>


        ${
          report.Diagnosis
            ? `
              <p>
                <strong>Diagnosis:</strong>
                ${report.Diagnosis}
              </p>
            `
            : ""
        }


        ${
          report.ActionTaken
            ? `
              <p>
                <strong>Action Taken:</strong>
                ${report.ActionTaken}
              </p>
            `
            : ""
        }


        ${
          report.RequiredPart
            ? `
              <p>
                <strong>Required Part:</strong>
                ${report.RequiredPart}
              </p>
            `
            : ""
        }

      `;


      list.appendChild(card);

    });

  } catch (error) {

    console.error(
      "Error loading maintenance requests:",
      error
    );

    loading.textContent =
      "Unable to load maintenance requests.";

    list.innerHTML = `
      <p
        style="
          color:#b91c1c;
        "
      >
        Error loading maintenance requests.
        Please try again.
      </p>
    `;

  }

}

// ==========================================
// PRINT DEPARTMENT MAINTENANCE REPORT
// ==========================================

async function printDepartmentMaintenanceReport(
  maintenanceID
) {

  try {

    // ------------------------------------------
    // GET LOGGED-IN DEPARTMENT
    // ------------------------------------------

    const departmentUser =
      JSON.parse(
        sessionStorage.getItem("departmentUser")
      );

    if (!departmentUser) {
      alert("Department session not found.");
      return;
    }


    const hospitalID =
      departmentUser.HospitalID;

    const departmentID =
      departmentUser.DepartmentID;


    // ------------------------------------------
    // GET MAINTENANCE REPORT
    // ------------------------------------------

    const {
      data: report,
      error: reportError
    } = await client
      .from("tblMaintenanceReport")
      .select(`
        MaintenanceID,
        JobOrderNumber,
        ReportDate,
        EquipmentID,
        FaultReported,
        MaintenanceStatus,
        Diagnosis,
        ActionTaken,
        RequiredPart,
        PartUsed,
        Remarks,
        HospitalID
      `)
      .eq("MaintenanceID", maintenanceID)
      .eq("HospitalID", hospitalID)
      .single();


    if (reportError) {
      throw reportError;
    }


    if (!report) {
      alert("Maintenance report not found.");
      return;
    }


    // ------------------------------------------
    // GET EQUIPMENT
    // ------------------------------------------

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
        DepartmentID,
        HospitalID
      `)
      .eq("EquipmentID", report.EquipmentID)
      .eq("DepartmentID", departmentID)
      .eq("HospitalID", hospitalID)
      .single();


    if (equipmentError) {
      throw equipmentError;
    }


    if (!equipment) {
      alert(
        "This equipment does not belong to your department."
      );
      return;
    }


    // ------------------------------------------
    // OPEN PRINT WINDOW
    // ------------------------------------------

    const printWindow =
      window.open(
        "",
        "_blank",
        "width=900,height=700"
      );


    if (!printWindow) {
      alert(
        "Please allow pop-ups in your browser to print the report."
      );
      return;
    }


    // ------------------------------------------
    // PRINT DOCUMENT
    // ------------------------------------------

    printWindow.document.write(`
      <!DOCTYPE html>

      <html>

      <head>

        <title>
          Maintenance Report -
          ${report.JobOrderNumber || ""}
        </title>

        <style>

          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            color: #111827;
          }

          .header {
            text-align: center;
            border-bottom: 2px solid #111827;
            padding-bottom: 15px;
            margin-bottom: 25px;
          }

          .header h1 {
            margin: 0;
            font-size: 24px;
          }

          .header h2 {
            margin: 8px 0;
            font-size: 18px;
          }

          .header p {
            margin: 5px 0;
            color: #475569;
          }

          .section {
            margin-top: 25px;
          }

          .section-title {
            background: #f1f5f9;
            padding: 10px;
            font-weight: bold;
            border-left: 4px solid #166534;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }

          td {
            border: 1px solid #cbd5e1;
            padding: 10px;
            vertical-align: top;
          }

          td:first-child {
            width: 30%;
            font-weight: bold;
          }

          .status {
            font-weight: bold;
          }

          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
          }

        </style>

      </head>


      <body>


        <div class="header">

          <h1>
            ATBUTH
          </h1>

          <h2>
            Biomedical Equipment Maintenance Report
          </h2>

          <p>
            Department Maintenance Request
          </p>

        </div>


        <div class="section">

          <div class="section-title">
            Maintenance Request Information
          </div>

          <table>

            <tr>
              <td>Job Order Number</td>
              <td>
                ${report.JobOrderNumber || "N/A"}
              </td>
            </tr>

            <tr>
              <td>Report Date</td>
              <td>
                ${
                  report.ReportDate
                    ? new Date(
                        report.ReportDate
                      ).toLocaleDateString()
                    : "N/A"
                }
              </td>
            </tr>

            <tr>
              <td>Maintenance Status</td>
              <td class="status">
                ${report.MaintenanceStatus || "Submitted"}
              </td>
            </tr>

          </table>

        </div>


        <div class="section">

          <div class="section-title">
            Department Information
          </div>

          <table>

            <tr>
              <td>Department</td>
              <td>
                ${departmentUser.FullName || departmentUser.Username || "N/A"}
              </td>
            </tr>

            <tr>
              <td>Hospital</td>
              <td>
                ATBUTH
              </td>
            </tr>

          </table>

        </div>


        <div class="section">

          <div class="section-title">
            Equipment Information
          </div>

          <table>

            <tr>
              <td>BME Number</td>
              <td>
                ${equipment.BMENumber || "N/A"}
              </td>
            </tr>

            <tr>
              <td>Equipment Name</td>
              <td>
                ${equipment.EquipmentName || "N/A"}
              </td>
            </tr>

            <tr>
              <td>Manufacturer</td>
              <td>
                ${equipment.Manufacturer || "N/A"}
              </td>
            </tr>

            <tr>
              <td>Model</td>
              <td>
                ${equipment.Model || "N/A"}
              </td>
            </tr>

            <tr>
              <td>Serial Number</td>
              <td>
                ${equipment.SerialNumber || "N/A"}
              </td>
            </tr>

            <tr>
              <td>Location</td>
              <td>
                ${equipment.Location || "N/A"}
              </td>
            </tr>

          </table>

        </div>


        <div class="section">

          <div class="section-title">
            Fault / Complaint
          </div>

          <table>

            <tr>
              <td>Fault Reported</td>
              <td>
                ${report.FaultReported || "N/A"}
              </td>
            </tr>

          </table>

        </div>


        ${
          report.Diagnosis ||
          report.ActionTaken ||
          report.RequiredPart ||
          report.PartUsed
            ? `

              <div class="section">

                <div class="section-title">
                  Maintenance Details
                </div>

                <table>

                  ${
                    report.Diagnosis
                      ? `
                        <tr>
                          <td>Diagnosis</td>
                          <td>
                            ${report.Diagnosis}
                          </td>
                        </tr>
                      `
                      : ""
                  }

                  ${
                    report.ActionTaken
                      ? `
                        <tr>
                          <td>Action Taken</td>
                          <td>
                            ${report.ActionTaken}
                          </td>
                        </tr>
                      `
                      : ""
                  }

                  ${
                    report.RequiredPart
                      ? `
                        <tr>
                          <td>Required Part</td>
                          <td>
                            ${report.RequiredPart}
                          </td>
                        </tr>
                      `
                      : ""
                  }

                  ${
                    report.PartUsed
                      ? `
                        <tr>
                          <td>Part Used</td>
                          <td>
                            ${report.PartUsed}
                          </td>
                        </tr>
                      `
                      : ""
                  }

                </table>

              </div>

            `
            : ""
        }


        ${
          report.Remarks
            ? `

              <div class="section">

                <div class="section-title">
                  Remarks
                </div>

                <table>

                  <tr>
                    <td>Remarks</td>
                    <td>
                      ${report.Remarks}
                    </td>
                  </tr>

                </table>

              </div>

            `
            : ""
        }


        <div class="footer">

          <p>
            ATBUTH Biomedical Equipment Maintenance Management System
          </p>

          <p>
            Printed from Department Portal
          </p>

        </div>


      </body>

      </html>
    `);


    printWindow.document.close();


    // ------------------------------------------
    // START PRINTING
    // ------------------------------------------

    printWindow.focus();

    setTimeout(
      function() {
        printWindow.print();
      },
      500
    );


  } catch (error) {

    console.error(
      "Error printing maintenance report:",
      error
    );

    alert(
      "Unable to print the maintenance report."
    );

  }

}

// ==========================================
// AUTOMATIC MAINTENANCE REQUEST REFRESH
// ==========================================

setInterval(
  function() {
    loadDepartmentMaintenanceRequests();
  },
  30000
);
