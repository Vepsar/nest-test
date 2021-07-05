import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'board'})
export class Board {
    @PrimaryGeneratedColumn('uuid')
  id: string | undefined;

  @Column('varchar', { length: 30 })
  title: string = '';

  @Column('json')
  columns: string;
}
