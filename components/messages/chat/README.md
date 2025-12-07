# Chat Components

This directory contains the modular chat components used in the messaging feature of the CoderServe Native app.

## Overview

The chat functionality has been refactored into reusable, well-documented components. Each component has a specific responsibility and can be understood independently.

## Component Architecture

```
components/messages/chat/
├── types.ts              # TypeScript type definitions
├── utils.ts              # Utility functions
├── ChatHeader.tsx        # Top navigation bar
├── MessageBubble.tsx     # Individual message display
├── ChatInput.tsx         # Message composition area
├── DateSeparator.tsx     # Date labels between messages
└── MenuOption.tsx        # Message action menu items
```

## Components

### `ChatHeader.tsx`

**Purpose**: Displays the header bar at the top of the chat screen.

**Features**:
- Shows recipient's profile picture and name
- Menu button to access chat options
- Safe area inset handling for notched devices

**Props**:
- `first_name` - Display name of the chat recipient
- `profile_image` - Profile image URL
- `menuRef` - Reference to the bottom sheet menu

---

### `MessageBubble.tsx`

**Purpose**: Renders individual messages in the chat conversation.

**Features**:
- Supports three content types: text, images, and upload progress
- Different styling for current user vs other user
- Speech bubble tails for message grouping
- Long-press to open edit/delete menu
- Shows "Edited" label for modified messages
- Timestamp display

**Props**:
- `message` - Message object with all message data
- `currentUserId` - Username of the current user
- `openMessageMenu` - Callback to open message options

**Message States**:
1. **Text Message**: Displays text content
2. **Image Message**: Shows file info, opens full-screen viewer on tap
3. **Uploading**: Shows upload progress with percentage

---

### `ChatInput.tsx`

**Purpose**: The input area where users compose and send messages.

**Features**:
- Multiline text input with auto-expanding height
- Keyboard-aware layout with smooth animations
- Safe area inset handling
- Dual-purpose send button (send text or attach image)
- Disabled state with different messages for different scenarios

**Props**:
- `value` - Current text input value
- `onChange` - Text change callback
- `onSend` - Send button callback
- `onPickImage` - Image picker callback
- `disabled` - Whether send is disabled
- `chatDisabled` - Server-side messaging disabled
- `chat_blocked` - Whether chat is blocked
- `otherUserName` - Other user's name
- `blocked` - Whether current user blocked the other

**States**:
- **Active**: Shows text input and send/attach button
- **Disabled**: Shows appropriate message based on reason (blocked, messaging disabled, etc.)

---

### `DateSeparator.tsx`

**Purpose**: Displays date labels between messages from different days.

**Features**:
- Centers date label horizontally
- Formats dates as "Today", "Yesterday", or "DD MMM YYYY"

**Props**:
- `date` - Formatted date string to display

---

### `MenuOption.tsx`

**Purpose**: Displays actionable menu items with countdown timers for message actions.

**Features**:
- Real-time countdown timer (updates every second)
- Automatically hides when time expires
- Formatted time display (MM:SS)
- Visual timer badge

**Props**:
- `title` - Option title (e.g., "Edit Message")
- `subTitle` - Description of the action
- `pressTimer` - Time limit in minutes (default: 15)
- `onPress` - Callback when option is pressed
- `messageTime` - Message creation timestamp

**Usage**:
Used in the message action menu to show Edit (15 min window) and Delete (30 min window) options.

---

## Type Definitions (`types.ts`)

### `Message`
Represents a single chat message.

**Key Fields**:
- `id` - Unique identifier
- `text` - Message text content (null for images)
- `imageUrl` - Image URL if image message
- `createdAt` - ISO timestamp
- `timestamp` - Formatted time (e.g., "3:45 PM")
- `senderId` - Username of sender
- `edited` - Whether message was edited
- `isFirstInGroup` - Whether first in group (for tail styling)

**Upload State Fields** (only during upload):
- `localUri` - Local device URI
- `uploadProgress` - Progress as decimal (0.0 to 1.0)
- `fileName` - File name
- `fileSize` - Size in bytes
- `error` - Error message if failed

### `DateSeparator`
Represents a date separator in the chat list.

**Fields**:
- `id` - Unique identifier
- `date` - Formatted date string
- `isSeparator` - Discriminator (always true)

### `ChatListItem`
Union type of `Message | DateSeparator` for FlatList rendering.

---

## Utility Functions (`utils.ts`)

### `extractImageInfo(path: string)`

Extracts file information from an image path.

**Returns**:
- `filename` - Complete filename with extension
- `fileType` - Uppercase file extension (e.g., "JPG")
- `uuid` - Filename without extension

**Example**:
```typescript
extractImageInfo("/uploads/abc123.jpg")
// Returns: { filename: "abc123.jpg", fileType: "JPG", uuid: "abc123" }
```

---

## Usage Example

```tsx
import ChatHeader from '@/components/messages/chat/ChatHeader';
import MessageBubble from '@/components/messages/chat/MessageBubble';
import ChatInput from '@/components/messages/chat/ChatInput';
import DateSeparator from '@/components/messages/chat/DateSeparator';
import MenuOption from '@/components/messages/chat/MenuOption';
import { Message, ChatListItem } from '@/components/messages/chat/types';

// In your chat screen:
<ChatHeader 
  first_name={otherUser.name}
  profile_image={otherUser.image}
  menuRef={menuRef}
/>

<FlatList
  data={chatListItems}
  renderItem={({ item }) => 
    'isSeparator' in item 
      ? <DateSeparator date={item.date} />
      : <MessageBubble 
          message={item} 
          currentUserId={currentUser}
          openMessageMenu={handleOpenMenu}
        />
  }
/>

<ChatInput
  value={inputText}
  onChange={setInputText}
  onSend={handleSend}
  onPickImage={handlePickImage}
  chatDisabled={chatData.messaging_disabled}
  chat_blocked={chatData.chat_blocked}
/>
```

---

## Message Action Flow

1. User long-presses a message (within 30 minutes of sending)
2. `MessageBubble` calls `openMessageMenu(messageId)`
3. Bottom sheet opens with `MenuOption` components
4. Edit option shows if within 15 minutes
5. Delete option shows if within 30 minutes
6. Each option displays countdown timer
7. Timer automatically hides option when expired

---

## Keyboard Handling

The `ChatInput` component uses animated values to smoothly adjust bottom margin when the keyboard opens/closes:

1. Listens to keyboard show/hide events
2. Animates margin from safe area bottom to 0
3. Ensures input stays above keyboard
4. 180ms smooth transition

---

## Styling Approach

- Component-specific styles defined in each file
- Uses StyleSheet.create for performance
- Supports safe area insets for modern devices
- Responsive to keyboard and screen changes
- Dynamic styling based on message sender and state

---

## Future Improvements

- Add support for voice messages
- Implement message reactions
- Add read receipts for group chats
- Support for message forwarding
- Rich text formatting options
