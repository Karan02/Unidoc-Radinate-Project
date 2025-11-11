import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { StudyService } from './study.service';

@Controller('studies')
export class StudyController {
  constructor(private readonly studyService: StudyService) {}

  // GET /studies
  @Get()
  async getAllStudies() {
    return this.studyService.findAll();
  }

  // GET /studies/:id
  @Get(':id')
  async getStudyById(@Param('id') id: string) {
    const study = await this.studyService.findById(Number(id));
    if (!study) throw new NotFoundException('Study not found');
    return study;
  }
}
