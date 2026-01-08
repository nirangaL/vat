# Changelog

## [Unreleased] - 2026-01-08

### Changed

#### Node.js Version Update
- **Updated Node.js requirement from v20 to v24 (LTS)**
  - Updated `package.json` engines field to require Node.js >= 24.0.0
  - Updated README.md to reflect Node.js v24 LTS requirement

#### UserRole Enum Simplification
- **Simplified UserRole enum to 4 roles**
  - `SUPER_ADMIN` - System super administrator
  - `VAT_TEAM_LEAD` - VAT team lead with elevated permissions
  - `VAT_TEAM_MEMBER` - VAT team member
  - `CLIENT` - Client user (previously COMPANY_ADMIN and COMPANY_USER)
  
- **Removed roles:**
  - `ADMIN`
  - `COMPANY_ADMIN`
  - `COMPANY_USER`
  - `ACCOUNTANT`
  - `VIEWER`

- **Files updated:**
  - `packages/shared/src/constants/enums.ts` - Updated UserRole enum
  - `apps/api/src/schemas/user.schema.ts` - Changed default role to CLIENT
  - `apps/api/src/modules/auth/dto/register.dto.ts` - Updated example to use CLIENT
  - `apps/api/src/modules/companies/companies.controller.ts` - Removed ADMIN role from @Roles decorator

#### VAT Submission Period Update
- **Changed VAT period from year/month to year/quarter**
  - `packages/shared/src/types/index.ts` - Updated IVATSubmission interface
  - Changed `vatPeriod` from `{ year: number; month: number }` to `{ year: number; quarter: number }`
  - This aligns with Sri Lankan VAT quarterly reporting requirements

#### DTO Inheritance (DRY Principle)
- **UpdateDTOs now extend CreateDTOs using NestJS PartialType**
  - Eliminates code duplication between Create and Update DTOs
  - Changes are automatically reflected in Update DTOs when Create DTOs change
  
- **Files refactored:**
  - `apps/api/src/modules/companies/dto/update-company.dto.ts`
    - Now extends `PartialType(RegisterCompanyDto)`
    - Adds only new fields: `vatRegistrationNumber`, `status`
  
  - `apps/api/src/modules/mapping/dto/update-mapping-template.dto.ts`
    - Now extends `PartialType(OmitType(CreateMappingTemplateDto, ['systemType', 'companyId']))`
    - Omits immutable fields that shouldn't be updated

### Fixed

#### TypeScript Compilation Errors
- **Fixed missing type definitions**
  - Added `@types/multer` package for file upload types
  - Added timestamps to Mongoose document types (createdAt, updatedAt)
  - Fixed Firebase Storage Bucket type import

- **Fixed email service typo**
  - Changed `nodemailer.createTransporter` to `nodemailer.createTransport`

- **Fixed authentication service**
  - Added null check for `twoFactorSecret` before TOTP verification
  - Fixed test file type annotations

- **Fixed file validation**
  - Added type assertion for file.mimetype comparison with readonly arrays

- **Updated Mongoose schemas**
  - All Document types now include timestamp fields:
    - `UserDocument`
    - `CompanyDocument`
    - `UploadDocument`
    - `MappingTemplateDocument`
    - `NotificationDocument`

### Technical Details

#### Build System
- Successfully builds with TypeScript 5.3.3
- All strict type checking enabled
- Zero TypeScript errors after fixes

#### Dependencies
- Node.js >= 24.0.0
- npm >= 10.0.0
- All packages up to date

#### Testing
- Unit test structure maintained
- Test mocks updated to match new types
- All tests pass after changes

## Summary

These changes improve the codebase by:
1. ✅ Simplifying user roles to match actual business needs
2. ✅ Aligning VAT period with Sri Lankan quarterly requirements
3. ✅ Reducing code duplication through DTO inheritance
4. ✅ Upgrading to latest Node.js LTS for better performance and security
5. ✅ Fixing all TypeScript type safety issues
