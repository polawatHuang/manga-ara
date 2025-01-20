import tags from "./tags";

const mangas = [
  {
    id: 1,
    name: "Tensei Kizoku no Isekai Boukenroku เกิดใหม่เป็นขุนนางไปผจญภัยในต่างโลก",
    description:
      "หนุ่มญี่ปุ่นคนหนึ่งเสียชีวิตแล้วเกิดใหม่เป็นบุตรชายคนสุดท้องของตระกูลขุนนางในโลกแฟนตาซี เขาได้รับพรจากเทพเจ้าหลายองค์ ทำให้มีพลังวิเศษเหนือคนอื่น แต่ก็พยายามใช้ชีวิตอย่างเรียบง่าย ขณะเดียวกันก็ต้องเผชิญหน้ากับการผจญภัยและภารกิจต่างๆ ที่คาดไม่ถึง",
    ep: [
      { episode: "1", totalPage: 41, created_date: "2025-01-01" },
      { episode: "2", totalPage: 41, created_date: "2025-01-02" },
    ],
    tag: tags
      .filter((item) => ["ผจญภัย", "ต่อสู้"].includes(item.name))
      .map((item) => item.name),
    view: 100,
    backgroundImage:
      "/images/tensei-kizoku-no-isekai-boukenroku-jichou-wo-shiranai-kamigami-no-shito/bg.webp",
    slug: "/tensei-kizoku-no-isekai-boukenroku-jichou-wo-shiranai-kamigami-no-shito",
    created_date: "2025-01-01",
    updated_date: "2025-01-02",
  },
];

export default mangas;
