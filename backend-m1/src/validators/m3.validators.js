const { z } = require('zod');

exports.createMaintenanceSchema = z.object({
  vehicleId: z.number().int().positive('Vehicle ID must be a valid positive number'),
  description: z.string().min(3, 'Description must be at least 3 characters long'),
  cost: z.number().min(0, 'Cost cannot be negative'),
  date: z.string().datetime().optional()
});

exports.createFuelSchema = z.object({
  vehicleId: z.number().int().positive('Vehicle ID must be a valid positive number'),
  liters: z.number().positive('Liters must be a positive number'),
  cost: z.number().min(0, 'Cost cannot be negative'),
  date: z.string().datetime().optional()
});

exports.createExpenseSchema = z.object({
  vehicleId: z.number().int().positive('Vehicle ID must be a valid positive number'),
  description: z.string().min(3, 'Description must be at least 3 characters long'),
  cost: z.number().min(0, 'Cost cannot be negative'),
  type: z.string().min(2, 'Type is required'),
  date: z.string().datetime().optional()
});

exports.updateExpenseSchema = z.object({
  description: z.string().min(3, 'Description must be at least 3 characters long').optional(),
  cost: z.number().min(0, 'Cost cannot be negative').optional(),
  type: z.string().min(2, 'Type is required').optional()
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided to update",
});
