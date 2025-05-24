import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ClientsModule } from '@nestjs/microservices';
import { SERVICES_CONFIG } from 'src/config/services';

@Module({
  imports: [
    ClientsModule.register([
      {
        ...SERVICES_CONFIG.PRODUCTS_SERVICE,
      }
    ])
  ],
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService],
})
export class OrdersModule {}
