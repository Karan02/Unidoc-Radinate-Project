import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '../prisma.service';

// Zod validation schema
const AiOutputSchema = z.object({
  study_uid: z.string(), // ✅ corrected field name
  model_name: z.string(),
  model_version: z.string(),
  score: z.number(),
  pred_label: z.boolean(),
  timestamp_ai: z.string().datetime(),
});

@Controller('ingest')
export class AiController {
  constructor(private prisma: PrismaService) {}

  @Post('ai-outputs')
  async ingestAI(@Body() data: unknown) {
    const parsed = AiOutputSchema.parse(data);

    // 1️⃣ Ensure study exists (lookup by UID)
    const study = await this.prisma.study.findUnique({
      where: { study_uid: parsed.study_uid },
    });

    if (!study) {
      throw new NotFoundException(`Study with UID ${parsed.study_uid} not found`);
    }

    // 2️⃣ Insert AI output linked by study.id
    const aiOutput = await this.prisma.aIOutput.create({
      data: {
        study_id: study.id,
        finding: parsed.model_name, // You can rename 'finding' to something else if needed
        confidence: parsed.score,
        created_at: new Date(parsed.timestamp_ai),
      },
    });

    // 3️⃣ Record audit log
    await this.prisma.auditLog.create({
      data: {
        user: 'system',
        action: 'ingest_ai_output',
        entity: 'AIOutput',
        entity_id: aiOutput.id,
      },
    });

    return { success: true, id: aiOutput.id };
  }
}
