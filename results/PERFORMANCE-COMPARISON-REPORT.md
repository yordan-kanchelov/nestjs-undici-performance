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

- **Framework Impact (Fastify+Axios vs Express+Axios)**: 16.13%
- **HTTP Client Impact (Fastify+Undici vs Fastify+Axios)**: 62.12%
- **Combined Impact (Fastify+Undici vs Express+Axios)**: 68.23%
- **Express + Axios Avg (Baseline)**: 31.33ms
- **Fastify + Axios Avg**: 26.28ms
- **Fastify + Undici Avg**: 9.95ms


### Node.js 22

- **Framework Impact (Fastify+Axios vs Express+Axios)**: 9.60%
- **HTTP Client Impact (Fastify+Undici vs Fastify+Axios)**: 62.22%
- **Combined Impact (Fastify+Undici vs Express+Axios)**: 65.85%
- **Express + Axios Avg (Baseline)**: 31.44ms
- **Fastify + Axios Avg**: 28.43ms
- **Fastify + Undici Avg**: 10.74ms


### Node.js 24

- **Framework Impact (Fastify+Axios vs Express+Axios)**: -0.88%
- **HTTP Client Impact (Fastify+Undici vs Fastify+Axios)**: 72.08%
- **Combined Impact (Fastify+Undici vs Express+Axios)**: 71.84%
- **Express + Axios Avg (Baseline)**: 33.78ms
- **Fastify + Axios Avg**: 34.08ms
- **Fastify + Undici Avg**: 9.51ms


## Detailed Comparison Tables

### Average Response Time (ms)
| Node Version | Express+Axios (Baseline) | Fastify+Axios | Fastify+Undici | Fastify+Axios vs Express+Axios | Fastify+Undici vs Express+Axios | Fastify+Undici vs Fastify+Axios |
|--------------|-------------------------|---------------|----------------|--------------------------------|----------------------------------|----------------------------------|
| Node 20 | 31.33 | 26.28 | 9.95 | 16.13% | 68.23% | 62.12% |
| Node 22 | 31.44 | 28.43 | 10.74 | 9.60% | 65.85% | 62.22% |
| Node 24 | 33.78 | 34.08 | 9.51 | -0.88% | 71.84% | 72.08% |

### P95 Response Time (ms)
| Node Version | Express+Axios | Fastify+Axios | Fastify+Undici |
|--------------|---------------|---------------|----------------|
| Node 20 | 67.46 | 57.52 | 19.02 |
| Node 22 | 56.22 | 54.46 | 16.90 |
| Node 24 | 61.89 | 61.43 | 16.28 |

### HTTP Client Comparison (Fastify Framework Only)
| Node Version | Fastify+Axios | Fastify+Undici | Improvement (%) |
|--------------|---------------|----------------|------------------|
| Node 20 | 26.28ms | 9.95ms | 62.12% |
| Node 22 | 28.43ms | 10.74ms | 62.22% |
| Node 24 | 34.08ms | 9.51ms | 72.08% |

## Test Environment

- **Machine**: Local Docker containers
- **Network**: Docker bridge network
- **Test Tool**: k6 load testing framework
- **Date**: 2025-06-16
