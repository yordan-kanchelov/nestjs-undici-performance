import http from 'k6/http';
import { check } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const fastifyAxiosDuration = new Trend('fastify_axios_duration', true);
const fastifyUndiciDuration = new Trend('fastify_undici_duration', true);
const expressAxiosDuration = new Trend('express_axios_duration', true);
const fastifyAxiosErrors = new Rate('fastify_axios_errors');
const fastifyUndiciErrors = new Rate('fastify_undici_errors');
const expressAxiosErrors = new Rate('express_axios_errors');

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
  },
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.1'],
  },
};

export function testExpressAxios() {
  const res = http.get('http://localhost:3004/api', {
    tags: { service: 'express-axios' },
  });
  
  const success = check(res, {
    'status is 200': (r) => r.status === 200,
    'has data': (r) => JSON.parse(r.body).data?.length === 5,
  });
  
  expressAxiosDuration.add(res.timings.duration);
  expressAxiosErrors.add(!success);
}

export function testFastifyAxios() {
  const res = http.get('http://localhost:3002/api', {
    tags: { service: 'fastify-axios' },
  });
  
  const success = check(res, {
    'status is 200': (r) => r.status === 200,
    'has data': (r) => JSON.parse(r.body).data?.length === 5,
  });
  
  fastifyAxiosDuration.add(res.timings.duration);
  fastifyAxiosErrors.add(!success);
}

export function testFastifyUndici() {
  const res = http.get('http://localhost:3003/api', {
    tags: { service: 'fastify-undici' },
  });
  
  const success = check(res, {
    'status is 200': (r) => r.status === 200,
    'has data': (r) => JSON.parse(r.body).data?.length === 5,
  });
  
  fastifyUndiciDuration.add(res.timings.duration);
  fastifyUndiciErrors.add(!success);
}

export function handleSummary(data) {
  // Extract metrics for both services
  const getMetrics = (prefix) => {
    const duration = data.metrics[`${prefix}_duration`];
    const errors = data.metrics[`${prefix}_errors`];
    
    if (!duration) return null;
    
    return {
      requests: duration.values.count,
      duration_avg: duration.values.avg,
      duration_med: duration.values.med,
      duration_p95: duration.values['p(95)'],
      duration_p99: duration.values['p(99)'],
      duration_min: duration.values.min,
      duration_max: duration.values.max,
      error_rate: errors ? errors.values.rate : 0,
      rps: duration.values.rate,
    };
  };
  
  const expressAxiosMetrics = getMetrics('express_axios') || {};
  const fastifyAxiosMetrics = getMetrics('fastify_axios') || {};
  const fastifyUndiciMetrics = getMetrics('fastify_undici') || {};
  
  // Calculate improvements
  const calcImprovement = (std, und) => {
    if (!std || !und || std === 0) return 'N/A';
    return ((std - und) / std * 100).toFixed(2);
  };
  
  // Helper to determine winner
  const getWinner = (metrics, compareFunc) => {
    const values = [
      { name: 'Express+Axios', value: metrics.express },
      { name: 'Fastify+Axios', value: metrics.fastify },
      { name: 'Fastify+Undici', value: metrics.undici }
    ].filter(m => m.value !== undefined && m.value !== null);
    
    if (values.length === 0) return 'N/A';
    
    const winner = values.reduce((best, curr) => 
      compareFunc(curr.value, best.value) ? curr : best
    );
    
    return winner.name;
  };
  
  // Create CSV content - Express as baseline
  const csv = [
    'Metric,Express+Axios (Baseline),Fastify+Axios,Fastify+Undici,Fastify+Axios vs Express+Axios (%),Fastify+Undici vs Express+Axios (%),Fastify+Undici vs Fastify+Axios (%),Winner',
    `Total Requests,${expressAxiosMetrics.requests || 0},${fastifyAxiosMetrics.requests || 0},${fastifyUndiciMetrics.requests || 0},,,,`,
    `Throughput (req/s),${(expressAxiosMetrics.rps || 0).toFixed(2)},${(fastifyAxiosMetrics.rps || 0).toFixed(2)},${(fastifyUndiciMetrics.rps || 0).toFixed(2)},${calcImprovement(fastifyAxiosMetrics.rps, expressAxiosMetrics.rps)},${calcImprovement(fastifyUndiciMetrics.rps, expressAxiosMetrics.rps)},${calcImprovement(fastifyUndiciMetrics.rps, fastifyAxiosMetrics.rps)},${getWinner({express: expressAxiosMetrics.rps, fastify: fastifyAxiosMetrics.rps, undici: fastifyUndiciMetrics.rps}, (a, b) => a > b)}`,
    `Avg Response Time (ms),${(expressAxiosMetrics.duration_avg || 0).toFixed(2)},${(fastifyAxiosMetrics.duration_avg || 0).toFixed(2)},${(fastifyUndiciMetrics.duration_avg || 0).toFixed(2)},${calcImprovement(expressAxiosMetrics.duration_avg, fastifyAxiosMetrics.duration_avg)},${calcImprovement(expressAxiosMetrics.duration_avg, fastifyUndiciMetrics.duration_avg)},${calcImprovement(fastifyAxiosMetrics.duration_avg, fastifyUndiciMetrics.duration_avg)},${getWinner({express: expressAxiosMetrics.duration_avg, fastify: fastifyAxiosMetrics.duration_avg, undici: fastifyUndiciMetrics.duration_avg}, (a, b) => a < b)}`,
    `Median Response Time (ms),${(expressAxiosMetrics.duration_med || 0).toFixed(2)},${(fastifyAxiosMetrics.duration_med || 0).toFixed(2)},${(fastifyUndiciMetrics.duration_med || 0).toFixed(2)},${calcImprovement(expressAxiosMetrics.duration_med, fastifyAxiosMetrics.duration_med)},${calcImprovement(expressAxiosMetrics.duration_med, fastifyUndiciMetrics.duration_med)},${calcImprovement(fastifyAxiosMetrics.duration_med, fastifyUndiciMetrics.duration_med)},${getWinner({express: expressAxiosMetrics.duration_med, fastify: fastifyAxiosMetrics.duration_med, undici: fastifyUndiciMetrics.duration_med}, (a, b) => a < b)}`,
    `P95 Response Time (ms),${(expressAxiosMetrics.duration_p95 || 0).toFixed(2)},${(fastifyAxiosMetrics.duration_p95 || 0).toFixed(2)},${(fastifyUndiciMetrics.duration_p95 || 0).toFixed(2)},${calcImprovement(expressAxiosMetrics.duration_p95, fastifyAxiosMetrics.duration_p95)},${calcImprovement(expressAxiosMetrics.duration_p95, fastifyUndiciMetrics.duration_p95)},${calcImprovement(fastifyAxiosMetrics.duration_p95, fastifyUndiciMetrics.duration_p95)},${getWinner({express: expressAxiosMetrics.duration_p95, fastify: fastifyAxiosMetrics.duration_p95, undici: fastifyUndiciMetrics.duration_p95}, (a, b) => a < b)}`,
    `P99 Response Time (ms),${(expressAxiosMetrics.duration_p99 || 0).toFixed(2)},${(fastifyAxiosMetrics.duration_p99 || 0).toFixed(2)},${(fastifyUndiciMetrics.duration_p99 || 0).toFixed(2)},${calcImprovement(expressAxiosMetrics.duration_p99, fastifyAxiosMetrics.duration_p99)},${calcImprovement(expressAxiosMetrics.duration_p99, fastifyUndiciMetrics.duration_p99)},${calcImprovement(fastifyAxiosMetrics.duration_p99, fastifyUndiciMetrics.duration_p99)},${getWinner({express: expressAxiosMetrics.duration_p99, fastify: fastifyAxiosMetrics.duration_p99, undici: fastifyUndiciMetrics.duration_p99}, (a, b) => a < b)}`,
    `Min Response Time (ms),${(expressAxiosMetrics.duration_min || 0).toFixed(2)},${(fastifyAxiosMetrics.duration_min || 0).toFixed(2)},${(fastifyUndiciMetrics.duration_min || 0).toFixed(2)},,,,`,
    `Max Response Time (ms),${(expressAxiosMetrics.duration_max || 0).toFixed(2)},${(fastifyAxiosMetrics.duration_max || 0).toFixed(2)},${(fastifyUndiciMetrics.duration_max || 0).toFixed(2)},${calcImprovement(expressAxiosMetrics.duration_max, fastifyAxiosMetrics.duration_max)},${calcImprovement(expressAxiosMetrics.duration_max, fastifyUndiciMetrics.duration_max)},${calcImprovement(fastifyAxiosMetrics.duration_max, fastifyUndiciMetrics.duration_max)},${getWinner({express: expressAxiosMetrics.duration_max, fastify: fastifyAxiosMetrics.duration_max, undici: fastifyUndiciMetrics.duration_max}, (a, b) => a < b)}`,
    `Error Rate (%),${((expressAxiosMetrics.error_rate || 0) * 100).toFixed(2)},${((fastifyAxiosMetrics.error_rate || 0) * 100).toFixed(2)},${((fastifyUndiciMetrics.error_rate || 0) * 100).toFixed(2)},,,${getWinner({express: expressAxiosMetrics.error_rate, fastify: fastifyAxiosMetrics.error_rate, undici: fastifyUndiciMetrics.error_rate}, (a, b) => a < b)}`,
  ].join('\n');
  
  // Create detailed summary
  const summary = {
    test_info: {
      node_version: 'Node.js 20',
      timestamp: new Date().toISOString(),
      duration_seconds: Math.round((data.state.testRunDurationMs || 0) / 1000),
      scenarios: ['express_axios', 'fastify_axios', 'fastify_undici'],
      max_vus: 100,
    },
    results: {
      express_axios: expressAxiosMetrics,
      fastify_axios: fastifyAxiosMetrics,
      fastify_undici: fastifyUndiciMetrics,
    },
    comparison: {
      fastify_axios_vs_express_axios: {
        throughput_improvement: calcImprovement(fastifyAxiosMetrics.rps, expressAxiosMetrics.rps) + '%',
        avg_response_improvement: calcImprovement(expressAxiosMetrics.duration_avg, fastifyAxiosMetrics.duration_avg) + '%',
        p95_response_improvement: calcImprovement(expressAxiosMetrics.duration_p95, fastifyAxiosMetrics.duration_p95) + '%',
        p99_response_improvement: calcImprovement(expressAxiosMetrics.duration_p99, fastifyAxiosMetrics.duration_p99) + '%',
      },
      fastify_undici_vs_express_axios: {
        throughput_improvement: calcImprovement(fastifyUndiciMetrics.rps, expressAxiosMetrics.rps) + '%',
        avg_response_improvement: calcImprovement(expressAxiosMetrics.duration_avg, fastifyUndiciMetrics.duration_avg) + '%',
        p95_response_improvement: calcImprovement(expressAxiosMetrics.duration_p95, fastifyUndiciMetrics.duration_p95) + '%',
        p99_response_improvement: calcImprovement(expressAxiosMetrics.duration_p99, fastifyUndiciMetrics.duration_p99) + '%',
      },
      fastify_undici_vs_fastify_axios: {
        throughput_improvement: calcImprovement(fastifyUndiciMetrics.rps, fastifyAxiosMetrics.rps) + '%',
        avg_response_improvement: calcImprovement(fastifyAxiosMetrics.duration_avg, fastifyUndiciMetrics.duration_avg) + '%',
        p95_response_improvement: calcImprovement(fastifyAxiosMetrics.duration_p95, fastifyUndiciMetrics.duration_p95) + '%',
        p99_response_improvement: calcImprovement(fastifyAxiosMetrics.duration_p99, fastifyUndiciMetrics.duration_p99) + '%',
      },
    },
  };
  
  return {
    'results/node20-performance-comparison.csv': csv,
    'results/node20-performance-summary.json': JSON.stringify(summary, null, 2),
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
  };
}

// Import required for text summary
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';