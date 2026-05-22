export interface TimelineEvent {
  id: number;
  timeStr: string;
  timeSec: number;
  name: string;
}

export const M3S_TIMELINE: TimelineEvent[] = [
  { id: 1, timeSec: 11.2, timeStr: "00:11.2", name: "野蠻碎擊" },
  { id: 2, timeSec: 20.5, timeStr: "00:20.5", name: "拳面猛擊*4" },
  { id: 3, timeSec: 37.6, timeStr: "00:37.6", name: "金臂鈎" },
  { id: 4, timeSec: 51.8, timeStr: "00:51.8", name: "強震衝+野蠻碎擊" },
  { id: 5, timeSec: 87.5, timeStr: "01:27.5", name: "踩塔爆炸" },
  { id: 6, timeSec: 143.6, timeStr: "02:23.6", name: "金臂鈎" },
  { id: 7, timeSec: 157.8, timeStr: "02:37.8", name: "強震衝+野蠻碎擊" },
  { id: 8, timeSec: 177.4, timeStr: "02:57.4", name: "拳面猛擊*6" },
  { id: 9, timeSec: 226.7, timeStr: "03:46.7", name: "金臂鈎+野蠻碎擊" },
  { id: 10, timeSec: 265.9, timeStr: "04:25.9", name: "長短炸彈爆炸" },
  { id: 11, timeSec: 282.1, timeStr: "04:42.1", name: "強震衝" },
  { id: 12, timeSec: 305.0, timeStr: "05:05.0", name: "踩引信-1" },
  { id: 13, timeSec: 325.0, timeStr: "05:25.0", name: "踩引信-2" },
  { id: 14, timeSec: 354.4, timeStr: "05:54.4", name: "拳面猛擊*6" },
  { id: 15, timeSec: 391.9, timeStr: "06:31.9", name: "超豪華野蠻大亂擊-1" },
  { id: 16, timeSec: 395.4, timeStr: "06:35.4", name: "超豪華野蠻大亂擊-2+野蠻爆震" },
  { id: 17, timeSec: 474.8, timeStr: "07:54.8", name: "強震衝+野蠻碎擊" },
  { id: 18, timeSec: 497.8, timeStr: "08:17.8", name: "拳面猛擊*8" },
  { id: 19, timeSec: 537.7, timeStr: "08:57.7", name: "炸彈爆炸" },
  { id: 20, timeSec: 548.2, timeStr: "09:08.2", name: "金臂鈎+野蠻碎擊" },
  { id: 21, timeSec: 615.2, timeStr: "10:15.2", name: "拳面猛擊*8" },
  { id: 22, timeSec: 658.2, timeStr: "10:58.2", name: "究極超豪華野蠻大亂擊" }
];
