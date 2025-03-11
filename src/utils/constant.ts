export const MOCK_IMGS = [
  "https://www.cnaeit.com/images/right.jpg",
  "https://img.zjol.com.cn/mlf/dzw/zjczw/gun/202004/W020200423648511266629.jpg",
  "https://www.cnaeit.com/images/top1.jpg",
  "https://img1.qunarzz.com/travel/poi/201303/13/fa751c0c58a1f427ddb12cfb.jpg_r_1024x683x95_456d4c10.jpg",
  "https://p4.itc.cn/q_70/images03/20220502/456e4818d82343d6b9897a0ece5a3f98.jpeg"
];

export const MOCK_SENTRY_DATA = [
  {
    "deviceId": "shaobing01",
    "longitude": 120.81254083604935,
    "latitude": 30.81521177420432,
    "battery": 30, 
    "exceptionFlag":"正常",
    "warnRecord":{     
       "imageUrl": MOCK_IMGS[0],
       "warnDatatime":"2024-03-08 13:56:23",
       "classes": ["人", "车"]
    }
  },
  {
    "deviceId": "shaobing02",
    "longitude": 120.82231261839067,
    "latitude": 30.79882127970634,
    "battery": 20, 
    "exceptionFlag":"异常",
    "warnRecord":{     
       "imageUrl": MOCK_IMGS[1],
       "warnDatatime":"2024-03-08 13:56:23",
       "classes": ["人"]
    }
  },
  {
    "deviceId": "shaobing03",
    "longitude": 120.83790388201463,
    "latitude": 30.810174587656505,
    "battery": 60, 
    "exceptionFlag":"正常",
    "warnRecord":{     
       "imageUrl": MOCK_IMGS[2],
       "warnDatatime":"2024-03-08 13:56:23",
       "classes": ["人", "车"]
    }
  },
  {
    "deviceId": "shaobing04",
    "longitude": 120.83828811095194,
    "latitude": 30.795529963494868, 
    "battery": 70, 
    "exceptionFlag":"正常",
    "warnRecord":{     
       "imageUrl": MOCK_IMGS[3],
       "warnDatatime":"2024-03-08 13:56:23",
       "classes": ["人"]
    }
  },
  {
    "deviceId": "shaobing05",
    "longitude": 120.85401100569823,
    "latitude": 30.805436136880093,
    "battery": 100, 
    "exceptionFlag":"异常",
    "warnRecord":{     
       "imageUrl": MOCK_IMGS[4],
       "warnDatatime":"2024-03-08 13:56:23",
       "classes": ["车"]
    }
  }
];

export const SENTRY_CLASSES_COLOR_MAP: Record<string, string> = {
  "人": "red",
  "车": "orange"
};


export const SYSTEM_COLOR_MAP = {
  primary: "#3f6600",
  borderPrimary: "#3f6600",
  activePrimary: "#254000",
  hoverPrimary: "#7cb305",
  bgPrimary: "#f6ffed",
  secondary: "#6c757d",
  success: "#28a745",
  danger: "#dc3545",
  warning: "#ffc107",
  info: "#17a2b8",
  light: "#f8f9fa",
  dark: "#343a40",
  white: "#fff",
  black: "#000",
  bg: "#f6f6f6",
};