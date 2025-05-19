"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
var mongoose_1 = require("mongoose");
var bcrypt = require("bcryptjs");
var crypto = require("crypto");
var store_1 = require("../app/types/store");
exports.UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        select: false,
    },
    role: {
        type: String,
        enum: ['admin', 'subscriber'],
        default: 'subscriber',
    },
    permissions: [{
            type: String,
            enum: [
                'read:blogs',
                'write:blogs',
                'read:wallpapers',
                'write:wallpapers',
                'read:users',
                'write:users',
                'read:orders',
                'write:orders',
                'manage:settings',
                'read:craftland-codes',
                'write:craftland-codes',
                'manage:craftland-codes'
            ]
        }],
    isAdmin: {
        type: Boolean,
        default: false,
    },
    coins: {
        type: Number,
        default: 0,
        min: [0, 'Coins cannot be negative'],
    },
    avatar: {
        type: String,
    },
    avatarFileId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
    },
    avatarLastUpdatedAt: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    blockReason: String,
    blockedAt: Date,
    lastLogin: Date,
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: Date,
    resetToken: String,
    resetTokenExpiry: Date,
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationExpiry: Date,
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    twoFactorSecret: String,
    twoFactorBackupCodes: [String],
    socialLinks: {
        facebook: String,
        twitter: String,
        instagram: String,
        youtube: String,
    },
    preferences: {
        theme: {
            type: String,
            enum: ['light', 'dark', 'system', 'default'],
            default: 'system'
        },
        language: {
            type: String,
            default: 'en'
        },
        timezone: {
            type: String,
            default: 'UTC'
        },
        notifications: {
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true },
            inApp: { type: Boolean, default: true }
        }
    },
    statistics: {
        lastActive: {
            type: Date,
            default: Date.now,
        },
        loginCount: {
            type: Number,
            default: 0,
        },
        totalTimeSpent: {
            type: Number,
            default: 0,
        },
        deviceCount: {
            type: Number,
            default: 0,
        },
    },
    devices: [{
            deviceId: String,
            deviceName: String,
            lastUsed: Date,
            ipAddress: String,
            userAgent: String,
        }],
    referralCode: {
        type: String,
        unique: true,
        sparse: true,
    },
    appliedReferrals: [{
            referrerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
            codeUsed: { type: String, required: true },
            appliedAt: { type: Date, default: Date.now }
        }],
    referralCount: {
        type: Number,
        default: 0,
    },
    savedWallpapers: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Wallpaper',
        }],
    favoriteCraftlandCodes: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'CraftlandCode',
        }],
    notificationPreferences: {
        email: { type: Boolean, default: true },
        inApp: { type: Boolean, default: true },
        push: { type: Boolean, default: false },
    },
    quizStats: {
        totalParticipated: { type: Number, default: 0 },
        totalWon: { type: Number, default: 0 },
        highestScore: { type: Number, default: 0 },
        totalCoinsEarned: { type: Number, default: 0 },
    },
    storeHistory: [{
            itemId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'StoreItem' },
            purchaseDate: { type: Date, default: Date.now },
            status: {
                type: String,
                enum: Object.values(store_1.OrderStatus),
                default: store_1.OrderStatus.PENDING,
            },
        }],
    cart: {
        type: {
            items: [{
                    itemId: {
                        type: mongoose_1.Schema.Types.ObjectId,
                        ref: 'StoreItem'
                    },
                    quantity: {
                        type: Number,
                        default: 1,
                        min: 1
                    },
                    addedAt: {
                        type: Date,
                        default: Date.now
                    }
                }]
        },
        default: { items: [] }
    },
    orders: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Order',
        }],
    purchaseHistory: [{
            orderId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Order',
            },
            date: {
                type: Date,
                default: Date.now,
            },
            amount: {
                type: Number,
                required: true,
            },
            status: {
                type: String,
                enum: Object.values(store_1.OrderStatus),
                default: store_1.OrderStatus.PENDING,
            },
        }],
    activityLog: [{
            type: { type: String },
            details: { type: mongoose_1.Schema.Types.Mixed },
            ip: { type: String },
            userAgent: { type: String },
            createdAt: { type: Date, default: Date.now }
        }],
    inventory: {
        items: [{
                itemId: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: 'StoreItem',
                },
                acquiredAt: {
                    type: Date,
                    default: Date.now,
                },
                status: {
                    type: String,
                    enum: Object.values(store_1.StoreItemStatus),
                    default: store_1.StoreItemStatus.ACTIVE,
                },
            }],
        badges: [String],
        rewards: [String],
    },
}, {
    timestamps: true,
});
// Generate unique referral code
function generateUniqueReferralCode(name) {
    return __awaiter(this, void 0, void 0, function () {
        var namePart, randomPart, code, existingUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    namePart = name.substring(0, 3).toUpperCase();
                    randomPart = crypto.randomBytes(2).toString('hex').toUpperCase();
                    code = "".concat(namePart).concat(randomPart);
                    return [4 /*yield*/, mongoose_1.default.models.User.findOne({ referralCode: code })];
                case 1:
                    existingUser = _a.sent();
                    if (existingUser) {
                        // If code exists, generate a new one recursively
                        return [2 /*return*/, generateUniqueReferralCode(name)];
                    }
                    return [2 /*return*/, code];
            }
        });
    });
}
// Generate referral code before saving
exports.UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, caughtError_1, errorToPass, salt, _b, caughtError_2, errorToPass;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!!this.referralCode) return [3 /*break*/, 4];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    _a = this;
                    return [4 /*yield*/, generateUniqueReferralCode(this.name)];
                case 2:
                    _a.referralCode = _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    caughtError_1 = _c.sent();
                    errorToPass = caughtError_1 instanceof Error ? caughtError_1 : new Error(String(caughtError_1));
                    next(errorToPass);
                    return [2 /*return*/];
                case 4:
                    if (!this.isModified('password')) return [3 /*break*/, 9];
                    _c.label = 5;
                case 5:
                    _c.trys.push([5, 8, , 9]);
                    return [4 /*yield*/, bcrypt.genSalt(10)];
                case 6:
                    salt = _c.sent();
                    _b = this;
                    return [4 /*yield*/, bcrypt.hash(this.password, salt)];
                case 7:
                    _b.password = _c.sent();
                    return [3 /*break*/, 9];
                case 8:
                    caughtError_2 = _c.sent();
                    errorToPass = caughtError_2 instanceof Error ? caughtError_2 : new Error(String(caughtError_2));
                    next(errorToPass);
                    return [2 /*return*/];
                case 9:
                    next();
                    return [2 /*return*/];
            }
        });
    });
});
// Compare password method
exports.UserSchema.methods.comparePassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, bcrypt.compare(candidatePassword, this.password)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    e_1 = _a.sent();
                    if (e_1 instanceof Error) {
                        throw new Error("Password comparison failed: ".concat(e_1.message));
                    }
                    throw new Error('Password comparison failed due to an unknown error');
                case 3: return [2 /*return*/];
            }
        });
    });
};
// Add method to check permissions
exports.UserSchema.methods.hasPermission = function (permission) {
    return this.permissions.includes(permission) || this.role === 'admin';
};
// Add coins method
exports.UserSchema.methods.addCoins = function (amount, reason) {
    return __awaiter(this, void 0, void 0, function () {
        var e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (amount < 0)
                        throw new Error('Amount must be positive');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, mongoose_1.default.models.Transaction.create({
                            userId: this._id,
                            type: 'ADMIN_ADJUSTMENT',
                            amount: amount,
                            status: 'COMPLETED',
                            metadata: {
                                reason: reason,
                                previousBalance: this.coins,
                                newBalance: this.coins + amount
                            }
                        })];
                case 2:
                    _a.sent();
                    this.coins += amount;
                    return [4 /*yield*/, this.logActivity('coins_added', { amount: amount, reason: reason })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, this.save()];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    e_2 = _a.sent();
                    if (e_2 instanceof Error) {
                        throw new Error("Failed to add coins: ".concat(e_2.message));
                    }
                    throw new Error('Failed to add coins due to an unknown error');
                case 6: return [2 /*return*/];
            }
        });
    });
};
// Deduct coins method
exports.UserSchema.methods.deductCoins = function (amount, reason) {
    return __awaiter(this, void 0, void 0, function () {
        var e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (amount < 0)
                        throw new Error('Amount must be positive');
                    if (this.coins < amount)
                        throw new Error('Insufficient coins');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, mongoose_1.default.models.Transaction.create({
                            userId: this._id,
                            type: 'ADMIN_ADJUSTMENT',
                            amount: -amount,
                            status: 'COMPLETED',
                            metadata: {
                                reason: reason,
                                previousBalance: this.coins,
                                newBalance: this.coins - amount
                            }
                        })];
                case 2:
                    _a.sent();
                    this.coins -= amount;
                    return [4 /*yield*/, this.logActivity('coins_removed', { amount: amount, reason: reason })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, this.save()];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    e_3 = _a.sent();
                    if (e_3 instanceof Error) {
                        throw new Error("Failed to deduct coins: ".concat(e_3.message));
                    }
                    throw new Error('Failed to deduct coins due to an unknown error');
                case 6: return [2 /*return*/];
            }
        });
    });
};
// Get coin balance method
exports.UserSchema.methods.getCoinBalance = function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, this.coins];
        });
    });
};
// Get transaction history method
exports.UserSchema.methods.getTransactionHistory = function () {
    return __awaiter(this, arguments, void 0, function (limit, skip) {
        if (limit === void 0) { limit = 10; }
        if (skip === void 0) { skip = 0; }
        return __generator(this, function (_a) {
            return [2 /*return*/, mongoose_1.default.models.Transaction.find({ userId: this._id })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean()];
        });
    });
};
// Get transaction statistics method
exports.UserSchema.methods.getTransactionStats = function () {
    return __awaiter(this, void 0, void 0, function () {
        var stats;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mongoose_1.default.models.Transaction.aggregate([
                        { $match: { userId: this._id } },
                        {
                            $group: {
                                _id: '$type',
                                count: { $sum: 1 },
                                total: { $sum: '$amount' }
                            }
                        }
                    ])];
                case 1:
                    stats = _a.sent();
                    return [2 /*return*/, stats];
            }
        });
    });
};
// Generate reset token method
exports.UserSchema.methods.generateResetToken = function () {
    return __awaiter(this, void 0, void 0, function () {
        var token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = crypto.randomBytes(32).toString('hex');
                    this.resetToken = token;
                    this.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
                    return [4 /*yield*/, this.save()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.logActivity('password_reset_requested')];
                case 2:
                    _a.sent();
                    return [2 /*return*/, token];
            }
        });
    });
};
// Generate email verification token
exports.UserSchema.methods.generateEmailVerificationToken = function () {
    return __awaiter(this, void 0, void 0, function () {
        var token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = crypto.randomBytes(32).toString('hex');
                    this.emailVerificationToken = token;
                    this.emailVerificationExpiry = new Date(Date.now() + 86400000); // 24 hours
                    return [4 /*yield*/, this.save()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.logActivity('email_verification_requested')];
                case 2:
                    _a.sent();
                    return [2 /*return*/, token];
            }
        });
    });
};
// Generate 2FA secret
exports.UserSchema.methods.generateTwoFactorSecret = function () {
    return __awaiter(this, void 0, void 0, function () {
        var secret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    secret = crypto.randomBytes(20).toString('hex');
                    this.twoFactorSecret = secret;
                    return [4 /*yield*/, this.save()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.logActivity('two_factor_secret_generated')];
                case 2:
                    _a.sent();
                    return [2 /*return*/, secret];
            }
        });
    });
};
// Generate 2FA backup codes
exports.UserSchema.methods.generateTwoFactorBackupCodes = function () {
    return __awaiter(this, void 0, void 0, function () {
        var codes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    codes = Array.from({ length: 8 }, function () {
                        return crypto.randomBytes(4).toString('hex').toUpperCase();
                    });
                    this.twoFactorBackupCodes = codes;
                    return [4 /*yield*/, this.save()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.logActivity('two_factor_backup_codes_generated')];
                case 2:
                    _a.sent();
                    return [2 /*return*/, codes];
            }
        });
    });
};
// Verify 2FA code
exports.UserSchema.methods.verifyTwoFactorCode = function (code) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!this.twoFactorSecret)
                return [2 /*return*/, false];
            // Implement TOTP verification here
            // For now, return true for testing
            return [2 /*return*/, true];
        });
    });
};
// Use 2FA backup code
exports.UserSchema.methods.useTwoFactorBackupCode = function (code) {
    return __awaiter(this, void 0, void 0, function () {
        var index;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    index = this.twoFactorBackupCodes.indexOf(code);
                    if (index === -1)
                        return [2 /*return*/, false];
                    this.twoFactorBackupCodes.splice(index, 1);
                    return [4 /*yield*/, this.save()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.logActivity('two_factor_backup_code_used')];
                case 2:
                    _a.sent();
                    return [2 /*return*/, true];
            }
        });
    });
};
// Log activity method
exports.UserSchema.methods.logActivity = function (activity_1) {
    return __awaiter(this, arguments, void 0, function (activity, details, ip, userAgent) {
        if (details === void 0) { details = {}; }
        if (ip === void 0) { ip = 'unknown'; }
        if (userAgent === void 0) { userAgent = 'unknown'; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.activityLog.push({
                        type: activity,
                        details: details,
                        ip: ip,
                        userAgent: userAgent,
                        createdAt: new Date()
                    });
                    return [4 /*yield*/, this.save()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
// Update last active
exports.UserSchema.methods.updateLastActive = function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.statistics.lastActive = new Date();
                    return [4 /*yield*/, this.save()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
// Increment login count
exports.UserSchema.methods.incrementLoginCount = function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.statistics.loginCount += 1;
                    this.lastLogin = new Date();
                    return [4 /*yield*/, this.save()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
// Add device
exports.UserSchema.methods.addDevice = function (deviceInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var existingDevice;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    existingDevice = this.devices.find(function (d) { return d.deviceId === deviceInfo.deviceId; });
                    if (existingDevice) {
                        existingDevice.lastUsed = new Date();
                        existingDevice.ipAddress = deviceInfo.ipAddress;
                        existingDevice.userAgent = deviceInfo.userAgent;
                    }
                    else {
                        this.devices.push(__assign(__assign({}, deviceInfo), { lastUsed: new Date() }));
                        this.statistics.deviceCount += 1;
                    }
                    return [4 /*yield*/, this.save()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
// Remove device
exports.UserSchema.methods.removeDevice = function (deviceId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.devices = this.devices.filter(function (d) { return d.deviceId !== deviceId; });
                    this.statistics.deviceCount = this.devices.length;
                    return [4 /*yield*/, this.save()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
// Add methods for craftland code management
exports.UserSchema.methods.toggleFavoriteCraftlandCode = function (codeId) {
    return __awaiter(this, void 0, void 0, function () {
        var codeObjectId, index;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    codeObjectId = new mongoose_1.default.Types.ObjectId(codeId);
                    index = this.favoriteCraftlandCodes.findIndex(function (id) { return id.equals(codeObjectId); });
                    if (index === -1) {
                        this.favoriteCraftlandCodes.push(codeObjectId);
                    }
                    else {
                        this.favoriteCraftlandCodes.splice(index, 1);
                    }
                    return [4 /*yield*/, this.save()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, index === -1]; // Return true if added to favorites, false if removed
            }
        });
    });
};
exports.UserSchema.methods.hasUpvotedCraftlandCode = function (codeId) {
    return __awaiter(this, void 0, void 0, function () {
        var code;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mongoose_1.default.model('CraftlandCode').findById(codeId)];
                case 1:
                    code = _a.sent();
                    return [2 /*return*/, code ? code.upvotes.includes(this._id) : false];
            }
        });
    });
};
exports.UserSchema.methods.hasDownvotedCraftlandCode = function (codeId) {
    return __awaiter(this, void 0, void 0, function () {
        var code;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mongoose_1.default.model('CraftlandCode').findById(codeId)];
                case 1:
                    code = _a.sent();
                    return [2 /*return*/, code ? code.downvotes.includes(this._id) : false];
            }
        });
    });
};
exports.UserSchema.methods.hasLikedCraftlandCode = function (codeId) {
    return __awaiter(this, void 0, void 0, function () {
        var code;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mongoose_1.default.model('CraftlandCode').findById(codeId)];
                case 1:
                    code = _a.sent();
                    return [2 /*return*/, code ? code.likes.includes(this._id) : false];
            }
        });
    });
};
// Add method to validate referral
exports.UserSchema.methods.validateReferral = function (referralCode) {
    return __awaiter(this, void 0, void 0, function () {
        var referrer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Check if user is trying to use their own code
                    if (this.referralCode === referralCode) {
                        throw new Error('Cannot use your own referral code');
                    }
                    // Check if user has already been referred
                    if (this.appliedReferrals.length > 0) {
                        throw new Error('User has already been referred');
                    }
                    return [4 /*yield*/, mongoose_1.default.models.User.findOne({ referralCode: referralCode })];
                case 1:
                    referrer = _a.sent();
                    if (!referrer) {
                        throw new Error('Invalid referral code');
                    }
                    // Check if referrer is active
                    if (!referrer.isActive || referrer.isBlocked) {
                        throw new Error('Referrer account is not active');
                    }
                    return [2 /*return*/, true];
            }
        });
    });
};
// Add method to apply referral
exports.UserSchema.methods.applyReferral = function (referralCode) {
    return __awaiter(this, void 0, void 0, function () {
        var referrer, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.validateReferral(referralCode)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, mongoose_1.default.models.User.findOne({ referralCode: referralCode })];
                case 2:
                    referrer = _a.sent();
                    if (!referrer) {
                        throw new Error('Invalid referral code');
                    }
                    // Add to applied referrals
                    this.appliedReferrals.push({
                        referrerId: referrer._id,
                        codeUsed: referralCode,
                        appliedAt: new Date()
                    });
                    // Increment referrer's count
                    referrer.referralCount += 1;
                    return [4 /*yield*/, referrer.save()];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 9, , 10]);
                    // Award referrer
                    return [4 /*yield*/, mongoose_1.default.models.Transaction.create({
                            userId: referrer._id,
                            type: 'REFERRAL_REWARD',
                            amount: 100,
                            status: 'COMPLETED',
                            metadata: {
                                referredUserId: this._id,
                                transactionType: 'referral_reward'
                            }
                        })];
                case 5:
                    // Award referrer
                    _a.sent();
                    // Award referred user
                    return [4 /*yield*/, mongoose_1.default.models.Transaction.create({
                            userId: this._id,
                            type: 'REFERRAL_BONUS',
                            amount: 50,
                            status: 'COMPLETED',
                            metadata: {
                                referrerId: referrer._id,
                                transactionType: 'referral_bonus'
                            }
                        })];
                case 6:
                    // Award referred user
                    _a.sent();
                    // Update balances
                    referrer.coins += 100;
                    this.coins += 50;
                    return [4 /*yield*/, Promise.all([
                            referrer.save(),
                            this.save()
                        ])];
                case 7:
                    _a.sent();
                    // Log activities
                    return [4 /*yield*/, Promise.all([
                            referrer.logActivity('referral_reward_earned', {
                                referredUserId: this._id,
                                amount: 100
                            }),
                            this.logActivity('referral_bonus_earned', {
                                referrerId: referrer._id,
                                amount: 50
                            })
                        ])];
                case 8:
                    // Log activities
                    _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    e_4 = _a.sent();
                    if (e_4 instanceof Error) {
                        throw new Error("Failed to process referral rewards: ".concat(e_4.message));
                    }
                    throw new Error('Failed to process referral rewards due to an unknown error');
                case 10: return [2 /*return*/];
            }
        });
    });
};
// Indexes
exports.UserSchema.index({ email: 1 }, { unique: true });
exports.UserSchema.index({ name: 1 });
exports.UserSchema.index({ role: 1 });
exports.UserSchema.index({ lastLogin: -1 });
exports.UserSchema.index({ coins: -1 });
exports.UserSchema.index({ createdAt: -1 });
exports.UserSchema.index({ 'activityLog.type': 1, 'activityLog.createdAt': -1 }); // Example compound index
exports.UserSchema.index({ 'activityLog.ip': 1, 'activityLog.createdAt': -1 });
exports.UserSchema.index({ 'appliedReferrals.referrerId': 1 });
exports.UserSchema.index({ 'appliedReferrals.appliedAt': -1 });
// Add virtuals or other schema options if needed
// Ensure this is the only model export
var User = mongoose_1.default.models.User || mongoose_1.default.model('User', exports.UserSchema);
exports.default = User;
