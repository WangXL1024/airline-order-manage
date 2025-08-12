import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// 假设 Order 接口在同目录或已正确导出，需补充实际路径
import { Order } from '../../shared/models/order.model'; 

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = '/api/orders'; 

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  pay(id: string): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/${id}/pay`, {});
  }

  cancel(id: string): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/${id}/cancel`, {});
  }
}