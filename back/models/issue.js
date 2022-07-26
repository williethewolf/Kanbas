//dependencies
const mongoose = require('mongoose')

//initialize schema variable
const Schema = mongoose.Schema

//Schema
const issueSchema = new Schema({
    title: String,
    body : String,
    status: String,
    completed: Boolean,
    type: String,
    priority: String,
    },
    {timestamps: { createdAt: false, updatedAt: true },
    },
)

module.exports = mongoose.model('Issue', issueSchema)