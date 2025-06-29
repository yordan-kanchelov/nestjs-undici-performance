#!/bin/bash

# Script to test performance across Node.js 20, 22, and 24 with health checks

echo "======================================"
echo "NestJS Performance Test - All Node Versions"
echo "======================================"
echo ""

# Create results directory if it doesn't exist
mkdir -p results

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a service is healthy
check_service_health() {
    local SERVICE_NAME=$1
    local URL=$2
    local MAX_RETRIES=30
    local RETRY_DELAY=2
    local RETRIES=0
    
    echo -n "Checking $SERVICE_NAME health at $URL..."
    
    while [ $RETRIES -lt $MAX_RETRIES ]; do
        if curl -sf "$URL" > /dev/null 2>&1; then
            echo -e " ${GREEN}✓ Healthy${NC}"
            return 0
        fi
        
        RETRIES=$((RETRIES + 1))
        if [ $RETRIES -lt $MAX_RETRIES ]; then
            echo -n "."
            sleep $RETRY_DELAY
        fi
    done
    
    echo -e " ${RED}✗ Failed${NC}"
    return 1
}

# Function to detect ports from k6 script
detect_ports_from_k6() {
    local K6_SCRIPT=$1
    local MOCK_PORT=""
    local FASTIFY_AXIOS_PORT=""
    local FASTIFY_UNDICI_PORT=""
    local EXPRESS_AXIOS_PORT=""
    local EXPRESS_AXIOS_INTERCEPTOR_PORT=""
    local FASTIFY_AXIOS_INTERCEPTOR_PORT=""
    local FASTIFY_UNDICI_INTERCEPTOR_PORT=""
    
    # Extract ports from the k6 script URLs (portable version)
    if [ -f "$K6_SCRIPT" ]; then
        # Look for localhost URLs in the script
        # Parse the k6 script to find which port is for each service
        if grep -q "testExpressAxios" "$K6_SCRIPT"; then
            EXPRESS_AXIOS_PORT=$(grep -A5 "testExpressAxios" "$K6_SCRIPT" | grep -E 'http://localhost:[0-9]+/api' | head -1 | sed -E 's/.*http:\/\/localhost:([0-9]+).*/\1/')
        fi
        
        if grep -q "testFastifyAxios" "$K6_SCRIPT"; then
            FASTIFY_AXIOS_PORT=$(grep -A5 "testFastifyAxios" "$K6_SCRIPT" | grep -E 'http://localhost:[0-9]+/api' | head -1 | sed -E 's/.*http:\/\/localhost:([0-9]+).*/\1/')
        fi
        
        if grep -q "testFastifyUndici" "$K6_SCRIPT"; then
            FASTIFY_UNDICI_PORT=$(grep -A5 "testFastifyUndici" "$K6_SCRIPT" | grep -E 'http://localhost:[0-9]+/api' | head -1 | sed -E 's/.*http:\/\/localhost:([0-9]+).*/\1/')
        fi
        
        if grep -q "testExpressAxiosInterceptor" "$K6_SCRIPT"; then
            EXPRESS_AXIOS_INTERCEPTOR_PORT=$(grep -A5 "testExpressAxiosInterceptor" "$K6_SCRIPT" | grep -E 'http://localhost:[0-9]+/api' | head -1 | sed -E 's/.*http:\/\/localhost:([0-9]+).*/\1/')
        fi
        
        if grep -q "testFastifyAxiosInterceptor" "$K6_SCRIPT"; then
            FASTIFY_AXIOS_INTERCEPTOR_PORT=$(grep -A5 "testFastifyAxiosInterceptor" "$K6_SCRIPT" | grep -E 'http://localhost:[0-9]+/api' | head -1 | sed -E 's/.*http:\/\/localhost:([0-9]+).*/\1/')
        fi
        
        if grep -q "testFastifyUndiciInterceptor" "$K6_SCRIPT"; then
            FASTIFY_UNDICI_INTERCEPTOR_PORT=$(grep -A5 "testFastifyUndiciInterceptor" "$K6_SCRIPT" | grep -E 'http://localhost:[0-9]+/api' | head -1 | sed -E 's/.*http:\/\/localhost:([0-9]+).*/\1/')
        fi
        
        # For mock service, we can infer from fastify axios port
        if [ "$FASTIFY_AXIOS_PORT" = "3002" ]; then
            MOCK_PORT="3001"
        elif [ "$FASTIFY_AXIOS_PORT" = "3012" ]; then
            MOCK_PORT="3011"
        elif [ "$FASTIFY_AXIOS_PORT" = "3022" ]; then
            MOCK_PORT="3021"
        fi
    fi
    
    echo "$MOCK_PORT:$FASTIFY_AXIOS_PORT:$FASTIFY_UNDICI_PORT:$EXPRESS_AXIOS_PORT:$EXPRESS_AXIOS_INTERCEPTOR_PORT:$FASTIFY_AXIOS_INTERCEPTOR_PORT:$FASTIFY_UNDICI_INTERCEPTOR_PORT"
}

# Function to check all services for a Node version
check_all_services() {
    local NODE_VERSION=$1
    local K6_SCRIPT=$2
    local ALL_HEALTHY=true
    
    # Detect ports from k6 script
    IFS=':' read -r MOCK_PORT FASTIFY_AXIOS_PORT FASTIFY_UNDICI_PORT EXPRESS_AXIOS_PORT EXPRESS_AXIOS_INTERCEPTOR_PORT FASTIFY_AXIOS_INTERCEPTOR_PORT FASTIFY_UNDICI_INTERCEPTOR_PORT <<< "$(detect_ports_from_k6 "$K6_SCRIPT")"
    
    echo ""
    echo "Health checks for Node.js $NODE_VERSION:"
    echo "----------------------------------------"
    echo "Detected ports:"
    echo "  Mock: $MOCK_PORT"
    echo "  Express+Axios: $EXPRESS_AXIOS_PORT"
    echo "  Fastify+Axios: $FASTIFY_AXIOS_PORT"
    echo "  Fastify+Undici: $FASTIFY_UNDICI_PORT"
    echo "  Express+Axios+Interceptor: $EXPRESS_AXIOS_INTERCEPTOR_PORT"
    echo "  Fastify+Axios+Interceptor: $FASTIFY_AXIOS_INTERCEPTOR_PORT"
    echo "  Fastify+Undici+Interceptor: $FASTIFY_UNDICI_INTERCEPTOR_PORT"
    
    # Check mock service
    if [ -n "$MOCK_PORT" ]; then
        if ! check_service_health "Mock Service" "http://localhost:$MOCK_PORT/api/data"; then
            ALL_HEALTHY=false
        fi
    fi
    
    # Check Express+Axios service
    if [ -n "$EXPRESS_AXIOS_PORT" ]; then
        if ! check_service_health "Express+Axios" "http://localhost:$EXPRESS_AXIOS_PORT/api"; then
            ALL_HEALTHY=false
        fi
    fi
    
    # Check Fastify+Axios service
    if [ -n "$FASTIFY_AXIOS_PORT" ]; then
        if ! check_service_health "Fastify+Axios" "http://localhost:$FASTIFY_AXIOS_PORT/api"; then
            ALL_HEALTHY=false
        fi
    fi
    
    # Check Fastify+Undici service
    if [ -n "$FASTIFY_UNDICI_PORT" ]; then
        if ! check_service_health "Fastify+Undici" "http://localhost:$FASTIFY_UNDICI_PORT/api"; then
            ALL_HEALTHY=false
        fi
    fi
    
    # Check Express+Axios+Interceptor service
    if [ -n "$EXPRESS_AXIOS_INTERCEPTOR_PORT" ]; then
        if ! check_service_health "Express+Axios+Interceptor" "http://localhost:$EXPRESS_AXIOS_INTERCEPTOR_PORT/api"; then
            ALL_HEALTHY=false
        fi
    fi
    
    # Check Fastify+Axios+Interceptor service
    if [ -n "$FASTIFY_AXIOS_INTERCEPTOR_PORT" ]; then
        if ! check_service_health "Fastify+Axios+Interceptor" "http://localhost:$FASTIFY_AXIOS_INTERCEPTOR_PORT/api"; then
            ALL_HEALTHY=false
        fi
    fi
    
    # Check Fastify+Undici+Interceptor service
    if [ -n "$FASTIFY_UNDICI_INTERCEPTOR_PORT" ]; then
        if ! check_service_health "Fastify+Undici+Interceptor" "http://localhost:$FASTIFY_UNDICI_INTERCEPTOR_PORT/api"; then
            ALL_HEALTHY=false
        fi
    fi
    
    if [ "$ALL_HEALTHY" = true ]; then
        echo -e "${GREEN}All services are healthy!${NC}"
        return 0
    else
        echo -e "${RED}Some services are not healthy!${NC}"
        return 1
    fi
}

# Function to get container logs for debugging
get_container_logs() {
    local COMPOSE_FILE=$1
    local SERVICE_NAME=$2
    
    echo ""
    echo "Logs for $SERVICE_NAME:"
    echo "----------------------------------------"
    docker compose -f $COMPOSE_FILE logs --tail=50 $SERVICE_NAME 2>&1
}

# Function to run test for a specific Node version
run_node_test() {
    local NODE_VERSION=$1
    local COMPOSE_FILE=$2
    local K6_SCRIPT=$3
    
    echo ""
    echo "======================================"
    echo "Testing with Node.js $NODE_VERSION"
    echo "======================================"
    
    # Stop any running containers
    echo "Stopping existing containers..."
    docker compose -f $COMPOSE_FILE down --remove-orphans
    
    # Start containers
    echo "Starting containers with Node.js $NODE_VERSION..."
    docker compose -f $COMPOSE_FILE up --build -d
    
    # Wait a bit for containers to initialize
    echo "Waiting for containers to initialize..."
    sleep 5
    
    # Perform health checks
    if ! check_all_services $NODE_VERSION $K6_SCRIPT; then
        echo -e "${YELLOW}Warning: Not all services are healthy. Checking logs...${NC}"
        
        # Get container names from docker compose
        echo ""
        echo "Container statuses:"
        docker compose -f $COMPOSE_FILE ps
        
        # Get logs for all services
        echo ""
        echo "Getting logs for all services..."
        docker compose -f $COMPOSE_FILE logs --tail=50
        
        echo ""
        echo -e "${YELLOW}Attempting to continue with test despite unhealthy services...${NC}"
        echo -e "${YELLOW}Results may be incomplete or invalid.${NC}"
        
        # Optional: Ask user if they want to continue
        read -p "Do you want to continue with the test? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Skipping test for Node.js $NODE_VERSION"
            docker compose -f $COMPOSE_FILE down
            return 1
        fi
    fi
    
    # Run k6 test
    echo ""
    echo "Running performance test..."
    if k6 run $K6_SCRIPT; then
        echo -e "${GREEN}Test completed successfully!${NC}"
    else
        echo -e "${RED}Test failed!${NC}"
    fi
    
    # Stop containers
    echo "Stopping containers..."
    docker compose -f $COMPOSE_FILE down
    
    echo ""
    return 0
}

# Main execution
echo "Starting comprehensive performance tests..."
echo ""

# Test with Node.js 20 (default)
if ! run_node_test "20" "docker-compose.yml" "k6-scripts/test-node20.js"; then
    echo -e "${RED}Node.js 20 test failed or was skipped${NC}"
fi

# Test with Node.js 22
if ! run_node_test "22" "docker-compose-node22.yml" "k6-scripts/test-node22.js"; then
    echo -e "${RED}Node.js 22 test failed or was skipped${NC}"
fi

# Test with Node.js 24
if ! run_node_test "24" "docker-compose-node24.yml" "k6-scripts/test-node24.js"; then
    echo -e "${RED}Node.js 24 test failed or was skipped${NC}"
fi

# Generate comparison report if script exists
if [ -f "generate-comparison-report.js" ]; then
    echo "======================================"
    echo "Generating Comparison Report"
    echo "======================================"
    node generate-comparison-report.js
    echo ""
fi

# Display summary of available results
echo "======================================"
echo "Available Results"
echo "======================================"
echo ""

for file in results/*.json results/*.csv results/*.md; do
    if [ -f "$file" ]; then
        echo "✓ $(basename "$file")"
    fi
done

echo ""
echo "======================================"
echo "All tests completed!"
echo "======================================"
echo ""
echo "View detailed results in the 'results' directory"
echo "Main report: results/PERFORMANCE-COMPARISON-REPORT.md"