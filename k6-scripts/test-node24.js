import http from 'k6/http';
import { check } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics - No interceptors
const fastifyAxiosDuration = new Trend('fastify_axios_duration', true);
const fastifyUndiciDuration = new Trend('fastify_undici_duration', true);
const expressAxiosDuration = new Trend('express_axios_duration', true);
const fastifyAxiosErrors = new Rate('fastify_axios_errors');
const fastifyUndiciErrors = new Rate('fastify_undici_errors');
const expressAxiosErrors = new Rate('express_axios_errors');
const fastifyAxiosRequests = new Counter('fastify_axios_requests');
const fastifyUndiciRequests = new Counter('fastify_undici_requests');
const expressAxiosRequests = new Counter('express_axios_requests');

// Custom metrics - With interceptors
const expressAxiosInterceptorDuration = new Trend('express_axios_interceptor_duration', true);
const fastifyAxiosInterceptorDuration = new Trend('fastify_axios_interceptor_duration', true);
const fastifyUndiciInterceptorDuration = new Trend('fastify_undici_interceptor_duration', true);
const expressAxiosInterceptorErrors = new Rate('express_axios_interceptor_errors');
const fastifyAxiosInterceptorErrors = new Rate('fastify_axios_interceptor_errors');
const fastifyUndiciInterceptorErrors = new Rate('fastify_undici_interceptor_errors');
const expressAxiosInterceptorRequests = new Counter('express_axios_interceptor_requests');
const fastifyAxiosInterceptorRequests = new Counter('fastify_axios_interceptor_requests');
const fastifyUndiciInterceptorRequests = new Counter('fastify_undici_interceptor_requests');

export const options = {
  scenarios: {
    express_axios: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 50 },   // Ramp up
        { duration: '20s', target: 50 },   // Stay at 50 users
        { duration: '10s', target: 100 },  // Ramp to 100
        { duration: '20s', target: 100 },  // Stay at 100 users
        { duration: '10s', target: 0 },    // Ramp down
      ],
      exec: 'testExpressAxios',
    },
    fastify_axios: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 50 },   // Ramp up
        { duration: '20s', target: 50 },   // Stay at 50 users
        { duration: '10s', target: 100 },  // Ramp to 100
        { duration: '20s', target: 100 },  // Stay at 100 users
        { duration: '10s', target: 0 },    // Ramp down
      ],
      exec: 'testFastifyAxios',
      startTime: '1m15s',
    },
    fastify_undici: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 50 },   // Ramp up
        { duration: '20s', target: 50 },   // Stay at 50 users
        { duration: '10s', target: 100 },  // Ramp to 100
        { duration: '20s', target: 100 },  // Stay at 100 users
        { duration: '10s', target: 0 },    // Ramp down
      ],
      exec: 'testFastifyUndici',
      startTime: '2m30s',
    },
    express_axios_interceptor: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 50 },   // Ramp up
        { duration: '20s', target: 50 },   // Stay at 50 users
        { duration: '10s', target: 100 },  // Ramp to 100
        { duration: '20s', target: 100 },  // Stay at 100 users
        { duration: '10s', target: 0 },    // Ramp down
      ],
      exec: 'testExpressAxiosInterceptor',
      startTime: '3m45s',
    },
    fastify_axios_interceptor: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 50 },   // Ramp up
        { duration: '20s', target: 50 },   // Stay at 50 users
        { duration: '10s', target: 100 },  // Ramp to 100
        { duration: '20s', target: 100 },  // Stay at 100 users
        { duration: '10s', target: 0 },    // Ramp down
      ],
      exec: 'testFastifyAxiosInterceptor',
      startTime: '5m00s',
    },
    fastify_undici_interceptor: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 50 },   // Ramp up
        { duration: '20s', target: 50 },   // Stay at 50 users
        { duration: '10s', target: 100 },  // Ramp to 100
        { duration: '20s', target: 100 },  // Stay at 100 users
        { duration: '10s', target: 0 },    // Ramp down
      ],
      exec: 'testFastifyUndiciInterceptor',
      startTime: '6m15s',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.1'],
  },
};

// Test functions - No interceptors
export function testExpressAxios() {
  const res = http.get('http://localhost:3024/api', {
    tags: { service: 'express-axios-node24' },
  });
  
  const success = check(res, {
    'status is 200': (r) => r.status === 200,
    'has data': (r) => JSON.parse(r.body).data?.length === 5,
  });
  
  expressAxiosDuration.add(res.timings.duration);
  expressAxiosErrors.add(!success);
  expressAxiosRequests.add(1);
}

export function testFastifyAxios() {
  const res = http.get('http://localhost:3022/api', {
    tags: { service: 'fastify-axios-node24' },
  });
  
  const success = check(res, {
    'status is 200': (r) => r.status === 200,
    'has data': (r) => JSON.parse(r.body).data?.length === 5,
  });
  
  fastifyAxiosDuration.add(res.timings.duration);
  fastifyAxiosErrors.add(!success);
  fastifyAxiosRequests.add(1);
}

export function testFastifyUndici() {
  const res = http.get('http://localhost:3023/api', {
    tags: { service: 'fastify-undici-node24' },
  });
  
  const success = check(res, {
    'status is 200': (r) => r.status === 200,
    'has data': (r) => JSON.parse(r.body).data?.length === 5,
  });
  
  fastifyUndiciDuration.add(res.timings.duration);
  fastifyUndiciErrors.add(!success);
  fastifyUndiciRequests.add(1);
}

// Test functions - With interceptors
export function testExpressAxiosInterceptor() {
  const res = http.get('http://localhost:3025/api', {
    tags: { service: 'express-axios-interceptor-node24' },
  });
  
  const success = check(res, {
    'status is 200': (r) => r.status === 200,
    'has data': (r) => JSON.parse(r.body).data?.length === 5,
  });
  
  expressAxiosInterceptorDuration.add(res.timings.duration);
  expressAxiosInterceptorErrors.add(!success);
  expressAxiosInterceptorRequests.add(1);
}

export function testFastifyAxiosInterceptor() {
  const res = http.get('http://localhost:3026/api', {
    tags: { service: 'fastify-axios-interceptor-node24' },
  });
  
  const success = check(res, {
    'status is 200': (r) => r.status === 200,
    'has data': (r) => JSON.parse(r.body).data?.length === 5,
  });
  
  fastifyAxiosInterceptorDuration.add(res.timings.duration);
  fastifyAxiosInterceptorErrors.add(!success);
  fastifyAxiosInterceptorRequests.add(1);
}

export function testFastifyUndiciInterceptor() {
  const res = http.get('http://localhost:3027/api', {
    tags: { service: 'fastify-undici-interceptor-node24' },
  });
  
  const success = check(res, {
    'status is 200': (r) => r.status === 200,
    'has data': (r) => JSON.parse(r.body).data?.length === 5,
  });
  
  fastifyUndiciInterceptorDuration.add(res.timings.duration);
  fastifyUndiciInterceptorErrors.add(!success);
  fastifyUndiciInterceptorRequests.add(1);
}

export function handleSummary(data) {
  // Extract metrics for all services
  const getMetrics = (prefix) => {
    const duration = data.metrics[`${prefix}_duration`];
    const errors = data.metrics[`${prefix}_errors`];
    const requests = data.metrics[`${prefix}_requests`];
    
    if (!duration) return null;
    
    // Get request count from the counter metric
    const requestCount = requests ? requests.values.count : 0;
    
    // Calculate RPS based on total requests and scenario duration (70 seconds each)
    const scenarioDurationSeconds = 70; // Each scenario runs for 70 seconds
    const rps = requestCount / scenarioDurationSeconds;
    
    return {
      requests: requestCount,
      duration_avg: duration.values.avg,
      duration_med: duration.values.med,
      duration_p95: duration.values['p(95)'],
      duration_p99: duration.values['p(99)'],
      duration_min: duration.values.min,
      duration_max: duration.values.max,
      error_rate: errors ? errors.values.rate : 0,
      rps: rps,
    };
  };
  
  // Get metrics for all services
  const expressAxiosMetrics = getMetrics('express_axios') || {};
  const fastifyAxiosMetrics = getMetrics('fastify_axios') || {};
  const fastifyUndiciMetrics = getMetrics('fastify_undici') || {};
  const expressAxiosInterceptorMetrics = getMetrics('express_axios_interceptor') || {};
  const fastifyAxiosInterceptorMetrics = getMetrics('fastify_axios_interceptor') || {};
  const fastifyUndiciInterceptorMetrics = getMetrics('fastify_undici_interceptor') || {};
  
  // Calculate improvements
  const calcImprovement = (baseline, improved) => {
    if (!baseline || !improved || baseline === 0) return 'N/A';
    return ((baseline - improved) / baseline * 100).toFixed(2);
  };
  
  // Calculate throughput improvements (higher is better)
  const calcThroughputImprovement = (baseline, improved) => {
    if (!baseline || !improved || baseline === 0) return 'N/A';
    return (((improved - baseline) / baseline) * 100).toFixed(2);
  };
  
  // Helper to determine winner
  const getWinner = (metrics, compareFunc) => {
    const values = Object.entries(metrics)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([name, value]) => ({ name, value }));
    
    if (values.length === 0) return 'N/A';
    
    const winner = values.reduce((best, curr) => 
      compareFunc(curr.value, best.value) ? curr : best
    );
    
    return winner.name;
  };
  
  // Create CSV content - with all apps
  const csv = [
    'Metric,Express+Axios,Fastify+Axios,Fastify+Undici,Express+Axios+Interceptor,Fastify+Axios+Interceptor,Fastify+Undici+Interceptor,Winner (No Interceptor),Winner (With Interceptor)',
    `Total Requests,${expressAxiosMetrics.requests || 0},${fastifyAxiosMetrics.requests || 0},${fastifyUndiciMetrics.requests || 0},${expressAxiosInterceptorMetrics.requests || 0},${fastifyAxiosInterceptorMetrics.requests || 0},${fastifyUndiciInterceptorMetrics.requests || 0},,`,
    `Throughput (req/s),${(expressAxiosMetrics.rps || 0).toFixed(2)},${(fastifyAxiosMetrics.rps || 0).toFixed(2)},${(fastifyUndiciMetrics.rps || 0).toFixed(2)},${(expressAxiosInterceptorMetrics.rps || 0).toFixed(2)},${(fastifyAxiosInterceptorMetrics.rps || 0).toFixed(2)},${(fastifyUndiciInterceptorMetrics.rps || 0).toFixed(2)},${getWinner({'Express+Axios': expressAxiosMetrics.rps, 'Fastify+Axios': fastifyAxiosMetrics.rps, 'Fastify+Undici': fastifyUndiciMetrics.rps}, (a, b) => a > b)},${getWinner({'Express+Axios+Interceptor': expressAxiosInterceptorMetrics.rps, 'Fastify+Axios+Interceptor': fastifyAxiosInterceptorMetrics.rps, 'Fastify+Undici+Interceptor': fastifyUndiciInterceptorMetrics.rps}, (a, b) => a > b)}`,
    `Avg Response Time (ms),${(expressAxiosMetrics.duration_avg || 0).toFixed(2)},${(fastifyAxiosMetrics.duration_avg || 0).toFixed(2)},${(fastifyUndiciMetrics.duration_avg || 0).toFixed(2)},${(expressAxiosInterceptorMetrics.duration_avg || 0).toFixed(2)},${(fastifyAxiosInterceptorMetrics.duration_avg || 0).toFixed(2)},${(fastifyUndiciInterceptorMetrics.duration_avg || 0).toFixed(2)},${getWinner({'Express+Axios': expressAxiosMetrics.duration_avg, 'Fastify+Axios': fastifyAxiosMetrics.duration_avg, 'Fastify+Undici': fastifyUndiciMetrics.duration_avg}, (a, b) => a < b)},${getWinner({'Express+Axios+Interceptor': expressAxiosInterceptorMetrics.duration_avg, 'Fastify+Axios+Interceptor': fastifyAxiosInterceptorMetrics.duration_avg, 'Fastify+Undici+Interceptor': fastifyUndiciInterceptorMetrics.duration_avg}, (a, b) => a < b)}`,
    `Median Response Time (ms),${(expressAxiosMetrics.duration_med || 0).toFixed(2)},${(fastifyAxiosMetrics.duration_med || 0).toFixed(2)},${(fastifyUndiciMetrics.duration_med || 0).toFixed(2)},${(expressAxiosInterceptorMetrics.duration_med || 0).toFixed(2)},${(fastifyAxiosInterceptorMetrics.duration_med || 0).toFixed(2)},${(fastifyUndiciInterceptorMetrics.duration_med || 0).toFixed(2)},${getWinner({'Express+Axios': expressAxiosMetrics.duration_med, 'Fastify+Axios': fastifyAxiosMetrics.duration_med, 'Fastify+Undici': fastifyUndiciMetrics.duration_med}, (a, b) => a < b)},${getWinner({'Express+Axios+Interceptor': expressAxiosInterceptorMetrics.duration_med, 'Fastify+Axios+Interceptor': fastifyAxiosInterceptorMetrics.duration_med, 'Fastify+Undici+Interceptor': fastifyUndiciInterceptorMetrics.duration_med}, (a, b) => a < b)}`,
    `P95 Response Time (ms),${(expressAxiosMetrics.duration_p95 || 0).toFixed(2)},${(fastifyAxiosMetrics.duration_p95 || 0).toFixed(2)},${(fastifyUndiciMetrics.duration_p95 || 0).toFixed(2)},${(expressAxiosInterceptorMetrics.duration_p95 || 0).toFixed(2)},${(fastifyAxiosInterceptorMetrics.duration_p95 || 0).toFixed(2)},${(fastifyUndiciInterceptorMetrics.duration_p95 || 0).toFixed(2)},${getWinner({'Express+Axios': expressAxiosMetrics.duration_p95, 'Fastify+Axios': fastifyAxiosMetrics.duration_p95, 'Fastify+Undici': fastifyUndiciMetrics.duration_p95}, (a, b) => a < b)},${getWinner({'Express+Axios+Interceptor': expressAxiosInterceptorMetrics.duration_p95, 'Fastify+Axios+Interceptor': fastifyAxiosInterceptorMetrics.duration_p95, 'Fastify+Undici+Interceptor': fastifyUndiciInterceptorMetrics.duration_p95}, (a, b) => a < b)}`,
    `P99 Response Time (ms),${(expressAxiosMetrics.duration_p99 || 0).toFixed(2)},${(fastifyAxiosMetrics.duration_p99 || 0).toFixed(2)},${(fastifyUndiciMetrics.duration_p99 || 0).toFixed(2)},${(expressAxiosInterceptorMetrics.duration_p99 || 0).toFixed(2)},${(fastifyAxiosInterceptorMetrics.duration_p99 || 0).toFixed(2)},${(fastifyUndiciInterceptorMetrics.duration_p99 || 0).toFixed(2)},${getWinner({'Express+Axios': expressAxiosMetrics.duration_p99, 'Fastify+Axios': fastifyAxiosMetrics.duration_p99, 'Fastify+Undici': fastifyUndiciMetrics.duration_p99}, (a, b) => a < b)},${getWinner({'Express+Axios+Interceptor': expressAxiosInterceptorMetrics.duration_p99, 'Fastify+Axios+Interceptor': fastifyAxiosInterceptorMetrics.duration_p99, 'Fastify+Undici+Interceptor': fastifyUndiciInterceptorMetrics.duration_p99}, (a, b) => a < b)}`,
    `Min Response Time (ms),${(expressAxiosMetrics.duration_min || 0).toFixed(2)},${(fastifyAxiosMetrics.duration_min || 0).toFixed(2)},${(fastifyUndiciMetrics.duration_min || 0).toFixed(2)},${(expressAxiosInterceptorMetrics.duration_min || 0).toFixed(2)},${(fastifyAxiosInterceptorMetrics.duration_min || 0).toFixed(2)},${(fastifyUndiciInterceptorMetrics.duration_min || 0).toFixed(2)},,`,
    `Max Response Time (ms),${(expressAxiosMetrics.duration_max || 0).toFixed(2)},${(fastifyAxiosMetrics.duration_max || 0).toFixed(2)},${(fastifyUndiciMetrics.duration_max || 0).toFixed(2)},${(expressAxiosInterceptorMetrics.duration_max || 0).toFixed(2)},${(fastifyAxiosInterceptorMetrics.duration_max || 0).toFixed(2)},${(fastifyUndiciInterceptorMetrics.duration_max || 0).toFixed(2)},${getWinner({'Express+Axios': expressAxiosMetrics.duration_max, 'Fastify+Axios': fastifyAxiosMetrics.duration_max, 'Fastify+Undici': fastifyUndiciMetrics.duration_max}, (a, b) => a < b)},${getWinner({'Express+Axios+Interceptor': expressAxiosInterceptorMetrics.duration_max, 'Fastify+Axios+Interceptor': fastifyAxiosInterceptorMetrics.duration_max, 'Fastify+Undici+Interceptor': fastifyUndiciInterceptorMetrics.duration_max}, (a, b) => a < b)}`,
    `Error Rate (%),${((expressAxiosMetrics.error_rate || 0) * 100).toFixed(2)},${((fastifyAxiosMetrics.error_rate || 0) * 100).toFixed(2)},${((fastifyUndiciMetrics.error_rate || 0) * 100).toFixed(2)},${((expressAxiosInterceptorMetrics.error_rate || 0) * 100).toFixed(2)},${((fastifyAxiosInterceptorMetrics.error_rate || 0) * 100).toFixed(2)},${((fastifyUndiciInterceptorMetrics.error_rate || 0) * 100).toFixed(2)},${getWinner({'Express+Axios': expressAxiosMetrics.error_rate, 'Fastify+Axios': fastifyAxiosMetrics.error_rate, 'Fastify+Undici': fastifyUndiciMetrics.error_rate}, (a, b) => a < b)},${getWinner({'Express+Axios+Interceptor': expressAxiosInterceptorMetrics.error_rate, 'Fastify+Axios+Interceptor': fastifyAxiosInterceptorMetrics.error_rate, 'Fastify+Undici+Interceptor': fastifyUndiciInterceptorMetrics.error_rate}, (a, b) => a < b)}`,
  ].join('\n');
  
  // Create detailed summary
  const summary = {
    test_info: {
      node_version: 'Node.js 24',
      timestamp: new Date().toISOString(),
      duration_seconds: Math.round((data.state.testRunDurationMs || 0) / 1000),
      scenarios: ['express_axios', 'fastify_axios', 'fastify_undici', 'express_axios_interceptor', 'fastify_axios_interceptor', 'fastify_undici_interceptor'],
      max_vus: 100,
    },
    results: {
      express_axios: expressAxiosMetrics,
      fastify_axios: fastifyAxiosMetrics,
      fastify_undici: fastifyUndiciMetrics,
      express_axios_interceptor: expressAxiosInterceptorMetrics,
      fastify_axios_interceptor: fastifyAxiosInterceptorMetrics,
      fastify_undici_interceptor: fastifyUndiciInterceptorMetrics,
    },
    comparison: {
      // No interceptor comparisons
      fastify_axios_vs_express_axios: {
        throughput_improvement: calcThroughputImprovement(expressAxiosMetrics.rps, fastifyAxiosMetrics.rps) + '%',
        avg_response_improvement: calcImprovement(expressAxiosMetrics.duration_avg, fastifyAxiosMetrics.duration_avg) + '%',
        p95_response_improvement: calcImprovement(expressAxiosMetrics.duration_p95, fastifyAxiosMetrics.duration_p95) + '%',
        p99_response_improvement: calcImprovement(expressAxiosMetrics.duration_p99, fastifyAxiosMetrics.duration_p99) + '%',
      },
      fastify_undici_vs_express_axios: {
        throughput_improvement: calcThroughputImprovement(expressAxiosMetrics.rps, fastifyUndiciMetrics.rps) + '%',
        avg_response_improvement: calcImprovement(expressAxiosMetrics.duration_avg, fastifyUndiciMetrics.duration_avg) + '%',
        p95_response_improvement: calcImprovement(expressAxiosMetrics.duration_p95, fastifyUndiciMetrics.duration_p95) + '%',
        p99_response_improvement: calcImprovement(expressAxiosMetrics.duration_p99, fastifyUndiciMetrics.duration_p99) + '%',
      },
      fastify_undici_vs_fastify_axios: {
        throughput_improvement: calcThroughputImprovement(fastifyAxiosMetrics.rps, fastifyUndiciMetrics.rps) + '%',
        avg_response_improvement: calcImprovement(fastifyAxiosMetrics.duration_avg, fastifyUndiciMetrics.duration_avg) + '%',
        p95_response_improvement: calcImprovement(fastifyAxiosMetrics.duration_p95, fastifyUndiciMetrics.duration_p95) + '%',
        p99_response_improvement: calcImprovement(fastifyAxiosMetrics.duration_p99, fastifyUndiciMetrics.duration_p99) + '%',
      },
      // With interceptor comparisons
      interceptor_overhead: {
        express_axios: {
          throughput_impact: calcThroughputImprovement(expressAxiosMetrics.rps, expressAxiosInterceptorMetrics.rps) + '%',
          avg_response_impact: calcImprovement(expressAxiosInterceptorMetrics.duration_avg, expressAxiosMetrics.duration_avg) + '%',
        },
        fastify_axios: {
          throughput_impact: calcThroughputImprovement(fastifyAxiosMetrics.rps, fastifyAxiosInterceptorMetrics.rps) + '%',
          avg_response_impact: calcImprovement(fastifyAxiosInterceptorMetrics.duration_avg, fastifyAxiosMetrics.duration_avg) + '%',
        },
        fastify_undici: {
          throughput_impact: calcThroughputImprovement(fastifyUndiciMetrics.rps, fastifyUndiciInterceptorMetrics.rps) + '%',
          avg_response_impact: calcImprovement(fastifyUndiciInterceptorMetrics.duration_avg, fastifyUndiciMetrics.duration_avg) + '%',
        },
      },
    },
  };
  
  return {
    'results/node24-performance-comparison.csv': csv,
    'results/node24-performance-summary.json': JSON.stringify(summary, null, 2),
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
  };
}

// Import required for text summary
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';