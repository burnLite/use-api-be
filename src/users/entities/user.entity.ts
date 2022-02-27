import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity('user')
export class User {
  @ObjectIdColumn() id: ObjectID;

  @Column() firstName: string;

  @Column({ select: true }) lastName: string;

  @Column({ unique: true }) email: string;

  @Column() password: string;

  @Column() api_key: string;
}
