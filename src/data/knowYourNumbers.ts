export interface HealthMetric {
  number: number;
  name: string;
  value: string;
  preferred: string;
  description: string;
  featured?: boolean;
  threshold?: boolean;
}

export interface HealthMetricGroup {
  id: string;
  title: string;
  metrics: HealthMetric[];
}

export interface WorksheetState {
  askGlucose: boolean;
  askInsulin: boolean;
  collectionDate: string;
  fastingHours: string;
  glucose: string;
  insulin: string;
  notes: string;
}

export const EMPTY_WORKSHEET_STATE: WorksheetState = {
  askGlucose: false,
  askInsulin: false,
  collectionDate: '',
  fastingHours: '',
  glucose: '',
  insulin: '',
  notes: '',
};

export const KNOW_YOUR_NUMBERS = {
  title: 'Know Your Numbers',
  subtitle: 'Seven measures to discuss with your doctor',
  introduction:
    'Use this field guide to prepare for a conversation about metabolic health. Your clinician can help interpret each measure in the context of your health history.',
  groups: [
    {
      id: 'blood-sugar',
      title: 'Blood Sugar & Insulin',
      metrics: [
        {
          number: 1,
          name: 'Fasting glucose',
          value: 'Below 100 mg/dL',
          preferred: 'Preferred range: 70–99 mg/dL',
          description: 'Measures blood sugar after an overnight fast.',
        },
        {
          number: 2,
          name: 'Fasting insulin',
          value: '2–6 µIU/mL',
          preferred: 'Preferred: below 5 µIU/mL',
          description: 'Shows how much insulin the body needs while fasting.',
        },
        {
          number: 3,
          name: 'HOMA-IR',
          value: 'Below 2',
          preferred: 'Preferred: below 1.5',
          description: 'Calculated from fasting glucose and fasting insulin.',
          featured: true,
        },
        {
          number: 4,
          name: 'Hemoglobin A1C',
          value: 'Below 5.7%',
          preferred: 'Preferred: below 5.4%',
          description: 'Reflects average blood sugar over roughly 2–3 months.',
        },
      ],
    },
    {
      id: 'blood-fats',
      title: 'Blood Fats',
      metrics: [
        {
          number: 5,
          name: 'Triglyceride / HDL ratio',
          value: 'Below 2',
          preferred: 'Preferred: below 1',
          description: 'A ratio your clinician can use in a broader metabolic assessment.',
        },
      ],
    },
    {
      id: 'metabolic-syndrome',
      title: 'Metabolic Syndrome Indicators',
      metrics: [
        {
          number: 6,
          name: 'Waist circumference',
          value: 'Men: over 40 in · Women: over 35 in',
          preferred: 'Metabolic syndrome risk threshold',
          description: 'Waist size is one indicator used when assessing metabolic syndrome.',
          threshold: true,
        },
        {
          number: 7,
          name: 'Blood pressure',
          value: '130/85 mmHg or higher',
          preferred: 'Metabolic syndrome risk threshold',
          description: 'Blood pressure is one indicator used when assessing metabolic syndrome.',
          threshold: true,
        },
      ],
    },
  ] as HealthMetricGroup[],
  apoeNote:
    'Ask whether knowing your APOE genetic status would be useful in your individual care plan.',
  calculator: {
    title: 'Calculate Your HOMA-IR',
    subtitle:
      'A quick check for insulin resistance using two results from the same fasting blood draw.',
    divisor: 405,
    units: {
      glucose: 'mg/dL',
      insulin: 'µIU/mL',
    },
    steps: [
      {
        number: 1,
        title: 'Ask',
        body: 'Ask your doctor for fasting glucose and fasting insulin from the same fasting blood draw.',
      },
      {
        number: 2,
        title: 'Record',
        body: 'Record the collection date, fasting duration, and both lab values.',
      },
      {
        number: 3,
        title: 'Calculate',
        body: 'Multiply glucose by insulin, then divide by 405.',
      },
      {
        number: 4,
        title: 'Understand Your Result',
        body: 'A general reference threshold is below 2; the preferred range presented here is below 1.5.',
      },
      {
        number: 5,
        title: 'Notes & Questions',
        body: 'Write down questions or context you want to discuss with your clinician.',
      },
    ],
  },
  clinicianPrompt:
    'Could we check my fasting glucose and fasting insulin from the same blood draw and discuss what the results mean for me?',
  disclaimer:
    'This handout is for educational purposes only. It is not a substitute for professional medical advice. Lab interpretation and personal targets should be reviewed with a qualified healthcare professional.',
  print: {
    side1Footer: 'Track these. Share them. Improve your health together.',
    side2Footer: 'Keep this with your health records.',
    duplexNote: 'Print at 100% · Double-sided · Flip on short edge',
    sheetNote: 'Print landscape at 100% · Cut at center',
  },
} as const;

export function calculateHomaIR(
  glucoseValue: string,
  insulinValue: string,
  divisor = KNOW_YOUR_NUMBERS.calculator.divisor,
): string {
  const glucose = Number.parseFloat(glucoseValue);
  const insulin = Number.parseFloat(insulinValue);

  if (!Number.isFinite(glucose) || !Number.isFinite(insulin) || glucose <= 0 || insulin <= 0) {
    return '';
  }

  return ((glucose * insulin) / divisor).toFixed(2);
}
