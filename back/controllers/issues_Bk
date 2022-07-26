//Dependencies
const issueRouter = require('express').Router()
const Issue = require("../models/issue")

//ROUTES
//INDUCES

//INDEX
issueRouter.get('/', (req,res) =>{
    Issue.find({},(err, allIssues)=>{
        if (err) res.status(404).send('Not Found')
        res.status(200).json(allIssues)
    })
    // res.send("issues index")
})
//NEW


//DELETE
issueRouter.delete('/:issueId', (req, res) => {
    Issue.findByIdAndDelete (req.params.issueId, (err, deletedIssue) => {
        //Do whatever
    })
})

//UPDATE
issueRouter.put('/:issueId', (req, res) => {
    Issue.findByIdAndUpdate(
        req.params.issueId,
        req.body,
        {new: true},
        (err, updatedProject) => {
            //Do something here
        }
    )
})

//CREATE
issueRouter.post('/', (req, res) => {
    Issue.create(req.body, (err, newIssue) =>{
        //Do somthang
    })
})

//EDIT

//SHOW
issueRouter.get('/:issueId', (req, res) => {
    Issue.findById(req.params.issueId, (err, foundIssue) => {
        //do the zing
    })
})

module.exports = issueRouter