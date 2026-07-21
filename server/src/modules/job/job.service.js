import ApiError from "../../utils/ApiError.js";
import jobRepository from "./job.repository.js";

class JobService {
    async create(userId, data) {
        // Find recruiter profile
        const recruiter = await jobRepository.findRecruiterProfile(userId);

        if (!recruiter) {
            throw new ApiError(404, "Recruiter profile not found.");
        }

        // Recruiter must belong to a company
        if (!recruiter.companyId) {
            throw new ApiError(
                409,
                "Recruiter is not associated with a company."
            );
        }

        // Extra business validation
        if (
            data.salaryMin !== undefined &&
            data.salaryMax !== undefined &&
            data.salaryMin > data.salaryMax
        ) {
            throw new ApiError(
                400,
                "Minimum salary cannot be greater than maximum salary."
            );
        }

        const job = await jobRepository.create({
            title: data.title,
            description: data.description,
            location: data.location,
            salaryMin: data.salaryMin,
            salaryMax: data.salaryMax,
            yearsOfExperience: data.yearsOfExperience,
            employmentType: data.employmentType,
            requiredSkills: data.requiredSkills,

            recruiterId: recruiter.id,
            companyId: recruiter.companyId,

            // Default status
            status: "DRAFT",
        });

        return job;
    }

    async getMyJobs(userId) {
        const recruiter = await jobRepository.findRecruiterProfile(userId);

        if (!recruiter) {
            throw new ApiError(404, "Recruiter profile not found.");
        }

        return jobRepository.findRecruiterJobs(recruiter.id);
    }

    async getJobById(jobId) {
        const job = await jobRepository.findById(jobId);

        if (!job) {
            throw new ApiError(404, "Job not found.");
        }

        return job;
    }

    async updateJob(userId, jobId, data) {
        const recruiter = await jobRepository.findRecruiterProfile(userId);

        if (!recruiter) {
            throw new ApiError(404, "Recruiter profile not found.");
        }

        const job = await jobRepository.findById(jobId);

        if (!job) {
            throw new ApiError(404, "Job not found.");
        }

        if (job.recruiterId !== recruiter.id) {
            throw new ApiError(
                403,
                "You can only update your own jobs."
            );
        }

        if (
            data.salaryMin &&
            data.salaryMax &&
            data.salaryMin > data.salaryMax
        ) {
            throw new ApiError(
                400,
                "Minimum salary cannot be greater than maximum salary."
            );
        }

        return jobRepository.update(jobId, data);
    }

    async updateJobStatus(userId, jobId, status) {
        const recruiter = await jobRepository.findRecruiterProfile(userId);

        if (!recruiter) {
            throw new ApiError(404, "Recruiter profile not found.");
        }

        const job = await jobRepository.findById(jobId);

        if (!job) {
            throw new ApiError(404, "Job not found.");
        }

        if (job.recruiterId !== recruiter.id) {
            throw new ApiError(
                403,
                "You can only update your own jobs."
            );
        }

        return jobRepository.update(jobId, {
            status,
        });
    }
}

export default new JobService();