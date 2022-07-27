//dependencies
const mongoose = require('mongoose')

//initialize schema variable
const Schema = mongoose.Schema

//Schema
const issueSchema = new Schema({
    name: String,
    issues: Array,
    issueStates: Array,
    issueTypes: Array,
    parentProjectId:{type: Schema.Types.ObjectId, ref: 'Project'},
    },
    {timestamps: { createdAt: false, updatedAt: true },
    },
)

module.exports = mongoose.model('Issue', issueSchema)