"use dom";

import React from 'react';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { EditorState, Transaction } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import "@lezer/python";

interface EditorDOMProps {
    initialCode: string;
    onChange: (code: string) => void;
    language: 'javascript' | 'python';
    style?: any;
    dom?: any;
}

export default function EditorDOM({ initialCode, onChange, language }: EditorDOMProps) {
    // If initialCode is empty, start with 14 newlines to show 15 line numbers
    const [code, setCode] = React.useState(initialCode || Array(14).fill('\n').join(''));

    const extensions = [
        language === 'python' ? python() : javascript({ jsx: true }),
        EditorView.lineWrapping,
        EditorView.theme({
            "&": {
                backgroundColor: "white",
                height: "auto",
                // minHeight: "320px" // Removing CSS minHeight to avoid confusion
            },
            ".cm-content": {
                caretColor: "black",
                fontFamily: "Roboto",
                fontSize: "14px",
                marginLeft: "-6px",
                color: "#737373"
                // Removed paddingBottom/minHeight hacks
            },
            ".cm-gutters": {
                backgroundColor: "white",
                color: "#d9d9d9",
                borderRight: "none",
            },
        }),
        EditorState.transactionFilter.of((tr: Transaction) => {
            if (!tr.docChanged) return tr;

            const MIN_LINES = 15;
            const newDoc = tr.newDoc;
            const lines = newDoc.lines;

            // Scenario 1: Needs more newlines to reach MIN_LINES
            // (e.g., initialization or user deletion)
            if (lines < MIN_LINES) {
                const missing = MIN_LINES - lines;
                const changes = { from: newDoc.length, insert: "\n".repeat(missing) }; // Append to end
                return [tr, { changes, sequential: true }];
            }

            // Scenario 2: Maintained > 15 lines but user wants "fixed page" feel?
            // User said: "until I reach the 15th line and press enter than 16th line should be added"
            // This implies: "Don't just keep 15 lines of *content* + extra *empty* lines if I haven't reached them."

            // Implementation: If we have > 15 lines, and the *last* line is empty, AND the user's cursor is *before* that last line...
            // we should remove the trailing empty line to "consume" it.
            // Basically: Keep total lines = MAX(user_content_lines, 15).

            // Let's implement a cleaner check:
            // 1. Get current text content.
            // 2. Identify the "real" end of content (last non-empty line or cursor position).
            // 3. Ensure padding exists *after* that point to reach 15 lines total.

            // HOWEVER, simple robust approach for "page" feel:
            // Just ensure 15 lines exist. If user types and adds a line (lines > 15),
            // CHECK if the LAST line is empty and UNTOUCHED. If so, delete it?

            // Let's stick to the user's simpler request: "initially show 15 lines... 16th line added only if user types"
            // This essentially means: "Pad to 15 lines, but if content grows, stop padding."
            // But if we start with 14 newlines, typing "hello" on line 1 leaves 13 empty newlines at bottom -> Total 15.
            // Pressing Enter on line 1 -> shifts everything down -> Total 16 (1 content, 1 empty, 13 empty).
            // This "shift" is what the user dislikes. They want line 16 to *stay on line 16* (or disappear/be consumed).

            if (lines > MIN_LINES) {
                // Check if the end of the document is a sequence of empty lines that pushes us over limit
                const lastLine = newDoc.line(lines);
                // Only "consume" if the transaction didn't touch the very end (i.e. user isn't typing AT the end)
                // And if the last line is empty.
                if (lastLine.length === 0) {
                    // We can delete the last line to "consume" the buffer
                    // effectively keeping the total count stable until real content pushes it.

                    // Calculate how many lines strictly exceed MIN_LINES
                    const excess = lines - MIN_LINES;
                    if (excess > 0) {
                        // Delete the last 'excess' chars (newlines)
                        // Be careful not to delete user content.

                        // Simple heuristic: If we have excess lines, and they are empty at the end, delete them.
                        const changes = [];
                        let linesToDelete = 0;

                        // Check from bottom up
                        for (let i = 0; i < excess; i++) {
                            const l = newDoc.line(lines - i);
                            if (l.length === 0) {
                                linesToDelete++;
                            } else {
                                break;
                            }
                        }

                        if (linesToDelete > 0) {
                            // Delete from start of (lines - linesToDelete + 1) to end
                            // e.g. 17 lines total. Excessive=2. line 17 empty, line 16 empty.
                            // Delete line 16's newline char and line 17.
                            // Actually, deleting line N's newline char merges N and N+1.
                            // To delete N trailing empty lines: delete from (doc.length - linesToDelete) to doc.length?
                            // No, each empty line is just a `\n` (1 char) mostly, or 0-length content + newline previous.

                            const startPos = newDoc.line(lines - linesToDelete + 1).from - 1; // -1 to include the newline before it
                            // Verify valid range
                            if (startPos >= 0 && startPos < newDoc.length) {
                                return [tr, { changes: { from: startPos, to: newDoc.length }, sequential: true }];
                            }
                        }
                    }
                }
            }

            return tr;
        })
    ];

    const handleChange = (val: string) => {
        setCode(val);
        onChange(val);
    };

    // Handler to focus end of document when clicking on empty space
    const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // We only want to intervene if the click target is the editor container itself
        // or the scrolling area, not if the user clicked accurately on a line of code.
        // CodeMirror handles clicks on content well, so we just check if it wasn't handled 
        // effectively (though CM usually captures events).

        // A simpler strategy: CodeMirror exposes 'cm-editor' and 'cm-scroller'.
        // If we click the 'div' wrapper and NOT the editor content directly (which fills the div),
        // we might not catch it if 'height: auto' makes the editor fill the div exactly.

        // However, the user request is "expanding", so the editor will likely take up the full height.
        // If the user clicks "below" the code but inside the editor area, CodeMirror usually handles this 
        // by putting cursor at end. We just need to make sure the editor expands so there is "area" to click.
    };

    return (
        <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'white' }}>
            <style>{`
            html, body { 
                margin: 0; 
                padding: 0; 
                min-height: 100%; 
                background-color: white;
            }
            .cm-editor { 
                min-height: 100%;
                outline: none !important;
            }
            .cm-scroller {
                overflow: hidden !important; /* Let the native scrollbar handle it */
            }
        `}</style>
            <CodeMirror
                value={code}
                minHeight="100%"
                extensions={extensions}
                onChange={handleChange}
                basicSetup={{
                    lineNumbers: true,
                    foldGutter: true,
                    highlightActiveLine: false,
                    autocompletion: true,
                    highlightActiveLineGutter: false
                }}
            />
        </div>
    );
}
