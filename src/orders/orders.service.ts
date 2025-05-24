import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationOrderOptionsDto } from './dto/pagination-options-order.dto';
import { paginatePrisma } from 'src/common/utils/pagination.util';
import { Order } from 'generated/prisma';
import { OrderDto } from './dto/order.dto';
import { PaginationDto } from 'src/common/dto/pagination/pagination.dto';
import { SERVICES_CONFIG } from 'src/config/services';
import { firstValueFrom } from 'rxjs';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(SERVICES_CONFIG.PRODUCTS_SERVICE.name)
    private readonly productsClient: ClientProxy,
  ) { }

  async create(createOrderDto: CreateOrderDto) {
    try {
      const { items } = createOrderDto;

      const productIds = items.map(item => item.productId);

      const products = await firstValueFrom<ProductDto[]>(
        this.productsClient.send({ cmd: 'validate_products' }, productIds)
      )


      const order = await this.prismaService.order.create({
        data: {
          totalAmount: createOrderDto.items.reduce((acc, item) => acc + item.price * item.quantity, 0),
          totalItems: createOrderDto.items.reduce((acc, item) => acc + item.quantity, 0),
          OrderItem: {
            createMany: {
              data: createOrderDto.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: products.find(product => product.id === item.productId)?.price || 0,
              })),
            }
          },
        },
        select: {
          OrderItem: {
            select: {
              price: true,
              quantity: true,
              productId: true,
            }
          },
          id: true,
          totalAmount: true,
          totalItems: true,
        }
      });

      this.logger.log('Order created successfully', order);

      return {
        ...order,
        OrderItem: order.OrderItem.map(item => ({
          ...item,
          product: products.find(product => product.id === item.productId),
        })),
      }
    } catch (error) {
      this.logger.error('Error creating order', error);

      throw new RpcException({
        code: error.code || HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to create order',
        error: error.message,
      });
    }
  }

  async findAll(paginationOrderOptions: PaginationOrderOptionsDto): Promise<PaginationDto<OrderDto>> {
    try {
      return await paginatePrisma(
        this.prismaService.order,
        paginationOrderOptions,
        {},
        (order: Order) => new OrderDto({
          id: order.id,
          totalAmount: order.totalAmount,
          totalItems: order.totalItems,
          isPaid: order.isPaid,
          paidAt: order.paidAt,
          status: order.status,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        }),
      );
    } catch (error) {
      this.logger.error('Error fetching orders', error);
      throw new RpcException({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to fetch orders',
      });
    }
  }

  async findOne(id: string) {
    try {
      const order = await this.prismaService.order.findUnique({
        where: {
          id: id,
        },
        include: {
          OrderItem: {
            select: {
              id: true,
              productId: true,
            }
          }
        }
      });

      if (!order) {
        throw new RpcException({
          code: HttpStatus.NOT_FOUND,
          message: 'Order not found',
        });
      }

      const productsIds = order?.OrderItem.map(item => item.productId);

      const products = await firstValueFrom<ProductDto[]>(
        this.productsClient.send({ cmd: 'validate_products' }, productsIds)
      )

      if (!products) {
        throw new RpcException({
          code: HttpStatus.NOT_FOUND,
          message: 'Order or products not found',
        });
      }

      return {
        ...order,
        OrderItem: order.OrderItem.map(item => ({
          ...item,
          product: products.find(product => product.id === item.productId),
        })),
      }
    } catch (error) {
      this.logger.error('Error fetching order', error);

      throw new RpcException({
        code: error.code || HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to fetch order',
        error: error.message,
      });
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      await this.findOne(id);

      const order = await this.prismaService.order.update({
        where: { id },
        data: updateOrderDto,
      });

      return new OrderDto(order);
    } catch (error) {
      this.logger.error('Error updating order', error);

      throw new RpcException({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to update order',
        error: error.message,
      });
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);

      await this.prismaService.order.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error('Error removing order', error);

      throw new RpcException({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to remove order',
        error: error.message,
      });
    }
  }
}
