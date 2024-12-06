//url do back ending que vai ser realizado
const url_back_ending = "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard";
//caminho para o div dque exibe a menssagem de erro
var errorMessage = document.getElementById("wrong")
//caminho para o input onde o email será escrito
var emailText = document.getElementById("emailAcess");


document.getElementById("buttonSubmit").addEventListener("click", async (event) => {
    event.preventDefault();

    //recebe o que foi escrito na linha de texto / .trim() = remove os espaços desencessários da string
    var email = emailText.value.trim();
    //caso o email inserido seja nulo == não escreveu nada ou apenas espaços
    if(!email){
        errorMessage.innerText = "por favor digite um email válido"
        errorMessage.style.display = "block"
    }

    try{
        //joga o email digitado no url para ele ser buscado nos dados do back ending
        var emailReturn = await fetch(`${url_back_ending}/GetPersonByEmail?Email=${email}`)

        //caso o email tenha retornado um valor com sucesso
        if(emailReturn.ok){

            //recebendo em forma as informações do usuario pertencente ao email
            var userInfo = await emailReturn.json() 

            //salvando as informações do usuario no armazenamento local
            localStorage.setItem("info", JSON.stringify({
                Name: userInfo.Name,
                Email: userInfo.Email,
                Phone: userInfo.PhoneNumber,
                Id: userInfo.Id,
            }))

            //redireciona a página
            window.location.href = "./boards.html"

        //caso houver um erro dele não achar um email igual ao digitado
        }else if(emailReturn.status == 422){

            errorMessage.innerText = "email de usuário não encontrado"
            errorMessage.style.display = "block"
            emailText.value = ""

        //em qualquer outro erro
        }else{

            errorMessage.innerText = "um erro inesperado aconteceu"
            errorMessage.style.display = "block"
            emailText.value = ""
            
        }

    //caso a função "try" retorne um erro 
    }catch(error){
        errorMessage.innerText = "um erro inesperado aconteceu"
        errorMessage.style.display = "block"
        emailText.value = ""
    }


})