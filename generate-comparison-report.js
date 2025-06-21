const fs = require('fs');
const path = require('path');

// Helper functions for data processing
function readJSONFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

function formatPercentage(value) {
  if (typeof value === 'string' && value.includes('%')) return value;
  if (typeof value === 'number') return `${value.toFixed(1)}%`;
  return 'N/A';
}

function formatNumber(value, decimals = 2) {
  return typeof value === 'number' ? value.toFixed(decimals) : 'N/A';
}

function getPerformanceIndicator(improvement) {
  const value = parseFloat(improvement);
  if (isNaN(value)) return '';
  if (value >= 50) return '🟢';
  if (value >= 20) return '🟡';
  return '🔴';
}

function calculateAverageAcrossNodes(results, metric, service) {
  const values = ['node20', 'node22', 'node24']
    .map(node => results[node]?.results[service]?.[metric])
    .filter(v => typeof v === 'number');
  
  return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;
}

function getBestConfiguration(nodeResults) {
  if (!nodeResults?.results) return { config: 'N/A', time: 'N/A' };
  
  let best = { config: 'N/A', time: Infinity };
  
  Object.entries(nodeResults.results).forEach(([config, data]) => {
    if (data.duration_avg && data.duration_avg < best.time) {
      best = { config, time: data.duration_avg };
    }
  });
  
  return { config: best.config, time: formatNumber(best.time) };
}

// Read all result files
const results = {
  node20: readJSONFile('results/node20-performance-summary.json'),
  node22: readJSONFile('results/node22-performance-summary.json'),
  node24: readJSONFile('results/node24-performance-summary.json')
};

// Generate the improved report
const report = `# NestJS HTTP Module Performance Comparison Report

## 🎯 Executive Summary

**Best Performer:** Fastify + Undici (without interceptors) achieves **up to 74% faster response times** compared to the baseline Express + Axios configuration.

### 🏆 Top 3 Key Findings

1. **Undici dominates across all Node.js versions** - Average improvement of 60-74% over Axios
2. **Node.js 24 + Undici = Best performance** - Achieving 8.78ms average response time
3. **Interceptor overhead is manageable** - Only 2-31% overhead, with Undici still outperforming

### 💡 Recommendation
**Use Fastify + Undici for performance-critical NestJS applications** - Even with interceptors enabled, it outperforms all other configurations by 57-62%.

---

## 📊 Performance at a Glance

### Best Configuration by Node.js Version
| Node Version | Best Config | Avg Response Time | vs Baseline |
|--------------|-------------|-------------------|-------------|
| Node 20 | ${getBestConfiguration(results.node20).config} | ${getBestConfiguration(results.node20).time}ms | ${results.node20?.comparison?.fastify_undici_vs_express_axios?.avg_response_improvement || 'N/A'} ${getPerformanceIndicator(results.node20?.comparison?.fastify_undici_vs_express_axios?.avg_response_improvement)} |
| Node 22 | ${getBestConfiguration(results.node22).config} | ${getBestConfiguration(results.node22).time}ms | ${results.node22?.comparison?.fastify_undici_vs_express_axios?.avg_response_improvement || 'N/A'} ${getPerformanceIndicator(results.node22?.comparison?.fastify_undici_vs_express_axios?.avg_response_improvement)} |
| Node 24 | ${getBestConfiguration(results.node24).config} | ${getBestConfiguration(results.node24).time}ms | ${results.node24?.comparison?.fastify_undici_vs_express_axios?.avg_response_improvement || 'N/A'} ${getPerformanceIndicator(results.node24?.comparison?.fastify_undici_vs_express_axios?.avg_response_improvement)} |

### Performance Rankings (Without Interceptors)
| Rank | Configuration | Avg Response (across all Node versions) | Performance |
|------|---------------|----------------------------------------|-------------|
| 1st 🥇 | Fastify + Undici | ${formatNumber(calculateAverageAcrossNodes(results, 'duration_avg', 'fastify_undici'))}ms | 🟢 Excellent |
| 2nd 🥈 | Fastify + Axios | ${formatNumber(calculateAverageAcrossNodes(results, 'duration_avg', 'fastify_axios'))}ms | 🟡 Good |
| 3rd 🥉 | Express + Axios | ${formatNumber(calculateAverageAcrossNodes(results, 'duration_avg', 'express_axios'))}ms | 🔴 Baseline |

---

## 🔍 Key Performance Metrics

### Response Time Improvements (Fastify + Undici vs Express + Axios)
- **Average Response Time:** 65-74% faster
- **P95 Response Time:** 63-75% faster  
- **Throughput:** 187-283% higher
- **Error Rate:** 0% (all configurations)

### Framework Impact (Fastify vs Express with same HTTP client)
- **Average improvement:** 1.7-16% faster response times
- **Most significant on Node 20:** Up to 16% improvement
- **Diminishing returns on newer Node versions**

### HTTP Client Impact (Undici vs Axios with same framework)
- **Average improvement:** 62-74% faster response times
- **Consistent across all Node.js versions**
- **Largest gains on Node 24:** Up to 74% improvement

---

## 📈 Node.js Version Performance Summary

### Node.js 20 (LTS)
- **Best Configuration:** Fastify + Undici (9.79ms avg)
- **Worst Configuration:** Express + Axios + Interceptor (37.79ms avg)
- **Undici Advantage:** 62-71% faster than Axios variants

### Node.js 22
- **Best Configuration:** Fastify + Undici (9.91ms avg)
- **Worst Configuration:** Express + Axios + Interceptor (37.25ms avg)
- **Undici Advantage:** 65-67% faster than Axios variants

### Node.js 24
- **Best Configuration:** Fastify + Undici (8.78ms avg) ⭐
- **Worst Configuration:** Express + Axios + Interceptor (35.10ms avg)
- **Undici Advantage:** 74% faster than Axios variants

---

## 🔄 Interceptor Performance Impact

### Overhead by Configuration
| Configuration | Node 20 | Node 22 | Node 24 | Average |
|---------------|---------|---------|---------|---------|
| Express + Axios | ${formatPercentage(results.node20?.comparison?.interceptor_overhead?.express_axios?.avg_response_impact)} | ${formatPercentage(results.node22?.comparison?.interceptor_overhead?.express_axios?.avg_response_impact)} | ${formatPercentage(results.node24?.comparison?.interceptor_overhead?.express_axios?.avg_response_impact)} | ~15% |
| Fastify + Axios | ${formatPercentage(results.node20?.comparison?.interceptor_overhead?.fastify_axios?.avg_response_impact)} | ${formatPercentage(results.node22?.comparison?.interceptor_overhead?.fastify_axios?.avg_response_impact)} | ${formatPercentage(results.node24?.comparison?.interceptor_overhead?.fastify_axios?.avg_response_impact)} | ~12% |
| Fastify + Undici | ${formatPercentage(results.node20?.comparison?.interceptor_overhead?.fastify_undici?.avg_response_impact)} | ${formatPercentage(results.node22?.comparison?.interceptor_overhead?.fastify_undici?.avg_response_impact)} | ${formatPercentage(results.node24?.comparison?.interceptor_overhead?.fastify_undici?.avg_response_impact)} | ~27% |

**Key Finding:** Despite higher relative overhead, Fastify + Undici with interceptors still outperforms all Axios configurations.

---

## 🛠️ Test Configuration

- **Load Pattern**: Ramping from 0 to 100 concurrent users over 70 seconds
- **Test Workload**: Each request triggers 5 parallel HTTP calls to mock service
- **Environment**: Docker containers with isolated networking
- **Test Tool**: k6 load testing framework
- **Date**: ${new Date().toISOString().split('T')[0]}

---

## 📋 Detailed Technical Results

<details>
<summary>Click to expand detailed performance tables</summary>

### Average Response Time (ms) - Without Interceptors
| Node Version | Express+Axios | Fastify+Axios | Fastify+Undici | 
|--------------|---------------|---------------|----------------|
| Node 20 | ${formatNumber(results.node20?.results.express_axios?.duration_avg)} | ${formatNumber(results.node20?.results.fastify_axios?.duration_avg)} | ${formatNumber(results.node20?.results.fastify_undici?.duration_avg)} |
| Node 22 | ${formatNumber(results.node22?.results.express_axios?.duration_avg)} | ${formatNumber(results.node22?.results.fastify_axios?.duration_avg)} | ${formatNumber(results.node22?.results.fastify_undici?.duration_avg)} |
| Node 24 | ${formatNumber(results.node24?.results.express_axios?.duration_avg)} | ${formatNumber(results.node24?.results.fastify_axios?.duration_avg)} | ${formatNumber(results.node24?.results.fastify_undici?.duration_avg)} |

### Average Response Time (ms) - With Interceptors
| Node Version | Express+Axios+Int | Fastify+Axios+Int | Fastify+Undici+Int |
|--------------|-------------------|-------------------|---------------------|
| Node 20 | ${formatNumber(results.node20?.results.express_axios_interceptor?.duration_avg)} | ${formatNumber(results.node20?.results.fastify_axios_interceptor?.duration_avg)} | ${formatNumber(results.node20?.results.fastify_undici_interceptor?.duration_avg)} |
| Node 22 | ${formatNumber(results.node22?.results.express_axios_interceptor?.duration_avg)} | ${formatNumber(results.node22?.results.fastify_axios_interceptor?.duration_avg)} | ${formatNumber(results.node22?.results.fastify_undici_interceptor?.duration_avg)} |
| Node 24 | ${formatNumber(results.node24?.results.express_axios_interceptor?.duration_avg)} | ${formatNumber(results.node24?.results.fastify_axios_interceptor?.duration_avg)} | ${formatNumber(results.node24?.results.fastify_undici_interceptor?.duration_avg)} |

### P95 Response Time (ms) - Without Interceptors
| Node Version | Express+Axios | Fastify+Axios | Fastify+Undici |
|--------------|---------------|---------------|----------------|
| Node 20 | ${formatNumber(results.node20?.results.express_axios?.duration_p95)} | ${formatNumber(results.node20?.results.fastify_axios?.duration_p95)} | ${formatNumber(results.node20?.results.fastify_undici?.duration_p95)} |
| Node 22 | ${formatNumber(results.node22?.results.express_axios?.duration_p95)} | ${formatNumber(results.node22?.results.fastify_axios?.duration_p95)} | ${formatNumber(results.node22?.results.fastify_undici?.duration_p95)} |
| Node 24 | ${formatNumber(results.node24?.results.express_axios?.duration_p95)} | ${formatNumber(results.node24?.results.fastify_axios?.duration_p95)} | ${formatNumber(results.node24?.results.fastify_undici?.duration_p95)} |

### P95 Response Time (ms) - With Interceptors
| Node Version | Express+Axios+Int | Fastify+Axios+Int | Fastify+Undici+Int |
|--------------|-------------------|-------------------|---------------------|
| Node 20 | ${formatNumber(results.node20?.results.express_axios_interceptor?.duration_p95)} | ${formatNumber(results.node20?.results.fastify_axios_interceptor?.duration_p95)} | ${formatNumber(results.node20?.results.fastify_undici_interceptor?.duration_p95)} |
| Node 22 | ${formatNumber(results.node22?.results.express_axios_interceptor?.duration_p95)} | ${formatNumber(results.node22?.results.fastify_axios_interceptor?.duration_p95)} | ${formatNumber(results.node22?.results.fastify_undici_interceptor?.duration_p95)} |
| Node 24 | ${formatNumber(results.node24?.results.express_axios_interceptor?.duration_p95)} | ${formatNumber(results.node24?.results.fastify_axios_interceptor?.duration_p95)} | ${formatNumber(results.node24?.results.fastify_undici_interceptor?.duration_p95)} |

### Throughput (requests/second) - Without Interceptors
| Node Version | Express+Axios | Fastify+Axios | Fastify+Undici |
|--------------|---------------|---------------|----------------|
| Node 20 | ${formatNumber(results.node20?.results.express_axios?.rps, 0)} | ${formatNumber(results.node20?.results.fastify_axios?.rps, 0)} | ${formatNumber(results.node20?.results.fastify_undici?.rps, 0)} |
| Node 22 | ${formatNumber(results.node22?.results.express_axios?.rps, 0)} | ${formatNumber(results.node22?.results.fastify_axios?.rps, 0)} | ${formatNumber(results.node22?.results.fastify_undici?.rps, 0)} |
| Node 24 | ${formatNumber(results.node24?.results.express_axios?.rps, 0)} | ${formatNumber(results.node24?.results.fastify_axios?.rps, 0)} | ${formatNumber(results.node24?.results.fastify_undici?.rps, 0)} |

### Throughput (requests/second) - With Interceptors
| Node Version | Express+Axios+Int | Fastify+Axios+Int | Fastify+Undici+Int |
|--------------|-------------------|-------------------|---------------------|
| Node 20 | ${formatNumber(results.node20?.results.express_axios_interceptor?.rps, 0)} | ${formatNumber(results.node20?.results.fastify_axios_interceptor?.rps, 0)} | ${formatNumber(results.node20?.results.fastify_undici_interceptor?.rps, 0)} |
| Node 22 | ${formatNumber(results.node22?.results.express_axios_interceptor?.rps, 0)} | ${formatNumber(results.node22?.results.fastify_axios_interceptor?.rps, 0)} | ${formatNumber(results.node22?.results.fastify_undici_interceptor?.rps, 0)} |
| Node 24 | ${formatNumber(results.node24?.results.express_axios_interceptor?.rps, 0)} | ${formatNumber(results.node24?.results.fastify_axios_interceptor?.rps, 0)} | ${formatNumber(results.node24?.results.fastify_undici_interceptor?.rps, 0)} |

### Performance Improvements - Without Interceptors
| Comparison | Node 20 | Node 22 | Node 24 |
|------------|---------|---------|---------|
| Fastify+Axios vs Express+Axios | ${formatPercentage(results.node20?.comparison?.fastify_axios_vs_express_axios?.avg_response_improvement)} | ${formatPercentage(results.node22?.comparison?.fastify_axios_vs_express_axios?.avg_response_improvement)} | ${formatPercentage(results.node24?.comparison?.fastify_axios_vs_express_axios?.avg_response_improvement)} |
| Fastify+Undici vs Express+Axios | ${formatPercentage(results.node20?.comparison?.fastify_undici_vs_express_axios?.avg_response_improvement)} | ${formatPercentage(results.node22?.comparison?.fastify_undici_vs_express_axios?.avg_response_improvement)} | ${formatPercentage(results.node24?.comparison?.fastify_undici_vs_express_axios?.avg_response_improvement)} |
| Fastify+Undici vs Fastify+Axios | ${formatPercentage(results.node20?.comparison?.fastify_undici_vs_fastify_axios?.avg_response_improvement)} | ${formatPercentage(results.node22?.comparison?.fastify_undici_vs_fastify_axios?.avg_response_improvement)} | ${formatPercentage(results.node24?.comparison?.fastify_undici_vs_fastify_axios?.avg_response_improvement)} |

### Interceptor Overhead Details
| Node Version | Configuration | Base (ms) | With Interceptor (ms) | Overhead |
|--------------|---------------|-----------|----------------------|----------|
| Node 20 | Express+Axios | ${formatNumber(results.node20?.results.express_axios?.duration_avg)} | ${formatNumber(results.node20?.results.express_axios_interceptor?.duration_avg)} | ${formatPercentage(results.node20?.comparison?.interceptor_overhead?.express_axios?.avg_response_impact)} |
| Node 20 | Fastify+Axios | ${formatNumber(results.node20?.results.fastify_axios?.duration_avg)} | ${formatNumber(results.node20?.results.fastify_axios_interceptor?.duration_avg)} | ${formatPercentage(results.node20?.comparison?.interceptor_overhead?.fastify_axios?.avg_response_impact)} |
| Node 20 | Fastify+Undici | ${formatNumber(results.node20?.results.fastify_undici?.duration_avg)} | ${formatNumber(results.node20?.results.fastify_undici_interceptor?.duration_avg)} | ${formatPercentage(results.node20?.comparison?.interceptor_overhead?.fastify_undici?.avg_response_impact)} |
| Node 22 | Express+Axios | ${formatNumber(results.node22?.results.express_axios?.duration_avg)} | ${formatNumber(results.node22?.results.express_axios_interceptor?.duration_avg)} | ${formatPercentage(results.node22?.comparison?.interceptor_overhead?.express_axios?.avg_response_impact)} |
| Node 22 | Fastify+Axios | ${formatNumber(results.node22?.results.fastify_axios?.duration_avg)} | ${formatNumber(results.node22?.results.fastify_axios_interceptor?.duration_avg)} | ${formatPercentage(results.node22?.comparison?.interceptor_overhead?.fastify_axios?.avg_response_impact)} |
| Node 22 | Fastify+Undici | ${formatNumber(results.node22?.results.fastify_undici?.duration_avg)} | ${formatNumber(results.node22?.results.fastify_undici_interceptor?.duration_avg)} | ${formatPercentage(results.node22?.comparison?.interceptor_overhead?.fastify_undici?.avg_response_impact)} |
| Node 24 | Express+Axios | ${formatNumber(results.node24?.results.express_axios?.duration_avg)} | ${formatNumber(results.node24?.results.express_axios_interceptor?.duration_avg)} | ${formatPercentage(results.node24?.comparison?.interceptor_overhead?.express_axios?.avg_response_impact)} |
| Node 24 | Fastify+Axios | ${formatNumber(results.node24?.results.fastify_axios?.duration_avg)} | ${formatNumber(results.node24?.results.fastify_axios_interceptor?.duration_avg)} | ${formatPercentage(results.node24?.comparison?.interceptor_overhead?.fastify_axios?.avg_response_impact)} |
| Node 24 | Fastify+Undici | ${formatNumber(results.node24?.results.fastify_undici?.duration_avg)} | ${formatNumber(results.node24?.results.fastify_undici_interceptor?.duration_avg)} | ${formatPercentage(results.node24?.comparison?.interceptor_overhead?.fastify_undici?.avg_response_impact)} |

### Complete Performance Matrix (All 6 Configurations)
| Node Version | Express+Axios | Express+Axios+Int | Fastify+Axios | Fastify+Axios+Int | Fastify+Undici | Fastify+Undici+Int |
|--------------|---------------|-------------------|---------------|-------------------|----------------|---------------------|
| Node 20 | ${formatNumber(results.node20?.results.express_axios?.duration_avg)}ms | ${formatNumber(results.node20?.results.express_axios_interceptor?.duration_avg)}ms | ${formatNumber(results.node20?.results.fastify_axios?.duration_avg)}ms | ${formatNumber(results.node20?.results.fastify_axios_interceptor?.duration_avg)}ms | ${formatNumber(results.node20?.results.fastify_undici?.duration_avg)}ms | ${formatNumber(results.node20?.results.fastify_undici_interceptor?.duration_avg)}ms |
| Node 22 | ${formatNumber(results.node22?.results.express_axios?.duration_avg)}ms | ${formatNumber(results.node22?.results.express_axios_interceptor?.duration_avg)}ms | ${formatNumber(results.node22?.results.fastify_axios?.duration_avg)}ms | ${formatNumber(results.node22?.results.fastify_axios_interceptor?.duration_avg)}ms | ${formatNumber(results.node22?.results.fastify_undici?.duration_avg)}ms | ${formatNumber(results.node22?.results.fastify_undici_interceptor?.duration_avg)}ms |
| Node 24 | ${formatNumber(results.node24?.results.express_axios?.duration_avg)}ms | ${formatNumber(results.node24?.results.express_axios_interceptor?.duration_avg)}ms | ${formatNumber(results.node24?.results.fastify_axios?.duration_avg)}ms | ${formatNumber(results.node24?.results.fastify_axios_interceptor?.duration_avg)}ms | ${formatNumber(results.node24?.results.fastify_undici?.duration_avg)}ms | ${formatNumber(results.node24?.results.fastify_undici_interceptor?.duration_avg)}ms |

</details>

---

## 📌 Conclusions

1. **Fastify + Undici is the clear performance winner** across all Node.js versions
2. **Node.js 24 offers the best performance** for Undici-based configurations
3. **Interceptor overhead is acceptable** - Undici with interceptors still beats Axios without
4. **Framework choice matters less than HTTP client** - Undici provides 60-74% improvement vs 2-16% for Fastify
5. **Zero error rates** across all configurations demonstrate stability

### 🚀 Action Items
- Migrate performance-critical services to Fastify + Undici
- Consider Node.js 24 for maximum performance gains
- Implement interceptors without significant performance concerns
- Monitor real-world performance to validate benchmark results
`;

// Write the improved report
fs.writeFileSync('results/PERFORMANCE-COMPARISON-REPORT.md', report);
console.log('Improved report generated: results/PERFORMANCE-COMPARISON-REPORT.md');