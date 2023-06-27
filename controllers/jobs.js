const mongoose = require("mongoose");
const moment = require("moment");

const Job = require("../models/Job");
const {StatusCodes} = require("http-status-codes");
const {BadRequestError, NotFoundError} = require("../errors");

const showStats = async (req, res) => {
    const userId = req.user.userId;
    //console.log(userId);
    let stats = await Job.aggregate([
        {$match :{ userId: new mongoose.Types.ObjectId(userId)}}, 
        {$group: { _id: '$status', count: {$sum: 1}}},
    ])

    stats = stats.reduce((acc, it)=>{
        acc[it._id] = it.count;
        return acc
    }, {});
    //console.log(stats);

    const defaultStats = {
        pending: stats.pending || 0,
        interview: stats.interview || 0,
        declined: stats.declined || 0
    }

    let monthlyApplications = await Job.aggregate([
        {$match : {userId: new mongoose.Types.ObjectId(userId)}},
        {$group: {
            _id: {year: {$year:'$createdAt'}, month: {$month:'$createdAt'}},
            count: {$sum: 1}
        }},
        { $sort: { '_id.year': -1, '_id.month': -1}},
        { $limit: 6}
    ])

    monthlyApplications = monthlyApplications.map(it=>{
        const year = it._id.year;
        const month = it._id.month;
        const date = moment().month(month -1).year(year).format('MMM Y');
        const count = it.count;
        return {date, count}
    }).reverse();
    //console.log(monthlyApplications)

    res.status(StatusCodes.OK).json({
        defaultStats: defaultStats, 
        monthlyApplications: monthlyApplications
    })
}

const getAllJobs = async (req, res) =>{
    const userId = req.user.userId;

    const queryObject = {
        userId: userId
    };
    
    const {search, status, jobType, sort} = req.query;
    if (search) {
        queryObject.position = {
            $regex: search, 
            $options: 'i'
        }
    }

    if (status && status !== 'all') {
        queryObject.status = status;
    }

    if (jobType && jobType !== 'all') {
        queryObject.jobType = jobType;
    }

    let result = Job.find(queryObject);

    // sorting
    let sortVal = '-createdAt'
    switch (sort) {
        case 'latest':
            sortVal = '-createdAt';
            break;
        case 'oldest':
            sortVal = 'createdAt';
            break;
        case 'a-z':
            sortVal = 'position';
            break;  
        case 'z-a':
            sortVal = '-position';
            break; 
    }
    result = result.sort(sortVal);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * 10;
    
    result = result.skip(offset).limit(limit);
    
    //res.status(200).json(req.user);
    const jobs = await result;
    const totalJobs = await Job.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalJobs / limit);

    res.status(StatusCodes.OK).json({jobs, totalJobs, numOfPages})
}

const getJob = async (req, res) =>{
    const userId = req.user.userId;
    const jobId = req.params.id;
    const job = await Job.findOne({_id: jobId, userId});
    //console.log(job);
    if (!job) {
        throw new NotFoundError(`Not job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job});
}

const createJob = async (req, res) =>{
    req.body.userId = req.user.userId;
    //console.log(req.body, req.user)
    const job = await Job.create(req.body);
    //console.log(job)
    res.status(StatusCodes.CREATED).json(job)
}

const updateJob = async (req, res) =>{
    const userId = req.user.userId;
    const jobId = req.params.id;
    const updateParams = req.body;
    //console.log('here!!  ', updateParams, typeof updateParams);

    const availableToUpdate = ["company", "position", "status", "jobType", "jobLocation"];

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
    deleteJob,
    showStats
}