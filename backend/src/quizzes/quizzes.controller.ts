import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";

import { CreateQuizDto } from "./dto/create-quiz.dto";
import { QuizzesService } from "./quizzes.service";

@Controller("quizzes")
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizzesService.create(createQuizDto);
  }

  @Get()
  findAll() {
    return this.quizzesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.quizzesService.findOne(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.quizzesService.remove(id);
  }
}
