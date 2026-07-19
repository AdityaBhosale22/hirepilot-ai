import ApiError from "../../utils/ApiError.js";
import companyRepository from "./company.repository.js";

class CompanyService {
  async create(ownerId, data) {
    const existingCompany =
      await companyRepository.findByOwnerId(ownerId);

    if (existingCompany) {
      throw new ApiError(
        409,
        "Recruiter already owns a company."
      );
    }

    const companyWithSameName =
      await companyRepository.findByName(data.name);

    if (companyWithSameName) {
      throw new ApiError(
        409,
        "Company name already exists."
      );
    }

    return companyRepository.create({
      ...data,
      ownerId,
    });
  }
}

export default new CompanyService();