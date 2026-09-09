// ==========================================
// ATBUTH DEPARTMENT PORTAL
// SUPABASE CONNECTION
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
// DEPARTMENT LOGIN
// ==========================================

const departmentLoginForm =
  document.getElementById("departmentLoginForm");

const departmentUsername =
  document.getElementById("departmentUsername");

const departmentPassword =
  document.getElementById("departmentPassword");

const departmentLoginBtn =
  document.getElementById("departmentLoginBtn");

const departmentLoginMessage =
  document.getElementById("departmentLoginMessage");


if (departmentLoginForm) {

  departmentLoginForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();

      const username =
        departmentUsername.value.trim();

      const password =
        departmentPassword.value;

      if (!username || !password) {

        departmentLoginMessage.textContent =
          "Please enter username and password.";

        return;
      }

      departmentLoginBtn.disabled = true;

      departmentLoginMessage.textContent =
        "Signing in...";


      try {

        // ==========================================
        // FIND DEPARTMENT USER
        // ==========================================

        const { data: userData, error: userError } =
          await client
            .from("tblUsers")
            .select(
              '"UserID", "Username", "Full name", "UserRole", "Status", "AuthUserID", "DepartmentID", "HospitalID"'
            )
            .ilike("Username", username)
            .eq("UserRole", "Department")
            .eq("Status", "Active")
            .maybeSingle();


        if (userError) {
          throw userError;
        }


        if (!userData) {

          departmentLoginMessage.textContent =
            "Invalid department username or password.";

          departmentLoginBtn.disabled = false;

          return;
        }


        // ==========================================
        // TEMPORARY CHECK
        // ==========================================

        console.log(
          "Department user found:",
          userData
        );


        departmentLoginMessage.textContent =
          "Department account found. Authentication setup is next.";

        departmentLoginBtn.disabled = false;


      } catch (error) {

        console.error(
          "Department login error:",
          error
        );

        departmentLoginMessage.textContent =
          "Unable to sign in. Please try again.";

        departmentLoginBtn.disabled = false;
      }

    }
  );

}
