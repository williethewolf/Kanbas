//KANBOARD API URL
kB_APIURL = "https://kanbas-kanban-board.herokuapp.com/"

//variables
let projectsArray = []
let issuesArray = []
let boardsArray= []

let currentProjectID = undefined
let currentBoardID = undefined
let currentIssueID = undefined

let newBoardButton =document.getElementById("new-board")
let newIssueButton =document.getElementById("new-issue")

boardIssueColumnArray = []
columnIssueContainerArray = []

//classes
class Project {
    constructor(ID, title, boards, issues, description){
        this.ID = ID;
        this.title = title;
        this.boards = boards;
        this.issues = issues;
        this.description = description;
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
//Dom selectors for edit buttons
let issueEditButtons = document.querySelectorAll(".issue-edit-button")
let boardEditButtons = document.querySelectorAll(".board-edit-button")

//WEB CSS INTERACTIVITY
//button dropdown js
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.dropdown-trigger');
    var instances = M.Dropdown.init(elems, {});
  });
//Modal initialization and visualization
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, {});
  });

  function closeModal() {
    var elems = document.querySelectorAll(".modal");
    var instances = M.Modal.init(elems);
    instances.forEach(inst =>inst.close());
}


//chips tags js - NOT IMPLEMENTED YET
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

  //Dragging html elements -CARDS- sortableJS library
function makeCardsDraggable(){
const anyColumn = document.querySelectorAll('.board-issues-container')
anyColumn.forEach((col, i) => {
    new Sortable(col, {
        group:'boards',
        animation: 350,
        draggable: ".draggable",
        direction: "vertical",
        onAdd: (evt)=>{
            const card = evt.item
            const newStatus = card.parentElement.id.replace('container','')
            console.log(newStatus)
            fetch (`${kB_APIURL}issues/${card.id}`, {
                method: 'PATCH',
                headers: {"Content-type": "application/json"},
                body: JSON.stringify({
                    status: `${newStatus}`,
                })
            })
            .then((response) => response.json())
            .then((json) => console.log(json));
        },
    }) 
    // console.log(col)
})
}


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
//NEW Project modal
const newProjectForm = document.getElementById('new-project-form')
newProjectForm.addEventListener('submit', function (evt){
    evt.preventDefault()
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

  //EDIT Project modal
const editProjectForm = document.getElementById('edit-project-form')
editProjectForm.addEventListener('submit', function (evt){
    evt.preventDefault()
     //check if delete button was used
     let submitter = evt.submitter
     console.log("event submitter :"+ submitter)
     console.log("event :"+ evt)
     if(submitter.matches('[data-action="DELETE"]')){
        
        fetch(`${kB_APIURL}projects/${currentProjectID}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            }})
        .then(res => res.text()) // or res.text()
        .then(res => console.log(res))
     }else{
 
    
        const formData = new FormData(this)
        const searchParams = new URLSearchParams()
        for (const pair of formData){
            searchParams.append(pair[0], pair[1])
        }

        fetch(`${kB_APIURL}projects/${currentProjectID}`, {
            method: 'PATCH',
            body: searchParams,
        })
        .then( response => {
            console.log(response)
            editProjectForm.reset()
            //these don't really execute do they?
            populateKanboard()
            projectNameDisplay()
            return response.text()
        })
        .catch (err =>{
            console.error(err)
        })
        closeModal()
    }
  })

//delete project
const deleteProjectButton = document.getElementById('delete-project-button')
deleteProjectButton.addEventListener('click', function (evt){
    evt.preventDefault()
    fetch(`${kB_APIURL}projects/${currentProjectID}`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json'
        }})
    .then(res => {
        res.text() // or res.json()
     populateKanboard()
     projectNameDisplay("reset")
    }) 
    //.then(res => console.log(res))
    .catch (err =>{
        console.error(err)
    })
    closeModal()
    //NEEDS TO GO EVEN DEEPER. AFTER FINDING THE PROJECT IT SHOULD 
    //FIND ALL THE BOARDS PARENTED BY THE PROJECT. ONCE FOUND, WE SHOULD 
    //FIND ALL THE ISSUE PARENTED BY THOSE BOARDS, AND THEN, DELETE THEM ALL.

})


//NEW Boards modal
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
        removeProjectIDfromForm()
        newBoardForm.reset()
        cleanSlateBoards()
        currentBoardID=undefined
            // ERROR TRIGGERS HERE BUT IT DOESNT SEEM TO BREAK APP
            // script.js:636 Uncaught (in promise) 
            // TypeError: Cannot read properties of undefined (reading 'issueStates')
            // at buildStatusColumns (script.js:636:35)
            // at script.js:594:13
        populateBoardsSidebar()
        // populateKanboard()
        return response.text()
    })
    .catch (err =>{
        console.error(err)
    })
    closeModal()
  })
  function setFormToProjectID (){
    let projectIDsubmission = document.createElement('div')
    projectIDsubmission.setAttribute("id","tempIDholder")
    projectIDsubmission.innerHTML = `<input type="hidden" name="parentProjectId" value="${currentProjectID}" />`
    newBoardForm.append(projectIDsubmission)
  }
  function removeProjectIDfromForm(){
    tempIDholder = document.getElementById("tempIDholder")
    tempIDholder.remove()
  }

  //EDIT Boards modal
  const editBoardForm = document.getElementById('edit-board-form')
  editBoardForm.addEventListener('submit', function (evt){
    evt.preventDefault()
    //console.log(evt)
    setFormToProjectID()
    const formData = new FormData(this)
    const searchParams = new URLSearchParams()
    for (const pair of formData){
        searchParams.append(pair[0], pair[1])
    }
    console.log(searchParams)

    fetch(`${kB_APIURL}boards/${currentBoardID}`, {
        method: 'PATCH',
        body: searchParams,
    })
    .then( response => {
        console.log(response)
        editBoardForm.reset()
        cleanSlateBoards()
        cleanAllBoard()
        //cleanSlateIssues()
        populateBoardsSidebar()
        return response.text()
    })
    .catch (err =>{
        console.error(err)
    })
    closeModal()
  })

  //delete board
const deleteBoardButton = document.getElementById('delete-board-button')
deleteBoardButton.addEventListener('click', function (evt){
    evt.preventDefault()
    fetch(`${kB_APIURL}boards/${currentBoardID}`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json'
        }})
    .then(res => {
        res.text() // or res.json()
        while (kanboard.firstChild) {
            kanboard.removeChild(kanboard.firstChild)}
        cleanSlateBoards()
        //cleanSlateIssues()
        cleanAllBoard()
        populateBoardsSidebar()
    }) 
    // .then(res => console.log(res))
    .catch (err =>{
        console.error(err)
    })
    closeModal()
    //NEEDS TO GO EVEN DEEPER. AFTER FINDING THE BOARD IT SHOULD 
    //FIND ALL THE ISSUE PARENTED BY THOSE BOARDS, AND THEN, DELETE THEM ALL.

})


  //NEW Issues modal
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
        removeProjectIDfromForm()
        
        newIssueForm.reset()
        cleanSlateIssues()
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
    boardIDsubmission.setAttribute("id","tempIDholder")
    boardIDsubmission.innerHTML = `<input type="hidden" name="parentBoardId" value="${currentBoardID}" />`
    console.log(boardIDsubmission)
  newIssueForm.append(boardIDsubmission)

  }

  //EDIT Issues modal
  const editIssueForm = document.getElementById('edit-issue-form')
  editIssueForm.addEventListener('submit', function (evt){
    evt.preventDefault()
    const issueID= currentIssueID
    const formData = new FormData(this)
    const searchParams = new URLSearchParams()
    for (const pair of formData){
        searchParams.append(pair[0], pair[1])
    }
    console.log(searchParams)
    console.log(issueID)
    fetch(`${kB_APIURL}issues/${issueID}`, {
        method: 'PATCH',
        body: searchParams,
    })
    .then( response => {
        console.log(response)
        editIssueForm.reset()
        cleanSlateIssues()
        populateIssuesBoard(currentBoardID)
        return response.text()
    })
    .catch (err =>{
        console.error(err)
    })
    closeModal()
  })

  //delete issue
  const deleteIssueButton = document.getElementById('delete-issue-button')
  deleteIssueButton.addEventListener('click', function (evt){
      evt.preventDefault()
      fetch(`${kB_APIURL}issues/${currentIssueID}`, {
          method: 'DELETE',
          headers: {
              'Content-type': 'application/json'
          }})
      .then(res => {
          res.text() // or res.json()
          while (kanboard.firstChild) {
              kanboard.removeChild(kanboard.firstChild)}
          cleanSlateIssues()
          populateIssuesBoard(currentBoardID)
      }) 
      // .then(res => console.log(res))
      .catch (err =>{
          console.error(err)
      })
      closeModal()
      //NEEDS TO GO EVEN DEEPER. AFTER FINDING THE BOARD IT SHOULD 
      //FIND ALL THE ISSUE PARENTED BY THOSE BOARDS, AND THEN, DELETE THEM ALL.
  
  })
  

  //creates event listeners and assigns current ids for issue manipulation
function passIDtoEditButtons(){
    issueEditButtons.forEach(button =>button.addEventListener('click', (evt) =>{
    let idToPass = evt.target.getAttribute("data-id")
    issueToEdit(idToPass)
    console.log(idToPass)
  }))
}
  function issueToEdit(id){
 currentIssueID = id
  }
//   function setFormToIssueID (){
//     let boardIDsubmission = document.createElement('div')
//     boardIDsubmission.innerHTML = `<input type="hidden" name="parentBoardId" value="${currentBoardID}" />`
//     console.log(boardIDsubmission)
//   editIssueForm.append(boardIDsubmission)
//  }

//DOM OPERATIONS
//Project ID catcher
projectDropDown.addEventListener('click', (evt)=>{
    evt.preventDefault()
    currentProjectID = evt.target.id
    
    populateKanboard()
    // let title = 
    projectNameDisplay()
   
})

function projectNameDisplay(reset){
    if(reset)projectTitleDisplay.innerHTML = `<div class="brand-logo">Select a Project</div>`
    else 
    projectsArray.forEach(prjt =>{
        if(prjt.ID == currentProjectID){
            if(prjt.description)
            projectTitleDisplay.innerHTML = `<div class="brand-logo">${prjt.title}<a href="#edit-project-modal" class="modal-trigger"><span class="material-icons">edit</span></a></div> <div class="right" style="font-size:1rem">${prjt.description}</div>` 
            else projectTitleDisplay.innerHTML = `<div class="brand-logo">${prjt.title} <a href="#edit-project-modal" class="modal-trigger"><span class="material-icons">edit</span></a></div>`
            
        }
    }) }
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
    cleanAllBoard()
    if (currentBoardID && currentBoardID != null){
        boardsArray.forEach(brd => {if (brd.ID == currentBoardID){
            buildStatusColumns(brd)
            // while (kanboard.firstChild) {
            //     kanboard.removeChild(kanboard.firstChild)}
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
    currentBoardID=""
    
    cleanSlateProjects()
cleanSlateBoards()
cleanSlateIssues()
    // while (projectDropDown.firstChild) {
    //     projectDropDown.removeChild(projectDropDown.firstChild)}
    // while (boardsSidebar.firstChild) {
    //         boardsSidebar.removeChild(boardsSidebar.firstChild)}
    // while (kanboard.firstChild) {
    //     kanboard.removeChild(kanboard.firstChild)}
//(re)builds the list        
array.forEach(prjt => {let project = new Project;
                            project.ID = prjt._id
                            project.title = prjt.title
                            project.boards = prjt.boards
                            project.issues = prjt.issues
                            project.description = prjt.description
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
    if (currentProjectID) projectID = currentProjectID
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
            boardEditButtons = document.querySelectorAll(".board-edit-button")
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
                                
                                <span class="card-title"><h5>${board.name}</h5> <p class="right"><a href="#edit-board-modal" class="white-text board-edit-button modal-trigger" style="z-index:3">edit<i class="tiny material-icons">edit</i></a></p></span>
                                <div class="divider"></div>
                                <div class="card-content">
                                    <p>${board.description}</p>                            
                                </div>
                                <a></a>                              
                            </div>`
    boardsSidebar.appendChild(boardCard)
}

function buildStatusColumns(board){
    cleanAllBoard()
    boardIssueColumnArray = board.issueStates
    boardIssueColumnArray.forEach((state,index) =>{
        let boardIssueColumn = document.createElement('div')
        if(index ==0){
        boardIssueColumn.innerHTML = `<div class="col s12 m6 l3 cyan darken-3 kanban-state-column">
                                            <div class="row" id="">
                                                <!-- column for header -->
                                                <p><h5 class="grey-text text-lighten-5 center">${state}</h5></p>
                                            </div>
                                            <div class="row">
                                                <div  class="board-issues-container" id="${state}container">
                                                <!-- cards in here -->
                                                </div>
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
                                            <div class="row" id="">
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
    makeCardsDraggable()
}

function populateIssuesBoard(boardID){
   
    console.log("populating issues...")
    fetch(`${kB_APIURL}issues`)
        .then(response => response.json())
        .then(responseParsed =>{
            responseParsed.issues.forEach(iss => {
                console.log(iss)
                let issue = new Issue;
                                                issue.ID = iss._id;
                                                issue.parentBoardId = iss.parentBoardId;
                                                issue.title = iss.title;
                                                issue.status = iss.status;
                                                issue.completed = iss.completed;
                                                issue.priority = iss.priority;
                                                issue.body = iss.body;   
                                                console.log(issue)                                             
                                                if(issue.parentBoardId == boardID){
                                                    console.log("building issue cards...")
                                                    issueCardBuilder(issue, boardID)
                                                    issuesArray.push(issue)
                                                }

            })
            issueEditButtons = document.querySelectorAll(".issue-edit-button")
            console.log(issueEditButtons)
            passIDtoEditButtons()
     
        })
        

}

function issueCardBuilder(issue, boardID){
    columnIssueContainerArray =document.querySelectorAll(".board-issues-container")
    let issueCard = document.createElement("div")
    issueCard.setAttribute("class", "col l12 draggable")             
    issueCard.setAttribute("id", `${issue.ID}`)
issueCard.innerHTML = `          <p><div class="card">
                                    <div class="card-content">
                                        <span class="card-title activator grey-text text-darken-4">${issue.title}<i class="material-icons right">more_vert</i></span>
                                    </div>
                                    <div class="card-reveal">
                                        <span class="card-title grey-text text-darken-4">${issue.title}<i class="material-icons right">close</i></span>
                                        <p class="section">${issue.body}</p>
                                        <p class="right"><a href="#edit-issue-modal" class="cyan-text darken-3 modal-trigger issue-edit-button" data-id="${issue.ID}">edit<i class="tiny material-icons issue-edit-button" data-id="${issue.ID}">edit</i></a></p>
                                    </div>
                                    </div></p>`
  

console.log(boardIssueColumnArray)
console.log(issue.status)
console.log(columnIssueContainerArray)
columnIssueContainerArray.forEach(col => { if(issue.status+"container" == col.id){
    col.prepend(issueCard)
}

})
}
                            
//Little helper functions
cleanSlateProjects()
cleanSlateBoards()
cleanSlateIssues()
//Cleanup crew
function cleanSlateProjects(){
while (projectDropDown.firstChild) {
    projectDropDown.removeChild(projectDropDown.firstChild)}
}
function cleanSlateBoards(){
while (boardsSidebar.firstChild) {
        boardsSidebar.removeChild(boardsSidebar.firstChild)}
}
function cleanSlateIssues(){
while (kanboard.firstChild) {
    kanboard.removeChild(kanboard.firstChild)}

    boardsArray.forEach(brd => {if (brd.ID == currentBoardID){
        buildStatusColumns(brd)}})
    
}
function cleanAllBoard(){
    while (kanboard.firstChild) {
        kanboard.removeChild(kanboard.firstChild)}
    }



//INITIALIZE AND UPDATE BOARD
populateKanboard()