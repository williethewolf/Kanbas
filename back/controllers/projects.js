//Dependencies
const projectRouter = require('express').Router()
const Project = require("../models/project")
//const mongoose = require ("mongoose")

//ROUTES
//INDUCES

//INDEX
projectRouter.get('/', (req,res) =>{
    Project.find({})
    .exec()
    .then(allProjects => {
        const response = {
            count: allProjects.length,
            projects: allProjects.map(project =>{
                return{
                    title: project.title,
                    owner: project.owner,
                    repo_URL: project.repo_URL,
                    issues: project.issues,
                    numberOfIssues: project.issues.length,
                    issueStates: project.issueStates,
                    issueTypes: project.issueTypes,
                    request: {
                        type: 'GET',
                        unique_URL: req.protocol + '://' +req.get('host')+req.originalUrl+"/"+ project._id
                    }
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
    //res.send("Projects index")
})
//NEW
projectRouter.get('/new', (req,res) => {

})

//DELETE
projectRouter.delete('/:productId', (req, res) => {
    Project.findByIdAndDelete(req.params.productId)
    .exec()
    .then(deletedProject =>{
        res.status(202).json(deletedProject)
    })
    .catch(err => {console.log(err)
        res.status(500).json({
            error: err
        })
        })
})

//UPDATE
projectRouter.put('/:productId', (req, res) => {
    Project.findByIdAndUpdate(
        req.params.productId,
        req.body,
        {new: true})
        .exec()
        .then(updatedProject => {
            res.status(201).json(updatedProject)
        })
        .catch(err => {
            console.log(err)
        res.status(500).json({error: err})
        })
            //do something?
})

//PATCH FOR REFERENCE BUT NOT USING IT NOW
projectRouter.patch('/:productId', (req, res) =>{
    Project.findByIdAndUpdate(
        req.params.productId,
         {$set: req.body},
        {new: true}
    )
    .then(patchedProject => res.status(200).json(patchedProject))
    .catch(err => res.status(500).jason({error:err}))
})


//CREATE
projectRouter.post('/',(req, res) => {
    Project.create(req.body)
    .then(newCreatedProject => {
        const response = {
            project:{
                    title: newCreatedProject.title,
                    owner: newCreatedProject.owner,
                    repo_URL: newCreatedProject.repo_URL,
                    issues: newCreatedProject.issues,
                    numberOfIssues: newCreatedProject.issues.length,
                    issueStates: newCreatedProject.issueStates,
                    issueTypes: newCreatedProject.issueTypes,
                    request: {
                        type: 'GET',
                        unique_URL: req.protocol + '://' +req.get('host')+req.originalUrl+ newCreatedProject._id
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
projectRouter.get('/:productId', (req, res) =>{
    Project.findById(req.params.productId)
    .exec()
    .then(foundProject => {
        if(foundProject){
            const response = {
                project:{
                        title: foundProject.title,
                        owner: foundProject.owner,
                        repo_URL: foundProject.repo_URL,
                        issues: foundProject.issues,
                        numberOfIssues: foundProject.issues.length,
                        issueStates: foundProject.issueStates,
                        issueTypes: foundProject.issueTypes,
                        request: {
                            type: 'GET',
                            unique_URL: req.protocol + '://' +req.get('host')+req.originalUrl
                        },
                    }
                }
                res.status(200).json(response)
        }else{
            res.status(404).json({
                meessage: "No valid entry for provided ID"
            })
        }
    })
    .catch(err =>{
        console.log(err)
        res.status(500).json({error: err})
    })
})

module.exports = projectRouter