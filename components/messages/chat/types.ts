/**
 * Represents a single chat message in the conversation.
 * This type handles both text and image messages, as well as upload states.
 */
export type Message = {
    /** Unique identifier for the message */
    id: string;
    /** Text content of the message (null for image-only messages) */
    text: string | null;
    /** URL/path to the image if this is an image message */
    imageUrl?: string | null;
    /** ISO timestamp when the message was created */
    createdAt: string;
    /** Human-readable formatted time (e.g., "3:45 PM") */
    timestamp: string;
    /** Username of the message sender */
    senderId: string;
    /** Whether this message has been edited */
    edited: boolean;
    /** Whether this is the first message in a group from the same sender (for UI styling) */
    isFirstInGroup?: boolean;

    // Local upload state fields (only present during image upload)
    /** Local device URI for the image being uploaded */
    localUri?: string;
    /** Upload progress as a decimal (0.0 to 1.0) */
    uploadProgress?: number;
    /** Name of the file being uploaded */
    fileName?: string;
    /** Size of the file in bytes */
    fileSize?: number;
    /** Error message if upload failed */
    error?: string;
};

/**
 * Represents a date separator shown between messages from different days.
 * This is rendered as a centered date label in the chat.
 */
export type DateSeparator = {
    /** Unique identifier for the separator */
    id: string;
    /** Formatted date string (e.g., "Today", "Yesterday", "5 Dec 2024") */
    date: string;
    /** Discriminator property to identify this as a separator (not a message) */
    isSeparator: true;
};

/**
 * Union type representing any item that can appear in the chat list.
 * This allows the FlatList to render both messages and date separators.
 */
export type ChatListItem = Message | DateSeparator;
