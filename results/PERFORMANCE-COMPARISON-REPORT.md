# NestJS HTTP Module Performance Comparison

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

#### Average Response Times (No Interceptors)
- **Express + Axios (Baseline)**: 28.20ms
- **Fastify + Axios**: 25.79ms
- **Fastify + Undici**: 9.79ms

#### Average Response Times (With Interceptors)
- **Express + Axios + Interceptor**: 34.16ms
- **Fastify + Axios + Interceptor**: 30.84ms
- **Fastify + Undici + Interceptor**: 13.21ms

#### Interceptor Overhead
- **Express + Axios**: 17.44% slower
- **Fastify + Axios**: 16.39% slower
- **Fastify + Undici**: 25.91% slower

#### Performance Improvements (No Interceptors)
- **Framework Impact (Fastify+Axios vs Express+Axios)**: 8.56%
- **HTTP Client Impact (Fastify+Undici vs Fastify+Axios)**: 62.05%
- **Combined Impact (Fastify+Undici vs Express+Axios)**: 65.30%


### Node.js 22

#### Average Response Times (No Interceptors)
- **Express + Axios (Baseline)**: 29.57ms
- **Fastify + Axios**: 28.49ms
- **Fastify + Undici**: 9.91ms

#### Average Response Times (With Interceptors)
- **Express + Axios + Interceptor**: 37.25ms
- **Fastify + Axios + Interceptor**: 33.92ms
- **Fastify + Undici + Interceptor**: 13.02ms

#### Interceptor Overhead
- **Express + Axios**: 20.62% slower
- **Fastify + Axios**: 16.00% slower
- **Fastify + Undici**: 23.90% slower

#### Performance Improvements (No Interceptors)
- **Framework Impact (Fastify+Axios vs Express+Axios)**: 3.65%
- **HTTP Client Impact (Fastify+Undici vs Fastify+Axios)**: 65.23%
- **Combined Impact (Fastify+Undici vs Express+Axios)**: 66.50%

#### Throughput Improvements
- **Fastify+Axios vs Express+Axios**: 3.79%
- **Fastify+Undici vs Fastify+Axios**: 186.75%
- **Fastify+Undici vs Express+Axios**: 197.62%


### Node.js 24

#### Average Response Times (No Interceptors)
- **Express + Axios (Baseline)**: 33.77ms
- **Fastify + Axios**: 33.20ms
- **Fastify + Undici**: 8.78ms

#### Average Response Times (With Interceptors)
- **Express + Axios + Interceptor**: 35.10ms
- **Fastify + Axios + Interceptor**: 34.04ms
- **Fastify + Undici + Interceptor**: 12.80ms

#### Interceptor Overhead
- **Express + Axios**: 3.80% slower
- **Fastify + Axios**: 2.48% slower
- **Fastify + Undici**: 31.38% slower

#### Performance Improvements (No Interceptors)
- **Framework Impact (Fastify+Axios vs Express+Axios)**: 1.69%
- **HTTP Client Impact (Fastify+Undici vs Fastify+Axios)**: 73.54%
- **Combined Impact (Fastify+Undici vs Express+Axios)**: 73.99%

#### Throughput Improvements
- **Fastify+Axios vs Express+Axios**: 1.72%
- **Fastify+Undici vs Fastify+Axios**: 276.43%
- **Fastify+Undici vs Express+Axios**: 282.91%


## Detailed Comparison Tables

### Average Response Time (ms) - Without Interceptors
| Node Version | Express+Axios | Fastify+Axios | Fastify+Undici | Fastify+Axios vs Express+Axios | Fastify+Undici vs Express+Axios | Fastify+Undici vs Fastify+Axios |
|--------------|---------------|---------------|----------------|--------------------------------|----------------------------------|----------------------------------|
| Node 20 | 28.20 | 25.79 | 9.79 | 8.56% | 65.30% | 62.05% |
| Node 22 | 29.57 | 28.49 | 9.91 | 3.65% | 66.50% | 65.23% |
| Node 24 | 33.77 | 33.20 | 8.78 | 1.69% | 73.99% | 73.54% |

### Average Response Time (ms) - With Interceptors
| Node Version | Express+Axios+Int | Fastify+Axios+Int | Fastify+Undici+Int |
|--------------|-------------------|-------------------|---------------------|
| Node 20 | 34.16 | 30.84 | 13.21 |
| Node 22 | 37.25 | 33.92 | 13.02 |
| Node 24 | 35.10 | 34.04 | 12.80 |

### Interceptor Overhead Comparison
| Node Version | Configuration | Base (ms) | With Interceptor (ms) | Overhead (%) |
|--------------|---------------|-----------|----------------------|--------------|
| Node 20 | Express+Axios | 28.20 | 34.16 | 17.44% |
| Node 20 | Fastify+Axios | 25.79 | 30.84 | 16.39% |
| Node 20 | Fastify+Undici | 9.79 | 13.21 | 25.91% |
| Node 22 | Express+Axios | 29.57 | 37.25 | 20.62% |
| Node 22 | Fastify+Axios | 28.49 | 33.92 | 16.00% |
| Node 22 | Fastify+Undici | 9.91 | 13.02 | 23.90% |
| Node 24 | Express+Axios | 33.77 | 35.10 | 3.80% |
| Node 24 | Fastify+Axios | 33.20 | 34.04 | 2.48% |
| Node 24 | Fastify+Undici | 8.78 | 12.80 | 31.38% |

### P95 Response Time (ms) - Without Interceptors
| Node Version | Express+Axios | Fastify+Axios | Fastify+Undici |
|--------------|---------------|---------------|----------------|
| Node 20 | 51.97 | 48.29 | 16.28 |
| Node 22 | 53.62 | 53.42 | 18.48 |
| Node 24 | 59.54 | 60.97 | 14.99 |

### P95 Response Time (ms) - With Interceptors
| Node Version | Express+Axios+Int | Fastify+Axios+Int | Fastify+Undici+Int |
|--------------|-------------------|-------------------|---------------------|
| Node 20 | 65.23 | 58.17 | 21.85 |
| Node 22 | 70.40 | 63.73 | 22.06 |
| Node 24 | 65.20 | 65.29 | 21.11 |

### Throughput (requests/second) - Without Interceptors
| Node Version | Express+Axios | Fastify+Axios | Fastify+Undici | Fastify+Axios vs Express+Axios | Fastify+Undici vs Express+Axios | Fastify+Undici vs Fastify+Axios |
|--------------|---------------|---------------|----------------|--------------------------------|----------------------------------|----------------------------------|
| Node 20 | 2272.67 | 2485.33 | 6529.61 | 9.36% | 187.31% | 162.73% |
| Node 22 | 2167.84 | 2250.01 | 6451.90 | 3.79% | 197.62% | 186.75% |
| Node 24 | 1898.61 | 1931.34 | 7270.07 | 1.72% | 282.91% | 276.43% |

### Throughput (requests/second) - With Interceptors
| Node Version | Express+Axios+Int | Fastify+Axios+Int | Fastify+Undici+Int |
|--------------|-------------------|-------------------|---------------------|
| Node 20 | 1877.51 | 2079.07 | 4851.53 |
| Node 22 | 1721.60 | 1890.81 | 4922.96 |
| Node 24 | 1826.97 | 1883.67 | 5005.44 |

### HTTP Client Comparison (Fastify Framework Only)
| Node Version | Fastify+Axios | Fastify+Undici | Improvement (%) |
|--------------|---------------|----------------|------------------|
| Node 20 | 25.79ms | 9.79ms | 62.05% |
| Node 22 | 28.49ms | 9.91ms | 65.23% |
| Node 24 | 33.20ms | 8.78ms | 73.54% |

### HTTP Client Comparison with Interceptors (Fastify Framework Only)
| Node Version | Fastify+Axios+Int | Fastify+Undici+Int | Improvement (%) |
|--------------|-------------------|---------------------|------------------|
| Node 20 | 30.84ms | 13.21ms | 57.2% |
| Node 22 | 33.92ms | 13.02ms | 61.6% |
| Node 24 | 34.04ms | 12.80ms | 62.4% |

## Interceptor Performance Analysis

### Interceptor Implementation Overview
- **Axios Interceptors**: Uses native axios request/response interceptor API
- **Undici Interceptors**: Custom implementation using dispatcher hooks
- Both implementations log request/response with timing information

### Key Findings

#### Interceptor Overhead by Framework
The interceptor overhead varies by HTTP client and framework combination:

1. **Express + Axios**: 17.44%, 20.62%, 3.80% overhead across Node versions
2. **Fastify + Axios**: 16.39%, 16.00%, 2.48% overhead across Node versions
3. **Fastify + Undici**: 25.91%, 23.90%, 31.38% overhead across Node versions

#### Performance with Interceptors
Even with interceptors enabled, the performance rankings remain consistent:
- Fastify + Undici maintains the best performance
- The relative improvements between configurations are preserved
- Interceptor overhead is generally consistent across different Node.js versions

### Complete Performance Matrix (All 6 Configurations)
| Node Version | Express+Axios | Express+Axios+Int | Fastify+Axios | Fastify+Axios+Int | Fastify+Undici | Fastify+Undici+Int |
|--------------|---------------|-------------------|---------------|-------------------|----------------|---------------------|
| Node 20 | 28.20ms | 34.16ms | 25.79ms | 30.84ms | 9.79ms | 13.21ms |
| Node 22 | 29.57ms | 37.25ms | 28.49ms | 33.92ms | 9.91ms | 13.02ms |
| Node 24 | 33.77ms | 35.10ms | 33.20ms | 34.04ms | 8.78ms | 12.80ms |

## Test Environment

- **Machine**: Local Docker containers
- **Network**: Docker bridge network
- **Test Tool**: k6 load testing framework
- **Date**: 2025-06-19
