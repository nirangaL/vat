# Product Requirements Document (PRD)

## VAT Management and IRD Submission System for Sri Lankan Companies

**Version:** 1.0  
**Date:** January 7, 2026  
**Product Owner:**
**Classification:** Internal Use

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Scope](#2-product-scope)
3. [User Personas](#3-user-personas)
4. [Latest Sri Lankan VAT Regulations (2025)](#4-latest-sri-lankan-vat-regulations-2025)
5. [VAT Schedules - Complete Specifications](#5-vat-schedules-complete-specifications)
6. [Functional Requirements](#6-functional-requirements)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [Technical Architecture](#8-technical-architecture)
9. [User Interface Design](#9-user-interface-design)
10. [Data Model & Migration](#10-data-model-migration)
11. [Integration Specifications](#11-integration-specifications)
12. [Security & Compliance](#12-security-compliance)
13. [Testing Strategy](#13-testing-strategy)
14. [Deployment & Operations](#14-deployment-operations)
15. [Project Timeline & Milestones](#15-project-timeline-milestones)
16. [Resource Requirements](#16-resource-requirements)
17. [Risks & Mitigation](#17-risks-mitigation)
18. [Success Metrics](#18-success-metrics)
19. [Glossary](#19-glossary)
20. [Appendices](#20-appendices)

---

## 1. Executive Summary

### 1.1 Product Vision

The VAT Management and IRD Submission System is a comprehensive SaaS platform designed to revolutionize how Sri Lankan companies handle their Value Added Tax compliance. By automating complex calculations, managing all IRD schedules and documents, and streamlining the submission process, this system eliminates the pain points that plague businesses today—from navigating the confusing IRD online system to avoiding costly errors and missed deadlines.

The system consists of two integrated components: a Client Portal where companies manage their VAT operations, and a CRM system that enables simplebooks internal VAT team to efficiently manage multiple clients. This dual-platform approach creates value for both end-users struggling with VAT compliance and professional service providers who can scale their operations without proportionally increasing their workforce.

### 1.2 Problem Statement

Sri Lankan businesses face significant challenges with VAT compliance:

- **Complex IRD System:** The IRD's online submission system is notoriously difficult to navigate, with multiple schedules, forms, and document requirements that are poorly explained
- **Knowledge Gap:** Most employees lack proper training in VAT calculations and compliance requirements, leading to errors and uncertainty
- **Manual Processes:** Companies rely on manual data entry across multiple spreadsheets and systems, creating opportunities for errors and inconsistencies
- **Documentation Chaos:** Maintaining proper documentation for audits is challenging, with supporting documents scattered across email, folders, and physical files
- **Regulatory Complexity:** Recent 2025 amendments (abolition of SVAT scheme, new digital services VAT, mandatory electronic filing) add layers of complexity
- **Deadline Pressure:** Missing submission deadlines results in penalties and interest charges
- **Resource Intensive:** Small companies cannot afford dedicated tax professionals, while larger companies struggle with coordination across departments

### 1.3 Solution Overview

Our platform provides:

**For Companies (Client Portal):**

- Bulk upload via CSV/Excel with intelligent validation and error handling
- Automated generation of all 14 IRD schedules (7 main + 7 amendments) in the exact format required by IRD
- Complete VAT return preparation with supporting documents packaged for submission
- Document repository with 7-year retention for audit compliance
- Real-time compliance dashboard with deadline reminders and status tracking
- Export and refund management workflow
- Comprehensive reporting and analytics

**For Simplebooks internal VAT Team (CRM System):**

- Multi-client management dashboard with real-time overview of all submissions
- 8-stage submission workflow tracking (Data Collection → Document Preparation → Review → IRD Submission → Payment → Acknowledgment → Filing → Closed)
- Task assignment and team collaboration tools
- Client communication logging and email template management
- System audit trail

### 1.4 Key Success Metrics

- **Adoption:** 50 companies in months 6, 200 by Year 2
- **Accuracy:** 99%+ VAT calculation accuracy
- **Efficiency:** 75% reduction in time spent on VAT compliance per company
- **Revenue:** $100K+ ARR by Year 2
- **Satisfaction:** Net Promoter Score (NPS) above 50
- **Compliance:** Zero penalties for clients due to system errors

### 1.5 Target Market

- **Primary:** SMEs (Small and Medium Enterprises) in Sri Lanka with 10-500 employees
- **Secondary:** Large enterprises with complex VAT needs
- **Geographic Focus:** Initially Colombo and Western Province, expanding nationwide

---

## 2. Product Scope

### 2.1 In-Scope Features (MVP - Phase 1)

**Client Portal Core Features:**

1. User authentication and company profile management
2. Automate VAT registration process for companies
3. Bulk data upload (CSV/Excel)
4. Automated generation of VAT Schedules 01-07
5. Amendment schedule generation (Schedules 01A-07A)
6. VAT return form generation
7. Submission and supporting documents repository (supports opaque ZIPs for audit evidence)
8. Email notifications for deadlines

**CRM Core Features:**

1. Client management dashboard
2. Basic submission workflow tracking
3. Payment gateway integration for charge from companies for given service
4. User and role management
5. Client communication logging/Email
6. System audit trail

**Technical Foundation:**

1. Secure authentication and authorization
2. Database design and implementation
3. RESTful API
4. Automated IRD submission (scraper) and API integration when available
5. Responsive web interface
6. Automated backup system

### 2.2 Out-of-Scope (Future Phases)

**Scope Exclusions (MVP):**

- Full accounting suite features (invoice management, bookkeeping, bank feeds, general ledger)

**Phase 2 Enhancements (Months 4-9):**

- Accounting software integration
- Sinhala/Tamil language support
- Advanced reporting and analytics

**Phase 3 Advanced Features (Months 10-18):**

- Predictive analytics for cash flow planning
- Integration with IRD e-services (if API becomes available)
- Multi-entity consolidation
- Advanced export/refund management

### Competitive Positioning (ClearTax & Zoho)

**Overview:**

Simplebooks aims to deliver a Sri Lanka-focused VAT compliance SaaS that combines the strengths of platforms like ClearTax and Zoho (automation, bulk-import capabilities, and finance workflows) with a service-oriented review workflow and IRD-specific automation (scraper + API integration when available). Our differentiators will be: local regulatory completeness (Sri Lanka 2025/2026 rules), a Simplebooks-managed review & submission service, and optimised templates/mappings for common accounting exports used in Sri Lanka. Important: Simplebooks is a VAT-first platform — we do **not** provide invoice creation/management, bookkeeping, bank feeds, or general ledger functionality; clients are expected to export transaction data from their accounting/ERP systems and upload CSV/XLSX files for import and validation.

**Quick comparison (high-level):**

| Feature / Capability        | ClearTax (example)                   | Zoho Books                     | Simplebooks (this product)                                                           |
| --------------------------- | ------------------------------------ | ------------------------------ | ------------------------------------------------------------------------------------ |
| Target market               | India / broader                      | SMB accounting suite           | Sri Lanka SMBs & service providers                                                   |
| Primary model               | Self-service + CA partners           | Self-service accounting + apps | Self-service upload + Simplebooks review & submission                                |
| Bulk import & mapping       | Yes (tax-focused tools)              | Yes (import, templates)        | Yes (Mapping Wizard + saved templates for local systems incl. ClearTax/Zoho exports) |
| IRD e-Services automation   | Partial (country-specific)           | No (general accounting)        | Yes (scraper + API-ready)                                                            |
| Local VAT rules & schedules | Limited outside core market          | Generic accounting tax models  | Full Sri Lankan IRD schedules, amendments & export/refund rules (2025/2026)          |
| Reviewer service            | Varies                               | No                             | Dedicated Simplebooks review queue and CRM workflow                                  |
| Document handling           | Document management                  | Document attachments           | Opaque supporting ZIPs + CRM requests (no per-invoice indexing by default)           |
| Pricing model               | Subscription + professional services | Subscription                   | Subscription + pay-per-submission / managed review                                   |

**Feature mapping & product implications:**

- Mapping Wizard and saved templates: match ClearTax/Zoho import convenience, plus presets for local accounting exports.
- Automated IRD submission: implement robust scraper and keep API hooks ready to integrate when IRD provides access.
- Managed review workflow: provide CRM-first features (task queues, document requests, audit trail) to emulate professional service operations.
- Local compliance: include all Schedule formats, export payment tracking, and RBRS/refund workflows specific to Sri Lanka.

### 2.3 Technology Constraints

- Must support latest versions of Chrome, Firefox, Safari, Edge
- Mobile-responsive design (no native apps in MVP)
- Sri Lankan Rupees (LKR) only in MVP
- English language only in MVP
- Cloud-based deployment (AWS/GCP)
- 99.5% uptime SLA

### 2.4 Regulatory Requirements

- Compliance with VAT Act No. 14 of 2002 (as amended by Act No. 4 of 2025)
- Support for all IRD schedule formats effective January 2026
- 7-year document retention per IRD regulations
- Electronic submission mandate (effective July 1, 2025)
- Data privacy compliance (GDPR-inspired practices)
- Secure handling of sensitive financial data

---

## 3. User Personas

### 3.1 Persona 1: Company Accountant - Priya Fernando

**Demographics:**

- Age: 32
- Location: Colombo
- Education: Bachelor's in Accounting, CIMA Part-Qualified
- Role: Senior Accountant at medium-sized manufacturing company
- Experience: 8 years in accounting
- Tech-Savviness: Moderate (comfortable with Excel, basic accounting software)

**Responsibilities:**

- Manage all tax compliance for the company
- Process 200-300 invoices monthly
- Prepare and submit VAT returns
- Coordinate with external auditors
- Handle IRD queries and audits
- Generate financial reports for management

**Pain Points:**

- Spends 3-4 days each month manually preparing VAT schedules in Excel
- Struggles to understand IRD's confusing form requirements
- Fears making mistakes that could result in penalties
- Difficult to track down supporting documents from various departments
- IRD online system frequently has errors and unclear instructions
- Manual calculations are tedious and error-prone
- Has to work late nights before submission deadlines

**Goals:**

- Reduce time spent on VAT compliance by at least 50%
- Ensure 100% accuracy in VAT calculations and submissions
- Maintain organized records for easy audit retrieval
- Receive timely alerts before deadlines
- Generate reports that help management understand tax obligations
- Gain confidence that submissions are correct and compliant

**User Journey:**

1. Exports sales and purchase transaction data from their accounting/ERP system to CSV/XLSX or downloads Simplebooks templates
2. Uploads CSV/XLSX files to the Client Portal
3. Uses the Mapping Wizard (or selects a saved mapping template) to align columns to IRD fields
4. Reviews validation results and fixes data in source or via guided fixes
5. Submits data to Simplebooks for review
6. Receives feedback or requests for supporting documents (if required)
7. After Simplebooks approval, submission to IRD is automated by Simplebooks
8. Receives IRD acknowledgment and status updates via the portal
9. Reconciles payment in their accounting system
10. Retains audit copies locally per company policy

**Quote:** _"I spend more time fighting with the IRD website and worrying if I made mistakes than actually doing productive accounting work. I need a system that just works and gives me confidence."_

### 3.2 Persona 2: Small Business Owner - Ranil Silva

**Demographics:**

- Age: 45
- Location: Gampaha
- Education: Bachelor's in Business Management
- Role: Owner of import/export trading company
- Experience: 15 years in business
- Tech-Savviness: Low to Moderate (uses email, basic software)

**Responsibilities:**

- Overall business management
- Handles finances personally (no dedicated accountant)
- VAT registration and compliance
- Supplier and customer management
- Banking and payments
- Business development

**Pain Points:**

- No dedicated accounting staff—has to do VAT himself
- Doesn't fully understand VAT rules and regulations
- Worried about making mistakes and receiving penalties
- Lacks time to learn the IRD system properly
- Finds the whole process overwhelming and stressful
- Previous accountant charged too much for simple VAT filing
- Invoices from suppliers sometimes missing required information

**Goals:**

- Simplified system that requires minimal accounting knowledge
- Affordable solution (tight budget)
- Confidence that VAT is done correctly
- Quick process—doesn't want to spend days on tax work
- Peace of mind for audits and IRD inspections
- Clear guidance on what documents are needed

**User Journey:**

1. Exports a minimal transaction summary from accounting package or downloads a Simplebooks template
2. Uploads CSV/XLSX to the Client Portal or requests Simplebooks to handle upload
3. Uses guided mapping or chooses a Simplebooks template for common packages
4. Receives validation summary and requests for missing critical fields
5. Opts for Simplebooks review service if unsure
6. After review and submission, receives confirmation and proof of filing
7. Keeps local copies and receipts for audit

**Quote:** _"I'm good at business, not accounting. I just need something simple that tells me exactly what to do and does the calculations for me."_

### 3.3 Persona 3: Simplebooks internal VAT Admin - Sanduni Perera

**Demographics:**

- Age: 28
- Location: Colombo
- Education: Bachelor's in Business Administration
- Role: Operations Manager at tax consulting in Simplebooks
- Experience: 5 years in tax services
- Tech-Savviness: High (proficient in multiple software platforms)

**Responsibilities:**

- Manage VAT compliance for 50+ client companies
- Coordinate team of 5 submission specialists
- Monitor all submission deadlines
- Ensure quality control and accuracy
- Handle client communications
- Track billing and payments
- Generate performance reports for management

**Pain Points:**

- Managing 50+ clients with different deadlines is chaotic
- Team uses multiple Excel sheets causing version control issues
- Difficult to track which stage each submission is at
- Client communication history scattered across email
- No centralized system to assign tasks and track progress
- Revenue tracking is manual and time-consuming
- Cannot easily see team workload distribution
- Scaling the business requires hiring more people

**Goals:**

- Centralized dashboard showing all client statuses at a glance
- Automated workflow tracking and task assignment
- Improved team collaboration and communication
- Faster turnaround time per client
- Ability to scale without proportionally increasing staff
- Data-driven insights into business performance
- Automated billing and payment tracking
- Professional client reports

**User Journey:**

1. Receives CSV/XLSX uploads from clients in the portal
2. Automated pre-validation flags issues and creates review tasks
3. Assigns review tasks to submission specialists via the CRM
4. Reviews and approves mapped data or requests supporting evidence
5. Submits approved schedules to IRD using automated submission (scraper) or IRD API when available
6. Tracks submission acknowledgments and communicates status to clients via portal and email
7. Records billing for review/submission services and follows up on payments
8. Maintains audit trail and document request history in the CRM

**Quote:** _"We're drowning in spreadsheets and emails. We need a proper system that helps us manage all our clients efficiently and grow our business without chaos."_

---

## 4. Latest Sri Lankan VAT Regulations (2025)

### 4.1 Current VAT Rates (Effective January 2024)

| Category          | Rate | Description                                                                                |
| ----------------- | ---- | ------------------------------------------------------------------------------------------ |
| **Standard Rate** | 18%  | Applies to all taxable goods and services (increased from 15% in January 2024)             |
| **Zero-Rated**    | 0%   | Exports, specified supplies (payment must be received in foreign currency within 6 months) |
| **Exempt**        | N/A  | Specified goods and services per First Schedule of VAT Act                                 |

**Special Cases:**

- Financial Services: Subject to specific VAT on Financial Services (VATFS) rules
- Digital Services by Non-Residents: 18% (effective October 1, 2025)
- Employer-provided meals and transport: Treated as zero-value supplies (effective January 1, 2024)

### 4.2 Major 2025 Amendments (Act No. 4 of 2025)

**1. Digital Services Taxation (Effective October 1, 2025)**

- VAT now applies to services supplied by non-resident persons through electronic platforms to persons in Sri Lanka
- Non-resident suppliers must register and charge 18% VAT
- Covers streaming services, cloud services, online advertising, software subscriptions, etc.

**2. Abolition of Simplified VAT (SVAT) Scheme (Effective October 1, 2025)**

- SVAT scheme completely abolished
- Replaced with Risk-Based Refund Scheme (RBRS)
- Registered Identified Purchaser (RIP) and Registered Identified Supplier (RIS) statuses terminated
- SVAT credit vouchers and suspended tax invoices no longer used
- Final SVAT schedules due October 31, 2025

**3. Mandatory Electronic Filing (Effective July 1, 2025)**

- All VAT returns and schedules must be submitted electronically through IRD e-Services
- Manual submission requires prior IRD approval
- Schedule records can be captured directly in e-Services or uploaded via CSV/Excel
- Processing time approximately 3-4 hours after upload

**4. Mandatory VAT Registration for Importers/Exporters**

- All persons importing or exporting goods for commercial purposes must register for VAT
- No turnover threshold exemption for commercial importers/exporters

**5. Zero-Rated Supply Conditions**

- Payment must be received in foreign currency through licensed bank in Sri Lanka
- 6-month deadline from end of taxable period
- Input tax disallowance provision (if payment not received) applicable only until April 10, 2025

**6. New Tax Invoice Format (Effective April 1, 2026)**

- Standardized invoice format mandated (originally January 1, 2026, postponed to April 1, 2026)
- Must prominently display "Tax Invoice" in bold
- Specific layout requirements for supplier/purchaser details
- Unique invoice numbering format: YYMMMM_BRXX_N (e.g., 25OCT_BR03_1)
- Date format: MM/DD/YYYY
- Must state payment method explicitly
- Maximum 40 characters for invoice number, no spaces

**7. New Exempt Items (Effective April 11, 2025)**

- Locally-produced liquid milk and yoghurt
- Chemical naptha supplied by CPC to CEB for power generation

**8. Risk-Based Refund Scheme**

- Eligible exporters: Zero-rated supplies > 50% of total supplies in preceding year
- Refunds issued within 45 days based on risk categorization
- Refund requests integrated into VAT return submission

### 4.3 Taxable Periods and Deadlines

| Registration Category | Taxable Period | Return Due Date         |
| --------------------- | -------------- | ----------------------- |
| Quarterly             | 3 months       | 20th of following month |
| Monthly               | 1 month        | 20th of following month |

**Example:** For taxable period July 1 - July 31, 2025, return due by August 20, 2025

**Payment:** VAT payable must be paid by the 20th of the following month

### 4.4 Registration Thresholds

- Standard Threshold: LKR 15,000,000 (LKR 15 million per quarter) or LRK 60,000,000 (KRR 60 million per year)
- Commercial Importers/Exporters: Must register regardless of turnover
- Voluntary registration available for businesses below threshold

### 4.5 Penalties and Interest

| Violation           | Penalty                                                         |
| ------------------- | --------------------------------------------------------------- |
| Late Return         | LKR 50,000 + LKR 10,000 per month/part month                    |
| Late Payment        | Interest at prescribed rate on outstanding amount               |
| Incorrect Return    | Penalty up to 200% of tax short-paid (depends on circumstances) |
| Failure to Register | Penalties as prescribed by CGIR                                 |

### 4.6 IRD Schedules Required (Current as of 2026)

**Main Schedules:**

1. Schedule 01 - Output Tax Schedule (Sales Invoices)
2. Schedule 02 - Input Tax Schedule for Local Purchases
3. Schedule 03 - Input Tax Schedule for Imports
4. Schedule 04 - Credit and Debit Notes Schedule
5. Schedule 05 - Deemed Input Schedule for Wholesale and Retail Trade
6. Schedule 06 - Goods Export Schedule
7. Schedule 07 - Service Export Schedule

**Amendment Schedules (for corrections):**

- Schedule 01 Amendment - Output Schedule (Amendment)
- Schedule 02 Amendment - Input Schedule for Local Purchases (Amendment)
- Schedule 03 Amendment - Input Schedule for Imports (Amendment)
- Schedule 04 Amendment - Credit and Debit Notes Schedule (Amendment)
- Schedule 05 Amendment - Deemed Input Schedule for Wholesale and Retail Trade (Amendment)
- Schedule 06 Amendment - Goods Export Schedule (Amendment)
- Schedule 07 Amendment - Service Export Schedule (Amendment)

**Note:** Amendment schedules are used to correct errors in previously submitted schedules within 6 months of original invoice date.

---

## 5. VAT Schedules - Complete Specifications

### 5.1 Schedule 01 - Output Tax Schedule (Sales Invoices)

**Purpose:** Records all sales invoices where the company has charged VAT to customers (Output Tax)

**When Required:** Mandatory for all VAT-registered persons with taxable sales

**CSV/Excel File Structure:**

| Field No. | Field Name       | Data Type    | Length | Required | Format/Validation | Description                              |
| --------- | ---------------- | ------------ | ------ | -------- | ----------------- | ---------------------------------------- |
| 1         | Invoice No       | Alphanumeric | 40     | Yes      | No spaces         | Unique invoice number                    |
| 2         | Invoice Date     | Date         | 10     | Yes      | MM/DD/YYYY        | Date of invoice issuance                 |
| 3         | Delivery Date    | Date         | 10     | No       | MM/DD/YYYY        | Date goods/services delivered            |
| 4         | Customer TIN     | Numeric      | 10     | Yes      | 10 digits         | Customer's Tax Identification Number     |
| 5         | Customer Name    | Text         | 200    | Yes      | -                 | Registered name of customer              |
| 6         | Customer Address | Text         | 300    | Yes      | -                 | Complete address                         |
| 7         | Description      | Text         | 500    | Yes      | -                 | Nature of goods/services supplied        |
| 8         | Value (Excl VAT) | Decimal      | 15,2   | Yes      | >= 0              | Net value excluding VAT (LKR)            |
| 9         | VAT Rate         | Decimal      | 5,2    | Yes      | 0, 18             | VAT rate percentage                      |
| 10        | VAT Amount       | Decimal      | 15,2   | Yes      | >= 0              | VAT charged (LKR)                        |
| 11        | Total Value      | Decimal      | 15,2   | Yes      | >= 0              | Gross value including VAT (LKR)          |
| 12        | Payment Method   | Text         | 50     | Yes      | Dropdown          | Cash/Cheque/Bank Transfer/Online Payment |

**Calculation Rules:**

- VAT Amount = Value (Excl VAT) × VAT Rate / 100
- Total Value = Value (Excl VAT) + VAT Amount
- All amounts rounded to 2 decimal places
- Sum of all VAT Amounts = Total Output Tax for the period

**File Naming Convention:**
`TIN_Schedule01_YYYYMM_v1.csv`  
Example: `1234567890_Schedule01_202507_v1.csv`

**Sample Data:**

```csv
Invoice No,Invoice Date,Delivery Date,Customer TIN,Customer Name,Customer Address,Description,Value (Excl VAT),VAT Rate,VAT Amount,Total Value,Payment Method
INV-2025-001,07/05/2025,07/05/2025,9876543210,ABC Traders Ltd,123 Main St Colombo 03,Consulting Services,100000.00,18,18000.00,118000.00,Bank Transfer
INV-2025-002,07/10/2025,07/12/2025,5555555555,XYZ Corporation,45 Galle Rd Colombo 04,Software License,500000.00,18,90000.00,590000.00,Online Payment
```

### 5.2 Schedule 02 - Input Tax Schedule for Local Purchases

**Purpose:** Records all purchase invoices from local suppliers where the company has been charged VAT (Input Tax for credit claims)

**When Required:** Mandatory for all VAT-registered persons claiming input tax on local purchases

**CSV/Excel File Structure:**

| Field No. | Field Name          | Data Type    | Length | Required | Format/Validation | Description                                      |
| --------- | ------------------- | ------------ | ------ | -------- | ----------------- | ------------------------------------------------ |
| 1         | Supplier TIN        | Numeric      | 10     | Yes      | 10 digits         | Supplier's Tax Identification Number             |
| 2         | Supplier Name       | Text         | 200    | Yes      | -                 | Registered name of supplier                      |
| 3         | Supplier Invoice No | Alphanumeric | 40     | Yes      | No spaces         | Supplier's invoice number                        |
| 4         | Invoice Date        | Date         | 10     | Yes      | MM/DD/YYYY        | Date of supplier invoice                         |
| 5         | Description         | Text         | 500    | Yes      | -                 | Nature of goods/services purchased               |
| 6         | Value (Excl VAT)    | Decimal      | 15,2   | Yes      | >= 0              | Net value excluding VAT (LKR)                    |
| 7         | VAT Rate            | Decimal      | 5,2    | Yes      | 0, 18             | VAT rate percentage                              |
| 8         | VAT Amount          | Decimal      | 15,2   | Yes      | >= 0              | VAT paid (LKR)                                   |
| 9         | Total Value         | Decimal      | 15,2   | Yes      | >= 0              | Gross value including VAT (LKR)                  |
| 10        | Expense Category    | Text         | 100    | Yes      | Predefined list   | Operating Expenses/Raw Materials/Assets/Services |
| 11        | Payment Date        | Date         | 10     | No       | MM/DD/YYYY        | Date payment made                                |
| 12        | Payment Method      | Text         | 50     | Yes      | Dropdown          | Cash/Cheque/Bank Transfer/Online Payment         |

**Validation Rules:**

- Supplier must be VAT-registered (TIN must be valid)
- Invoice date must be within current or prior taxable period
- Cannot claim input tax if invoice > 3 months old without justification
- VAT Amount = Value (Excl VAT) × VAT Rate / 100
- Total Value = Value (Excl VAT) + VAT Amount

**File Naming Convention:**
`TIN_Schedule02_YYYYMM.csv`

**Sample Data:**

```csv
Supplier TIN,Supplier Name,Supplier Invoice No,Invoice Date,Description,Value (Excl VAT),VAT Rate,VAT Amount,Total Value,Expense Category,Payment Date,Payment Method
3333333333,Office Supplies Ltd,OS-5678,07/03/2025,Stationery & Office Items,25000.00,18,4500.00,29500.00,Operating Expenses,07/15/2025,Bank Transfer
4444444444,Tech Solutions Pvt Ltd,TECH-9999,07/07/2025,Computer Hardware,350000.00,18,63000.00,413000.00,Assets,07/20/2025,Cheque
```

### 5.3 Schedule 03 - Input Tax Schedule for Imports

**Purpose:** Records VAT paid on imported goods at the point of importation (claimed as input tax)

**When Required:** For VAT-registered persons who import goods and have paid VAT at customs

**CSV/Excel File Structure:**

| Field No. | Field Name         | Data Type    | Length | Required | Format/Validation | Description                      |
| --------- | ------------------ | ------------ | ------ | -------- | ----------------- | -------------------------------- |
| 1         | Customs Entry No   | Alphanumeric | 50     | Yes      | -                 | CUSDEC number                    |
| 2         | Import Date        | Date         | 10     | Yes      | MM/DD/YYYY        | Date of customs clearance        |
| 3         | Supplier Name      | Text         | 200    | Yes      | -                 | Foreign supplier name            |
| 4         | Supplier Country   | Text         | 100    | Yes      | -                 | Country of origin                |
| 5         | Description        | Text         | 500    | Yes      | -                 | Description of imported goods    |
| 6         | HS Code            | Alphanumeric | 10     | No       | -                 | Harmonized System Code           |
| 7         | CIF Value          | Decimal      | 15,2   | Yes      | >= 0              | Cost + Insurance + Freight (LKR) |
| 8         | Customs Duty       | Decimal      | 15,2   | No       | >= 0              | Customs duty paid (LKR)          |
| 9         | Other Levies       | Decimal      | 15,2   | No       | >= 0              | Other import levies (LKR)        |
| 10        | Assessable Value   | Decimal      | 15,2   | Yes      | >= 0              | Total value for VAT calculation  |
| 11        | VAT Rate           | Decimal      | 5,2    | Yes      | 0, 18             | VAT rate percentage              |
| 12        | VAT Amount         | Decimal      | 15,2   | Yes      | >= 0              | VAT paid at customs (LKR)        |
| 13        | Payment Receipt No | Alphanumeric | 50     | Yes      | -                 | Customs payment receipt          |

**Calculation Rules:**

- Assessable Value = CIF Value + Customs Duty + Other Levies
- VAT Amount = Assessable Value × VAT Rate / 100
- Must attach copy of customs declaration (CUSDEC)
- Must attach proof of VAT payment to customs

**File Naming Convention:**
`TIN_Schedule03_YYYYMM.csv`

**Sample Data:**

```csv
Customs Entry No,Import Date,Supplier Name,Supplier Country,Description,HS Code,CIF Value,Customs Duty,Other Levies,Assessable Value,VAT Rate,VAT Amount,Payment Receipt No
CUSDEC-2025-12345,07/08/2025,Shanghai Electronics,China,LED Display Panels,8528.72,800000.00,120000.00,50000.00,970000.00,18,174600.00,REC-789456
CUSDEC-2025-12346,07/15/2025,Tokyo Machinery,Japan,Industrial Equipment,8479.89,1500000.00,225000.00,100000.00,1825000.00,18,328500.00,REC-789457
```

### 5.4 Schedule 04 - Credit and Debit Notes Schedule

**Purpose:** Records adjustments to previously issued invoices (both sales and purchases)

**When Required:** When issuing or receiving credit/debit notes for price adjustments, returns, discounts

**CSV/Excel File Structure:**

| Field No. | Field Name                  | Data Type    | Length | Required | Format/Validation | Description                          |
| --------- | --------------------------- | ------------ | ------ | -------- | ----------------- | ------------------------------------ |
| 1         | Note Type                   | Text         | 10     | Yes      | CREDIT/DEBIT      | Type of adjustment note              |
| 2         | Note Direction              | Text         | 10     | Yes      | OUTPUT/INPUT      | Issued (OUTPUT) or Received (INPUT)  |
| 3         | Note No                     | Alphanumeric | 40     | Yes      | No spaces         | Unique note number                   |
| 4         | Note Date                   | Date         | 10     | Yes      | MM/DD/YYYY        | Date of note issuance                |
| 5         | Original Invoice No         | Alphanumeric | 40     | Yes      | -                 | Reference to original invoice        |
| 6         | Original Invoice Date       | Date         | 10     | Yes      | MM/DD/YYYY        | Date of original invoice             |
| 7         | Party TIN                   | Numeric      | 10     | Yes      | 10 digits         | TIN of customer/supplier             |
| 8         | Party Name                  | Text         | 200    | Yes      | -                 | Name of customer/supplier            |
| 9         | Reason                      | Text         | 500    | Yes      | -                 | Reason for adjustment                |
| 10        | Adjustment Value (Excl VAT) | Decimal      | 15,2   | Yes      | Can be negative   | Net value of adjustment (LKR)        |
| 11        | VAT Rate                    | Decimal      | 5,2    | Yes      | 0, 18             | VAT rate percentage                  |
| 12        | VAT Adjustment              | Decimal      | 15,2   | Yes      | Can be negative   | VAT adjustment amount (LKR)          |
| 13        | Total Adjustment            | Decimal      | 15,2   | Yes      | Can be negative   | Total adjustment including VAT (LKR) |

**Business Rules:**

- Credit Note reduces original invoice amount (negative adjustment)
- Debit Note increases original invoice amount (positive adjustment)
- Must be issued within 6 months of original invoice date
- OUTPUT notes affect Output Tax (sales adjustments)
- INPUT notes affect Input Tax (purchase adjustments)

**File Naming Convention:**
`TIN_Schedule04_YYYYMM.csv`

**Sample Data:**

```csv
Note Type,Note Direction,Note No,Note Date,Original Invoice No,Original Invoice Date,Party TIN,Party Name,Reason,Adjustment Value (Excl VAT),VAT Rate,VAT Adjustment,Total Adjustment
CREDIT,OUTPUT,CN-2025-001,07/12/2025,INV-2025-001,07/05/2025,9876543210,ABC Traders Ltd,Discount given,-10000.00,18,-1800.00,-11800.00
DEBIT,OUTPUT,DN-2025-001,07/18/2025,INV-2025-002,07/10/2025,5555555555,XYZ Corporation,Additional charges,5000.00,18,900.00,5900.00
```

### 5.5 Schedule 05 - Deemed Input Schedule for Wholesale and Retail Trade

**Purpose:** Allows wholesalers and retailers to claim deemed input tax instead of actual input tax

**When Required:** Optional for wholesalers/retailers who elect to use deemed input method

**Note:** This schedule is less commonly used as most businesses prefer actual input tax claims. System should support it but may deprioritize in MVP.

**CSV/Excel File Structure:**

| Field No. | Field Name             | Data Type | Length | Required | Format/Validation | Description                    |
| --------- | ---------------------- | --------- | ------ | -------- | ----------------- | ------------------------------ |
| 1         | Product Category       | Text      | 200    | Yes      | -                 | Category of goods sold         |
| 2         | Total Sales (Excl VAT) | Decimal   | 15,2   | Yes      | >= 0              | Total sales for category (LKR) |
| 3         | Output VAT             | Decimal   | 15,2   | Yes      | >= 0              | VAT charged on sales (LKR)     |
| 4         | Deemed Input Rate      | Decimal   | 5,2    | Yes      | Per IRD rates     | Applicable deemed rate (%)     |
| 5         | Deemed Input Tax       | Decimal   | 15,2   | Yes      | >= 0              | Calculated deemed input (LKR)  |

**Calculation Rules:**

- Deemed Input Tax = Total Sales (Excl VAT) × Deemed Input Rate / 100
- Deemed rates vary by product category (defined by IRD)
- Cannot claim actual input tax if using deemed method
- Must use consistently for entire taxable period

**File Naming Convention:**
`TIN_Schedule05_YYYYMM.csv`

### 5.6 Schedule 06 - Goods Export Schedule

**Purpose:** Records exports of goods eligible for zero-rating (0% VAT)

**When Required:** For VAT-registered persons exporting goods

**CSV/Excel File Structure:**

| Field No. | Field Name         | Data Type    | Length | Required    | Format/Validation | Description                    |
| --------- | ------------------ | ------------ | ------ | ----------- | ----------------- | ------------------------------ |
| 1         | Export Invoice No  | Alphanumeric | 40     | Yes         | No spaces         | Export invoice number          |
| 2         | Invoice Date       | Date         | 10     | Yes         | MM/DD/YYYY        | Date of export invoice         |
| 3         | Buyer Name         | Text         | 200    | Yes         | -                 | Name of foreign buyer          |
| 4         | Buyer Country      | Text         | 100    | Yes         | -                 | Country of buyer               |
| 5         | Description        | Text         | 500    | Yes         | -                 | Description of exported goods  |
| 6         | HS Code            | Alphanumeric | 10     | No          | -                 | Harmonized System Code         |
| 7         | FOB Value (LKR)    | Decimal      | 15,2   | Yes         | >= 0              | Free on Board value in LKR     |
| 8         | Export Value (USD) | Decimal      | 15,2   | Yes         | >= 0              | Export value in USD            |
| 9         | Exchange Rate      | Decimal      | 10,4   | Yes         | > 0               | USD to LKR exchange rate       |
| 10        | Customs Entry No   | Alphanumeric | 50     | Yes         | -                 | Customs export declaration     |
| 11        | Export Date        | Date         | 10     | Yes         | MM/DD/YYYY        | Date goods left Sri Lanka      |
| 12        | Payment Received   | Text         | 3      | Yes         | YES/NO            | Foreign currency received?     |
| 13        | Payment Date       | Date         | 10     | Conditional | MM/DD/YYYY        | Date payment received (if YES) |
| 14        | Bank Receipt No    | Alphanumeric | 50     | Conditional | -                 | Bank inward remittance advice  |
| 15        | EDB Certificate No | Alphanumeric | 50     | No          | -                 | Export Development Board cert  |

**Validation Rules:**

- Payment must be received within 6 months from end of taxable period
- Payment must be in foreign currency through licensed bank
- Must attach customs export declaration
- Must attach shipping bill/airway bill
- EDB certificate required for certain commodities
- If payment not received, zero-rating may be disallowed

**File Naming Convention:**
`TIN_Schedule06_YYYYMM.csv`

**Sample Data:**

```csv
Export Invoice No,Invoice Date,Buyer Name,Buyer Country,Description,HS Code,FOB Value (LKR),Export Value (USD),Exchange Rate,Customs Entry No,Export Date,Payment Received,Payment Date,Bank Receipt No,EDB Certificate No
EXP-2025-101,07/05/2025,Global Traders Inc,USA,Tea - Ceylon Black,0902.30,2500000.00,8000.00,312.5000,CUSEXP-25-5001,07/08/2025,YES,07/20/2025,BNK-IRA-789123,EDB-2025-456
EXP-2025-102,07/12/2025,European Imports Ltd,Germany,Cinnamon Sticks,0906.11,1800000.00,5760.00,312.5000,CUSEXP-25-5002,07/15/2025,YES,07/28/2025,BNK-IRA-789124,EDB-2025-457
```

### 5.7 Schedule 07 - Service Export Schedule

**Purpose:** Records exports of services eligible for zero-rating (0% VAT)

**When Required:** For VAT-registered persons exporting services

**CSV/Excel File Structure:**

| Field No. | Field Name           | Data Type    | Length | Required    | Format/Validation | Description                          |
| --------- | -------------------- | ------------ | ------ | ----------- | ----------------- | ------------------------------------ |
| 1         | Service Invoice No   | Alphanumeric | 40     | Yes         | No spaces         | Service invoice number               |
| 2         | Invoice Date         | Date         | 10     | Yes         | MM/DD/YYYY        | Date of service invoice              |
| 3         | Client Name          | Text         | 200    | Yes         | -                 | Name of foreign client               |
| 4         | Client Country       | Text         | 100    | Yes         | -                 | Country of client                    |
| 5         | Service Description  | Text         | 500    | Yes         | -                 | Nature of services provided          |
| 6         | Service Category     | Text         | 100    | Yes         | Predefined        | IT/Consulting/Professional/BPO/Other |
| 7         | Service Value (LKR)  | Decimal      | 15,2   | Yes         | >= 0              | Value in LKR                         |
| 8         | Service Value (USD)  | Decimal      | 15,2   | Yes         | >= 0              | Value in USD                         |
| 9         | Exchange Rate        | Decimal      | 10,4   | Yes         | > 0               | USD to LKR exchange rate             |
| 10        | Service Period Start | Date         | 10     | Yes         | MM/DD/YYYY        | Service delivery start date          |
| 11        | Service Period End   | Date         | 10     | Yes         | MM/DD/YYYY        | Service delivery end date            |
| 12        | Payment Received     | Text         | 3      | Yes         | YES/NO            | Foreign currency received?           |
| 13        | Payment Date         | Date         | 10     | Conditional | MM/DD/YYYY        | Date payment received (if YES)       |
| 14        | Bank Receipt No      | Alphanumeric | 50     | Conditional | -                 | Bank inward remittance advice        |
| 15        | Contract Reference   | Alphanumeric | 100    | No          | -                 | Service contract reference           |

**Validation Rules:**

- Payment must be received within 6 months from end of taxable period
- Payment must be in foreign currency through licensed bank
- Service must be performed for non-resident person
- Must attach service contract or agreement
- Must attach bank inward remittance advice
- If payment not received, zero-rating may be disallowed

**File Naming Convention:**
`TIN_Schedule07_YYYYMM.csv`

**Sample Data:**

```csv
Service Invoice No,Invoice Date,Client Name,Client Country,Service Description,Service Category,Service Value (LKR),Service Value (USD),Exchange Rate,Service Period Start,Service Period End,Payment Received,Payment Date,Bank Receipt No,Contract Reference
SVC-2025-201,07/03/2025,TechCorp Solutions,USA,Software Development,IT,3125000.00,10000.00,312.5000,06/01/2025,06/30/2025,YES,07/15/2025,BNK-IRA-789125,CNTR-2025-TC01
SVC-2025-202,07/10/2025,Euro Consulting Ltd,UK,Business Process Outsourcing,BPO,1875000.00,6000.00,312.5000,07/01/2025,07/31/2025,NO,,,CNTR-2025-EC02
```

### 5.8 Amendment Schedules (Schedules 01A - 07A)

**Purpose:** Correct errors in previously submitted schedules

**When Required:** When errors are discovered in schedules submitted in prior taxable periods

**General Structure:** Same field structure as corresponding main schedule PLUS additional fields:

| Additional Field      | Data Type    | Length | Required | Description                       |
| --------------------- | ------------ | ------ | -------- | --------------------------------- |
| Original Period       | Text         | 7      | Yes      | Original taxable period (YYYY-MM) |
| Original Schedule Ref | Alphanumeric | 50     | Yes      | Reference to original submission  |
| Amendment Reason      | Text         | 500    | Yes      | Detailed reason for amendment     |
| Amendment Type        | Text         | 20     | Yes      | ADD/MODIFY/DELETE                 |

**Amendment Rules:**

- Must be submitted within 6 months of original invoice date
- DELETE: Mark record as deleted (provide original details)
- MODIFY: Provide corrected values (system calculates difference)
- ADD: Add new records that were omitted
- Cannot amend after 6 months without IRD approval

**File Naming Convention:**
`TIN_Schedule[01-07]Amendment_YYYYMM.csv`

**Example (Schedule 01 Amendment):**

```csv
Original Period,Original Schedule Ref,Amendment Reason,Amendment Type,Invoice No,Invoice Date,Customer TIN,Customer Name,Description,Value (Excl VAT),VAT Rate,VAT Amount,Total Value
2025-06,SCH01-2025-06-001,Incorrect VAT amount calculated,MODIFY,INV-2025-001,06/05/2025,9876543210,ABC Traders Ltd,Consulting Services,100000.00,18,18000.00,118000.00
2025-06,SCH01-2025-06-001,Invoice omitted in original submission,ADD,INV-2025-099,06/28/2025,7777777777,New Client Ltd,Product Sales,50000.00,18,9000.00,59000.00
```

---

## 6. Functional Requirements

### 6.1 Client Authentication & Onboarding

**Priority:** P0 (Critical)

**User Story:** As a new company, I want to register and set up my account so that I can start managing my VAT compliance.

**Requirements:**

**6.1.1 User Registration**

- Email-based registration with email verification
- Password requirements: minimum 8 characters, uppercase, lowercase, number, special character
- Password strength indicator during creation
- Terms of Service and Privacy Policy acceptance required
- Registration confirmation email with verification link
- Verification link expires after 24 hours

**6.1.2 User Login**

- Email and password authentication
- "Remember Me" option (30-day session)
- Account lockout after 5 failed login attempts (15-minute cooldown)
- Clear error messages (without revealing if email exists for security)
- Password reset functionality via email
- Option to enable Two-Factor Authentication (2FA) via SMS or authenticator app

**6.1.3 Two-Factor Authentication (2FA)**

- Optional but recommended for security
- Support for SMS OTP and TOTP apps (Google Authenticator, Authy)
- Backup codes generation (10 one-time use codes)
- Ability to disable 2FA with current authentication

**6.1.4 Password Reset**

- "Forgot Password" link on login page
- Email verification before reset
- Reset link expires after 1 hour
- Cannot reuse last 3 passwords
- Notification email sent when password changed

**6.1.5 Company Profile Setup**

- Multi-step onboarding wizard with progress indicator
- **Step 1: Basic Information**
  - Company legal name (as per registration certificate)
  - Company trading name (if different)
  - Company registration number
  - Date of incorporation
  - Company address (with autocomplete)
  - Phone number (with validation)
  - Website (optional)
- **Step 2: VAT Registration Details**
  - TIN (Tax Identification Number) - 10 digits, validated
  - VAT registration date
  - Taxable period: Monthly/Quarterly (dropdown)
  - VAT registration certificate upload (PDF/JPG, max 5MB)
- **Step 3: Business Details**
  - Industry/business type (dropdown with search)
  - Number of employees (range selector)
  - Annual turnover range
  - Nature of business (manufacturer/trader/service provider/importer/exporter)
- **Step 4: Primary Contact**
  - Contact person name
  - Designation
  - Email (can be different from login email)
  - Phone number
- **Step 5: Document Upload**
  - Company registration certificate (required)
  - VAT registration certificate (required)
  - Power of Attorney (if service provider managing account)
  - Business registration certificate
  - Any other relevant documents

**6.1.6 Profile Management**

- View and edit company information
- Update VAT registration details
- Change primary contact information
- Upload/replace documents
- Document version history
- Audit trail of all profile changes with timestamp and user

**Acceptance Criteria:**

- [x] User can register with email and receive verification email within 2 minutes
- [x] User cannot access system without email verification
- [x] User can log in with correct credentials
- [x] Account locks after 5 failed attempts and unlocks after 15 minutes
- [x] User can reset password via email link
- [x] Onboarding wizard saves progress (can complete later)
- [x] TIN validation prevents invalid formats
- [x] Required documents must be uploaded before completing onboarding
- [x] Profile changes are logged in audit trail
- [x] 2FA can be enabled and tested before activation

**Dependencies:**

- Email service (SMTP integration)
- SMS service (for 2FA via SMS)
- Document storage system (AWS S3 or equivalent)
- TIN validation service (if IRD API available)

**Business Rules:**

- One company per TIN
- Multiple users can be associated with one company (added after initial setup)
- Company admin can invite additional users
- All users under a company see the same data

**Validation Rules:**

- Email: Valid format, unique in system
- TIN: Exactly 10 digits, numeric only, unique in system
- Password: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
- Phone: Sri Lankan format (+94 or 0), 10 digits after prefix
- Document upload: PDF, JPG, PNG only, max 5MB per file

**Error Handling:**

- Show inline validation errors immediately
- Display summary of errors at top of form
- Preserve form data if submission fails
- Email delivery failure: Show notification to contact support
- Document upload failure: Allow retry with clear error message

---

### 6.2 Bulk Data Import & Mapping

**Priority:** P0 (Critical)

**User Story:** As a company accountant, I want to export transaction data from my accounting system (CSV/Excel) and upload it so the system can validate, map, and generate IRD schedules automatically; Simplebooks will review and submit to IRD.

**Requirements:**

**6.2.1 Templates & Mapping Wizard**

- Pre-built CSV/XLSX templates for Schedules 01-07 and amendment schedules
- One-file or per-schedule upload supported (combined uploads allowed)
- Mapping Wizard to map arbitrary column names to canonical fields
- Save mapping templates for common systems (QuickBooks, Xero, SAP, Tally) and custom mappings per company
- Preview mapped data before import

**6.2.2 Validation Engine**

- Row-by-row validation with clear error codes and human-readable messages
- Validation rules include: required fields, TIN format (10 digits), date ranges, VAT rate allowed values, numeric formats, duplicate record detection
- Option to download an error report (CSV/XLSX) showing problem rows and suggested fixes
- Support partial import (import valid rows) or require full-file correction (configurable per company)

**6.2.3 Import & Review Workflow**

- Import creates a staging dataset associated with company and taxable period
- Automated pre-checks flag: missing critical fields, potential disallowed input tax, export payment deadlines
- Staging records enter a Simplebooks review queue where reviewers can:
  - Approve records
  - Request supporting evidence (via secure request to client)
  - Edit mapped fields (minor corrections)
  - Reject and return file with error report
- Audit trail for all review actions with timestamp and user

**6.2.4 Submission & Locking**

- After reviewer approval, the system generates IRD schedules (CSV/Excel) and a VAT return package
- Simplebooks can submit to IRD automatically using the scraper or IRD API (when available)
- On successful submission, period status becomes **Filed** and the staging dataset is locked (amendments handled via amendment schedules)

**6.2.5 Supporting Documents Policy**

- The platform does **not** manage or extract individual invoice documents as part of normal processing
- Clients may optionally upload a single ZIP of supporting documents for audit purposes; the system stores the ZIP as an opaque file linked to the import but does not index or parse it
- Simplebooks may request specific documents during review; clients respond via secure file transfer or email and Simplebooks records the request/response in the CRM

**Acceptance Criteria:**

- [x] Company can upload CSV/XLSX templates for schedules and map columns within the UI
- [x] Validation shows row-level errors with clear messaging and downloadable error report
- [x] System imports 10,000 rows within 30 seconds in normal operating conditions
- [x] Reviewers can approve/imported data, request documents, or send back for correction
- [x] Approved data produces IRD schedules that match IRD format exactly

**6.2.6 Mapping Wizard — Acceptance Criteria & Test Plan**

**Acceptance Criteria:**

- **AC1:** User can upload a sample CSV/XLSX and the Mapping Wizard displays detected columns and suggested canonical fields
- **AC2:** User can map source columns to canonical fields and save the mapping as a reusable template
- **AC3:** The wizard supports auto-matching for common systems (QuickBooks, Xero, SAP, Tally) using pre-built templates
- **AC4:** The wizard validates mapped fields (data type, required fields, date format, TIN format) and shows row-level errors after preview
- **AC5:** The saved mapping template can be applied to subsequent uploads and supports versioning
- **AC6:** Edge cases (duplicate identifiers, missing required fields, inconsistent date formats) are detected and reported with clear, actionable guidance
- **AC7:** Performance — mapping and preview operate on 10,000 rows within 30 seconds (typical operating conditions)

**Test Plan (high level):**

- **Test 1: Auto-detect columns**

  - Input: CSV with headers "inv_no, inv_date, cust_tin, amount"
  - Steps: Upload file → open Mapping Wizard
  - Expected: Wizard suggests mapping inv_no → Invoice No, inv_date → Invoice Date, cust_tin → Customer TIN, amount → Value (Excl VAT)

- **Test 2: Save & apply mapping template**

  - Input: File from QuickBooks export with known headers
  - Steps: Map fields, save as "QuickBooks-Std", upload a second QuickBooks file and apply template
  - Expected: Fields mapped automatically, preview shows no unmapped columns

- **Test 3: Validation & error reporting**

  - Input: File containing rows with invalid TIN (9 digits), future dates, and non-numeric values in amount
  - Steps: Apply mapping → Preview → Validate
  - Expected: Row-level error report lists offending rows with error codes and explanations; downloadable error report available

- **Test 4: Partial import behavior**

  - Input: Mixed valid and invalid rows
  - Steps: Choose "partial import" option and import
  - Expected: Valid rows imported to staging, invalid rows remain with errors; summary shows counts of accepted/rejected rows

- **Test 5: Performance**

  - Input: 10,000-row sample file
  - Steps: Upload → Auto-match → Preview
  - Expected: Mapping & preview complete within 30 seconds; memory/CPU within acceptable limits

- **Test 6: Security & RBAC**

  - Steps: User without import role attempts to access Mapping Wizard
  - Expected: Access denied; audit log records attempt

- **Test 7: Apply mapping with slight header variations**
  - Input: File with header "InvoiceNo" vs previous "inv_no"
  - Steps: Apply saved template
  - Expected: Template matches when possible; unmatched columns highlighted for manual mapping

**Notes:**

- Provide sample test files for all common accounting systems
- Include automated tests for mapping logic and validation rules in CI

**Dependencies:**

- Test fixtures (sample files) for QuickBooks, Xero, SAP, Tally
- Automated unit tests for mapping heuristics and validation rules
- Performance testing environment (10k+ row samples)

**Business Value:**

- Mapping Wizard reduces time to onboard clients and decreases manual errors during upload, enabling Simplebooks to scale review operations

**Dependencies:**

- Mapping templates for common accounting systems
- Validation engine and rule-set maintained by VAT experts
- Simplebooks CRM review workflow
- IRD submission scraper or API integration

**Business Rules:**

- Input data is authoritative; clients are responsible for source data accuracy
- The platform stores structured data only (no per-invoice document indexing)
- Missing supporting documents do not block schedule generation, but may block submission (reviewer decision)
- Amendment schedules are used to correct previously submitted periods

**Validation Rules:**

- Dates must be in MM/DD/YYYY format (or mapped correctly)
- Numeric amounts rounded to 2 decimal places
- TIN must be exactly 10 digits, numeric only
- VAT rate must be 0, 18, or marked as Exempt
- Duplicate record detection uses unique identifiers provided in the upload (Invoice No / Reference No)

**Error Handling:**

- Validation fails: provide downloadable error report and reject/partial import options
- Import failure: allow retry with clear error message and logs
- Submission failure: retry mechanism and escalation to Simplebooks support

---

### 6.3 VAT Calculation & Schedules

**Priority:** P0 (Critical)

**User Story:** As a company accountant, I want the system to automatically calculate my VAT liability and generate all required IRD schedules so that I can be confident my submissions are accurate and compliant.

**Requirements:**

**6.3.1 Automated VAT Calculation Engine**

Core calculation functionality:

- **Multiple VAT Rates Support:**

  - Standard rate: 18%
  - Zero-rated: 0% (exports, specified supplies)
  - Exempt: No VAT (exempt goods/services)
  - Support for rate changes (configurable by admin)

- **Output Tax Calculation:**

  - Sum all sales invoices for the period
  - Calculate VAT by rate category
  - Group by VAT rate: 18%, 0%, Exempt
  - Total Output Tax = Sum of all Output VAT at standard rate

- **Input Tax Calculation:**

  - Sum all purchase invoices for the period (local + imports)
  - Calculate VAT by rate category
  - Validate input tax eligibility:
    - Supplier must be VAT-registered (TIN check)
    - Invoice must meet IRD requirements
    - Must be used for taxable supplies
  - Apply input tax restrictions for exempt supplies
  - Total Input Tax = Sum of all eligible Input VAT

- **Net VAT Calculation:**

  - Net VAT = Output Tax - Input Tax
  - If positive: VAT Payable to IRD
  - If negative: VAT Refundable from IRD (subject to conditions)

- **Credit/Debit Note Adjustments:**

  - Credit notes reduce original invoice amounts
  - Debit notes increase original invoice amounts
  - Adjust Output/Input tax accordingly
  - Validate note is within 6 months of original invoice

- **Import VAT Handling:**

  - VAT paid at customs is claimable as input tax
  - Link import invoices to customs declarations
  - Validate customs payment receipts

- **Export Handling:**
  - Zero-rated if payment received in foreign currency within 6 months
  - If payment not received, convert to standard rate
  - Track payment deadlines and send alerts

**6.3.2 VAT Period Management**

- **Period Definition:**

  - Monthly: 1st to last day of each month
  - Quarterly: 3-month periods (Q1: Jan-Mar, Q2: Apr-Jun, Q3: Jul-Sep, Q4: Oct-Dec)
  - Display current period prominently
  - Show upcoming periods

- **Period Status Tracking:**

  - **Open:** Invoices can be added/edited
  - **Closed:** No new invoices, preparing for submission
  - **Submitted:** Return filed with IRD, locked for changes
  - **Acknowledged:** IRD has acknowledged receipt
  - **Paid:** VAT payment completed
  - **Filed:** All documents filed, period complete

- **Period Locking:**

  - Automatic lock when submission is marked complete
  - Manual lock option (before submission)
  - Cannot edit locked periods without unlocking
  - Unlock requires admin approval or authorized role

- **Period Dashboard:**
  - Display all periods with status
  - Color coding: Green (complete), Yellow (in progress), Red (overdue)
  - Quick stats per period:
    - Total invoices
    - Output VAT
    - Input VAT
    - Net VAT
    - Submission deadline
    - Days remaining

**6.3.3 Schedule 01 - Output Tax Schedule Generation**

- **Data Source:** All sales invoices for the period
- **Processing:**

  - Filter invoices by taxable period
  - Exclude draft invoices
  - Sort by invoice date, then invoice number
  - Calculate totals

- **Output Format:**

  - Excel file (.xlsx) with IRD-specified column layout
  - CSV file (.csv) for direct upload to IRD e-Services
  - Column headers exactly as specified by IRD
  - All fields formatted per IRD requirements:
    - Dates: MM/DD/YYYY
    - TINs: 10-digit numeric
    - Amounts: 2 decimal places, no currency symbols
    - No blank rows between data

- **Summary Section:**

  - Total number of imported rows
  - Total value (excluding VAT)
  - Total VAT amount
  - Grand total (including VAT)
  - Breakdown by VAT rate (if multiple rates)

- **Validation:**

  - All required fields populated
  - No missing customer TINs
  - Date formats correct
  - Calculations verified
  - Duplicate invoice number check

- **Preview:**
  - Display first 20 rows in UI
  - Full table view with pagination
  - Download button for complete schedule

**6.3.4 Schedule 02 - Input Tax Schedule (Local Purchases)**

- **Data Source:** All purchase invoices (local suppliers) for the period
- **Processing:**

  - Filter by taxable period
  - Exclude drafts and import invoices (separate schedule)
  - Validate supplier VAT registration status
  - Flag ineligible input tax claims with warnings
  - Sort by invoice date, then supplier name

- **Eligibility Checks:**

  - Supplier TIN valid and VAT-registered
  - Invoice meets IRD format requirements
  - Invoice not older than 3 months (flag for review)
  - Purchase used for taxable supplies (not exempt)

- **Output Format:**

  - Excel and CSV files per IRD specifications
  - All fields formatted correctly
  - Summary section with totals

- **Warnings/Alerts:**
  - Highlight suppliers with invalid TINs (red flag)
  - Show invoices > 3 months old (yellow flag)
  - Indicate missing supporting documents (orange flag)

**6.3.5 Schedule 03 - Input Tax Schedule (Imports)**

- **Data Source:** Import invoices with customs declarations
- **Processing:**

  - Filter import invoices for the period
  - Link to customs entry numbers (CUSDEC)
  - Validate customs payment receipts
  - Calculate assessable value correctly

- **Validation:**

  - CUSDEC number format check
  - Customs payment receipt required
  - VAT amount matches customs assessment
  - Import date within taxable period

- **Output Format:**
  - Excel and CSV files per IRD specifications
  - Include all import-specific fields (HS Code, CIF value, customs duty, etc.)

**6.3.6 Schedule 04 - Credit and Debit Notes Schedule**

- **Data Source:** All credit/debit notes for the period
- **Processing:**

  - Include both OUTPUT and INPUT notes
  - Link to original invoices
  - Calculate adjustments
  - Validate note is within 6 months of original

- **Validation:**

  - Original invoice must exist in system
  - Original invoice date not more than 6 months ago
  - Adjustment amounts correct
  - OUTPUT notes: adjust Output Tax
  - INPUT notes: adjust Input Tax

- **Output Format:**
  - Excel and CSV files per IRD specifications
  - Clearly indicate note type and direction
  - Show original and adjusted values

**6.3.7 Schedule 05 - Deemed Input Schedule**

- **Data Source:** Sales data grouped by product category
- **Processing:**

  - Calculate deemed input tax per IRD rates
  - Apply category-specific deemed percentages
  - Cannot mix deemed and actual input tax methods

- **Validation:**

  - Ensure consistent method used for entire period
  - Deemed rates match IRD-approved rates
  - Category classification correct

- **Output Format:**
  - Excel and CSV files per IRD specifications
  - Summary by category

**6.3.8 Schedule 06 - Goods Export Schedule**

- **Data Source:** Export invoices (goods)
- **Processing:**

  - Filter invoices marked as goods exports
  - Check payment received status
  - Validate foreign currency payment within 6 months
  - Link to customs export declarations

- **Validation:**

  - CUSDEC export entry number required
  - Bank inward remittance advice required
  - Payment in foreign currency confirmed
  - EDB certificate (where applicable)

- **Payment Tracking:**

  - Track 6-month deadline per invoice
  - Send alerts 1 month before deadline
  - If payment not received, flag for rate change (0% → 18%)

- **Output Format:**
  - Excel and CSV files per IRD specifications
  - Include all export-specific fields

**6.3.9 Schedule 07 - Service Export Schedule**

- **Data Source:** Export invoices (services)
- **Processing:**

  - Filter invoices marked as service exports
  - Check payment received status
  - Validate foreign currency payment within 6 months
  - Link to service contracts

- **Validation:**

  - Service must be for non-resident person
  - Foreign currency payment required
  - Bank inward remittance advice required
  - Service period dates logical

- **Output Format:**
  - Excel and CSV files per IRD specifications
  - Include service-specific fields (service category, period, contract ref)

**6.3.10 Bulk Schedule Export**

- **"Export All Schedules" Button:**
  - Generates all applicable schedules for the period
  - Creates ZIP file containing:
    - Schedule 01 (Excel + CSV)
    - Schedule 02 (Excel + CSV)
    - Schedule 03 (Excel + CSV) - if imports exist
    - Schedule 04 (Excel + CSV) - if credit/debit notes exist
    - Schedule 05 (Excel + CSV) - if using deemed method
    - Schedule 06 (Excel + CSV) - if goods exports exist
    - Schedule 07 (Excel + CSV) - if service exports exist
    - Summary document (PDF) with all totals
  - ZIP filename: `TIN_VAT_Schedules_YYYYMM.zip`

**Acceptance Criteria:**

- [x] VAT calculations accurate to 2 decimal places (LKR)
- [x] All schedules generated match IRD format exactly
- [x] CSV files can be uploaded directly to IRD e-Services without errors
- [x] Excel files open correctly with proper formatting
- [x] Summary totals match detailed schedules
- [x] Only applicable schedules are generated (e.g., no Schedule 03 if no imports)
- [x] Export payment tracking sends alerts before 6-month deadline
- [x] Schedule generation completes within 30 seconds for 1000 rows of uploaded data
- [x] All validation errors displayed clearly before generation
- [x] Generated schedules can be previewed before download

**Dependencies:**

- Imported schedule data (sales, purchases, imports)
- Credit/debit note data
- Customer/supplier master data (for TINs, names)
- Export payment tracking system
- Document management (for attachments verification)
- IRD schedule format specifications (templates)

**Business Rules:**

- Schedules can only be generated for closed periods
- All uploaded rows must be validated before schedule generation
- Missing documents flagged but don't prevent generation (warning only)
- Export zero-rating depends on payment receipt within 6 months
- Input tax eligibility validated against supplier VAT registration
- Exempt supplies: No output VAT, no input tax recovery
- Zero-rated supplies: No output VAT, input tax recoverable

**Validation Rules:**

- All uploaded rows have required fields populated
- Customer/Supplier TINs are 10 digits, numeric
- Dates in MM/DD/YYYY format
- Amounts formatted with 2 decimal places
- No negative amounts (except in credit notes)
- Record identifiers unique per company (e.g., Invoice No or Reference No if provided)
- Credit/debit notes reference valid original invoices
- Export payment deadlines tracked and enforced

**Error Handling:**

- Missing invoice data: Show error message, list missing invoices
- Invalid TINs: Flag in schedule with warning color, generate anyway
- Calculation errors: Stop generation, show error details
- File generation failure: Retry mechanism, error notification
- Large datasets: Show progress bar, allow cancellation
- No data for schedule: Skip schedule, show info message

---

### 6.4 VAT Return Generation

**Priority:** P0 (Critical)

**User Story:** As a company accountant, I want to generate a complete VAT return with all supporting documents so that I can submit it to IRD with confidence.

**Requirements:**

**6.4.1 VAT Return Form (Main IRD Return)**

- **Form Structure:**

  - Company details section (auto-populated from profile)
  - Taxable period (auto-filled)
  - Output Tax section:
    - Total taxable supplies (LKR)
    - VAT on taxable supplies (Output Tax)
    - Adjustments from credit/debit notes
  - Input Tax section:
    - Total input tax on local purchases
    - Total input tax on imports
    - Adjustments from credit/debit notes
  - Calculation section:
    - Total Output Tax
    - Total Input Tax
    - Net VAT (Output - Input)
    - VAT Payable / Refundable
  - Declaration section:
    - Authorized signatory details
    - Declaration text (as per IRD requirements)
    - Date of submission
    - Signature field (electronic signature or upload)

- **Auto-population:**

  - All financial figures pulled from schedules automatically
  - Company details from profile
  - Taxable period from selected period
  - Calculations performed automatically
  - Read-only fields (cannot manually edit calculations)

- **Validation:**

  - All schedules must be generated first
  - Schedule totals must match return figures
  - Declaration must be accepted
  - Authorized signatory details required

- **Output Formats:**
  - PDF (print-ready, IRD format)
  - Excel (for records)
  - XML (if IRD electronic submission requires)

**6.4.2 Supporting Documents Package**

- **Automatic Package Creation:**

  - ZIP file containing all required documents
  - Organized folder structure:
    ```
    TIN_VAT_Return_YYYYMM/
    ├── VAT_Return_Form.pdf
    ├── Schedules/
    │   ├── Schedule_01_Output.xlsx
    │   ├── Schedule_01_Output.csv
    │   ├── Schedule_02_Input_Local.xlsx
    │   ├── Schedule_02_Input_Local.csv
    │   ├── Schedule_03_Input_Imports.xlsx (if applicable)
    │   ├── Schedule_03_Input_Imports.csv (if applicable)
    │   ├── Schedule_04_Credit_Debit_Notes.xlsx (if applicable)
    │   ├── Schedule_04_Credit_Debit_Notes.csv (if applicable)
    │   ├── Schedule_06_Goods_Export.xlsx (if applicable)
    │   ├── Schedule_06_Goods_Export.csv (if applicable)
    │   └── Schedule_07_Service_Export.xlsx (if applicable)
    │       └── Schedule_07_Service_Export.csv (if applicable)
    ├── Supporting_Documents/
    │   ├── Company_Registration.pdf
    │   ├── VAT_Registration_Certificate.pdf
    │   ├── Power_of_Attorney.pdf (if applicable)
    │   └── Key_Invoices/ (selected high-value invoices)
    │       ├── Sales/
    │       └── Purchases/
    ├── Payment_Receipt/ (if VAT paid)
    │   └── Bank_Receipt.pdf
    └── Summary_Report.pdf
    ```

- **Summary Report:**
  - Executive summary of the VAT return
  - Key figures highlighted:
    - Total sales
    - Total purchases
    - VAT payable/refundable
    - Number of rows processed
  - Breakdown by VAT rate
  - Breakdown by transaction type (local, imports, exports)
  - Comparison with previous period (if available)
  - Charts/graphs for visual representation

**6.4.3 VAT Return Summary Dashboard**

- **Visual Overview Before Submission:**

  - **KPI Cards:**

    - Total Sales (Excl VAT)
    - Total Purchases (Excl VAT)
    - Output VAT
    - Input VAT
    - Net VAT (Payable/Refundable)

  - **Charts:**

    - Pie chart: VAT breakdown by rate (18%, 0%, Exempt)
    - Bar chart: Monthly trend (if multiple periods data available)
    - Line chart: Output vs Input VAT over time

  - **Transaction Summary:**

    - Number of sales rows
    - Number of purchase rows
    - Number of import rows
    - Number of credit/debit notes
    - Number of export rows

  - **Compliance Checklist:**

    - [ ] All invoices entered
    - [ ] All documents attached
    - [ ] All schedules generated
    - [ ] VAT return form completed
    - [ ] Supporting documents packaged
    - [ ] Ready for submission

  - **Alerts/Warnings:**
    - Missing supplier TINs
    - Missing supporting documents
    - Export payments not received (6-month deadline approaching)
    - Unusual spikes or drops in VAT amounts (anomaly detection)
    - Deadlines approaching

- **Pre-Submission Review:**
  - Side-by-side comparison: This Period vs Previous Period
  - Variance analysis (highlight significant changes)
  - Detailed transaction drill-down (click to view invoices)
  - Final validation check before download

**6.4.4 Submission Tracking**

- **Status Workflow:**

  1. **Draft:** Return being prepared
  2. **Ready for Review:** All data entered, needs review
  3. **Approved:** Reviewed and approved internally
  4. **Downloaded:** Package downloaded, ready for IRD submission
  5. **Submitted to IRD:** Filed with IRD (manual or electronic)
  6. **IRD Acknowledged:** IRD confirmation received
  7. **Payment Completed:** VAT paid (if payable)
  8. **Filed:** Complete, archived

- **Submission Log:**
  - Date/time of each status change
  - User who performed action
  - Notes/comments
  - Document uploads (IRD acknowledgments, payment receipts)

**Acceptance Criteria:**

- [x] VAT return form auto-populated correctly from schedules
- [x] All calculations match schedule totals
- [x] Supporting documents package contains all required files
- [x] ZIP file structure organized and named correctly
- [x] Summary dashboard displays all KPIs accurately
- [x] Charts update in real-time as data changes
- [x] Compliance checklist validates all requirements met
- [x] Return cannot be marked "Submitted" without all checklist items complete
- [x] PDF return form is print-ready and matches IRD format
- [x] Submission tracking log maintains complete audit trail

**Dependencies:**

- Schedule generation (6.3)
- Invoice data
- Document management system
- PDF generation library
- ZIP file creation functionality
- Chart/graph library (Recharts or similar)

**Business Rules:**

- VAT return can only be generated after all schedules are generated
- Once marked "Submitted to IRD," period is locked
- Cannot regenerate return after submission without unlocking period
- Amendments require separate amendment schedules
- Refund applications (if Net VAT negative) require additional documentation

**Validation Rules:**

- All schedules must exist and be current
- Schedule totals must reconcile with return form
- Declaration must be accepted before download
- Authorized signatory details must be complete
- Cannot submit if validation errors exist

**Error Handling:**

- Missing schedules: Display error, link to schedule generation
- Calculation mismatch: Highlight discrepancy, prevent submission
- PDF generation failure: Retry mechanism, error notification
- ZIP file creation failure: Show error, allow retry
- Large file size: Show progress bar, optimize compression

---

### 6.5 Export & Refund Management

**Priority:** P1 (High)

**User Story:** As an exporting company, I want to manage my export documentation and track VAT refund applications so that I can claim zero-rating and refunds efficiently.

**Requirements:**

**6.5.1 Export Documentation Management**

- **Goods Export Documentation:**

  - Link Schedule 06 records to customs declarations (CUSDEC) or reference numbers provided in the upload
  - Upload and attach:
    - Customs export entry (CUSDEC)
    - Shipping bill/Bill of Lading
    - Airway bill (for air freight)
    - Commercial invoice
    - Packing list
    - Certificate of origin
    - EDB certificate (where required)
    - Bank inward remittance advice
  - Document checklist per export invoice
  - Missing document alerts

- **Service Export Documentation:**

  - Service contract/agreement upload
  - Bank inward remittance advice
  - Proof of service delivery to non-resident
  - Email correspondence (optional)
  - Invoice acknowledgment from client

- **Foreign Currency Payment Tracking:**

  - Record expected payment amount and currency
  - Record actual payment received (amount, currency, date)
  - Exchange rate at time of payment
  - Bank reference number
  - Automatic conversion to LKR
  - Payment status: Pending/Received/Overdue

- **6-Month Deadline Tracker:**

  - Visual timeline showing deadline
  - Days remaining until deadline
  - Color coding: Green (>60 days), Yellow (30-60 days), Red (<30 days), Grey (overdue)
  - Automatic email alerts:
    - 60 days remaining
    - 30 days remaining
    - 15 days remaining
    - 7 days remaining
    - Deadline passed
  - Bulk view of all exports with pending payments

- **Zero-Rating Compliance:**
  - Automatic zero-rating if payment received within 6 months
  - Automatic rate change to 18% if payment not received
  - Adjustment calculation for overdue payments
  - Generate amendment schedule automatically

**6.5.2 VAT Refund Application**

- **Refund Eligibility Check:**

  - Calculate Net VAT (if negative = refund due)
  - Check eligibility criteria:
    - Zero-rated supplies > 50% of total supplies in preceding year
    - No outstanding tax liabilities
    - Compliant with all VAT return submissions
    - Registered under Risk-Based Refund Scheme (RBRS)
  - Display eligibility status and reasons if not eligible

- **Refund Application Form:**

  - Auto-populate from VAT return data
  - Additional fields:
    - Refund amount claimed
    - Period for which refund claimed
    - Bank account details for refund payment
    - Reason for refund (exports, excess input tax, etc.)
  - Supporting documents checklist:
    - Copy of VAT return
    - All schedules (especially export schedules)
    - Bank statements showing VAT payments
    - Export documentation
    - Tax clearance certificate
    - Any other documents per IRD requirements

- **Refund Tracking:**

  - Status workflow:
    - Application Prepared
    - Submitted to IRD
    - Under Review
    - Additional Documents Requested
    - Approved
    - Payment Processed
    - Refund Received
  - IRD reference number
  - Expected processing time (45 days per RBRS)
  - Actual refund amount (may differ from claimed)
  - Refund receipt date
  - Bank credit confirmation

- **Refund History:**
  - List of all refund applications
  - Status of each application
  - Timeline from submission to receipt
  - Amount claimed vs received
  - Success rate analytics

**6.5.3 Export Performance Dashboard**

- **Key Metrics:**

  - Total export value (current period)
  - Total export VAT eligible for zero-rating
  - Payment received rate (%)
  - Average payment receipt time (days)
  - Overdue payments count and value

- **Export Analysis:**

  - Export by country (pie chart)
  - Export by product/service category (bar chart)
  - Export trend over time (line chart)
  - Payment receipt trend

- **Risk Indicators:**
  - Exports approaching 6-month deadline
  - Exports past deadline (not received)
  - High-value exports pending payment
  - Customers with history of late payments

**Acceptance Criteria:**

- [x] User can link required export documents via optional opaque ZIP or respond to reviewer document requests (system records requests in CRM)
- [x] System tracks 6-month deadline automatically
- [x] Email alerts sent on schedule before deadline
- [x] Refund eligibility calculated accurately
- [x] Refund application form pre-filled from VAT data
- [x] All refund statuses tracked with timestamps
- [x] Export dashboard displays real-time metrics
- [x] Overdue exports trigger automatic rate adjustment

**Dependencies:**

- Imported schedule staging & mapping system
- Optional supporting document storage (opaque ZIP) and CRM request flow
- Email notification system
- VAT calculation engine
- Amendment schedule generation

**Business Rules:**

- Zero-rating only valid if payment received in foreign currency within 6 months
- Payment must be through licensed bank in Sri Lanka
- If payment not received, retrospectively apply 18% VAT
- Amendment schedule required for overdue exports
- Refund processing time: 45 days (RBRS) or longer for non-RBRS

**Validation Rules:**

- Export record must include valid customs entry number (if goods) or supporting evidence (services)
- Bank receipt must match invoice amount and currency
- Payment date must be within 6 months of end of taxable period
- All required supporting documents must be provided via secure delivery; system records request status

**Error Handling:**

- Missing documents: Display checklist, prevent submission until complete
- Invalid payment date: Show error, explain deadline rule
- Failed refund submission: Allow retry, save draft application
- Document upload failure: Retry mechanism with error details

---

### 6.6 Reports & Analytics

**Priority:** P1 (High)

**User Story:** As a company accountant, I want comprehensive reports and analytics so that I can understand my VAT position, identify trends, and make informed decisions.

**Requirements:**

**6.6.1 Standard Reports**

**VAT Summary Report:**

- Period selection (single or range)
- Summary section:
  - Total sales (by VAT rate)
  - Total purchases (by VAT rate)
  - Output VAT
  - Input VAT
  - Net VAT position
  - Comparison with previous period (variance %)
- Detailed breakdown:
  - By customer (top 10)
  - By supplier (top 10)
  - By product/service category
  - By month (if range selected)
- Charts:
  - VAT trend over time
  - Output vs Input VAT comparison
  - Sales and purchases by category
- Export options: PDF, Excel, CSV

**Transaction Register:**

- Comprehensive list of all imported transactions (by schedule/row)
- Filters:
  - Date range
  - Schedule type (Schedule 01-07)
  - Party (Customer/Supplier)
  - VAT rate
  - Amount range
  - Status (Staged/Approved/Submitted)
- Columns:
  - Record identifier (Invoice No / Reference No)
  - Date
  - Party name
  - Description
  - Value (excl VAT)
  - VAT rate
  - VAT amount
  - Total
  - Status
- Running totals at bottom
- Grouping options (by party, by month, by VAT rate)
- Export to Excel with formatting preserved

**Submission History Report:**

- List of all VAT submissions
- Columns:
  - Period
  - Submission date
  - Output VAT
  - Input VAT
  - Net VAT
  - Status (Submitted/Acknowledged/Paid/Filed)
  - IRD reference number
  - Payment date
  - Payment amount
- Downloadable supporting documents per submission
- Submission timeline visualization

**Compliance Report:**

- Checklist of compliance requirements
- Status for current period:
  - All invoices entered (Yes/No, count)
  - All documents attached (% complete)
  - Submission deadline (date, days remaining)
  - Previous period status
- Outstanding items list with priority
- Compliance score (percentage)
- Historical compliance trend

**Customer/Supplier Analysis Report:**

- Select customer or supplier
- Transaction history:
  - All invoices with party
  - Total value over time
  - VAT collected/paid
  - Payment patterns
- Period comparison
- Transaction frequency
- Average invoice value
- Export to Excel

**6.6.2 Custom Reports**

**Report Builder Interface:**

- Drag-and-drop fields selection
- Available data sources:
  - Sales invoices
  - Purchase invoices
  - Import invoices
  - Credit/debit notes
  - Export invoices
  - VAT returns
  - Customers
  - Suppliers
- Field library:
  - All invoice fields
  - Calculated fields (totals, averages, counts)
  - Date fields (with grouping options)
- Filter builder:
  - AND/OR logic
  - Multiple conditions
  - Date ranges
  - Amount ranges
  - Text matching
- Grouping and sorting options
- Aggregation functions (Sum, Average, Count, Min, Max)
- Chart selection (bar, line, pie, table)

**Save Report Templates:**

- Name and description
- Save filters and configuration
- Schedule automatic generation (daily/weekly/monthly)
- Email delivery to specified addresses
- Template library (personal and company-wide)

**Report Scheduling:**

- Select report template
- Frequency: Daily/Weekly/Monthly/Quarterly
- Specific day/date
- Time of generation
- Delivery method:
  - Email (multiple recipients)
  - In-app notification
  - Save to document repository
- File format: PDF/Excel/CSV

**6.6.3 Analytics Dashboard**

**Overview Dashboard:**

- Time period selector (MTD, QTD, YTD, Custom)
- KPI cards with trend indicators:
  - Total Sales (with % change)
  - Total Purchases (with % change)
  - Net VAT (with % change)
  - Compliance Score
  - Upcoming Deadlines (countdown)

**Visual Analytics:**

- **Sales & Purchase Trends:** Line chart showing monthly trends
- **VAT Rate Distribution:** Pie chart (18%, 0%, Exempt)
- **Top Customers:** Bar chart (by transaction value)
- **Top Suppliers:** Bar chart (by transaction value)
- **Export Performance:** Export value trend with payment status
- **Input vs Output VAT:** Dual-axis chart comparison
- **Monthly Comparison:** Bar chart comparing current vs previous periods

**Drill-Down Capability:**

- Click any chart element to see underlying data
- Filter entire dashboard by selection
- Export underlying data

**Predictive Analytics (Future Enhancement):**

- Forecast next period's VAT based on trends
- Cash flow projection for VAT payments
- Anomaly detection (unusual transactions)
- Optimization suggestions (timing of purchases, etc.)

**6.6.4 Report Security & Access Control**

- Role-based report access
- Sensitive reports (full financial data) restricted to authorized users
- Audit trail of report generation and access
- Watermarking of PDF reports with user details and timestamp
- Data masking options (hide specific fields for certain roles)

**Acceptance Criteria:**

- [x] All standard reports generate within 5 seconds for 10,000 invoices
- [x] Custom report builder allows any combination of fields and filters
- [x] Saved report templates can be shared across users
- [x] Scheduled reports delivered on time via email
- [x] Dashboard loads within 2 seconds and updates in real-time
- [x] Charts are interactive with drill-down capability
- [x] All reports exportable to PDF, Excel, CSV with proper formatting
- [x] Report access controlled by user permissions

**Dependencies:**

- Invoice data (all types)
- VAT return data
- Submission tracking data
- User authentication and authorization
- Email service
- Chart library (Recharts)
- PDF generation library
- Excel export library

**Business Rules:**

- Reports only show data user has permission to view
- Financial reports include disclaimer about data accuracy
- Scheduled reports run during off-peak hours
- Report data reflects system state at time of generation
- Custom reports limited to reasonable data ranges (prevent system overload)

**Validation Rules:**

- Date ranges must be logical (start before end)
- Report parameters validated before generation
- Large reports (>10,000 rows) show warning and require confirmation
- Scheduled reports must have valid email addresses

**Error Handling:**

- No data for period: Display empty state with helpful message
- Report generation timeout: Show progress, allow cancellation
- Email delivery failure: Retry mechanism, notification to user
- Invalid parameters: Clear error message, highlight invalid fields
- Large dataset: Show pagination, export option instead of display

---

### 6.7 Dashboard & Notifications

**Priority:** P0 (Critical)

**User Story:** As a user, I want a clear dashboard and timely notifications so that I stay on top of deadlines and important tasks.

**Requirements:**

**6.7.1 Company Dashboard**

**Layout:**

- Header section: Company name, logo, current period
- Quick actions bar (prominent buttons)
- KPI cards row (4-6 cards)
- Charts section (2-3 charts)
- Activity feed sidebar
- Upcoming tasks/deadlines section

**Quick Actions:**

- Buttons for common tasks:
  - Upload Data (Bulk) - CSV/XLSX
  - Download Templates
  - Generate Schedules
  - Generate VAT Return
  - Request Supporting Documents
  - View Imported Transactions
  - View Reports

**KPI Cards:**
Each card shows:

- Main metric (large number)
- Label
- Trend indicator (↑ ↓ with percentage change)
- Comparison period label ("vs last month")
- Color coding (green=good, red=needs attention)

Cards:

1. **Current Period Sales:**
   - Total sales value (excl VAT)
   - Comparison with same period last year
2. **Current Period Purchases:**

   - Total purchase value (excl VAT)
   - Comparison with same period last year

3. **VAT Payable/Refundable:**

   - Net VAT amount
   - Status (Payable/Refundable)
   - Comparison with previous period

4. **Compliance Score:**

   - Percentage (0-100%)
   - Based on completeness of data entry and documentation

5. **Days Until Deadline:**

   - Countdown to submission deadline
   - Color: Green (>10 days), Yellow (5-10 days), Red (<5 days)

6. **Total Invoices:**
   - Count of invoices for current period
   - Breakdown: Sales / Purchases

**Charts:**

1. **Sales & Purchases Trend (Last 6 Months):**

   - Line chart with two lines
   - X-axis: Months
   - Y-axis: Amount (LKR)
   - Hover tooltips with exact values

2. **VAT Breakdown by Rate:**

   - Donut chart
   - Segments: 18%, 0%, Exempt
   - Center shows total VAT amount
   - Click segment to see transactions

3. **Top 5 Customers/Suppliers:**
   - Horizontal bar chart
   - Toggle between customers and suppliers
   - Shows transaction value
   - Click to view details

**Activity Feed:**

- Real-time log of recent activities
- Icons for activity types
- Entries:
  - "Invoice INV-2025-001 added by [User]"
  - "Schedule 01 generated for July 2025"
  - "VAT Return submitted for June 2025"
  - "Payment received for Export Invoice EXP-2025-101"
- Time stamps (relative: "5 minutes ago", "2 hours ago")
- "View All Activity" link

**Upcoming Tasks/Deadlines:**

- Card showing next 5 tasks/deadlines
- Each entry:
  - Task description
  - Due date
  - Priority (High/Medium/Low)
  - Status (Pending/In Progress/Complete)
  - Quick action button
- Examples:
  - "Submit July VAT Return by Aug 20"
  - "Upload purchase invoices for week 3"
  - "Export payment due for INV-EXP-101 (45 days left)"

**Mobile Responsive:**

- Cards stack vertically on mobile
- Charts adapt to smaller screens
- Quick actions in hamburger menu
- Swipeable sections

**6.7.2 Email Notifications**

**Notification Types:**

1. **Submission Deadline Reminders:**

   - 15 days before deadline
   - 7 days before deadline
   - 3 days before deadline
   - 1 day before deadline
   - On deadline day
   - Content: Period, deadline date, current status, action link

2. **Export Payment Deadlines:**

   - 60 days before 6-month deadline
   - 30 days before deadline
   - 15 days before deadline
   - 7 days before deadline
   - On deadline
   - Content: Invoice number, amount, customer, days remaining, action link

3. **Missing Documentation Alerts:**

   - Daily digest of invoices with missing documents
   - Triggered when invoice saved without required documents
   - Content: List of invoices, missing document types, upload link

4. **VAT Return Status Updates:**

   - When return generated successfully
   - When return submitted to IRD
   - When IRD acknowledgment received
   - When payment completed
   - Content: Period, status, details, next steps

5. **System Notifications:**

   - Account created/verified
   - Password changed
   - New user added to company
   - Permission changes
   - System maintenance scheduled

6. **Weekly Summary:**
   - Every Monday morning
   - Summary of previous week's activities
   - Upcoming tasks for current week
   - Key metrics snapshot

**Email Template Design:**

- Company logo header
- Clear subject lines
- Prominent call-to-action button
- Summary of details
- Link to view full details in system
- Footer with contact support link
- Unsubscribe option (for non-critical emails)

**Email Preferences:**

- User can customize notification preferences
- Toggle each notification type on/off
- Choose frequency (immediate, daily digest, weekly digest)
- Set quiet hours (no emails during specified times)
- Email address verification

**6.7.3 In-App Notifications**

**Notification Center:**

- Bell icon in header with unread count badge
- Dropdown panel showing recent notifications
- Categories: All, Unread, Deadlines, Alerts, System
- Mark as read/unread
- Delete notification
- "Clear All" option
- "View All Notifications" link to full page

**Notification Display:**

- Icon indicating type (deadline, alert, info, success, error)
- Title and brief description
- Timestamp (relative)
- Color coding by urgency
- Click to view details or take action
- Expandable for longer content

**Real-Time Updates:**

- WebSocket connection for instant notifications
- Browser notification permission request
- Desktop notifications (if permitted)
- Sound alerts (optional, user-configurable)
- Badge updates automatically

**Notification Types:**

1. **Success Messages:**

   - "Import completed successfully"
   - "Record added: INV-2025-001"
   - "VAT Return generated successfully"
   - Green checkmark icon

2. **Error Messages:**

   - "Failed to upload bulk data file"
   - "Schedule generation failed - missing data"
   - Red X icon, with "View Details" link

3. **Warning Messages:**

   - "Supplier TIN not validated for record PUR-001"
   - "Export payment deadline approaching (10 days left)"
   - Yellow alert icon

4. **Info Messages:**

   - "New feature available: Schedule amendments"
   - "System maintenance scheduled for Sunday 2 AM"
   - Blue info icon

5. **Action Required:**
   - "Please review and approve VAT return for July"
   - "Your attention needed: 5 invoices missing documents"
   - Orange alert icon with action button

**Notification Persistence:**

- Notifications stored in database
- 90-day retention
- Sync across devices
- Mark as read syncs across sessions

**6.7.4 Alerts & Warnings System**

**Automatic Alerts:**

- **Data Quality Alerts:**

  - Duplicate invoice numbers detected
  - Invalid TIN formats
  - Missing required fields
  - Inconsistent calculations

- **Compliance Alerts:**

  - Deadline missed
  - Incomplete submissions
  - Missing documentation
  - Export payment overdue

- **Financial Alerts:**

  - Unusual spike in VAT payable (>50% increase)
  - Negative VAT (refund) position
  - High-value transactions (>LKR 1,000,000)
  - Suspicious patterns (potential errors)

- **System Alerts:**
  - Backup failure
  - Integration errors
  - Storage capacity warning
  - Performance degradation

**Alert Configuration:**

- Admin can set threshold values
- Enable/disable specific alerts
- Set alert recipients (users, roles, external emails)
- Define alert severity (Critical, High, Medium, Low)
- Set alert frequency (immediate, hourly, daily)

**Alert Dashboard:**

- Dedicated page for all active alerts
- Filter by type, severity, date
- Acknowledge/dismiss alerts
- Assign alerts to users for resolution
- Alert resolution tracking
- Alert history and analytics

**Acceptance Criteria:**

- [x] Dashboard loads within 2 seconds
- [x] KPI cards update in real-time as data changes
- [x] Charts are interactive and responsive
- [x] Email notifications delivered within 5 minutes of trigger
- [x] In-app notifications appear instantly via WebSocket
- [x] User can customize notification preferences
- [x] Notification center shows unread count accurately
- [x] Desktop notifications work (if browser permission granted)
- [x] Mobile dashboard fully functional and responsive
- [x] All alerts logged and trackable

**Dependencies:**

- Email service (SMTP)
- SMS service (for 2FA and critical alerts)
- WebSocket server (for real-time notifications)
- Chart library
- Push notification service (for mobile)
- Database for notification storage

**Business Rules:**

- Critical notifications cannot be disabled
- Deadline notifications sent regardless of user preferences
- System alerts sent to admins only
- Notification frequency limits to prevent spam (max 10 per hour per type)
- Email digest combines multiple notifications

**Validation Rules:**

- Email addresses validated before sending
- Phone numbers validated for SMS
- Notification content sanitized (no script injection)
- User preferences validated before save

**Error Handling:**

- Email delivery failure: Retry 3 times, log error, notify admin
- SMS delivery failure: Fall back to email
- WebSocket disconnect: Show offline indicator, reconnect automatically
- Dashboard load failure: Show error message, retry button
- Chart render failure: Show placeholder, log error

---

### 6.8 Document Repository

**Priority:** P1 (High)

**User Story:** As a company accountant, I want a centralized document repository so that I can easily store, organize, and retrieve all VAT-related documents for audits and compliance.

**Requirements:**

**6.8.1 Document Library**

**Folder Structure:**

- Pre-defined folders (cannot delete):

  ```
  Documents/
  ├── Company_Registration/
  ├── VAT_Registration/
  ├── Power_of_Attorney/
  ├── Sales_Invoices/
  │   ├── 2025/
  │   │   ├── January/
  │   │   ├── February/
  │   │   └── ...
  │   └── 2024/
  ├── Purchase_Invoices/
  │   ├── 2025/
  │   └── 2024/
  ├── Import_Documents/
  │   ├── Customs_Declarations/
  │   └── Payment_Receipts/
  ├── Export_Documents/
  │   ├── Shipping_Documents/
  │   ├── Bank_Receipts/
  │   └── EDB_Certificates/
  ├── VAT_Returns/
  │   ├── 2025/
  │   └── 2024/
  ├── IRD_Correspondence/
  ├── Audit_Documents/
  └── Miscellaneous/
  ```

- Users can create custom subfolders
- Automatic folder creation based on date (e.g., new month folder)
- Smart folders (virtual folders based on filters):
  - "Expiring Soon" (documents with expiry dates)
  - "Recently Added" (last 30 days)
  - "Large Files" (>5MB)
  - "Shared With Me"

**6.8.2 Document Upload & Management**

**Upload Methods:**

- Drag-and-drop to folder
- Browse and select files
- Bulk upload (multiple files)
- Upload from import screen (auto-file in correct folder)
- Email integration (forward documents to special email address)

**File Support:**

- Document types: PDF, DOC, DOCX, XLS, XLSX
- Image types: JPG, PNG, TIFF
- Max file size: 25MB per file
- Total storage: Per company plan (e.g., 10GB, 50GB, 100GB)

**Document Metadata:**

- Filename
- File type and size
- Upload date and time
- Uploaded by (user)
- Folder location
- Tags (user-defined)
- Description
- Related entity (invoice number, customer, supplier, period)
- Expiry date (optional, for certificates)
- Version number (if versioned)
- Access permissions

**Document Operations:**

- View/Preview (inline PDF viewer, image viewer)
- Download (original file)
- Rename
- Move to different folder
- Copy to different folder
- Delete (with confirmation)
- Share (generate shareable link with expiry)
- Print
- Email (send as attachment)

**6.8.3 Search & Filter**

**Search Functionality:**

- Global search across all documents
- Search by:
  - Filename
  - Content (OCR text extraction for searchable PDFs and images)
  - Tags
  - Description
  - Metadata fields
  - Date range
- Auto-complete suggestions
- Search history
- Save searches

**Advanced Filters:**

- File type
- Upload date range
- Uploaded by user
- Folder location
- Tag
- Size range
- Related entity (invoice, customer, supplier)
- Expiry date range
- Has/doesn't have expiry date

**Filter Combinations:**

- Multiple filters with AND logic
- Save filter combinations as "Smart Folders"
- Quick filter buttons (Today, This Week, This Month, This Year)

**6.8.4 Version Control**

**Versioning:**

- Automatic versioning when file updated (replace)
- Version history:
  - Version number (v1, v2, v3...)
  - Date/time of version
  - User who created version
  - Change notes (optional)
  - File size
- View any previous version
- Download any version
- Restore previous version (becomes new current version)
- Compare versions (for supported formats)
- Delete old versions (keeps current)

**Version Notifications:**

- Notify users when document they're watching is updated
- Email notification option
- In-app notification

**6.8.5 Document Sharing & Permissions**

**Internal Sharing:**

- Share with specific users (email address)
- Share with roles (all accountants, all admins)
- Permission levels:
  - View only
  - Download
  - Edit (upload new version)
  - Delete
  - Manage (change permissions)
- Expiry date for shared access
- Notification to recipients

**External Sharing:**

- Generate shareable link
- Link options:
  - Password protection
  - Expiry date (1 day, 7 days, 30 days, custom)
  - Download limit (number of times)
  - View only or allow download
- Revoke link anytime
- Track link usage (views, downloads, IP addresses)

**Access Control:**

- Folder-level permissions (inherited by contents)
- Document-level permissions (override folder permissions)
- Role-based defaults (admins see everything, users see their company only)
- Audit trail of all access (who viewed/downloaded when)

**6.8.6 Document Organization Features**

**Tags:**

- User-defined tags
- Suggested tags based on content
- Tag cloud view
- Filter by tag
- Bulk tagging (select multiple documents)
- Tag colors

**Favorites/Bookmarks:**

- Star important documents
- "Favorites" view
- Quick access sidebar

**Recent Documents:**

- Last 20 accessed documents
- Quick access list

**Document Templates:**

- Store template documents
- Quick create from template
- Template library (Power of Attorney, Letter to IRD, etc.)

**6.8.7 Storage Management**

**Storage Quota:**

- Display current usage vs total quota
- Visual progress bar
- Breakdown by file type
- Breakdown by folder
- Largest files list
- Oldest files list

**Storage Optimization:**

- Compress images automatically (optional)
- Archive old documents (move to cold storage)
- Bulk delete option (with filters)
- Permanent delete (after 30-day trash period)

**Trash/Recycle Bin:**

- Deleted documents move to trash
- 30-day retention in trash
- Restore from trash
- Permanent delete from trash
- Auto-purge after 30 days
- Empty trash manually

**6.8.8 Document Security**

**Encryption:**

- All documents encrypted at rest (AES-256)
- Encrypted in transit (SSL/TLS)
- Encryption keys managed securely

**Access Logging:**

- Log all document access
- Log all operations (upload, download, view, edit, delete, share)
- Timestamps and user IDs
- IP addresses
- User agent (browser/device)
- Retention: 7 years

**Document Watermarking:**

- Optional watermark on PDFs when downloaded
- Watermark includes: username, date/time, "Confidential"
- Prevents unauthorized sharing
- Admin configurable

**Virus Scanning:**

- All uploads scanned for malware
- Quarantine infected files
- Notify user and admin
- Delete after confirmation

**Acceptance Criteria:**

- [x] Documents organized in logical folder structure
- [x] Upload completes within 10 seconds for 5MB file
- [x] Search returns results within 1 second
- [x] Version history maintained automatically
- [x] Shareable links work for external recipients
- [x] Storage quota displayed accurately and updates in real-time
- [x] Deleted documents can be restored within 30 days
- [x] All document access logged in audit trail
- [x] Preview works for PDF and images inline
- [x] Bulk operations (upload, delete, move) complete efficiently

**Dependencies:**

- Cloud storage service (AWS S3, Google Cloud Storage)
- PDF viewer library
- Image viewer library
- OCR service (for text extraction)
- Virus scanning service
- Encryption library
- Search indexing service (Elasticsearch)

**Business Rules:**

- 7-year document retention per IRD regulations
- Some documents mandatory (cannot delete): VAT registration, company registration
- Storage quota based on subscription plan
- Versioning mandatory for critical documents (VAT returns, registrations)
- External shares expire automatically after set period
- Admin can override any permission restrictions

**Validation Rules:**

- File size within limits
- File type allowed
- Storage quota not exceeded
- Valid email addresses for sharing
- Expiry dates in future
- Filename doesn't contain special characters (/ \ : \* ? " < > |)

**Error Handling:**

- Upload failure: Retry mechanism, show progress
- Storage quota exceeded: Clear error message, option to upgrade plan
- Virus detected: Quarantine, notify user, cannot download
- File not found: Helpful message, suggest search
- Permission denied: Clear explanation of required permission
- Version restore failure: Error message, contact support

---

### 6.9 Help & Support

**Priority:** P2 (Medium)

**User Story:** As a user, I want access to help resources and support so that I can solve problems quickly and use the system effectively.

**Requirements:**

**6.9.1 Knowledge Base**

**Content Organization:**

- Categories:
  - Getting Started
  - Bulk Data Import & Mapping
  - VAT Calculations
  - Schedules & Returns
  - Exports & Refunds
  - Reports & Analytics
  - Document Management
  - Troubleshooting
  - FAQs
  - Video Tutorials
  - IRD Regulations

**Article Structure:**

- Title
- Summary/overview
- Step-by-step instructions with screenshots
- Video tutorial (where applicable)
- Related articles
- Was this helpful? (thumbs up/down)
- Search within article
- Print-friendly version
- Last updated date

**Content Types:**

- **How-To Guides:** Step-by-step instructions
- **FAQs:** Common questions and answers
- **Video Tutorials:** Screen recordings with voiceover
- **Quick Tips:** Short tips and tricks
- **Best Practices:** Recommended approaches
- **Regulatory Updates:** IRD regulation changes
- **Glossary:** VAT and system terminology

**Search Functionality:**

- Full-text search across all articles
- Auto-suggest as typing
- Filter by category
- Sort by relevance, date, popularity
- Highlight search terms in results
- "Did you mean?" for typos

**User Engagement:**

- Rate articles (5 stars)
- Comment on articles
- Bookmark favorite articles
- Share articles (copy link)
- View count displayed
- Most popular articles section
- Recently updated articles

**Contextual Help:**

- Help icon (?) next to complex features
- Hover for quick tooltip
- Click for detailed article
- Context-aware suggestions based on current page
- Inline help text in forms

**6.9.2 Support Tickets**

**Ticket Submission:**

- Support form with fields:
  - Subject/Title
  - Category (Technical Issue/Billing/Feature Request/General Inquiry)
  - Priority (Low/Medium/High/Urgent)
  - Description (rich text editor)
  - Attachments (screenshots, files, max 10MB)
  - Affected feature/page (auto-detected or manual selection)
- Email confirmation on submission
- Ticket reference number generated
- Estimated response time displayed

**Ticket Tracking:**

- View all tickets (list view)
- Ticket details page:
  - Ticket number
  - Status (Open/In Progress/Waiting for Customer/Resolved/Closed)
  - Priority
  - Category
  - Created date
  - Last updated date
  - Assigned support agent
  - Full conversation thread
  - Attachments
- Filter tickets by status, priority, category, date
- Search tickets

**Communication:**

- Reply to tickets within system
- Email notifications on status changes and responses
- Real-time updates (if both parties online)
- Attach additional files to conversation
- Mark ticket as resolved
- Reopen closed tickets if issue persists

**Customer Satisfaction:**

- Rate support experience after resolution (1-5 stars)
- Optional feedback comment
- Agent performance tracking
- Support quality metrics

**6.9.3 Live Chat (Future Enhancement)**

- Chat widget in bottom-right corner
- Online/offline status indicator
- Typical response time displayed
- Pre-chat form (name, email, issue category)
- Chat transcript saved
- File sharing in chat
- Canned responses for common questions
- Chat routing to available agents
- Chat history accessible in support tickets

**6.9.4 Onboarding & Guided Tours**

**New User Onboarding:**

- Welcome screen after first login
- Quick start guide (5-minute overview)
- Interactive tour of main features
- Step-by-step first bulk data upload & mapping
- First VAT return walkthrough
- Skip or complete later option
- Progress tracking (% complete)

**Feature Tours:**

- Triggered on first use of new features
- Spotlight highlights with explanations
- Step-through with "Next" buttons
- Can dismiss or restart anytime
- "Don't show again" option
- Available in help menu (replay tours)

**Tooltips & Hints:**

- First-time use hints
- Contextual tips based on user behavior
- "Did you know?" random tips
- Keyboard shortcut hints
- Progressive disclosure (show more advanced features as user progresses)

**6.9.5 Community Forum (Future Enhancement)**

- Discussion boards
- Categories matching knowledge base
- User questions and answers
- Vote up/down answers
- Mark best answer
- Follow threads
- User reputation/badges
- Moderation tools
- Search forum

**6.9.6 System Status Page**

- Real-time system status
- Components:
  - Web Application
  - API Services
  - Database
  - Document Storage
  - Email Service
  - Notification Service
- Status indicators: Operational/Degraded Performance/Partial Outage/Major Outage
- Incident history
- Scheduled maintenance notifications
- Subscribe to status updates
- Response time metrics

**6.9.7 Feedback & Feature Requests**

**Feedback Form:**

- What do you like?
- What could be improved?
- Feature suggestions
- Rating (1-10: How likely to recommend?)
- Anonymous option
- Attachments (screenshots)

**Feature Request Board:**

- Submit feature ideas
- Vote on others' ideas
- Comment and discuss
- Status tracking:
  - Under Review
  - Planned
  - In Development
  - Released
  - Declined (with explanation)
- Notification when status changes

**Product Roadmap:**

- Public roadmap (if company chooses)
- Upcoming features
- Timeline (quarters)
- Feature details
- User voting influence

**Acceptance Criteria:**

- [x] Knowledge base has minimum 50 articles at launch
- [x] Search returns relevant articles within 1 second
- [x] Video tutorials embedded and playable
- [x] Support tickets submitted successfully with confirmation
- [x] Users can track ticket status in real-time
- [x] Email notifications sent for all ticket updates
- [x] Contextual help appears on complex features
- [x] Onboarding tour completes without errors
- [x] System status page updates in real-time
- [x] Feedback form submission successful with confirmation

**Dependencies:**

- Content management system for knowledge base
- Video hosting (YouTube, Vimeo, or self-hosted)
- Ticket management system
- Email service
- Real-time communication (WebSocket for chat)
- Search indexing service
- Analytics for help content performance

**Business Rules:**

- All users have access to knowledge base
- Support tickets only for subscribed companies
- Response times based on ticket priority and plan level
- Critical issues escalated automatically
- Knowledge base continuously updated based on common support queries
- Video tutorials professionally produced with voiceover

**Validation Rules:**

- Support ticket subject required (min 10 characters)
- Description required (min 50 characters)
- Valid email for ticket notifications
- Attachments scanned for viruses
- File size limits enforced

**Error Handling:**

- Ticket submission failure: Save draft, allow retry
- Search no results: Suggest alternative terms, show related articles
- Video playback failure: Fallback to text instructions
- Chat connection failure: Fall back to ticket submission
- Attachment upload failure: Retry mechanism, clear error message

---

## 6.10 Client Management (CRM)

**Priority:** P0 (Critical) - For Service Provider

**User Story:** As a service provider admin, I want to manage all my client companies from a centralized dashboard so that I can efficiently handle multiple submissions and track their status.

**Requirements:**

**6.10.1 Client Dashboard (Admin)**

**Overview Screen:**

- Total clients count (with growth indicator)
- Active clients (submitted this month)
- Inactive clients (no activity >3 months)
- New clients this month
- Total revenue (MTD, YTD)
- Outstanding payments count and amount

**Client List View:**

- Data table with columns:
  - Client name
  - TIN
  - Industry
  - Taxable period (Monthly/Quarterly)
  - Current period status
  - Next deadline
  - Assigned team member
  - Service plan
  - Account status (Active/Inactive/Suspended)
  - Actions (View/Edit/Submissions/Billing)
- Search: By name, TIN, industry
- Filters: Status, taxable period, assigned member, plan, industry
- Sorting: By any column
- Bulk actions: Send email, export data, assign team member
- Quick view (hover card with key details)
- Color coding by deadline urgency

**Grid View (Alternative):**

- Client cards in grid layout
- Each card shows:
  - Client logo (if uploaded)
  - Client name
  - Current period status (color badge)
  - Days to deadline
  - Key metrics (invoices count, VAT amount)
  - Quick actions menu
- Filter and search same as list view

**Client Map View (Future):**

- Geographic map showing client locations
- Clustered pins
- Click to see client details
- Filter by region

**6.10.2 Client Onboarding Workflow**

**Stage 1: Initial Contact**

- Create client record
- Basic information form:
  - Company name
  - Contact person
  - Email
  - Phone
  - Source (Referral/Website/Cold Call/Other)
- Status: Lead

**Stage 2: Proposal & Agreement**

- Service plan selection
- Pricing proposal generation
- Send proposal via email
- Track proposal status (Sent/Viewed/Accepted/Rejected)
- Upload signed agreement
- Status: Proposal Sent

**Stage 3: Documentation Collection**

- Checklist of required documents:
  - [ ] Company registration certificate
  - [ ] VAT registration certificate
  - [ ] Recent VAT returns (if available)
  - [ ] Power of Attorney
  - [ ] Bank account details
  - [ ] Key contact list
- Upload documents
- Document verification
- Status: Pending Documents

**Stage 4: System Setup**

- Create client portal account
- Send welcome email with credentials
- Set taxable period (Monthly/Quarterly)
- Configure preferences
- Assign team member
- Status: Setup In Progress

**Stage 5: Data Migration**

- Import historical invoices (if available)
- Upload previous VAT returns
- Set up customer/supplier masters
- Validate data
- Status: Data Migration

**Stage 6: Training & Handover**

- Schedule training session
- Provide user guide
- Conduct system walkthrough
- Answer questions
- Status: Training

**Stage 7: Go-Live**

- Activate client account
- Monitor first submission closely
- Provide extra support
- Status: Active

**Onboarding Dashboard:**

- Kanban board showing clients by stage
- Drag-and-drop to move stages
- Days in current stage counter
- Overdue onboarding highlighted
- Checklist progress per client
- Bulk actions by stage

**Automated Workflows:**

- Email templates for each stage
- Task creation on stage change
- Deadline setting automatic
- Reminder emails
- Escalation rules (if stuck in stage >X days)

**6.10.3 Client Profile Management**

**Company Information Tab:**

- All company details (view and edit)
- Logo upload
- Website
- Industry
- Employee count
- Annual turnover
- Business description
- Office locations (multiple)

**VAT Details Tab:**

- TIN
- VAT registration date
- Taxable period
- IRD office jurisdiction
- Special conditions (if any)
- Exemptions or special schemes
- Registration certificates (view/download)

**Contacts Tab:**

- Primary contact (main user)
- Additional contacts (finance team, directors)
- Each contact:
  - Name
  - Designation
  - Email
  - Phone
  - Role (Decision Maker/Invoice Provider/Reviewer/Other)
  - Preferred communication method
- Add/edit/delete contacts

**Service Plan Tab:**

- Current plan details
- Plan features
- Pricing (monthly fee, per-submission fee, extras)
- Contract start date
- Contract end date
- Renewal status
- Plan history (upgrades/downgrades)
- Change plan button

**Documents Tab:**

- All client documents in organized folders
- Same features as client portal document repository
- Admin can upload documents on behalf of client
- Version control
- Document expiry tracking

**Activity Log Tab:**

- Complete timeline of all activities
- Filterable by activity type
- Date range filter
- User filter (who performed action)
- Export to Excel
- Activity types:
  - Invoice added/edited
  - Submission completed
  - Payment received
  - Document uploaded
  - User login
  - Communication sent
  - Status changed
  - System actions

**Notes Tab:**

- Internal notes about client
- Rich text editor
- Attach files
- Tag notes (Important/Follow-up/Issue/General)
- Search notes
- Note history (who added when)
- Pin important notes to top

**Billing Tab:**

- Current balance
- Invoice history
- Payment history
- Outstanding invoices
- Generate new invoice
- Record payment
- Send payment reminder
- Credit notes
- Billing analytics (revenue over time)

**Team Tab:**

- Assigned team members
- Primary contact person
- Role assignments (Account Manager/Submission Specialist/Reviewer)
- Workload distribution
- Performance metrics per team member

**6.10.4 Client Communication**

**Communication Log:**

- Chronological list of all communications
- Types:
  - Email
  - Phone call
  - Meeting
  - WhatsApp/SMS
  - In-person visit
  - System message
- Each entry:
  - Date/time
  - Type
  - From/To
  - Subject
  - Content/Summary
  - Attachments
  - Follow-up required (checkbox)
  - Follow-up date
  - Status (Pending/Completed)
- Add new communication entry
- Link communication to submission or invoice
- Filter by type, date, team member
- Search communication content

**Email Integration:**

- Connect email account (SMTP/IMAP)
- Auto-log emails to/from client
- Email client directly from system
- Use email templates
- Track email opens and clicks
- Email thread view
- Attach documents from repository

**Email Templates:**

- Pre-built templates for common scenarios:
  - Welcome email
  - Document request
  - Submission reminder
  - Submission completed notification
  - Payment reminder
  - Supporting documents attached
  - Status update
  - Meeting confirmation
  - Year-end summary
- Template variables (merge fields):
  - {ClientName}
  - {ContactName}
  - {Period}
  - {Deadline}
  - {Amount}
  - {InvoiceNumber}
  - {RecordIdentifier} # generic reference to an uploaded record's identifier
  - etc.
- Rich text editor
- Attach documents
- Schedule send
- Save as draft

**Bulk Communication:**

- Select multiple clients
- Send same message to all (with personalization via merge fields)
- Track delivery status per client
- Unsubscribe option
- Delivery reports

**Communication Preferences:**

- Per-client preferences:
  - Preferred method (Email/Phone/WhatsApp)
  - Frequency (Daily updates/Weekly digest/On request only)
  - Best time to contact
  - Do not disturb hours
- Respect preferences in automated communications

**Acceptance Criteria:**

- [x] Admin dashboard loads within 2 seconds with 100+ clients
- [x] Client list searchable and filterable efficiently
- [x] Onboarding workflow stages clearly defined and trackable
- [x] Client profile comprehensive with all necessary information
- [x] Activity log captures all relevant actions automatically
- [x] Communication log integrates with email system
- [x] Email templates customizable and support merge fields
- [x] Bulk actions work for selected clients
- [x] All client data exportable to Excel

**Dependencies:**

- Email service (SMTP/IMAP)
- Document management system
- Task management system
- Billing/invoicing system
- Calendar integration
- SMS/WhatsApp API (optional)

**Business Rules:**

- One service provider can manage unlimited clients
- Each client has one primary account manager
- Client data isolated (one client cannot see another's data)
- Admin has full access to all client data
- Team members access based on assigned clients and roles
- Onboarding must complete all stages before marking active

**Validation Rules:**

- TIN unique per client
- Email addresses valid format
- Required fields in onboarding cannot be skipped
- Power of Attorney required before accessing client data
- Service agreement required before activation

**Error Handling:**

- Client creation failure: Show validation errors, preserve form data
- Email send failure: Retry mechanism, notify admin
- Document upload failure: Retry, show error
- Bulk action failure: Show which clients succeeded/failed
- Data import errors: Validation report with specific issues

---

## 6.11 Submission Management (CRM)

**Priority:** P0 (Critical) - For Service Provider

**User Story:** As a service provider admin, I want to track the complete submission workflow for all clients so that I never miss a deadline and can monitor team performance.

**Requirements:**

**6.11.1 Submission Workflow Tracking (8 Stages)**

**Workflow Stages:**

1. **Data Collection**

   - Status: Waiting for client to provide invoices and documents
   - Tasks:
     - [ ] Request invoices from client
     - [ ] Follow up if not received
     - [ ] Validate data completeness
   - SLA: 5 days before deadline
   - Actions: Send reminder, mark complete

2. **Data Entry & Validation**

   - Status: Team member entering data into system
   - Tasks:
     - [ ] Enter all sales invoices
     - [ ] Enter all purchase invoices
     - [ ] Enter import invoices (if any)
     - [ ] Attach supporting documents
     - [ ] Validate calculations
   - SLA: 4 days before deadline
   - Actions: Assign to team member, mark complete

3. **Document Preparation**

   - Status: Generating schedules and VAT return
   - Tasks:
     - [ ] Generate all schedules
     - [ ] Generate VAT return form
     - [ ] Prepare supporting documents package
     - [ ] Quality check all documents
   - SLA: 3 days before deadline
   - Actions: Generate documents, mark complete

4. **Internal Review**

   - Status: Senior reviewer checking for accuracy
   - Tasks:
     - [ ] Review calculations
     - [ ] Verify schedules match return
     - [ ] Check all documents present
     - [ ] Sign-off approval
   - SLA: 2 days before deadline
   - Actions: Assign reviewer, approve/reject

5. **Client Approval**

   - Status: Waiting for client to review and approve
   - Tasks:
     - [ ] Send documents to client for review
     - [ ] Wait for client approval
     - [ ] Address client queries
   - SLA: 1 day before deadline
   - Actions: Send to client, mark approved

6. **IRD Submission**

   - Status: Filing return with IRD
   - Tasks:
     - [ ] Upload schedules to IRD e-Services
     - [ ] Submit VAT return form
     - [ ] Obtain IRD acknowledgment
     - [ ] Download submission receipt
   - SLA: On deadline day
   - Actions: Submit to IRD, upload acknowledgment

7. **Payment Processing**

   - Status: Arranging VAT payment (if payable)
   - Tasks:
     - [ ] Notify client of payment amount
     - [ ] Confirm payment made by client
     - [ ] Upload bank receipt
     - [ ] Verify payment with IRD
   - SLA: Within payment deadline
   - Actions: Record payment, upload receipt

8. **Filing & Closure**
   - Status: Archiving documents and closing period
   - Tasks:
     - [ ] File all documents in repository
     - [ ] Update client records
     - [ ] Generate invoice for service
     - [ ] Send completion report to client
     - [ ] Close submission
   - SLA: 3 days after payment
   - Actions: Archive, close

**Submission Record:**
Each submission has:

- Submission ID (auto-generated)
- Client reference
- Taxable period (YYYY-MM)
- Current stage (1-8)
- Stage status (On Track/At Risk/Overdue)
- Assigned team member
- Reviewer
- Start date
- Target completion date (deadline)
- Actual completion date
- Days in current stage
- Overall progress (%)
- Notes/comments
- Documents attached
- Checklist completion %

**Stage Transitions:**

- Manual move to next stage (with confirmation)
- Automatic stage progression (when all tasks complete)
- Cannot skip stages (must complete in order)
- Can move backward (if issues found)
- Stage change logged in audit trail
- Notifications sent on stage change

**6.11.2 Submission Calendar**

**Calendar Views:**

**Monthly View:**

- Calendar grid showing all days of month
- Each client's submission deadline marked on calendar
- Color coding:
  - Green: Completed
  - Blue: On track (stage appropriate for days remaining)
  - Yellow: At risk (behind schedule)
  - Red: Overdue
- Click date to see all submissions due that day
- Hover to see quick details
- Add/edit submission deadlines

**Weekly View:**

- Week at a glance
- Each day shows submissions in progress
- Grouped by stage
- Drag-and-drop to reschedule (if possible)

**List View:**

- All submissions in list format
- Sortable by deadline, client, stage, assigned member
- Filter by date range, stage, status
- Color-coded rows
- Quick actions column

**Timeline View:**

- Gantt-chart style
- Shows each submission as timeline bar
- Bars color-coded by status
- See all stages and durations
- Identify bottlenecks
- Resource allocation view

**Calendar Features:**

- Subscribe via iCal (sync to Outlook, Google Calendar)
- Export to PDF
- Print monthly view
- Set up recurring submissions (automatically create for next period)
- Deadline reminders (email, in-app, SMS)
- Team member workload view (see each member's assigned submissions)

**6.11.3 Bulk Operations**

**Bulk Actions:**

- Select multiple submissions (checkboxes)
- Actions available:
  - Assign to team member
  - Change stage
  - Send reminder email
  - Generate documents (if same stage)
  - Export data
  - Delete (drafts only)
  - Update deadline
  - Add tag

**Bulk Document Generation:**

- Select multiple clients
- Generate schedules for all
- Generate VAT returns for all
- Create submission packages for all
- Queue for processing
- Progress indicator
- Error handling (which succeeded/failed)
- Download all as ZIP

**Bulk Communication:**

- Send same update to multiple clients
- Use template with merge fields
- Preview before send
- Schedule send time
- Track delivery

**Mass Update:**

- Update field value for multiple submissions
- Example: Assign all submissions for July to Team Member A
- Validation before update
- Confirmation required
- Undo option (limited time)

**6.11.4 Submission Dashboard & Analytics**

**Dashboard Widgets:**

1. **Submissions by Stage (Funnel Chart)**

   - Visual representation of all submissions across 8 stages
   - Click stage to see list of submissions
   - Identify bottlenecks

2. **Deadline Countdown**

   - Next 10 upcoming deadlines
   - Days remaining
   - Current stage
   - At-risk flag
   - Quick action button

3. **Team Workload**

   - Bar chart showing submissions per team member
   - Color-coded by stage
   - Balance workload button

4. **Overdue Submissions**

   - List of overdue submissions
   - Days overdue
   - Client impact
   - Escalation required flag
   - Assign action owner

5. **This Month's Progress**

   - Completed submissions count
   - In progress count
   - Not started count
   - Completion rate (%)
   - Comparison with last month

6. **Client Submission Status Map**
   - Heat map showing all clients
   - Green: On track
   - Yellow: Needs attention
   - Red: Critical
   - Click to view details

**Analytics Reports:**

**Submission Performance Report:**

- Average time per stage
- Total time per submission
- Comparison by period
- Trend analysis
- Identify delays
- Team performance comparison

**Client Compliance Report:**

- Clients with on-time submissions (%)
- Clients with late submissions
- Clients not yet submitted
- Historical compliance rate per client
- Risk scoring

**Team Performance Report:**

- Submissions completed per team member
- Average turnaround time
- Error rate (rejections, corrections)
- Client satisfaction scores
- Workload balance
- Productivity trends

**Deadline Analysis:**

- Submissions due this week/month
- Success rate meeting deadlines
- Average days to deadline when started
- Late submission reasons
- Improvement opportunities

**Financial Report:**

- Revenue per client
- Revenue per submission
- Outstanding invoices
- Payment collection rate
- Profitability analysis

**6.11.5 Task Escalation & Alerts**

**Automatic Alerts:**

- Submission approaching deadline (not progressing)
- Submission stuck in stage > X days
- Client not responding to requests
- Documents missing
- Review not completed
- IRD submission failed
- Payment not received

**Escalation Rules:**

- If stage 1 not complete 5 days before deadline → Alert account manager
- If stage 4 not complete 2 days before deadline → Alert senior manager
- If submission overdue → Alert admin + client
- Customizable escalation rules per client or plan

**Alert Recipients:**

- Assigned team member
- Account manager
- Senior reviewer
- Admin
- Client (optional, for specific alerts)

**Alert Management:**

- View all active alerts
- Acknowledge alert
- Assign for resolution
- Add notes
- Resolve/close alert
- Alert history

**Acceptance Criteria:**

- [x] Submission workflow has clear 8 stages with defined tasks
- [x] Stage transitions validated and logged
- [x] Submission calendar shows all deadlines clearly
- [x] Color coding accurately reflects status
- [x] Bulk operations work efficiently for 50+ submissions
- [x] Dashboard loads within 3 seconds
- [x] Analytics reports generated within 5 seconds
- [x] Automatic alerts sent on schedule
- [x] Escalation rules trigger correctly
- [x] Team members can only see assigned submissions (unless admin)

**Dependencies:**

- Task management system
- Calendar system
- Email service
- Notification system
- Reporting engine
- Document generation system

**Business Rules:**

- Submissions must progress through stages in order (no skipping)
- Cannot mark stage complete without completing all tasks
- Only reviewer can approve stage 4
- Cannot submit to IRD without client approval
- Payment stage required only if VAT payable (not for refunds)
- Recurring submissions auto-created for next period after closure

**Validation Rules:**

- Deadline date must be valid IRD deadline (20th of month)
- Cannot set deadline in past
- Stage completion requires all checklist items checked
- Client approval required before IRD submission
- IRD acknowledgment required before payment stage

**Error Handling:**

- Stage progression failure: Show validation errors, cannot proceed
- Bulk operation partial failure: Show success/failure report per submission
- Calendar sync failure: Retry, notify user
- Alert send failure: Queue for retry, log error
- Document generation failure: Show error, allow retry

---

## 6.12 Task & Team Management (CRM)

**Priority:** P1 (High) - For Service Provider

**User Story:** As a service provider admin, I want to assign tasks to my team and track their performance so that I can ensure timely completion and optimize workflows.

**Requirements:**

**6.12.1 Task Management**

**Task Creation:**

- Create task form:
  - Title (required, 100 chars max)
  - Description (rich text, attachments)
  - Task type (Client Work/Admin/Training/Other)
  - Related entity (Client, Submission, Invoice)
  - Assigned to (team member)
  - Priority (Low/Medium/High/Urgent)
  - Due date (date picker)
  - Estimated time (hours)
  - Tags (multi-select)
  - Checklist (sub-tasks)
  - Attachments
  - Recurrence (None/Daily/Weekly/Monthly)
- Quick create button (minimal form)
- Create from template
- Bulk task creation

**Task Views:**

**List View:**

- All tasks in table format
- Columns: Title, Assigned to, Client, Due date, Priority, Status, Progress
- Sort by any column
- Filter by status, priority, assigned to, client, due date, tags
- Search by title or description
- Group by: Status, Assigned to, Priority, Client
- Color-coded priority rows
- Overdue tasks highlighted in red

**Kanban Board:**

- Columns: To Do, In Progress, In Review, Complete
- Drag-and-drop cards between columns
- Card shows: Title, assignee avatar, due date, priority badge, checklist progress
- Swimlanes option (group by assignee or client)
- Filter cards by assignee, client, priority
- Quick edit on card click
- Card colors by priority

**Calendar View:**

- Tasks shown on calendar by due date
- Color-coded by priority or status
- Drag to reschedule
- Multi-day tasks shown as bars
- Filter by team member

**My Tasks View:**

- Personalized view for logged-in user
- Shows only tasks assigned to me
- Quick filters: Today, This Week, Overdue
- Focus mode (hide nav, minimize distractions)

**Task Details:**

- Full task information
- Edit button (if permitted)
- Activity timeline (comments, status changes, edits)
- Related entities (links to client, submission, invoices)
- Subtasks/checklist with progress bar
- Time tracking (start/stop timer, manual entry)
- Attachments section
- Task history (audit trail)

**Task Actions:**

- Mark complete
- Add comment
- Assign to different user
- Change priority
- Change due date
- Add to favorites
- Duplicate task
- Delete task
- Convert to recurring
- Set reminder

**Task Status:**

- To Do (newly created, not started)
- In Progress (actively working)
- In Review (waiting for review/approval)
- Blocked (cannot proceed, reason required)
- Complete (done)
- Archived (removed from active views)

**Task Notifications:**

- Task assigned to you
- Task due today
- Task overdue
- Task status changed
- Comment added to your task
- Task completed (for creator)
- Recurring task created

**Recurring Tasks:**

- Frequency: Daily, Weekly, Monthly, Quarterly, Yearly, Custom
- End condition: Never, After X occurrences, On specific date
- Auto-create next instance when current completed
- Modify recurring pattern
- Skip occurrence
- Stop recurrence

**6.12.2 Team Management**

**Team Structure:**

- Roles:
  - Admin (full access, system configuration)
  - Manager (manage team, view all clients, cannot change system settings)
  - Senior Specialist (handle submissions, review others' work)
  - Submission Specialist (handle assigned submissions)
  - Viewer (read-only access)

**Team Member List:**

- Name, email, role, status (Active/Inactive)
- Assigned clients count
- Active tasks count
- Performance rating
- Last login
- Actions: Edit, Deactivate, Delete

**Team Member Profile:**

- Personal information (name, email, phone, photo)
- Role and permissions
- Assigned clients list
- Skills/specializations
- Employment details (join date, department)
- Performance metrics
- Task history
- Availability calendar (leave, busy times)

**User Invitation:**

- Send email invitation to join
- Set role and initial permissions
- Assign initial clients
- Optional welcome message
- Track invitation status (Sent/Accepted/Expired)
- Resend invitation
- Revoke invitation

**Permission Management:**

- Role-based permissions (predefined)
- Custom permissions (override role defaults)
- Permissions include:
  - View clients (All/Assigned only)
  - Edit client data
  - Create/edit submissions
  - Approve submissions
  - Access financial data
  - Manage documents
  - Generate reports
  - Manage users
  - System configuration
  - Billing access
- Permission templates for quick setup

**6.12.3 Workload Management**

**Team Dashboard:**

- Overview of all team members
- Key metrics per member:
  - Active clients
  - Active tasks
  - Overdue tasks
  - Submissions in progress
  - This month's completions
  - Average completion time
- Workload balance indicator (red/yellow/green)
- Capacity planning (available hours vs assigned work)

**Workload Distribution:**

- Visual comparison of workload across team
- Bar chart: Tasks per member
- Pie chart: Submissions per member
- Identify overloaded and underutilized members
- Suggest reallocation

**Smart Assignment:**

- Auto-assign based on:
  - Current workload (balance)
  - Skills/expertise (if tagged)
  - Client relationships (continuity)
  - Availability (calendar integration)
  - Performance history
- Manual override option
- Assignment rules (configurable)

**Capacity Planning:**

- Set working hours per team member
- Mark leave/vacation (unavailable)
- Estimated hours per task
- Total allocated hours vs available hours
- Warning when over-allocated
- Visual timeline of capacity

**6.12.4 Performance Tracking**

**Individual Performance Metrics:**

- Tasks completed (period)
- Average completion time
- On-time completion rate (%)
- Overdue tasks count
- Client satisfaction scores (from feedback)
- Error/rework rate
- Productivity trend (over time)
- Utilization rate (% of available time working)

**Team Performance Dashboard:**

- Aggregate metrics for entire team
- Individual comparison (leaderboard style, optional)
- Team productivity trend
- Bottleneck identification
- Quality metrics (error rates, rework)
- Efficiency gains (month-over-month)

**Performance Reports:**

- Generate for specific period
- Individual or team report
- Export to PDF
- Use in performance reviews
- Automated monthly reports

**Goal Setting:**

- Set targets per team member:
  - Tasks per week
  - Submissions per month
  - Quality score target
  - Client satisfaction target
- Track progress toward goals
- Visual progress indicators
- Achievement badges/recognition

**6.12.5 Team Collaboration**

**Internal Messaging:**

- Direct messages between team members
- Group chats (per client, per project)
- Mentions (@username)
- Emoji reactions
- File sharing
- Message search
- Notification preferences

**Task Comments:**

- Comment thread on each task
- Mention colleagues
- Attach files
- Rich text formatting
- Email notifications on comments
- Mark comment as important

**Team Calendar:**

- Shared team calendar
- View all team members' tasks and deadlines
- Schedule meetings
- Mark availability
- Sync with personal calendars (Google, Outlook)
- Color-coded by person

**Knowledge Sharing:**

- Internal wiki/documentation
- Best practices repository
- Templates library
- Training materials
- Q&A forum
- Search functionality

**Acceptance Criteria:**

- [x] Tasks created and assigned successfully
- [x] Kanban board drag-and-drop works smoothly
- [x] Task notifications sent in real-time
- [x] Recurring tasks auto-create on schedule
- [x] Team member permissions enforced correctly
- [x] Workload dashboard displays accurate metrics
- [x] Smart assignment suggests appropriate team member
- [x] Performance metrics calculated accurately
- [x] Team collaboration features work seamlessly
- [x] All task actions logged in audit trail

**Dependencies:**

- User authentication and authorization
- Notification system
- Email service
- Calendar integration
- Real-time communication (WebSocket)
- Reporting engine

**Business Rules:**

- Tasks must have assignee before marking in progress
- Cannot delete tasks with time logged
- Overdue tasks auto-escalate after X days
- Recurring tasks inherit properties of original
- Permissions hierarchical (Admins can override Manager restrictions)
- Team members can only see clients assigned to them (unless Manager+)

**Validation Rules:**

- Due date cannot be in past
- Assignee must be active team member
- Estimated time must be positive number
- Priority field required
- Cannot complete task with incomplete checklist (warning, not blocker)

**Error Handling:**

- Task creation failure: Show validation errors, preserve form data
- Assignment failure (user inactive): Show error, suggest alternative
- Notification send failure: Queue for retry
- Kanban drag-drop failure: Revert to original column, show error
- Calendar sync failure: Show warning, allow manual retry

---

## 6.13 Client Billing & Revenue (CRM)

**Priority:** P1 (High) - For Service Provider

**User Story:** As a service provider admin, I want to manage client billing and track revenue so that I can ensure timely payments and financial visibility.

**Requirements:**

**6.13.1 Service Plans & Pricing**

**Plan Types:**

1. **Basic Plan**

   - Monthly fee: LKR 25,000
   - Up to 100 invoices/month
   - Monthly VAT returns
   - Email support
   - 10GB document storage

2. **Standard Plan**

   - Monthly fee: LKR 50,000
   - Up to 500 invoices/month
   - Monthly/Quarterly VAT returns
   - Priority email support
   - 50GB document storage
   - Custom reports

3. **Premium Plan**

   - Monthly fee: LKR 100,000
   - Unlimited invoices
   - All VAT services
   - Dedicated account manager
   - Phone + email support
   - 100GB document storage
   - Export/refund management
   - Custom integrations

4. **Enterprise Plan**
   - Custom pricing
   - Tailored to client needs
   - Multiple entities
   - Advanced features
   - On-site support options

**Additional Fees:**

- Per-submission fee: LKR 5,000 - 15,000 (based on complexity)
- Onboarding fee: LKR 50,000 (one-time)
- Training fee: LKR 10,000 per session
- Expedited submission: LKR 25,000 (rush fee)
- Amendment submission: LKR 10,000
- Refund application: LKR 20,000
- Document preparation (custom): LKR 5,000 per document
- Audit support: LKR 50,000 per day

**Custom Pricing:**

- Override plan pricing for specific clients
- Discounts (percentage or fixed amount)
- Promotional pricing (time-limited)
- Volume discounts (number of submissions)
- Contract negotiation history

**Plan Management:**

- View all plans with features and pricing
- Create custom plans
- Edit plan details
- Set active/inactive plans
- Plan comparison matrix
- Assign plan to client
- Change client plan (upgrade/downgrade)
- Plan change effective date
- Prorated billing for mid-month changes

**6.13.2 Invoicing & Payments**

**Billing Invoice Generation (Simplebooks billing only):**

- Auto-generate monthly invoices (on 1st of month)
- Manual billing invoice creation (for Simplebooks admin)
- Invoice includes:
  - Invoice number (auto-generated, sequential)
  - Invoice date
  - Due date (payment terms: Net 15, Net 30, etc.)
  - Client details (name, address, TIN)
  - Service provider details
  - Line items:
    - Monthly plan fee
    - Per-submission fees (with submission details)
    - Additional services
    - One-time charges
  - Subtotal
  - VAT (18% on service fees)
  - Total amount due

> Note: These billing features relate only to Simplebooks' service billing. The platform does not function as a client accounting or invoice management system.

- Payment instructions (bank details)
- Terms and conditions

**Invoice Templates:**

- Customizable invoice template
- Company logo and branding
- Multiple templates (by plan or client)
- PDF generation
- Email directly to client

**Invoice List:**

- All invoices in table
- Columns: Invoice #, Client, Date, Due date, Amount, Status, Actions
- Filter by: Status, Client, Date range, Amount range
- Search by invoice number or client
- Sort by any column
- Status: Draft, Sent, Viewed, Partially Paid, Paid, Overdue, Cancelled
- Color coding (green=paid, red=overdue)

**Invoice Actions:**

- View/Preview PDF
- Edit (draft only)
- Send via email
- Download PDF
- Duplicate
- Cancel (with reason)
- Record payment
- Send payment reminder
- Write off (bad debt)
- Apply credit note

**Payment Recording:**

- Payment date
- Payment amount (full or partial)
- Payment method (Bank Transfer/Cheque/Cash/Online)
- Payment reference (bank reference, cheque number)
- Bank account received into
- Upload payment receipt/proof
- Notes
- Auto-update invoice status
- Generate payment receipt for client

**Payment Tracking:**

- Total received (MTD, YTD)
- Outstanding amount (total across all clients)
- Aging report (0-30, 31-60, 61-90, 90+ days)
- Average days to payment
- Payment collection rate (%)
- Clients with overdue payments

**Payment Reminders:**

- Automatic reminders:
  - 3 days before due date
  - On due date
  - 7 days overdue
  - 14 days overdue
  - 30 days overdue
- Customizable reminder templates
- Escalation emails (to client management)
- Manual reminder send
- SMS reminders (optional)

**Credit Notes:**

- Issue credit note for corrections or refunds
- Linked to original invoice
- Credit note details:
  - Credit note number
  - Original invoice reference
  - Reason
  - Amount
  - Date issued
- Apply credit to future invoices or refund

**6.13.3 Revenue Analytics**

**Revenue Dashboard:**

- Key metrics with trend indicators:
  - Total revenue (MTD, QTD, YTD)
  - Outstanding receivables
  - Collected vs. invoiced (%)
  - Average invoice value
  - Revenue per client
  - New revenue this month

**Revenue Charts:**

- Monthly revenue trend (line chart, 12 months)
- Revenue by client (bar chart, top 10)
- Revenue by service type (pie chart)
- Payment collection trend
- Forecast next quarter (based on trends)

**Client Revenue Report:**

- Revenue per client (period selectable)
- Ranking by revenue contribution
- Lifetime value per client
- Revenue growth per client
- Churn analysis (lost clients)

**Service Revenue Report:**

- Revenue by service type:
  - Monthly fees
  - Per-submission fees
  - Additional services
  - One-time charges
- Identify most profitable services
- Service mix analysis

**Profitability Analysis:**

- Revenue minus costs
- Costs include:
  - Team salaries (allocated)
  - Software/infrastructure costs
  - Overhead allocation
- Profit margin per client
- Profit margin per service
- Overall profitability trend

**Financial Forecasting:**

- Projected revenue (based on active clients and contracts)
- Renewal forecast (contract expiration dates)
- At-risk revenue (clients with issues)
- Growth projection (based on pipeline)

**6.13.4 Subscription Management**

**Active Subscriptions:**

- List of all active client subscriptions
- Subscription details:
  - Client name
  - Plan
  - Monthly/Annual billing
  - Start date
  - Next billing date
  - Status (Active/Paused/Cancelled)
  - Auto-renewal (Yes/No)
- Upcoming renewals (next 30 days)
- Expiring subscriptions

**Subscription Actions:**

- Upgrade/Downgrade plan
- Pause subscription (temporary hold)
- Cancel subscription (with reason)
- Extend subscription (add months)
- Change billing cycle (monthly ↔ annual)
- Apply discount
- Update payment terms

**Renewal Management:**

- Auto-renewal by default
- Renewal reminder emails (30, 14, 7 days before expiration)
- Renewal processing:
  - Auto-generate next invoice
  - Send to client
  - Track payment
- Manual renewal (if auto-renewal off)
- Contract renewal workflow (for enterprise clients)

**Churn Management:**

- Cancelled subscriptions tracking
- Cancellation reasons (survey)
- Exit interview/feedback
- Win-back campaigns
- Churn rate calculation
- Churn analysis (identify patterns)

**6.13.5 Financial Reporting**

**Standard Reports:**

1. **Revenue Report:**

   - Total revenue by period
   - Breakdown by client, service, plan
   - Comparison with previous period
   - Year-over-year comparison

2. **Accounts Receivable Report:**

   - Outstanding invoices list
   - Aging analysis
   - Collection forecast
   - At-risk accounts

3. **Client Profitability Report:**

   - Revenue vs. cost per client
   - Profit margin
   - Client ranking
   - Unprofitable clients identification

4. **Cash Flow Report:**

   - Cash inflows (collections)
   - Cash outflows (if tracked)
   - Net cash flow
   - Cash flow forecast

5. **Sales Summary Report:**
   - New clients acquired
   - Revenue from new clients
   - Upsells/upgrades
   - Churn (cancelled clients)
   - Net growth

**Custom Reports:**

- Report builder for custom financial reports
- Select metrics, dimensions, filters
- Scheduled delivery
- Export to Excel, PDF

**Integration Export:**

- Export invoices to accounting software (QuickBooks, Xero)
- Export format: CSV, QBO, IIF
- Map fields to accounting software
- Automated sync (optional)

**Acceptance Criteria:**

- [x] Service plans defined with all features and pricing
- [x] Invoices auto-generate on schedule accurately
- [x] Invoice PDF matches professional standards
- [x] Payment recording updates invoice status immediately
- [x] Payment reminders sent automatically per schedule
- [x] Revenue dashboard displays real-time metrics
- [x] All financial reports generate within 5 seconds
- [x] Subscription renewals process automatically
- [x] Churn tracking captures reasons accurately
- [x] Export to accounting software successful

**Dependencies:**

- Client management system
- Email service
- PDF generation
- Payment gateway (future integration)
- Accounting software API (future integration)
- Reporting engine

**Business Rules:**

- Invoices locked once sent (cannot edit, must issue credit note)
- VAT applies to all service fees
- Payment terms configurable per client
- Automatic late fees configurable (optional)
- Multi-currency support (future)
- Invoice numbering sequential and cannot skip
- Credit notes reduce outstanding balance
- Partial payments allocated to oldest invoice first

**Validation Rules:**

- Invoice amount must be positive
- Payment amount cannot exceed invoice amount (unless overpayment)
- Payment date cannot be future date
- Credit note amount cannot exceed original invoice
- Plan change validation (ensure features available)

**Error Handling:**

- Invoice generation failure: Log error, retry, notify admin
- Email send failure: Mark as failed, allow manual resend
- Payment gateway failure: Show error, allow retry
- Export failure: Show error details, allow re-export
- Duplicate invoice number detection: Auto-increment, prevent save

---

## 7. Non-Functional Requirements (NFRs)

**7.1 Performance & Scalability**

- The system must generate all schedules for a taxable period (up to 10k uploaded rows) within 30 seconds under normal operating conditions.
- Bulk uploads of files up to 10MB should complete within 10 seconds; 10k-row performance tests must complete within 60 seconds for mapping & preview.
- Support horizontal scaling for peak submission windows (20% monthly concentration near deadlines).

**7.2 Availability & Reliability**

- System uptime: 99.5% SLA for user-facing services
- Automated failover for critical components (APIs, web UI)
- Daily backups and point-in-time restore for transactional data (7-year retention for submitted periods)

**7.3 Security & Privacy**

- Encrypt data at rest (AES-256) and in transit (TLS 1.2+)
- Role-based access control (RBAC) with least privilege
- Audit logs for all review/submission actions (immutable, exportable)

**7.4 Maintainability & Observability**

- Centralized logging and metrics (Prometheus/Grafana + ELK/Cloud logging)
- Health checks and distributed tracing for key flows
- Automated deployment pipelines and Canary releases

**7.5 Compliance & Data Retention**

- 7-year data retention for submitted schedules and opaque supporting ZIPs
- Support data export for regulatory audits
- Privacy controls for client data export/deletion requests

**Acceptance Criteria:**

- [x] Performance tests for mapping & schedule generation pass defined SLOs
- [x] Security controls implemented and documented
- [x] Backups validated weekly and restore tested monthly

---

## 8. Technical Architecture

**8.1 High-level Architecture**

- Client Portal (React/TypeScript) for uploads, mapping, previews and submission tracking
- Backend API (Node.js/Python) serving REST endpoints and validation engine
- Job queue (Redis/RabbitMQ) for background processing (validation, schedule generation, IRD submissions)
- Document/object storage (S3-compatible) for opaque ZIPs and artifacts
- Relational DB (Postgres) for transactional data; OLAP store (BigQuery/Redshift) for analytics (Phase 2)
- Scraper/Integration services isolated in a submission worker with robust retry and credential vaulting

**8.2 Integration Points**

- Email/SMS provider for notifications/2FA
- Payment gateway (for Simplebooks billing)
- Optional accounting software connectors (export/import templates)

**8.3 Deployment & Ops**

- Infrastructure-as-Code (Terraform) for reproducible environments
- CI/CD (GitHub Actions/GitLab CI) with automated tests and gated deploys
- Staging and Production environments, with smoke and integration tests before production deploy

**Acceptance Criteria:**

- [x] Architecture diagram available in /architecture/ folder
- [x] Deployment pipeline with automated tests established

---

## 9. User Interface Design

**9.1 Principles**

- Clear, minimal UI focused on upload → map → review → submit workflow
- Emphasise validation feedback and remediation guidance
- Mobile-responsive; primary workflows optimised for desktop

**9.2 Key Screens**

- Onboarding & Company Profile
- Upload & Mapping Wizard
- Staging / Review Queue (Simplebooks CRM)
- Schedule Generation & Download
- Submission Tracking & Audit Trail
- Client Dashboard & Notifications

**Acceptance Criteria:**

- [x] UI prototypes for main flows exist and are accessible
- [x] Validation messages are actionable and present per-row errors

---

## 10. Data Model & Migration

**10.1 Data Model (summary)**

- Company, User, Role, TaxPeriod, StagingRecord, ScheduleFile, Submission, AuditLog, MappingTemplate, Attachment (opaque ZIP)
- Use UUIDs for external identifiers; sequential IDs for internal billing where required

**10.2 Migration Strategy**

- Provide CSV import for historical schedules (staged import with validation)
- Migration scripts with dry-run option and rollback support
- Data sanity checks post-migration (counts, totals reconciliation)

**Acceptance Criteria:**

- [x] Migration patterns documented and tested on a staging dataset

---

## 11. Integration Specifications

**11.1 IRD Submission**

- Primary: IRD scraper that automates web form filling and file uploads, with robust error handling and replay
- Secondary: API integration when IRD provides machine interface (design to be API-first)
- All submissions recorded with request/response details and IRD acknowledgment stored

**11.2 Accounting Exports**

- Provide mapping templates and sample export templates for QuickBooks, Xero, ClearTax, Zoho, Tally
- Support CSV/XLSX as primary file formats; preserve raw upload for traceability

**Acceptance Criteria:**

- [x] IRD submission module logs acknowledgments and can retry failed submissions
- [x] Mapping templates exist for top accounting systems used in Sri Lanka

---

## 12. Security & Compliance

**12.1 Authentication & Authorization**

- Email/password with optional 2FA (TOTP/SMS)
- SSO support (SAML/OAuth) for enterprise clients (Phase 2)
- RBAC with admin, reviewer, viewer roles

**12.2 Data Protection**

- Encrypt PII and financial fields at rest
- Secrets management via Vault/KMS
- Periodic security reviews and external penetration testing (annual)

**12.3 Audit & Compliance**

- Immutable audit trail for all submission lifecycle events
- Retain logs for regulatory and support purposes
- Prepare SOC2/GDPR-ready documentation and controls

**Acceptance Criteria:**

- [x] Pen test schedule defined and initial scan completed
- [x] Encryption and RBAC verified in test environment

---

## 13. Testing Strategy

**13.1 Test Types**

- Unit tests for business logic (validation, mapping, calculations)
- Integration tests for APIs and job runners
- End-to-end tests for upload → map → review → submit flows
- Performance tests (10k-row mapping preview, schedule generation)
- Security tests (pen testing, dependency scans)

**13.2 Acceptance Criteria & Test Coverage**

- Automated test coverage policy (80%+ where feasible for critical modules)
- Acceptance tests for PRD acceptance criteria

**13.3 Test Environments & CI**

- Dedicated test & staging environments with seeded datasets
- CI pipeline runs unit/integration/e2e tests on merge; nightly performance tests

---

## 14. Deployment & Operations

**14.1 Release Process**

- Feature branches → PR with automated checks → Staging deploy → Smoke tests → Canary → Production
- Rollback strategy: previous container image or database migration rollback

**14.2 Monitoring & SLOs**

- Metrics: request latency, error rate, submission success rate, queue depth
- Alerts: SLO breaches, failed submissions, high error rates
- Runbooks for common incidents and IRD submission failures

**14.3 Backup & DR**

- Daily full backups; point-in-time recovery for DB
- Offsite replication for objects and snapshots
- Quarterly DR fire drills

---

## 15. Project Timeline & Milestones

**Phase 0: Discovery & Design (Weeks 1-4)**n- Finalize PRD, prototypes, mapping templates, architect review

**Phase 1: MVP Build (Weeks 5-20)**n- Core features: auth, company onboarding, upload & Mapping Wizard, validation engine, staging & review queue, schedule generation, basic IRD submission (scraper), reporting

**Phase 2: Stabilize & Scale (Weeks 21-36)**n- Performance tuning, additional mapping templates, more schedules, refunds workflow, enterprise features (SSO)

**Phase 3: Growth & Integrations (Weeks 37-60)**n- Accounting connectors, automation of more IRD workflows, advanced analytics, multi-entity support

**Milestones:**

- MVP demo (Week 12)
- Beta (10 pilot clients) (Week 20)
- GA (Week 28)

---

## 16. Resource Requirements

**Core Team (Initial)**

- Product Manager (1)
- Engineering: Backend (2), Frontend (2), QA (1), DevOps (1)
- VAT SME / Tax Expert (1) (part-time)
- UX Designer (1)
- Operations / Support (1)

**Advisory / External**

- Legal (compliance), External pen-test vendor, IRD engagement consultant

---

## 17. Risks & Mitigation

**Risk:** IRD changes policies or blocks automation

- **Mitigation:** Maintain human-reviewed fallback process; keep engagement with IRD

**Risk:** Source data quality (clients upload incorrect formats)

- **Mitigation:** Robust mapping wizard, clear templates, strong validation and client onboarding

**Risk:** Scraper breakage due to IRD site changes

- **Mitigation:** Isolate scraper service, rapid patch process, monitoring and alerting

**Risk:** Security breach of client financial data

- **Mitigation:** Strong encryption, pen testing, least privilege, audit logging

---

## 18. Success Metrics

- Adoption: 50 clients in Year 1, 200 in Year 2
- Accuracy: >99% VAT calculation accuracy on processed submissions
- Efficiency: 75% reduction in time spent per company on VAT compliance
- Reliability: 99.5% uptime
- Customer satisfaction: NPS >50
- Business: $100K ARR by Year 2

---

## 19. Glossary

- IRD: Inland Revenue Department (Sri Lanka)
- RBRS: Risk-Based Refund Scheme
- TIN: Tax Identification Number
- SVAT: Simplified VAT (abolished 2025)
- VATFS: VAT on Financial Services
- SLO: Service Level Objective
- SLA: Service Level Agreement

---
