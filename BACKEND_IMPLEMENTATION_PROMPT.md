# 🚀 Backend Implementation Prompt for PaisaBandhu Viral Features

## Overview
This document provides comprehensive backend API specifications for implementing viral social features in the PaisaBandhu expense tracking app. All features are designed to be **100% free** (no paid APIs required) and create network effects to drive user growth.

---

## 📋 Table of Contents
1. [Challenges API](#1-challenges-api)
2. [Achievements API](#2-achievements-api)
3. [Expense Stories API](#3-expense-stories-api)
4. [Social Feed API](#4-social-feed-api)
5. [Referral System API](#5-referral-system-api)
6. [Savings Goals API](#6-savings-goals-api)
7. [Comments API](#7-comments-api)
8. [Reports API](#8-reports-api)
9. [Database Schemas](#9-database-schemas)
10. [Real-time Updates](#10-real-time-updates)

---

## 1. Challenges API

### Database Schema
```javascript
const ChallengeSchema = {
  title: String,
  description: String,
  type: {
    type: String,
    enum: ['save_amount', 'spend_less', 'no_purchases', 'category_limit'],
    required: true
  },
  targetAmount: Number, // Optional, for save_amount and category_limit
  targetCategory: String, // Optional, for category_limit
  startDate: Date,
  endDate: Date,
  createdBy: { type: ObjectId, ref: 'User' },
  participants: [{ type: ObjectId, ref: 'User' }],
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  createdAt: { type: Date, default: Date.now }
};
```

### API Endpoints

#### POST `/api/challenges`
Create a new challenge
```json
Request Body:
{
  "title": "Save ₹5000 this month",
  "description": "Let's save together!",
  "type": "save_amount",
  "targetAmount": 5000,
  "endDate": "2024-02-29T23:59:59Z",
  "friendIds": ["user_id_1", "user_id_2"] // Optional
}

Response:
{
  "success": true,
  "data": {
    "challenge": {
      "id": "challenge_id",
      "title": "Save ₹5000 this month",
      "description": "Let's save together!",
      "type": "save_amount",
      "targetAmount": 5000,
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": "2024-02-29T23:59:59Z",
      "createdBy": "user_id",
      "participants": ["user_id"],
      "status": "active",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### GET `/api/challenges`
Get all challenges (with filters)
```json
Query Parameters:
- status: 'active' | 'completed' | 'cancelled'
- type: challenge type
- limit: number (default: 20)
- skip: number (default: 0)

Response:
{
  "success": true,
  "data": {
    "challenges": [...]
  }
}
```

#### POST `/api/challenges/:challengeId/join`
Join a challenge
```json
Response:
{
  "success": true,
  "message": "Joined challenge successfully"
}
```

#### GET `/api/challenges/:challengeId/leaderboard`
Get challenge leaderboard
```json
Response:
{
  "success": true,
  "data": {
    "challengeId": "challenge_id",
    "participants": [
      {
        "userId": "user_id",
        "userName": "John Doe",
        "progress": 75.5,
        "currentAmount": 3750,
        "rank": 1,
        "avatar": "url"
      }
    ],
    "topPerformer": {...}
  }
}
```

#### GET `/api/challenges/:challengeId/progress`
Get current user's progress in challenge
```json
Response:
{
  "success": true,
  "data": {
    "userId": "user_id",
    "userName": "John Doe",
    "progress": 75.5,
    "currentAmount": 3750,
    "rank": 1
  }
}
```

### Challenge Progress Calculation Logic
```javascript
// For 'save_amount' type
const calculateProgress = (challenge, userId) => {
  const startDate = challenge.startDate;
  const endDate = challenge.endDate;
  
  // Get user's transactions in date range
  const transactions = await Transaction.find({
    userId,
    date: { $gte: startDate, $lte: endDate },
    type: 'expense'
  });
  
  const totalSpent = transactions.reduce((sum, t) => sum + t.price, 0);
  const saved = challenge.targetAmount - totalSpent;
  const progress = (saved / challenge.targetAmount) * 100;
  
  return {
    progress: Math.max(0, Math.min(100, progress)),
    currentAmount: saved
  };
};

// For 'spend_less' type - compare with previous period
// For 'no_purchases' type - count days without purchases
// For 'category_limit' type - sum expenses in category
```

---

## 2. Achievements API

### Database Schema
```javascript
const AchievementSchema = {
  title: String,
  description: String,
  icon: String, // Emoji
  category: {
    type: String,
    enum: ['streak', 'transaction', 'savings', 'social', 'milestone']
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  condition: {
    type: String, // e.g., "transactions >= 100", "streak >= 7"
    required: true
  },
  target: Number, // e.g., 100 transactions, 7 days streak
  createdAt: { type: Date, default: Date.now }
};

const UserAchievementSchema = {
  userId: { type: ObjectId, ref: 'User' },
  achievementId: { type: ObjectId, ref: 'Achievement' },
  unlockedAt: Date,
  progress: { type: Number, default: 0 }
};
```

### API Endpoints

#### GET `/api/achievements`
Get all achievements for current user
```json
Response:
{
  "success": true,
  "data": {
    "totalUnlocked": 15,
    "achievements": [
      {
        "id": "achievement_id",
        "title": "First Transaction",
        "description": "Add your first expense",
        "icon": "🎉",
        "category": "transaction",
        "rarity": "common",
        "unlocked": true,
        "unlockedAt": "2024-01-01T00:00:00Z",
        "progress": 1,
        "target": 1
      },
      {
        "id": "achievement_id_2",
        "title": "7 Day Streak",
        "description": "Track expenses for 7 days",
        "icon": "🔥",
        "category": "streak",
        "rarity": "rare",
        "unlocked": false,
        "progress": 5,
        "target": 7
      }
    ],
    "recentUnlocks": [...],
    "nextAchievements": [...]
  }
}
```

#### GET `/api/achievements/:achievementId`
Get specific achievement details

#### POST `/api/achievements/:achievementId/share`
Generate share URL for achievement
```json
Response:
{
  "success": true,
  "data": {
    "shareUrl": "https://app.com/share/achievement/abc123"
  }
}
```

### Achievement Unlock Logic
```javascript
// Check achievements after transaction creation
const checkAchievements = async (userId) => {
  const user = await User.findById(userId);
  const transactions = await Transaction.countDocuments({ userId });
  const streak = await calculateStreak(userId);
  
  const achievements = await Achievement.find();
  
  for (const achievement of achievements) {
    const userAchievement = await UserAchievement.findOne({
      userId,
      achievementId: achievement._id
    });
    
    if (userAchievement && userAchievement.unlocked) continue;
    
    let progress = 0;
    let unlocked = false;
    
    switch (achievement.condition) {
      case 'transactions >= 100':
        progress = transactions;
        unlocked = transactions >= achievement.target;
        break;
      case 'streak >= 7':
        progress = streak;
        unlocked = streak >= achievement.target;
        break;
      // Add more conditions
    }
    
    if (unlocked && !userAchievement) {
      await UserAchievement.create({
        userId,
        achievementId: achievement._id,
        unlockedAt: new Date(),
        progress: achievement.target
      });
      
      // Create feed item
      await createFeedItem({
        type: 'achievement',
        userId,
        title: `Unlocked: ${achievement.title}`,
        description: achievement.description
      });
    } else if (userAchievement) {
      userAchievement.progress = progress;
      await userAchievement.save();
    }
  }
};
```

---

## 3. Expense Stories API

### Database Schema
```javascript
const StorySchema = {
  userId: { type: ObjectId, ref: 'User' },
  type: {
    type: String,
    enum: ['monthly_summary', 'savings_goal', 'challenge_complete', 'achievement', 'group_expense']
  },
  title: String,
  subtitle: String,
  data: {
    amount: Number,
    category: String,
    period: String,
    friends: [String],
    achievement: String
  },
  template: {
    type: String,
    enum: ['gradient_1', 'gradient_2', 'gradient_3', 'minimal', 'vibrant'],
    default: 'gradient_1'
  },
  shareUrl: String,
  createdAt: { type: Date, default: Date.now }
};
```

### API Endpoints

#### POST `/api/stories/generate`
Generate an expense story
```json
Request Body:
{
  "type": "monthly_summary",
  "period": "January 2024",
  "bookId": "book_id" // Optional
}

Response:
{
  "success": true,
  "data": {
    "story": {
      "id": "story_id",
      "type": "monthly_summary",
      "title": "January Expenses",
      "subtitle": "You spent ₹15,000 this month",
      "data": {
        "amount": 15000,
        "period": "January 2024"
      },
      "template": "gradient_1",
      "createdAt": "2024-01-31T23:59:59Z"
    }
  }
}
```

#### GET `/api/stories`
Get user's stories
```json
Query Parameters:
- limit: number (default: 20)
- skip: number (default: 0)

Response:
{
  "success": true,
  "data": {
    "stories": [...]
  }
}
```

#### POST `/api/stories/:storyId/share`
Generate share URL
```json
Response:
{
  "success": true,
  "data": {
    "shareUrl": "https://app.com/share/story/abc123"
  }
}
```

### Story Generation Logic
```javascript
const generateStory = async (userId, type, options) => {
  let storyData = {};
  
  switch (type) {
    case 'monthly_summary':
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
      
      const transactions = await Transaction.find({
        userId,
        date: { $gte: startOfMonth, $lte: endOfMonth },
        type: 'expense'
      });
      
      const total = transactions.reduce((sum, t) => sum + t.price, 0);
      
      storyData = {
        title: `${new Date().toLocaleString('default', { month: 'long' })} Expenses`,
        subtitle: `You spent ₹${total.toLocaleString()} this month`,
        data: {
          amount: total,
          period: `${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}`
        }
      };
      break;
      
    case 'savings_goal':
      // Get savings goal data
      break;
      
    case 'challenge_complete':
      // Get challenge completion data
      break;
      
    case 'achievement':
      // Get achievement data
      break;
      
    case 'group_expense':
      // Get group expense data
      break;
  }
  
  const story = await Story.create({
    userId,
    type,
    ...storyData,
    template: options.template || 'gradient_1'
  });
  
  return story;
};
```

---

## 4. Social Feed API

### Database Schema
```javascript
const FeedItemSchema = {
  type: {
    type: String,
    enum: ['achievement', 'challenge', 'milestone', 'group_activity', 'savings_goal']
  },
  userId: { type: ObjectId, ref: 'User' },
  userName: String,
  userAvatar: String,
  title: String,
  description: String,
  data: {
    amount: Number,
    achievement: String,
    challenge: String,
    friends: [String]
  },
  reactions: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 }
  },
  isAnonymous: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
};

const FeedReactionSchema = {
  feedItemId: { type: ObjectId, ref: 'FeedItem' },
  userId: { type: ObjectId, ref: 'User' },
  reaction: {
    type: String,
    enum: ['like', 'love', 'celebrate']
  },
  createdAt: { type: Date, default: Date.now }
};

const FeedCommentSchema = {
  feedItemId: { type: ObjectId, ref: 'FeedItem' },
  userId: { type: ObjectId, ref: 'User' },
  userName: String,
  userAvatar: String,
  text: String,
  createdAt: { type: Date, default: Date.now }
};
```

### API Endpoints

#### GET `/api/feed`
Get social feed
```json
Query Parameters:
- limit: number (default: 20)
- skip: number (default: 0)
- type: feed item type

Response:
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "feed_item_id",
        "type": "achievement",
        "userId": "user_id",
        "userName": "John Doe",
        "userAvatar": "url",
        "title": "Unlocked: 7 Day Streak",
        "description": "Keep tracking your expenses!",
        "data": {
          "achievement": "7 Day Streak"
        },
        "reactions": {
          "likes": 5,
          "comments": 2,
          "userReaction": "like"
        },
        "isAnonymous": false,
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ]
  }
}
```

#### POST `/api/feed/:itemId/react`
React to feed item
```json
Request Body:
{
  "reaction": "like" // or "love" or "celebrate"
}

Response:
{
  "success": true
}
```

#### GET `/api/feed/:itemId/comments`
Get comments for feed item
```json
Response:
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": "comment_id",
        "userId": "user_id",
        "userName": "Jane Doe",
        "userAvatar": "url",
        "text": "Congratulations!",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

#### POST `/api/feed/:itemId/comments`
Add comment to feed item
```json
Request Body:
{
  "text": "Great job!"
}

Response:
{
  "success": true,
  "data": {
    "comment": {
      "id": "comment_id",
      "userId": "user_id",
      "userName": "John Doe",
      "text": "Great job!",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Feed Item Creation Logic
```javascript
// Create feed item when achievement unlocked
const createFeedItem = async (data) => {
  const user = await User.findById(data.userId);
  
  const feedItem = await FeedItem.create({
    ...data,
    userName: user.fullName,
    userAvatar: user.avatar
  });
  
  // Update feed item counts
  await FeedItem.updateOne(
    { _id: feedItem._id },
    { $inc: { 'reactions.comments': 0 } }
  );
  
  return feedItem;
};

// Get feed with user reactions
const getFeed = async (userId, options) => {
  const feedItems = await FeedItem.find()
    .sort({ createdAt: -1 })
    .limit(options.limit || 20)
    .skip(options.skip || 0);
  
  const itemsWithReactions = await Promise.all(
    feedItems.map(async (item) => {
      const userReaction = await FeedReaction.findOne({
        feedItemId: item._id,
        userId
      });
      
      const commentCount = await FeedComment.countDocuments({
        feedItemId: item._id
      });
      
      return {
        ...item.toObject(),
        reactions: {
          ...item.reactions,
          comments: commentCount,
          userReaction: userReaction?.reaction
        }
      };
    })
  );
  
  return itemsWithReactions;
};
```

---

## 5. Referral System API

### Database Schema
```javascript
const ReferralSchema = {
  userId: { type: ObjectId, ref: 'User', unique: true },
  code: { type: String, unique: true, required: true },
  totalReferrals: { type: Number, default: 0 },
  activeReferrals: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
};

const ReferralUsageSchema = {
  code: String,
  usedBy: { type: ObjectId, ref: 'User' },
  usedAt: { type: Date, default: Date.now }
};

const ReferralRewardSchema = {
  referralId: { type: ObjectId, ref: 'Referral' },
  type: {
    type: String,
    enum: ['badge', 'feature_unlock', 'premium_access']
  },
  title: String,
  description: String,
  requiredReferrals: Number,
  unlocked: { type: Boolean, default: false },
  unlockedAt: Date
};
```

### API Endpoints

#### GET `/api/referrals/me`
Get current user's referral code
```json
Response:
{
  "success": true,
  "data": {
    "referral": {
      "id": "referral_id",
      "code": "ABC123",
      "totalReferrals": 5,
      "activeReferrals": 3,
      "rewards": [
        {
          "id": "reward_id",
          "type": "badge",
          "title": "First Referral",
          "description": "Invite your first friend",
          "unlocked": true,
          "unlockedAt": "2024-01-10T00:00:00Z"
        }
      ],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### GET `/api/referrals/stats`
Get referral statistics
```json
Response:
{
  "success": true,
  "data": {
    "totalReferrals": 5,
    "activeReferrals": 3,
    "rewardsUnlocked": 2,
    "rank": 15,
    "nextReward": {
      "id": "reward_id",
      "type": "badge",
      "title": "Super Referrer",
      "description": "Invite 10 friends",
      "requiredReferrals": 10
    }
  }
}
```

#### POST `/api/referrals/use`
Use a referral code
```json
Request Body:
{
  "code": "ABC123"
}

Response:
{
  "success": true,
  "message": "Referral code applied successfully"
}
```

#### GET `/api/referrals/leaderboard`
Get referral leaderboard
```json
Query Parameters:
- limit: number (default: 50)

Response:
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "userId": "user_id",
        "userName": "John Doe",
        "totalReferrals": 25,
        "rank": 1
      }
    ]
  }
}
```

### Referral Code Generation
```javascript
const generateReferralCode = (userId) => {
  // Generate unique code (e.g., first 3 letters of name + random numbers)
  const user = await User.findById(userId);
  const prefix = user.fullName.substring(0, 3).toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${random}`;
};

// On user registration
const createReferralCode = async (userId) => {
  let code;
  let exists = true;
  
  while (exists) {
    code = generateReferralCode(userId);
    exists = await Referral.findOne({ code });
  }
  
  return await Referral.create({
    userId,
    code
  });
};

// When referral code is used
const useReferralCode = async (code, userId) => {
  const referral = await Referral.findOne({ code });
  if (!referral) throw new Error('Invalid referral code');
  
  // Check if already used
  const alreadyUsed = await ReferralUsage.findOne({
    code,
    usedBy: userId
  });
  if (alreadyUsed) throw new Error('Code already used');
  
  // Create usage record
  await ReferralUsage.create({
    code,
    usedBy: userId
  });
  
  // Update referral stats
  await Referral.updateOne(
    { _id: referral._id },
    {
      $inc: {
        totalReferrals: 1,
        activeReferrals: 1
      }
    }
  );
  
  // Check and unlock rewards
  await checkReferralRewards(referral._id);
};
```

---

## 6. Savings Goals API

### Database Schema
```javascript
const SavingsGoalSchema = {
  title: String,
  description: String,
  targetAmount: Number,
  currentAmount: { type: Number, default: 0 },
  targetDate: Date,
  participants: [{ type: ObjectId, ref: 'User' }],
  isGroup: { type: Boolean, default: false },
  createdBy: { type: ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  contributions: [{
    userId: { type: ObjectId, ref: 'User' },
    userName: String,
    amount: Number,
    date: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
};
```

### API Endpoints

#### POST `/api/savings-goals`
Create savings goal
```json
Request Body:
{
  "title": "Trip to Goa",
  "description": "Saving for vacation",
  "targetAmount": 50000,
  "targetDate": "2024-06-01T00:00:00Z",
  "friendIds": ["user_id_1", "user_id_2"] // Optional for group goals
}

Response:
{
  "success": true,
  "data": {
    "goal": {
      "id": "goal_id",
      "title": "Trip to Goa",
      "description": "Saving for vacation",
      "targetAmount": 50000,
      "currentAmount": 0,
      "targetDate": "2024-06-01T00:00:00Z",
      "participants": ["user_id"],
      "isGroup": false,
      "status": "active",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### GET `/api/savings-goals`
Get savings goals
```json
Query Parameters:
- status: 'active' | 'completed' | 'cancelled'
- isGroup: boolean

Response:
{
  "success": true,
  "data": {
    "goals": [...]
  }
}
```

#### POST `/api/savings-goals/:goalId/contribute`
Contribute to goal
```json
Request Body:
{
  "amount": 5000
}

Response:
{
  "success": true,
  "message": "Contribution added successfully"
}
```

#### POST `/api/savings-goals/:goalId/join`
Join group goal
```json
Response:
{
  "success": true,
  "message": "Joined goal successfully"
}
```

---

## 7. Comments API

### Database Schema
```javascript
const CommentSchema = {
  transactionId: { type: ObjectId, ref: 'Transaction' },
  userId: { type: ObjectId, ref: 'User' },
  userName: String,
  userAvatar: String,
  text: String,
  reactions: {
    likes: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
};

const CommentReactionSchema = {
  commentId: { type: ObjectId, ref: 'Comment' },
  userId: { type: ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
};
```

### API Endpoints

#### GET `/api/comments/transaction/:transactionId`
Get comments for transaction
```json
Response:
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": "comment_id",
        "transactionId": "transaction_id",
        "userId": "user_id",
        "userName": "John Doe",
        "userAvatar": "url",
        "text": "Nice purchase!",
        "reactions": {
          "likes": 2,
          "userLiked": true
        },
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ]
  }
}
```

#### POST `/api/comments`
Add comment
```json
Request Body:
{
  "transactionId": "transaction_id",
  "text": "Nice purchase!"
}

Response:
{
  "success": true,
  "data": {
    "comment": {
      "id": "comment_id",
      "transactionId": "transaction_id",
      "userId": "user_id",
      "userName": "John Doe",
      "text": "Nice purchase!",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  }
}
```

#### PUT `/api/comments/:commentId`
Update comment
```json
Request Body:
{
  "text": "Updated comment"
}

Response:
{
  "success": true
}
```

#### DELETE `/api/comments/:commentId`
Delete comment
```json
Response:
{
  "success": true
}
```

#### POST `/api/comments/:commentId/like`
Like comment
```json
Response:
{
  "success": true
}
```

---

## 8. Reports API

### API Endpoints

#### POST `/api/reports/generate`
Generate expense report
```json
Request Body:
{
  "format": "pdf", // or "image"
  "dateRange": {
    "start": "2024-01-01T00:00:00Z",
    "end": "2024-01-31T23:59:59Z"
  },
  "bookId": "book_id", // Optional
  "template": "modern", // Optional
  "includeCharts": true
}

Response:
{
  "success": true,
  "data": {
    "id": "report_id",
    "fileUrl": "https://storage.com/reports/report_id.pdf",
    "downloadUrl": "https://api.com/reports/report_id/download",
    "format": "pdf",
    "createdAt": "2024-01-31T23:59:59Z"
  }
}
```

#### GET `/api/reports/:reportId/download`
Download report file

#### POST `/api/reports/:reportId/share`
Generate share URL
```json
Response:
{
  "success": true,
  "data": {
    "shareUrl": "https://app.com/share/report/abc123"
  }
}
```

### Report Generation Logic
```javascript
// Use libraries like pdfkit, jspdf, or canvas for client-side generation
// Or use server-side libraries like puppeteer, pdf-lib

const generateReport = async (userId, options) => {
  const transactions = await Transaction.find({
    userId,
    date: {
      $gte: new Date(options.dateRange.start),
      $lte: new Date(options.dateRange.end)
    }
  });
  
  // Calculate statistics
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.price, 0);
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.price, 0);
  
  // Generate PDF/Image using library
  // Save to storage (S3, Cloudinary, etc.)
  
  const report = await Report.create({
    userId,
    format: options.format,
    fileUrl: savedFileUrl,
    downloadUrl: downloadUrl
  });
  
  return report;
};
```

---

## 9. Database Schemas (Complete)

### User Schema (Extended)
```javascript
const UserSchema = {
  fullName: String,
  email: String,
  phoneNumber: String,
  avatar: String,
  // Add fields for achievements, streaks, etc.
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastTransactionDate: Date,
  totalTransactions: { type: Number, default: 0 },
  totalSavings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
};
```

### Transaction Schema (Existing - may need extension)
```javascript
// Add fields if needed:
- comments: [{ type: ObjectId, ref: 'Comment' }]
- reactions: { likes: Number }
```

---

## 10. Real-time Updates

### WebSocket Events
```javascript
// Using Socket.io or similar

// When achievement unlocked
io.to(userId).emit('achievement_unlocked', {
  achievement: {...}
});

// When challenge progress updates
io.to(challengeId).emit('challenge_update', {
  leaderboard: [...]
});

// When feed item created
io.emit('new_feed_item', {
  item: {...}
});

// When comment added
io.to(transactionId).emit('new_comment', {
  comment: {...}
});
```

---

## Implementation Priority

1. **Phase 1 (Week 1)**: Challenges, Achievements, Stories
2. **Phase 2 (Week 2)**: Social Feed, Referrals
3. **Phase 3 (Week 3)**: Savings Goals, Comments, Reports

---

## Security Considerations

1. **Authentication**: All endpoints require JWT authentication
2. **Authorization**: Users can only access their own data
3. **Rate Limiting**: Prevent abuse of referral system
4. **Input Validation**: Sanitize all user inputs
5. **Privacy**: Respect user privacy settings for feed items

---

## Testing Checklist

- [ ] Challenge creation and joining
- [ ] Achievement unlocking logic
- [ ] Story generation for all types
- [ ] Feed item creation and reactions
- [ ] Referral code generation and usage
- [ ] Savings goal contributions
- [ ] Comment CRUD operations
- [ ] Report generation

---

## Notes

- All dates should be in ISO 8601 format
- All amounts should be in the smallest currency unit (paise for INR)
- Use pagination for all list endpoints
- Implement caching for frequently accessed data
- Use background jobs for heavy computations (achievement checking, report generation)

---

**End of Backend Implementation Prompt**

