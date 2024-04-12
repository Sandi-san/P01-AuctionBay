import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

//vsi moduli v aplikaciji imajo dostop
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}
