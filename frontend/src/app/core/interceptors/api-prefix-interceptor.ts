// api-prefix.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiPrefixInterceptor: HttpInterceptorFn = (req, next) => {
  // 处理URL拼接时的斜杠问题，确保不会出现双斜杠或缺少斜杠
  const baseUrl = environment.apiUrl.endsWith('/') ? environment.apiUrl : `${environment.apiUrl}/`;
  const relativeUrl = req.url.startsWith('/') ? req.url.substring(1) : req.url;
  
  // 拼接基础地址和相对路径
  const apiReq = req.clone({ 
    url: `${baseUrl}${relativeUrl}` 
  });
  
  return next(apiReq);
};
