import React, { useState, useMemo } from 'react';
import { View, StyleSheet, LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';
import Svg, { Polygon, Line, Text as SvgText, G } from 'react-native-svg';

export interface FunnelData {
    basics: number;
    text: number;
    image: number;
    video: number;
    voice: number;
    multimodal: number;
}

interface FunnelChartProps {
    data: FunnelData;
    scale?: number;
    showLabels?: boolean; // New prop to toggle labels
    lineColor?: string;
    contentContainerStyle?: StyleProp<ViewStyle>;
}

const KEYS: (keyof FunnelData)[] = [
    'basics',
    'text',
    'image',
    'video',
    'voice',
    'multimodal',
];

const LABELS: Record<keyof FunnelData, string> = {
    basics: 'Basics',
    text: 'Text',
    image: 'Image',
    video: 'Video',
    voice: 'Voice',
    multimodal: 'Multimodel',
};

const FunnelChart: React.FC<FunnelChartProps> = ({
    data,
    scale = 1.0,
    showLabels = true,
    lineColor = '#f5f5f5',
    contentContainerStyle
}) => {
    const [layout, setLayout] = useState({ width: 0, height: 0 });

    const onLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setLayout({ width, height });
    };

    const safeData = useMemo(() => {
        const sanitized = {} as FunnelData;
        KEYS.forEach((key) => {
            const val = data[key] ?? 0;
            sanitized[key] = Math.max(0, Math.min(100, val));
        });
        return sanitized;
    }, [data]);

    const gridPoints = useMemo(() => {
        const { width, height } = layout;
        if (width === 0 || height === 0) return [];

        const numItems = KEYS.length;
        const centerX = width / 2;
        const horizontalBounds = width * scale;

        const verticalPadding = 2;
        const usableHeight = height - (verticalPadding * 2);
        const rowSpacing = usableHeight / (numItems - 1); // Fixed calculation to use full height

        return KEYS.map((key, index) => {
            const percentage = safeData[key];
            const yPos = verticalPadding + (index * rowSpacing);
            const barWidth = (percentage / 100) * horizontalBounds;

            return {
                label: LABELS[key],
                y: yPos,
                xLeft: centerX - (barWidth / 2),
                xRight: centerX + (barWidth / 2)
            };
        });
    }, [layout, safeData, scale]);

    const polygonPoints = useMemo(() => {
        if (gridPoints.length === 0) return "";
        const leftSide = gridPoints.map(p => `${p.xLeft},${p.y}`).join(' ');
        const rightSide = [...gridPoints].reverse().map(p => `${p.xRight},${p.y}`).join(' ');
        return `${leftSide} ${rightSide}`;
    }, [gridPoints]);

    return (
        <View style={[styles.container, contentContainerStyle]} onLayout={onLayout}>
            {layout.width > 0 && (
                <Svg width={layout.width} height={layout.height}>
                    {/* 1. The Funnel Shape */}
                    <Polygon points={polygonPoints} fill="#A5B4FC" />

                    {/* 2. Lines and Labels */}
                    {gridPoints.map((point, index) => {
                        const isFirst = index === 0;
                        const isLast = index === gridPoints.length - 1;
                        const fontSize = 9 * scale;
                        const centerX = layout.width / 2;

                        // Gap calculation only matters if showLabels is true
                        const textGap = showLabels ? point.label.length * (fontSize * 0.55) + 8 : 0;

                        return (
                            <G key={`row-${index}`}>
                                {/* LINE DRAWING LOGIC:
                   If showLabels is false, OR it's the first/last row, draw a solid line.
                   Otherwise, draw the two segments with a gap.
                */}
                                {!showLabels || isFirst || isLast ? (
                                    <Line
                                        x1="0"
                                        y1={point.y}
                                        x2={layout.width}
                                        y2={point.y}
                                        stroke={lineColor}
                                        strokeWidth="0.5"
                                    />
                                ) : (
                                    <>
                                        <Line
                                            x1="0"
                                            y1={point.y}
                                            x2={centerX - textGap / 2}
                                            y2={point.y}
                                            stroke={lineColor}
                                            strokeWidth="0.5"
                                        />
                                        <Line
                                            x1={centerX + textGap / 2}
                                            y1={point.y}
                                            x2={layout.width}
                                            y2={point.y}
                                            stroke={lineColor}
                                            strokeWidth="0.5"
                                        />
                                    </>
                                )}

                                {/* TEXT RENDERING LOGIC: Only render if showLabels is true */}
                                {showLabels && (
                                    <SvgText
                                        x={centerX}
                                        y={point.y}
                                        fontSize={fontSize}
                                        fontWeight="400"
                                        fill="#000000"
                                        textAnchor="middle"
                                        alignmentBaseline={isFirst ? "hanging" : isLast ? "baseline" : "middle"}
                                    >
                                        {point.label}
                                    </SvgText>
                                )}
                            </G>
                        );
                    })}
                </Svg>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
    },
});

export default FunnelChart;