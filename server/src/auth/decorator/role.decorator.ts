import { SetMetadata } from "@nestjs/common";
import { USER_TYPES } from "../../global/globalEnum";

export const Role = (role: USER_TYPES) => SetMetadata('role', role)