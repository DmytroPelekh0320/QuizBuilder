import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { QuizzesModule } from "./quizzes/quizzes.module";

@Module({
  imports: [PrismaModule, QuizzesModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
