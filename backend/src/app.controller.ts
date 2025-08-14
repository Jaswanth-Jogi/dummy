import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-route')
  testRoute() {
    return { message: 'Test route is working!', timestamp: new Date() };
  }

  @Post('test-post')
  testPost() {
    return { message: 'Test POST route is working!', timestamp: new Date() };
  }

  @Get('debug-routes')
  debugRoutes() {
    return { 
      message: 'Debug routes', 
      timestamp: new Date(),
      availableRoutes: [
        'GET /',
        'GET /test-route', 
        'POST /test-post',
        'GET /debug-routes',
        'GET /simple-test',
        'GET /test/ping',
        'POST /test/add-sample-data',
        'GET /test/view-all-data',
        'DELETE /test/clear-all-data',
        'POST /users/create',
        'GET /users/all',
        'GET /users/profile',
        'POST /account/check-on-login',
        'GET /account/get-account'
      ]
    };
  }

  @Get('simple-test')
  simpleTest() {
    return { 
      message: 'Simple test endpoint working!', 
      timestamp: new Date(),
      status: 'OK'
    };
  }
}
