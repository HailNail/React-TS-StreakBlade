import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "react-tooltip/dist/react-tooltip.css";
import { endOfToday, subMonths, format } from "date-fns";
import { Tooltip } from "react-tooltip";

interface HistoryWithHeatmapProps {
  history: string[];
}

const HistoryWithHeatmap = ({ history }: HistoryWithHeatmapProps) => {
  const checkins = history.reduce((acc, date) => {
    const key = new Date(date).toISOString().split("T")[0];
    acc[key] = true;
    return acc;
  }, {} as Record<string, boolean>);

  const values = Object.keys(checkins).map((date) => ({
    date,
    count: checkins[date] ? 1 : 0,
  }));

  return (
    <div className="heatmap-containerp-2">
      <CalendarHeatmap
        startDate={subMonths(endOfToday(), 3)}
        endDate={endOfToday()}
        values={values}
        classForValue={(value) => {
          if (!value || value.count === undefined) return "color-empty";
          return value.count > 0 ? "color-filled" : "color-empty";
        }}
        gutterSize={2}
        showWeekdayLabels
        showOutOfRangeDays={false}
        tooltipDataAttrs={(value) => {
          if (!value?.date) return {} as Record<string, string>;
          const date = new Date(value.date);
          return {
            "data-tooltip-id": "history-heatmap-tooltip",
            "data-tooltip-content": `${format(
              date,
              "MMM d, yyyy"
            )}: "Was tempted"`,
          };
        }}
      />
      <Tooltip id="history-heatmap-tooltip" />
    </div>
  );
};

export default HistoryWithHeatmap;
