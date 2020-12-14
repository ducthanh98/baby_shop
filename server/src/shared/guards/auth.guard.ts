import {Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, Logger, Inject} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {AuthManager} from "../../database/manager/auth.manager";
import {Reflector} from "@nestjs/core";
import {PERMISSION_KEY} from "../../constant/permissions";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly authManager: AuthManager, private reflector: Reflector) {
    }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        if (!request.headers.authorization) {
            return false;
        }
        const obj = await this.validateToken(request.headers.authorization);
        request.user = obj['id']

        const permission = this.reflector.get<string>(PERMISSION_KEY, context.getHandler());
       if(permission){
           const code = `${request.method}_${permission}`

           const permissions = await this.authManager.getPermissions(obj['id']);

           const check = permissions.findIndex(x => x.code == code)

           if (check < 0) {
               return false
           }
       }

        return true;
    }

    async validateToken(token: string): Promise<string | object> {
        const splitToken = token.split(' ');
        if (splitToken[0] !== 'Bearer') {
            throw new HttpException('Invalid Token', HttpStatus.FORBIDDEN);
        }
        try {
            const decoded = await jwt.verify(splitToken[1], process.env.TOKEN_SECRET);

            return decoded;
        } catch (e) {
            Logger.error(`Error Token :`, e.stack, 'Auth Guard');
            throw new HttpException(`Error Token : ${e.message || e.name}`, HttpStatus.UNAUTHORIZED);
        }

    }
}
