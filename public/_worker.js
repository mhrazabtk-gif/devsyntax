const redirectMap = {
  "/9wiyjq2z": "https://datastudio.google.com/reporting/59aad0b0-25ba-4049-8c03-bd0ea03dce49",
  "/i5ez7ba9": "https://datastudio.google.com/reporting/59aca455-b48a-4f54-ab37-dd055e15171a",
  "/6a7ym92q": "https://datastudio.google.com/reporting/59ad7320-f426-41f8-a2d1-c33ab8910e23",
  "/wjvnmy4w": "https://datastudio.google.com/reporting/59aedbf2-8662-4420-bc0e-72eb10d04fd9",
  "/zia22yaw": "https://datastudio.google.com/reporting/59b86fee-c8b6-4fa2-96f2-2281eeb27492"
  // 
};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const target = redirectMap[url.pathname];
    
    if (target) {
      return Response.redirect(target, 301);
    }
    
    // 
    return fetch(request);
  },
};
