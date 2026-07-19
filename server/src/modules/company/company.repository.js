import prisma from "../../config/db.js";

class CompanyRepository {
  async findByOwnerId(ownerId) {
    return prisma.company.findUnique({
      where: {
        ownerId,
      },
    });
  }

  async findByName(name) {
    return prisma.company.findUnique({
      where: {
        name,
      },
    });
  }

  async create(data) {
    return prisma.company.create({
      data,
    });
  }

  async update(id, data) {
    return prisma.company.update({
      where: {
        id,
      },
      data,
    });
  }
}

export default new CompanyRepository();