const Job = require("../models/Job");
const {StatusCodes} = require("http-status-codes");
const {BadRequestError, NotFoundError} = require("../errors");

const getAllJobs = async (req, res) =>{
    const userId = req.user.userId;
    const jobs = await Job.find({userId}).sort('createdAt');
    //res.status(200).json(req.user);
    res.status(StatusCodes.OK).json(jobs)
}

const getJob = async (req, res) =>{
    const userId = req.user.userId;
    const jobId = req.params.id;
    const job = await Job.findOne({_id: jobId, userId});
    //console.log(job);
    if (!job) {
        throw new NotFoundError(`Not job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json(job);
}

const createJob = async (req, res) =>{
    req.body.userId = req.user.userId;
    console.log(req.body, req.user)
    const job = await Job.create(req.body);
    //console.log(job)
    res.status(StatusCodes.CREATED).json(job)
}

const updateJob = async (req, res) =>{
    const userId = req.user.userId;
    const jobId = req.params.id;
    const updateParams = req.body;
    //console.log('here!!  ', updateParams, typeof updateParams);

    const availableToUpdate = ["company", "position", "status"];

    Object.keys(updateParams).forEach(par=>{
        if (!availableToUpdate.includes(par)) {
            throw new BadRequestError(`Unable to update field '${par}'`)
        }
    })

    const job = await Job.findOneAndUpdate(
        {_id: jobId, userId}, 
        updateParams, 
        {new: true, runValidators:true}
        );
    
    if (!job) {
        throw new NotFoundError(`Not job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json(job)
}

const deleteJob = async (req, res) =>{
    const userId = req.user.userId;
    const jobId = req.params.id;
    const job = await Job.findOneAndDelete({_id: jobId, userId});
    if (!job) {
        throw new NotFoundError(`Not job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json(job)
}

module.exports = {
    getAllJobs, 
    getJob,
    createJob,
    updateJob,
    deleteJob
}