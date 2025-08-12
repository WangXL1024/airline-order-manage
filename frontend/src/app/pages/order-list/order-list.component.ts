import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // 导入CommonModule
import { DatePipe } from '@angular/common'; // 导入日期管道
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../shared/models/order.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    NzTableModule, 
    NzButtonModule, 
    NzTagModule, 
    NzDividerModule, 
    NzSpinModule,
    RouterModule
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderList implements OnInit {
  orders: Order[] = [];
  loading = true;

  constructor(
    private orderService: OrderService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        this.message.error('加载订单失败');
        this.loading = false;
      }
    });
  }

  // 保持getStatusTagColor和getStatusText方法不变
  getStatusTagColor(status: string): string {
    switch (status) {
      case 'PENDING_PAYMENT': return 'orange';
      case 'PAID': return 'blue';
      case 'TICKETED': return 'green';
      case 'CANCELLED': return 'red';
      default: return 'purple';
    }
  }

  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'PENDING_PAYMENT': '待支付',
      'PAID': '已支付',
      'TICKETING_IN_PROGRESS': '出票中',
      'TICKETING_FAILED': '出票失败',
      'TICKETED': '已出票',
      'CANCELLED': '已取消'
    };
    return statusMap[status] || status;
  }
}