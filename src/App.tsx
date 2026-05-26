import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Map as MapIcon, 
  Clock as ClockIcon, 
  Volume2 as Volume2Icon, 
  VolumeX as VolumeXIcon, 
  SkipBack as SkipBackIcon, 
  SkipForward as SkipForwardIcon, 
  Play as PlayIcon, 
  Pause as PauseIcon, 
  RotateCcw as RotateCcwIcon, 
  Flame as FlameIcon, 
  CircleOff as CircleOffIcon, 
  Users as UsersIcon,
  Star as StarIcon,
  Settings as SettingsIcon
} from 'lucide-react';

interface TimelineEvent {
  id: number;
  timeSec: number;
  timeStr: string;
  name: string;
  phase: string;
}

const M2S_TIMELINE: TimelineEvent[] = [
  { id: 0, timeSec: 0.0, timeStr: "00:00.0", name: "倒數10秒", phase: "準備" },
  { id: 1, timeSec: 3.0, timeStr: "00:03.0", name: "攻擊，平A", phase: "" },
  { id: 2, timeSec: 10.2, timeStr: "00:10.2", name: "甜言蜜語，全屏AOE", phase: "" },
  { id: 3, timeSec: 33.5, timeStr: "00:33.5", name: "雨或滴", phase: "" },
  { id: 4, timeSec: 52.3, timeStr: "00:52.3", name: "雨或滴", phase: "" },
  { id: 5, timeSec: 60.6, timeStr: "01:00.6", name: "雙T死刑+信息素", phase: "" },
  { id: 6, timeSec: 79.0, timeStr: "01:19.0", name: "蜂蜂演唱會【首演】，全屏AOE", phase: "" },
  { id: 7, timeSec: 112.6, timeStr: "01:52.6", name: "炸裂，踩塔1", phase: "" },
  { id: 8, timeSec: 116.6, timeStr: "01:56.6", name: "炸裂，踩塔2", phase: "" },
  { id: 9, timeSec: 120.6, timeStr: "02:00.6", name: "炸裂，踩塔3", phase: "" },
  { id: 10, timeSec: 124.6, timeStr: "02:04.6", name: "炸裂，踩塔4", phase: "" },
  { id: 11, timeSec: 128.6, timeStr: "02:08.6", name: "炸裂，踩塔5", phase: "" },
  { id: 12, timeSec: 132.6, timeStr: "02:12.6", name: "炸裂，踩塔6", phase: "" },
  { id: 13, timeSec: 158.1, timeStr: "02:38.1", name: "心病，4心分攤", phase: "" },
  { id: 14, timeSec: 186.8, timeStr: "03:06.8", name: "蜂蜂落幕曲，全屏AOE", phase: "" },
  { id: 15, timeSec: 202.3, timeStr: "03:22.3", name: "雙T死刑", phase: "" },
  { id: 16, timeSec: 253.7, timeStr: "04:13.7", name: "蜂蜂演唱會【再演】，全屏AOE", phase: "" },
  { id: 17, timeSec: 279.8, timeStr: "04:39.8", name: "心病，4心分攤2", phase: "" },
  { id: 18, timeSec: 285.9, timeStr: "04:45.9", name: "心傷，2人分散", phase: "" },
  { id: 19, timeSec: 286.8, timeStr: "04:46.8", name: "2人踩塔", phase: "" },
  { id: 20, timeSec: 301.1, timeStr: "05:01.1", name: "雨或滴", phase: "" },
  { id: 21, timeSec: 310.1, timeStr: "05:10.1", name: "蜂蜂落幕曲，全屏AOE", phase: "" },
  { id: 22, timeSec: 342.7, timeStr: "05:42.7", name: "毒針，第1輪毒圈2人", phase: "" },
  { id: 23, timeSec: 347.8, timeStr: "05:47.8", name: "毒針，第2輪毒圈2人", phase: "" },
  { id: 24, timeSec: 352.8, timeStr: "05:52.8", name: "毒針，第3輪毒圈2人", phase: "" },
  { id: 25, timeSec: 357.7, timeStr: "05:57.7", name: "毒針，第4輪毒圈2人", phase: "" },
  { id: 26, timeSec: 367.7, timeStr: "06:07.7", name: "小蜂刺，四四分攤", phase: "" },
  { id: 27, timeSec: 376.1, timeStr: "06:16.1", name: "雙T死刑", phase: "" },
  { id: 28, timeSec: 393.3, timeStr: "06:33.3", name: "雨或滴", phase: "" },
  { id: 29, timeSec: 412.8, timeStr: "06:52.8", name: "蜂蜂演唱會【三演】，全屏AOE", phase: "" },
  { id: 30, timeSec: 438.8, timeStr: "07:18.8", name: "大爆炸，大圈", phase: "" },
  { id: 31, timeSec: 442.2, timeStr: "07:22.2", name: "炸裂，踩塔", phase: "" },
  { id: 32, timeSec: 458.8, timeStr: "07:38.8", name: "大爆炸，大圈", phase: "" },
  { id: 33, timeSec: 461.9, timeStr: "07:41.9", name: "炸裂，踩塔", phase: "" },
  { id: 34, timeSec: 476.7, timeStr: "07:56.7", name: "雨或滴", phase: "" },
  { id: 35, timeSec: 484.7, timeStr: "08:04.7", name: "蜂蜂落幕曲，全屏AOE", phase: "" },
  { id: 36, timeSec: 499.2, timeStr: "08:19.2", name: "雙T死刑", phase: "" },
  { id: 37, timeSec: 514.9, timeStr: "08:34.9", name: "黑心，全屏AOE", phase: "" },
  { id: 38, timeSec: 522.9, timeStr: "08:42.9", name: "大爆炸，相撞1", phase: "" },
  { id: 39, timeSec: 531.4, timeStr: "08:51.4", name: "甜言蜜語，全屏AOE", phase: "" },
  { id: 40, timeSec: 538.9, timeStr: "08:58.9", name: "大爆炸，相撞2", phase: "" },
  { id: 41, timeSec: 548.6, timeStr: "09:08.6", name: "甜言蜜語，全屏AOE", phase: "" },
  { id: 42, timeSec: 554.9, timeStr: "09:14.9", name: "大爆炸，相撞3", phase: "" },
  { id: 43, timeSec: 565.8, timeStr: "09:25.8", name: "甜言蜜語，全屏AOE", phase: "" },
  { id: 44, timeSec: 570.9, timeStr: "09:30.9", name: "大爆炸，相撞4", phase: "" },
  { id: 45, timeSec: 582.9, timeStr: "09:42.9", name: "甜言蜜語，全屏AOE", phase: "" },
  { id: 46, timeSec: 608.3, timeStr: "10:08.3", name: "驟然心痛，狂暴", phase: "" }
];

const M2S_MECHANICS_CONFIG: MechanicMapConfig[] = [
  { key: "rain_or_drop", filename: "m2s_map1.png", displayName: "雨或滴", pattern: ["雨或滴"] },
  { key: "towers", filename: "m2s_map3.png", displayName: "踩塔", pattern: ["炸裂，踩塔"] },
  { key: "heart", filename: "m2s_map4.png", displayName: "心病", pattern: ["心病", "心傷", "信息素"] },
  { key: "two_person_towers", filename: "m2s_map5.png", displayName: "2人踩塔", pattern: ["2人踩塔"] },
  { key: "poison_针", filename: "m2s_map6.png", displayName: "毒針", pattern: ["毒針"] },
  { key: "bee_sting", filename: "m2s_map7.png", displayName: "小蜂刺", pattern: ["小蜂刺"] },
  { key: "big_bang", filename: "m2s_map8.png", displayName: "大爆炸", pattern: ["大爆炸", "相撞"] },
  { key: "black_heart", filename: "m2s_map9.png", displayName: "黑心", pattern: ["黑心"] }
];

const M3S_TIMELINE: TimelineEvent[] = [
  { id: 0, timeSec: 0.0, timeStr: "00:00.0", name: "倒數10秒", phase: "準備" },
  { id: 1, timeSec: 11.2, timeStr: "00:11.2", name: "野蠻碎擊", phase: "" },
  { id: 2, timeSec: 20.5, timeStr: "00:20.5", name: "拳面猛擊4", phase: "" },
  { id: 3, timeSec: 37.6, timeStr: "00:37.6", name: "金臂鈎，看內外圈", phase: "" },
  { id: 4, timeSec: 51.8, timeStr: "00:51.8", name: "強震衝+野蠻碎擊，看衰減或防擊退", phase: "" },
  { id: 5, timeSec: 87.5, timeStr: "01:27.5", name: "踩塔爆炸", phase: "" },
  { id: 6, timeSec: 143.6, timeStr: "02:23.6", name: "王喝藥+金臂鈎，看內外圈", phase: "" },
  { id: 7, timeSec: 157.8, timeStr: "02:37.8", name: "強震衝+野蠻碎擊，看衰減或防擊退", phase: "" },
  { id: 8, timeSec: 177.4, timeStr: "02:57.4", name: "拳面猛擊6", phase: "" },
  { id: 9, timeSec: 214.0, timeStr: "03:34.0", name: "組隊戰", phase: "" },
  { id: 10, timeSec: 226.7, timeStr: "03:46.7", name: "金臂鈎+野蠻碎擊，看內外圈", phase: "" },
  { id: 11, timeSec: 265.9, timeStr: "04:25.9", name: "長短炸彈爆炸", phase: "" },
  { id: 12, timeSec: 282.1, timeStr: "04:42.1", name: "強震衝", phase: "" },
  { id: 13, timeSec: 305.0, timeStr: "05:05.0", name: "踩引信1", phase: "" },
  { id: 14, timeSec: 325.0, timeStr: "05:25.0", name: "踩引信2", phase: "" },
  { id: 15, timeSec: 354.4, timeStr: "05:54.4", name: "拳面猛擊6", phase: "" },
  { id: 16, timeSec: 391.9, timeStr: "06:31.9", name: "超豪華野蠻大亂擊1", phase: "超豪華大亂擊" },
  { id: 17, timeSec: 395.4, timeStr: "06:35.4", name: "超豪華野蠻大亂擊2+野蠻爆震", phase: "" },
  { id: 18, timeSec: 457.9, timeStr: "07:37.9", name: "組隊戰+致命毒", phase: "" },
  { id: 19, timeSec: 474.8, timeStr: "07:54.8", name: "強震衝+野蠻碎擊，看衰減或防擊退", phase: "" },
  { id: 20, timeSec: 497.8, timeStr: "08:17.8", name: "拳面猛擊8", phase: "" },
  { id: 21, timeSec: 521.0, timeStr: "08:41.0", name: "超華麗野蠻旋火", phase: "" },
  { id: 22, timeSec: 537.7, timeStr: "08:57.7", name: "炸彈爆炸，看王左右手", phase: "" },
  { id: 23, timeSec: 548.2, timeStr: "09:08.2", name: "金臂鈎+野蠻碎擊，看內外圈", phase: "" },
  { id: 24, timeSec: 615.2, timeStr: "10:15.2", name: "拳面猛擊8", phase: "" },
  { id: 25, timeSec: 658.2, timeStr: "10:58.2", name: "究極超豪華野蠻大亂擊", phase: "究極超豪華大亂擊" }
];

const M4S_TIMELINE: TimelineEvent[] = [
  { id: 0, timeSec: 0.0, timeStr: "00:00.0", phase: "準備", name: "倒數10秒" },
  { id: 1, timeSec: 15.2, timeStr: "00:15.2", phase: "魔女狩獵", name: "宙斯之怒" },
  { id: 2, timeSec: 49.4, timeStr: "00:49.4", phase: "", name: "魔女狩獵" },
  { id: 3, timeSec: 86.0, timeStr: "01:26.0", phase: "圓環+環圓", name: "圓環鋼鐵+環圓月環，先坦補再輸出" },
  { id: 4, timeSec: 99.1, timeStr: "01:39.1", phase: "", name: "宙斯之怒" },
  { id: 5, timeSec: 135.6, timeStr: "02:15.6", phase: "雷轉質展開", name: "四八雷星1" },
  { id: 6, timeSec: 191.1, timeStr: "03:11.1", phase: "", name: "四八雷星2" },
  { id: 7, timeSec: 209.3, timeStr: "03:29.3", phase: "", name: "狡詭落雷" },
  { id: 8, timeSec: 251.6, timeStr: "04:11.6", phase: "離子簇", name: "前後砲1" },
  { id: 9, timeSec: 269.9, timeStr: "04:29.9", phase: "", name: "前後砲2" },
  { id: 10, timeSec: 290.3, timeStr: "04:50.3", phase: "", name: "狡詭搖盪" },
  { id: 11, timeSec: 335.6, timeStr: "05:35.6", phase: "雷轉質移植C為新的12點", name: "圓形炸完擋槍1" },
  { id: 12, timeSec: 361.9, timeStr: "06:01.9", phase: "", name: "擋槍2，最後還會炸一下記得離開" },
  { id: 13, timeSec: 378.3, timeStr: "06:18.3", phase: "", name: "靈魂震盪C點集合，否則會被擊飛" },
  { id: 14, timeSec: 386.9, timeStr: "06:26.9", phase: "", name: "後半開始" },
  { id: 15, timeSec: 412.3, timeStr: "06:52.3", phase: "開場", name: "交叉亂尾擊" },
  { id: 16, timeSec: 427.0, timeStr: "07:07.0", phase: "後半", name: "狡詭熾焰，火山噴發+4段分攤" },
  { id: 17, timeSec: 441.8, timeStr: "07:21.8", phase: "", name: "狡詭特技，躲中央或左右直線範圍" },
  { id: 18, timeSec: 456.5, timeStr: "07:36.5", phase: "接線分散+水火劍", name: "芥末炸彈，第一次沒被炸的要去接走坦的炸彈" },
  { id: 19, timeSec: 483.0, timeStr: "08:03.0", phase: "", name: "屬性轉換，火鋼鐵水擊退，尖尾刺" },
  { id: 20, timeSec: 504.3, timeStr: "08:24.3", phase: "", name: "青雷" },
  { id: 21, timeSec: 510.8, timeStr: "08:30.8", phase: "日落", name: "日落" },
  { id: 22, timeSec: 520.6, timeStr: "08:40.6", phase: "", name: "中間放紅圈，躲2個分身半場刀" },
  { id: 23, timeSec: 530.5, timeStr: "08:50.5", phase: "", name: "狡詭特技，看王舉手" },
  { id: 24, timeSec: 540.3, timeStr: "09:00.3", phase: "午夜", name: "午夜，同時有分擔+分散" },
  { id: 25, timeSec: 551.1, timeStr: "09:11.1", phase: "", name: "光束引導" },
  { id: 26, timeSec: 567.4, timeStr: "09:27.4", phase: "", name: "狡詭雷電" },
  { id: 27, timeSec: 593.9, timeStr: "09:53.9", phase: "", name: "火焰斬，分組踩塔" },
  { id: 28, timeSec: 641.2, timeStr: "10:41.2", phase: "", name: "尖尾刺，看王之前存的屬性及方向" },
  { id: 29, timeSec: 657.2, timeStr: "10:57.2", phase: "", name: "芥末炸彈" },
  { id: 30, timeSec: 666.9, timeStr: "11:06.9", phase: "", name: "屬性轉換，記屬性跟順序" },
  { id: 31, timeSec: 682.7, timeStr: "11:22.7", phase: "", name: "青雷" },
  { id: 32, timeSec: 695.5, timeStr: "11:35.5", phase: "日出", name: "日出" },
  { id: 33, timeSec: 708.2, timeStr: "11:48.2", phase: "", name: "長短BUFF引導+踩塔，坦補逆時針，輸出順時針" },
  { id: 34, timeSec: 732.4, timeStr: "12:12.4", phase: "", name: "尖尾刺" },
  { id: 35, timeSec: 748.9, timeStr: "12:28.9", phase: "劍舞", name: "劍舞1" },
  { id: 36, timeSec: 766.0, timeStr: "12:46.0", phase: "", name: "劍舞2" },
  { id: 37, timeSec: 783.2, timeStr: "13:03.2", phase: "", name: "劍舞3" },
  { id: 38, timeSec: 810.0, timeStr: "13:30.0", phase: "狂暴", name: "狂暴" }
];

interface MechanicMapConfig {
  key: string;
  filename: string;
  altFilename?: string;
  displayName: string;
  pattern: string[];
}

const M3S_MECHANICS_CONFIG: MechanicMapConfig[] = [
  { key: "prep", filename: "m3s_map.png", displayName: "倒數準備", pattern: ["倒數", "準備", "戰鬥開始"] },
  { key: "lariat", filename: "m3s_lariat_hook.png", displayName: "金臂鈎 (四角分組/八方散開) [四格大圖]", pattern: ["金臂"] },
  { key: "savage", filename: "m3s_savage.png", displayName: "野蠻碎擊系列", pattern: ["野蠻碎擊", "野蠻爆震"] },
  { key: "knockback", filename: "m3s_earthquake.png", altFilename: "m3s_earthquake2.png", displayName: "強震衝 (擊退避難)", pattern: ["強震衝"] },
  { key: "towers", filename: "m3s_map6.png", displayName: "踩塔機制", pattern: ["踩塔", "💥"] },
  { key: "tagteam", filename: "m3s_tagteam.png", displayName: "組隊戰 (召喚分身)", pattern: ["組隊"] },
  { key: "bombs", filename: "m3s_map4.png", displayName: "長短炸彈", pattern: ["炸彈"] },
  { key: "fuse", filename: "m3s_map24.png", displayName: "踩引信", pattern: ["引信"] },
  { key: "brawl", filename: "m3s_brawl.png", displayName: "超豪華大亂擊", pattern: ["大亂擊"] },
  { key: "splendid", filename: "m3s_map8.png", displayName: "超華麗野蠻旋火", pattern: ["旋火", "超華麗"] }
];

const M4S_MECHANICS_CONFIG: MechanicMapConfig[] = [
  { key: "prep", filename: "m4s_prep.png", displayName: "開場準備", pattern: ["戰鬥開始", "準備"] },
  { key: "witch_hunt", filename: "m4s_witch_hunt.png", displayName: "魔女狩獵", pattern: ["魔女狩獵"] },
  { key: "ring_iron", filename: "m4s2_map.png", displayName: "圓環鋼鐵+環圓月環", pattern: ["圓環", "環圓", "月環", "鋼鐵"] },
  { key: "four_eight_1", filename: "m4s3_map.png", displayName: "四八雷星1", pattern: ["四八雷星1"] },
  { key: "four_eight_2", filename: "m4s4_map.png", altFilename: "m4s5_map.png", displayName: "四八雷星2", pattern: ["四八雷星2"] },
  { key: "four_eight", filename: "m4s_four_eight.png", displayName: "四八雷星系列", pattern: ["四八雷星", "狡詭落雷"] },
  { key: "cannons", filename: "m4s6_map.png", displayName: "前後砲", pattern: ["前後砲"] },
  { key: "blazing_fire", filename: "m4sp2_map0.png", displayName: "狡詭熾焰", pattern: ["狡詭熾焰", "火山噴發"] },
  { key: "tricks", filename: "m4sp2_map2.png", displayName: "狡詭特技", pattern: ["狡詭特技", "躲中央", "左右直線"] },
  { key: "mustard_bomb", filename: "m4sp2_map31.png", displayName: "接線分散與芥末炸彈", pattern: ["芥末炸彈", "接線分散", "水火劍"] },
  { key: "element_convert_knockback", filename: "m4sp2_map4.png", displayName: "屬性轉換（火鋼鐵水擊退）", pattern: ["火鋼鐵水擊退", "屬性轉換，火鋼鐵"] },
  { key: "red_circle_clones", filename: "m4sp2_map5.png", displayName: "日落半場刀", pattern: ["中間放紅圈", "躲2個分身"] },
  { key: "group_towers", filename: "m4sp2_map70.png", altFilename: "m4sp2_map71.png", displayName: "火焰斬，分組踩塔", pattern: ["分組踩塔"] },
  { key: "gun_shield", filename: "m4s_gun_shield.png", displayName: "保護線與擋槍支柱", pattern: ["擋槍", "移植"] },
  { key: "sunset", filename: "m4s_sunset.png", displayName: "日落九宮外圈", pattern: ["日落"] },
  { key: "midnight", filename: "m4sp2_map61.png", displayName: "午夜階段", pattern: ["午夜", "光束", "雷電"] },
  { key: "sunrise", filename: "m4sp2_map8.png", displayName: "長短BUFF引導+踩塔", pattern: ["長短BUFF", "長短消BUFF", "日出", "BUFF踩塔"] },
  { key: "sword_dance", filename: "m4sp2_map9.png", displayName: "劍舞狂暴階段", pattern: ["劍舞", "狂暴"] }
];

function getMechanicInfo(currentTab: string, eventName: string, eventTimeSec?: number): MechanicMapConfig {
  const configs = currentTab === "M4S" ? M4S_MECHANICS_CONFIG : (currentTab === "M3S" ? M3S_MECHANICS_CONFIG : M2S_MECHANICS_CONFIG);
  const name = eventName || "";
  if (currentTab === "M2S" && eventTimeSec !== undefined) {
    if (eventTimeSec >= 514.9) {
      const bhConfig = configs.find(cfg => cfg.key === "black_heart");
      if (bhConfig) return bhConfig;
    } else if (eventTimeSec >= 412.8 && eventTimeSec < 476.7) {
      const bbConfig = configs.find(cfg => cfg.key === "big_bang");
      if (bbConfig) return bbConfig;
    } else if (eventTimeSec >= 253.7 && eventTimeSec < 301.1) {
      const tpConfig = configs.find(cfg => cfg.key === "two_person_towers");
      if (tpConfig) return tpConfig;
    } else if (eventTimeSec >= 79.0 && eventTimeSec < 186.8) {
      const towersConfig = configs.find(cfg => cfg.key === "towers");
      if (towersConfig) return towersConfig;
    }
  }
  if (currentTab === "M3S" && name.includes("強震衝")) {
    const kbConfig = configs.find(cfg => cfg.key === "knockback");
    if (kbConfig) return kbConfig;
  }
  const match = configs.find(cfg => cfg.pattern.some(p => name.includes(p)));
  if (match) return match;
  return {
    key: "prep",
    filename: currentTab === "M4S" ? "m4s_prep.png" : (currentTab === "M2S" ? "m2s_map.png" : "m3s_map.png"),
    displayName: "準備/基礎圖",
    pattern: []
  };
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<'M2S' | 'M3S' | 'M4S' | 'AUTHOR'>(() => {
    const saved = localStorage.getItem('default_homepage');
    if (saved === 'M2S' || saved === 'M3S' || saved === 'M4S' || saved === 'AUTHOR') {
      return saved as 'M2S' | 'M3S' | 'M4S' | 'AUTHOR';
    }
    return 'M4S';
  });
  const [defaultHomepage, setDefaultHomepage] = useState<'M2S' | 'M3S' | 'M4S' | 'AUTHOR'>(() => {
    const saved = localStorage.getItem('default_homepage');
    if (saved === 'M2S' || saved === 'M3S' || saved === 'M4S' || saved === 'AUTHOR') {
      return saved as 'M2S' | 'M3S' | 'M4S' | 'AUTHOR';
    }
    return 'M4S';
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [elapsed, setElapsed] = useState<number>(-10);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('sound_enabled') !== 'false';
  });
  const [volume, setVolume] = useState<number>(() => {
    const val = localStorage.getItem('alert_volume');
    return val !== null ? parseFloat(val) : 0.5;
  });
  const [speechRate, setSpeechRate] = useState<number>(() => {
    const val = localStorage.getItem('speech_rate');
    return val !== null ? parseInt(val, 10) : 4;
  });
  const [speechGender, setSpeechGender] = useState<'female' | 'male'>(() => {
    const val = localStorage.getItem('speech_gender');
    return val === 'male' ? 'male' : 'female';
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('sound_enabled', soundEnabled.toString());
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('alert_volume', volume.toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('speech_rate', speechRate.toString());
  }, [speechRate]);

  useEffect(() => {
    localStorage.setItem('speech_gender', speechGender);
  }, [speechGender]);

  const [lariatState, setLariatState] = useState<'fire' | 'no-fire' | null>(null);
  const [lariatSplit, setLariatSplit] = useState<'4' | '8' | null>(null);
  const [quakeState, setQuakeState] = useState<'fire' | 'no-fire' | null>(null);
  const [quakeSplit, setQuakeSplit] = useState<'4' | '8' | null>(null);
  const [chainSplit, setChainSplit] = useState<'4' | '8' | null>(null);

  const [activeMapTab, setActiveMapTab] = useState<string>('all');

  // Track which project image filenames are missing in the network/server
  const [missingProjectImages, setMissingProjectImages] = useState<Record<string, boolean>>({});

  const handleMarkProjectImageMissing = (filename: string) => {
    setMissingProjectImages(prev => ({ ...prev, [filename]: true }));
  };

  const [m2sTimeline, setM2sTimeline] = useState<TimelineEvent[]>(() => {
    try {
      const saved = localStorage.getItem('m2s_timeline_custom_v1');
      return saved ? JSON.parse(saved) : M2S_TIMELINE;
    } catch {
      return M2S_TIMELINE;
    }
  });

  const [m3sTimeline, setM3sTimeline] = useState<TimelineEvent[]>(() => {
    try {
      const saved = localStorage.getItem('m3s_timeline_custom_v1');
      return saved ? JSON.parse(saved) : M3S_TIMELINE;
    } catch {
      return M3S_TIMELINE;
    }
  });

  const [m4sTimeline, setM4sTimeline] = useState<TimelineEvent[]>(() => {
    try {
      const saved = localStorage.getItem('m4s_timeline_custom_v1');
      return saved ? JSON.parse(saved) : M4S_TIMELINE;
    } catch {
      return M4S_TIMELINE;
    }
  });

  const timeline = useMemo(() => {
    if (currentTab === 'M2S') return m2sTimeline;
    return currentTab === 'M3S' ? m3sTimeline : m4sTimeline;
  }, [currentTab, m2sTimeline, m3sTimeline, m4sTimeline]);

  const [isEditingTimeline, setIsEditingTimeline] = useState<boolean>(false);
  const [selectedEventForEdit, setSelectedEventForEdit] = useState<TimelineEvent | null>(null);
  
  const [isAddingNewEvent, setIsAddingNewEvent] = useState<boolean>(false);
  const [editEventTimeSec, setEditEventTimeSec] = useState<string>('');
  const [editEventName, setEditEventName] = useState<string>('');
  const [editEventPhase, setEditEventPhase] = useState<string>('');

  const [isImportExportOpen, setIsImportExportOpen] = useState<boolean>(false);
  const [importJsonStr, setImportJsonStr] = useState<string>('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);

  // Custom modals/flags replacing window.confirm and window.alert in iframe environments
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const [editorError, setEditorError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmConfig({
      isOpen: true,
      title,
      message,
      onConfirm
    });
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2800);
  };

  const nextEvent = useMemo(() => {
    return timeline.filter(ev => ev.timeSec >= elapsed)[0] || null;
  }, [timeline, elapsed]);

  const progressPercent = useMemo(() => {
    if (!nextEvent) return 0;
    return Math.max(0, Math.min(100, (1 - (nextEvent.timeSec - elapsed) / 10) * 100));
  }, [nextEvent, elapsed]);

  const remainingTimeStr = useMemo(() => {
    if (!nextEvent) return '0.0';
    const r = nextEvent.timeSec - Math.floor(elapsed * 10) / 10;
    return r < 0 ? '0.0' : r.toFixed(1);
  }, [nextEvent, elapsed]);

  const containerRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(-10);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [isUserScrolling, setIsUserScrolling] = useState<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSpokenEventIdRef = useRef<number | null>(null);

  const alerted5sRef = useRef<boolean>(false);
  const alerted0sRef = useRef<boolean>(false);
  const lastEventIdRef = useRef<number | null>(null);

  const lastVolumeDemoTimeRef = useRef<number>(0);

  const playBeep = (freq = 880, duration = 0.15, overrideVolume?: number) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current && AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
      const audioCtx = audioCtxRef.current;
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime); 
      
      const activeVolume = overrideVolume !== undefined ? overrideVolume : volume;
      const maxGain = 0.15 * activeVolume;
      gain.gain.setValueAtTime(maxGain, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };

  const triggerVolumeDemo = (v: number) => {
    const now = performance.now();
    if (now - lastVolumeDemoTimeRef.current > 200) {
      playBeep(880, 0.15, v);
      lastVolumeDemoTimeRef.current = now;
    }
  };

  const speakText = (text: string, overrideRate?: number, overrideGender?: 'female' | 'male') => {
    if (!soundEnabled) return;
    try {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-TW';

      const voices = window.speechSynthesis.getVoices();
      let voice: SpeechSynthesisVoice | null = null;

      const isFemaleVoice = (name: string) => {
        const n = name.toLowerCase();
        return n.includes('female') || 
               n.includes('xiaoxiao') || 
               n.includes('tingting') || 
               n.includes('yating') || 
               n.includes('sin-ji') || 
               n.includes('mei-jia') || 
               n.includes('huihui') || 
               n.includes('lulu') ||
               n.includes('siri') ||
               n.includes('satori') ||
               n.includes('hanhan');
      };

      const activeGender = overrideGender !== undefined ? overrideGender : speechGender;
      const activeRate = overrideRate !== undefined ? overrideRate : speechRate;

      const preferredVoices = voices.filter(v => {
        const lang = v.lang.toLowerCase();
        const matchesLang = lang.includes('zh') || lang.includes('cmn');
        if (!matchesLang) return false;
        if (activeGender === 'female') {
          return isFemaleVoice(v.name);
        } else {
          return !isFemaleVoice(v.name);
        }
      });

      if (preferredVoices.length > 0) {
        const twVoice = preferredVoices.find(v => v.lang.toLowerCase().includes('tw'));
        voice = twVoice || preferredVoices[0];
      } else {
        voice = voices.find(v => v.lang.toLowerCase().includes('zh-tw')) || 
                voices.find(v => v.lang.toLowerCase().includes('zh')) || null;
      }

      if (voice) {
        utterance.voice = voice;
      }

      // Map speech rate 1-5 to SynthesisUtterance rates with a wider, clearly noticeable range
      const rateMap: Record<number, number> = {
        1: 0.75,
        2: 0.9,
        3: 1.05,
        4: 1.2,
        5: 1.45
      };
      const chosenRate = rateMap[activeRate] || 1.2;

      utterance.pitch = 1.0; // Restoring to 1.0 neutral pitch prevents Siri and iPad voices from sounding heavily metallic, chipmunk-like, or robotic
      utterance.rate = chosenRate;
      utterance.volume = volume;

      // Wrap in a tiny delay to ensure .cancel() finishes and the TTS engine processes rate changes reliably
      setTimeout(() => {
        if (window.speechSynthesis) {
          window.speechSynthesis.speak(utterance);
        }
      }, 50);
    } catch (e) {
      console.error("TTS SpeechSynthesis failed", e);
    }
  };

  // Timer loop with requestAnimationFrame
  useEffect(() => {
    let reqId: number;

    const updateTimer = () => {
      if (startTimeRef.current !== null) {
        const now = performance.now();
        const nextElapsed = pausedTimeRef.current + (now - startTimeRef.current) / 1000;
        setElapsed(nextElapsed);
        reqId = requestAnimationFrame(updateTimer);
      }
    };

    if (isPlaying) {
      startTimeRef.current = performance.now();
      reqId = requestAnimationFrame(updateTimer);
    } else {
      if (startTimeRef.current !== null) {
        pausedTimeRef.current += (performance.now() - startTimeRef.current) / 1000;
        startTimeRef.current = null;
      }
    }

    return () => {
      cancelAnimationFrame(reqId);
    };
  }, [isPlaying]);

  // Alert and dynamic resets watch
  useEffect(() => {
    if (nextEvent) {
      if (lastEventIdRef.current !== nextEvent.id) {
        lastEventIdRef.current = nextEvent.id;
        alerted5sRef.current = false;
        alerted0sRef.current = false;
        setLariatState(null);
        setLariatSplit(null);
        setQuakeState(null);
        setQuakeSplit(null);
        setChainSplit(null);
      }

      if (isPlaying) {
        if (lastSpokenEventIdRef.current !== nextEvent.id) {
          speakText(nextEvent.name);
          lastSpokenEventIdRef.current = nextEvent.id;
        }

        const timeToNext = nextEvent.timeSec - elapsed;
        if (!alerted5sRef.current && timeToNext <= 5.0 && timeToNext > 0) {
          playBeep(1200, 0.2);
          alerted5sRef.current = true;
        }
        if (!alerted0sRef.current && timeToNext <= 0.0) {
          playBeep(880, 0.15);
          alerted0sRef.current = true;
        }
      }
    }
  }, [elapsed, isPlaying, nextEvent]);

  // Handle manual scroll lock
  const handleScroll = () => {
    setIsUserScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 5000);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener('wheel', handleScroll, { passive: true });
      el.addEventListener('touchmove', handleScroll, { passive: true });
    }
    return () => {
      if (el) {
        el.removeEventListener('wheel', handleScroll);
        el.removeEventListener('touchmove', handleScroll);
      }
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Sync scroll on next event
  useEffect(() => {
    if (nextEvent && isPlaying && !isUserScrolling) {
      const el = document.getElementById(`event-${nextEvent.id}`);
      if (el && containerRef.current) {
        const rect = el.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        if (rect.top < containerRect.top || rect.bottom > containerRect.bottom) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [nextEvent?.id, isPlaying, isUserScrolling]);

  // Adjust map tab based on Lariat button toggles
  useEffect(() => {
    if (lariatState === 'fire' && lariatSplit === '4') {
      setActiveMapTab('fire-4');
    } else if (lariatState === 'fire' && lariatSplit === '8') {
      setActiveMapTab('fire-8');
    } else if (lariatState === 'no-fire' && lariatSplit === '4') {
      setActiveMapTab('no-fire-4');
    } else if (lariatState === 'no-fire' && lariatSplit === '8') {
      setActiveMapTab('no-fire-8');
    } else if (!lariatState && !lariatSplit) {
      setActiveMapTab('all');
    }
  }, [lariatState, lariatSplit]);

  const selectLariatTab = (tab: string) => {
    setActiveMapTab(tab);
    if (tab === 'no-fire-4') {
      setLariatState('no-fire');
      setLariatSplit('4');
    } else if (tab === 'no-fire-8') {
      setLariatState('no-fire');
      setLariatSplit('8');
    } else if (tab === 'fire-4') {
      setLariatState('fire');
      setLariatSplit('4');
    } else if (tab === 'fire-8') {
      setLariatState('fire');
      setLariatSplit('8');
    } else {
      setLariatState(null);
      setLariatSplit(null);
    }
  };

  const handleAdjustTime = (delta: number) => {
    setElapsed((prev) => {
      let newElapsed = prev + delta;
      if (newElapsed < -10) newElapsed = -10;
      
      if (isPlaying) {
        if (startTimeRef.current !== null) {
          startTimeRef.current -= delta * 1000;
        }
      } else {
        pausedTimeRef.current = newElapsed;
      }
      return newElapsed;
    });
  };

  const handleJumpToTime = (targetTimeSec: number, targetName: string, targetId: number) => {
    const newElapsed = Math.max(-10, targetTimeSec - 3);
    setElapsed(newElapsed);
    pausedTimeRef.current = newElapsed;
    
    if (isPlaying) {
      startTimeRef.current = performance.now();
    }
    alerted5sRef.current = false;
    alerted0sRef.current = false;
    
    if (targetName) {
      speakText(targetName);
      lastSpokenEventIdRef.current = targetId;
    }
  };

  const handleSaveTimeline = (updatedList: TimelineEvent[]) => {
    const sorted = [...updatedList].map(ev => {
      const m = Math.floor(ev.timeSec / 60);
      const s = Math.floor(ev.timeSec % 60);
      const ms = Math.floor((ev.timeSec % 1) * 10);
      const timeStr = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
      return { ...ev, timeStr };
    }).sort((a, b) => a.timeSec - b.timeSec);

    const reindexed = sorted.map((ev, index) => ({ ...ev, id: index }));

    if (currentTab === 'M2S') {
      setM2sTimeline(reindexed);
      localStorage.setItem('m2s_timeline_custom_v1', JSON.stringify(reindexed));
    } else if (currentTab === 'M3S') {
      setM3sTimeline(reindexed);
      localStorage.setItem('m3s_timeline_custom_v1', JSON.stringify(reindexed));
    } else {
      setM4sTimeline(reindexed);
      localStorage.setItem('m4s_timeline_custom_v1', JSON.stringify(reindexed));
    }
  };

  const handleResetDefaultTimeline = () => {
    if (currentTab === 'M2S') {
      setM2sTimeline(M2S_TIMELINE);
      localStorage.removeItem('m2s_timeline_custom_v1');
    } else if (currentTab === 'M3S') {
      setM3sTimeline(M3S_TIMELINE);
      localStorage.removeItem('m3s_timeline_custom_v1');
    } else {
      setM4sTimeline(M4S_TIMELINE);
      localStorage.removeItem('m4s_timeline_custom_v1');
    }
  };

  const handleImportTimelineJSON = (jsonStr: string): string | null => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!Array.isArray(parsed) && typeof parsed !== 'object') {
        return "輸入的格式並非有效的 JSON。";
      }
      
      const sanitized: TimelineEvent[] = [];
      const items = Array.isArray(parsed) ? parsed : [parsed];
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (typeof item !== 'object' || item === null) {
          return `第 ${i + 1} 個項目格式無效。`;
        }
        
        let timeSec = Number(item.timeSec);
        if (isNaN(timeSec)) {
          if (typeof item.timeStr === 'string' && item.timeStr.includes(':')) {
            const parts = item.timeStr.split(':');
            const mins = parseFloat(parts[0]) || 0;
            const secs = parseFloat(parts[1]) || 0;
            timeSec = mins * 60 + secs;
          } else {
            timeSec = 0;
          }
        }
        
        const name = String(item.name || "").trim();
        if (!name) {
          return `第 ${i + 1} 個機制的名稱不能為空。`;
        }

        const phase = String(item.phase || item.stage || "").trim();
        
        const m = Math.floor(timeSec / 60);
        const s = Math.floor(timeSec % 60);
        const ms = Math.floor((timeSec % 1) * 10);
        const timeStr = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;

        sanitized.push({
          id: i,
          timeSec,
          timeStr,
          name,
          phase
        });
      }

      sanitized.sort((a, b) => a.timeSec - b.timeSec);
      const finalEvents = sanitized.map((ev, idx) => ({ ...ev, id: idx }));

      if (currentTab === 'M2S') {
        setM2sTimeline(finalEvents);
        localStorage.setItem('m2s_timeline_custom_v1', JSON.stringify(finalEvents));
      } else if (currentTab === 'M3S') {
        setM3sTimeline(finalEvents);
        localStorage.setItem('m3s_timeline_custom_v1', JSON.stringify(finalEvents));
      } else {
        setM4sTimeline(finalEvents);
        localStorage.setItem('m4s_timeline_custom_v1', JSON.stringify(finalEvents));
      }

      return null;
    } catch (e: any) {
      return `JSON 解析失敗: ${e.message}`;
    }
  };

  const handlePlayPause = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current && AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    } else {
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    pausedTimeRef.current = -10;
    setElapsed(-10);
    startTimeRef.current = null;
    lastSpokenEventIdRef.current = null;
    alerted5sRef.current = false;
    alerted0sRef.current = false;
    setLariatState(null);
    setLariatSplit(null);
    setQuakeState(null);
    setQuakeSplit(null);
    setChainSplit(null);
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const switchTab = (tab: 'M2S' | 'M3S' | 'M4S' | 'AUTHOR') => {
    if (currentTab === tab) return;
    setCurrentTab(tab);
    handleReset();
  };

  const formatTime = (secs: number) => {
    const sign = secs < 0 ? '-' : '';
    const absSecs = Math.abs(secs);
    const m = Math.floor(absSecs / 60);
    const s = Math.floor(absSecs % 60);
    const ms = Math.floor((absSecs % 1) * 10);
    return `${sign}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  const renderElapsedControls = () => (
    <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-4 flex flex-col items-center shadow-lg w-full shrink-0">
      <h2 className="text-neutral-500 font-bold tracking-widest text-[9px] uppercase font-sans mb-1">
        Elapsed Time
      </h2>
      <div className="text-4xl font-extrabold font-mono tracking-tight text-white tabular-nums mb-3">
        {formatTime(elapsed)}
      </div>

      <div className="flex gap-1.5 w-full justify-center mb-3">
        <button onClick={() => handleAdjustTime(-1)} className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] transition-all font-medium active:scale-95" title="倒退 1 秒">
          <SkipBackIcon className="w-3.5 h-3.5" /> 1s
        </button>
        <button onClick={() => handleAdjustTime(-0.1)} className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] transition-all font-medium active:scale-95">
          -0.1s
        </button>
        <button onClick={() => handleAdjustTime(0.1)} className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] transition-all font-medium active:scale-95">
          +0.1s
        </button>
        <button onClick={() => handleAdjustTime(1)} className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] transition-all font-medium active:scale-95" title="快進 1 秒">
          1s <SkipForwardIcon className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex gap-2 w-full">
        <button 
          onClick={handlePlayPause}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-black transition-all text-xs active:scale-[0.98] ${
            isPlaying 
              ? 'bg-neutral-800/80 text-amber-500 hover:bg-neutral-700 border border-neutral-700/50 font-sans' 
              : 'bg-amber-500 text-neutral-950 hover:bg-amber-400 font-sans shadow-md shadow-amber-500/10'
          }`}
        >
          {isPlaying ? <PauseIcon className="w-4 h-4 fill-current" /> : <PlayIcon className="w-4 h-4 fill-current" />}
          {isPlaying ? '暫停計時' : '開始計時'}
        </button>
        <button 
          onClick={handleReset}
          className="px-3.5 py-2.5 rounded-xl bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-all flex items-center justify-center active:scale-[0.98] border border-neutral-800"
          title="重設時間"
        >
          <RotateCcwIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="px-4 md:px-6 py-3 border-b border-neutral-800 bg-neutral-900/50 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-6 z-20 backdrop-blur-md relative">
        <div className="flex flex-wrap items-center justify-between md:justify-start gap-3 md:gap-6 w-full md:w-auto">
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-amber-500 flex items-center gap-1.5 shrink-0">
            <ClockIcon className="w-4.5 h-4.5 md:w-5 md:h-5 text-amber-500" />
            <span className="font-sans">
              <span className="text-neutral-100">{currentTab}</span> <span className="hidden xs:inline">時間軸提示</span>
            </span>
          </h1>
          
          {/* Tabs Group */}
          <div className="flex items-center gap-1.5">
            <div className="flex bg-neutral-800/80 p-0.5 md:p-1 rounded-lg border border-neutral-700/50 relative">
              <button 
                onClick={() => switchTab('M2S')} 
                className={`px-2.5 md:px-4 py-1 md:py-1.5 rounded-md text-xs md:text-sm font-bold transition-all z-10 ${
                  currentTab === 'M2S' ? 'text-white shadow-sm bg-neutral-700/80' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                M2S
              </button>
              <button 
                onClick={() => switchTab('M3S')} 
                className={`px-2.5 md:px-4 py-1 md:py-1.5 rounded-md text-xs md:text-sm font-bold transition-all z-10 ${
                  currentTab === 'M3S' ? 'text-white shadow-sm bg-neutral-700/80' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                M3S
              </button>
              <button 
                onClick={() => switchTab('M4S')} 
                className={`px-2.5 md:px-4 py-1 md:py-1.5 rounded-md text-xs md:text-sm font-bold transition-all z-10 ${
                  currentTab === 'M4S' ? 'text-white shadow-sm bg-neutral-700/80' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                M4S
              </button>
              <button 
                onClick={() => switchTab('AUTHOR')} 
                className={`px-2.5 md:px-4 py-1 md:py-1.5 rounded-md text-xs md:text-sm font-bold transition-all z-10 ${
                  currentTab === 'AUTHOR' ? 'text-white shadow-sm bg-neutral-700/80' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                關於作者
              </button>
            </div>

            {/* Set Homepage Button */}
            <button
              onClick={() => {
                localStorage.setItem('default_homepage', currentTab);
                setDefaultHomepage(currentTab);
              }}
              className={`p-1.5 md:px-2.5 md:py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-all outline-none ${
                defaultHomepage === currentTab
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/15'
                  : 'bg-neutral-800/30 border-neutral-700/50 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
              title="點擊將當前頁面設為預設首頁"
            >
              <StarIcon className={`w-3.5 h-3.5 ${defaultHomepage === currentTab ? 'fill-amber-500 text-amber-500' : 'text-neutral-400'}`} />
              <span className="hidden sm:inline">{defaultHomepage === currentTab ? '預設首頁' : '設為首頁'}</span>
            </button>
          </div>
        </div>

        {/* Collapsed Settings Button (Mobile size adaptation) */}
        <div className="relative self-end md:self-auto shrink-0" ref={settingsRef}>
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-all outline-none focus:ring-1 focus:ring-amber-500/35 backdrop-blur-sm shadow-sm ${
              isSettingsOpen 
                ? 'bg-amber-500/10 border-amber-500/50 text-amber-400' 
                : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <SettingsIcon className={`w-3.5 h-3.5 ${soundEnabled ? 'text-amber-500 animate-[spin_6s_linear_infinite]' : 'text-neutral-400'}`} />
            <span>語音設定</span>
            {soundEnabled && (
              <span className="flex h-1.5 w-1.5 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
              </span>
            )}
          </button>

          {/* Settings Dropdown/Popover */}
          {isSettingsOpen && (
            <div 
              className="absolute right-0 mt-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-2xl backdrop-blur-md z-30 flex flex-col gap-4 w-72 animate-fadeIn ring-1 ring-amber-500/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <h3 className="text-amber-500 font-extrabold text-xs uppercase tracking-widest flex items-center gap-1.5">
                  <SettingsIcon className="w-3.5 h-3.5" /> 語音與系統設定
                </h3>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="text-neutral-500 hover:text-neutral-300 font-bold text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Volume Control */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-400 font-bold">音量 & 開關</span>
                  <span className="text-[10px] font-mono text-neutral-400 tabular-nums">
                    {soundEnabled ? Math.round(volume * 100) : 0}%
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-neutral-950/40 p-2.5 rounded-2xl border border-neutral-800/60">
                  <button 
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-1 rounded-full text-neutral-400 hover:text-white transition-all duration-200 active:scale-95 shrink-0"
                    title={soundEnabled ? '點擊靜音' : '點擊解除靜音'}
                  >
                    {soundEnabled ? (
                      <Volume2Icon className="w-4.5 h-4.5 text-amber-500" />
                    ) : (
                      <VolumeXIcon className="w-4.5 h-4.5 text-neutral-500" />
                    )}
                  </button>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05" 
                    value={volume}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setVolume(val);
                      triggerVolumeDemo(val);
                    }}
                    disabled={!soundEnabled}
                    className="w-full accent-amber-500 bg-neutral-700 h-1.5 rounded-lg appearance-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed outline-none focus:ring-1 focus:ring-amber-500/50"
                    title="調整音量"
                  />
                </div>
              </div>

              {/* Speech Speed Control */}
              <div className="flex flex-col gap-2">
                <span className="text-xs text-neutral-400 font-bold">語音播報速度 (語速)</span>
                <div className="flex bg-neutral-950/40 p-1 rounded-xl border border-neutral-800/60 gap-1 w-full justify-between">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSpeechRate(s);
                        speakText(`語速${s}`, s, speechGender);
                      }}
                      className={`flex-1 h-7 rounded-lg text-[10px] font-black transition-all flex items-center justify-center ${
                        speechRate === s 
                          ? 'bg-amber-500 text-neutral-950 shadow-sm shadow-amber-500/15 scale-105' 
                          : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200'
                      }`}
                      title={`語速階段 ${s}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Gender Control */}
              <div className="flex flex-col gap-2">
                <span className="text-xs text-neutral-400 font-bold">播報人聲性別</span>
                <div className="flex bg-neutral-950/40 p-1 rounded-xl border border-neutral-800/60 gap-1 select-none w-full">
                  <button
                    onClick={() => {
                      setSpeechGender('female');
                      speakText('選擇女聲', undefined, 'female');
                    }}
                    className={`flex-1 py-1 px-2.5 rounded-lg text-[10px] font-black transition-all border ${
                      speechGender === 'female'
                        ? 'bg-neutral-800 text-amber-400 border-neutral-700 shadow-inner'
                        : 'text-neutral-400 hover:text-neutral-200 border-transparent'
                    }`}
                  >
                    👩 女聲
                  </button>
                  <button
                    onClick={() => {
                      setSpeechGender('male');
                      speakText('選擇男聲', undefined, 'male');
                    }}
                    className={`flex-1 py-1 px-2.5 rounded-lg text-[10px] font-black transition-all border ${
                      speechGender === 'male'
                        ? 'bg-neutral-800 text-amber-400 border-neutral-700 shadow-inner'
                        : 'text-neutral-400 hover:text-neutral-200 border-transparent'
                    }`}
                  >
                    👨 男聲
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      {currentTab === 'AUTHOR' ? (
        <main className="flex-1 w-full bg-[#111111] flex flex-col items-center p-6 lg:p-10 overflow-y-auto relative custom-scrollbar">
          <div className="max-w-3xl w-full bg-neutral-900/60 border border-neutral-800 rounded-3xl p-8 md:p-12 flex flex-col items-center text-center shadow-2xl animate-fadeIn">
            <img src="./作者.png" alt="Star芭" className="w-32 h-32 md:w-40 md:h-40 rounded-full mb-6 border-4 border-neutral-800 shadow-xl object-cover" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-amber-500 mb-2">Star芭</h2>
            <p className="text-neutral-400 font-mono text-sm tracking-wider mb-8 md:mb-10 uppercase">鳳凰伺服器</p>
            
            <div className="text-left text-neutral-300 space-y-6 md:space-y-8 leading-relaxed text-sm md:text-base w-full">
              <p>
                我是 <span className="text-amber-400 font-semibold">Star芭</span>，來自鳳凰伺服器。我目前為 M4S 開發了一款機制提示工具，專注於在戰鬥中即時提醒下一個階段的機制，協助隊友精準掌握時間軸。我的目標是透過降低反應壓力，讓團隊能更穩定地攻略副本。歡迎同樣追求高效率攻略的朋友一起使用並交流。
              </p>
              <div className="bg-neutral-950 rounded-xl p-4 md:p-5 border-l-4 border-amber-600 shadow-inner">
                <p className="text-xs md:text-sm text-neutral-400 font-medium">
                  註：本 M4S 攻略圖示素材來源，前半部分採用蘇帕的資訊，後半部分採用 MMW 的內容。
                </p>
              </div>
            </div>
          </div>
        </main>
      ) : (
      <main className="flex-1 w-full lg:h-[calc(100vh-60px)] h-auto lg:overflow-hidden overflow-y-auto relative">
        <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:h-full h-auto flex flex-col lg:flex-row gap-6 items-start overflow-y-auto custom-scrollbar">
            
            {/* Left Side: Live Tactical Maps (即時戰術圖), occupant width is 65% for double size! */}
            <section className="w-full lg:w-[65%] flex flex-col gap-5 shrink-0 animate-fadeIn">
              
              {/* Mobile Timer Display (Rank #1 priority on mobile) */}
              <div className="block lg:hidden w-full animate-fadeIn">
                {renderElapsedControls()}
              </div>

              {/* Live Tactical Map that auto-switches per phase */}
              {(currentTab === 'M2S' || currentTab === 'M3S' || currentTab === 'M4S') && (
                <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-5 flex flex-col items-center transition-all duration-500 shadow-xl w-full">
                  <div className="flex items-center justify-between w-full mb-3 pb-2 border-b border-neutral-800">
                    <h3 className="text-neutral-300 font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 self-start">
                      <MapIcon className="w-4 h-4 text-amber-500" /> 
                      {currentTab} {nextEvent ? `即時戰術圖 (${nextEvent.name.split('，')[0].split('+')[0]})` : "戰術地圖"}
                    </h3>
                    <span className="text-[9px] text-neutral-500 font-mono tracking-wider">LIVE DATA</span>
                  </div>
                  
                  <div className="relative w-full flex justify-center items-center p-1">
                    <ArenaMapViewer 
                      currentTab={currentTab}
                      activeEventName={nextEvent?.name || ""}
                      activeEventTimeSec={nextEvent?.timeSec}
                      missingProjectImages={missingProjectImages}
                      onMarkProjectImageMissing={handleMarkProjectImageMissing}
                    />
                  </div>
                </div>
              )}

              {/* Lariat Panel */}
              {currentTab === 'M3S' && nextEvent && nextEvent.name.includes("金臂") && (() => {
                const mapSrc = !missingProjectImages["m3s_lariat_hook.png"] ? "./m3s_lariat_hook.png" : null;
                return (
                  <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-4 md:p-5 flex flex-col items-center transition-all duration-500 shadow-xl w-full">
                    <div className="flex items-center justify-between w-full mb-3 pb-2 border-b border-neutral-800">
                      <h3 className="text-neutral-300 font-black text-xs uppercase tracking-widest flex items-center gap-1.5">
                        <MapIcon className="w-4 h-4 text-amber-500 animate-pulse" /> 金臂鈎 散開/分組 示意圖
                      </h3>
                      <span className="text-[9px] text-neutral-500 font-mono tracking-wider">M3S MECHANIC ACTIVE</span>
                    </div>

                    <div className="flex flex-wrap gap-1 bg-neutral-950/80 p-1 rounded-xl border border-neutral-800 w-full mb-4">
                      <button 
                        onClick={() => selectLariatTab('all')} 
                        className={`flex-1 min-w-[70px] text-center py-1.5 rounded-lg text-xs font-bold transition-all ${
                          activeMapTab === 'all' ? 'bg-amber-500 text-neutral-950 shadow-md' : 'text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        四格總覽
                      </button>
                      <button 
                        onClick={() => selectLariatTab('no-fire-4')} 
                        className={`flex-1 min-w-[70px] text-center py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          activeMapTab === 'no-fire-4' ? 'bg-blue-600/35 text-blue-200 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.15)] font-black' : 'text-neutral-400 hover:text-neutral-200 border-transparent'
                        }`}
                      >
                        無火 四分
                      </button>
                      <button 
                        onClick={() => selectLariatTab('no-fire-8')} 
                        className={`flex-1 min-w-[70px] text-center py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          activeMapTab === 'no-fire-8' ? 'bg-blue-600/35 text-blue-200 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.15)] font-black' : 'text-neutral-400 hover:text-neutral-200 border-transparent'
                        }`}
                      >
                        無火 八分
                      </button>
                      <button 
                        onClick={() => selectLariatTab('fire-4')} 
                        className={`flex-1 min-w-[70px] text-center py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          activeMapTab === 'fire-4' ? 'bg-red-600/35 text-red-200 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.15)] font-black' : 'text-neutral-400 hover:text-neutral-200 border-transparent'
                        }`}
                      >
                        有火 四分
                      </button>
                      <button 
                        onClick={() => selectLariatTab('fire-8')} 
                        className={`flex-1 min-w-[70px] text-center py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          activeMapTab === 'fire-8' ? 'bg-red-600/35 text-red-200 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.15)] font-black' : 'text-neutral-400 hover:text-neutral-200 border-transparent'
                        }`}
                      >
                        有火 八分
                      </button>
                    </div>

                    {/* Lariat Content Render */}
                    {mapSrc ? (
                      activeMapTab === 'all' ? (
                        <div className="flex flex-col items-center w-full">
                          <div className="relative w-full aspect-square max-w-[340px] rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden shadow-2xl group mb-3">
                            {/* The 4-in-1 image */}
                            <img 
                              src={mapSrc} 
                              alt="Lariat Map Overview" 
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                              referrerPolicy="no-referrer"
                            />
                            {/* 4 invisible hotzones for clicking on quadrants to zoom in */}
                            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                              <button 
                                onClick={() => selectLariatTab('no-fire-4')} 
                                className="hover:bg-blue-500/15 transition-colors border-r border-b border-neutral-800/10 flex items-start p-2.5"
                                title="無火 四分 (點擊放大)"
                              >
                                <span className="text-[10px] font-black bg-blue-900/90 border border-blue-500/30 px-1.5 py-0.5 rounded text-blue-200 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">無火四分 🔍</span>
                              </button>
                              <button 
                                onClick={() => selectLariatTab('no-fire-8')} 
                                className="hover:bg-blue-500/15 transition-colors border-l border-b border-neutral-800/10 flex items-start justify-end p-2.5"
                                title="無火 八分 (點擊放大)"
                              >
                                <span className="text-[10px] font-black bg-blue-900/90 border border-blue-500/30 px-1.5 py-0.5 rounded text-blue-200 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">無火八分 🔍</span>
                              </button>
                              <button 
                                onClick={() => selectLariatTab('fire-4')} 
                                className="hover:bg-red-500/15 transition-colors border-r border-t border-neutral-800/10 flex items-end p-2.5"
                                title="有火 四分 (點擊放大)"
                              >
                                <span className="text-[10px] font-black bg-red-900/90 border border-red-500/30 px-1.5 py-0.5 rounded text-red-200 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">有火四分 🔍</span>
                              </button>
                              <button 
                                onClick={() => selectLariatTab('fire-8')} 
                                className="hover:bg-red-500/15 transition-colors border-l border-t border-neutral-800/10 flex items-end justify-end p-2.5"
                                title="有火 八分 (點擊放大)"
                              >
                                <span className="text-[10px] font-black bg-red-900/90 border border-red-500/30 px-1.5 py-0.5 rounded text-red-200 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">有火八分 🔍</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center w-full">
                          <div 
                            className="w-full aspect-square max-w-[340px] rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden relative cursor-zoom-out mb-3 bg-neutral-950"
                            onClick={() => selectLariatTab('all')}
                            style={{
                              backgroundImage: `url(${mapSrc})`,
                              backgroundSize: '200% 200%',
                              backgroundPosition: activeMapTab === 'no-fire-4' ? '0% 0%' : 
                                                 activeMapTab === 'no-fire-8' ? '100% 0%' : 
                                                 activeMapTab === 'fire-4' ? '0% 100%' : '100% 100%',
                              backgroundRepeat: 'no-repeat'
                            }}
                          >
                            <div className="absolute top-2.5 left-2.5 px-2 py-1 bg-neutral-950/90 rounded text-[10px] font-bold text-neutral-200 border border-neutral-800 backdrop-blur-sm flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${activeMapTab.startsWith('fire') ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`}></span>
                              {activeMapTab === 'no-fire-4' ? '無火 四分 (四角分組) [放大中]' : 
                               activeMapTab === 'no-fire-8' ? '無火 八分 (八方散開) [放大中]' : 
                               activeMapTab === 'fire-4' ? '有火 四分 (內圈雙人) [放大中]' : '有火 八分 (窄版八分) [放大中]'}
                            </div>
                            
                            <div className="absolute bottom-2.5 right-2.5 px-2 py-1 bg-neutral-950/90 rounded text-[9px] text-neutral-400 border border-neutral-850 backdrop-blur-sm">
                              點擊圖片返回總覽
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button 
                              onClick={() => selectLariatTab('all')}
                              className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                              </svg>
                              返回四格總覽
                            </button>
                          </div>
                        </div>
                      )
                    ) : (
                      /* Built-in high-fidelity vector diagrams if no image or toggled off */
                      activeMapTab === 'all' ? (
                        <div className="flex flex-col items-center w-full">
                          <div className="grid grid-cols-2 gap-3 w-full mb-3">
                            <div onClick={() => selectLariatTab('no-fire-4')} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-2.5 flex flex-col items-center cursor-pointer hover:border-blue-500/60 hover:bg-neutral-800/40 transition-all duration-300 group">
                              <span className="text-[11px] font-bold text-neutral-400 group-hover:text-blue-400 mb-1.5 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> 無火 四分
                              </span>
                              <div className="relative w-full aspect-square max-w-[130px]">
                                <LariatThumbnail type="no-fire-4" />
                              </div>
                              <span className="text-[9px] text-neutral-500 mt-1 font-sans">無火 四角分組</span>
                            </div>

                            <div onClick={() => selectLariatTab('no-fire-8')} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-2.5 flex flex-col items-center cursor-pointer hover:border-blue-500/60 hover:bg-neutral-800/40 transition-all duration-300 group">
                              <span className="text-[11px] font-bold text-neutral-400 group-hover:text-blue-400 mb-1.5 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> 無火 八分
                              </span>
                              <div className="relative w-full aspect-square max-w-[130px]">
                                <LariatThumbnail type="no-fire-8" />
                              </div>
                              <span className="text-[9px] text-neutral-500 mt-1 font-sans">無火 八方散開</span>
                            </div>

                            <div onClick={() => selectLariatTab('fire-4')} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-2.5 flex flex-col items-center cursor-pointer hover:border-red-500/60 hover:bg-neutral-800/40 transition-all duration-300 group">
                              <span className="text-[11px] font-bold text-neutral-400 group-hover:text-red-400 mb-1.5 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> 有火 四分
                              </span>
                              <div className="relative w-full aspect-square max-w-[130px]">
                                <LariatThumbnail type="fire-4" />
                              </div>
                              <span className="text-[9px] text-neutral-500 mt-1 font-sans">有火 內圈雙人</span>
                            </div>

                            <div onClick={() => selectLariatTab('fire-8')} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-2.5 flex flex-col items-center cursor-pointer hover:border-red-500/60 hover:bg-neutral-800/40 transition-all duration-300 group">
                              <span className="text-[11px] font-bold text-neutral-400 group-hover:text-red-400 mb-1.5 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> 有火 八分
                              </span>
                              <div className="relative w-full aspect-square max-w-[130px]">
                                <LariatThumbnail type="fire-8" />
                              </div>
                              <span className="text-[9px] text-neutral-500 mt-1 font-sans">有火 窄版八分</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center w-full">
                          <div className="relative w-full flex justify-center items-center p-1 mb-3">
                            <LariatDetailedMap activeMapTab={activeMapTab} />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                );
              })()}
            </section>

            {/* Right Side: Next Mechanic, Controls, Timeline Selector */}
            <section className="flex-1 w-full flex flex-col gap-5 overflow-hidden">
              
              {/* Compact Elapsed Time Controls */}
              <div className="hidden lg:block w-full">
                {renderElapsedControls()}
              </div>

              {/* Smaller/Compact Next Mechanic Card */}
              <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-4 flex flex-col gap-3.5 shadow-lg w-full shrink-0">
                <h3 className="text-neutral-500 font-bold text-[10px] uppercase tracking-widest">
                  Next Mechanic
                </h3>

                {nextEvent ? (
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-amber-500 font-mono text-lg font-bold">
                          {remainingTimeStr}s
                        </span>
                        <div className="flex-1 bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-amber-500 h-full transition-all duration-100 ease-linear"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-lg md:text-xl font-black text-white leading-tight font-sans mb-3">
                        {nextEvent.name}
                      </div>

                      {/* Dynamic Mechanic Deciders */}
                      {/* Lariat Decider */}
                      {nextEvent.name.includes('金臂') && (
                        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-3 flex flex-col gap-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-400 font-bold text-xs tracking-wide leading-none">金臂鈎 (看邊緣是安全有火，還是危險無火)</span>
                            {(lariatState || lariatSplit) && (
                              <button 
                                onClick={() => { setLariatState(null); setLariatSplit(null); }}
                                className="text-[10px] font-medium text-neutral-500 hover:text-neutral-300 transition-colors bg-neutral-800/80 px-1.5 py-0.5 rounded leading-none"
                              >
                                清除
                              </button>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setLariatState('fire')} 
                                className={`flex-1 py-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                                  lariatState === 'fire' 
                                    ? 'bg-red-500/20 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]' 
                                    : 'bg-neutral-800/50 border-neutral-700/50 hover:bg-neutral-800 hover:border-neutral-600'
                                }`}
                              >
                                <span className={`text-[10px] flex items-center gap-1 mb-0.5 ${lariatState === 'fire' ? 'text-red-300' : 'text-neutral-400'}`}>
                                  {lariatState === 'fire' && <FlameIcon className="w-2.5 h-2.5" />} 有火
                                </span>
                                <span className={`font-extrabold text-sm tracking-wide ${lariatState === 'fire' ? 'text-red-400 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)] animate-pulse' : 'text-neutral-500'}`}>
                                  內圈安全
                                </span>
                              </button>
                              <button 
                                onClick={() => setLariatState('no-fire')} 
                                className={`flex-1 py-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                                  lariatState === 'no-fire' 
                                    ? 'bg-blue-500/20 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
                                    : 'bg-neutral-800/50 border-neutral-700/50 hover:bg-neutral-800 hover:border-neutral-600'
                                }`}
                              >
                                <span className={`text-[10px] flex items-center gap-1 mb-0.5 ${lariatState === 'no-fire' ? 'text-blue-300' : 'text-neutral-400'}`}>
                                  {lariatState === 'no-fire' && <CircleOffIcon className="w-2.5 h-2.5" />} 無火
                                </span>
                                <span className={`font-extrabold text-sm tracking-wide ${lariatState === 'no-fire' ? 'text-blue-400 drop-shadow-[0_0_6px_rgba(59,130,246,0.8)] animate-pulse' : 'text-neutral-500'}`}>
                                  外圈安全
                                </span>
                              </button>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setLariatSplit('4')} 
                                className={`flex-1 py-1.5 rounded-lg border flex items-center justify-center gap-1 transition-all ${
                                  lariatSplit === '4' 
                                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)]' 
                                    : 'bg-neutral-800/50 border-neutral-700/50 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600'
                                }`}
                              >
                                <UsersIcon className="w-3.5 h-3.5" /> <span className="font-bold text-xs">四分</span>
                              </button>
                              <button 
                                onClick={() => setLariatSplit('8')} 
                                className={`flex-1 py-1.5 rounded-lg border flex items-center justify-center gap-1 transition-all ${
                                  lariatSplit === '8' 
                                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.15)]' 
                                    : 'bg-neutral-800/50 border-neutral-700/50 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600'
                                }`}
                              >
                                <UsersIcon className="w-3.5 h-3.5" /> <span className="font-bold text-xs">八分</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Quake Decider */}
                      {nextEvent.name.includes('強震衝') && (
                        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-3 flex flex-col gap-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-400 font-bold text-xs tracking-wide leading-none">強震衝</span>
                            {(quakeState || quakeSplit) && (
                              <button 
                                onClick={() => { setQuakeState(null); setQuakeSplit(null); }}
                                className="text-[10px] font-medium text-neutral-500 hover:text-neutral-300 transition-colors bg-neutral-800/80 px-1.5 py-0.5 rounded leading-none"
                              >
                                清除
                              </button>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setQuakeState('fire')} 
                                className={`flex-1 py-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                                  quakeState === 'fire' 
                                    ? 'bg-red-500/20 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]' 
                                    : 'bg-neutral-800/50 border-neutral-700/50 hover:bg-neutral-800 hover:border-neutral-600'
                                }`}
                              >
                                <span className={`text-[10px] flex items-center gap-1 mb-0.5 ${quakeState === 'fire' ? 'text-red-300' : 'text-neutral-400'}`}>
                                  {quakeState === 'fire' && <FlameIcon className="w-2.5 h-2.5" />} 有火
                                </span>
                                <span className={`font-extrabold text-sm tracking-wide ${quakeState === 'fire' ? 'text-red-400 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)] animate-pulse' : 'text-neutral-500'}`}>
                                  防擊退
                                </span>
                              </button>
                              <button 
                                onClick={() => setQuakeState('no-fire')} 
                                className={`flex-1 py-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                                  quakeState === 'no-fire' 
                                    ? 'bg-blue-500/20 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
                                    : 'bg-neutral-800/50 border-neutral-700/50 hover:bg-neutral-800 hover:border-neutral-600'
                                }`}
                              >
                                <span className={`text-[10px] flex items-center gap-1 mb-0.5 ${quakeState === 'no-fire' ? 'text-blue-300' : 'text-neutral-400'}`}>
                                  {quakeState === 'no-fire' && <CircleOffIcon className="w-2.5 h-2.5" />} 無火
                                </span>
                                <span className={`font-extrabold text-sm tracking-wide ${quakeState === 'no-fire' ? 'text-blue-400 drop-shadow-[0_0_6px_rgba(59,130,246,0.8)] animate-pulse' : 'text-neutral-500'}`}>
                                  距離衰減
                                </span>
                              </button>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setQuakeSplit('4')} 
                                className={`flex-1 py-1.5 rounded-lg border flex items-center justify-center gap-1 transition-all ${
                                  quakeSplit === '4' 
                                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)]' 
                                    : 'bg-neutral-800/50 border-neutral-700/50 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600'
                                }`}
                              >
                                <UsersIcon className="w-3.5 h-3.5" /> <span className="font-bold text-xs">四分</span>
                              </button>
                              <button 
                                onClick={() => setQuakeSplit('8')} 
                                className={`flex-1 py-1.5 rounded-lg border flex items-center justify-center gap-1 transition-all ${
                                  quakeSplit === '8' 
                                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.15)]' 
                                    : 'bg-neutral-800/50 border-neutral-700/50 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600'
                                }`}
                              >
                                <UsersIcon className="w-3.5 h-3.5" /> <span className="font-bold text-xs">八分</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Chain Decider */}
                      {nextEvent.name.includes('大亂擊') && (
                        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-3 flex flex-col gap-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-400 font-bold text-xs tracking-wide leading-none">野蠻大亂擊</span>
                            {chainSplit && (
                              <button 
                                onClick={() => setChainSplit(null)} 
                                className="text-[10px] font-medium text-neutral-500 hover:text-neutral-300 transition-colors bg-neutral-800/80 px-1.5 py-0.5 rounded leading-none"
                              >
                                清除
                              </button>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setChainSplit('4')} 
                              className={`flex-1 py-1.5 rounded-lg border flex items-center justify-center gap-1 transition-all ${
                                chainSplit === '4' 
                                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)]' 
                                  : 'bg-neutral-800/50 border-neutral-700/50 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600'
                              }`}
                            >
                              <UsersIcon className="w-3.5 h-3.5" /> <span className="font-bold text-xs">四分</span>
                            </button>
                            <button 
                              onClick={() => setChainSplit('8')} 
                              className={`flex-1 py-1.5 rounded-lg border flex items-center justify-center gap-1 transition-all ${
                                chainSplit === '8' 
                                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.15)]' 
                                  : 'bg-neutral-800/50 border-neutral-700/50 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-600'
                              }`}
                            >
                              <UsersIcon className="w-3.5 h-3.5" /> <span className="font-bold text-xs">八分</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-neutral-500 italic py-6 text-center font-sans tracking-wide flex-1 flex items-center justify-center">
                    副本機制已全部結束
                  </div>
                )}
              </div>

              {/* Timeline Header and Edit Mode Buttons */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mt-2 px-1">
                <span className="text-xs font-bold text-neutral-400 tracking-wider uppercase flex items-center gap-1.5 font-mono">
                  📁 時間軸清單 ({timeline.length} 個機制)
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setImportError(null);
                      setImportSuccess(false);
                      setImportJsonStr(JSON.stringify(timeline, null, 2));
                      setIsImportExportOpen(true);
                    }}
                    className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 hover:text-amber-400 text-neutral-300 text-[11px] font-bold transition-all border border-neutral-700/50 flex items-center gap-1 active:scale-95 cursor-pointer select-none"
                    title="匯入/匯出自訂時間軸"
                  >
                    📂 匯入/匯出 JSON
                  </button>
                  <button 
                    onClick={() => {
                      setIsEditingTimeline(!isEditingTimeline);
                      setSelectedEventForEdit(null);
                      setIsAddingNewEvent(false);
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all border flex items-center gap-1 active:scale-95 cursor-pointer select-none ${
                      isEditingTimeline 
                        ? 'bg-amber-600 border-amber-500 text-white shadow-md' 
                        : 'bg-neutral-800 border-neutral-700/50 hover:bg-neutral-700 text-neutral-300 hover:text-amber-500'
                    }`}
                  >
                    ⚙️ {isEditingTimeline ? '退出編輯' : '編輯時間軸'}
                  </button>
                </div>
              </div>

              {/* Event Editor Form (Adding or Updating) */}
              {(selectedEventForEdit || isAddingNewEvent) && (
                <div className="bg-neutral-900/95 border border-amber-500/50 rounded-2xl p-4 flex flex-col gap-3 shadow-2xl animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5">
                    <span className="text-amber-400 font-extrabold text-xs tracking-wider flex items-center gap-1.5 font-sans">
                      {isAddingNewEvent ? '➕ 新增副本機制' : '✏️ 調整機制秒數 & 名稱'}
                    </span>
                    <button 
                      onClick={() => {
                        setSelectedEventForEdit(null);
                        setIsAddingNewEvent(false);
                      }}
                      className="text-neutral-500 hover:text-neutral-300 text-xs font-bold font-mono"
                    >
                      ✕ 關閉
                    </button>
                  </div>

                  {editorError && (
                    <div className="bg-red-950/40 border border-red-500/30 rounded-xl px-3 py-2 text-xs text-red-400 font-bold flex items-center gap-1.5 animate-fadeIn">
                      <span>⚠️ {editorError}</span>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Time entry */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-neutral-400">機制時間 (秒)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        min="0"
                        value={editEventTimeSec}
                        onChange={(e) => setEditEventTimeSec(e.target.value)}
                        placeholder="例如: 15.2"
                        className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                    {/* Phase entry */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-neutral-400">階段標記 (選填)</label>
                      <input 
                        type="text"
                        value={editEventPhase}
                        onChange={(e) => setEditEventPhase(e.target.value)}
                        placeholder="例如: 準備 / 日出"
                        className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                    {/* Name entry */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-neutral-400">機制名稱 (語音播報)</label>
                      <input 
                        type="text"
                        value={editEventName}
                        onChange={(e) => setEditEventName(e.target.value)}
                        placeholder="例如: 金臂鈎"
                        className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-1">
                    {!isAddingNewEvent && (
                      <button 
                        onClick={() => {
                          if (selectedEventForEdit) {
                            showConfirm(
                              "刪除機制確認",
                              `確定要刪除機制「${selectedEventForEdit.name}」嗎？此操作將會將其自時間軸中移除。`,
                              () => {
                                const updated = timeline.filter(ev => ev.id !== selectedEventForEdit.id);
                                handleSaveTimeline(updated);
                                setSelectedEventForEdit(null);
                                showToast(`已刪除機制「${selectedEventForEdit.name}」`);
                              }
                            );
                          }
                        }}
                        className="mr-auto px-2.5 py-1.5 rounded-lg bg-red-950/45 hover:bg-red-900/60 text-red-400 text-xs font-bold transition-all border border-red-900/30 cursor-pointer select-none"
                      >
                        🗑️ 刪除機制
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        setSelectedEventForEdit(null);
                        setIsAddingNewEvent(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold cursor-pointer select-none"
                    >
                      取消
                    </button>
                    <button 
                      onClick={() => {
                        const timeSecNum = parseFloat(editEventTimeSec);
                        if (isNaN(timeSecNum) || timeSecNum < 0) {
                          setEditorError("請輸入有效的秒數 (大於等於0)！");
                          return;
                        }
                        if (!editEventName.trim()) {
                          setEditorError("請輸入機制名稱！");
                          return;
                        }
                        setEditorError(null);

                        let updated: TimelineEvent[];
                        if (isAddingNewEvent) {
                          const newEv: TimelineEvent = {
                            id: -1,
                            timeSec: timeSecNum,
                            timeStr: '',
                            name: editEventName.trim(),
                            phase: editEventPhase.trim()
                          };
                          updated = [...timeline, newEv];
                        } else if (selectedEventForEdit) {
                          updated = timeline.map(ev => {
                            if (ev.id === selectedEventForEdit.id) {
                              return {
                                ...ev,
                                timeSec: timeSecNum,
                                name: editEventName.trim(),
                                phase: editEventPhase.trim()
                              };
                            }
                            return ev;
                          });
                        } else {
                          return;
                        }

                        handleSaveTimeline(updated);
                        setSelectedEventForEdit(null);
                        setIsAddingNewEvent(false);
                      }}
                      className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-md shadow-amber-950/20 cursor-pointer select-none"
                    >
                      💾 儲存機制
                    </button>
                  </div>
                </div>
              )}

              {/* Edit Mode Tips and General Controls */}
              {isEditingTimeline && (
                <div className="flex items-center justify-between bg-neutral-950/60 border border-neutral-800 rounded-2xl px-4 py-2 text-xs text-amber-500 font-medium">
                  <span className="font-sans">💡 點擊下方清單列表即可進行編輯修改：</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setIsAddingNewEvent(true);
                        setSelectedEventForEdit(null);
                        setEditEventTimeSec(Math.max(0, elapsed).toFixed(1));
                        setEditEventName('');
                        setEditEventPhase('');
                        setEditorError(null);
                      }}
                      className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-black tracking-wider transition-colors cursor-pointer select-none"
                    >
                      ➕ 新增機制
                    </button>
                    <button 
                      onClick={() => {
                        showConfirm(
                          "還原預設確認",
                          "確定要將時間軸還原為初始設定嗎？這將重設所有至今在瀏覽器內的自訂修改！",
                          () => {
                            handleResetDefaultTimeline();
                            setSelectedEventForEdit(null);
                            setIsAddingNewEvent(false);
                            showToast("已還原至最初預設的時間軸設定！");
                          }
                        );
                      }}
                      className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-450 hover:text-red-400 text-[10px] transition-colors cursor-pointer select-none border border-neutral-800"
                    >
                      🔄 還原預設
                    </button>
                  </div>
                </div>
              )}

              {/* Timeline List Scrollable Container */}
              <div 
                ref={containerRef}
                className="w-full h-[185px] overflow-y-auto custom-scrollbar relative scroll-smooth bg-neutral-900/40 border border-neutral-800 rounded-3xl p-2.5 shrink-0"
              >
                <div className="flex flex-col gap-1 pb-10">
                  {timeline.map((ev) => {
                    const isBeingEdited = selectedEventForEdit?.id === ev.id;
                    const isActive = nextEvent?.id === ev.id;
                    return (
                      <div 
                        key={ev.id}
                        id={`event-${ev.id}`}
                        onClick={() => {
                          if (isEditingTimeline) {
                            setSelectedEventForEdit(ev);
                            setIsAddingNewEvent(false);
                            setEditEventTimeSec(ev.timeSec.toString());
                            setEditEventName(ev.name);
                            setEditEventPhase(ev.phase || '');
                          } else {
                            handleJumpToTime(ev.timeSec, ev.name, ev.id);
                          }
                        }}
                        className={`flex items-center gap-2 py-1.5 px-3 rounded-lg transition-all duration-300 font-sans cursor-pointer group hover:scale-[1.01] active:scale-[0.99] border relative ${
                          isBeingEdited
                            ? 'bg-amber-500/20 border-amber-500 shadow-md shadow-amber-950/25 ring-1 ring-amber-500/30'
                            : isActive 
                              ? 'bg-amber-500/10 border-amber-500/30 shadow-sm shadow-amber-900/10 backdrop-blur-sm' 
                              : 'bg-transparent border-transparent hover:bg-neutral-800/60'
                        } ${
                          elapsed > ev.timeSec + 2 && !isEditingTimeline 
                            ? 'opacity-35 mix-blend-luminosity grayscale hover:opacity-80' 
                            : 'opacity-100'
                        }`}
                      >
                        {/* Time label */}
                        <div className={`w-11 md:w-12 text-right tabular-nums font-mono font-medium text-xs flex items-center justify-end gap-1 ${
                          isActive ? 'text-amber-400' : 'text-neutral-500 group-hover:text-neutral-400 transition-colors'
                        }`}>
                          {ev.timeStr}
                        </div>
                        
                        {/* Bullet point indicator */}
                        <div className="relative flex items-center justify-center shrink-0 w-2.5 h-2.5">
                          <div className={`absolute w-1.5 h-1.5 rounded-full transition-all duration-500 outline outline-2 outline-neutral-900 ${
                            isBeingEdited
                              ? 'bg-amber-500 ring-2 ring-amber-500 ring-offset-2 ring-offset-neutral-900 scale-110'
                              : elapsed > ev.timeSec + 2 && !isEditingTimeline 
                                ? 'bg-neutral-600 outline-none' 
                                : isActive 
                                  ? 'bg-amber-500 scale-125 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]' 
                                  : 'bg-neutral-500'
                          }`} />
                        </div>

                        {/* Name and stage mark */}
                        <div className={`flex-1 font-bold text-xs md:text-xs.5 truncate transition-colors px-0.5 flex items-center gap-1.5 ${
                          isActive 
                            ? 'text-amber-500' 
                            : elapsed > ev.timeSec + 2 && !isEditingTimeline 
                              ? 'text-neutral-600 group-hover:text-neutral-300' 
                              : 'text-neutral-300'
                        }`}>
                          {ev.phase && (
                            <span className="px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 text-[10px] scale-85 origin-left shrink-0 border border-neutral-800">{ev.phase}</span>
                          )}
                          <span className="truncate">{ev.name}</span>
                        </div>

                        {/* Edit flag helper label */}
                        {isEditingTimeline && (
                          <div className={`text-[9px] font-bold px-1.5 py-0.2 rounded border shadow-sm shrink-0 transition-opacity whitespace-nowrap opacity-65 group-hover:opacity-100 uppercase ${
                            isBeingEdited 
                              ? 'bg-amber-600 text-white border-amber-500' 
                              : 'bg-neutral-800 text-neutral-400 border-neutral-700/60'
                          }`}>
                            {isBeingEdited ? '編輯中' : '✏️ 編輯'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
      </main>
      )}

      {/* Import / Export Modal */}
      {isImportExportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-5 md:p-6 flex flex-col gap-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
              <h3 className="text-amber-500 font-extrabold text-lg flex items-center gap-2">
                📂 {currentTab} 時間軸 匯入 / 匯出中心
              </h3>
              <button 
                onClick={() => {
                  setIsImportExportOpen(false);
                  setImportSuccess(false);
                }}
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer text-sm font-bold font-mono"
              >
                ✕ 關閉
              </button>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              此功能可以讓您備份自己調整好的時間軸，或是將其他隊友產出的機制秒數/語音播報設定，一鍵貼上並點擊下方進行套用。
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-neutral-300 flex justify-between items-center">
                <span>時間軸資料內容 (JSON 格式)</span>
                {importSuccess && (
                  <span className="text-emerald-400 font-bold animate-pulse text-xs">✓ 匯入成功！已套用自訂時間軸！</span>
                )}
                {importError && (
                  <span className="text-red-400 font-medium text-xs">⚠️ {importError}</span>
                )}
              </label>
              <textarea 
                rows={10}
                value={importJsonStr}
                onChange={(e) => {
                  setImportJsonStr(e.target.value);
                  setImportError(null);
                  setImportSuccess(false);
                }}
                placeholder='在此處貼上時間軸 JSON 資料...'
                className="bg-neutral-950 border border-neutral-850 rounded-2xl p-4 text-xs text-neutral-300 font-mono focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 w-full outline-none resize-none focus:text-white"
              />
            </div>

            <div className="flex gap-2.5 justify-end">
              <button 
                onClick={() => {
                  try {
                    navigator.clipboard.writeText(importJsonStr);
                    showToast("目前時間軸的 JSON 資料已複製到您的剪貼簿！");
                  } catch (e) {
                    showToast("複製失敗，請手動全選文字複製。");
                  }
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-neutral-800 border border-neutral-700/50 hover:bg-neutral-700 hover:text-white text-neutral-200 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                📋 複製內容
              </button>
              
              <button 
                onClick={() => {
                  const error = handleImportTimelineJSON(importJsonStr);
                  if (error) {
                    setImportError(error);
                    setImportSuccess(false);
                  } else {
                    setImportError(null);
                    setImportSuccess(true);
                    setTimeout(() => {
                      setIsImportExportOpen(false);
                      setImportSuccess(false);
                    }, 1200);
                  }
                }}
                className="px-5 py-2 text-xs font-black rounded-xl bg-amber-600 hover:bg-amber-500 text-white transition-all active:scale-95 shadow-lg shadow-amber-950/40 cursor-pointer"
              >
                📥 驗證並套用匯入
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {confirmConfig && confirmConfig.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-5 md:p-6 flex flex-col gap-4 shadow-2xl relative">
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-2.5">
              <span className="text-xl">⚠️</span>
              <h3 className="text-amber-500 font-extrabold text-base">
                {confirmConfig.title}
              </h3>
            </div>
            <p className="text-sm text-neutral-300 leading-relaxed font-sans">
              {confirmConfig.message}
            </p>
            <div className="flex gap-2.5 justify-end pt-2">
              <button 
                onClick={() => setConfirmConfig(null)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  confirmConfig.onConfirm();
                  setConfirmConfig(null);
                }}
                className="px-4 py-2 text-xs font-black rounded-xl bg-red-650 hover:bg-red-550 text-white transition-all active:scale-95 shadow-lg shadow-red-950/40 cursor-pointer"
              >
                確定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[110] bg-neutral-900 border border-emerald-500/80 text-emerald-400 px-5 py-3 rounded-2xl shadow-2xl shadow-black flex items-center gap-2.5 animate-bounce font-extrabold text-xs md:text-sm">
          <span>🔔</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Component: High-fidelity SVGs preserved exactly as the original
// -------------------------------------------------------------

function ArenaMapViewer({
  currentTab,
  activeEventName,
  activeEventTimeSec,
  missingProjectImages,
  onMarkProjectImageMissing,
}: {
  currentTab: 'M2S' | 'M3S' | 'M4S';
  activeEventName: string;
  activeEventTimeSec?: number;
  missingProjectImages: Record<string, boolean>;
  onMarkProjectImageMissing: (filename: string) => void;
}) {
  const useProjectMapImage = true;
  const [activeAltSelect, setActiveAltSelect] = useState<'primary' | 'secondary'>('primary');

  const info = getMechanicInfo(currentTab, activeEventName, activeEventTimeSec);

  useEffect(() => {
    setActiveAltSelect('primary');
  }, [info.key]);

  const originalFilename = (activeAltSelect === 'secondary' && info.altFilename)
    ? info.altFilename
    : info.filename;

  const isM3SFallbackActive = currentTab === 'M3S' && missingProjectImages[originalFilename];

  const projectImageOnThisPhaseFilename = isM3SFallbackActive ? "m3s_map.png" : originalFilename;
  const projectImageMissing = missingProjectImages[projectImageOnThisPhaseFilename];
  const hasProjectImage = !projectImageMissing;
  const projectImageSrc = `./${projectImageOnThisPhaseFilename}`;

  // Determine standard map render nodes with crystal-clear conditionals
  let mainMapDisplay = null;

  if (currentTab === 'M4S') {
    const isWitchHunt = info.key === 'witch_hunt' || activeEventName.includes("魔女狩獵");
    const isFourEight1 = info.key === 'four_eight_1' || activeEventName.includes("四八雷星1");
    const isFourEight2 = info.key === 'four_eight_2' || activeEventName.includes("四八雷星2");
    const isRingIron = info.key === 'ring_iron' || activeEventName.includes("圓環") || activeEventName.includes("環圓");
    const isCannons = info.key === 'cannons' || activeEventName.includes("前後砲");
    const isGuns = info.key === 'gun_shield' || activeEventName.includes("擋槍");
    const isBlazingFire = info.key === 'blazing_fire' || activeEventName.includes("狡詭熾焰");
    const isTricks = info.key === 'tricks' || activeEventName.includes("狡詭特技") || activeEventName.includes("狡鬼特技");
    const isMustard = info.key === 'mustard_bomb' || activeEventName.includes("芥末炸彈") || activeEventName.includes("接線分散") || activeEventName.includes("水火劍");
    const isElementConvert = info.key === 'element_convert_knockback' || activeEventName.includes("火鋼鐵水擊退") || activeEventName.includes("屬性轉換，火鋼鐵");
    const isRedCircleClones = info.key === 'red_circle_clones' || activeEventName.includes("中間放紅圈") || activeEventName.includes("躲2個分身");
    const isMidnight = info.key === 'midnight' || activeEventName.includes("午夜") || activeEventName.includes("光束引導") || activeEventName.includes("狡詭雷電");
    const isGroupTowers = info.key === 'group_towers' || activeEventName.includes("分組踩塔");
    const isSunrise = info.key === 'sunrise' || activeEventName.includes("長短BUFF") || activeEventName.includes("長短消BUFF") || activeEventName.includes("日出");
    const isSwordDance = info.key === 'sword_dance' || activeEventName.includes("劍舞");
    const part2Event = M4S_TIMELINE.find(ev => ev.name === activeEventName || (activeEventName && ev.name.includes(activeEventName)) || (activeEventName && activeEventName.includes(ev.name)));
    const isM4SPart2 = part2Event ? part2Event.timeSec >= 386.9 : false;

    if (isWitchHunt) {
      mainMapDisplay = (
        <div className="w-full flex flex-col gap-3.5 bg-neutral-900/10 p-2.5">
          {[
            { file: "m4s1_map.png", title: "魔女狩獵 狀態 (一)" },
            { file: "m4s1_map1.png", title: "魔女狩獵 狀態 (二)" },
            { file: "m4s1_map2.png", title: "魔女狩獵 狀態 (三)" }
          ].map((item, idx) => (
            <div key={idx} className="relative w-full aspect-[2/1] rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-inner group/item">
              <img 
                src={`./${item.file}`} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-[1.02]"
                onError={() => onMarkProjectImageMissing(item.file)}
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-neutral-950/80 border border-neutral-800/85 text-amber-400 text-[10px] font-black tracking-wider backdrop-blur-sm shadow-md flex items-center gap-1.5 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>{item.title}</span>
                <span className="text-neutral-500 font-mono text-[9px] pl-1 font-normal">2:1</span>
              </div>
            </div>
          ))}
        </div>
      );
    } else if (isGuns) {
      mainMapDisplay = (
        <div className="w-full flex flex-col gap-3.5 bg-neutral-900/10 p-2.5 animate-fadeIn font-sans">
          {[
            { file: "m4s7_map1.png", title: "圓形炸完擋槍 / 擋槍 (一)" },
            { file: "m4s7_map2.png", title: "圓形炸完擋槍 / 擋槍 (二)" },
            { file: "m4s7_map6.png", title: "圓形炸完擋槍 / 擋槍 (三)" },
            { file: "m4s7_map7.png", title: "圓形炸完擋槍 / 擋槍 (四)" }
          ].map((item, idx) => {
            const imgMissing = missingProjectImages[item.file];
            return (
              <div key={idx} className="relative w-full aspect-[2/1] rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-inner group/item">
                {!imgMissing ? (
                  <img 
                    src={`./${item.file}`} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-[1.02]"
                    onError={() => onMarkProjectImageMissing(item.file)}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900/40 min-h-[160px]">
                    <span className="text-xs text-neutral-500 font-mono">缺少 /{item.file} ({item.title})</span>
                  </div>
                )}
                <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-lg bg-neutral-950/85 border border-neutral-800/85 text-amber-400 text-[10px] font-black tracking-wider backdrop-blur-sm shadow-md flex items-center gap-1.5 font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span>{item.title}</span>
                  <span className="text-neutral-500 font-mono text-[9px] pl-1 font-normal">2:1</span>
                </div>
              </div>
            );
          })}
        </div>
      );
    } else if (isFourEight2) {
      mainMapDisplay = (
        <div className="w-full flex flex-col gap-3.5 bg-neutral-900/10 p-2.5 animate-fadeIn">
          {[
            { file: "m4s4_map.png", title: "四八雷星2 - 1/2階段半階" },
            { file: "m4s5_map.png", title: "四八雷星2 - 3/4階段半階" }
          ].map((item, idx) => {
            const imgMissing = missingProjectImages[item.file];
            return (
              <div key={idx} className="relative w-full aspect-[2/1] rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-inner group/item">
                {!imgMissing ? (
                  <img 
                    src={`./${item.file}`} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-[1.02]"
                    onError={() => onMarkProjectImageMissing(item.file)}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900/40">
                    <span className="text-xs text-neutral-500 font-mono">缺少 /{item.file} ({item.title})</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-lg bg-neutral-950/85 border border-neutral-800/85 text-amber-400 text-[10px] font-black tracking-wider backdrop-blur-sm shadow-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span>{item.title}</span>
                  <span className="text-neutral-500 font-mono text-[9px] pl-1 font-normal">2:1</span>
                </div>
              </div>
            );
          })}
        </div>
      );
    } else if (isFourEight1) {
      const imgMissing = missingProjectImages["m4s3_map.png"];
      mainMapDisplay = (
        <div className="w-full h-full relative flex items-center justify-center bg-neutral-950 p-2.5 animate-fadeIn">
          {!imgMissing ? (
            <div className="w-full aspect-[2/1] relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 shadow-inner group/item">
              <img 
                src="./m4s3_map.png" 
                alt="四八雷星1 戰術圖" 
                onError={() => onMarkProjectImageMissing("m4s3_map.png")}
                className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-[1.02]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-lg bg-neutral-950/85 border border-neutral-800 text-amber-400 text-[10px] font-black tracking-wider backdrop-blur-sm shadow-md flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>四八雷星1</span>
                <span className="text-neutral-500 font-mono text-[9px] pl-1 font-normal">2:1</span>
              </div>
            </div>
          ) : (
            <div className="w-full aspect-[2/1] flex flex-col items-center justify-center bg-neutral-900/40 border border-neutral-800 rounded-xl w-full">
              <span className="text-xs text-neutral-500 font-mono">缺少 /m4s3_map.png (四八雷星1)</span>
            </div>
          )}
        </div>
      );
    } else if (isCannons) {
      const imgMissing = missingProjectImages["m4s6_map.png"];
      mainMapDisplay = (
        <div className="w-full h-full relative flex items-center justify-center bg-neutral-950 p-2.5 animate-fadeIn">
          {!imgMissing ? (
            <div className="w-full aspect-[2/1] relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 shadow-inner group/item">
              <img 
                src="./m4s6_map.png" 
                alt="前後砲 戰術圖" 
                onError={() => onMarkProjectImageMissing("m4s6_map.png")}
                className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-[1.02]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-lg bg-neutral-950/85 border border-neutral-800 text-amber-400 text-[10px] font-black tracking-wider backdrop-blur-sm shadow-md flex items-center gap-1.5 flex font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>前後砲 {activeEventName.includes("1") ? "(一)" : activeEventName.includes("2") ? "(二)" : ""}</span>
                <span className="text-neutral-500 font-mono text-[9px] pl-1 font-normal">2:1</span>
              </div>
            </div>
          ) : (
            <div className="w-full aspect-[2/1] flex flex-col items-center justify-center bg-neutral-900/40 border border-neutral-800 rounded-xl w-full">
              <span className="text-xs text-neutral-500 font-mono">缺少 /m4s6_map.png (前後砲)</span>
            </div>
          )}
        </div>
      );
    } else if (isBlazingFire) {
      mainMapDisplay = (
        <div className="w-full flex flex-col gap-3.5 bg-neutral-900/10 p-2.5 animate-fadeIn font-sans">
          {[
            { file: "m4sp2_map0.png", title: "火山噴發+4段分攤 (一)", aspect: "aspect-[5/4]", ratioText: "5:4" },
            { file: "m4sp2_map1.png", title: "火山噴發+4段分攤 (二)", aspect: "aspect-[5/4]", ratioText: "5:4" }
          ].map((item, idx) => {
            const imgMissing = missingProjectImages[item.file];
            return (
              <div key={idx} className={`relative w-full ${item.aspect} rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-inner group/item max-w-[560px] mx-auto`}>
                {!imgMissing ? (
                  <img 
                    src={`./${item.file}`} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-[1.02]"
                    onError={() => onMarkProjectImageMissing(item.file)}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900/40 min-h-[160px]">
                    <span className="text-xs text-neutral-500 font-mono">缺少 /{item.file} ({item.title})</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-lg bg-neutral-950/85 border border-neutral-800 text-amber-400 text-[10px] font-black tracking-wider backdrop-blur-sm shadow-md flex items-center gap-1.5 font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span>{item.title}</span>
                  <span className="text-neutral-500 font-mono text-[9px] pl-1 font-normal">{item.ratioText}</span>
                </div>
              </div>
            );
          })}
        </div>
      );
    } else if (isTricks) {
      const imgMissing = missingProjectImages["m4sp2_map2.png"];
      mainMapDisplay = (
        <div className="w-full h-full relative flex items-center justify-center bg-neutral-950 p-2.5 animate-fadeIn">
          {!imgMissing ? (
            <div className="w-full aspect-[2/1] relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 shadow-inner group/item">
              <img 
                src="./m4sp2_map2.png" 
                alt="狡詭特技 戰術圖" 
                onError={() => onMarkProjectImageMissing("m4sp2_map2.png")}
                className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-[1.02]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-lg bg-neutral-950/85 border border-neutral-800 text-amber-400 text-[10px] font-black tracking-wider backdrop-blur-sm shadow-md flex items-center gap-1.5 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>狡詭特技 ({activeEventName})</span>
                <span className="text-neutral-500 font-mono text-[9px] pl-1 font-normal">2:1</span>
              </div>
            </div>
          ) : (
            <div className="w-full aspect-[2/1] flex flex-col items-center justify-center bg-neutral-900/40 border border-neutral-800 rounded-xl w-full">
              <span className="text-xs text-neutral-500 font-mono">缺少 /m4sp2_map2.png (狡詭特技)</span>
            </div>
          )}
        </div>
      );
    } else if (isMustard) {
      mainMapDisplay = (
        <div className="w-full flex flex-col gap-3.5 bg-neutral-900/10 p-2.5 animate-fadeIn font-sans">
          {[
            { file: "m4sp2_map31.png", title: "接線分散+水火劍 (一)", aspect: "aspect-[5/4]", ratioText: "5:4" },
            { file: "m4sp2_map32.png", title: "接線分散+水火劍 (二)", aspect: "aspect-[5/4]", ratioText: "5:4" },
            { file: "m4sp2_map33.png", title: "接線分散+水火劍 (三)", aspect: "aspect-[5/4]", ratioText: "5:4" }
          ].map((item, idx) => {
            const imgMissing = missingProjectImages[item.file];
            return (
              <div key={idx} className={`relative w-full ${item.aspect} rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-inner group/item max-w-[560px] mx-auto`}>
                {!imgMissing ? (
                  <img 
                    src={`./${item.file}`} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-[1.02]"
                    onError={() => onMarkProjectImageMissing(item.file)}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900/40 min-h-[160px]">
                    <span className="text-xs text-neutral-500 font-mono">缺少 /{item.file} ({item.title})</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-lg bg-neutral-950/85 border border-neutral-800 text-amber-400 text-[10px] font-black tracking-wider backdrop-blur-sm shadow-md flex items-center gap-1.5 font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span>{item.title}</span>
                  <span className="text-neutral-500 font-mono text-[9px] pl-1 font-normal">{item.ratioText}</span>
                </div>
              </div>
            );
          })}
        </div>
      );
    } else if (isElementConvert) {
      const imgMissing = missingProjectImages["m4sp2_map4.png"];
      mainMapDisplay = (
        <div className="w-full h-full relative flex items-center justify-center bg-neutral-950 p-2.5 animate-fadeIn">
          {!imgMissing ? (
            <div className="w-full aspect-[2/1] relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 shadow-inner group/item">
              <img 
                src="./m4sp2_map4.png" 
                alt="屬性轉換 火鋼鐵水擊退" 
                onError={() => onMarkProjectImageMissing("m4sp2_map4.png")}
                className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-[1.02]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-lg bg-neutral-950/85 border border-neutral-800 text-amber-400 text-[10px] font-black tracking-wider backdrop-blur-sm shadow-md flex items-center gap-1.5 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>屬性轉換，火鋼鐵水擊退，尖尾刺 ({activeEventName})</span>
                <span className="text-neutral-500 font-mono text-[9px] pl-1 font-normal">2:1</span>
              </div>
            </div>
          ) : (
            <div className="w-full aspect-[2/1] flex flex-col items-center justify-center bg-neutral-900/40 border border-neutral-800 rounded-xl w-full">
              <span className="text-xs text-neutral-500 font-mono">缺少 /m4sp2_map4.png (火鋼鐵水擊退)</span>
            </div>
          )}
        </div>
      );
    } else if (isRedCircleClones) {
      const imgMissing = missingProjectImages["m4sp2_map5.png"];
      mainMapDisplay = (
        <div className="w-full h-full relative flex items-center justify-center bg-neutral-950 p-2.5 animate-fadeIn">
          {!imgMissing ? (
            <div className="w-full aspect-[5/4] relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 shadow-inner group/item max-w-[560px]">
              <img 
                src="./m4sp2_map5.png" 
                alt="中間放紅圈 躲2個分身半場刀" 
                onError={() => onMarkProjectImageMissing("m4sp2_map5.png")}
                className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-[1.02]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-lg bg-neutral-950/85 border border-neutral-800 text-amber-400 text-[10px] font-black tracking-wider backdrop-blur-sm shadow-md flex items-center gap-1.5 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>中間放紅圈，躲2個分身半場刀 ({activeEventName})</span>
                <span className="text-neutral-500 font-mono text-[9px] pl-1 font-normal">5:4</span>
              </div>
            </div>
          ) : (
            <div className="w-full aspect-[5/4] flex flex-col items-center justify-center bg-neutral-900/40 border border-neutral-800 rounded-xl max-w-[560px] w-full">
              <span className="text-xs text-neutral-500 font-mono">缺少 /m4sp2_map5.png (分身半場刀)</span>
            </div>
          )}
        </div>
      );
    } else if (isMidnight) {
      mainMapDisplay = (
        <div className="w-full flex flex-col gap-3.5 bg-neutral-900/10 p-2.5 animate-fadeIn font-sans">
          {[
            { file: "m4sp2_map61.png", title: "午夜一階段", aspect: "aspect-[5/4]", ratioText: "5:4" },
            { file: "m4sp2_map62.png", title: "午夜二階段 (一)", aspect: "aspect-[2/1]", ratioText: "2:1" },
            { file: "m4sp2_map63.png", title: "午夜二階段 (二)", aspect: "aspect-[2/1]", ratioText: "2:1" }
          ].map((item, idx) => {
            const imgMissing = missingProjectImages[item.file];
            return (
              <div key={idx} className={`relative w-full ${item.aspect} rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-inner group/item max-w-[560px] mx-auto`}>
                {!imgMissing ? (
                  <img 
                    src={`./${item.file}`} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-[1.02]"
                    onError={() => onMarkProjectImageMissing(item.file)}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900/40 min-h-[160px]">
                    <span className="text-xs text-neutral-500 font-mono">缺少 /{item.file} ({item.title})</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-lg bg-neutral-950/85 border border-neutral-800 text-amber-400 text-[10px] font-black tracking-wider backdrop-blur-sm shadow-md flex items-center gap-1.5 font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span>{item.title} ({activeEventName})</span>
                  <span className="text-neutral-500 font-mono text-[9px] pl-1 font-normal">{item.ratioText}</span>
                </div>
              </div>
            );
          })}
        </div>
      );
    } else if (isSunrise) {
      const imgMissing = missingProjectImages["m4sp2_map8.png"];
      mainMapDisplay = (
        <div className="w-full h-full relative flex flex-col items-center justify-center bg-neutral-950 p-2.5 animate-fadeIn">
          {!imgMissing ? (
            <div className="flex flex-col gap-2 w-full max-w-[800px]">
              <div className="w-full aspect-[2.2/1] relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 shadow-inner group/item">
                <img 
                  src="./m4sp2_map8.png" 
                  alt="長短BUFF引導+踩塔" 
                  onError={() => onMarkProjectImageMissing("m4sp2_map8.png")}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="self-start px-2.5 py-1 rounded-lg bg-neutral-900/40 border border-neutral-800/60 text-amber-400 text-[10.5px] font-black tracking-wider shadow-sm flex items-center gap-1.5 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>長短BUFF引導+踩塔 ({activeEventName})</span>
                <span className="text-neutral-500 font-mono text-[9px] pl-1 font-normal">2.2:1</span>
              </div>
            </div>
          ) : (
            <div className="w-full aspect-[2.2/1] flex flex-col items-center justify-center bg-neutral-900/40 border border-neutral-800 rounded-xl max-w-[800px] w-full">
              <span className="text-xs text-neutral-500 font-mono">缺少 /m4sp2_map8.png (長短BUFF引導+踩塔)</span>
            </div>
          )}
        </div>
      );
    } else if (isSwordDance) {
      const imgMissing = missingProjectImages["m4sp2_map9.png"];
      mainMapDisplay = (
        <div className="w-full h-full relative flex flex-col items-center justify-center bg-neutral-950 p-2.5 animate-fadeIn">
          {!imgMissing ? (
            <div className="flex flex-col gap-2 w-full max-w-[800px]">
              <div className="w-full aspect-[3/1] relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 shadow-inner group/item">
                <img 
                  src="./m4sp2_map9.png" 
                  alt="劍舞狂暴階段" 
                  onError={() => onMarkProjectImageMissing("m4sp2_map9.png")}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="self-start px-2.5 py-1 rounded-lg bg-neutral-900/40 border border-neutral-800/60 text-amber-400 text-[10.5px] font-black tracking-wider shadow-sm flex items-center gap-1.5 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>劍舞狂暴階段 ({activeEventName})</span>
                <span className="text-neutral-500 font-mono text-[9px] pl-1 font-normal">3:1</span>
              </div>
            </div>
          ) : (
            <div className="w-full aspect-[3/1] flex flex-col items-center justify-center bg-neutral-900/40 border border-neutral-800 rounded-xl max-w-[800px] w-full">
              <span className="text-xs text-neutral-500 font-mono">缺少 /m4sp2_map9.png (劍舞狂暴階段)</span>
            </div>
          )}
        </div>
      );
    } else if (isGroupTowers) {
      mainMapDisplay = (
        <div className="w-full flex flex-col gap-3.5 bg-neutral-900/10 p-2.5 animate-fadeIn">
          {[
            { file: "m4sp2_map70.png", title: "火焰斬 & 分組踩塔 (一)" },
            { file: "m4sp2_map71.png", title: "火焰斬 & 分組踩塔 (二)" }
          ].map((item, idx) => {
            const imgMissing = missingProjectImages[item.file];
            return (
              <div key={idx} className="relative w-full aspect-[5/4] rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-inner group/item">
                {!imgMissing ? (
                  <img 
                    src={`./${item.file}`} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-[1.02]"
                    onError={() => onMarkProjectImageMissing(item.file)}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900/40 min-h-[250px]">
                    <span className="text-xs text-neutral-500 font-mono">缺少 /{item.file} ({item.title})</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-lg bg-neutral-950/85 border border-neutral-800 text-amber-400 text-[10px] font-black tracking-wider backdrop-blur-sm shadow-md flex items-center gap-1.5 font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span>{item.title}</span>
                  <span className="text-neutral-500 font-mono text-[9px] pl-1 font-normal">5:4</span>
                </div>
              </div>
            );
          })}
        </div>
      );
    } else if (isRingIron) {
      const imgMissing = missingProjectImages["m4s2_map.png"];
      mainMapDisplay = (
        <div className="w-full h-full relative flex items-center justify-center bg-neutral-950 p-2.5 animate-fadeIn">
          {!imgMissing ? (
            <div className="w-full aspect-square relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 shadow-inner group/item max-w-[560px]">
              <img 
                src="./m4s2_map.png" 
                alt="圓環鋼鐵+環圓月環 戰術圖" 
                onError={() => onMarkProjectImageMissing("m4s2_map.png")}
                className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-[1.02]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-lg bg-neutral-950/85 border border-neutral-800 text-amber-400 text-[10px] font-black tracking-wider backdrop-blur-sm shadow-md flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                <span>圓環鋼鐵+環圓月環</span>
                <span className="text-neutral-500 font-mono text-[9px] pl-1 font-normal">1:1</span>
              </div>
            </div>
          ) : (
            <div className="w-full aspect-square flex flex-col items-center justify-center bg-neutral-900/40 border border-neutral-800 rounded-xl max-w-[560px] w-full">
              <span className="text-xs text-neutral-500 font-mono">缺少 /m4s2_map.png (圓環+環圓)</span>
            </div>
          )}
        </div>
      );
    } else if (isM4SPart2) {
      const imgMissing = missingProjectImages["m4sp2_map.png"];
      mainMapDisplay = (
        <div className="w-full h-full relative flex items-center justify-center bg-neutral-950 p-2.5 animate-fadeIn">
          {!imgMissing ? (
            <div className="w-full aspect-[4/3] relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 shadow-inner group/item max-w-[560px]">
              <img 
                src="./m4sp2_map.png" 
                alt="後半準備/默認地圖" 
                onError={() => onMarkProjectImageMissing("m4sp2_map.png")}
                className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-[1.02]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-lg bg-neutral-950/85 border border-neutral-800 text-amber-400 text-[10px] font-black tracking-wider backdrop-blur-sm shadow-md flex items-center gap-1.5 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>{activeEventName || "後半階段"} (默認地圖)</span>
                <span className="text-neutral-500 font-mono text-[9px] pl-1 font-normal">4:3</span>
              </div>
            </div>
          ) : (
            <div className="w-full aspect-[4/3] flex flex-col items-center justify-center bg-neutral-900/40 border border-neutral-800 rounded-xl max-w-[560px] w-full">
              <span className="text-xs text-neutral-500 font-mono">缺少 /m4sp2_map.png (後半默認圖)</span>
            </div>
          )}
        </div>
      );
    } else {
      mainMapDisplay = (
        <div className="w-full h-full relative flex items-center justify-center bg-neutral-950">
          <img 
            src="./m4s_map.png" 
            alt="M4S Arena Outline" 
            onError={() => onMarkProjectImageMissing("m4s_map.png")}
            className="w-full h-full object-cover animate-fadeIn"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-lg bg-neutral-950/85 border border-neutral-800 text-amber-400 text-[10px] font-black tracking-wider backdrop-blur-sm shadow-md flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
            <span>M4S 戰術地圖</span>
            <span className="text-neutral-500 font-mono text-[9px] pl-1 font-normal">1:1</span>
          </div>
        </div>
      );
    }
  } else if (info.key === 'knockback' && useProjectMapImage) {
    // 1. Dual side-by-side view for knockback (強震衝) displaying two 2:1 ratio diagrams simultaneously
    const img1Missing = missingProjectImages[info.filename];
    const img2Missing = info.altFilename ? missingProjectImages[info.altFilename] : true;
    
    mainMapDisplay = (
      <div className="w-full h-full flex flex-col divide-y divide-neutral-800">
        <div className="w-full h-1/2 relative overflow-hidden bg-neutral-900/10">
          {!img1Missing ? (
            <img 
              src={`./${info.filename}`} 
              alt="Earthquake 1 (Attenuate)"  
              onError={() => onMarkProjectImageMissing(info.filename)}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-neutral-900/45">
              <span className="text-[10px] text-neutral-500 font-mono">缺少 /{info.filename}</span>
            </div>
          )}
          <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-neutral-950/80 border border-neutral-800 text-amber-400 text-[10px] font-black tracking-wider backdrop-blur-sm shadow-md">
            圖 1 (衰減)
          </div>
        </div>
        <div className="w-full h-1/2 relative overflow-hidden bg-neutral-900/10">
          {!img2Missing && info.altFilename ? (
            <img 
              src={`./${info.altFilename}`} 
              alt="Earthquake 2 (Knockback)"  
              onError={() => onMarkProjectImageMissing(info.altFilename!)}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-[#150d0a]/90/45">
              <span className="text-[10px] text-neutral-500 font-mono">缺少 /{info.altFilename}</span>
            </div>
          )}
          <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-neutral-950/80 border border-neutral-800 text-amber-400 text-[10px] font-black tracking-wider backdrop-blur-sm shadow-md">
            圖 2 (擊退)
          </div>
        </div>
        
        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-all duration-300 z-10 pointer-events-none group-hover:pointer-events-auto">
          <span className="text-xs text-cyan-400 font-bold tracking-wider text-center leading-normal">
            已啟用強震衝雙地圖同時顯示
            <span className="block text-[9px] font-mono font-medium text-neutral-400 mt-0.5">/{info.filename} + /{info.altFilename}</span>
          </span>
        </div>
      </div>
    );
  } else if (hasProjectImage && useProjectMapImage) {
    // 2. Teammates shared file uploaded to public directory
    mainMapDisplay = (
      <div className="w-full h-full relative">
        <img 
          src={projectImageSrc} 
          alt="Team Arena Map" 
          onError={() => onMarkProjectImageMissing(projectImageOnThisPhaseFilename)}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-all duration-300">
          <span className="text-xs text-cyan-400 font-bold tracking-wider text-center px-4 leading-normal">
            {isM3SFallbackActive ? (
              <>
                缺少 /{originalFilename} <br />
                <span className="text-[10px] font-mono font-medium text-amber-500 font-black">已自動套用倒數準備圖</span>
              </>
            ) : (
              <>
                已啟用專案共享圖 <br />
                <span className="text-[10px] font-mono font-medium text-neutral-400">/{projectImageOnThisPhaseFilename}</span>
              </>
            )}
          </span>
        </div>
      </div>
    );
  } else {
    // 3. Fallback high-fidelity SVG interactive vectors
    mainMapDisplay = (
      <div className="w-full h-full relative animate-fadeIn">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <defs>
            <rect id="dummy-rect-fallback" />
            <radialGradient id="vignette-grad-re" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f4dab8" />
              <stop offset="12%" stopColor="#d8ab87" />
              <stop offset="42%" stopColor="#925e3c" />
              <stop offset="78%" stopColor="#4f2e1a" />
              <stop offset="100%" stopColor="#180a04" />
            </radialGradient>

            <linearGradient id="gold-frame-re" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbe8be" />
              <stop offset="35%" stopColor="#cfab6c" />
              <stop offset="65%" stopColor="#9d763c" />
              <stop offset="100%" stopColor="#ebd6a1" />
            </linearGradient>

            <filter id="halo-blur-map" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="15" />
            </filter>

            <filter id="glow-red-map-re" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur1" />
              <feGaussianBlur stdDeviation="2.5" result="blur2" />
              <feComponentTransfer in="blur1" result="boost">
                <feFuncA type="linear" slope="2.5" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode in="boost" />
                <feMergeNode in="blur2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="glow-yellow-map-re" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur1" />
              <feGaussianBlur stdDeviation="2.5" result="blur2" />
              <feComponentTransfer in="blur1" result="boost">
                <feFuncA type="linear" slope="2.5" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode in="boost" />
                <feMergeNode in="blur2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="glow-blue-map-re" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur1" />
              <feGaussianBlur stdDeviation="2.5" result="blur2" />
              <feComponentTransfer in="blur1" result="boost">
                <feFuncA type="linear" slope="2.5" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode in="boost" />
                <feMergeNode in="blur2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="glow-purple-map-re" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur1" />
              <feGaussianBlur stdDeviation="2.5" result="blur2" />
              <feComponentTransfer in="blur1" result="boost">
                <feFuncA type="linear" slope="2.5" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode in="boost" />
                <feMergeNode in="blur2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width="400" height="400" fill="url(#vignette-grad-re)" />

          <g stroke="#ffd899" strokeOpacity="0.32" fill="none" strokeLinejoin="round">
            <circle cx="200" cy="200" r="180" strokeWidth="2.5" strokeOpacity="0.25" />
            <circle cx="200" cy="200" r="140" strokeWidth="2" strokeOpacity="0.3" />
            <circle cx="200" cy="200" r="80" strokeWidth="2" strokeOpacity="0.35" />
            <circle cx="200" cy="200" r="40" strokeWidth="1.5" strokeOpacity="0.4" />

            <circle cx="200" cy="80" r="130" strokeWidth="1.5" strokeOpacity="0.3" />
            <circle cx="200" cy="320" r="130" strokeWidth="1.5" strokeOpacity="0.3" />
            <circle cx="80" cy="200" r="130" strokeWidth="1.5" strokeOpacity="0.3" />
            <circle cx="320" cy="200" r="130" strokeWidth="1.5" strokeOpacity="0.3" />

            <circle cx="110" cy="110" r="130" strokeWidth="1.2" strokeOpacity="0.2" />
            <circle cx="290" cy="110" r="130" strokeWidth="1.2" strokeOpacity="0.2" />
            <circle cx="110" cy="290" r="130" strokeWidth="1.2" strokeOpacity="0.2" />
            <circle cx="290" cy="290" r="130" strokeWidth="1.2" strokeOpacity="0.2" />

            <line x1="20" y1="20" x2="380" y2="380" strokeWidth="1" strokeOpacity="0.15" />
            <line x1="380" y1="20" x2="20" y2="380" strokeWidth="1" strokeOpacity="0.15" />
            <line x1="200" y1="15" x2="200" y2="385" strokeWidth="1" strokeOpacity="0.15" />
            <line x1="15" y1="200" x2="385" y2="200" strokeWidth="1" strokeOpacity="0.15" />
          </g>

          <rect x="0" y="0" width="400" height="4" fill="#0c0502" />
          <rect x="0" y="396" width="400" height="4" fill="#0c0502" />
          <rect x="0" y="0" width="4" height="400" fill="#0c0502" />
          <rect x="396" y="0" width="4" height="400" fill="#0c0502" />

          <rect x="5" y="5" width="390" height="390" fill="none" stroke="url(#gold-frame-re)" strokeWidth="3" rx="14" strokeOpacity="0.85" />
          <rect x="8" y="8" width="384" height="384" fill="none" stroke="#2a1106" strokeWidth="2.5" rx="12" />
          <rect x="12" y="12" width="376" height="376" fill="none" stroke="#eedcac" strokeWidth="0.8" rx="10" strokeOpacity="0.25" />

          <g transform="translate(200, 110)">
            <circle r="22" fill="#ff2244" opacity="0.32" filter="url(#halo-blur-map)" />
            <circle r="15" fill="none" stroke="#ff3255" strokeWidth="3" filter="url(#glow-red-map-re)" />
            <circle r="13" fill="#ff1133" fillOpacity="0.25" />
            <text y="7" fontFamily="'Cinzel Decorative', 'Georgia', serif" fontSize="21" fontWeight="900" fill="#ffffff" filter="url(#glow-red-map-re)" textAnchor="middle">A</text>
          </g>

          <g transform="translate(290, 200)">
            <circle r="22" fill="#ffdd22" opacity="0.28" filter="url(#halo-blur-map)" />
            <circle r="15" fill="none" stroke="#ffdd00" strokeWidth="3" filter="url(#glow-yellow-map-re)" />
            <circle r="13" fill="#ffcc00" fillOpacity="0.22" />
            <text y="7" fontFamily="'Cinzel Decorative', 'Georgia', serif" fontSize="21" fontWeight="900" fill="#ffffff" filter="url(#glow-yellow-map-re)" textAnchor="middle">B</text>
          </g>

          <g transform="translate(200, 290)">
            <circle r="22" fill="#2299ff" opacity="0.35" filter="url(#halo-blur-map)" />
            <circle r="15" fill="none" stroke="#0099ff" strokeWidth="3" filter="url(#glow-blue-map-re)" />
            <circle r="13" fill="#0088ff" fillOpacity="0.25" />
            <text y="7" fontFamily="'Cinzel Decorative', 'Georgia', serif" fontSize="21" fontWeight="900" fill="#ffffff" filter="url(#glow-blue-map-re)" textAnchor="middle">C</text>
          </g>

          <g transform="translate(110, 200)">
            <circle r="22" fill="#dd33ff" opacity="0.35" filter="url(#halo-blur-map)" />
            <circle r="15" fill="none" stroke="#dd33ff" strokeWidth="3" filter="url(#glow-purple-map-re)" />
            <circle r="13" fill="#cc11ff" fillOpacity="0.25" />
            <text y="7" fontFamily="'Cinzel Decorative', 'Georgia', serif" fontSize="21" fontWeight="900" fill="#ffffff" filter="url(#glow-purple-map-re)" textAnchor="middle">D</text>
          </g>

          <g transform="translate(125, 125)">
            <rect x="-22" y="-22" width="44" height="44" rx="8" fill="#ff2244" opacity="0.3" filter="url(#halo-blur-map)" />
            <rect x="-14" y="-14" width="28" height="28" rx="5" fill="none" stroke="#ff3255" strokeWidth="3" filter="url(#glow-red-map-re)" />
            <rect x="-12.5" y="-12.5" width="25" height="25" rx="4.5" fill="#ff1133" fillOpacity="0.25" />
            <text y="7.5" fontFamily="'Cinzel Decorative', 'Georgia', serif" fontSize="21" fontWeight="900" fill="#ffffff" filter="url(#glow-red-map-re)" textAnchor="middle">1</text>
          </g>

          <g transform="translate(275, 125)">
            <rect x="-22" y="-22" width="44" height="44" rx="8" fill="#ffdd22" opacity="0.25" filter="url(#halo-blur-map)" />
            <rect x="-14" y="-14" width="28" height="28" rx="5" fill="none" stroke="#ffdd00" strokeWidth="3" filter="url(#glow-yellow-map-re)" />
            <rect x="-12.5" y="-12.5" width="25" height="25" rx="4.5" fill="#ffcc00" fillOpacity="0.22" />
            <text y="7.5" fontFamily="'Cinzel Decorative', 'Georgia', serif" fontSize="21" fontWeight="900" fill="#ffffff" filter="url(#glow-yellow-map-re)" textAnchor="middle">2</text>
          </g>

          <g transform="translate(275, 275)">
            <rect x="-22" y="-22" width="44" height="44" rx="8" fill="#2299ff" opacity="0.32" filter="url(#halo-blur-map)" />
            <rect x="-14" y="-14" width="28" height="28" rx="5" fill="none" stroke="#0099ff" strokeWidth="3" filter="url(#glow-blue-map-re)" />
            <rect x="-12.5" y="-12.5" width="25" height="25" rx="4.5" fill="#0088ff" fillOpacity="0.25" />
            <text y="7.5" fontFamily="'Cinzel Decorative', 'Georgia', serif" fontSize="21" fontWeight="900" fill="#ffffff" filter="url(#glow-blue-map-re)" textAnchor="middle">3</text>
          </g>

          <g transform="translate(125, 275)">
            <rect x="-22" y="-22" width="44" height="44" rx="8" fill="#dd33ff" opacity="0.32" filter="url(#halo-blur-map)" />
            <rect x="-14" y="-14" width="28" height="28" rx="5" fill="none" stroke="#dd33ff" strokeWidth="3" filter="url(#glow-purple-map-re)" />
            <rect x="-12.5" y="-12.5" width="25" height="25" rx="4.5" fill="#cc11ff" fillOpacity="0.25" />
            <text y="7.5" fontFamily="'Cinzel Decorative', 'Georgia', serif" fontSize="21" fontWeight="900" fill="#ffffff" filter="url(#glow-purple-map-re)" textAnchor="middle">4</text>
          </g>
        </svg>
      </div>
    );
  }

  const isTowers = info.key === 'towers';
  const isKnockback = info.key === 'knockback';
  const isFuse = info.key === 'fuse';

  const borderBgClasses = 'border-neutral-800 bg-neutral-950 shadow-2xl hover:border-neutral-700';

  let containerSizingClass = "w-full max-w-[560px] aspect-square";
  if (currentTab === 'M2S') {
    if (info.filename === 'm2s_map5.png' || info.filename === 'm2s_map7.png' || info.filename === 'm2s_map9.png') {
      containerSizingClass = "w-full max-w-[800px] aspect-[2/1] animate-fadeIn";
    } else if (info.filename === 'm2s_map8.png') {
      containerSizingClass = "w-full max-w-[800px] aspect-[2/0.9] animate-fadeIn";
    } else {
      containerSizingClass = "w-full max-w-[560px] aspect-square animate-fadeIn";
    }
  } else if (currentTab === 'M4S') {
    const isWitchHunt = info.key === 'witch_hunt' || activeEventName.includes("魔女狩獵");
    const isFourEight1 = info.key === 'four_eight_1' || activeEventName.includes("四八雷星1");
    const isFourEight2 = info.key === 'four_eight_2' || activeEventName.includes("四八雷星2");
    const isRingIron = info.key === 'ring_iron' || activeEventName.includes("圓環") || activeEventName.includes("環圓");
    const isGuns = info.key === 'gun_shield' || activeEventName.includes("擋槍");
    const isBlazingFire = info.key === 'blazing_fire' || activeEventName.includes("狡詭熾焰");
    const isTricks = info.key === 'tricks' || activeEventName.includes("狡詭特技") || activeEventName.includes("狡鬼特技");
    const isCannons = info.key === 'cannons' || activeEventName.includes("前後砲");
    const isMustard = info.key === 'mustard_bomb' || activeEventName.includes("芥末炸彈") || activeEventName.includes("接線分散") || activeEventName.includes("水火劍");
    const isElementConvert = info.key === 'element_convert_knockback' || activeEventName.includes("火鋼鐵水擊退") || activeEventName.includes("屬性轉換，火鋼鐵");
    const isRedCircleClones = info.key === 'red_circle_clones' || activeEventName.includes("中間放紅圈") || activeEventName.includes("躲2個分身");
    const isMidnight = info.key === 'midnight' || activeEventName.includes("午夜") || activeEventName.includes("光束引導") || activeEventName.includes("狡詭雷電");
    const isGroupTowers = info.key === 'group_towers' || activeEventName.includes("分組踩塔");
    const isSunrise = info.key === 'sunrise' || activeEventName.includes("長短BUFF") || activeEventName.includes("長短消BUFF") || activeEventName.includes("日出");
    const isSwordDance = info.key === 'sword_dance' || activeEventName.includes("劍舞");
    const part2Event = M4S_TIMELINE.find(ev => ev.name === activeEventName || (activeEventName && ev.name.includes(activeEventName)) || (activeEventName && activeEventName.includes(ev.name)));
    const isM4SPart2 = part2Event ? part2Event.timeSec >= 386.9 : false;
    if (isWitchHunt || isFourEight1 || isFourEight2 || isGuns || isBlazingFire || isMustard || isMidnight || isSwordDance || isGroupTowers) {
      containerSizingClass = "w-full max-w-[800px] h-auto pb-1 animate-fadeIn";
    } else if (isSunrise) {
      containerSizingClass = "w-full max-w-[800px] h-auto pb-1 animate-fadeIn";
    } else if (isCannons || isTricks || isElementConvert) {
      containerSizingClass = "w-full max-w-[800px] aspect-[2/1] animate-fadeIn";
    } else if (isRedCircleClones) {
      containerSizingClass = "w-full max-w-[560px] aspect-[5/4] animate-fadeIn";
    } else if (isRingIron) {
      containerSizingClass = "w-full max-w-[560px] aspect-square animate-fadeIn";
    } else if (isM4SPart2) {
      containerSizingClass = "w-full max-w-[560px] aspect-[4/3] animate-fadeIn";
    } else {
      containerSizingClass = "w-full max-w-[560px] aspect-square animate-fadeIn";
    }
  } else if ((isTowers || isFuse) && useProjectMapImage) {
    containerSizingClass = "w-full max-w-[800px] aspect-[2/1] animate-fadeIn";
  } else if (isKnockback && useProjectMapImage) {
    containerSizingClass = "w-full max-w-[800px] aspect-square animate-fadeIn";
  } else {
    containerSizingClass = "w-full max-w-[560px] aspect-square animate-fadeIn";
  }

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div 
        className={`relative rounded-2xl border transition-all duration-300 overflow-hidden group select-none ${containerSizingClass} ${borderBgClasses}`}
      >
        {mainMapDisplay}
      </div>
    </div>
  );
}

function LariatThumbnail({ type }: { type: string }) {
  // Common visual styles for compact Lariat overview card SVGs
  const isFire = type.startsWith('fire');
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full rounded-xl bg-[#201712] border border-neutral-800/80 shadow-md">
      <circle cx="100" cy="100" r="90" fill="none" stroke="#cca470" strokeWidth="1" strokeOpacity="0.12" />
      <circle cx="100" cy="100" r="70" fill="none" stroke="#cca470" strokeWidth="1" strokeOpacity="0.12" />
      {isFire && (
        <>
          <circle cx="100" cy="100" r="85" fill="none" stroke="#f97316" strokeWidth="18" strokeOpacity="0.3" />
          <circle cx="100" cy="100" r="76" fill="none" stroke="#f97316" strokeWidth="1" strokeOpacity="0.4" stroke-dasharray="2" />
        </>
      )}
      <line x1="100" y1="10" x2="100" y2="190" stroke="#f43f5e" strokeWidth="1.2" strokeOpacity="0.4" strokeDasharray="2" />
      <line x1="10" y1="100" x2="190" y2="100" stroke="#f43f5e" strokeWidth="1.2" strokeOpacity="0.4" strokeDasharray="2" />
      
      {/* Anchor Waymark A */}
      <circle cx="100" cy="55" r="10" fill={isFire ? '#f97316' : '#ef4444'} fillOpacity="0.1" stroke={isFire ? '#f97316' : '#f87171'} strokeWidth="0.5" />
      <text y="58" x="100" fontSize="8" fill="#ffffff" textAnchor="middle">A</text>

      {type === 'no-fire-4' && (
        <>
          {/* NW pair */}
          <circle cx="56" cy="52" r="5" fill="#3b82f6" stroke="#93c5fd" strokeWidth="0.5" /> <text x="56" y="54" fontSize="6" fill="white" fontWeight="900" textAnchor="middle">M</text>
          <circle cx="53" cy="67" r="5" fill="#10b981" stroke="#a7f3d0" strokeWidth="0.5" /> <text x="53" y="69" fontSize="5" fill="white" fontWeight="900" textAnchor="middle">H1</text>
          <circle cx="68" cy="58" r="5" fill="#ef4444" stroke="#fca5a5" strokeWidth="0.5" /> <text x="68" y="60" fontSize="6" fill="white" fontWeight="900" textAnchor="middle">3</text>
          {/* NE pair */}
          <circle cx="140" cy="55" r="5" fill="#10b981" stroke="#a7f3d0" strokeWidth="0.5" /> <text x="140" y="57" fontSize="5" fill="white" fontWeight="900" textAnchor="middle">H2</text>
          <circle cx="127" cy="65" r="5" fill="#ef4444" stroke="#fca5a5" strokeWidth="0.5" /> <text x="127" y="67" fontSize="6" fill="white" fontWeight="900" textAnchor="middle">4</text>
          {/* SW pair */}
          <circle cx="58" cy="140" r="5" fill="#10b981" stroke="#a7f3d0" strokeWidth="0.5" /> <text x="58" y="142" fontSize="5" fill="white" fontWeight="900" textAnchor="middle">H1</text>
          <circle cx="68" cy="130" r="5" fill="#ef4444" stroke="#fca5a5" strokeWidth="0.5" /> <text x="68" y="132" fontSize="6" fill="white" fontWeight="900" textAnchor="middle">1</text>
          {/* SE pair */}
          <circle cx="130" cy="142" r="5" fill="#3b82f6" stroke="#93c5fd" strokeWidth="0.5" /> <text x="130" y="144" fontSize="6" fill="white" fontWeight="900" textAnchor="middle">S</text>
          <circle cx="140" cy="130" r="5" fill="#ef4444" stroke="#fca5a5" strokeWidth="0.5" /> <text x="140" y="132" fontSize="6" fill="white" fontWeight="900" textAnchor="middle">2</text>
        </>
      )}

      {type === 'no-fire-8' && (
        <>
          <line x1="36" y1="36" x2="164" y2="164" stroke="#f43f5e" strokeWidth="1" strokeOpacity="0.2" stroke-dasharray="2" />
          <line x1="164" y1="36" x2="36" y2="164" stroke="#f43f5e" strokeWidth="1" strokeOpacity="0.2" stroke-dasharray="2" />
          <circle cx="100" cy="35" r="5" fill="#3b82f6" stroke="#93c5fd" strokeWidth="0.5" /> <text x="100" y="37" fontSize="6" fill="white" fontWeight="900" textAnchor="middle">M</text>
          <circle cx="100" cy="165" r="5" fill="#3b82f6" stroke="#93c5fd" strokeWidth="0.5" /> <text x="100" y="167" fontSize="6" fill="white" fontWeight="900" textAnchor="middle">S</text>
          <circle cx="35" cy="100" r="5" fill="#10b981" stroke="#a7f3d0" strokeWidth="0.5" /> <text x="35" y="102" fontSize="5" fill="white" fontWeight="900" textAnchor="middle">H1</text>
          <circle cx="165" cy="100" r="5" fill="#10b981" stroke="#a7f3d0" strokeWidth="0.5" /> <text x="165" y="102" fontSize="5" fill="white" fontWeight="900" textAnchor="middle">H2</text>
          <circle cx="58" cy="58" r="5" fill="#ef4444" stroke="#fca5a5" strokeWidth="0.5" /> <text x="58" y="60" fontSize="6" fill="white" fontWeight="900" textAnchor="middle">3</text>
          <circle cx="142" cy="58" r="5" fill="#ef4444" stroke="#fca5a5" strokeWidth="0.5" /> <text x="142" y="60" fontSize="6" fill="white" fontWeight="900" textAnchor="middle">4</text>
          <circle cx="58" cy="142" r="5" fill="#ef4444" stroke="#fca5a5" strokeWidth="0.5" /> <text x="58" y="144" fontSize="6" fill="white" fontWeight="900" textAnchor="middle">1</text>
          <circle cx="142" cy="142" r="5" fill="#ef4444" stroke="#fca5a5" strokeWidth="0.5" /> <text x="142" y="144" fontSize="6" fill="white" fontWeight="900" textAnchor="middle">2</text>
        </>
      )}

      {type === 'fire-4' && (
        <>
          <circle cx="65" cy="58" r="5" fill="#3b82f6" stroke="#93c5fd" strokeWidth="0.5" /> <text x="65" y="60" fontSize="6" fill="white" fontWeight="900" textAnchor="middle">M</text>
          <circle cx="60" cy="71" r="5" fill="#10b981" stroke="#a7f3d0" strokeWidth="0.5" /> <text x="60" y="73" fontSize="5" fill="white" fontWeight="900" textAnchor="middle">H1</text>
          <circle cx="74" cy="65" r="5" fill="#ef4444" stroke="#fca5a5" strokeWidth="0.5" /> <text x="74" y="67" fontSize="6" fill="white" fontWeight="900" textAnchor="middle">3</text>
          <circle cx="134" cy="62" r="5" fill="#10b981" stroke="#a7f3d0" strokeWidth="0.5" /> <text x="134" y="64" fontSize="5" fill="white" fontWeight="900" textAnchor="middle">H2</text>
          <circle cx="122" cy="71" r="5" fill="#ef4444" stroke="#fca5a5" strokeWidth="0.5" /> <text x="122" y="73" fontSize="6" fill="white" fontWeight="900" textAnchor="middle">4</text>
          <circle cx="63" cy="132" r="5" fill="#10b981" stroke="#a7f3d0" strokeWidth="0.5" /> <text x="63" y="134" fontSize="5" fill="white" fontWeight="900" textAnchor="middle">H1</text>
          <circle cx="75" cy="122" r="5" fill="#ef4444" stroke="#fca5a5" strokeWidth="0.5" /> <text x="75" y="124" fontSize="6" fill="white" fontWeight="900" textAnchor="middle">1</text>
          <circle cx="128" cy="133" r="5" fill="#3b82f6" stroke="#93c5fd" strokeWidth="0.5" /> <text x="128" y="135" fontSize="6" fill="white" fontWeight="900" textAnchor="middle">S</text>
          <circle cx="135" cy="122" r="5" fill="#ef4444" stroke="#fca5a5" strokeWidth="0.5" /> <text x="135" y="124" fontSize="6" fill="white" fontWeight="900" textAnchor="middle">2</text>
        </>
      )}

      {type === 'fire-8' && (
        <>
          <line x1="36" y1="36" x2="164" y2="164" stroke="#f43f5e" strokeWidth="1" strokeOpacity="0.2" stroke-dasharray="2" />
          <line x1="164" y1="36" x2="36" y2="164" stroke="#f43f5e" strokeWidth="1" strokeOpacity="0.2" stroke-dasharray="2" />
          <circle cx="100" cy="72" r="5" fill="#3b82f6" stroke="#93c5fd" strokeWidth="0.5" /> <text x="100" y="74" fontSize="6" fill="white" fontWeight="900" textAnchor="middle">M</text>
          <circle cx="100" cy="128" r="5" fill="#3b82f6" stroke="#93c5fd" strokeWidth="0.5" /> <text x="100" y="130" fontSize="6" fill="white" fontWeight="900" textAnchor="middle">S</text>
          <circle cx="72" cy="100" r="5" fill="#10b981" stroke="#a7f3d0" strokeWidth="0.5" /> <text x="72" y="102" fontSize="5" fill="white" fontWeight="900" textAnchor="middle">H1</text>
          <circle cx="128" cy="100" r="5" fill="#10b981" stroke="#a7f3d0" strokeWidth="0.5" /> <text x="128" y="102" fontSize="5" fill="white" fontWeight="900" textAnchor="middle">H2</text>
          <circle cx="80" cy="80" r="5" fill="#ef4444" stroke="#fca5a5" strokeWidth="0.5" /> <text x="80" y="82" fontSize="6" fill="white" fontWeight="900" textAnchor="middle">3</text>
          <circle cx="120" cy="80" r="5" fill="#ef4444" stroke="#fca5a5" strokeWidth="0.5" /> <text x="120" y="82" fontSize="6" fill="white" fontWeight="900" textAnchor="middle">4</text>
          <circle cx="80" cy="120" r="5" fill="#ef4444" stroke="#fca5a5" strokeWidth="0.5" /> <text x="80" y="122" fontSize="6" fill="white" fontWeight="900" textAnchor="middle">1</text>
          <circle cx="120" cy="120" r="5" fill="#ef4444" stroke="#fca5a5" strokeWidth="0.5" /> <text x="120" y="122" fontSize="6" fill="white" fontWeight="900" textAnchor="middle">2</text>
        </>
      )}
    </svg>
  );
}

function LariatDetailedMap({ activeMapTab }: { activeMapTab: string }) {
  // Renders the detailed view of individual map choice
  const isFire = activeMapTab.startsWith('fire');
  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-[280px] aspect-square rounded-2xl border border-neutral-800 shadow-2xl bg-[#281c15]">
      <circle cx="200" cy="200" r="180" fill="none" stroke="#cca470" strokeWidth="2" strokeOpacity="0.15" />
      <circle cx="200" cy="200" r="140" fill="none" stroke="#cca470" strokeWidth="1.5" strokeOpacity="0.2" />
      <circle cx="200" cy="200" r="80" fill="none" stroke="#cca470" strokeWidth="1.5" strokeOpacity="0.25" />
      
      {isFire && (
        <>
          <circle cx="200" cy="200" r="170" fill="none" stroke="#f97316" strokeWidth="30" strokeOpacity="0.25" />
          <circle cx="200" cy="200" r="150" fill="none" stroke="#f97316" strokeWidth="1.5" strokeOpacity="0.3" stroke-dasharray="3" />
        </>
      )}

      {/* Grid partitions */}
      <line x1="200" y1="10" x2="200" y2="390" stroke="#f43f5e" strokeWidth="2.5" strokeOpacity="0.5" stroke-dasharray="2" />
      <line x1="10" y1="200" x2="390" y2="200" stroke="#f43f5e" strokeWidth="2.5" strokeOpacity="0.5" stroke-dasharray="2" />
      {activeMapTab.endsWith('-8') && (
        <>
          <line x1="65" y1="65" x2="335" y2="335" stroke="#f43f5e" strokeWidth="1.5" strokeOpacity="0.25" stroke-dasharray="2" />
          <line x1="335" y1="65" x2="65" y2="335" stroke="#f43f5e" strokeWidth="1.5" strokeOpacity="0.25" stroke-dasharray="2" />
        </>
      )}

      {/* Shading safe divisions */}
      <polygon points="200,200 400,0 400,400" fill="#3b82f6" fillOpacity="0.04" />
      <polygon points="200,200 0,0 0,400" fill="#3b82f6" fillOpacity="0.04" />
      
      {/* Waymarks */}
      <g transform="translate(200, 110)">
        <circle r="16" fill="#ef4444" fillOpacity="0.15" stroke="#f87171" strokeWidth="1.5" />
        <text y="5" fontFamily="sans-serif" fontSize="14" fontWeight="900" fill="#fef08a" textAnchor="middle">A</text>
      </g>
      <g transform="translate(290, 200)">
        <circle r="16" fill="#eab308" fillOpacity="0.1" stroke="#facc15" stroke-width="1.5" />
        <text y="5" fontFamily="sans-serif" fontSize="14" fontWeight="900" fill="#fef08a" textAnchor="middle">B</text>
      </g>
      <g transform="translate(200, 290)">
        <circle r="16" fill="#3b82f6" fillOpacity="0.15" stroke="#60a5fa" stroke-width="1.5" />
        <text y="5" fontFamily="sans-serif" fontSize="14" fontWeight="900" fill="#dbeafe" textAnchor="middle">C</text>
      </g>
      <g transform="translate(110, 200)">
        <circle r="16" fill="#a855f7" fillOpacity="0.15" stroke="#c084fc" stroke-width="1.5" />
        <text y="5" fontFamily="sans-serif" fontSize="14" fontWeight="900" fill="#fae8ff" textAnchor="middle">D</text>
      </g>
      <g transform="translate(130, 130)">
        <rect x="-13" y="-13" width="26" height="26" rx="3" fill="#ef4444" fillOpacity="0.15" stroke="#f87171" stroke-width="1.5" />
        <text y="5" fontFamily="sans-serif" fontSize="14" fontWeight="900" fill="#fee2e2" textAnchor="middle">1</text>
      </g>
      <g transform="translate(270, 130)">
        <rect x="-13" y="-13" width="26" height="26" rx="3" fill="#eab308" fillOpacity="0.1" stroke="#facc15" stroke-width="1.5" />
        <text y="5" fontFamily="sans-serif" fontSize="14" fontWeight="900" fill="#fef9c3" textAnchor="middle">2</text>
      </g>
      <g transform="translate(270, 270)">
        <rect x="-13" y="-13" width="26" height="26" rx="3" fill="#3b82f6" fillOpacity="0.15" stroke="#60a5fa" stroke-width="1.5" />
        <text y="5" fontFamily="sans-serif" fontSize="14" fontWeight="900" fill="#dbeafe" textAnchor="middle">3</text>
      </g>
      <g transform="translate(130, 270)">
        <rect x="-13" y="-13" width="26" height="26" rx="3" fill="#a855f7" fillOpacity="0.15" stroke="#c084fc" stroke-width="1.5" />
        <text y="5" fontFamily="sans-serif" fontSize="14" fontWeight="900" fill="#fae8ff" textAnchor="middle">4</text>
      </g>

      {/* Render detailed player dot groups */}
      {activeMapTab === 'no-fire-4' && (
        <>
          {/* NW Pair */}
          <circle cx="106" cy="98" r="10" fill="#3b82f6" stroke="#93c5fd" strokeWidth="1" /> <text x="106" y="102" fontSize="10" fill="white" fontWeight="900" textAnchor="middle">M</text>
          <circle cx="102" cy="132" r="10" fill="#10b981" stroke="#a7f3d0" strokeWidth="1" /> <text x="102" y="136" fontSize="9" fill="white" fontWeight="900" textAnchor="middle">H1</text>
          <circle cx="134" cy="110" r="10" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" /> <text x="134" y="114" fontSize="10" fill="white" fontWeight="900" textAnchor="middle">3</text>
          {/* NE Pair */}
          <circle cx="295" cy="110" r="10" fill="#10b981" stroke="#a7f3d0" strokeWidth="1" /> <text x="295" y="114" fontSize="9" fill="white" fontWeight="900" textAnchor="middle">H2</text>
          <circle cx="266" cy="130" r="10" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" /> <text x="266" y="134" fontSize="10" fill="white" fontWeight="900" textAnchor="middle">4</text>
          {/* SW Pair */}
          <circle cx="105" cy="290" r="10" fill="#10b981" stroke="#a7f3d0" strokeWidth="1" /> <text x="105" y="294" fontSize="9" fill="white" fontWeight="900" textAnchor="middle">H1</text>
          <circle cx="130" cy="266" r="10" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" /> <text x="130" y="270" fontSize="10" fill="white" fontWeight="900" textAnchor="middle">1</text>
          {/* SE Pair */}
          <circle cx="270" cy="296" r="10" fill="#3b82f6" stroke="#93c5fd" strokeWidth="1" /> <text x="270" y="300" fontSize="10" fill="white" fontWeight="900" textAnchor="middle">S</text>
          <circle cx="295" cy="265" r="10" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" /> <text x="295" y="269" fontSize="10" fill="white" fontWeight="900" textAnchor="middle">2</text>
        </>
      )}

      {activeMapTab === 'no-fire-8' && (
        <>
          <circle cx="200" cy="70" r="10" fill="#3b82f6" stroke="#93c5fd" strokeWidth="1" /> <text x="200" y="74" fontSize="10" fill="white" fontWeight="900" textAnchor="middle">M</text>
          <circle cx="200" cy="330" r="10" fill="#3b82f6" stroke="#93c5fd" strokeWidth="1" /> <text x="200" y="334" fontSize="10" fill="white" fontWeight="900" textAnchor="middle">S</text>
          <circle cx="70" cy="200" r="10" fill="#10b981" stroke="#a7f3d0" strokeWidth="1" /> <text x="70" y="204" fontSize="9" fill="white" fontWeight="900" textAnchor="middle">H1</text>
          <circle cx="330" cy="200" r="10" fill="#10b981" stroke="#a7f3d0" strokeWidth="1" /> <text x="330" y="204" fontSize="9" fill="white" fontWeight="900" textAnchor="middle">H2</text>
          <circle cx="108" cy="108" r="10" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" /> <text x="108" y="112" fontSize="10" fill="white" fontWeight="900" textAnchor="middle">3</text>
          <circle cx="292" cy="108" r="10" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" /> <text x="292" y="112" fontSize="10" fill="white" fontWeight="900" textAnchor="middle">4</text>
          <circle cx="108" cy="292" r="10" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" /> <text x="108" y="292" fontSize="10" fill="white" fontWeight="900" textAnchor="middle">1</text>
          <circle cx="292" cy="292" r="10" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" /> <text x="292" y="296" fontSize="10" fill="white" fontWeight="900" textAnchor="middle">2</text>
        </>
      )}

      {activeMapTab === 'fire-4' && (
        <>
          <circle cx="140" cy="120" r="10" fill="#3b82f6" stroke="#93c5fd" strokeWidth="1" /> <text x="140" y="124" fontSize="10" fill="white" fontWeight="900" textAnchor="middle">M</text>
          <circle cx="130" cy="145" r="10" fill="#10b981" stroke="#a7f3d0" strokeWidth="1" /> <text x="130" y="149" fontSize="9" fill="white" fontWeight="900" textAnchor="middle">H1</text>
          <circle cx="160" cy="135" r="10" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" /> <text x="160" y="139" fontSize="10" fill="white" fontWeight="900" textAnchor="middle">3</text>
          <circle cx="270" cy="130" r="10" fill="#10b981" stroke="#a7f3d0" strokeWidth="1" /> <text x="270" y="134" fontSize="9" fill="white" fontWeight="900" textAnchor="middle">H2</text>
          <circle cx="245" cy="148" r="10" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" /> <text x="245" y="152" fontSize="10" fill="white" fontWeight="900" textAnchor="middle">4</text>
          <circle cx="132" cy="265" r="10" fill="#10b981" stroke="#a7f3d0" strokeWidth="1" /> <text x="132" y="269" fontSize="9" fill="white" fontWeight="900" textAnchor="middle">H1</text>
          <circle cx="155" cy="245" r="10" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" /> <text x="155" y="249" fontSize="10" fill="white" fontWeight="900" textAnchor="middle">1</text>
          <circle cx="260" cy="265" r="10" fill="#3b82f6" stroke="#93c5fd" strokeWidth="1" /> <text x="260" y="269" fontSize="10" fill="white" fontWeight="900" textAnchor="middle">S</text>
          <circle cx="275" cy="242" r="10" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" /> <text x="275" y="246" fontSize="10" fill="white" fontWeight="900" textAnchor="middle">2</text>
        </>
      )}

      {activeMapTab === 'fire-8' && (
        <>
          <circle cx="200" cy="140" r="10" fill="#3b82f6" stroke="#93c5fd" strokeWidth="1" /> <text x="200" y="144" fontSize="10" fill="white" fontWeight="900" textAnchor="middle">M</text>
          <circle cx="200" cy="260" r="10" fill="#3b82f6" stroke="#93c5fd" strokeWidth="1" /> <text x="200" y="264" fontSize="10" fill="white" fontWeight="900" textAnchor="middle">S</text>
          <circle cx="140" cy="200" r="10" fill="#10b981" stroke="#a7f3d0" strokeWidth="1" /> <text x="140" y="204" fontSize="9" fill="white" fontWeight="900" textAnchor="middle">H1</text>
          <circle cx="260" cy="200" r="10" fill="#10b981" stroke="#a7f3d0" strokeWidth="1" /> <text x="260" y="204" fontSize="9" fill="white" fontWeight="900" textAnchor="middle">H2</text>
          <circle cx="158" cy="158" r="10" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" /> <text x="158" y="162" fontSize="10" fill="white" fontWeight="900" textAnchor="middle">3</text>
          <circle cx="242" cy="158" r="10" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" /> <text x="242" y="162" fontSize="10" fill="white" fontWeight="900" textAnchor="middle">4</text>
          <circle cx="158" cy="258" r="10" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" /> <text x="158" y="258" fontSize="10" fill="white" fontWeight="900" textAnchor="middle">1</text>
          <circle cx="242" cy="258" r="10" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" /> <text x="242" y="262" fontSize="10" fill="white" fontWeight="900" textAnchor="middle">2</text>
        </>
      )}
    </svg>
  );
}
