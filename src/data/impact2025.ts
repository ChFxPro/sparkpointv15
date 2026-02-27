export const HELENE_ONE_YEAR_DATE_ISO = '2025-09-27';
export const HELENE_ONE_YEAR_DATE_LABEL = 'September 27, 2025';

export const IMPACT_2025 = {
  year: 2025,
  eventsLogged: 109,
  eventsWithAttendanceRecorded: 70,
  eventsMissingAttendance: 39,
  attendanceTotalRecordedMinimum: 5866,
  uniqueCollaboratingOrganizationCount: 41,
  monthsActiveProgramming: 12,
  novemberAttendanceMoments: 310,
  anchorProgramAttendance: {
    heleneOneYearOfHealing: 700,
    drOraBrainHealthSeries: 700,
    vosEventsAndProgramming: 1696,
  },
} as const;

export const IMPACT_2025_ANCHOR_ATTENDANCE_TOTAL =
  IMPACT_2025.anchorProgramAttendance.heleneOneYearOfHealing +
  IMPACT_2025.anchorProgramAttendance.drOraBrainHealthSeries +
  IMPACT_2025.anchorProgramAttendance.vosEventsAndProgramming;

export const IMPACT_2025_NOVEMBER_SHARE_PERCENT =
  Math.round(
    (IMPACT_2025.novemberAttendanceMoments / IMPACT_2025.attendanceTotalRecordedMinimum) *
      1000
  ) / 10;
