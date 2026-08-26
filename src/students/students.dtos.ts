import {
	IsEmail,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
	Matches,
	Max,
	Min,
} from "class-validator";

const NO_HTML_PATTERN = /^[^<>]*$/;
const NO_HTML_MESSAGE = "No se permiten etiquetas HTML";

export class CreateStudentDto {
	@IsString({ message: "El nombre debe ser un texto" })
	@IsNotEmpty({ message: "El nombre no puede estar vacío" })
	@Length(3, 100, {
		message: "El nombre debe tener entre 3 y 100 caracteres",
	})
	@Matches(NO_HTML_PATTERN, { message: NO_HTML_MESSAGE })
	name!: string;

	@IsEmail({}, { message: "El correo electrónico no es válido" })
	@IsNotEmpty({ message: "El correo electrónico no puede estar vacío" })
	email!: string;

	@IsInt({ message: "La edad debe ser un número entero" })
	@Min(18, { message: "La edad debe ser al menos 18" })
	@Max(99, { message: "La edad debe ser como máximo 99" })
	age!: number;
}

export class UpdateStudentDto {
	@IsOptional()
	@IsString({ message: "El nombre debe ser un texto" })
	@Length(3, 100, {
		message: "El nombre debe tener entre 3 y 100 caracteres",
	})
	@Matches(NO_HTML_PATTERN, { message: NO_HTML_MESSAGE })
	name?: string;

	@IsOptional()
	@IsEmail({}, { message: "El correo electrónico no es válido" })
	email?: string;

	@IsOptional()
	@IsInt({ message: "La edad debe ser un número entero" })
	@Min(18, { message: "La edad debe ser al menos 18" })
	@Max(99, { message: "La edad debe ser como máximo 99" })
	age?: number;
}
