import { ChevronRightIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

const MobileMenubarComponent = ({menuItems, isShowMenu = false}) => {
    return (
        <div className={clsx(isShowMenu === false? "hidden": "relative w-full bg-gray-900")}>
            <ul className="w-full">
            {menuItems.map(item=>{
                return(
                    <li key={item.id} className="flex items-center justify-between py-2 px-4 border-b border-gray-700 hover:border-gray-800">{item.name}<ChevronRightIcon className="size-6 text-white" /></li>
                )
            })}
            </ul>
        </div>
    )
}

export default MobileMenubarComponent;