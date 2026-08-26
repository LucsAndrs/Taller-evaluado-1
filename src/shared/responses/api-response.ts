export class ApiResponse<T> {
	success: boolean;
	error: { code: string; message: string } | null;
	data: T | null;
	meta: { timestamp: string; [key: string]: any };

	private constructor(
		success: boolean,
		data: T | null,
		error: { code: string; message: string } | null,
		meta?: Record<string, any>,
	) {
		this.success = success;
		this.data = data;
		this.error = error;
		this.meta = {
			timestamp: new Date().toISOString(),
			...meta,
		};
	}

	static success<T>(data: T, meta?: Record<string, any>): ApiResponse<T> {
		return new ApiResponse<T>(true, data, null, meta);
	}

	static error(
		code: string,
		message: string,
		meta?: Record<string, any>,
	): ApiResponse<null> {
		return new ApiResponse<null>(false, null, { code, message }, meta);
	}
}
