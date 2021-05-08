import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { AppConst } from './constants/app.constant'

@Module({
  imports: [
    TasksModule,
    MongooseModule.forRoot(AppConst.DB_CON_URL),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
