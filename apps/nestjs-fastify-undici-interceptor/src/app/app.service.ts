import { Injectable } from '@nestjs/common';
import { HttpService } from 'nestjs-undici-interceptors';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  async getData(): Promise<any> {
    const mockServiceUrl = process.env.MOCK_SERVICE_URL || 'http://localhost:3001/api/data';
    
    const requests = [
      firstValueFrom(this.httpService.request(mockServiceUrl)),
      firstValueFrom(this.httpService.request(mockServiceUrl)),
      firstValueFrom(this.httpService.request(mockServiceUrl)),
      firstValueFrom(this.httpService.request(mockServiceUrl)),
      firstValueFrom(this.httpService.request(mockServiceUrl)),
    ];

    const startTime = Date.now();
    const results = await Promise.all(requests);
    const endTime = Date.now();

    return {
      message: 'Fastify Undici Interceptor Response',
      data: results.map(res => res.body.json),
      duration: endTime - startTime,
      timestamp: new Date().toISOString(),
    };
  }
}