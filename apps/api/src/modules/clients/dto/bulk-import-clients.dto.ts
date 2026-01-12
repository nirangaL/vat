import { ApiProperty } from '@nestjs/swagger';

export class BulkImportClientsDto {
  @ApiProperty({
    example:
      'client,tin,registration_number,taxable_period,industry,annual_turnover\nAcme Ltd,123456789V,PV12345,quarterly,Manufacturing,10M-50M',
  })
  csvData: string;
}
