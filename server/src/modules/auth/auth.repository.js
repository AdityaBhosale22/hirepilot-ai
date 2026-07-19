import prisma from "../../lib/prisma.js";

class AuthRepository {
  async findUserByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async registerUser(userData, role) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: userData,
      });

      if (role === "CANDIDATE") {
        await tx.candidateProfile.create({
          data: {
            userId: user.id,
          },
        });
      }

      if (role === "RECRUITER") {
        await tx.recruiterProfile.create({
          data: {
            userId: user.id,
          },
        });
      }

      return tx.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          avatar: true,
          role: true,
          isEmailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });
  }

  async updateRefreshToken(userId, refreshToken) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken,
      },
    });
  }

  async findUserWithPassword(email) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findUserById(id) {
    return prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatar: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

}

export default new AuthRepository();