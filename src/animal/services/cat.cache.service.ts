import { Cat } from 'src/animal/interfaces/cat.interface';
import { CacheService } from '../../shared/services/cache.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatCacheService extends CacheService<Cat> {}
