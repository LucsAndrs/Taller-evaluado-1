import { randomUUID } from "node:crypto";
import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";

import type { Student } from "./students.entity";
import { CreateStudentDto, UpdateStudentDto } from "@/students/students.dtos";
import { InMemoryStore } from "@/shared/in-memory-store";

@Injectable()
export class StudentsService {
	private readonly store = new InMemoryStore<Student>();

	public findAll(): Student[] {
		return this.store
			.findAll()
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
	}

	public findById(id: string): Student {
		const student = this.store.get(id);

		if (!student) {
			throw new NotFoundException("Estudiante no encontrado");
		}

		return student;
	}

	public create(data: CreateStudentDto): Student {
		this.assertEmailAvailable(data.email);

		const now = new Date();
		const student: Student = {
			id: randomUUID(),
			name: data.name,
			email: data.email,
			age: data.age,
			createdAt: now,
			updatedAt: now,
		};

		this.store.set(student);
		return student;
	}

	public update(id: string, data: UpdateStudentDto): Student {
		const existing = this.findById(id);

		if (data.email && data.email !== existing.email) {
			this.assertEmailAvailable(data.email);
		}

		const updated: Student = {
			...existing,
			name: data.name ?? existing.name,
			email: data.email ?? existing.email,
			age: data.age ?? existing.age,
			updatedAt: new Date(),
		};

		this.store.set(updated);
		return updated;
	}

	public delete(id: string): Student {
		const existing = this.findById(id);
		this.store.delete(id);
		return existing;
	}

	private assertEmailAvailable(email: string) {
		const exists = this.store
			.findAll()
			.some((student) => student.email === email);

		if (exists) {
			throw new ConflictException("El correo electrónico ya está en uso");
		}
	}
}
