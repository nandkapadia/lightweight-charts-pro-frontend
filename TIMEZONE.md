# Timezone Handling Guide

## Core Philosophy

**@lightweight-charts-pro/core does NOT perform any timezone conversions.**

This is an intentional design decision that gives you full control over how times are handled in your application.

## Why No Timezone Conversion?

### 1. **Backend Responsibility**
Your backend/server is the single source of truth for:
- User timezone preferences
- Timezone conversion logic
- Daylight saving time handling
- Historical timezone data

### 2. **Predictability**
- No surprising timezone shifts
- Times display exactly as sent
- No browser timezone interference
- Consistent behavior across environments

### 3. **Flexibility**
- Full control over timezone handling
- Support for multiple timezones in one chart
- Custom display formatting per use case
- No assumptions about user location

### 4. **Library Scope**
This is a charting library, not a timezone library. We focus on:
- Fast, accurate rendering
- Performance optimization
- Chart interactions
- Data visualization

Timezone handling is better left to specialized libraries and your backend.

## How It Works

### Time Normalization

The library **normalizes** different time formats to Unix timestamps (seconds):

```typescript
import { normalizeTime } from '@lightweight-charts-pro/core/utils';

// All of these are normalized WITHOUT conversion:

normalizeTime(1705312800)
// Unix timestamp → 1705312800 (unchanged)

normalizeTime('1705312800')
// Numeric string → 1705312800

normalizeTime('2024-01-15T10:00:00.000Z')
// ISO 8601 UTC → 1705312800

normalizeTime('2024-01-15T10:00:00.000+05:00')
// ISO with offset → 1705312800 (preserves the offset meaning)

normalizeTime({ year: 2024, month: 1, day: 15 })
// BusinessDay → 1705276800 (midnight UTC)
```

**Key Point:** The library treats the input as-is. If your backend sends `'2024-01-15T10:00:00.000Z'`, it's interpreted as UTC. If it sends `'2024-01-15T10:00:00.000+05:00'`, the offset is preserved.

### Time Formatting

By default, times are formatted as **ISO 8601 UTC strings**:

```typescript
import { formatTime } from '@lightweight-charts-pro/core/utils';

formatTime(1705312800);
// Returns: "2024-01-15T10:00:00.000Z"
```

You can provide **custom formatters** for display:

```typescript
import { TemplateEngine } from '@lightweight-charts-pro/core/services';

const engine = TemplateEngine.getInstance();

const result = engine.processTemplate(
  'Time: $$time$$',
  { seriesData: { time: 1705312800 } },
  {
    timeFormatter: (timestamp) => {
      const date = new Date(timestamp * 1000);
      // Format in user's preferred timezone
      return date.toLocaleString('en-US', {
        timeZone: 'America/New_York',
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    }
  }
);
```

## Implementation Patterns

### Pattern 1: Backend Converts (Recommended)

**Backend determines user timezone and converts all data:**

```python
# Python/FastAPI backend
from datetime import datetime
import pytz

def get_chart_data(user_id: str):
    # Get user's timezone preference
    user_tz = get_user_timezone(user_id)  # e.g., 'America/New_York'

    # Get data from database (stored in UTC)
    data = db.query(ChartData).all()

    # Convert to user's timezone
    result = []
    for point in data:
        # point.timestamp is UTC
        utc_dt = datetime.fromtimestamp(point.timestamp, tz=pytz.UTC)
        user_dt = utc_dt.astimezone(pytz.timezone(user_tz))

        result.append({
            'time': int(user_dt.timestamp()),
            'value': point.value
        })

    return result
```

**Frontend receives already-converted data:**

```typescript
const response = await fetch('/api/chart-data');
const data = await response.json();

// Data is already in user's timezone
series.setData(data);
```

### Pattern 2: Frontend Formats Display

**Backend sends UTC, frontend formats for display:**

```python
# Backend sends UTC timestamps
def get_chart_data():
    data = db.query(ChartData).all()
    return [
        {
            'time': int(point.timestamp.timestamp()),  # UTC
            'value': point.value
        }
        for point in data
    ]
```

```typescript
// Frontend formats for user's timezone
const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const legend = new LegendPrimitive({
  template: 'Time: $$time$$ - Value: $$value$$',
  timeFormatter: (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('default', {
      timeZone: userTimezone,
      dateStyle: 'short',
      timeStyle: 'short'
    });
  }
});
```

### Pattern 3: Multiple Timezones

**Display data from different timezones on the same chart:**

```typescript
// Data from multiple exchanges with different timezones
const nyseData = await fetch('/api/nyse-data').then(r => r.json());
const tokyoData = await fetch('/api/tokyo-data').then(r => r.json());

// Each dataset maintains its own timezone
const nyseSeries = chart.addLineSeries();
nyseSeries.setData(nyseData);  // Times in EST

const tokyoSeries = chart.addLineSeries();
tokyoSeries.setData(tokyoData);  // Times in JST

// Legend shows the timezone for each series
const nyseLegend = new LegendPrimitive({
  template: 'NYSE (EST): $$time$$',
  timeFormatter: (ts) => new Date(ts * 1000).toLocaleString('en-US', {
    timeZone: 'America/New_York'
  })
});

const tokyoLegend = new LegendPrimitive({
  template: 'Tokyo (JST): $$time$$',
  timeFormatter: (ts) => new Date(ts * 1000).toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo'
  })
});
```

## Common Scenarios

### Scenario 1: User Changes Timezone Preference

```typescript
// User selects new timezone from dropdown
async function handleTimezoneChange(newTimezone: string) {
  // Re-fetch data with new timezone
  const response = await fetch('/api/chart-data', {
    headers: { 'X-User-Timezone': newTimezone }
  });

  const data = await response.json();

  // Update chart with re-converted data
  series.setData(data);
}
```

### Scenario 2: Historical Data

```typescript
// Historical data might not match current DST rules
// Backend handles historical timezone conversion
const historicalData = await fetch('/api/historical-data', {
  params: {
    start: '2020-01-01',
    end: '2020-12-31',
    timezone: 'America/New_York'  // Backend applies correct historical DST
  }
});
```

### Scenario 3: Real-Time Updates

```typescript
// WebSocket sends new data points
websocket.on('trade', (trade) => {
  // Backend sends timestamp already in user's timezone
  series.update({
    time: trade.timestamp,
    value: trade.price
  });
});
```

## Migration from Auto-Conversion

If you previously relied on automatic timezone conversion, here's how to migrate:

### Before (Old Behavior)

```typescript
// ❌ Old code that expected auto-conversion
const data = [
  { time: '2024-01-15T10:00:00Z', value: 100 }
];

series.setData(data);
// OLD: Library would convert '10:00:00 UTC' to browser's local time
// e.g., displayed as '5:00 AM EST' automatically
```

### After (New Behavior)

**Option A: Backend Converts**
```python
# Backend converts to user's timezone
user_tz = pytz.timezone('America/New_York')
converted_time = utc_time.astimezone(user_tz)
timestamp = int(converted_time.timestamp())
```

```typescript
// ✅ Frontend receives already-converted data
const data = [
  { time: 1705329600, value: 100 }  // Already EST
];

series.setData(data);
```

**Option B: Frontend Formats Display**
```typescript
// ✅ Backend sends UTC, frontend formats
const data = [
  { time: 1705312800, value: 100 }  // UTC
];

series.setData(data);

// Use custom formatter for display
const legend = new LegendPrimitive({
  template: '$$time$$',
  timeFormatter: (ts) => {
    const date = new Date(ts * 1000);
    return date.toLocaleString('default', {
      timeZone: 'America/New_York'
    });
  }
});
```

## Performance Considerations

### Binary Search Optimization

The library uses **O(log n) binary search** for time operations:

```typescript
import { createSortedTimeArray, findNearestTimestamp } from '@lightweight-charts-pro/core/utils';

// Pre-sort times once
const chartTimes = data.map(d => d.time);
const sortedTimes = createSortedTimeArray(chartTimes);
// O(n log n) - done once

// Find nearest timestamp for markers/overlays
const nearestTime = findNearestTimestamp(markerTime, sortedTimes);
// O(log n) - very fast, even with 10,000+ points
```

**Performance Benefits:**
- 100 markers × 10,000 bars: **~11,300 operations** (with binary search)
- vs. **1,000,000 operations** (with linear scan)
- **~90x faster** for typical workloads

## Testing

The library includes comprehensive tests to ensure NO timezone conversion occurs:

```typescript
// From timeNormalization.test.ts
it('should NEVER apply local timezone conversion', () => {
  const utcIsoString = '2024-01-15T10:00:00.000Z';
  const normalized = normalizeTime(utcIsoString);
  const formatted = formatTime(normalized);

  // Should round-trip without conversion
  expect(formatted).toBe(utcIsoString);
});

it('should treat all times as opaque values', () => {
  const timestamp = 1705312800;
  const isoString = '2024-01-15T10:00:00.000Z';
  const numericString = '1705312800';

  // All should normalize to the same value
  expect(normalizeTime(timestamp)).toBe(1705312800);
  expect(normalizeTime(isoString)).toBe(1705312800);
  expect(normalizeTime(numericString)).toBe(1705312800);
});
```

## Troubleshooting

### Problem: Times display incorrectly

**Cause:** Backend is sending times in one timezone, but you expect another.

**Solution:** Verify what your backend is sending:

```typescript
console.log('Raw time value:', data[0].time);
console.log('Normalized:', normalizeTime(data[0].time));
console.log('Formatted (UTC):', formatTime(normalizeTime(data[0].time)));
```

### Problem: Markers don't align with chart data

**Cause:** Marker times and chart data times are in different timezones.

**Solution:** Ensure both use the same timezone (convert on backend):

```python
# Backend ensures consistency
def get_chart_with_markers(user_tz):
    user_timezone = pytz.timezone(user_tz)

    # Convert both chart data AND markers to same timezone
    chart_data = convert_to_timezone(raw_chart_data, user_timezone)
    markers = convert_to_timezone(raw_markers, user_timezone)

    return {
        'data': chart_data,
        'markers': markers
    }
```

### Problem: Different times in legend vs tooltip

**Cause:** Using different formatters or timezone settings.

**Solution:** Use consistent time formatting:

```typescript
// Create a shared time formatter
const userTimezone = 'America/New_York';
const timeFormatter = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('default', {
    timeZone: userTimezone,
    dateStyle: 'short',
    timeStyle: 'short'
  });
};

// Use same formatter everywhere
const legend = new LegendPrimitive({
  template: '$$time$$',
  timeFormatter
});

const tooltip = new TooltipPrimitive({
  template: '$$time$$',
  timeFormatter
});
```

## Related Libraries

For timezone-specific operations, consider using:

- **Luxon**: Modern timezone library for JavaScript
- **date-fns-tz**: Timezone support for date-fns
- **Moment Timezone**: Classic timezone library (now in maintenance mode)
- **Backend**: Python `pytz`, Java `ZoneId`, etc.

## Summary

| What | Responsibility |
|------|---------------|
| **Timezone Conversion** | Backend |
| **Time Normalization** | Library |
| **Time Formatting (default)** | Library (ISO 8601 UTC) |
| **Time Formatting (custom)** | Your Code (via formatters) |
| **DST Handling** | Backend |
| **Historical Timezone Rules** | Backend |
| **User Timezone Preference** | Backend |

**Key Takeaway:** The library is intentionally timezone-agnostic. It normalizes, formats, and optimizes time operations, but never converts between timezones. This gives you complete control and predictability.

## Further Reading

- [Time Normalization API Documentation](./src/utils/timeNormalization.ts)
- [Template Engine API Documentation](./src/services/TemplateEngine.ts)
- [Test Suite](./src/__tests__/utils/timeNormalization.test.ts)
- [Code Review Discussion](https://github.com/nandkapadia/lightweight-charts-pro-frontend/issues)
