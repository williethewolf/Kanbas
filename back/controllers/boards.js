//Dependencies
const boardRouter = require('express').Router()
const Board = require("../models/Board")
//const mongoose = require ("mongoose")

//ROUTES
//INDUCES

//INDEX
boardRouter.get('/', (req,res) =>{
    Board.find({})
    .exec()
    .then(allBoards => {
        const response = {
            count: allBoards.length,
            Boards: allBoards.map(board =>{
                return{
                    name: board.name,
                    issues: board.issues,
                    numberOfIssues: board.issues.length,
                    issueStates: board.issueStates,
                    issueTypes: board.issueTypes,
                    parentProjectId: board.parentProjectId,
                    timestamps: board.timestamps.updatedAt,
                    request: {
                        type: 'GET',
                        unique_URL: req.protocol + '://' +req.get('host')+req.originalUrl+"/"+ board._id
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
    //res.send("Boards index")
})
//NEW
boardRouter.get('/new', (req,res) => {

})

//DELETE
boardRouter.delete('/:boardId', (req, res) => {
    Board.findByIdAndDelete(req.params.boardId)
    .exec()
    .then(deletedBoard =>{
        if(!deletedBoard){
            return res.status(404).json({
                message: "Issue not found"
            })
        }
        res.status(202).json(deletedBoard)
    })
    .catch(err => {console.log(err)
        res.status(500).json({
            error: err
        })
        })
})

//UPDATE
boardRouter.put('/:boardId', (req, res) => {
    Board.findByIdAndUpdate(
        req.params.boardId,
        req.body,
        {new: true})
        .exec()
        .then(updatedBoard => {
            res.status(201).json(updatedBoard)
        })
        .catch(err => {
            console.log(err)
        res.status(500).json({error: err})
        })
            //do something?
})

//PATCH FOR REFERENCE BUT NOT USING IT NOW
boardRouter.patch('/:boardId', (req, res) =>{
    Board.findByIdAndUpdate(
        req.params.boardId,
         {$set: req.body},
        {new: true}
    )
    .then(patchedBoard => res.status(200).json(patchedBoard))
    .catch(err => res.status(500).jason({error:err}))
})


//CREATE
boardRouter.post('/',(req, res) => {
    Board.create(req.body)
    .then(newCreatedBoard => {
        const response = {
            board:{
                    name: newCreatedBoard.name,
                    issues: newCreatedBoard.issues,
                    numberOfIssues: newCreatedBoard.issues.length,
                    issueStates: newCreatedBoard.issueStates,
                    issueTypes: newCreatedBoard.issueTypes,
                    parentProjectId: newCreatedBoard.parentProjectId,
                    timestamps: newCreatedBoard.timestamps.updatedAt,
                    request: {
                        type: 'GET',
                        unique_URL: req.protocol + '://' +req.get('host')+req.originalUrl+ newCreatedBoard._id
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
boardRouter.get('/:boardId', (req, res) =>{
    Board.findById(req.params.boardId)
    .exec()
    .then(foundBoard => {
        if(foundBoard){
            const response = {
                board:{
                        name: foundBoard.name,
                        issues: foundBoard.issues,
                        numberOfIssues: foundBoard.issues.length,
                        issueStates: foundBoard.issueStates,
                        issueTypes: foundBoard.issueTypes,
                        parentProjectId: foundBoard.parentProjectId,
                        timestamps: foundBoard.timestamps.updatedAt,
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

module.exports = boardRouter