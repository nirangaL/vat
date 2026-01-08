# Quick Reference Guide

## What Changed?

### 1. Node.js Version
- **Old**: Node >= 20
- **New**: Node >= 24 (LTS)

### 2. User Roles
**Old (8 roles):**
- SUPER_ADMIN
- ADMIN ❌
- VAT_TEAM_LEAD
- VAT_TEAM_MEMBER
- COMPANY_ADMIN ❌
- COMPANY_USER ❌
- ACCOUNTANT ❌
- VIEWER ❌

**New (4 roles):**
- SUPER_ADMIN ✅
- VAT_TEAM_LEAD ✅
- VAT_TEAM_MEMBER ✅
- CLIENT ✅ (replaces COMPANY_ADMIN, COMPANY_USER)

### 3. VAT Period
**Old:**
```typescript
{ year: 2024, month: 3 }  // ❌ Month-based
```

**New:**
```typescript
{ year: 2024, quarter: 1 }  // ✅ Quarter-based (1-4)
```

### 4. DTOs
**Old:**
```typescript
// 65 lines of duplicated code
export class UpdateCompanyDto {
  // ... all fields repeated
}
```

**New:**
```typescript
// 17 lines, extends CreateDto
export class UpdateCompanyDto extends PartialType(RegisterCompanyDto) {
  // ... only additional fields
}
```

---

## Common Tasks

### Create a New Module with DTOs

```typescript
// 1. Create DTO
// create-example.dto.ts
export class CreateExampleDto {
  @IsString()
  name: string;
  
  @IsEmail()
  email: string;
}

// 2. Update DTO extends Create DTO
// update-example.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateExampleDto } from './create-example.dto';

export class UpdateExampleDto extends PartialType(CreateExampleDto) {
  // Add any update-only fields here
}

// 3. If you need to omit immutable fields:
export class UpdateExampleDto extends PartialType(
  OmitType(CreateExampleDto, ['email'] as const),  // Can't change email
) {}
```

### Create Role-Protected Endpoint

```typescript
import { Roles } from '../../common/decorators';
import { UserRole } from '@shared/constants';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  
  // Only SUPER_ADMIN can access
  @Get('dashboard')
  @Roles(UserRole.SUPER_ADMIN)
  async getDashboard() {
    // ...
  }
  
  // VAT team can access
  @Get('submissions')
  @Roles(UserRole.SUPER_ADMIN, UserRole.VAT_TEAM_LEAD, UserRole.VAT_TEAM_MEMBER)
  async getSubmissions() {
    // ...
  }
  
  // Any authenticated user (no @Roles decorator)
  @Get('profile')
  async getProfile() {
    // ...
  }
}
```

### Create Schema with Timestamps

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// ✅ Include timestamps in type
export type ExampleDocument = Example & Document & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })  // ✅ Enable timestamps
export class Example {
  @Prop({ required: true })
  name: string;
}

export const ExampleSchema = SchemaFactory.createForClass(Example);
```

### Handle VAT Quarters

```typescript
// Convert month to quarter
function getQuarter(month: number): number {
  if (month <= 3) return 1;
  if (month <= 6) return 2;
  if (month <= 9) return 3;
  return 4;
}

// Get quarter date range
function getQuarterDateRange(year: number, quarter: number) {
  const startMonth = (quarter - 1) * 3 + 1;
  const endMonth = quarter * 3;
  
  return {
    startDate: new Date(year, startMonth - 1, 1),
    endDate: new Date(year, endMonth, 0), // Last day of month
  };
}

// Usage
const submission = {
  vatPeriod: {
    year: 2024,
    quarter: 1,  // Q1: Jan-Mar
  },
};

const { startDate, endDate } = getQuarterDateRange(
  submission.vatPeriod.year,
  submission.vatPeriod.quarter,
);
```

---

## Cheat Sheet

### Available User Roles
```typescript
UserRole.SUPER_ADMIN      // System admin
UserRole.VAT_TEAM_LEAD    // Team lead
UserRole.VAT_TEAM_MEMBER  // Team member
UserRole.CLIENT           // Client user (default)
```

### VAT Quarters
```
Q1: January - March    (quarter: 1)
Q2: April - June       (quarter: 2)
Q3: July - September   (quarter: 3)
Q4: October - December (quarter: 4)
```

### Common DTO Patterns
```typescript
// Simple update (all fields optional)
PartialType(CreateDto)

// Update with omissions
PartialType(OmitType(CreateDto, ['field1', 'field2']))

// Update with picks
PartialType(PickType(CreateDto, ['field1', 'field2']))

// Intersection
IntersectionType(Dto1, Dto2)
```

### Quick Commands
```bash
# Build everything
npm run build

# Type check
npm run type-check

# Format code
npm run format

# Lint
npm run lint

# Run tests
npm run test

# Dev mode
npm run dev
```

---

## Migration Checklist

When deploying these changes:

- [ ] Ensure Node.js v24 is installed on server
- [ ] Update environment variables if needed
- [ ] Run database migration for user roles
- [ ] Run database migration for VAT periods
- [ ] Update frontend to use new role names
- [ ] Update frontend to use quarter-based periods
- [ ] Test authentication flows
- [ ] Test role-based access control
- [ ] Test VAT submission creation
- [ ] Verify all API endpoints work

---

## Troubleshooting

### "Module not found: @shared/core"
```bash
cd packages/shared
npm run build
```

### "Property 'createdAt' does not exist"
Add timestamps to Document type:
```typescript
export type MyDocument = MyModel & Document & {
  createdAt: Date;
  updatedAt: Date;
};
```

### "Cannot find module '@types/multer'"
```bash
npm install --legacy-peer-deps
```

### Build fails
```bash
# Clean and rebuild
npm run clean
npm install --legacy-peer-deps
npm run build
```

---

## Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js v24 Release Notes](https://nodejs.org/en/blog/release/)
