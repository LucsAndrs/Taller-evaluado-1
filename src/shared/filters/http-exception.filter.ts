import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import { ApiResponse } from "../responses/api-response";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		const status =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR;

		const exceptionResponse =
			exception instanceof HttpException ? exception.getResponse() : null;

		let message = "Error interno del servidor";
		let code = this.getCodeFromStatus(status);

		if (typeof exceptionResponse === "string") {
			message = exceptionResponse;
		} else if (exceptionResponse && typeof exceptionResponse === "object") {
			const res = exceptionResponse as any;
			message = Array.isArray(res.message)
				? res.message.join(", ")
				: (res.message ?? message);
			code = res.error ?? code;
		}

		const body = ApiResponse.error(code, message);
		response.status(status).json(body);
	}

	private getCodeFromStatus(status: number): string {
		const map: Record<number, string> = {
			400: "BAD_REQUEST",
			401: "UNAUTHORIZED",
			403: "FORBIDDEN",
			404: "NOT_FOUND",
			422: "VALIDATION_ERROR",
			500: "INTERNAL_ERROR",
		};
		return map[status] || "UNKNOWN_ERROR";
	}
}
