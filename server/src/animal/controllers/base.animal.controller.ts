import { type Response } from 'express';
import type { RequestWithUser } from '../../shared/interfaces/request-with-user';
import { BaseAnimalService } from '../services/base.animal.service';
import { AnimalDTO } from '../dto/animal.dto';
import type { AnimalResponse } from '../interfaces/animal.interface';
import { AnimalCacheService } from '../services/animal.cache.service';
import type { PaginationResult } from '../interfaces/pagination.result';
import { SortColumns, SortOrder } from '../../shared/dto/query.params.dto';

export abstract class BaseAnimalController<
  DTO extends AnimalDTO,
  Resp extends AnimalResponse,
> {
  constructor(
    private animalService: BaseAnimalService<any, DTO, Resp>,
    private readonly сacheService: AnimalCacheService,
  ) {}

  protected async getAnimals(
    limit: number,
    skip: number,
    sortBy?: SortColumns,
    sortOrder?: SortOrder,
  ): Promise<PaginationResult<Resp[]>> {
    return this.animalService.findAll(limit, skip, sortBy, sortOrder);
  }

  protected async getAnimalByUser(
    id: string,
    limit: number,
    skip: number,
    sortBy?: SortColumns,
    sortOrder?: SortOrder,
  ): Promise<PaginationResult<Resp[]>> {
    return this.animalService.findByUser(id, limit, skip, sortBy, sortOrder);
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
