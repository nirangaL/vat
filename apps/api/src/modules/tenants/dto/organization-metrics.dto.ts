import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionPlan, SubscriptionStatus } from '@shared/core';

export class OrganizationMetricsResponseDto {
  @ApiProperty({ example: 5 })
  totalUsers: number;

  @ApiProperty({ example: 42 })
  totalClients: number;

  @ApiProperty({ example: 156 })
  totalSubmissions: number;

  @ApiProperty({ example: 23 })
  activeSubmissions: number;

  @ApiProperty({ enum: SubscriptionPlan, example: SubscriptionPlan.PROFESSIONAL })
  subscriptionPlan: SubscriptionPlan;

  @ApiProperty({ enum: SubscriptionStatus, example: SubscriptionStatus.ACTIVE })
  subscriptionStatus: SubscriptionStatus;
}
