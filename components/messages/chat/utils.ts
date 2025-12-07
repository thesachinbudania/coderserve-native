/**
 * Extracts file information from an image path.
 * This is used to parse image URLs and display file metadata in the chat.
 * 
 * @param path - The full path to the image file
 * @returns An object containing:
 *   - filename: The complete filename with extension
 *   - fileType: The uppercase file extension (e.g., "JPG", "PNG")
 *   - uuid: The filename without the extension
 * 
 * @example
 * extractImageInfo("/uploads/abc123.jpg")
 * // Returns: { filename: "abc123.jpg", fileType: "JPG", uuid: "abc123" }
 */
export function extractImageInfo(path: string): { filename: string; fileType: string; uuid: string } {
    // Extract just the filename from the full path
    const filename = path.split("/").pop() || "";

    // Get the file extension
    const extension = filename.split(".").pop() || "";

    // Convert extension to uppercase for display
    const fileType = extension.toUpperCase();

    // Get the UUID (filename without extension)
    const uuid = filename.replace(`.${extension}`, "");

    return { filename, fileType, uuid };
}
