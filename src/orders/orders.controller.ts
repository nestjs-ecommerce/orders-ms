import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaginationOrderOptionsDto } from './dto/pagination-options-order.dto';
import { SERVICES_CONFIG } from 'src/config/services';

@Controller()
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService
  ) { }

  @MessagePattern({
    cmd: 'create_order',
  })
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @MessagePattern({
    cmd: 'find_all_orders',
  })
  findAll(@Payload() paginationOrderOptions: PaginationOrderOptionsDto) {
    return this.ordersService.findAll(paginationOrderOptions);
  }

  @MessagePattern({
    cmd: 'find_one_order',
  })
  findOne(@Payload('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern({
    cmd: 'update_order',
  })
  update(@Payload() updateOrderDto: UpdateOrderDto, @Payload('id') id: string) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @MessagePattern({
    cmd: 'remove_order',
  })
  remove(@Payload() id: string) {
    return this.ordersService.remove(id);
  }
}
