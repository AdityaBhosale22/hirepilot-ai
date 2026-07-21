import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import jobService from "./job.service.js";

const createJob = asyncHandler(async (req, res) => {
  const job = await jobService.create(
    req.user.id,
    req.body
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      "Job created successfully",
      {
        job,
      }
    )
  );
});

const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await jobService.getMyJobs(req.user.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Jobs fetched successfully",
      {
        jobs,
      }
    )
  );
});

const getJobById = asyncHandler(async (req, res) => {
  const job = await jobService.getJobById(
    req.params.id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Job fetched successfully",
      {
        job,
      }
    )
  );
});

const updateJob = asyncHandler(async (req, res) => {
  const job = await jobService.updateJob(
    req.user.id,
    req.params.id,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Job updated successfully",
      {
        job,
      }
    )
  );
});

const updateJobStatus = asyncHandler(async (req, res) => {
  const job = await jobService.updateJobStatus(
    req.user.id,
    req.params.id,
    req.body.status
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Job status updated successfully",
      {
        job,
      }
    )
  );
});

export {
  createJob,
  getMyJobs,
  getJobById,
  updateJob,
  updateJobStatus,
};