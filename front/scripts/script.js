//KANBOARD API URL
kB_APIURL = "http://localhost:5501/"

//variables
let projectsArray = []
let issuesArray = []
let boardsArray= []

let currentProjectID = ""
let currentBoardID = ""

//classes
class Project {
    constructor(ID, title, boards, issues){
        this.ID = ID;
        this.title = title;
        this.boards = boards;
        this.issues = issues;
    }
}

class Board {
    constructor (ID, parentProjectId, name, issues, issueStates, issueTypes, description){
        this.ID = ID;
        this.parentProjectId = parentProjectId;
        this.name = name;
        this.issues = issues;
        this.issueStates = issueStates;
        this.issueTypes = issueTypes;
        this.description = description;
    }
}

//DOM selectors
const projectDropDown = document.querySelector("#project-list")
const boardsSidebar = document.querySelector("#boards-list")
const kanboard = document.querySelector("#board")

//WEB CSS INTERACTIVITY
//button dropdown js
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.dropdown-trigger');
    var instances = M.Dropdown.init(elems, {});
  });
//Modal initialization
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, {});
  });

  function closeModal() {
    var elem = document.getElementById("new-project-modal");
    var instance = M.Modal.getInstance(elem);
    instance.close();
}

  //INTERACTIVITY

  //Dragging html elements
  const column1 = document.getElementById('column1')
  const column2 = document.getElementById('column2')
  const column3 = document.getElementById('column3')
  new Sortable(column1, {
      group:'boards',
      animation: 350,
      draggable: ".draggable",
      direction: "vertical",
  })
  new Sortable(column2, {
      group:'boards',
      animation: 350,
      draggable: ".draggable",
      direction: "vertical",
  })
  new Sortable(column3, {
      group:'boards',
      animation: 350,
      draggable: ".draggable",
      direction: "vertical",
  })

//API INTERACTION

//modal to post in API
const newProjectForm = document.getElementById('new-project-form')
newProjectForm.addEventListener('submit', function (evt){
    evt.preventDefault()
    //console.log(evt)
    const formData = new FormData(this)
    const searchParams = new URLSearchParams()
    console.log('here here'+formData)
    for (const pair of formData){
        searchParams.append(pair[0], pair[1])
    }

    fetch(`${kB_APIURL}projects`, {
        method: 'post',
        body: searchParams,
    })
    .then( response => {
        console.log(response)
        newProjectForm.reset()
        populateKanboard()
        return response.text()
    })
    .catch (err =>{
        console.error(err)
    })
    closeModal()
  })

//DOM OPERATIONS
projectDropDown.addEventListener('click', (evt)=>{
    evt.preventDefault()
    currentProjectID = evt.target.id
    populateKanboard()
})

//POPULATE DOM
function populateKanboard(){
fetch(`${kB_APIURL}projects`)
.then(response => response.json())
.then(responseParsed => {console.log(responseParsed); populateProjects(responseParsed.projects)})
.catch (err =>{
    console.error(err)
})
}

function populateProjects(array){
//empties the list before building it
    projectsArray = []
   
    while (projectDropDown.firstChild) {
        projectDropDown.removeChild(projectDropDown.firstChild)}
//(re)builds the list        
array.forEach(prjt => {let project = new Project;
                            project.ID = prjt._id
                            project.title = prjt.title
                            project.boards = prjt.boards
                            project.issues = prjt.issues
                            projectCardBuilder(project)
                            projectsArray.push(project)
})
if (currentProjectID != null || currentProjectID.length !=0){
    console.log("this is the current project ID: "+currentProjectID)
    populateBoardsSidebar(currentProjectID)
}
}
function projectCardBuilder(project){
    let projectCard = document.createElement("li")
    projectCard.innerHTML = `<a href="#!" id="${project.ID}">${project.title}</a>`

    projectDropDown.appendChild(projectCard)
}

function populateBoardsSidebar(projectID){
    fetch(`${kB_APIURL}boards`)
    .then(response => response.json())
    .then(responseParsed =>{ console.log(responseParsed);
        
        while (boardsSidebar.firstChild) {
            boardsSidebar.removeChild(boardsSidebar.firstChild)}
        
        responseParsed.boards.forEach(brd => {let board = new Board;
                                        board.ID = brd._id;
                                        board.parentProjectId = brd.parentProjectId
                                        board.name = brd.name;
                                        board.issues = brd.issues;
                                        board.issueStates = brd.issueStates;
                                        board.issueTypes = brd.issueTypes;
                                        board.description = brd.description;
                                        boardCardBuilder(board, projectID)
                                        if (board.parentProjectId = projectID){
                                        boardsArray.push(board)
                                        }
                                        console.log(boardsArray)
                                        }
        )
        if (currentBoardID != null || currentBoardID.length() !=0)
        {
            populateIssues(currentBoardID)
        }
    })
}

function boardCardBuilder(board, projectID){
    let boardCard = document.createElement("li")
    boardsArray.forEach(board => {
        if (board.parentProjectId = projectID){
            boardCard.innerHTML = `<div class="card-panel teal white-text">
                                <span class="card-title"><h5>${board.name}</h5></span>
                                <div class="divider"></div>
                                <div class="card-content">
                                    <p>${board.description}</p>                            
                                </div>
                            </div>`
        boardsSidebar.appendChild(boardCard)

        }else{

        }
    })
    // boardCard.innerHTML = `<div class="card-panel teal white-text">
    //                             <span class="card-title"><h5>${board.name}</h5></span>
    //                             <div class="divider"></div>
    //                             <div class="card-content">
    //                                 <p>${board.description}</p>                            
    //                             </div>
    //                         </div>`
    // boardsSidebar.appendChild(boardCard)
}

function populateIssues(issues){

}

//INITIALIZE AND UPDATE BOARD
populateKanboard()