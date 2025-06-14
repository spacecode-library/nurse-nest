
export interface StatisticItem {
  number: string;
  description: string;
  source: string;
  targetValue: number;
  suffix: string;
}

export const statisticsData: StatisticItem[] = [
  {
    number: "84",
    description: "of seniors prefer in-home care over nursing facilities",
    source: "AARP Home Preferences Survey, 2024",
    targetValue: 84,
    suffix: "%",
  },
  {
    number: "40",
    description: "lower readmission rates with dedicated private nursing support",
    source: "JAMA Network Open, 2023",
    targetValue: 40,
    suffix: "%",
  },
  {
    number: "78",
    description: "of new parents cite lack of overnight newborn care as top stressor",
    source: "National Parenting Association, 2024",
    targetValue: 78,
    suffix: "%",
  },
  {
    number: "70",
    description: "of families report inadequate discharge planning for home care",
    source: "HHS Office of Inspector General, 2023",
    targetValue: 70,
    suffix: "%",
  },
  {
    number: "30",
    description: "average savings per hour using nurse contractors vs home health agencies",
    source: "Genworth Cost of Care Analysis, 2024",
    targetValue: 30,
    suffix: "%",
  },
  {
    number: "92",
    description: "higher satisfaction with personalized care continuity",
    source: "McKinsey Home Care Survey, 2023",
    targetValue: 92,
    suffix: "%",
  },
];
