import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import EditorDOM from './EditorDOM';

interface CodeEditorProps {
    code: string;
    setCode: (code: string) => void;
    placeholder?: string;
    setLoading: (loading: boolean) => void;
    language?: 'javascript' | 'python';
}

const CodeEditor: React.FC<CodeEditorProps> = ({
    code,
    setCode,
    language = 'javascript',
    setLoading
}) => {

    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <View style={styles.container}>
            <EditorDOM
                dom={{ matchContents: true }}
                initialCode={code}
                onChange={setCode}
                language={language}
                style={styles.editor}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        minHeight: 150,
        backgroundColor: 'white',
        overflow: 'hidden',
    },
    editor: {
        flex: 1,
        width: '100%',
    }
});

export default CodeEditor;