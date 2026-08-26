import { randomUUID } from "node:crypto";
import { Injectable, NotFoundException } from "@nestjs/common";

import type { Pet } from "./pets.entity";
import { CreatePetDto, UpdatePetDto } from "@/pets/pets.dtos";
import { InMemoryStore } from "@/shared/in-memory-store";
import { StudentsService } from "@/students/students.service";

@Injectable()
export class PetsService {
	private readonly store = new InMemoryStore<Pet>();

	constructor(private readonly studentsService: StudentsService) {}

	public findAllForStudent(studentId: string): Pet[] {
		this.assertStudentExists(studentId);
		return this.store
			.findBy((pet) => pet.studentId === studentId)
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
	}

	public create(studentId: string, data: CreatePetDto): Pet {
		this.assertStudentExists(studentId);

		const now = new Date();
		const pet: Pet = {
			id: randomUUID(),
			studentId,
			name: data.name,
			species: data.species,
			age: data.age,
			createdAt: now,
			updatedAt: now,
		};

		this.store.set(pet);
		return pet;
	}

	public update(studentId: string, petId: string, data: UpdatePetDto): Pet {
		const existing = this.findOwned(studentId, petId);

		const updated: Pet = {
			...existing,
			name: data.name ?? existing.name,
			species: data.species ?? existing.species,
			age: data.age ?? existing.age,
			updatedAt: new Date(),
		};

		this.store.set(updated);
		return updated;
	}

	public delete(studentId: string, petId: string): Pet {
		const existing = this.findOwned(studentId, petId);
		this.store.delete(petId);
		return existing;
	}

	public deleteAllForStudent(studentId: string): void {
		this.store.deleteBy((pet) => pet.studentId === studentId);
	}

	private findOwned(studentId: string, petId: string): Pet {
		this.assertStudentExists(studentId);

		const pet = this.store.get(petId);

		if (!pet || pet.studentId !== studentId) {
			throw new NotFoundException("Mascota no encontrada");
		}

		return pet;
	}

	private assertStudentExists(studentId: string) {
		this.studentsService.findById(studentId);
	}
}
