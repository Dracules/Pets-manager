import { Animal } from '../../animal/interfaces/animal.interface';
import { CacheService } from '../../shared/services/cache.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AnimalCacheService extends CacheService<Animal> {}
