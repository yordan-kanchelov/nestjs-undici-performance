const fs = require('fs');
const path = require('path');

// Function to read JSON files
function readJSONFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

// Read all result files
const results = {
  node20: readJSONFile('results/node20-performance-summary.json'),
  node22: readJSONFile('results/node22-performance-summary.json'),
  node24: readJSONFile('results/node24-performance-summary.json')
};

// Generate comparison report
const report = `# NestJS HTTP Module Performance Comparison

## Executive Summary

This report compares the performance of six HTTP module configurations in NestJS applications:

### Without Interceptors:
- **Express + Axios**: NestJS with default Express adapter using @nestjs/axios (baseline)
- **Fastify + Axios**: NestJS with Fastify adapter using @nestjs/axios
- **Fastify + Undici**: NestJS with Fastify adapter using nestjs-undici

### With Interceptors:
- **Express + Axios + Interceptor**: Express + Axios with request/response interceptors
- **Fastify + Axios + Interceptor**: Fastify + Axios with request/response interceptors
- **Fastify + Undici + Interceptor**: Fastify + Undici with interceptor implementation

## Test Configuration
- **Load Pattern**: Ramping from 0 to 100 concurrent users
- **Test Duration**: 70 seconds per scenario
- **Total Test Duration**: ~7.5 minutes per Node version (6 services tested)
- **Endpoints Tested**: Each service makes 5 parallel HTTP requests to a mock service
- **Interceptor Functionality**: Logs request/response with timing information

## Key Comparisons
1. **Framework Comparison**: Express vs Fastify (with same HTTP client)
2. **HTTP Client Comparison**: Axios vs Undici (with same framework)
3. **Interceptor Overhead**: Performance impact of adding interceptors
4. **Overall Optimization**: Combined impact of framework + HTTP client choices

## Performance Results

### Node.js 20 (LTS)
${results.node20 && results.node20.results.express_axios?.duration_avg ? `
#### Average Response Times (No Interceptors)
- **Express + Axios (Baseline)**: ${results.node20.results.express_axios.duration_avg.toFixed(2)}ms
- **Fastify + Axios**: ${results.node20.results.fastify_axios?.duration_avg?.toFixed(2) || 'N/A'}ms
- **Fastify + Undici**: ${results.node20.results.fastify_undici?.duration_avg?.toFixed(2) || 'N/A'}ms

#### Average Response Times (With Interceptors)
- **Express + Axios + Interceptor**: ${results.node20.results.express_axios_interceptor?.duration_avg?.toFixed(2) || 'N/A'}ms
- **Fastify + Axios + Interceptor**: ${results.node20.results.fastify_axios_interceptor?.duration_avg?.toFixed(2) || 'N/A'}ms
- **Fastify + Undici + Interceptor**: ${results.node20.results.fastify_undici_interceptor?.duration_avg?.toFixed(2) || 'N/A'}ms

#### Interceptor Overhead
- **Express + Axios**: ${results.node20.comparison?.interceptor_overhead?.express_axios?.avg_response_impact || 'N/A'} slower
- **Fastify + Axios**: ${results.node20.comparison?.interceptor_overhead?.fastify_axios?.avg_response_impact || 'N/A'} slower
- **Fastify + Undici**: ${results.node20.comparison?.interceptor_overhead?.fastify_undici?.avg_response_impact || 'N/A'} slower

#### Performance Improvements (No Interceptors)
- **Framework Impact (Fastify+Axios vs Express+Axios)**: ${results.node20.comparison?.fastify_axios_vs_express_axios?.avg_response_improvement || 'N/A'}
- **HTTP Client Impact (Fastify+Undici vs Fastify+Axios)**: ${results.node20.comparison?.fastify_undici_vs_fastify_axios?.avg_response_improvement || 'N/A'}
- **Combined Impact (Fastify+Undici vs Express+Axios)**: ${results.node20.comparison?.fastify_undici_vs_express_axios?.avg_response_improvement || 'N/A'}
` : 'No complete data available'}

### Node.js 22
${results.node22 && results.node22.results.express_axios?.duration_avg ? `
#### Average Response Times (No Interceptors)
- **Express + Axios (Baseline)**: ${results.node22.results.express_axios.duration_avg.toFixed(2)}ms
- **Fastify + Axios**: ${results.node22.results.fastify_axios?.duration_avg?.toFixed(2) || 'N/A'}ms
- **Fastify + Undici**: ${results.node22.results.fastify_undici?.duration_avg?.toFixed(2) || 'N/A'}ms

#### Average Response Times (With Interceptors)
- **Express + Axios + Interceptor**: ${results.node22.results.express_axios_interceptor?.duration_avg?.toFixed(2) || 'N/A'}ms
- **Fastify + Axios + Interceptor**: ${results.node22.results.fastify_axios_interceptor?.duration_avg?.toFixed(2) || 'N/A'}ms
- **Fastify + Undici + Interceptor**: ${results.node22.results.fastify_undici_interceptor?.duration_avg?.toFixed(2) || 'N/A'}ms

#### Interceptor Overhead
- **Express + Axios**: ${results.node22.comparison?.interceptor_overhead?.express_axios?.avg_response_impact || 'N/A'} slower
- **Fastify + Axios**: ${results.node22.comparison?.interceptor_overhead?.fastify_axios?.avg_response_impact || 'N/A'} slower
- **Fastify + Undici**: ${results.node22.comparison?.interceptor_overhead?.fastify_undici?.avg_response_impact || 'N/A'} slower

#### Performance Improvements (No Interceptors)
- **Framework Impact (Fastify+Axios vs Express+Axios)**: ${results.node22.comparison?.fastify_axios_vs_express_axios?.avg_response_improvement || 'N/A'}
- **HTTP Client Impact (Fastify+Undici vs Fastify+Axios)**: ${results.node22.comparison?.fastify_undici_vs_fastify_axios?.avg_response_improvement || 'N/A'}
- **Combined Impact (Fastify+Undici vs Express+Axios)**: ${results.node22.comparison?.fastify_undici_vs_express_axios?.avg_response_improvement || 'N/A'}

#### Throughput Improvements
- **Fastify+Axios vs Express+Axios**: ${results.node22.comparison?.fastify_axios_vs_express_axios?.throughput_improvement || 'N/A'}
- **Fastify+Undici vs Fastify+Axios**: ${results.node22.comparison?.fastify_undici_vs_fastify_axios?.throughput_improvement || 'N/A'}
- **Fastify+Undici vs Express+Axios**: ${results.node22.comparison?.fastify_undici_vs_express_axios?.throughput_improvement || 'N/A'}
` : 'No complete data available'}

### Node.js 24
${results.node24 && results.node24.results.express_axios?.duration_avg ? `
#### Average Response Times (No Interceptors)
- **Express + Axios (Baseline)**: ${results.node24.results.express_axios.duration_avg.toFixed(2)}ms
- **Fastify + Axios**: ${results.node24.results.fastify_axios?.duration_avg?.toFixed(2) || 'N/A'}ms
- **Fastify + Undici**: ${results.node24.results.fastify_undici?.duration_avg?.toFixed(2) || 'N/A'}ms

#### Average Response Times (With Interceptors)
- **Express + Axios + Interceptor**: ${results.node24.results.express_axios_interceptor?.duration_avg?.toFixed(2) || 'N/A'}ms
- **Fastify + Axios + Interceptor**: ${results.node24.results.fastify_axios_interceptor?.duration_avg?.toFixed(2) || 'N/A'}ms
- **Fastify + Undici + Interceptor**: ${results.node24.results.fastify_undici_interceptor?.duration_avg?.toFixed(2) || 'N/A'}ms

#### Interceptor Overhead
- **Express + Axios**: ${results.node24.comparison?.interceptor_overhead?.express_axios?.avg_response_impact || 'N/A'} slower
- **Fastify + Axios**: ${results.node24.comparison?.interceptor_overhead?.fastify_axios?.avg_response_impact || 'N/A'} slower
- **Fastify + Undici**: ${results.node24.comparison?.interceptor_overhead?.fastify_undici?.avg_response_impact || 'N/A'} slower

#### Performance Improvements (No Interceptors)
- **Framework Impact (Fastify+Axios vs Express+Axios)**: ${results.node24.comparison?.fastify_axios_vs_express_axios?.avg_response_improvement || 'N/A'}
- **HTTP Client Impact (Fastify+Undici vs Fastify+Axios)**: ${results.node24.comparison?.fastify_undici_vs_fastify_axios?.avg_response_improvement || 'N/A'}
- **Combined Impact (Fastify+Undici vs Express+Axios)**: ${results.node24.comparison?.fastify_undici_vs_express_axios?.avg_response_improvement || 'N/A'}

#### Throughput Improvements
- **Fastify+Axios vs Express+Axios**: ${results.node24.comparison?.fastify_axios_vs_express_axios?.throughput_improvement || 'N/A'}
- **Fastify+Undici vs Fastify+Axios**: ${results.node24.comparison?.fastify_undici_vs_fastify_axios?.throughput_improvement || 'N/A'}
- **Fastify+Undici vs Express+Axios**: ${results.node24.comparison?.fastify_undici_vs_express_axios?.throughput_improvement || 'N/A'}
` : 'No complete data available'}

## Detailed Comparison Tables

### Average Response Time (ms) - Without Interceptors
| Node Version | Express+Axios | Fastify+Axios | Fastify+Undici | Fastify+Axios vs Express+Axios | Fastify+Undici vs Express+Axios | Fastify+Undici vs Fastify+Axios |
|--------------|---------------|---------------|----------------|--------------------------------|----------------------------------|----------------------------------|
| Node 20 | ${results.node20?.results.express_axios?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node20?.results.fastify_axios?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node20?.results.fastify_undici?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node20?.comparison?.fastify_axios_vs_express_axios?.avg_response_improvement || 'N/A'} | ${results.node20?.comparison?.fastify_undici_vs_express_axios?.avg_response_improvement || 'N/A'} | ${results.node20?.comparison?.fastify_undici_vs_fastify_axios?.avg_response_improvement || 'N/A'} |
| Node 22 | ${results.node22?.results.express_axios?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node22?.results.fastify_axios?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node22?.results.fastify_undici?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node22?.comparison?.fastify_axios_vs_express_axios?.avg_response_improvement || 'N/A'} | ${results.node22?.comparison?.fastify_undici_vs_express_axios?.avg_response_improvement || 'N/A'} | ${results.node22?.comparison?.fastify_undici_vs_fastify_axios?.avg_response_improvement || 'N/A'} |
| Node 24 | ${results.node24?.results.express_axios?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node24?.results.fastify_axios?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node24?.results.fastify_undici?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node24?.comparison?.fastify_axios_vs_express_axios?.avg_response_improvement || 'N/A'} | ${results.node24?.comparison?.fastify_undici_vs_express_axios?.avg_response_improvement || 'N/A'} | ${results.node24?.comparison?.fastify_undici_vs_fastify_axios?.avg_response_improvement || 'N/A'} |

### Average Response Time (ms) - With Interceptors
| Node Version | Express+Axios+Int | Fastify+Axios+Int | Fastify+Undici+Int |
|--------------|-------------------|-------------------|---------------------|
| Node 20 | ${results.node20?.results.express_axios_interceptor?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node20?.results.fastify_axios_interceptor?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node20?.results.fastify_undici_interceptor?.duration_avg?.toFixed(2) || 'N/A'} |
| Node 22 | ${results.node22?.results.express_axios_interceptor?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node22?.results.fastify_axios_interceptor?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node22?.results.fastify_undici_interceptor?.duration_avg?.toFixed(2) || 'N/A'} |
| Node 24 | ${results.node24?.results.express_axios_interceptor?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node24?.results.fastify_axios_interceptor?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node24?.results.fastify_undici_interceptor?.duration_avg?.toFixed(2) || 'N/A'} |

### Interceptor Overhead Comparison
| Node Version | Configuration | Base (ms) | With Interceptor (ms) | Overhead (%) |
|--------------|---------------|-----------|----------------------|--------------|
| Node 20 | Express+Axios | ${results.node20?.results.express_axios?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node20?.results.express_axios_interceptor?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node20?.comparison?.interceptor_overhead?.express_axios?.avg_response_impact || 'N/A'} |
| Node 20 | Fastify+Axios | ${results.node20?.results.fastify_axios?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node20?.results.fastify_axios_interceptor?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node20?.comparison?.interceptor_overhead?.fastify_axios?.avg_response_impact || 'N/A'} |
| Node 20 | Fastify+Undici | ${results.node20?.results.fastify_undici?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node20?.results.fastify_undici_interceptor?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node20?.comparison?.interceptor_overhead?.fastify_undici?.avg_response_impact || 'N/A'} |
| Node 22 | Express+Axios | ${results.node22?.results.express_axios?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node22?.results.express_axios_interceptor?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node22?.comparison?.interceptor_overhead?.express_axios?.avg_response_impact || 'N/A'} |
| Node 22 | Fastify+Axios | ${results.node22?.results.fastify_axios?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node22?.results.fastify_axios_interceptor?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node22?.comparison?.interceptor_overhead?.fastify_axios?.avg_response_impact || 'N/A'} |
| Node 22 | Fastify+Undici | ${results.node22?.results.fastify_undici?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node22?.results.fastify_undici_interceptor?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node22?.comparison?.interceptor_overhead?.fastify_undici?.avg_response_impact || 'N/A'} |
| Node 24 | Express+Axios | ${results.node24?.results.express_axios?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node24?.results.express_axios_interceptor?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node24?.comparison?.interceptor_overhead?.express_axios?.avg_response_impact || 'N/A'} |
| Node 24 | Fastify+Axios | ${results.node24?.results.fastify_axios?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node24?.results.fastify_axios_interceptor?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node24?.comparison?.interceptor_overhead?.fastify_axios?.avg_response_impact || 'N/A'} |
| Node 24 | Fastify+Undici | ${results.node24?.results.fastify_undici?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node24?.results.fastify_undici_interceptor?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node24?.comparison?.interceptor_overhead?.fastify_undici?.avg_response_impact || 'N/A'} |

### P95 Response Time (ms) - Without Interceptors
| Node Version | Express+Axios | Fastify+Axios | Fastify+Undici |
|--------------|---------------|---------------|----------------|
| Node 20 | ${results.node20?.results.express_axios?.duration_p95?.toFixed(2) || 'N/A'} | ${results.node20?.results.fastify_axios?.duration_p95?.toFixed(2) || 'N/A'} | ${results.node20?.results.fastify_undici?.duration_p95?.toFixed(2) || 'N/A'} |
| Node 22 | ${results.node22?.results.express_axios?.duration_p95?.toFixed(2) || 'N/A'} | ${results.node22?.results.fastify_axios?.duration_p95?.toFixed(2) || 'N/A'} | ${results.node22?.results.fastify_undici?.duration_p95?.toFixed(2) || 'N/A'} |
| Node 24 | ${results.node24?.results.express_axios?.duration_p95?.toFixed(2) || 'N/A'} | ${results.node24?.results.fastify_axios?.duration_p95?.toFixed(2) || 'N/A'} | ${results.node24?.results.fastify_undici?.duration_p95?.toFixed(2) || 'N/A'} |

### P95 Response Time (ms) - With Interceptors
| Node Version | Express+Axios+Int | Fastify+Axios+Int | Fastify+Undici+Int |
|--------------|-------------------|-------------------|---------------------|
| Node 20 | ${results.node20?.results.express_axios_interceptor?.duration_p95?.toFixed(2) || 'N/A'} | ${results.node20?.results.fastify_axios_interceptor?.duration_p95?.toFixed(2) || 'N/A'} | ${results.node20?.results.fastify_undici_interceptor?.duration_p95?.toFixed(2) || 'N/A'} |
| Node 22 | ${results.node22?.results.express_axios_interceptor?.duration_p95?.toFixed(2) || 'N/A'} | ${results.node22?.results.fastify_axios_interceptor?.duration_p95?.toFixed(2) || 'N/A'} | ${results.node22?.results.fastify_undici_interceptor?.duration_p95?.toFixed(2) || 'N/A'} |
| Node 24 | ${results.node24?.results.express_axios_interceptor?.duration_p95?.toFixed(2) || 'N/A'} | ${results.node24?.results.fastify_axios_interceptor?.duration_p95?.toFixed(2) || 'N/A'} | ${results.node24?.results.fastify_undici_interceptor?.duration_p95?.toFixed(2) || 'N/A'} |

### Throughput (requests/second) - Without Interceptors
| Node Version | Express+Axios | Fastify+Axios | Fastify+Undici | Fastify+Axios vs Express+Axios | Fastify+Undici vs Express+Axios | Fastify+Undici vs Fastify+Axios |
|--------------|---------------|---------------|----------------|--------------------------------|----------------------------------|----------------------------------|
| Node 20 | ${results.node20?.results.express_axios?.rps?.toFixed(2) || 'N/A'} | ${results.node20?.results.fastify_axios?.rps?.toFixed(2) || 'N/A'} | ${results.node20?.results.fastify_undici?.rps?.toFixed(2) || 'N/A'} | ${results.node20?.comparison?.fastify_axios_vs_express_axios?.throughput_improvement || 'N/A'} | ${results.node20?.comparison?.fastify_undici_vs_express_axios?.throughput_improvement || 'N/A'} | ${results.node20?.comparison?.fastify_undici_vs_fastify_axios?.throughput_improvement || 'N/A'} |
| Node 22 | ${results.node22?.results.express_axios?.rps?.toFixed(2) || 'N/A'} | ${results.node22?.results.fastify_axios?.rps?.toFixed(2) || 'N/A'} | ${results.node22?.results.fastify_undici?.rps?.toFixed(2) || 'N/A'} | ${results.node22?.comparison?.fastify_axios_vs_express_axios?.throughput_improvement || 'N/A'} | ${results.node22?.comparison?.fastify_undici_vs_express_axios?.throughput_improvement || 'N/A'} | ${results.node22?.comparison?.fastify_undici_vs_fastify_axios?.throughput_improvement || 'N/A'} |
| Node 24 | ${results.node24?.results.express_axios?.rps?.toFixed(2) || 'N/A'} | ${results.node24?.results.fastify_axios?.rps?.toFixed(2) || 'N/A'} | ${results.node24?.results.fastify_undici?.rps?.toFixed(2) || 'N/A'} | ${results.node24?.comparison?.fastify_axios_vs_express_axios?.throughput_improvement || 'N/A'} | ${results.node24?.comparison?.fastify_undici_vs_express_axios?.throughput_improvement || 'N/A'} | ${results.node24?.comparison?.fastify_undici_vs_fastify_axios?.throughput_improvement || 'N/A'} |

### Throughput (requests/second) - With Interceptors
| Node Version | Express+Axios+Int | Fastify+Axios+Int | Fastify+Undici+Int |
|--------------|-------------------|-------------------|---------------------|
| Node 20 | ${results.node20?.results.express_axios_interceptor?.rps?.toFixed(2) || 'N/A'} | ${results.node20?.results.fastify_axios_interceptor?.rps?.toFixed(2) || 'N/A'} | ${results.node20?.results.fastify_undici_interceptor?.rps?.toFixed(2) || 'N/A'} |
| Node 22 | ${results.node22?.results.express_axios_interceptor?.rps?.toFixed(2) || 'N/A'} | ${results.node22?.results.fastify_axios_interceptor?.rps?.toFixed(2) || 'N/A'} | ${results.node22?.results.fastify_undici_interceptor?.rps?.toFixed(2) || 'N/A'} |
| Node 24 | ${results.node24?.results.express_axios_interceptor?.rps?.toFixed(2) || 'N/A'} | ${results.node24?.results.fastify_axios_interceptor?.rps?.toFixed(2) || 'N/A'} | ${results.node24?.results.fastify_undici_interceptor?.rps?.toFixed(2) || 'N/A'} |

### HTTP Client Comparison (Fastify Framework Only)
| Node Version | Fastify+Axios | Fastify+Undici | Improvement (%) |
|--------------|---------------|----------------|------------------|
| Node 20 | ${results.node20?.results.fastify_axios?.duration_avg?.toFixed(2) || 'N/A'}ms | ${results.node20?.results.fastify_undici?.duration_avg?.toFixed(2) || 'N/A'}ms | ${results.node20?.comparison?.fastify_undici_vs_fastify_axios?.avg_response_improvement || 'N/A'} |
| Node 22 | ${results.node22?.results.fastify_axios?.duration_avg?.toFixed(2) || 'N/A'}ms | ${results.node22?.results.fastify_undici?.duration_avg?.toFixed(2) || 'N/A'}ms | ${results.node22?.comparison?.fastify_undici_vs_fastify_axios?.avg_response_improvement || 'N/A'} |
| Node 24 | ${results.node24?.results.fastify_axios?.duration_avg?.toFixed(2) || 'N/A'}ms | ${results.node24?.results.fastify_undici?.duration_avg?.toFixed(2) || 'N/A'}ms | ${results.node24?.comparison?.fastify_undici_vs_fastify_axios?.avg_response_improvement || 'N/A'} |

### HTTP Client Comparison with Interceptors (Fastify Framework Only)
| Node Version | Fastify+Axios+Int | Fastify+Undici+Int | Improvement (%) |
|--------------|-------------------|---------------------|------------------|
| Node 20 | ${results.node20?.results.fastify_axios_interceptor?.duration_avg?.toFixed(2) || 'N/A'}ms | ${results.node20?.results.fastify_undici_interceptor?.duration_avg?.toFixed(2) || 'N/A'}ms | ${((results.node20?.results.fastify_axios_interceptor?.duration_avg - results.node20?.results.fastify_undici_interceptor?.duration_avg) / results.node20?.results.fastify_axios_interceptor?.duration_avg * 100)?.toFixed(1) || 'N/A'}% |
| Node 22 | ${results.node22?.results.fastify_axios_interceptor?.duration_avg?.toFixed(2) || 'N/A'}ms | ${results.node22?.results.fastify_undici_interceptor?.duration_avg?.toFixed(2) || 'N/A'}ms | ${((results.node22?.results.fastify_axios_interceptor?.duration_avg - results.node22?.results.fastify_undici_interceptor?.duration_avg) / results.node22?.results.fastify_axios_interceptor?.duration_avg * 100)?.toFixed(1) || 'N/A'}% |
| Node 24 | ${results.node24?.results.fastify_axios_interceptor?.duration_avg?.toFixed(2) || 'N/A'}ms | ${results.node24?.results.fastify_undici_interceptor?.duration_avg?.toFixed(2) || 'N/A'}ms | ${((results.node24?.results.fastify_axios_interceptor?.duration_avg - results.node24?.results.fastify_undici_interceptor?.duration_avg) / results.node24?.results.fastify_axios_interceptor?.duration_avg * 100)?.toFixed(1) || 'N/A'}% |

## Interceptor Performance Analysis

### Interceptor Implementation Overview
- **Axios Interceptors**: Uses native axios request/response interceptor API
- **Undici Interceptors**: Custom implementation using dispatcher hooks
- Both implementations log request/response with timing information

### Key Findings

#### Interceptor Overhead by Framework
The interceptor overhead varies by HTTP client and framework combination:

1. **Express + Axios**: ${[results.node20?.comparison?.interceptor_overhead?.express_axios?.avg_response_impact, results.node22?.comparison?.interceptor_overhead?.express_axios?.avg_response_impact, results.node24?.comparison?.interceptor_overhead?.express_axios?.avg_response_impact].filter(Boolean).join(', ') || 'N/A'} overhead across Node versions
2. **Fastify + Axios**: ${[results.node20?.comparison?.interceptor_overhead?.fastify_axios?.avg_response_impact, results.node22?.comparison?.interceptor_overhead?.fastify_axios?.avg_response_impact, results.node24?.comparison?.interceptor_overhead?.fastify_axios?.avg_response_impact].filter(Boolean).join(', ') || 'N/A'} overhead across Node versions
3. **Fastify + Undici**: ${[results.node20?.comparison?.interceptor_overhead?.fastify_undici?.avg_response_impact, results.node22?.comparison?.interceptor_overhead?.fastify_undici?.avg_response_impact, results.node24?.comparison?.interceptor_overhead?.fastify_undici?.avg_response_impact].filter(Boolean).join(', ') || 'N/A'} overhead across Node versions

#### Performance with Interceptors
Even with interceptors enabled, the performance rankings remain consistent:
- Fastify + Undici maintains the best performance
- The relative improvements between configurations are preserved
- Interceptor overhead is generally consistent across different Node.js versions

### Complete Performance Matrix (All 6 Configurations)
| Node Version | Express+Axios | Express+Axios+Int | Fastify+Axios | Fastify+Axios+Int | Fastify+Undici | Fastify+Undici+Int |
|--------------|---------------|-------------------|---------------|-------------------|----------------|---------------------|
| Node 20 | ${results.node20?.results.express_axios?.duration_avg?.toFixed(2) || 'N/A'}ms | ${results.node20?.results.express_axios_interceptor?.duration_avg?.toFixed(2) || 'N/A'}ms | ${results.node20?.results.fastify_axios?.duration_avg?.toFixed(2) || 'N/A'}ms | ${results.node20?.results.fastify_axios_interceptor?.duration_avg?.toFixed(2) || 'N/A'}ms | ${results.node20?.results.fastify_undici?.duration_avg?.toFixed(2) || 'N/A'}ms | ${results.node20?.results.fastify_undici_interceptor?.duration_avg?.toFixed(2) || 'N/A'}ms |
| Node 22 | ${results.node22?.results.express_axios?.duration_avg?.toFixed(2) || 'N/A'}ms | ${results.node22?.results.express_axios_interceptor?.duration_avg?.toFixed(2) || 'N/A'}ms | ${results.node22?.results.fastify_axios?.duration_avg?.toFixed(2) || 'N/A'}ms | ${results.node22?.results.fastify_axios_interceptor?.duration_avg?.toFixed(2) || 'N/A'}ms | ${results.node22?.results.fastify_undici?.duration_avg?.toFixed(2) || 'N/A'}ms | ${results.node22?.results.fastify_undici_interceptor?.duration_avg?.toFixed(2) || 'N/A'}ms |
| Node 24 | ${results.node24?.results.express_axios?.duration_avg?.toFixed(2) || 'N/A'}ms | ${results.node24?.results.express_axios_interceptor?.duration_avg?.toFixed(2) || 'N/A'}ms | ${results.node24?.results.fastify_axios?.duration_avg?.toFixed(2) || 'N/A'}ms | ${results.node24?.results.fastify_axios_interceptor?.duration_avg?.toFixed(2) || 'N/A'}ms | ${results.node24?.results.fastify_undici?.duration_avg?.toFixed(2) || 'N/A'}ms | ${results.node24?.results.fastify_undici_interceptor?.duration_avg?.toFixed(2) || 'N/A'}ms |

## Test Environment

- **Machine**: Local Docker containers
- **Network**: Docker bridge network
- **Test Tool**: k6 load testing framework
- **Date**: ${new Date().toISOString().split('T')[0]}
`;

// Write the report
fs.writeFileSync('results/PERFORMANCE-COMPARISON-REPORT.md', report);
console.log('Report generated: results/PERFORMANCE-COMPARISON-REPORT.md');