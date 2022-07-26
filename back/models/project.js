//dependencies
const mongoose = require('mongoose')

//initialize schema variable
const Schema = mongoose.Schema

//Schema
const projectSchema = new Schema({
    title: String,
    owner: String,
    repo_URL: String,
    issues: Array,
    //numberOfIssues: Number,
    issueStates: Array,
    issueTypes: Array,
    },
    {timestamps: { createdAt: false, updatedAt: true },
    },
)
//Attempt at counting lenght
//projectSchema.virtual('numberOfIssues').get(()=>{return issues.length})
    

module.exports = mongoose.model('Project', projectSchema)