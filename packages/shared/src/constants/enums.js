"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorMethod = exports.MappingSystemType = exports.FileUploadStatus = exports.NotificationType = exports.TransactionType = exports.VATScheduleType = exports.TaxablePeriod = exports.SubmissionStage = exports.EntityStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRole["VAT_TEAM_LEAD"] = "VAT_TEAM_LEAD";
    UserRole["VAT_TEAM_MEMBER"] = "VAT_TEAM_MEMBER";
    UserRole["CLIENT"] = "CLIENT";
})(UserRole || (exports.UserRole = UserRole = {}));
var EntityStatus;
(function (EntityStatus) {
    EntityStatus["ACTIVE"] = "ACTIVE";
    EntityStatus["INACTIVE"] = "INACTIVE";
    EntityStatus["SUSPENDED"] = "SUSPENDED";
    EntityStatus["DRAFT"] = "DRAFT";
    EntityStatus["SUBMITTED"] = "SUBMITTED";
    EntityStatus["FILED"] = "FILED";
    EntityStatus["CLOSED"] = "CLOSED";
})(EntityStatus || (exports.EntityStatus = EntityStatus = {}));
var SubmissionStage;
(function (SubmissionStage) {
    SubmissionStage[SubmissionStage["DATA_COLLECTION"] = 1] = "DATA_COLLECTION";
    SubmissionStage[SubmissionStage["DOCUMENT_PREPARATION"] = 2] = "DOCUMENT_PREPARATION";
    SubmissionStage[SubmissionStage["REVIEW"] = 3] = "REVIEW";
    SubmissionStage[SubmissionStage["IRD_SUBMISSION"] = 4] = "IRD_SUBMISSION";
    SubmissionStage[SubmissionStage["PAYMENT"] = 5] = "PAYMENT";
    SubmissionStage[SubmissionStage["ACKNOWLEDGMENT"] = 6] = "ACKNOWLEDGMENT";
    SubmissionStage[SubmissionStage["FILING"] = 7] = "FILING";
    SubmissionStage[SubmissionStage["CLOSED"] = 8] = "CLOSED";
})(SubmissionStage || (exports.SubmissionStage = SubmissionStage = {}));
var TaxablePeriod;
(function (TaxablePeriod) {
    TaxablePeriod["MONTHLY"] = "MONTHLY";
    TaxablePeriod["QUARTERLY"] = "QUARTERLY";
})(TaxablePeriod || (exports.TaxablePeriod = TaxablePeriod = {}));
var VATScheduleType;
(function (VATScheduleType) {
    VATScheduleType["SCHEDULE_01"] = "SCHEDULE_01";
    VATScheduleType["SCHEDULE_02"] = "SCHEDULE_02";
    VATScheduleType["SCHEDULE_03"] = "SCHEDULE_03";
    VATScheduleType["SCHEDULE_04"] = "SCHEDULE_04";
    VATScheduleType["SCHEDULE_05"] = "SCHEDULE_05";
    VATScheduleType["SCHEDULE_06"] = "SCHEDULE_06";
    VATScheduleType["SCHEDULE_07"] = "SCHEDULE_07";
    VATScheduleType["SCHEDULE_01_AMENDMENT"] = "SCHEDULE_01_AMENDMENT";
    VATScheduleType["SCHEDULE_02_AMENDMENT"] = "SCHEDULE_02_AMENDMENT";
    VATScheduleType["SCHEDULE_03_AMENDMENT"] = "SCHEDULE_03_AMENDMENT";
    VATScheduleType["SCHEDULE_04_AMENDMENT"] = "SCHEDULE_04_AMENDMENT";
    VATScheduleType["SCHEDULE_05_AMENDMENT"] = "SCHEDULE_05_AMENDMENT";
    VATScheduleType["SCHEDULE_06_AMENDMENT"] = "SCHEDULE_06_AMENDMENT";
    VATScheduleType["SCHEDULE_07_AMENDMENT"] = "SCHEDULE_07_AMENDMENT";
})(VATScheduleType || (exports.VATScheduleType = VATScheduleType = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType["LOCAL_SUPPLY"] = "LOCAL_SUPPLY";
    TransactionType["IMPORT"] = "IMPORT";
    TransactionType["EXPORT"] = "EXPORT";
    TransactionType["LOCAL_PURCHASE"] = "LOCAL_PURCHASE";
    TransactionType["ZERO_RATED"] = "ZERO_RATED";
    TransactionType["EXEMPT"] = "EXEMPT";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["EMAIL"] = "EMAIL";
    NotificationType["IN_APP"] = "IN_APP";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var FileUploadStatus;
(function (FileUploadStatus) {
    FileUploadStatus["PENDING"] = "PENDING";
    FileUploadStatus["PROCESSING"] = "PROCESSING";
    FileUploadStatus["COMPLETED"] = "COMPLETED";
    FileUploadStatus["FAILED"] = "FAILED";
})(FileUploadStatus || (exports.FileUploadStatus = FileUploadStatus = {}));
var MappingSystemType;
(function (MappingSystemType) {
    MappingSystemType["QUICKBOOKS"] = "QUICKBOOKS";
    MappingSystemType["XERO"] = "XERO";
    MappingSystemType["TALLY"] = "TALLY";
    MappingSystemType["CLEARTAX"] = "CLEARTAX";
    MappingSystemType["ZOHO"] = "ZOHO";
    MappingSystemType["CUSTOM"] = "CUSTOM";
})(MappingSystemType || (exports.MappingSystemType = MappingSystemType = {}));
var TwoFactorMethod;
(function (TwoFactorMethod) {
    TwoFactorMethod["EMAIL_OTP"] = "EMAIL_OTP";
    TwoFactorMethod["TOTP"] = "TOTP";
})(TwoFactorMethod || (exports.TwoFactorMethod = TwoFactorMethod = {}));
//# sourceMappingURL=enums.js.map