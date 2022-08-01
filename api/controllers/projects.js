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
                    _id: project._id,
                    title: project.title,
                    owner: project.owner,
                    repo_URL: project.repo_URL,
                    boards: project.boards,
                    numberOfBoards: project.boards.length,
                    description: project.description,
                    timestamps: project.timestamps,
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
projectRouter.delete('/:projectId', (req, res) => {
    Project.findByIdAndDelete(req.params.projectId)
    .exec()
    .then(deletedProject =>{
        if(!deletedProject){
            return res.status(404).json({
                message: "Issue not found"
            })
        }
        res.status(202).json(deletedProject)
    })
    .catch(err => {console.log(err)
        res.status(500).json({
            error: err
        })
        })
})

//UPDATE
projectRouter.put('/:projectId', (req, res) => {
    Project.findByIdAndUpdate(
        req.params.projectId,
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
projectRouter.patch('/:projectId', (req, res) =>{
    Project.findByIdAndUpdate(
        req.params.projectId,
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
                    _id: newCreatedProject._id,
                    title: newCreatedProject.title,
                    owner: newCreatedProject.owner,
                    repo_URL: newCreatedProject.repo_URL,
                    boards: newCreatedProject.boards,
                    numberOfBoards: newCreatedProject.boards.length,
                    description: newCreatedProject.description,
                    timestamps: newCreatedProject.timestamps,
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
projectRouter.get('/:projectId', (req, res) =>{
    Project.findById(req.params.projectId)
    .exec()
    .then(foundProject => {
        if(foundProject){
            const response = {
                project:{
                        _id: foundProject._id,
                        title: foundProject.title,
                        owner: foundProject.owner,
                        repo_URL: foundProject.repo_URL,
                        boards: foundProject.boards,
                        numberOfBoards: foundProject.boards.length,
                        description: foundProject.description,
                        timestamps: foundProject.timestamps,
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

module.exports = projectRouter