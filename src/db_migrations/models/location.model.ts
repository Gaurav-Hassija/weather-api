import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: `location` })
export class LocationModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column('numeric', { precision: 11, scale: 8 })
  latitude: number;

  @Column('numeric', { precision: 12, scale: 8 })
  longitude: number;

  @Column({ default: false })
  is_active: boolean;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
