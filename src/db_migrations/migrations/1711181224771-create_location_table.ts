import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLocationTable1711181224771 implements MigrationInterface {
  name = 'CreateLocationTable1711181224771';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "location" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "latitude" numeric(11,8) NOT NULL, "longitude" numeric(12,8) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f0336eb8ccdf8306e270d400cf0" UNIQUE ("name"), CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "location"`);
  }
}
