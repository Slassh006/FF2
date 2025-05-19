"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryStatus = exports.OrderStatus = exports.StoreItemStatus = exports.StoreItemCategory = void 0;
// Store Item Types
var StoreItemCategory;
(function (StoreItemCategory) {
    StoreItemCategory["REDEEM_CODE"] = "Redeem Codes";
    StoreItemCategory["DIGITAL_REWARD"] = "Digital Rewards";
})(StoreItemCategory || (exports.StoreItemCategory = StoreItemCategory = {}));
// Status for items in user inventory or store listings
var StoreItemStatus;
(function (StoreItemStatus) {
    StoreItemStatus["ACTIVE"] = "Active";
    StoreItemStatus["USED"] = "Used";
    StoreItemStatus["EXPIRED"] = "Expired";
    StoreItemStatus["DRAFT"] = "Draft";
    StoreItemStatus["ARCHIVED"] = "Archived"; // Item is no longer available but kept for records
})(StoreItemStatus || (exports.StoreItemStatus = StoreItemStatus = {}));
// Order Types
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "Pending";
    OrderStatus["COMPLETED"] = "Completed";
    OrderStatus["FAILED"] = "Failed";
    OrderStatus["CANCELLED"] = "Cancelled";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var DeliveryStatus;
(function (DeliveryStatus) {
    DeliveryStatus["PENDING"] = "Pending";
    DeliveryStatus["PROCESSING"] = "Processing";
    DeliveryStatus["SHIPPED"] = "Shipped";
    DeliveryStatus["DELIVERED"] = "Delivered";
    DeliveryStatus["FAILED"] = "Failed";
    DeliveryStatus["CANCELLED"] = "Cancelled";
})(DeliveryStatus || (exports.DeliveryStatus = DeliveryStatus = {}));
