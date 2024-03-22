import { Body, Controller, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfirmEmailDto, LoginDto, RegisterDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto)
    }

    // @Post('register')
    // register(@Body() registerDto: RegisterDto) {
    //     return this.authService.register(registerDto)
    // }

    // @Patch('confirm')
    // confirm(@Body() confirmEmailDto: ConfirmEmailDto) {
    //     return this.authService.confirm(confirmEmailDto)
    // }
}
