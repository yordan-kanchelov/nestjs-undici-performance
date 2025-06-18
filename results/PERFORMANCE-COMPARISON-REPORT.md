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
- **Framework Impact (Fastify+Axios vs Express+Axios)**: 18.69%
- **HTTP Client Impact (Fastify+Undici vs Fastify+Axios)**: 63.55%
- **Combined Impact (Fastify+Undici vs Express+Axios)**: 70.36%

#### Average Response Times
- **Express + Axios (Baseline)**: 30.05ms
- **Fastify + Axios**: 24.44ms
- **Fastify + Undici**: 8.91ms

#### Throughput Improvements
- **Fastify+Axios vs Express+Axios**: 22.78%
- **Fastify+Undici vs Fastify+Axios**: 174.34%
- **Fastify+Undici vs Express+Axios**: 236.84%


### Node.js 22

#### Response Time Improvements
- **Framework Impact (Fastify+Axios vs Express+Axios)**: 7.43%
- **HTTP Client Impact (Fastify+Undici vs Fastify+Axios)**: 64.22%
- **Combined Impact (Fastify+Undici vs Express+Axios)**: 66.88%

#### Average Response Times
- **Express + Axios (Baseline)**: 30.33ms
- **Fastify + Axios**: 28.08ms
- **Fastify + Undici**: 10.05ms

#### Throughput Improvements
- **Fastify+Axios vs Express+Axios**: 8.01%
- **Fastify+Undici vs Fastify+Axios**: 179.26%
- **Fastify+Undici vs Express+Axios**: 201.63%


### Node.js 24

#### Response Time Improvements
- **Framework Impact (Fastify+Axios vs Express+Axios)**: 1.57%
- **HTTP Client Impact (Fastify+Undici vs Fastify+Axios)**: 71.43%
- **Combined Impact (Fastify+Undici vs Express+Axios)**: 71.87%

#### Average Response Times
- **Express + Axios (Baseline)**: 34.94ms
- **Fastify + Axios**: 34.39ms
- **Fastify + Undici**: 9.83ms

#### Throughput Improvements
- **Fastify+Axios vs Express+Axios**: 1.60%
- **Fastify+Undici vs Fastify+Axios**: 248.98%
- **Fastify+Undici vs Express+Axios**: 254.57%


## Detailed Comparison Tables

### Average Response Time (ms)
| Node Version | Express+Axios (Baseline) | Fastify+Axios | Fastify+Undici | Fastify+Axios vs Express+Axios | Fastify+Undici vs Express+Axios | Fastify+Undici vs Fastify+Axios |
|--------------|-------------------------|---------------|----------------|--------------------------------|----------------------------------|----------------------------------|
| Node 20 | 30.05 | 24.44 | 8.91 | 18.69% | 70.36% | 63.55% |
| Node 22 | 30.33 | 28.08 | 10.05 | 7.43% | 66.88% | 64.22% |
| Node 24 | 34.94 | 34.39 | 9.83 | 1.57% | 71.87% | 71.43% |

### P95 Response Time (ms)
| Node Version | Express+Axios | Fastify+Axios | Fastify+Undici |
|--------------|---------------|---------------|----------------|
| Node 20 | 55.25 | 47.29 | 15.53 |
| Node 22 | 55.62 | 56.02 | 17.71 |
| Node 24 | 61.75 | 65.76 | 17.03 |

### Throughput (requests/second)
| Node Version | Express+Axios | Fastify+Axios | Fastify+Undici | Fastify+Axios vs Express+Axios | Fastify+Undici vs Express+Axios | Fastify+Undici vs Fastify+Axios |
|--------------|---------------|---------------|----------------|--------------------------------|----------------------------------|----------------------------------|
| Node 20 | 2128.33 | 2613.21 | 7169.01 | 22.78% | 236.84% | 174.34% |
| Node 22 | 2108.59 | 2277.50 | 6360.23 | 8.01% | 201.63% | 179.26% |
| Node 24 | 1833.24 | 1862.60 | 6500.14 | 1.60% | 254.57% | 248.98% |

### HTTP Client Comparison (Fastify Framework Only)
| Node Version | Fastify+Axios | Fastify+Undici | Improvement (%) |
|--------------|---------------|----------------|------------------|
| Node 20 | 24.44ms | 8.91ms | 63.55% |
| Node 22 | 28.08ms | 10.05ms | 64.22% |
| Node 24 | 34.39ms | 9.83ms | 71.43% |

## Test Environment

- **Machine**: Local Docker containers
- **Network**: Docker bridge network
- **Test Tool**: k6 load testing framework
- **Date**: 2025-06-18
