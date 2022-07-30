//KANBOARD API URL
kB_APIURL = "http://localhost:5501/"

//variables
let projectsArray = []
let issuesArray = []
let boardsArray= []

let currentProjectID = undefined
let currentBoardID = undefined

let newBoardButton =document.getElementById("new-board")
let newIssueButton =document.getElementById("new-issue")

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

class Issue {
    constructor (ID, parentBoardId, title, status, completed, priority, body){
        this.ID = ID;
        this.parentBoardId = parentBoardId;
        this.title = title;
        this.status = status;
        this.completed = completed;
        this.priority = priority;
        this.body = body;
    }
}

//DOM selectors
const projectDropDown = document.querySelector("#project-list")
const projectTitleDisplay= document.querySelector("#project-title-display")
const boardsSidebar = document.querySelector("#boards-list")
const kanboard = document.querySelector("#board")
const boardIssueContainer = document.querySelectorAll(".board-issues-container")
const boardIssueColumn =document.querySelectorAll(".kanban-state-column")

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
    var elems = document.querySelectorAll(".modal");
    var instances = M.Modal.init(elems);
    instances.forEach(inst =>inst.close());
}


//chips tags js
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.chips');
    var instances = M.Chips.init(elems, {});
  });

  //Chip Object
  var chip = {
    tag: 'chip content',
    image: '', //optional
  };
        

  //INTERACTIVITY

  //Dragging html elements -CARDS-
  const column1 = document.getElementById('column1')
  const column2 = document.getElementById('column2')
  const column3 = document.getElementById('column3')
  const anyColumn = document.querySelectorAll('.board-issues-container')
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
anyColumn.forEach(col => {
    new Sortable(col, {
        group:'boards',
        animation: 350,
        draggable: ".draggable",
        direction: "vertical",
    })
})


  //Dragging the kanboard to navigate
  //dragElement(kanboard)

  function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
      // if present, the header is where you move the DIV from:
      document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      elmnt.onmousedown = dragMouseDown;
    }
  
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

//API INTERACTION

//modal to post in API
//Project modal
const newProjectForm = document.getElementById('new-project-form')
newProjectForm.addEventListener('submit', function (evt){
    evt.preventDefault()
    //console.log(evt)
    const formData = new FormData(this)
    const searchParams = new URLSearchParams()
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
//Boards modal
  const newBoardForm = document.getElementById('new-board-form')
  newBoardForm.addEventListener('submit', function (evt){
    evt.preventDefault()
    //console.log(evt)
    setFormToProjectID()
    const formData = new FormData(this)
    const searchParams = new URLSearchParams()
    for (const pair of formData){
        searchParams.append(pair[0], pair[1])
    }
    console.log(searchParams)

    fetch(`${kB_APIURL}boards`, {
        method: 'post',
        body: searchParams,
    })
    .then( response => {
        console.log(response)
        newBoardForm.reset()
        populateKanboard()
        return response.text()
    })
    .catch (err =>{
        console.error(err)
    })
    closeModal()
  })
  function setFormToProjectID (){
    let projectIDsubmission = document.createElement('div')
    projectIDsubmission.innerHTML = `<input type="hidden" name="parentProjectId" value="${currentProjectID}" />`
  newBoardForm.append(projectIDsubmission)
  }

  //Issues modal
  const newIssueForm = document.getElementById('new-issue-form')
  newIssueForm.addEventListener('submit', function (evt){
    evt.preventDefault()   
    setFormToBoardID()
    const formData = new FormData(this)
    const searchParams = new URLSearchParams()
    for (const pair of formData){
        searchParams.append(pair[0], pair[1])
    }
    console.log(searchParams)

    fetch(`${kB_APIURL}issues`, {
        method: 'post',
        body: searchParams,
    })
    .then( response => {
        console.log(response)
        newIssueForm.reset()
        populateIssuesBoard(currentBoardID)
        return response.text()
    })
    .catch (err =>{
        console.error(err)
    })
    closeModal()
  })
  function setFormToBoardID (){
    let boardIDsubmission = document.createElement('div')
    boardIDsubmission.innerHTML = `<input type="hidden" name="parentBoardId" value="${currentBoardID}" />`
    console.log(boardIDsubmission)
  newIssueForm.append(boardIDsubmission)
  }

//DOM OPERATIONS
//Project ID catcher
projectDropDown.addEventListener('click', (evt)=>{
    evt.preventDefault()
    currentProjectID = evt.target.id
    
    populateKanboard()
    let title = projectsArray.forEach(prjt =>{
        if(prjt.ID == currentProjectID){
            projectTitleDisplay.innerHTML = `${prjt.title}` 
        }
    }) 
})
// Board ID catcher and column builder
boardsSidebar.addEventListener('click', (evt)=>{
    evt.preventDefault()
    while (kanboard.firstChild) {
        kanboard.removeChild(kanboard.firstChild)}
    if(!evt.target.id){
        currentBoardID = evt.target.parentElement.closest('div[id]').id
    }else{
        currentBoardID = evt.target.id   
    }
    if (currentBoardID && currentBoardID != null){
        boardsArray.forEach(brd => {if (brd.ID == currentBoardID){
            buildStatusColumns(brd)
            }
        })
        
        populateIssuesBoard(currentBoardID)
    }
    console.log("This is the current BoardID: "+currentBoardID)
})
   


//POPULATE DOM
function populateKanboard(){
    //hide new buttons
    if(!currentProjectID)
    {
        newBoardButton.style.display = "none";
    }else{newBoardButton.style.display = ""; }

        
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
    boardsArray = []
    
    
    while (projectDropDown.firstChild) {
        projectDropDown.removeChild(projectDropDown.firstChild)}
    while (boardsSidebar.firstChild) {
            boardsSidebar.removeChild(boardsSidebar.firstChild)}
    while (kanboard.firstChild) {
        kanboard.removeChild(kanboard.firstChild)}
//(re)builds the list        
array.forEach(prjt => {let project = new Project;
                            project.ID = prjt._id
                            project.title = prjt.title
                            project.boards = prjt.boards
                            project.issues = prjt.issues
                            projectCardBuilder(project)
                            projectsArray.push(project)
})
if (currentProjectID && currentProjectID != null){
    console.log("this is the current project ID: "+currentProjectID)
    console.log(projectsArray)
    
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
    .then(responseParsed =>{ 
        //console.log(responseParsed);
        
        // while (boardsSidebar.firstChild) {
        //     boardsSidebar.removeChild(boardsSidebar.firstChild)}
                    
        responseParsed.boards.forEach(brd => {let board = new Board;
                                        board.ID = brd._id;
                                        board.parentProjectId = brd.parentProjectId
                                        board.name = brd.name;
                                        board.issues = brd.issues;
                                        board.issueStates = brd.issueStates;
                                        board.issueTypes = brd.issueTypes;
                                        board.description = brd.description;
                                        if (board.parentProjectId == projectID){
                                        boardCardBuilder(board, projectID)
                                        boardsArray.push(board)
                                        }
                                        //console.log(boardsArray)
                                        }
        )
        
        if (currentBoardID && currentBoardID != null)
        {
            
            buildStatusColumns()
            if(!currentBoardID)
            {
                newIssueButton.style.display = "none";
            }else{IssueButton.style.display = "initial"; }
            populateIssuesBoard(currentBoardID)
        }
    })
}

function boardCardBuilder(board, projectID){
    let boardCard = document.createElement("li")
    // boardsArray.forEach(board => {
    //     if (board.parentProjectId = projectID){
    //         boardCard.innerHTML = `<div class="card-panel teal white-text">
    //                             <span class="card-title"><h5>${board.name}</h5></span>
    //                             <div class="divider"></div>
    //                             <div class="card-content">
    //                                 <p>${board.description}</p>                            
    //                             </div>
    //                         </div>`
    //     boardsSidebar.appendChild(boardCard)

    //     }else{

    //     }
    // })
    boardCard.innerHTML = `<div class="card-panel teal white-text fullclick" id="${board.ID}">
                                
                                <span class="card-title"><h5>${board.name}</h5></span>
                                <div class="divider"></div>
                                <div class="card-content">
                                    <p>${board.description}</p>                            
                                </div>
                                <a></a>                              
                            </div>`
    boardsSidebar.appendChild(boardCard)
}

function buildStatusColumns(board){
    board.issueStates.forEach((state,index) =>{
        let boardIssueColumn = document.createElement('div')
        if(index ==0){
        boardIssueColumn.innerHTML = `<div class="col s12 m6 l3 cyan darken-3 kanban-state-column">
                                            <div class="row" id="board-states-container">
                                                <!-- column for header -->
                                                <p><h5 class="grey-text text-lighten-5 center">${state}</h5></p>
                                            </div>
                                            <div class="row">
                                                <div  class="board-issues-container" id="${state}container">
                                                <!-- cards in here -->
                                                    
                                                    
                                                        <!-- end of issue cards  -->
                                                <div class="col l12" id="new-issue">
                                                    <div class="card">
                                                        <div class="card-content">
                                                            <span class="card-title"><h6>Create New Issue</h6></span>
                                                            <a class="btn-floating halfway-fab waves-effect waves-light red lighten-2 modal-trigger" href="#new-issue-modal""><i class="material-icons">add</i></a>
                                                        </div>
                                                    </div>
                                                </div>    
                                                                                
                                                    
                                            </div>
                                        </div>`
        }else{
            boardIssueColumn.innerHTML = `<div class="col s12 m6 l3 cyan darken-3 kanban-state-column">
                                            <div class="row" id="board-states-container">
                                                <!-- column for header -->
                                                <p><h5 class="grey-text text-lighten-5 center">${state}</h5></p>
                                            </div>
                                            <div class="row">
                                                <div  class="board-issues-container" id="${state}container">
                                                <!-- cards in here -->            
                                                
                                              
                                                                                
                                                    
                                            </div>
                                            <!-- end of issue cards  -->
                                        </div>`
        }

    kanboard.appendChild(boardIssueColumn)
    })

}

function populateIssuesBoard(boardID){
    console.log("populating issues...")
    fetch(`${kB_APIURL}issues`)
        .then(response => response.json())
        .then(responseParsed =>{
            responseParsed.issues.forEach(iss => {let issue = new Issue;
                                                issue.ID = iss._id;
                                                issue.parentBoardId = iss.parentBoardId;
                                                issue.title = iss.title;
                                                issue.status = iss.status;
                                                issue.completed = iss.completed;
                                                issue.priority = iss.priority;
                                                issue.body = iss.body;   
                                                console.log(issue)                                             
                                                if(issue.parentBoardId == boardID){
                                                    console.log("this is happening")
                                                    issueCardBuilder(issue, boardID)
                                                    issuesArray.push(issue)
                                                }

            })
        })

}

function issueCardBuilder(issue, boardID){
    console.log("this is happening")
    let issueCard = document.createElement("li")
issueCard.innerHTML = `<div class="col l12 draggable">
                                <p><div class="card">
                                    <div class="card-content">
                                        <span class="card-title activator grey-text text-darken-4">${issue.title}<i class="material-icons right">more_vert</i></span>
                                        <p><a href="#">edit</a></p>
                                    </div>
                                    <div class="card-reveal">
                                        <span class="card-title grey-text text-darken-4">${issue.title}<i class="material-icons right">close</i></span>
                                        <p>${issue.body}</p>
                                    </div>
                                </div></p>
                              </div>`
  
boardIssueColumn.forEach(col => { if(issue.status+"container" == col.id){
    col.id.appendChild(issueCard)
}

})
}
                            



//INITIALIZE AND UPDATE BOARD
populateKanboard()