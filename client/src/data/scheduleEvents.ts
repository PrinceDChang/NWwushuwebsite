export type ScheduleEvent = {
  id: string;
  title: string;
  dateLabel: string;
  detail?: string;
};

/** Upcoming school events and holiday closures. Add items here as they are announced. */
export const scheduleEvents: ScheduleEvent[] = [];
