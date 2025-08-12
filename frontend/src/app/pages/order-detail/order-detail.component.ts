import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // 导入CommonModule
import { DatePipe } from '@angular/common'; // 导入日期管道
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../shared/models/order.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule, // 关键：提供*ngIf指令
    DatePipe, // 关键：提供date管道
    NzCardModule, 
    NzTagModule, 
    NzButtonModule, 
    NzSpinModule, 
    RouterModule
  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetail implements OnInit {
  order?: Order; // 可能为undefined
  loading = true;
  isProcessing = false;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadOrderDetail(id);
    }
  }

  loadOrderDetail(id: string): void {
    this.loading = true;
    this.orderService.getOrderById(id).subscribe({
      next: (data) => {
        this.order = data;
        this.loading = false;
      },
      error: (err) => {
        this.message.error('加载订单详情失败');
        this.loading = false;
      }
    });
  }

  // 保持getStatusTagColor、getStatusText、handlePay、handleCancel方法不变
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

  handlePay(): void {
    if (!this.order) return;
    this.isProcessing = true;
    this.orderService.pay(this.order.id.toString()).subscribe({
      next: (updatedOrder) => {
        this.order = updatedOrder;
        this.isProcessing = false;
        this.message.success('支付成功');
      },
      error: () => {
        this.isProcessing = false;
        this.message.error('支付失败');
      }
    });
  }

  handleCancel(): void {
    if (!this.order) return;
    this.isProcessing = true;
    this.orderService.cancel(this.order.id.toString()).subscribe({
      next: (updatedOrder) => {
        this.order = updatedOrder;
        this.isProcessing = false;
        this.message.success('取消成功');
      },
      error: () => {
        this.isProcessing = false;
        this.message.error('取消失败');
      }
    });
  }

  canPay(): boolean {
    return this.order?.status === 'PENDING_PAYMENT';
  }

  canCancel(): boolean {
    return ['PENDING_PAYMENT', 'PAID', 'TICKETING_IN_PROGRESS'].includes(this.order?.status || '');
  }
}