import { MappingSystemType } from '@shared/constants';

export const DEFAULT_MAPPING_TEMPLATES = {
  [MappingSystemType.QUICKBOOKS]: {
    name: 'QuickBooks Default Mapping',
    systemType: MappingSystemType.QUICKBOOKS,
    mappings: {
      'Transaction Date': 'transactionDate',
      'Transaction Type': 'transactionType',
      'Invoice Number': 'invoiceNumber',
      'Supplier TIN': 'supplierTIN',
      'Supplier Name': 'supplierName',
      'Description': 'description',
      'Gross Amount': 'grossAmount',
      'VAT Amount': 'vatAmount',
      'Net Amount': 'netAmount',
      'VAT Rate': 'vatRate',
    },
  },
  [MappingSystemType.XERO]: {
    name: 'Xero Default Mapping',
    systemType: MappingSystemType.XERO,
    mappings: {
      'Date': 'transactionDate',
      'Type': 'transactionType',
      'Invoice No': 'invoiceNumber',
      'Contact TIN': 'supplierTIN',
      'Contact Name': 'supplierName',
      'Description': 'description',
      'Total': 'grossAmount',
      'Tax Amount': 'vatAmount',
      'Subtotal': 'netAmount',
      'Tax Rate': 'vatRate',
    },
  },
  [MappingSystemType.TALLY]: {
    name: 'Tally Default Mapping',
    systemType: MappingSystemType.TALLY,
    mappings: {
      'Voucher Date': 'transactionDate',
      'Voucher Type': 'transactionType',
      'Voucher Number': 'invoiceNumber',
      'Party TIN': 'supplierTIN',
      'Party Name': 'supplierName',
      'Narration': 'description',
      'Amount': 'grossAmount',
      'VAT Amount': 'vatAmount',
      'Taxable Value': 'netAmount',
      'VAT %': 'vatRate',
    },
  },
  [MappingSystemType.CLEARTAX]: {
    name: 'ClearTax Default Mapping',
    systemType: MappingSystemType.CLEARTAX,
    mappings: {
      'Invoice Date': 'transactionDate',
      'Transaction Type': 'transactionType',
      'Invoice Number': 'invoiceNumber',
      'GSTIN/UIN': 'supplierTIN',
      'Trade Name': 'supplierName',
      'Item Description': 'description',
      'Invoice Value': 'grossAmount',
      'Tax Amount': 'vatAmount',
      'Taxable Value': 'netAmount',
      'Tax Rate': 'vatRate',
    },
  },
  [MappingSystemType.ZOHO]: {
    name: 'Zoho Books Default Mapping',
    systemType: MappingSystemType.ZOHO,
    mappings: {
      'Date': 'transactionDate',
      'Type': 'transactionType',
      'Number': 'invoiceNumber',
      'Vendor TIN': 'supplierTIN',
      'Vendor Name': 'supplierName',
      'Description': 'description',
      'Total': 'grossAmount',
      'Tax': 'vatAmount',
      'Sub Total': 'netAmount',
      'Tax %': 'vatRate',
    },
  },
  [MappingSystemType.CUSTOM]: {
    name: 'Custom Mapping Template',
    systemType: MappingSystemType.CUSTOM,
    mappings: {},
  },
};

export const REQUIRED_FIELDS = [
  'transactionDate',
  'transactionType',
  'invoiceNumber',
  'description',
  'grossAmount',
  'vatAmount',
  'netAmount',
  'vatRate',
];

export const OPTIONAL_FIELDS = [
  'supplierTIN',
  'supplierName',
];

export const CANONICAL_FIELDS = {
  transactionDate: {
    type: 'date',
    required: true,
    description: 'Date of the transaction',
  },
  transactionType: {
    type: 'string',
    required: true,
    description: 'Type of transaction (LOCAL_SUPPLY, IMPORT, EXPORT, etc.)',
  },
  invoiceNumber: {
    type: 'string',
    required: true,
    description: 'Invoice or voucher number',
  },
  supplierTIN: {
    type: 'string',
    required: false,
    description: 'Supplier Tax Identification Number',
  },
  supplierName: {
    type: 'string',
    required: false,
    description: 'Supplier or vendor name',
  },
  description: {
    type: 'string',
    required: true,
    description: 'Transaction description',
  },
  grossAmount: {
    type: 'number',
    required: true,
    description: 'Total amount including VAT',
  },
  vatAmount: {
    type: 'number',
    required: true,
    description: 'VAT amount',
  },
  netAmount: {
    type: 'number',
    required: true,
    description: 'Amount excluding VAT',
  },
  vatRate: {
    type: 'number',
    required: true,
    description: 'VAT rate percentage',
  },
};
