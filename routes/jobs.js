const {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
    showStats
} = require("../controllers/jobs")
const restrictTestUser = require("../middleware/testUser");

const express = require("express");
const router = express.Router();

router.route('/')
        .get(getAllJobs)
        .post(restrictTestUser, createJob);

router.route('/stats')
        .get(showStats)

router.route('/:id')
        .get(getJob)
        .patch(restrictTestUser, updateJob)
        .delete(restrictTestUser, deleteJob)



module.exports = router