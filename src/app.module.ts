import { Module } from "@nestjs/common";
import { StudentsModule } from "@/students/students.module";
import { PetsModule } from "@/pets/pets.module";

@Module({
	imports: [StudentsModule, PetsModule],
})
export class AppModule {}
