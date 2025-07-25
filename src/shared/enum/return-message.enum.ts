export enum ReturnMessage {
    SUCCESS = 'สำเร็จ',
    NOT_FOUND = 'ไม่พบข้อมูล',
    DUPLICATE_USERNAME = 'มีชื่อผู้ใช้นี้ในระบบแล้ว',
    INVALID_ROLE = 'ตำแหน่งผู้ใช้ไม่ถูกต้อง',
    ERROR = "ข้อผิดพลาด",
    REQUIRED = "จำเป็นต้องระบุ",
    NOT_REQUIRED = "ไม่จำเป็นต้องระบุ",
    CUSTOMER_NOT_FOUND = "ไม่พบลูกค้า",
    TECHNICIAN_NOT_FOUND = "ไม่พบช่างเทคนิค",
    INSTALLATION_NOT_FOUND = "ไม่พบการติดตั้ง",
    MAINTENANCE_NOT_FOUND = "ไม่พบการบำรุงรักษา",
}