import React, { useMemo, useState } from "react";
import { View } from "react-native";
import Svg, { Polyline, Text as SvgText } from "react-native-svg";

type DataPoint = {
    created_at: string;
    rating: number;
};

type Mode = "DAY_7" | "HOUR_24";

type Props = {
    data: DataPoint[];
    mode: Mode;
};

const LineGraph: React.FC<Props> = ({ data, mode }) => {
    const [layout, setLayout] = useState({ width: 0, height: 0 });

    const { values, labelTexts, minY, maxY } = useMemo(() => {
        const now = new Date();

        const bucketHours = mode === "DAY_7" ? 4 : 1;
        const totalBuckets = mode === "DAY_7" ? 42 : 24;
        const hourLabelInterval = 3;

        const bucketMap = new Map<number, number>();

        // ---- Aggregate data (SUM per bucket) ----
        data.forEach(({ created_at, rating }) => {
            const d = new Date(created_at);
            d.setMinutes(0, 0, 0);

            if (mode === "DAY_7") {
                d.setHours(Math.floor(d.getHours() / 4) * 4);
            }

            const key = d.getTime();
            bucketMap.set(key, (bucketMap.get(key) ?? 0) + rating);
        });

        // ---- Build buckets backward (no future dates) ----
        const values: number[] = [];
        const labelTexts: string[] = [];

        const cursor = new Date(now);
        cursor.setMinutes(0, 0, 0);

        if (mode === "DAY_7") {
            cursor.setHours(Math.floor(cursor.getHours() / 4) * 4);
        }

        let seenDays = new Set<string>();

        for (let i = 0; i < totalBuckets; i++) {
            const key = cursor.getTime();
            values.push(bucketMap.get(key) ?? 0);

            if (mode === "DAY_7") {
                const dayKey = cursor.toDateString();
                if (!seenDays.has(dayKey)) {
                    if (dayKey === now.toDateString()) {
                        labelTexts.push("Today");
                    } else {
                        labelTexts.push(
                            `${cursor.getDate()} ${cursor.toLocaleString("en-US", {
                                month: "short",
                            })}`
                        );
                    }
                    seenDays.add(dayKey);
                }
            } else {
                if (cursor.getHours() % hourLabelInterval === 0) {
                    labelTexts.push(`${cursor.getHours()}:00`);
                }
            }

            cursor.setHours(cursor.getHours() - bucketHours);
        }

        values.reverse();
        labelTexts.reverse();

        const rawMin = Math.min(...values);
        const rawMax = Math.max(...values);
        const padding =
            rawMin === rawMax ? 1 : (rawMax - rawMin) * 0.15;

        return {
            values,
            labelTexts,
            minY: rawMin - padding,
            maxY: rawMax + padding,
        };
    }, [data, mode]);

    if (!layout.width || !layout.height) {
        return (
            <View
                style={{ flex: 1 }}
                onLayout={(e) => setLayout(e.nativeEvent.layout)}
            />
        );
    }

    const { width, height } = layout;
    const LABEL_Y = height - 8; // exactly 8px gap from bottom

    return (
        <View
            style={{ flex: 1 }}
            onLayout={(e) => setLayout(e.nativeEvent.layout)}
        >
            <Svg width={width} height={height}>
                {/* Line graph */}
                <Polyline
                    fill="none"
                    stroke="#006dff"
                    strokeWidth={1}
                    points={values
                        .map((v, i) => {
                            const x = (i / (values.length - 1)) * width;
                            const y =
                                height -
                                ((v - minY) / (maxY - minY || 1)) * (height - 20);
                            return `${x},${y}`;
                        })
                        .join(" ")}
                />

                {/* X-axis labels (space-between layout) */}
                {labelTexts.map((label, i) => {
                    const count = labelTexts.length;
                    const ratio = count === 1 ? 0 : i / (count - 1);

                    let anchor: "start" | "middle" | "end" = "middle";
                    if (i === 0) anchor = "start";
                    else if (i === count - 1) anchor = "end";

                    return (
                        <SvgText
                            key={i}
                            x={ratio * width}
                            y={LABEL_Y}
                            fontSize={9}
                            fill="#a6a6a6"
                            textAnchor={anchor}
                        >
                            {label}
                        </SvgText>
                    );
                })}
            </Svg>
        </View>
    );
};

export default LineGraph