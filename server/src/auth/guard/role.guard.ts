import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { USER_TYPES } from "../../global/globalEnum";


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const role = this.reflector.getAllAndOverride<USER_TYPES>('role', [
            context.getHandler(),
            context.getClass()
        ])
        if (!role && role !== 0) return true;
        const request = context.switchToHttp().getRequest();
        const user = request.user
        return role >= user.type && user.type > -1
    }
}