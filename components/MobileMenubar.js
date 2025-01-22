"use client";

import { ChevronRightIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { goToRandomManga } from "@/utils/randomManga";

const MobileMenubarComponent = ({ menuItems, isShowMenu = false, toggleMenu }) => {
  const router = useRouter();

  return (
    <div className={clsx("w-full bg-gray-900 transition-all", { hidden: !isShowMenu })}>
      <ul className="w-full">
        {menuItems.map((item) => (
          <li key={item.id} className="border-b border-gray-700 hover:bg-gray-800">
            {item.name === "สุ่มเลือกอ่านมังงะ" ? (
              <button
                className="flex items-center justify-between w-full py-2 px-4 text-left text-white"
                onClick={() => {
                  goToRandomManga(router);
                  toggleMenu(); // Close menu after clicking
                }}
              >
                {item.name}
                <ChevronRightIcon className="size-6 text-white" />
              </button>
            ) : (
              <Link
                href={item.href}
                className="flex items-center justify-between w-full py-2 px-4 text-white hover:no-underline"
                onClick={toggleMenu} // Close menu after clicking
              >
                {item.name}
                <ChevronRightIcon className="size-6 text-white" />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MobileMenubarComponent;