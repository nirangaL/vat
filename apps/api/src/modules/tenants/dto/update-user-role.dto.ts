import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '@shared/core';

export class UpdateUserRoleDto {
  @ApiProperty({ enum: UserRole, example: UserRole.VAT_TEAM_LEAD })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
