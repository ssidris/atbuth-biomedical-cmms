const SUPABASE_URL =
  "https://vfnfbhrgmptgleytmeyq.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_O058LKa9owIjewDHfC84Yg_lMVdXD95";

const client = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


// ==========================================
// DEPARTMENT LOGIN ELEMENTS
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


// ==========================================
// DEPARTMENT LOGIN
// ==========================================

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
        // STEP 1: GET AUTH EMAIL FROM EDGE FUNCTION
        // ==========================================

        const response =
          await fetch(
            `${SUPABASE_URL}/functions/v1/department-login`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                "apikey":
                  SUPABASE_PUBLISHABLE_KEY
              },

              body: JSON.stringify({
                username: username
              })
            }
          );


        const loginData =
          await response.json();


        if (!response.ok) {

          throw new Error(
            loginData.error ||
            "Department username not found."
          );
        }


        const authEmail =
          loginData.email;


        if (!authEmail) {

          throw new Error(
            "Authentication email was not found."
          );
        }


        // ==========================================
        // STEP 2: AUTHENTICATE WITH SUPABASE
        // ==========================================

        const {
          data: authData,
          error: authError
        } =
          await client.auth.signInWithPassword({

            email: authEmail,

            password: password

          });


        if (authError) {

          throw new Error(
            "Invalid username or password."
          );
        }


        if (!authData?.user) {

          throw new Error(
            "Authentication failed."
          );
        }


        // ==========================================
        // STEP 3: GET DEPARTMENT USER PROFILE
        // ==========================================

        const {
          data: departmentUser,
          error: profileError
        } =
          await client
            .from("tblUsers")
            .select(
              '"UserID", "Username", "Full name", "UserRole", "Status", "AuthUserID", "DepartmentID", "HospitalID"'
            )
            .eq(
              "AuthUserID",
              authData.user.id
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


        if (profileError) {

          throw profileError;
        }


        if (!departmentUser) {

          await client.auth.signOut();

          throw new Error(
            "Department profile was not found."
          );
        }


        // ==========================================
        // STEP 4: SAVE DEPARTMENT SESSION
        // ==========================================

        sessionStorage.setItem(
          "departmentUser",
          JSON.stringify(
            departmentUser
          )
        );


        // ==========================================
        // LOGIN SUCCESS
        // ==========================================

        departmentLoginMessage.textContent =
          "Login successful.";

        departmentLoginMessage.style.color =
          "green";


        // ==========================================
        // TEMPORARY SUCCESS MESSAGE
        // ==========================================

        setTimeout(function () {

          alert(
            "Welcome " +
            departmentUser["Full name"] +
            "!"
          );

        }, 300);


      } catch (error) {

        console.error(
          "Department login error:",
          error
        );


        departmentLoginMessage.textContent =
          error.message ||
          "Unable to sign in. Please try again.";

        departmentLoginMessage.style.color =
          "red";

      } finally {

        departmentLoginBtn.disabled =
          false;

      }

    }
  );

}
