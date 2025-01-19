const { default: Image } = require("next/image");
const { default: Link } = require("next/link");

const cardData = [
    { id: 1, title: "Tensei Kizoku no Isekai Boukenroku เกิดใหม่เป็นขุนนางไปผจญภัยในต่างโลก", image: "/images/tensei-kizoku-no-isekai-boukenroku-jichou-wo-shiranai-kamigami-no-shito/bg.webp" },
  ];

const CardComponent = () => {
  return (
    <Link className="shadow-lg overflow-hidden" href={"/"}>
      <Image
        width={187}
        height={268}
        src={cardData[0].image}
        alt={cardData[0].title}
        className="h-full w-auto object-cover"
        loading="lazy"
      />
      <div className="py-4">
        <h2 className="text-lg font-semibold text-white">{cardData[0].title}</h2>
      </div>
    </Link>
  );
};

export default CardComponent;
