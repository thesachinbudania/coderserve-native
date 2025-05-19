import * as z from 'zod';

export const imageAssetSchema = z.object({
	uri: z.string().url(),
	width: z.number(),
	height: z.number(),
	type: z.literal('image'),
	fileName: z.string().optional(),
	fileSize: z.number().optional(),
});
