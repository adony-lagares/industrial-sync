export type MockTelemetryRecord = {
    equipmentCode: string;
    temperature: number;
    pressure: number;
    timestamp: string;
};

const EQUIPMENT_CODES = ['PUMP-01', 'COMP-02', 'TURB-03', 'VALVE-04'];

const randomInRange = (min: number, max: number) =>
    Math.round((Math.random() * (max - min) + min) * 10) / 10;

/**
 * Generates one synthetic telemetry reading, occasionally out of the safe
 * range so the anomaly styling has something to show off.
 */
export const generateMockReading = (): MockTelemetryRecord => {
    const equipmentCode = EQUIPMENT_CODES[Math.floor(Math.random() * EQUIPMENT_CODES.length)];
    const isAnomaly = Math.random() < 0.15;

    return {
        equipmentCode,
        temperature: isAnomaly ? randomInRange(81, 96) : randomInRange(35, 78),
        pressure: isAnomaly ? randomInRange(46, 58) : randomInRange(10, 43),
        timestamp: new Date().toISOString(),
    };
};

/**
 * Seeds an initial rolling window of readings spaced a few seconds apart,
 * so charts aren't empty on the very first render in demo mode.
 */
export const seedMockTelemetry = (count = 15): MockTelemetryRecord[] =>
    Array.from({ length: count }, (_, i) => ({
        ...generateMockReading(),
        timestamp: new Date(Date.now() - (count - i) * 5000).toISOString(),
    }));
