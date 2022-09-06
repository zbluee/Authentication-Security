const inputs = [
    { password : $('#password'),
      togglePassword : $('#togglepassword')},
    { password : $('#passwordconfirm'),
      togglePassword : $('#togglepasswordconfirm')}
];

inputs.forEach(input=>{
    input.togglePassword.on('click', ()=>{

        const type = input.password.attr('type') === 'text' ? 'password' : 'text';
        input.password.attr('type', type);
    
        input.togglePassword.toggleClass('fa-eye-slash fa-eye');
        
    });
});


