import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().min(1, 'Email is required').email('Invalid email format'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = loginSchema.extend({
	currency: z.enum(['USD', 'EUR', 'GBP', 'JPY', 'CAD'], {
		error: () => ({ message: 'Please select a valid currency' }),
	}),
	promoCode: z.string().optional(),
	isAgeConfirmed: z.boolean({
		error: () => ({ message: 'You must confirm your age' }),
	}),
	hasAcceptedPromo: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
