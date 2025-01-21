const AdvertiseComponent = ({adItems}) => {
    adItems = [{id: 1, img: "/images/test.png", name: "test"}, {id: 2, img: "/images/test.png", name: "test"}]
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-[60px]">
            {adItems.map(item=>{return(<div key={item.id} className="h-[140px] bg-green-800 flex flex-col items-center justify-center"><span className="text-5xl opacity-[0.5]">พื้นที่โฆษณา</span><span className="opacity-[0.5] text-center">678 px * 140 px (สนใจโฆษณา email: kaitolovemiku@hotmail.com)</span></div>)})}
        </div>
    )
}

export default AdvertiseComponent

