import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

export interface SingleApi {
  id: number;
  name: string;
  type: string;
  legs: number;
  img: string;
  tail: boolean;
  friends: string[];
}

@Entity('api')
export class Api {
  @ObjectIdColumn() id: ObjectID;

  @Column() userId: string;
  @Column() data: Array<SingleApi>;

  constructor(api?: Partial<Api>) {
    Object.assign(this, api);
  }
}
