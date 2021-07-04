import { createHash } from 'crypto';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @BeforeInsert()
  async hashpass() {
    // this.password = await createHash(this.password)
  }

  @PrimaryGeneratedColumn('uuid')
  id: string | undefined;

  @Column('varchar', { length: 30, nullable: true })
  name: string = '';

  @Column('varchar', { length: 20, nullable: true })
  login: string = '';

  @Column('text', { nullable: true })
  password: string | undefined;

  static toResponse(user: User) {
    const { id, name, login } = user;
    return { id, name, login };
  }
}
