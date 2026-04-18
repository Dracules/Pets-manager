import { type Response } from 'express';
import type { RequestWithUser } from '../../shared/interfaces/request-with-user';
import { BaseAnimalService } from '../services/base.animal.service';
import { AnimalDTO } from '../dto/animal.dto';
import { AnimalResponse } from '../interfaces/animal.interface';
import { AnimalCacheService } from '../services/animal.cache.service';

export abstract class BaseAnimalController<
  DTO extends AnimalDTO,
  Resp extends AnimalResponse,
> {
  constructor(
    private animalService: BaseAnimalService<any, DTO, Resp>,
    private readonly сacheService: AnimalCacheService,
  ) {}

  protected async getAnimals(): Promise<Resp[]> {
    return this.animalService.findAll();
  }

  protected async getAnimalByUser(request: RequestWithUser): Promise<Resp[]> {
    const userId = request.user.sub;
    return this.animalService.findByUser(userId);
  }

  protected async getAnimalById(id: string): Promise<Resp> {
    return this.animalService.findById(id);
  }

  protected async createAnimal(
    animalDTO: DTO,
    response: Response,
    request: RequestWithUser,
  ): Promise<void> {
    const userId = request.user.sub;
    const animal = await this.animalService.create(animalDTO, userId);
    response.json(animal);
  }

  protected async updateAnimal(
    id: string,
    animalDTO: Partial<DTO>,
    response: Response,
    request: RequestWithUser,
    updateProps?: unknown,
  ): Promise<void> {
    const userId = request.user.sub;
    const animal = await this.animalService.updateById(
      userId,
      id,
      animalDTO,
      updateProps,
    );
    this.сacheService.saveToCache(request.url, animal);
    response.json(animal);
  }

  protected async deleteAnimal(
    id: string,
    response: Response,
    request: RequestWithUser,
  ): Promise<void> {
    const userId = request.user.sub;
    const message = await this.animalService.delete(userId, id);
    response.json(message);
  }
}
