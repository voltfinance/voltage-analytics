import { AreaClosed, Bar } from "@visx/shape";
import { AxisBottom, AxisLeft, AxisRight } from "@visx/axis";
import { Grid, GridColumns, GridRows } from "@visx/grid";
import {
  Tooltip,
  TooltipWithBounds,
  defaultStyles,
  withTooltip,
} from "@visx/tooltip";
import { currencyFormatter, fuseFormatter, oneMonth, oneWeek } from "app/core";
import { scaleLinear, scaleTime } from "@visx/scale";
import { useCallback, useEffect, useMemo, useState } from "react";

import ChartOverlay from "./ChartOverlay";
import { GradientTealBlue, LinearGradient } from "@visx/gradient";
import { Group } from "@visx/group";
import { bisector } from "d3-array";
import { deepPurple } from "@material-ui/core/colors";
import { localPoint } from "@visx/event";
import millify from "millify";
import { timeFormat } from "d3-time-format";
import CurrencyPicker from "./CurrencyPicker";

const tooltipStyles = {
  ...defaultStyles,
  background: "#fff",
  border: "1px solid white",
  color: "inherit",
  zIndex: 1702,
};

const getDate = (d) => new Date(d.date);
const bisectDate = bisector((d) => new Date(d.date)).left;
const getValue = (d) => (d && d.hasOwnProperty("value") ? d.value : 0);

const formatDate = timeFormat("%b %d, '%y");

function TVLAreaChart({
  data,
  tooltipDisabled = false,
  overlayEnabled = false,
  title = "",
  width,
  height,
  showTooltip,
  hideTooltip,
  tooltipData,
  tooltipTop = 0,
  tooltipLeft = 0,
  onTimespanChange,
  useUSD,
  setUseUSD,
  margin = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
}) {
  const [timespan, setTimespan] = useState(oneMonth());

  function onTimespanChange(e) {
    if (e.currentTarget.value === "ALL") {
      setTimespan(62802180);
    } else if (e.currentTarget.value === "1W") {
      setTimespan(oneWeek());
    } else if (e.currentTarget.value === "1M") {
      setTimespan(oneMonth());
    }
  }

  function onCurrencySwitch(e) {
    if (e.currentTarget.value === "USD") {
      setUseUSD(true);
    } else if (e.currentTarget.value == "FUSE") {
      setUseUSD(false);
    }
  }

  const filteredData = data.filter((d) => timespan <= d.date);
  var lastData =
    filteredData.length > 1 ? filteredData[filteredData.length - 1] : null;
  const lastDataValue = lastData ? lastData.value : 0;
  const [overlay, setOverlay] = useState({
    title,
    value: useUSD
      ? currencyFormatter.format(lastDataValue)
      : fuseFormatter.format(lastDataValue),
    date: lastData ? lastData.date : 0,
  });

  useEffect(() => {
    var lastData =
      filteredData.length > 1 ? filteredData[filteredData.length - 1] : null;
    const lastDataValue = lastData ? lastData.value : 0;
    setOverlay({
      title,
      value: useUSD
        ? currencyFormatter.format(lastDataValue)
        : fuseFormatter.format(lastDataValue),
      date: lastData ? lastData.date : 0,
    });
  }, [useUSD]);

  // Max
  const xMax = width - margin.left - margin.right;

  const yMax = height - margin.top - margin.bottom;

  // Scales
  const xScale = useMemo(
    () =>
      scaleTime({
        range: [0, xMax],
        domain: [
          Math.min(...filteredData.map(getDate)),
          Math.max(...filteredData.map(getDate)),
        ],
      }),
    [xMax, filteredData]
  );
  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [yMax, 0],
        domain: [
          Math.min(...filteredData.map((d) => getValue(d))),
          Math.max(...filteredData.map((d) => getValue(d))),
        ],
        nice: true,
      }),
    [yMax, filteredData]
  );

  // tooltip handler
  const handleTooltip = useCallback(
    (event) => {
      const { x } = localPoint(event) || { x: 0 };
      const x0 = xScale.invert(x);
      const index = bisectDate(filteredData, x0, 1);
      const d0 = filteredData[index - 1];
      const d1 = filteredData[index];
      let d = d0;
      if (d1 && getDate(d1)) {
        d =
          x0.valueOf() - getDate(d0).valueOf() >
          getDate(d1).valueOf() - x0.valueOf()
            ? d1
            : d0;
      }
      const lastDataValue = d ? d.value : 0;
      setOverlay({
        ...overlay,
        value: useUSD
          ? currencyFormatter.format(lastDataValue)
          : fuseFormatter.format(lastDataValue),
        date: d && d.hasOwnProperty("date") ? d.date : 0,
      });
      showTooltip({
        tooltipData: d,
        tooltipLeft: x,
        tooltipTop: yScale(getValue(d)),
      });
    },
    [showTooltip, yScale, xScale]
  );

  if (width < 10) return null;

  return (
    <div style={{ position: "relative" }}>
      {overlayEnabled && (
        <>
          <ChartOverlay overlay={overlay} onTimespanChange={onTimespanChange} />
          <CurrencyPicker useUSD={useUSD} onCurrencySwitch={onCurrencySwitch} />
        </>
      )}
      <svg width={width} height={height}>
        <LinearGradient id="yellow" from="#f3fc1f" to="#f6f37c00" fromOffset={0.3} />
        <rect x={0} y={0} width={width} height={height} fill="transparent" />

        <Group top={margin.top} left={margin.left}>
          <AreaClosed
            data={filteredData}
            x={(d) => xScale(getDate(d))}
            y={(d) => yScale(getValue(d))}
            yScale={yScale}
            fill="url(#yellow)"
          />
        </Group>
        <Bar
          x={0}
          y={0}
          width={width}
          height={height}
          fill="transparent"
          rx={14}
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={() => {
            const lastDataValue =
              filteredData && filteredData.length > 0
                ? filteredData[filteredData.length - 1].value
                : 0;
            hideTooltip();
            setOverlay({
              ...overlay,
              value: useUSD
                ? currencyFormatter.format(lastDataValue)
                : fuseFormatter.format(lastDataValue),
              date:
                filteredData && filteredData.length
                  ? filteredData[filteredData.length - 1].date
                  : 0,
            });
          }}
        />

        {tooltipData && (
          <Group top={margin.top} left={margin.left}>
            <circle
              cx={tooltipLeft}
              cy={tooltipTop + 1}
              r={4}
              fill="black"
              fillOpacity={0.1}
              stroke="black"
              strokeOpacity={0.1}
              strokeWidth={2}
              pointerEvents="none"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop}
              r={4}
              fill="black"
              stroke="white"
              strokeWidth={2}
              pointerEvents="none"
            />
          </Group>
        )}
      </svg>
      {!tooltipDisabled && tooltipData && (
        <div>
          <Tooltip
            top={margin.top + tooltipTop - 12}
            left={tooltipLeft + 12}
            style={tooltipStyles}
          >
            {`$${millify(getValue(tooltipData))}`}
          </Tooltip>
          <Tooltip
            top={yMax + margin.top - 14}
            left={tooltipLeft}
            style={{
              ...defaultStyles,
              minWidth: 90,
              textAlign: "center",
              transform: "translateX(-50%)",
            }}
          >
            {formatDate(getDate(tooltipData))}
          </Tooltip>
        </div>
      )}
    </div>
  );
}

export default withTooltip(TVLAreaChart);
