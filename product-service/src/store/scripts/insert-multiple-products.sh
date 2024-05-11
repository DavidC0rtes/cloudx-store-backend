#!/bin/bash
set -o pipefail
set -e
generate_random_data() {
  local id=$1
  local title="Book title $1"
  local description="This is a test description for book $title"
  local price=$((1 + RANDOM % 100))  # Generate random price between 0 and 100

  echo "{\"id\":{\"S\":\"$id\"},\"title\":{\"S\":\"$title\"},\"description\":{\"S\":\"$description\"},\"price\":{\"N\":\"$price\"}}"
}

generate_random_stock_data() {
  local product_id=$1
  local count=$((1 + RANDOM % 100))
  
  echo "{\"product_id\":{\"S\":\"$product_id\"},\"count\":{\"N\":\"$count\"}}"
}

for i in {1..10}; do 
  data=$(generate_random_data "$i")
  stock_data=$(generate_random_stock_data "$i")
  if [ "$1" = "aws" ]; then
    aws dynamodb put-item --region us-east-1 --table-name cloudx-store-backend-dev-products --item "$data"
    aws dynamodb put-item --region us-east-1 --table-name cloudx-store-backend-dev-stocks --item "$stock_data"
  else
    aws dynamodb put-item --region us-east-1 --endpoint-url http://localhost:8000 --table-name cloudx-store-backend-dev-products --item "$data"
    aws dynamodb put-item --region us-east-1 --endpoint-url http://localhost:8000 --table-name cloudx-store-backend-dev-stocks --item "$stock_data"
  fi
 done