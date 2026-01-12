import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ClientStatus } from '@shared/core';

export class UpdateClientStatusDto {
  @ApiProperty({ enum: ClientStatus, example: ClientStatus.SUSPENDED })
  @IsEnum(ClientStatus)
  @IsNotEmpty()
  status: ClientStatus;
}
