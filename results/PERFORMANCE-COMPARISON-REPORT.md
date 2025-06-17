# NestJS HTTP Module Performance Comparison

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

#### Response Time Improvements
- **Framework Impact (Fastify+Axios vs Express+Axios)**: 21.88%
- **HTTP Client Impact (Fastify+Undici vs Fastify+Axios)**: 59.91%
- **Combined Impact (Fastify+Undici vs Express+Axios)**: 68.68%

#### Average Response Times
- **Express + Axios (Baseline)**: 32.80ms
- **Fastify + Axios**: 25.63ms
- **Fastify + Undici**: 10.27ms

#### Throughput Improvements
- **Fastify+Axios vs Express+Axios**: 27.89%
- **Fastify+Undici vs Fastify+Axios**: 149.16%
- **Fastify+Undici vs Express+Axios**: 218.64%


### Node.js 22

#### Response Time Improvements
- **Framework Impact (Fastify+Axios vs Express+Axios)**: 21.49%
- **HTTP Client Impact (Fastify+Undici vs Fastify+Axios)**: 62.46%
- **Combined Impact (Fastify+Undici vs Express+Axios)**: 70.52%

#### Average Response Times
- **Express + Axios (Baseline)**: 37.95ms
- **Fastify + Axios**: 29.79ms
- **Fastify + Undici**: 11.19ms

#### Throughput Improvements
- **Fastify+Axios vs Express+Axios**: 27.33%
- **Fastify+Undici vs Fastify+Axios**: 165.75%
- **Fastify+Undici vs Express+Axios**: 238.37%


### Node.js 24

#### Response Time Improvements
- **Framework Impact (Fastify+Axios vs Express+Axios)**: 4.01%
- **HTTP Client Impact (Fastify+Undici vs Fastify+Axios)**: 69.75%
- **Combined Impact (Fastify+Undici vs Express+Axios)**: 70.97%

#### Average Response Times
- **Express + Axios (Baseline)**: 36.72ms
- **Fastify + Axios**: 35.25ms
- **Fastify + Undici**: 10.66ms

#### Throughput Improvements
- **Fastify+Axios vs Express+Axios**: 4.19%
- **Fastify+Undici vs Fastify+Axios**: 229.43%
- **Fastify+Undici vs Express+Axios**: 243.22%


## Detailed Comparison Tables

### Average Response Time (ms)
| Node Version | Express+Axios (Baseline) | Fastify+Axios | Fastify+Undici | Fastify+Axios vs Express+Axios | Fastify+Undici vs Express+Axios | Fastify+Undici vs Fastify+Axios |
|--------------|-------------------------|---------------|----------------|--------------------------------|----------------------------------|----------------------------------|
| Node 20 | 32.80 | 25.63 | 10.27 | 21.88% | 68.68% | 59.91% |
| Node 22 | 37.95 | 29.79 | 11.19 | 21.49% | 70.52% | 62.46% |
| Node 24 | 36.72 | 35.25 | 10.66 | 4.01% | 70.97% | 69.75% |

### P95 Response Time (ms)
| Node Version | Express+Axios | Fastify+Axios | Fastify+Undici |
|--------------|---------------|---------------|----------------|
| Node 20 | 62.78 | 47.34 | 17.70 |
| Node 22 | 90.59 | 56.38 | 18.59 |
| Node 24 | 64.64 | 64.02 | 17.85 |

### Throughput (requests/second)
| Node Version | Express+Axios | Fastify+Axios | Fastify+Undici | Fastify+Axios vs Express+Axios | Fastify+Undici vs Express+Axios | Fastify+Undici vs Fastify+Axios |
|--------------|---------------|---------------|----------------|--------------------------------|----------------------------------|----------------------------------|
| Node 20 | 1951.56 | 2495.76 | 6218.43 | 27.89% | 218.64% | 149.16% |
| Node 22 | 1688.49 | 2149.90 | 5713.39 | 27.33% | 238.37% | 165.75% |
| Node 24 | 1746.37 | 1819.46 | 5993.83 | 4.19% | 243.22% | 229.43% |

### HTTP Client Comparison (Fastify Framework Only)
| Node Version | Fastify+Axios | Fastify+Undici | Improvement (%) |
|--------------|---------------|----------------|------------------|
| Node 20 | 25.63ms | 10.27ms | 59.91% |
| Node 22 | 29.79ms | 11.19ms | 62.46% |
| Node 24 | 35.25ms | 10.66ms | 69.75% |

## Test Environment

- **Machine**: Local Docker containers
- **Network**: Docker bridge network
- **Test Tool**: k6 load testing framework
- **Date**: 2025-06-16
