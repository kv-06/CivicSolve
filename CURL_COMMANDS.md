# 🚀 CURL Commands for CivicSolve API

## ✅ **Working Commands**

### **1. Create a New Issue/Complaint**

#### **PowerShell (Windows)**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/complaints" -Method POST -ContentType "application/json" -Body '{
  "title": "Street Light Not Working",
  "description": "The street light at the corner of Main Street and Oak Avenue has been flickering for the past week and completely stopped working yesterday. This creates a safety hazard for pedestrians and vehicles during night time.",
  "category": "Electricity",
  "location": "Main Street and Oak Avenue, Downtown Area",
  "coordinates": {
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  "priority": "high",
  "media": []
}'
```

#### **Bash/Linux/Mac**
```bash
curl -X POST http://localhost:3000/api/complaints \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Street Light Not Working",
    "description": "The street light at the corner of Main Street and Oak Avenue has been flickering for the past week and completely stopped working yesterday. This creates a safety hazard for pedestrians and vehicles during night time.",
    "category": "Electricity",
    "location": "Main Street and Oak Avenue, Downtown Area",
    "coordinates": {
      "latitude": 12.9716,
      "longitude": 77.5946
    },
    "priority": "high",
    "media": []
  }'
```

### **2. Get All Issues/Complaints**

#### **PowerShell**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/complaints" -Method GET
```

#### **Bash**
```bash
curl http://localhost:3000/api/complaints
```

### **3. Get API Information**

#### **PowerShell**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api" -Method GET
```

#### **Bash**
```bash
curl http://localhost:3000/api
```

### **4. Get Health Status**

#### **PowerShell**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET
```

#### **Bash**
```bash
curl http://localhost:3000/health
```

## 🎯 **Example Issues to Create**

### **Road Issue**
```json
{
  "title": "Pothole on Highway 101",
  "description": "Large pothole causing damage to vehicles. Located in the right lane heading northbound.",
  "category": "Roads",
  "location": "Highway 101, Mile Marker 15.2",
  "coordinates": {
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "priority": "high",
  "media": []
}
```

### **Water Issue**
```json
{
  "title": "Water Leak in Residential Area",
  "description": "Water is leaking from a broken pipe on Elm Street. Water is pooling on the sidewalk and creating a hazard.",
  "category": "Water",
  "location": "123 Elm Street, Residential District",
  "coordinates": {
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  "priority": "medium",
  "media": []
}
```

### **Waste Management Issue**
```json
{
  "title": "Garbage Collection Missed",
  "description": "Garbage collection was missed on our street this week. Bins are overflowing and creating odor issues.",
  "category": "Waste Management",
  "location": "Oak Street, Block 5",
  "coordinates": {
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  "priority": "medium",
  "media": []
}
```

## 📱 **Categories Available**

- `Electricity`
- `Roads`
- `Water`
- `Waste Management`
- `Public Safety`
- `Environment`
- `Transportation`
- `Healthcare`
- `Education`
- `Other`

## 🚨 **Priority Levels**

- `low` - Minor issue, can be addressed in normal course
- `medium` - Moderate issue, should be addressed within a week
- `high` - Urgent issue, needs immediate attention
- `critical` - Emergency situation, requires immediate response

## 🌐 **Database Storage**

All complaints created via these commands are stored in your **MongoDB Cloud Database** at:
- **Database**: `test`
- **Collection**: `complaints`
- **Cloud Provider**: MongoDB Atlas

## 🔧 **Testing Your API**

1. **Start the server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Test API root:**
   ```bash
   curl http://localhost:3000/api
   ```

3. **Create a test issue:**
   ```bash
   # Use any of the PowerShell or Bash commands above
   ```

4. **Verify the issue was created:**
   ```bash
   curl http://localhost:3000/api/complaints
   ```

## ✅ **Success Response**

When you create a complaint successfully, you'll get a response like:
```json
{
  "success": true,
  "message": "Complaint created successfully",
  "data": {
    "title": "Street Light Not Working",
    "description": "...",
    "complaintId": "CMP-1695481234567-ABC12",
    "status": "open",
    "priority": "high",
    "createdDate": "2023-09-23T17:25:39.000Z",
    "_id": "68d2da7ca311d2e322284d9c"
  }
}
```

## 🎉 **Your Issue is Now in the Cloud!**

The complaint you create will be:
- ✅ Stored in MongoDB Atlas cloud database
- ✅ Accessible via the API
- ✅ Visible in your frontend app
- ✅ Trackable with a unique complaint ID
- ✅ Geotagged with coordinates
- ✅ Categorized and prioritized

**Ready to test!** 🚀
