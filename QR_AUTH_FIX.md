# QR Generation Authentication Error - Fixed

## Problem
When trying to generate a QR code, the API was returning:
```json
{
    "success": false,
    "message": "User not authenticated",
    "stack": "Error: User not authenticated\n    at file:///C:/Users/aakas/OneDrive/Desktop/Acadify/backend/src/middlewares/auth.middleware.js:44:23..."
}
```

## Root Cause
The issue was in the **authentication middleware chain**:

1. **`authMiddleware`** (lines 23-26) was setting:
   - `req.userId`
   - `req.enrollmentNumber`
   - `req.roleId`
   
   BUT it was **NOT setting `req.user`**

2. **`requireRole`** middleware (line 43) was checking for `req.user`:
   ```javascript
   if (!req.user) {
       throw new AppError('User not authenticated', 401);
   }
   ```

3. **`QRController.generate`** (line 9) was trying to access `req.user.id`:
   ```javascript
   const userId = req.user?.id;
   ```

Since `authMiddleware` never populated `req.user`, the `requireRole` middleware was throwing the "User not authenticated" error.

## Solution
Updated `authMiddleware` to populate the `req.user` object after decoding the JWT token:

```javascript
const decoded = jwtService.verifyToken(token);
req.userId = decoded.userId;
req.enrollmentNumber = decoded.enrollmentNumber;
req.roleId = decoded.roleId;

// Populate req.user for compatibility with requireRole and controllers
// Note: decoded.roleId actually contains the role name (e.g., "teacher", "admin", "student")
// because the login services pass role name as the third parameter to generateTokens
req.user = {
    id: decoded.userId,
    _id: decoded.userId,
    role: decoded.roleId, // roleId field contains the role name
    enrollmentNumber: decoded.enrollmentNumber
};

next();
```

## Important Note
There's a naming inconsistency in the codebase:
- The JWT token field is called `roleId`
- But it actually contains the **role name** (e.g., "teacher", "admin", "student")
- This is because `teacher.service.js` (line 29-32) passes `teacher.role` as the third parameter to `jwtService.generateTokens()`

## Files Modified
1. `backend/src/middlewares/auth.middleware.js` - Added `req.user` population

## Testing
To test the fix, you can:

1. **Use the test script**:
   ```bash
   node test-qr-generation.js
   ```
   (Update the teacher credentials in the script first)

2. **Use Postman/Thunder Client**:
   - Login as a teacher to get a token
   - Call `POST /api/qr/generate` with the token
   - Body: `{ "timetableId": "valid_id", "expiresInSeconds": 30 }`

3. **From the frontend**:
   - Login as a teacher
   - Try to generate a QR code
   - It should now work without the "User not authenticated" error

## Additional Recommendations

### 1. Fix Naming Inconsistency
Consider renaming the JWT token field from `roleId` to `role` for clarity:

**In `utils/jwt.js`**:
```javascript
generateAccessToken(userId, enrollmentNumber, role) {
    return jwt.sign(
        { userId, enrollmentNumber, role }, // Changed from roleId
        config.JWT_SECRET,
        { expiresIn: '15m' }
    );
}
```

**In `middlewares/auth.middleware.js`**:
```javascript
const decoded = jwtService.verifyToken(token);
req.userId = decoded.userId;
req.enrollmentNumber = decoded.enrollmentNumber;
req.role = decoded.role; // Changed from roleId

req.user = {
    id: decoded.userId,
    _id: decoded.userId,
    role: decoded.role,
    enrollmentNumber: decoded.enrollmentNumber
};
```

### 2. Standardize Controller Access Patterns
Some controllers use `req.userId`, others use `req.user._id` or `req.user.id`. Standardize to one approach:

**Current inconsistencies**:
- `teacher.controller.js` line 40: `req.userId`
- `attendance.controller.js` line 9: `req.user._id`
- `Qr.controller.js` line 9: `req.user?.id`

**Recommendation**: Use `req.user.id` everywhere for consistency.

### 3. Update QR Controller
The `QRController.generate` method has a redundant check. Since `requireRole` middleware already ensures the user is authenticated, you can simplify:

```javascript
static async generate(req, res, next) {
  try {
    const { timetableId, expiresInSeconds } = req.body;
    const userId = req.user.id; // No need for optional chaining

    const result = await QRService.generateForTimetable({
      timetableId,
      teacherUserId: userId,
      expiresInSeconds,
    });

    return res.status(201).json({
      message: "QR generated successfully",
      sessionId: result.sessionId,
      qrDataUri: result.qrDataUri,
      expiresAt: result.expiresAt,
    });
  } catch (err) {
    next(err);
  }
}
```

## Status
✅ **FIXED** - The authentication middleware now properly populates `req.user`, allowing the QR generation endpoint to work correctly.
