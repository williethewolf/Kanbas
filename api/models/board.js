//dependencies
const mongoose = require('mongoose')

//initialize schema variable
const Schema = mongoose.Schema

//Schema
const issueSchema = new Schema({
    name: String,
    issues: Array,
    issueStates: {type: Array, default: ["IceBox","To-do", "Done"]},
    issueTypes: Array,
    parentProjectId:{type: Schema.Types.ObjectId, ref: 'Project'},
    description: String,
    },
    {timestamps: { createdAt: false, updatedAt: true },
    },
)

module.exports = mongoose.model('Board', issueSchema)