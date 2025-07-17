# BuildCost NG Pro - Sample cURL Commands

## 1. Calculate Construction Cost Estimate

```bash
curl -X POST http://localhost:3000/api/estimate \
  -H "Content-Type: application/json" \
  -d '{
    "area": 150,
    "location": "LAGOS",
    "finish": "MEDIUM"
  }'
```

**Expected Response:**
```json
{
  "total": 45328500,
  "low": 40795650,
  "high": 49861350,
  "items": [
    {
      "category": "Foundation",
      "item": "Concrete foundation and footings",
      "unitCost": 45328.5,
      "quantity": 150,
      "total": 6799275
    }
  ],
  "materials": [
    {
      "item": "Cement",
      "unit": "50kg bags",
      "quantity": 375,
      "unitPrice": 8500,
      "total": 3187500
    }
  ],
  "confidence": 0.9
}
```

## 2. Generate PDF Report

```bash
curl -X POST http://localhost:3000/api/pdf \
  -H "Content-Type: application/json" \
  -d '{
    "estimate": {
      "total": 45328500,
      "low": 40795650,
      "high": 49861350,
      "items": [],
      "materials": [],
      "confidence": 0.9
    },
    "projectDetails": {
      "area": 150,
      "location": "LAGOS",
      "finish": "MEDIUM",
      "date": "2025-01-17"
    }
  }' \
  --output cost-estimate.pdf
```

## 3. Get All Projects

```bash
curl -X GET http://localhost:3000/api/projects \
  -H "Content-Type: application/json"
```

## 4. Create New Project

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "3-Bedroom Duplex Lagos",
    "area": 150,
    "location": "LAGOS",
    "finish": "MEDIUM",
    "totalCost": 45328500,
    "lowCost": 40795650,
    "highCost": 49861350
  }'
```

## 5. Get Material Prices (Admin)

```bash
curl -X GET http://localhost:3000/api/admin/materials \
  -H "Content-Type: application/json"
```

## 6. Update Material Price (Admin)

```bash
curl -X PUT http://localhost:3000/api/admin/materials \
  -H "Content-Type: application/json" \
  -d '{
    "id": "clr123456789",
    "priceNGN": 9000
  }'
```

## Test Different Scenarios

### Basic Finish in Rural Area
```bash
curl -X POST http://localhost:3000/api/estimate \
  -H "Content-Type: application/json" \
  -d '{
    "area": 100,
    "location": "RURAL",
    "finish": "BASIC"
  }'
```

### Luxury Finish in Abuja
```bash
curl -X POST http://localhost:3000/api/estimate \
  -H "Content-Type: application/json" \
  -d '{
    "area": 300,
    "location": "ABUJA",
    "finish": "LUXURY"
  }'
```

### Small House in Port Harcourt
```bash
curl -X POST http://localhost:3000/api/estimate \
  -H "Content-Type: application/json" \
  -d '{
    "area": 80,
    "location": "PORT_HARCOURT",
    "finish": "MEDIUM"
  }'
```

## Error Handling Examples

### Invalid Location
```bash
curl -X POST http://localhost:3000/api/estimate \
  -H "Content-Type: application/json" \
  -d '{
    "area": 150,
    "location": "INVALID_LOCATION",
    "finish": "MEDIUM"
  }'
```

### Area Too Small
```bash
curl -X POST http://localhost:3000/api/estimate \
  -H "Content-Type: application/json" \
  -d '{
    "area": 5,
    "location": "LAGOS",
    "finish": "MEDIUM"
  }'
```