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

This report compares the performance of three HTTP module configurations in NestJS applications:
- **Express + Axios**: NestJS with default Express adapter using @nestjs/axios (baseline)
- **Fastify + Axios**: NestJS with Fastify adapter using @nestjs/axios
- **Fastify + Undici**: NestJS with Fastify adapter using nestjs-undici

## Test Configuration
- **Load Pattern**: Ramping from 0 to 100 concurrent users
- **Test Duration**: 70 seconds per scenario
- **Total Test Duration**: ~3.75 minutes per Node version (3 services tested)
- **Endpoints Tested**: 
  - Express + Axios: Makes 5 parallel requests using axios (baseline configuration)
  - Fastify + Axios: Makes 5 parallel requests using axios
  - Fastify + Undici: Makes 5 parallel requests using undici

## Key Comparisons
1. **Framework Comparison**: Express+Axios vs Fastify+Axios (isolates framework performance)
2. **HTTP Client Comparison**: Fastify+Axios vs Fastify+Undici (isolates HTTP client performance)
3. **Overall Comparison**: Express+Axios vs Fastify+Undici (combined optimization impact)

## Performance Results

### Node.js 20 (LTS)
${results.node20 && results.node20.results.express_axios?.duration_avg ? `
#### Response Time Improvements
- **Framework Impact (Fastify+Axios vs Express+Axios)**: ${results.node20.comparison?.fastify_axios_vs_express_axios?.avg_response_improvement || 'N/A'}
- **HTTP Client Impact (Fastify+Undici vs Fastify+Axios)**: ${results.node20.comparison?.fastify_undici_vs_fastify_axios?.avg_response_improvement || 'N/A'}
- **Combined Impact (Fastify+Undici vs Express+Axios)**: ${results.node20.comparison?.fastify_undici_vs_express_axios?.avg_response_improvement || 'N/A'}

#### Average Response Times
- **Express + Axios (Baseline)**: ${results.node20.results.express_axios.duration_avg.toFixed(2)}ms
- **Fastify + Axios**: ${results.node20.results.fastify_axios?.duration_avg?.toFixed(2) || 'N/A'}ms
- **Fastify + Undici**: ${results.node20.results.fastify_undici?.duration_avg?.toFixed(2) || 'N/A'}ms

#### Throughput Improvements
- **Fastify+Axios vs Express+Axios**: ${results.node20.comparison?.fastify_axios_vs_express_axios?.throughput_improvement || 'N/A'}
- **Fastify+Undici vs Fastify+Axios**: ${results.node20.comparison?.fastify_undici_vs_fastify_axios?.throughput_improvement || 'N/A'}
- **Fastify+Undici vs Express+Axios**: ${results.node20.comparison?.fastify_undici_vs_express_axios?.throughput_improvement || 'N/A'}
` : 'No complete data available'}

### Node.js 22
${results.node22 && results.node22.results.express_axios?.duration_avg ? `
#### Response Time Improvements
- **Framework Impact (Fastify+Axios vs Express+Axios)**: ${results.node22.comparison?.fastify_axios_vs_express_axios?.avg_response_improvement || 'N/A'}
- **HTTP Client Impact (Fastify+Undici vs Fastify+Axios)**: ${results.node22.comparison?.fastify_undici_vs_fastify_axios?.avg_response_improvement || 'N/A'}
- **Combined Impact (Fastify+Undici vs Express+Axios)**: ${results.node22.comparison?.fastify_undici_vs_express_axios?.avg_response_improvement || 'N/A'}

#### Average Response Times
- **Express + Axios (Baseline)**: ${results.node22.results.express_axios.duration_avg.toFixed(2)}ms
- **Fastify + Axios**: ${results.node22.results.fastify_axios?.duration_avg?.toFixed(2) || 'N/A'}ms
- **Fastify + Undici**: ${results.node22.results.fastify_undici?.duration_avg?.toFixed(2) || 'N/A'}ms

#### Throughput Improvements
- **Fastify+Axios vs Express+Axios**: ${results.node22.comparison?.fastify_axios_vs_express_axios?.throughput_improvement || 'N/A'}
- **Fastify+Undici vs Fastify+Axios**: ${results.node22.comparison?.fastify_undici_vs_fastify_axios?.throughput_improvement || 'N/A'}
- **Fastify+Undici vs Express+Axios**: ${results.node22.comparison?.fastify_undici_vs_express_axios?.throughput_improvement || 'N/A'}
` : 'No complete data available'}

### Node.js 24
${results.node24 && results.node24.results.express_axios?.duration_avg ? `
#### Response Time Improvements
- **Framework Impact (Fastify+Axios vs Express+Axios)**: ${results.node24.comparison?.fastify_axios_vs_express_axios?.avg_response_improvement || 'N/A'}
- **HTTP Client Impact (Fastify+Undici vs Fastify+Axios)**: ${results.node24.comparison?.fastify_undici_vs_fastify_axios?.avg_response_improvement || 'N/A'}
- **Combined Impact (Fastify+Undici vs Express+Axios)**: ${results.node24.comparison?.fastify_undici_vs_express_axios?.avg_response_improvement || 'N/A'}

#### Average Response Times
- **Express + Axios (Baseline)**: ${results.node24.results.express_axios.duration_avg.toFixed(2)}ms
- **Fastify + Axios**: ${results.node24.results.fastify_axios?.duration_avg?.toFixed(2) || 'N/A'}ms
- **Fastify + Undici**: ${results.node24.results.fastify_undici?.duration_avg?.toFixed(2) || 'N/A'}ms

#### Throughput Improvements
- **Fastify+Axios vs Express+Axios**: ${results.node24.comparison?.fastify_axios_vs_express_axios?.throughput_improvement || 'N/A'}
- **Fastify+Undici vs Fastify+Axios**: ${results.node24.comparison?.fastify_undici_vs_fastify_axios?.throughput_improvement || 'N/A'}
- **Fastify+Undici vs Express+Axios**: ${results.node24.comparison?.fastify_undici_vs_express_axios?.throughput_improvement || 'N/A'}
` : 'No complete data available'}

## Detailed Comparison Tables

### Average Response Time (ms)
| Node Version | Express+Axios (Baseline) | Fastify+Axios | Fastify+Undici | Fastify+Axios vs Express+Axios | Fastify+Undici vs Express+Axios | Fastify+Undici vs Fastify+Axios |
|--------------|-------------------------|---------------|----------------|--------------------------------|----------------------------------|----------------------------------|
| Node 20 | ${results.node20?.results.express_axios?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node20?.results.fastify_axios?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node20?.results.fastify_undici?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node20?.comparison?.fastify_axios_vs_express_axios?.avg_response_improvement || 'N/A'} | ${results.node20?.comparison?.fastify_undici_vs_express_axios?.avg_response_improvement || 'N/A'} | ${results.node20?.comparison?.fastify_undici_vs_fastify_axios?.avg_response_improvement || 'N/A'} |
| Node 22 | ${results.node22?.results.express_axios?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node22?.results.fastify_axios?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node22?.results.fastify_undici?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node22?.comparison?.fastify_axios_vs_express_axios?.avg_response_improvement || 'N/A'} | ${results.node22?.comparison?.fastify_undici_vs_express_axios?.avg_response_improvement || 'N/A'} | ${results.node22?.comparison?.fastify_undici_vs_fastify_axios?.avg_response_improvement || 'N/A'} |
| Node 24 | ${results.node24?.results.express_axios?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node24?.results.fastify_axios?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node24?.results.fastify_undici?.duration_avg?.toFixed(2) || 'N/A'} | ${results.node24?.comparison?.fastify_axios_vs_express_axios?.avg_response_improvement || 'N/A'} | ${results.node24?.comparison?.fastify_undici_vs_express_axios?.avg_response_improvement || 'N/A'} | ${results.node24?.comparison?.fastify_undici_vs_fastify_axios?.avg_response_improvement || 'N/A'} |

### P95 Response Time (ms)
| Node Version | Express+Axios | Fastify+Axios | Fastify+Undici |
|--------------|---------------|---------------|----------------|
| Node 20 | ${results.node20?.results.express_axios?.duration_p95?.toFixed(2) || 'N/A'} | ${results.node20?.results.fastify_axios?.duration_p95?.toFixed(2) || 'N/A'} | ${results.node20?.results.fastify_undici?.duration_p95?.toFixed(2) || 'N/A'} |
| Node 22 | ${results.node22?.results.express_axios?.duration_p95?.toFixed(2) || 'N/A'} | ${results.node22?.results.fastify_axios?.duration_p95?.toFixed(2) || 'N/A'} | ${results.node22?.results.fastify_undici?.duration_p95?.toFixed(2) || 'N/A'} |
| Node 24 | ${results.node24?.results.express_axios?.duration_p95?.toFixed(2) || 'N/A'} | ${results.node24?.results.fastify_axios?.duration_p95?.toFixed(2) || 'N/A'} | ${results.node24?.results.fastify_undici?.duration_p95?.toFixed(2) || 'N/A'} |

### Throughput (requests/second)
| Node Version | Express+Axios | Fastify+Axios | Fastify+Undici | Fastify+Axios vs Express+Axios | Fastify+Undici vs Express+Axios | Fastify+Undici vs Fastify+Axios |
|--------------|---------------|---------------|----------------|--------------------------------|----------------------------------|----------------------------------|
| Node 20 | ${results.node20?.results.express_axios?.rps?.toFixed(2) || 'N/A'} | ${results.node20?.results.fastify_axios?.rps?.toFixed(2) || 'N/A'} | ${results.node20?.results.fastify_undici?.rps?.toFixed(2) || 'N/A'} | ${results.node20?.comparison?.fastify_axios_vs_express_axios?.throughput_improvement || 'N/A'} | ${results.node20?.comparison?.fastify_undici_vs_express_axios?.throughput_improvement || 'N/A'} | ${results.node20?.comparison?.fastify_undici_vs_fastify_axios?.throughput_improvement || 'N/A'} |
| Node 22 | ${results.node22?.results.express_axios?.rps?.toFixed(2) || 'N/A'} | ${results.node22?.results.fastify_axios?.rps?.toFixed(2) || 'N/A'} | ${results.node22?.results.fastify_undici?.rps?.toFixed(2) || 'N/A'} | ${results.node22?.comparison?.fastify_axios_vs_express_axios?.throughput_improvement || 'N/A'} | ${results.node22?.comparison?.fastify_undici_vs_express_axios?.throughput_improvement || 'N/A'} | ${results.node22?.comparison?.fastify_undici_vs_fastify_axios?.throughput_improvement || 'N/A'} |
| Node 24 | ${results.node24?.results.express_axios?.rps?.toFixed(2) || 'N/A'} | ${results.node24?.results.fastify_axios?.rps?.toFixed(2) || 'N/A'} | ${results.node24?.results.fastify_undici?.rps?.toFixed(2) || 'N/A'} | ${results.node24?.comparison?.fastify_axios_vs_express_axios?.throughput_improvement || 'N/A'} | ${results.node24?.comparison?.fastify_undici_vs_express_axios?.throughput_improvement || 'N/A'} | ${results.node24?.comparison?.fastify_undici_vs_fastify_axios?.throughput_improvement || 'N/A'} |

### HTTP Client Comparison (Fastify Framework Only)
| Node Version | Fastify+Axios | Fastify+Undici | Improvement (%) |
|--------------|---------------|----------------|------------------|
| Node 20 | ${results.node20?.results.fastify_axios?.duration_avg?.toFixed(2) || 'N/A'}ms | ${results.node20?.results.fastify_undici?.duration_avg?.toFixed(2) || 'N/A'}ms | ${results.node20?.comparison?.fastify_undici_vs_fastify_axios?.avg_response_improvement || 'N/A'} |
| Node 22 | ${results.node22?.results.fastify_axios?.duration_avg?.toFixed(2) || 'N/A'}ms | ${results.node22?.results.fastify_undici?.duration_avg?.toFixed(2) || 'N/A'}ms | ${results.node22?.comparison?.fastify_undici_vs_fastify_axios?.avg_response_improvement || 'N/A'} |
| Node 24 | ${results.node24?.results.fastify_axios?.duration_avg?.toFixed(2) || 'N/A'}ms | ${results.node24?.results.fastify_undici?.duration_avg?.toFixed(2) || 'N/A'}ms | ${results.node24?.comparison?.fastify_undici_vs_fastify_axios?.avg_response_improvement || 'N/A'} |

## Test Environment

- **Machine**: Local Docker containers
- **Network**: Docker bridge network
- **Test Tool**: k6 load testing framework
- **Date**: ${new Date().toISOString().split('T')[0]}
`;

// Write the report
fs.writeFileSync('results/PERFORMANCE-COMPARISON-REPORT.md', report);
console.log('Report generated: results/PERFORMANCE-COMPARISON-REPORT.md');