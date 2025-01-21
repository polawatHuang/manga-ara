const { default: Image } = require("next/image");
const { default: Link } = require("next/link");

const CardComponent = ({manga}) => {
  return (
    <Link className="w-full h-auto overflow-hidden" href={manga.slug}>
      <Image
        width={187}
        height={268}
        src={manga.backgroundImage}
        alt={manga.name}
        className="h-[300px] w-full object-cover"
        loading="lazy"
      />
      <div className="py-4">
        <h2 className="text-lg font-semibold text-white text-ellipsis line-clamp-3">{manga.name}</h2>
      </div>
    </Link>
  );
};

export default CardComponent;
