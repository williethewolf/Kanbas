//variables



//button dropdown js

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.dropdown-trigger');
    var instances = M.Dropdown.init(elems, {});
  });


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