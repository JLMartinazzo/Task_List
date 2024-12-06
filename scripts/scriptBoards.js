const url_theme_id = "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/PersonConfigById?PersonId="

var localReturn = JSON.parse(localStorage.getItem("info"));

var userId = localReturn.Id;

async function theme(personId) {

    var themeDiv = document.getElementById("stylesDiv")

    try{

        var pageTheme = await fetch(`${url_theme_id}${personId}`);

        if(pageTheme.ok){

            var themeId = await pageTheme.json();
            if(themeId.DefaultThemeId == 2){
                themeDiv.href = "./styles/lightTheme.css";

            }else if(themeId.DefaultThemeId == 1){
                themeDiv.href = "./styles/darkTheme.css";

            }

        }else if(pageTheme.status == 422){
            console.log("não foi encontrado usuario");

        }else{
            console.log("ocorreu um erro inesperado");

        }
    }catch(error){
        console.log("um erro aconteceu no try");
    }
}
theme(userId)



const url_boards = "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Boards"

var father = document.getElementById("boardsSelect");

var son = document.getElementById("option1");

async function dropDown() {

    try{
        var boardList = await fetch(url_boards)
        if(boardList.ok){

            var boards = await boardList.json()

            boards.forEach((boards) => {
                
                var optionDrop = document.createElement("option")

                optionDrop.innerHTML = boards.Name

                optionDrop.value = boards.Id

                optionDrop.id = boards.Id

                optionDrop = father.insertBefore(optionDrop, son)

                optionDrop.style.backgroundColor = boards.HexaBackgroundCoor

                if(boards.HexaBackgroundCoor == "#ffffff"){
                    optionDrop.style.color = "#000000"
                }

            });

        }else{
            console.log("erro ocorrido no fetch")
        }
    }catch(error){
        console.log("erro na criação dos boards")
    }
    
}
dropDown()



const url_column_id = "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/ColumnByBoardId?BoardId="

const url_tasks = "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/TasksByColumnId?ColumnId="

var select = document.getElementById("boardsSelect")

var columnsOfBoard

async function creatingColumns(){

    var father = document.getElementById("father")
    var son = document.getElementById("son")

    var formCreation = document.createElement("div")
    formCreation.classList.add("hide")
    formCreation.id = "formForColumn"
    var labelForm = document.createElement("label")
    labelForm.for = "nameColumn"
    labelForm.innerText = "Nome da Coluna"
    labelForm = formCreation.appendChild(labelForm)
    var inputForm = document.createElement("input")
    inputForm.type = "text"
    inputForm.id = "nameColumn"
    inputForm = formCreation.appendChild(inputForm)
    var buttonForm = document.createElement("input")
    buttonForm.id = "buttonColumn"
    buttonForm.type = "button"
    buttonForm.value = "Criar"
    buttonForm = formCreation.appendChild(buttonForm)

    father.insertBefore(formCreation, son)

    for(var i = 0; i<columnsOfBoard.length; i++){

        var newColumn = document.createElement("div")

        newColumn.classList.add("quadro")
        
        newColumn.id = `column${columnsOfBoard[i].Id}`

        var columnName = document.createElement("div")

        columnName.classList.add("name")

        columnName.innerText = columnsOfBoard[i].Name

        columnName = newColumn.appendChild(columnName)

        var createNewTask = document.createElement("div")
        createNewTask.id = `addtask-${columnsOfBoard[i].Id}`
        createNewTask.classList.add("buttonTask")
        createNewTask.innerText = "Criar Nova Tarefa"

        createNewTask.addEventListener("click", function() {
            fomTask(event.target.id);  
        });

        createNewTask = newColumn.appendChild(createNewTask)

        var sonColumns = document.getElementById("createColumn")

        father.insertBefore(newColumn, sonColumns)

    }
 
}

async function takingTasks(){

    for(var i = 0; i<columnsOfBoard.length; i++){

        try{

            var tasks = await fetch(`${url_tasks}${columnsOfBoard[i].Id}`)

            if(tasks.ok){

                var taskList = await tasks.json()

                creatingTasks(taskList, i)

            }else{
                console.log("erro na criação de tarefas")
            }

        }catch(error){
            console.log("ocorreu um erro na busca de tarefas")
        }

    }

}


function creatingTasks(task, num){

    for(var i = 0; i<task.length; i++){
        
        var newTask = document.createElement("div")

        newTask.classList.add("tasks")

        newTask.innerText = task[i].Title

        newTask.id = task[i].Id

        var description = document.createElement("div")

        description.classList.add("description")

        if(task[i].Description == null){
            description.innerText = ""
        }else{
            description.innerText = task[i].Description
        }
        
        description = newTask.appendChild(description)

        var father2 = document.getElementById(`column${task[i].ColumnId}`)

        var son2 = document.getElementById(`addtask-${num}`)
        
        father2 = father2.insertBefore(newTask, son2)

    }

}


async function columns(){
    try{

        var columnsId = await fetch(`${url_column_id}${select.options[select.selectedIndex].id}`)

        if(columnsId.ok){

            columnsOfBoard = await columnsId.json()

            await creatingColumns()

            await takingTasks()

        }else{
            console.log("um erro aconteceu nas colunas")
        }

    }catch(error){
        console.log("erro no encontro das colunas")
    }
}


select.addEventListener("change", function openBoard(){

    var boardsArea = document.getElementById("father")
    if(boardsArea.textContent != ""){
        document.getElementById("father").textContent =""
    }

    columns()
    buttonCreate()

})

function buttonCreate(){
    var columnCreate = document.createElement("button")
    columnCreate.id = "createColumn"
    columnCreate.classList.add("createColumn")
    var columnCreateName = document.createElement("div")
    columnCreateName.innerHTML = `Criar Nova Coluna +`
    columnCreateName.id = "newColumnName"
    columnCreateName = columnCreate.appendChild(columnCreateName)

    var father = document.getElementById("father")
    var son = document.getElementById("son")

    father.insertBefore(columnCreate, son)

    columnCreate.addEventListener("click", formOpening);
}

function formOpening() {
    var form = document.getElementById("formForColumn")
    
    if(form.classList.contains("hide")){
        form.classList.remove("hide")
        form.classList.add("createForm")
    }else if(form.classList.contains("createForm")){
        form.classList.remove("createForm")
        form.classList.add("hide")
    }

    document.getElementById("buttonColumn").addEventListener("click", submitingInfo)
}

const url_post_column = "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Column"

function submitingInfo(){

    var newName = document.getElementById("nameColumn").value

    var columnInfo = {
        BoardId: select.options[select.selectedIndex].id,
        Name: newName, 
        IsActive: true
    }

    creatingNewColumn(columnInfo)

}

async function creatingNewColumn(columnInfo){
    
    await fetch(url_post_column,{
        method: "POST",            
        headers: {
            "Content-Type": "application/json",
        },
          body: JSON.stringify(columnInfo),
    })

    .catch((error) => {        
        console.log("erron na criação da coluna")
    })

    
    var boardsArea = document.getElementById("father")
    if(boardsArea.textContent != ""){
        document.getElementById("father").textContent =""
    }

    await columns()
    await buttonCreate()

}

function fomTask(buttonId) {
    
    console.log(buttonId)

    // Verificar se o formulário de criação de tarefa já foi criado
    if (document.getElementById("formForTask") == null) {

        var father = document.getElementById("father");
        var son = document.getElementById("son");

        // Criar o formulário de criação de tarefa
        var createTaskForm = document.createElement("div");
        createTaskForm.classList.add("createFormTask");
        createTaskForm.id = "formForTask";

        var labelForm = document.createElement("label");
        labelForm.for = "nameTask";
        labelForm.innerText = "Nome da Tarefa";
        createTaskForm.appendChild(labelForm);

        var inputForm = document.createElement("input");
        inputForm.type = "text";
        inputForm.id = "nameTask";
        createTaskForm.appendChild(inputForm);

        var labelForm2 = document.createElement("label");
        labelForm2.for = "descriptionTask";
        labelForm2.innerText = "Descrição da Tarefa";
        createTaskForm.appendChild(labelForm2);

        var inputForm2 = document.createElement("input");
        inputForm2.type = "text";
        inputForm2.id = "descriptionTask";
        createTaskForm.appendChild(inputForm2);

        var buttonForm = document.createElement("input");
        buttonForm.id = "buttonTask";
        buttonForm.type = "button";
        buttonForm.value = "Criar";
        createTaskForm.appendChild(buttonForm);

       
        buttonForm.addEventListener("click", function () {
            var columnId = buttonId.split('-')[1]
            taskRegistration(columnId);
        });

        father.insertBefore(createTaskForm, son);

    } else if (document.getElementById("formForTask").classList.contains("createFormTask")) {
        document.getElementById("formForTask").classList.remove("createFormTask");
        document.getElementById("formForTask").classList.add("hide");
    } else if (document.getElementById("formForTask").classList.contains("hide")) {
        document.getElementById("formForTask").classList.remove("hide");
        document.getElementById("formForTask").classList.add("createFormTask");
    }
}

    const url_post_task = "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Task"

async function taskRegistration(columnId) {
    console.log(columnId);  

    var nameOfTask = document.getElementById("nameTask").value;
    var descriptionOfTask = document.getElementById("descriptionTask").value;

    var taskInfo = {
        ColumnId: columnId, 
        Title: nameOfTask,
        Description: descriptionOfTask,
        IsActive: true
    };

    await fetch(url_post_task, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(taskInfo),
    })
    .catch((error) => {
        console.log("Erro na criação da tarefa");
    });


    var boardsArea = document.getElementById("father")
    if(boardsArea.textContent != ""){
        document.getElementById("father").textContent =""
    }

    await columns()
    await buttonCreate()

}