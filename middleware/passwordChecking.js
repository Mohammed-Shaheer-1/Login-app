const connection = require('../config/db.cofig');


exports.checkPassword = async (req,res,next)=>{
    
// Function to retrieve password policies from the MySQL table
function getPasswordPolicies() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM password_policies WHERE id = 1';
  
      connection.query(query, function (error, results) {
        if (error) {
          reject(error);
          return;
        }
  
        if (results.length === 0) {
          reject(new Error('Password policies not found.'));
          return;
        }
  
        const passwordPolicies = results[0];
        resolve(passwordPolicies);
      });
    });
  }
  const password = req.body.password;


function validatePassword(password, passwordPolicies) {
   
    if (password.length < passwordPolicies.minimum_length) {
      return false;
    }
    if (passwordPolicies.require_uppercase && !hasUppercase(password)) {
        return false;
      }
    return true;
  }

// Function to check for uppercase letter
function hasUppercase(password) {
    const regex = /[A-Z]/;
    return regex.test(password);
  }
  


(async () => {
  try {


    const passwordPolicies = await getPasswordPolicies(); // Retrieve password policies

    if (validatePassword(password, passwordPolicies)) {
      console.log("Password is valid!");
      next()
    } else {
      console.log("Invalid password. Please make sure it meets the requirements.");
    }


  } catch (error) { 
    console.error("Error:", error);
 
  }
})();
  
} 