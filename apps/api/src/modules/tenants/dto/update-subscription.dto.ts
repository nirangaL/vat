import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { SubscriptionPlan, SubscriptionStatus } from '@shared/core';

export class UpdateSubscriptionDto {
  @ApiPropertyOptional({ enum: SubscriptionPlan, example: SubscriptionPlan.PROFESSIONAL })
  @IsOptional()
  @IsEnum(SubscriptionPlan)
  subscription_plan?: SubscriptionPlan;

  @ApiPropertyOptional({ enum: SubscriptionStatus, example: SubscriptionStatus.ACTIVE })
  @IsOptional()
  @IsEnum(SubscriptionStatus)
  subscription_status?: SubscriptionStatus;
}
