import { forwardRef, Module } from "@nestjs/common";
import { StudentsService } from "@/students/students.service";
import { StudentsController } from "@/students/students.controller";
import { PetsModule } from "@/pets/pets.module";

@Module({
	imports: [forwardRef(() => PetsModule)],
	controllers: [StudentsController],
	providers: [StudentsService],
	exports: [StudentsService],
})
export class StudentsModule {}
