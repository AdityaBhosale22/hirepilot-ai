import prisma from "../../lib/prisma.js";

class JobRepository {
  async findRecruiterProfile(userId) {
    return prisma.recruiterProfile.findUnique({
      where: {
        userId,
      },
      include: {
        company: true,
      },
    });
  }

  async create(data) {
    return prisma.job.create({
      data,
      include: {
        company: true,
        recruiter: true,
      },
    });
  }

  async findById(id) {
    return prisma.job.findUnique({
      where: {
        id,
      },
      include: {
        company: true,
        recruiter: true,
      },
    });
  }

  async update(id, data) {
    return prisma.job.update({
      where: {
        id,
      },
      data,
      include: {
        company: true,
        recruiter: true,
      },
    });
  }

  async findRecruiterJobs(recruiterId) {
    return prisma.job.findMany({
      where: {
        recruiterId,
      },
      include: {
        company: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findMany(filters) {
    return prisma.job.findMany(filters);
  }
}

export default new JobRepository();