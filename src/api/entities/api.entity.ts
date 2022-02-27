import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity('api')
export class Api {
  @ObjectIdColumn() id: ObjectID;

  @Column() name: string;
  @Column() type: string;
  @Column() legs: number;
  @Column() img: string;
  @Column() tail: boolean;
  @Column() friends: string[];

  constructor(api?: Partial<Api>) {
    Object.assign(this, api);
  }
}
