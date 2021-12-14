const $ = document.querySelector.bind(document);

const ERROR_CODES = 
{
    'auth/invalid-email': 'This is not a valid email address.',
    'auth/user-not-found': 'This email is not registered.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/too-many-requests': 'Too many login requests. Access to this account is temporarily blocked.',
    'auth/weak-password': 'Password is too short. Your password should be at least 6 characters.',
    'auth/email-already-in-use' : 'This email is already registered.'
};

window.onload = function()
{
    
    // check if user is logged in
    onLogin( user => {
        if(user)
        {
            //user just logged in
            location = "index.html";
        }
    });

    $('#signinBtn').onclick = function()
    {
        login( $('#email').value, $('#password').value )
        .catch( err => $('#signinerror').innerText =  'Error: ' +
            (ERROR_CODES[err.code] || 'Something went wrong.'));
    }

    $('#signupBtn').onclick = function()
    {
        signup( $('#emailReg').value, $('#passwordReg').value )
        .catch( err => $('#signuperror').innerText = 'Error: ' +
            (ERROR_CODES[err.code] || 'Something went wrong.'));
    }

    $("#email").onfocus = $("#password").onfocus = function()
    {
        $("#signinerror").innerText = "";
    }

    $("#emailReg").onfocus = $("#passwordReg").onfocus = function()
    {
        $("#signuperror").innerText = "";
    }

    $('#signupLink').onclick = function()
    {
        $('#signupDiv').style.display = "block";
        $('#signinDiv').style.display = "none";
    }

    $('#signinLink').onclick = function()
    {
        $('#signinDiv').style.display = "block";
        $('#signupDiv').style.display = "none";
    }

}