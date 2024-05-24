import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

//PrismaService ZA VSE MODULE V PROJEKTU (NI POTREBEN IMPORT)
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
