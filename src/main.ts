import { AppModule } from "@/app.module";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: "*",
	});

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	const config = new DocumentBuilder()
		.setTitle("NestJS CRUD Students & Pets")
		.setDescription(
			"API de un CRUD en memoria para la entidad Student y sus mascotas (Pet)",
		)
		.setVersion("1.0")
		.build();

	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup("docs", app, document);

	await app.listen(3000, "0.0.0.0");

	console.log("Application running on: http://localhost:3000");
	console.log("Documentation at: http://localhost:3000/docs");
}

bootstrap();
