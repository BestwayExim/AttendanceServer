/**
 * @openapi
 * /user/login:
 *   post:
 *     summary: User login and generate authentication token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user
 *                 example: 'user@example.com'
 *               password:
 *                 type: string
 *                 description: The password for the user account
 *                 example: 'password123'
 *     responses:
 *       200:
 *         description: Login successful and token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating successful login
 *                   example: 'Login Successful'
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated access
 *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
 *       400:
 *         description: Bad request due to missing email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Email and password are required'
 *       401:
 *         description: Unauthorized due to invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Invalid Email or Invalid Password'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating internal server error
 *                   example: 'Internal Server Error'
 *                 error:
 *                   type: string
 *                   description: Detailed error message
 *                   example: 'Detailed error message here'
 */


/**
 * @openapi
 * /user/apply-for-leaves:
 *   post:
 *     summary: Apply for various types of leaves including late coming, work from home, and regular leave
 *     tags: [Attendance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leaveType:
 *                 type: string
 *                 description: The type of leave being applied for
 *                 enum: [lateComing, workFromHome, leave]
 *                 example: 'lateComing'
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The date for late coming in YYYY-MM-DD format (required if leaveType is lateComing)
 *                 example: '2024-09-13'
 *               time:
 *                 type: string
 *                 format: time
 *                 description: The time of arrival for late coming in HH:MM:SS format (required if leaveType is lateComing)
 *                 example: '09:30:00'
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: The start date for leave (required if leaveType is leave or workFromHome)
 *                 example: '2024-09-15'
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: The end date for leave (required if leaveType is leave or workFromHome)
 *                 example: '2024-09-20'
 *               reason:
 *                 type: string
 *                 description: The reason for the leave or late coming
 *                 example: 'Traffic jam'
 *     responses:
 *       200:
 *         description: Leave application was successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating successful application
 *                   example: 'Leave Applied Successfully'
 *       400:
 *         description: Bad request due to validation errors or exceeding limits
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message describing the validation issue or limits
 *                   example: 'Invalid leave type'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating internal server error
 *                   example: 'Internal Server Error'
 *                 error:
 *                   type: string
 *                   description: Detailed error message
 *                   example: 'Error details here'
 */


/**
 * @openapi
 * /user/get-attendance-data:
 *   get:
 *     summary: Retrieve attendance data for the current day
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: [] # Assuming Bearer token is used for authentication
 *     responses:
 *       200:
 *         description: Successfully retrieved attendance data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating that the attendance data was retrieved
 *                   example: 'Attendance Data'
 *                 checkInTime:
 *                   type: string
 *                   format: date-time
 *                   description: The calculated check-in time for the user
 *                   example: '2024-09-13T09:30:00.000Z'
 *                 checkOutTime:
 *                   type: string
 *                   format: date-time
 *                   description: The calculated check-out time for the user
 *                   example: '2024-09-13T17:30:00.000Z'
 *                 workStartTime:
 *                   type: string
 *                   format: date-time
 *                   description: The official work start time configured in environment variables
 *                   example: '2024-09-13T09:00:00.000Z'
 *                 workEndTime:
 *                   type: string
 *                   format: date-time
 *                   description: The official work end time configured in environment variables
 *                   example: '2024-09-13T17:00:00.000Z'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating internal server error
 *                   example: 'Internal Server Error'
 *                 error:
 *                   type: string
 *                   description: Detailed error message
 *                   example: 'Error details here'
 *     # BearerAuth might be defined elsewhere in your OpenAPI configuration
 *     components:
 *       securitySchemes:
 *         BearerAuth:
 *           type: http
 *           scheme: bearer
 *           bearerFormat: JWT
 */


/**
 * @openapi
 * /checkIn-checkOut:
 *   post:
 *     summary: Handle user check-in and check-out with location validation
 *     tags: [Attendance]
 *     security:
 *       - BearerAuth: [] # Assuming Bearer token is used for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               checkIn:
 *                 type: boolean
 *                 description: Indicates whether the user is checking in (true) or checking out (false)
 *                 example: true
 *               lat:
 *                 type: number
 *                 format: float
 *                 description: Latitude of the user's current location
 *                 example: 12.9716
 *               lng:
 *                 type: number
 *                 format: float
 *                 description: Longitude of the user's current location
 *                 example: 77.5946
 *     responses:
 *       200:
 *         description: Successfully updated check-in or check-out status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating that the attendance status was updated
 *                   example: 'Attendance Updated Successfully'
 *       400:
 *         description: Bad request due to invalid input or business logic errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message describing the validation issue or business logic error
 *                   example: 'Check In and Location are required or You are out of office or You are on leave or You are late or You are already checked in or You are not checked in or You are already checked out'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating internal server error
 *                   example: 'Internal Server Error'
 *                 error:
 *                   type: string
 *                   description: Detailed error message
 *                   example: 'Error details here'
 *     components:
 *       securitySchemes:
 *         BearerAuth:
 *           type: http
 *           scheme: bearer
 *           bearerFormat: JWT
 */
