document.querySelector('form').addEventListener('submit',submit)

function submit(clicked){
    console.log(clicked);
    clicked.preventDefault()
    const Password= document.getElementById('password').value;
    const Conformpassword=document.getElementById("conformpassword").value;

    if(Password!==Conformpassword){
        document.getElementById('throwerorr2').innerHTML='password not match'
    }else{
        clicked.target.submit()
    }
}
