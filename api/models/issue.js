//dependencies
const mongoose = require('mongoose')

//initialize schema variable
const Schema = mongoose.Schema

//Schema
const issueSchema = new Schema({
    title: String,
    body : String,
    status: {type: String, default: "IceBox"},
    completed: Boolean,
    type: String,
    priority: String,
    parentBoardId:{type: Schema.Types.ObjectId, ref: 'Board'},
    },
    {timestamps: { createdAt: false, updatedAt: true },
    },
)

module.exports = mongoose.model('Issue', issueSchema)