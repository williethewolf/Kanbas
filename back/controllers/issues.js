//Dependencies
const issueRouter = require('express').Router()
const issue = require('../models/issue')
const Issue = require("../models/issue")

//ROUTES
//INDUCES

//INDEX
issueRouter.get('/', (req,res) =>{
    issue.find({})
    .exec()
    .then(allIssues => {
        const response = {
            count: allIssues.length,
            issues: allIssues.map(issue =>{
                return{
                    parentProjectId: issue.parentBoardId,
                    title: issue.title,
                    body : issue.body,
                    status: issue.title.status,
                    completed: issue.completed,
                    type: issue.type,
                    priority: issue.priority,
                    timestamps: issue.timestamps.updatedAt,
                
                    request: {
                    type: 'GET',
                    unique_URL: req.protocol + '://' +req.get('host')+req.originalUrl+"/"+ issue._id
                },
                }
            })
        }
        
        res.status(200).json(response)
        

    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
    //res.send("issues index")
})
//NEW


//DELETE
issueRouter.delete('/:issueId', (req, res) => {
    Issue.findByIdAndDelete(req.params.issueId)
    .exec()
    .then(deletedIssue =>{
        if(!deletedIssue){
            return res.status(404).json({
                message: "Issue not found"
            })
        }
        res.status(202).json(deletedIssue)
    })
    .catch(err => {console.log(err)
        res.status(500).json({
            error: err
        })
        })
})

//UPDATE

issueRouter.put('/:issueId', (req, res) => {
    Issue.findByIdAndUpdate(
        req.params.issueId,
        req.body,
        {new: true})
        .exec()
        .then(updatedIssue => {
            res.status(201).json(updatedIssue)
        })
        .catch(err => {
            console.log(err)
        res.status(500).json({error: err})
        })
            //do something?
})
//PATCH FOR REFERENCE BUT NOT USING IT NOW
issueRouter.patch('/:issueId', (req, res) =>{
    Issue.findByIdAndUpdate(
        req.params.issueId,
         {$set: req.body},
        {new: true}
    )
    .then(patchedIssue => res.status(200).json(patchedIssue))
    .catch(err => res.status(500).jason({error:err}))
})

//CREATE
issueRouter.post('/',(req, res) => {
    Issue.create(req.body)
    .then(newCreatedIssue => {
        const response = {
            issue:{
                parentProjectId: newCreatedIssue.parentBoardId,
                title: newCreatedIssue.title,
                body : newCreatedIssue.body,
                status: newCreatedIssue.title.status,
                completed: newCreatedIssue.completed,
                type: newCreatedIssue.type,
                priority: newCreatedIssue.priority,
                timestamps: newCreatedIssue.timestamps.updatedAt,
            
                request: {
                type: 'GET',
                unique_URL: req.protocol + '://' +req.get('host')+req.originalUrl+ newCreatedIssue._id
            },
        }
    }
        res.status(201).json(response)
    })
    .catch(err => {
        console.log(err)
            res.status(500).json({error: err})
    })
})
    

//EDIT

//SHOW
issueRouter.get('/:issueId', (req, res) => {
    Issue.findById(req.params.issueId)
    .exec()
    .then(foundIssue => {
        if(foundIssue){
            const response = {
                issue:{
                        parentProjectId: foundIssue.parentBoardId,
                        title: foundIssue.title,
                        body : foundIssue.body,
                        status: foundIssue.title.status,
                        completed: foundIssue.completed,
                        type: foundIssue.type,
                        priority: foundIssue.priority,
                        timestamps: foundIssue.timestamps.updatedAt,
                    
                        request: {
                        type: 'GET',
                        unique_URL: req.protocol + '://' +req.get('host')+req.originalUrl
                        },
                    }
                }
                res.status(200).json(response)
        }else{
            res.status(404).json({
                message: "No valid entry for provided ID"
            })
        }
    })
    .catch(err =>{
        console.log(err)
        res.status(500).json({error: err})
    })
})

module.exports = issueRouter